"use client"

import { useState, type FormEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CheckIcon, SaveIcon, SendIcon, Trash2Icon, UploadIcon, XIcon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { Input } from "@/components/input/Input"
import { Textarea } from "@/components/input/Textarea"
import { http } from "@/libs/http"
import { useAdminMutationToast } from "@/hooks/admin"
import { AdminListItem } from "@/components/general/AdminListItem"

export type ModerationFeedback = {
  id: string
  message: string
  linkedinUrl?: string
  submittedAt: string
  status: "pending" | "approved" | "published" | "rejected" | "archived" | "redacted"
  editorial?: { displayName: string; role?: string; company?: string; publicMessage: string }
  avatarUrl?: string
  companyImageUrl?: string
}

type AdminFeedbackPanelProps = {
  initialFeedbacks: ModerationFeedback[]
  canModerate: boolean
}

type FeedbackStatus = ModerationFeedback["status"]
type FileKind = "profile" | "company"

const editable = (status: FeedbackStatus) => ["pending", "approved", "published", "archived"].includes(status)
const hasMedia = (status: FeedbackStatus) => ["approved", "published", "archived"].includes(status)

export const AdminFeedbackPanel = ({ initialFeedbacks, canModerate }: AdminFeedbackPanelProps) => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()
  const [selectedId, setSelectedId] = useState<string | undefined>(initialFeedbacks[0]?.id)
  const feedbackQuery = useQuery({
    queryKey: ["admin-feedbacks"],
    queryFn: async () => (await http.get<ModerationFeedback[]>("api/admin/feedbacks")).data,
    initialData: initialFeedbacks,
  })
  const feedbacks = feedbackQuery.data
  const selected = feedbacks.find((feedback) => feedback.id === selectedId) ?? feedbacks[0]

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-feedbacks"] })
  const mutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: unknown }) => (await http.patch(`api/admin/feedbacks/${id}`, body)).data,
    onSuccess: async () => {
      await invalidate()
      adminToast.success("AdminSaveSuccess")
    },
    onError: () => adminToast.error("AdminSaveError"),
  })
  const uploadMutation = useMutation({
    mutationFn: async ({ id, file, kind }: { id: string; file: File; kind: FileKind }) => {
      const form = new FormData()
      form.set("feedbackId", id)
      form.set("avatar", file)
      form.set("kind", kind)

      return (await http.post("api/admin/media/feedback-avatar", form, { headers: { "Content-Type": undefined } })).data
    },
    onSuccess: async () => {
      await invalidate()
      adminToast.success("AdminUploadSuccess")
    },
    onError: () => adminToast.error("AdminUploadError"),
  })
  const saveMutation = useMutation({
    mutationFn: async ({ id, status, editorial, profileFile, companyFile }: {
      id: string
      status: FeedbackStatus
      editorial: ModerationFeedback["editorial"]
      profileFile: File | null
      companyFile: File | null
    }) => {
      await http.patch(`api/admin/feedbacks/${id}`, { status, editorial })

      for (const [kind, file] of [["profile", profileFile], ["company", companyFile]] as const) {
        if (!file) continue
        const media = new FormData()
        media.set("feedbackId", id)
        media.set("avatar", file)
        media.set("kind", kind)
        await http.post("api/admin/media/feedback-avatar", media, { headers: { "Content-Type": undefined } })
      }
    },
    onSuccess: async () => {
      await invalidate()
      adminToast.success("AdminSaveSuccess")
    },
    onError: () => adminToast.error("AdminSaveError"),
  })
  const removeAvatarMutation = useMutation({
    mutationFn: async ({ id, kind }: { id: string; kind: FileKind }) =>
      http.delete("api/admin/media/feedback-avatar", { data: { feedbackId: id, kind } }),
    onSuccess: async () => {
      await invalidate()
      adminToast.success("AdminRemoveSuccess")
    },
    onError: () => adminToast.error("AdminRemoveError"),
  })
  const removeFeedbackMutation = useMutation({
    mutationFn: async (id: string) => http.delete(`api/admin/feedbacks/${id}`),
    onSuccess: async () => {
      setSelectedId(undefined)
      await invalidate()
      adminToast.success("AdminRemoveSuccess")
    },
    onError: () => adminToast.error("AdminRemoveError"),
  })

  const getEditorial = (form: HTMLFormElement) => {
    const data = new FormData(form)

    return {
      displayName: String(data.get("displayName") ?? ""),
      role: String(data.get("role") ?? "") || undefined,
      company: String(data.get("company") ?? "") || undefined,
      publicMessage: String(data.get("publicMessage") ?? ""),
    }
  }

  const getStatus = (form: HTMLFormElement): FeedbackStatus =>
    String(new FormData(form).get("status")) as FeedbackStatus

  const submit = (form: HTMLFormElement, status = getStatus(form), includeSelectedImages = false) => {
    if (!selected) return
    const editorial = getEditorial(form)

    if (includeSelectedImages) {
      const data = new FormData(form)
      const profile = data.get("profileImage")
      const company = data.get("companyImage")
      saveMutation.mutate({
        id: selected.id,
        status,
        editorial,
        profileFile: profile instanceof File && profile.size ? profile : null,
        companyFile: company instanceof File && company.size ? company : null,
      })
      return
    }

    mutation.mutate({ id: selected.id, body: status === "rejected" ? { status } : { status, editorial } })
  }

  const renderList = (items: ModerationFeedback[], empty: string) => items.length ? (
    <div className=" grid gap-2">
      {items.map((feedback) => (
        <AdminListItem
          key={feedback.id}
          title={feedback.editorial?.displayName ?? "Relato sem edição"}
          description={`${feedback.message.slice(0, 90)}${feedback.message.length > 90 ? "…" : ""}`}
          status={feedback.status === "archived" ? "Arquivado" : feedback.status}
          selected={selected?.id === feedback.id}
          onSelect={() => setSelectedId(feedback.id)}
        />
      ))}
    </div>
  ) : <p className="mt-2 text-sm text-ud-secondary-600">{empty}</p>

  const pendingFeedbacks = feedbacks.filter((feedback) => feedback.status === "pending")
  const managedFeedbacks = feedbacks.filter((feedback) => !["pending", "rejected", "redacted"].includes(feedback.status))

  return (
    <section className="mt-8">
      <div>
        <h2 className="text-xl font-bold text-ud-neutral-950">Feedbacks pendentes de aprovação</h2>
        {renderList(pendingFeedbacks, "Não há feedbacks aguardando aprovação.")}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Outros feedbacks</h2>
        <p className="mt-1 text-sm text-ud-secondary-600">Revise o conteúdo público e o status editorial dos relatos.</p>
      </div>

      {selected && <form key={selected.id} className="mt-4 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4" onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        submit(event.currentTarget)
      }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-ud-neutral-950">Editar relato selecionado</h2>
            {selected.status === "archived" && <span className="mt-2 inline-flex rounded-sm border border-ud-neutral-300 px-2 py-1 text-xs font-bold text-ud-secondary-600">Arquivado</span>}
          </div>
          <span className="text-xs text-ud-secondary-600">{new Date(selected.submittedAt).toLocaleDateString("pt-BR")}</span>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm text-ud-neutral-950">{selected.message}</p>
        {selected.linkedinUrl && <a className="mt-2 block text-sm text-ud-auxiliary-purple underline" href={selected.linkedinUrl} target="_blank" rel="noreferrer">Abrir LinkedIn informado</a>}

        {canModerate && <>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Input required name="displayName" label="Nome público" defaultValue={selected.editorial?.displayName} />
            <Input name="role" label="Cargo" defaultValue={selected.editorial?.role} />
            <Input name="company" label="Empresa" defaultValue={selected.editorial?.company} />
          </div>
          <label className="mt-3 block text-sm font-bold text-ud-neutral-950">Mensagem pública
            <Textarea required name="publicMessage" minLength={1} maxLength={1500} defaultValue={selected.editorial?.publicMessage ?? selected.message} className="mt-1" />
          </label>
          <label className="mt-3 block text-sm text-ud-neutral-950">
            Status
            <select name="status" defaultValue={selected.status} className="mt-1 block w-full border border-ud-neutral-300 bg-white p-2 text-sm">
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="published">Publicado</option>
              <option value="rejected">Rejeitado</option>
              <option value="archived">Arquivado</option>
              <option value="redacted">Redigido</option>
            </select>
          </label>

          {hasMedia(selected.status) && <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="flex items-end gap-2"><Input name="profileImage" type="file" accept="image/jpeg,image/png,image/webp" label="Avatar" inputClassName="cursor-pointer" /><Button type="button" startAdornment={<UploadIcon size={15} />} loading={{ verb: "Enviando", state: uploadMutation.isPending && uploadMutation.variables?.id === selected.id && uploadMutation.variables.kind === "profile" }} onClick={(event) => { const file = new FormData(event.currentTarget.closest("form")!).get("profileImage"); if (file instanceof File && file.size) uploadMutation.mutate({ id: selected.id, file, kind: "profile" }) }}>Enviar avatar</Button></div>
            <div className="flex items-end gap-2"><Input name="companyImage" type="file" accept="image/jpeg,image/png,image/webp" label="Imagem da empresa" inputClassName="cursor-pointer" /><Button type="button" startAdornment={<UploadIcon size={15} />} loading={{ verb: "Enviando", state: uploadMutation.isPending && uploadMutation.variables?.id === selected.id && uploadMutation.variables.kind === "company" }} onClick={(event) => { const file = new FormData(event.currentTarget.closest("form")!).get("companyImage"); if (file instanceof File && file.size) uploadMutation.mutate({ id: selected.id, file, kind: "company" }) }}>Enviar imagem</Button></div>
            {selected.avatarUrl && <div className="flex items-center gap-2"><img src={selected.avatarUrl} alt="Avatar do relato" className="h-10 w-10 rounded-full object-cover" /><Button type="button" onClick={() => removeAvatarMutation.mutate({ id: selected.id, kind: "profile" })}>Remover avatar</Button></div>}
            {selected.companyImageUrl && <div className="flex items-center gap-2"><img src={selected.companyImageUrl} alt="Logo da empresa" className="h-10 w-10 rounded object-cover" /><Button type="button" onClick={() => removeAvatarMutation.mutate({ id: selected.id, kind: "company" })}>Remover imagem</Button></div>}
          </div>}

          <div className="mt-4 flex flex-wrap gap-2">
            {editable(selected.status) && <Button type="button" startAdornment={<SaveIcon size={15} />} loading={{ verb: "Salvando", state: saveMutation.isPending && saveMutation.variables?.id === selected.id }} onClick={(event) => { const form = event.currentTarget.closest("form"); if (form) submit(form, undefined, true) }}>Salvar alterações</Button>}
            {selected.status === "pending" && <Button type="submit" startAdornment={<CheckIcon size={15} />} loading={{ verb: "Aprovando", state: mutation.isPending && mutation.variables?.id === selected.id && (mutation.variables.body as { status: string }).status === "approved" }}>Aprovar</Button>}
            {selected.status === "approved" && <Button type="button" highlight startAdornment={<SendIcon size={15} />} loading={{ verb: "Publicando", state: mutation.isPending && mutation.variables?.id === selected.id && (mutation.variables.body as { status: string }).status === "published" }} onClick={(event) => { const form = event.currentTarget.closest("form"); if (form) submit(form, "published") }}>Publicar</Button>}
            {selected.status === "pending" && <Button type="button" startAdornment={<XIcon size={15} />} loading={{ verb: "Rejeitando", state: mutation.isPending && mutation.variables?.id === selected.id && (mutation.variables.body as { status: string }).status === "rejected" }} onClick={(event) => { const form = event.currentTarget.closest("form"); if (form) submit(form, "rejected") }}>Rejeitar</Button>}
            {selected.status === "published" && <Button type="button" loading={{ verb: "Arquivando", state: mutation.isPending && mutation.variables?.id === selected.id && (mutation.variables.body as { status: string }).status === "archived" }} onClick={(event) => { const form = event.currentTarget.closest("form"); if (form) submit(form, "archived") }}>Arquivar</Button>}
            {["published", "archived", "redacted"].includes(selected.status) && <Button type="button" startAdornment={<Trash2Icon size={15} />} loading={{ verb: "Removendo", state: removeFeedbackMutation.isPending && removeFeedbackMutation.variables === selected.id }} onClick={() => removeFeedbackMutation.mutate(selected.id)}>Remover</Button>}
          </div>
        </>}
      </form>}
      <div className="mt-4">
        {renderList(managedFeedbacks, "Não há outros feedbacks para gerenciar.")}
      </div>
    </section>
  )
}
