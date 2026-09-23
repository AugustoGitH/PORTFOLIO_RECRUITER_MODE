"use client"

import { useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ImagePlusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { Input } from "@/components/input/Input"
import { Textarea } from "@/components/input/Textarea"
import { http } from "@/libs/http"
import { useAdminMutationToast } from "../hooks"
import { AdminListItem } from "../components/AdminListItem"
import { MarkdownEditor } from "./components/MarkdownEditor"
import type {
  BlogAdminData,
  BlogCategory,
  BlogImageUpload,
  BlogPost,
} from "./types"
import { getPostBody } from "./utils"

export const AdminBlogPanel = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()
  const [editing, setEditing] = useState<BlogPost | undefined>()
  const [editingCategory, setEditingCategory] = useState<BlogCategory | undefined>()
  const [markdown, setMarkdown] = useState("")
  const postFormRef = useRef<HTMLFormElement>(null)
  const categoryFormRef = useRef<HTMLFormElement>(null)

  const query = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => (await http.get<BlogAdminData>("api/admin/blog")).data,
  })

  const savePost = useMutation({
    mutationFn: ({ id, body }: { id?: string; body: unknown }) =>
      id
        ? http.patch<{ id: string }>(`api/admin/blog/${id}`, body)
        : http.post<{ id: string }>("api/admin/blog", body),
    onSuccess: async ({ data }, variables) => {
      if (!variables.id) postFormRef.current?.reset()
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] })
      const refreshed = queryClient.getQueryData<BlogAdminData>(["admin-blog"])
      const saved = refreshed?.posts.find((post) => post._id === data.id)

      if (saved) {
        setEditing(saved)
        setMarkdown(saved.markdown)
      }
      adminToast.success("AdminSaveSuccess")
    },
    onError: () => adminToast.error("AdminSaveError"),
  })

  const saveCategory = useMutation({
    mutationFn: ({ id, body }: { id?: string; body: unknown }) =>
      id
        ? http.patch(`api/admin/blog/categories/${id}`, body)
        : http.post("api/admin/blog/categories", body),
    onSuccess: async (_result, variables) => {
      if (!variables.id) categoryFormRef.current?.reset()
      setEditingCategory(undefined)
      await queryClient.refetchQueries({ queryKey: ["admin-blog"] })
      adminToast.success("AdminSaveSuccess")
    },
    onError: () => adminToast.error("AdminSaveError"),
  })

  const removePost = useMutation({
    mutationFn: (id: string) => http.delete(`api/admin/blog/${id}`),
    onSuccess: async () => {
      setEditing(undefined)
      setMarkdown("")
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] })
      adminToast.success("AdminRemoveSuccess")
    },
    onError: () => adminToast.error("AdminRemoveError"),
  })

  const removeCategory = useMutation({
    mutationFn: (id: string) => http.delete(`api/admin/blog/categories/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] })
      adminToast.success("AdminRemoveSuccess")
    },
    onError: () => adminToast.error("AdminRemoveError"),
  })

  const uploadImage = useMutation({
    mutationFn: ({ id, file, purpose }: { id: string; file: File; purpose: "content" | "cover" }) => {
      const form = new FormData()
      form.set("postId", id)
      form.set("image", file)
      form.set("purpose", purpose)

      return http.post<BlogImageUpload>("api/admin/media/blog-image", form, {
        headers: { "Content-Type": undefined },
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] })
      adminToast.success("AdminUploadSuccess")
    },
    onError: () => adminToast.error("AdminUploadError"),
  })

  const removeImage = useMutation({
    mutationFn: ({ postId, mediaId }: { postId: string; mediaId: string }) =>
      http.delete(`api/admin/blog/${postId}/images/${mediaId}`),
    onSuccess: async (_result, variables) => {
      setEditing((current) => current?._id === variables.postId
        ? {
            ...current,
            cover: current.cover?.id === variables.mediaId ? undefined : current.cover,
            media: current.media?.filter((media) => media.id !== variables.mediaId),
          }
        : current)
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] })
      adminToast.success("AdminRemoveSuccess")
    },
    onError: () => adminToast.error("AdminRemoveError"),
  })

  const categories = query.data?.categories ?? []
  const posts = query.data?.posts ?? []

  const selectPost = (post: BlogPost) => {
    setEditing(post)
    setMarkdown(post.markdown)
  }

  const startNewPost = () => {
    setEditing(undefined)
    setMarkdown("")
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-ud-neutral-950">Blog</h1>
      <p className="mt-1 text-sm text-ud-secondary-600">Crie, revise e publique textos editoriais em Markdown.</p>

      <section className="mt-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ud-neutral-950">{editing ? "Editar post" : "Novo post"}</h2>
            <p className="mt-1 text-sm text-ud-secondary-600">
              {editing ? `Editando “${editing.title}”.` : "Preencha os dados e salve o primeiro rascunho."}
            </p>
          </div>
          {editing && (
            <Button type="button" startAdornment={<PlusIcon size={15} />} onClick={startNewPost}>
              Novo post
            </Button>
          )}
        </div>

        <form
          ref={postFormRef}
          key={editing?._id ?? "new"}
          className="mt-4 grid gap-5 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-5"
          onSubmit={(event) => {
            event.preventDefault()
            savePost.mutate({
              id: editing?._id,
              body: {
                ...getPostBody(event.currentTarget),
                markdown,
              },
            })
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="title" label="Título" defaultValue={editing?.title} className="md:col-span-2" required />
            <Input
              name="subtitle"
              label="Subtítulo (opcional)"
              defaultValue={editing?.subtitle}
              description="Complementa o título na página do artigo. O resumo continua sendo usado nos cards."
              className="md:col-span-2"
              maxLength={220}
            />
            <Input name="slug" label="Slug" defaultValue={editing?.slug} required />
            <label className="block text-sm font-bold text-ud-neutral-950">
              Categoria <span aria-hidden="true">*</span>
              <select name="categoryId" defaultValue={editing?.categoryId ?? ""} required className="mt-1 block w-full rounded-sm border border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2 text-sm font-normal outline-none transition focus:border-ud-auxiliary-purple focus:ring-2 focus:ring-ud-auxiliary-purple/20">
                <option value="">Selecione uma categoria</option>
                {categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block text-sm font-bold text-ud-neutral-950 md:col-span-2">
              Resumo <span aria-hidden="true">*</span>
              <Textarea name="excerpt" defaultValue={editing?.excerpt} placeholder="Resumo curto apresentado na listagem pública" className="mt-1 min-h-24 font-normal" maxLength={320} required />
            </label>
            <label className="block text-sm font-bold text-ud-neutral-950">
              Status
              <select name="status" defaultValue={editing?.status ?? "draft"} className="mt-1 block w-full rounded-sm border border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2 text-sm font-normal outline-none transition focus:border-ud-auxiliary-purple focus:ring-2 focus:ring-ud-auxiliary-purple/20">
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </select>
            </label>
          </div>

          {editing ? (
            <div className="grid gap-4">
              <div className="rounded border border-ud-neutral-300 bg-ud-neutral-100 p-3">
                <div className="flex flex-wrap items-end gap-3">
                  {editing.cover ? (
                    <img
                      src={editing.cover.publicUrl}
                      alt={`Capa atual de ${editing.title}`}
                      className="h-24 w-40 rounded object-cover"
                    />
                  ) : null}
                  <Input
                    name="coverImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    label={editing.cover ? "Substituir imagem de capa" : "Imagem de capa"}
                    description="JPEG, PNG ou WebP de até 5 MB."
                    className="min-w-64 flex-1"
                    inputClassName="cursor-pointer bg-ud-neutral-0"
                  />
                  <Button
                    type="button"
                    className="mb-5 shrink-0"
                    startAdornment={<ImagePlusIcon size={15} />}
                    loading={{
                      verb: "Enviando",
                      state: uploadImage.isPending && uploadImage.variables?.purpose === "cover",
                    }}
                    onClick={(event) => {
                      const form = event.currentTarget.closest("form")
                      const file = form ? new FormData(form).get("coverImage") : null

                      if (file instanceof File && file.size) {
                        uploadImage.mutate({ id: editing._id, file, purpose: "cover" }, {
                          onSuccess: ({ data }) => setEditing((current) => current
                            ? {
                                ...current,
                                cover: {
                                  id: data.mediaId,
                                  publicUrl: data.publicUrl,
                                  width: data.width,
                                  height: data.height,
                                },
                              }
                            : current),
                        })
                      }
                    }}
                  >
                    {editing.cover ? "Substituir capa" : "Definir capa"}
                  </Button>
                  {editing.cover ? (
                    <Button
                      type="button"
                      className="mb-5 shrink-0"
                      startAdornment={<Trash2Icon size={14} />}
                      loading={{
                        verb: "Removendo",
                        state: removeImage.isPending && removeImage.variables?.mediaId === editing.cover.id,
                      }}
                      onClick={() => removeImage.mutate({
                        postId: editing._id,
                        mediaId: editing.cover!.id,
                      })}
                    >
                      Remover capa
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="rounded border border-ud-neutral-300 bg-ud-neutral-100 p-3">
                <div className="flex flex-wrap items-end gap-2">
                  <Input
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    label="Anexar imagem"
                    description="JPEG, PNG ou WebP. A imagem será inserida no final do Markdown."
                    className="min-w-64 flex-1"
                    inputClassName="cursor-pointer bg-ud-neutral-0"
                  />
                  <Button
                    type="button"
                    className="mb-5 shrink-0"
                    startAdornment={<ImagePlusIcon size={15} />}
                    loading={{
                      verb: "Enviando",
                      state: uploadImage.isPending && uploadImage.variables?.purpose === "content",
                    }}
                    onClick={(event) => {
                      const form = event.currentTarget.closest("form")
                      const file = form ? new FormData(form).get("image") : null

                      if (file instanceof File && file.size) {
                        uploadImage.mutate({ id: editing._id, file, purpose: "content" }, {
                          onSuccess: ({ data }) => {
                            setMarkdown((current) => `${current}\n\n![Imagem do post](${data.publicUrl})\n`)
                            setEditing((current) => current
                              ? {
                                  ...current,
                                  media: [
                                    ...(current.media ?? []),
                                    { id: data.mediaId, publicUrl: data.publicUrl },
                                  ],
                                }
                              : current)
                          },
                        })
                      }
                    }}
                  >
                    Inserir imagem
                  </Button>
                </div>

                {editing.media?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editing.media.map((media) => (
                      <div key={media.id} className="flex items-center gap-2 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-2">
                        <img src={media.publicUrl} alt="Imagem anexada" className="h-10 w-10 rounded object-cover" />
                        <Button
                          type="button"
                          startAdornment={<Trash2Icon size={14} />}
                          loading={{ verb: "Removendo", state: removeImage.isPending && removeImage.variables?.mediaId === media.id }}
                          onClick={() => removeImage.mutate({ postId: editing._id, mediaId: media.id })}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="rounded border border-dashed border-ud-neutral-300 bg-ud-neutral-100 p-3 text-xs text-ud-secondary-600">
              Salve o rascunho primeiro para habilitar anexos de imagem.
            </p>
          )}

          <MarkdownEditor
            key={editing?._id ?? "new-editor"}
            markdown={markdown}
            onChange={(event) => setMarkdown(event.currentTarget.value)}
          />

          <div className="flex flex-wrap gap-2 border-t border-ud-neutral-300 pt-4">
            <Button type="submit" highlight loading={{ verb: "Salvando", state: savePost.isPending }}>
              {editing ? "Salvar alterações" : "Criar rascunho"}
            </Button>
            {editing && (
              <Button
                type="button"
                startAdornment={<Trash2Icon size={15} />}
                loading={{ verb: "Removendo", state: removePost.isPending }}
                onClick={() => removePost.mutate(editing._id)}
              >
                Remover post
              </Button>
            )}
          </div>
        </form>

        <div className="mt-4 grid gap-2">
          {posts.map((post) => (
            <AdminListItem
              key={post._id}
              title={post.title}
              description={categories.find((item) => item._id === post.categoryId)?.name ?? "Sem categoria"}
              status={post.status}
              selected={editing?._id === post._id}
              onSelect={() => selectPost(post)}
            />
          ))}
          {!query.isPending && posts.length === 0 && <p className="text-sm text-ud-secondary-600">Nenhum post cadastrado.</p>}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-ud-neutral-950">Categorias</h2>
        <p className="mt-1 text-sm text-ud-secondary-600">Organize o catálogo usado para classificar os posts.</p>

        <form
          ref={categoryFormRef}
          key={editingCategory?._id ?? "new-category"}
          className="mt-4 grid gap-3 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)

            saveCategory.mutate({
              id: editingCategory?._id,
              body: {
                name: data.get("name"),
                slug: data.get("slug"),
                description: data.get("description") || undefined,
              },
            })
          }}
        >
          <Input name="name" label="Categoria" defaultValue={editingCategory?.name} required />
          <Input name="slug" label="Slug" defaultValue={editingCategory?.slug} required />
          <Input name="description" label="Descrição (opcional)" defaultValue={editingCategory?.description} className="md:col-span-2" />
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" highlight loading={{ verb: editingCategory ? "Salvando" : "Criando", state: saveCategory.isPending }}>
              {editingCategory ? "Salvar categoria" : "Criar categoria"}
            </Button>
            {editingCategory && <Button type="button" onClick={() => setEditingCategory(undefined)}>Cancelar</Button>}
          </div>
        </form>

        <div className="mt-4 grid gap-2">
          {categories.map((item) => (
            <AdminListItem
              key={item._id}
              title={item.name}
              description={item.description ?? item.slug}
              selected={editingCategory?._id === item._id}
              onSelect={() => setEditingCategory(item)}
              actions={(
                <Button
                  type="button"
                  startAdornment={<Trash2Icon size={14} />}
                  loading={{ verb: "Removendo", state: removeCategory.isPending && removeCategory.variables === item._id }}
                  onClick={() => removeCategory.mutate(item._id)}
                >
                  Remover
                </Button>
              )}
            />
          ))}
        </div>
      </section>
    </section>
  )
}
