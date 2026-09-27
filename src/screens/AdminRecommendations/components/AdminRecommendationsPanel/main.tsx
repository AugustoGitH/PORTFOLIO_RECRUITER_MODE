"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Trash2Icon, UploadIcon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { Input } from "@/components/input/Input"
import { Textarea } from "@/components/input/Textarea"
import { http } from "@/libs/http"
import { useAdminMutationToast } from "@/hooks/admin"
import { AdminListItem } from "@/components/general/AdminListItem"

type Recommendation = {
  _id: string
  slug: string
  status: "draft" | "published" | "paused" | "archived"
  displayName: string
  headline: string
  seniority: "junior" | "mid-level" | "senior"
  roleKinds: string[]
  skills: string[]
  summary?: string
  availability?: string
  contact: { label: string; url: string }
  avatarUrl?: string
  editorialPriority: number
  consent: { grantedAt: string; confirmedAt: string; version: string }
}

const formValues = (form: HTMLFormElement, editing?: Recommendation) => {
  const data = new FormData(form)
  const list = (name: string) => String(data.get(name)).split(",").map((value) => value.trim()).filter(Boolean)

  return {
    slug: String(data.get("slug")),
    status: String(data.get("status")),
    displayName: String(data.get("displayName")),
    headline: String(data.get("headline")),
    seniority: String(data.get("seniority")),
    roleKinds: list("roleKinds"),
    skills: list("skills"),
    summary: String(data.get("summary")) || undefined,
    availability: String(data.get("availability")) || undefined,
    contact: { label: String(data.get("contactLabel")), url: String(data.get("contactUrl")) },
    editorialPriority: Number(data.get("editorialPriority") || 0),
    consent: editing?.consent ?? {
      grantedAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      version: "v1",
    },
  }
}

export const AdminRecommendationsPanel = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()
  const [editing, setEditing] = useState<Recommendation | undefined>()
  const query = useQuery({
    queryKey: ["admin-recommendations"],
    queryFn: async () => (await http.get<Recommendation[]>("api/admin/recommendations")).data,
  })
  const save = useMutation({
    mutationFn: async ({ id, body }: { id?: string; body: unknown }) =>
      id ? http.patch(`api/admin/recommendations/${id}`, body) : http.post("api/admin/recommendations", body),
    onSuccess: () => {
      setEditing(undefined)
      queryClient.invalidateQueries({ queryKey: ["admin-recommendations"] })
      adminToast.success("AdminSaveSuccess")
    },
    onError: () => adminToast.error("AdminSaveError"),
  })
  const uploadAvatar = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const form = new FormData()
      form.set("recommendationId", id)
      form.set("avatar", file)

      return http.post("api/admin/media/recommendation-avatar", form, { headers: { "Content-Type": undefined } })
    },
    onSuccess: (response) => {
      setEditing((current) => current ? { ...current, avatarUrl: response.data.publicUrl } : current)
      queryClient.invalidateQueries({ queryKey: ["admin-recommendations"] })
      adminToast.success("AdminUploadSuccess")
    },
    onError: () => adminToast.error("AdminUploadError"),
  })
  const removeAvatar = useMutation({
    mutationFn: async (id: string) => http.delete("api/admin/media/recommendation-avatar", { data: { recommendationId: id } }),
    onSuccess: () => {
      setEditing((current) => current ? { ...current, avatarUrl: undefined } : current)
      queryClient.invalidateQueries({ queryKey: ["admin-recommendations"] })
      adminToast.success("AdminRemoveSuccess")
    },
    onError: () => adminToast.error("AdminRemoveError"),
  })

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold">Indicações de desenvolvedores</h2>
      <p className="mt-1 text-sm text-ud-secondary-600">Cadastre apenas dados e links confirmados pela pessoa indicada.</p>

      <form key={editing?._id ?? "new"} className="mt-4 grid gap-3 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4" onSubmit={(event) => {
        event.preventDefault()
        save.mutate({ id: editing?._id, body: formValues(event.currentTarget, editing) })
      }}>
        <div className="grid gap-3 md:grid-cols-2">
          <Input name="slug" label="Slug" defaultValue={editing?.slug} required />
          <Input name="displayName" label="Nome público" defaultValue={editing?.displayName} required />
          <Input name="headline" label="Headline" defaultValue={editing?.headline} required />
          <Input name="seniority" label="Senioridade" defaultValue={editing?.seniority ?? "mid-level"} required />
          <Input name="roleKinds" label="Áreas (separadas por vírgula)" defaultValue={editing?.roleKinds.join(", ")} placeholder="frontend, backend" required />
          <Input name="skills" label="Skills (separadas por vírgula)" defaultValue={editing?.skills.join(", ")} required />
          <Input name="contactLabel" label="Rótulo do contato" defaultValue={editing?.contact.label} required />
          <Input name="contactUrl" label="URL de contato" type="url" defaultValue={editing?.contact.url} required />
          <Input name="editorialPriority" label="Prioridade editorial" type="number" defaultValue={editing?.editorialPriority ?? 0} required />
        </div>
        <Textarea name="summary" defaultValue={editing?.summary} placeholder="Resumo factual aprovado" />
        <Input name="availability" label="Disponibilidade (opcional)" defaultValue={editing?.availability} />
        {editing ? (
          <div className="flex flex-wrap items-end gap-2">
            <Input
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              label="Avatar consentido"
              inputClassName="cursor-pointer"
            />
            <Button
              type="button"
              startAdornment={<UploadIcon size={15} />}
              loading={{ verb: "Enviando", state: uploadAvatar.isPending && uploadAvatar.variables?.id === editing._id }}
              onClick={(event) => {
                const form = event.currentTarget.closest("form")
                const file = form ? new FormData(form).get("avatar") : null
                if (file instanceof File && file.size) uploadAvatar.mutate({ id: editing._id, file })
              }}
            >
              Enviar avatar
            </Button>
            {editing.avatarUrl && <>
              <img src={editing.avatarUrl} alt="Avatar da indicação" className="h-10 w-10 rounded-full object-cover" />
              <Button
                type="button"
                startAdornment={<Trash2Icon size={15} />}
                loading={{ verb: "Removendo", state: removeAvatar.isPending && removeAvatar.variables === editing._id }}
                onClick={() => removeAvatar.mutate(editing._id)}
              >
                Remover avatar
              </Button>
            </>}
          </div>
        ) : (
          <p className="text-xs text-ud-secondary-600">Salve a indicação primeiro para habilitar o envio do avatar consentido.</p>
        )}
        <select name="status" defaultValue={editing?.status ?? "draft"} className="border border-ud-neutral-300 bg-white p-2 text-sm">
          <option value="draft">Rascunho</option><option value="published">Publicado</option>
          <option value="paused">Pausado</option><option value="archived">Arquivado</option>
        </select>
        <div className="flex gap-2">
          <Button type="submit" highlight loading={{ verb: "Salvando", state: save.isPending }}>{editing ? "Salvar alterações" : "Criar indicação"}</Button>
          {editing && <Button type="button" onClick={() => setEditing(undefined)}>Cancelar</Button>}
        </div>
      </form>

      <div className="mt-4 grid gap-2">
        {query.data?.map((item) => (
          <AdminListItem
            key={item._id}
            title={item.displayName}
            description={item.headline}
            status={item.status}
            selected={editing?._id === item._id}
            onSelect={() => setEditing(item)}
          />
        ))}
      </div>
    </section>
  )
}
