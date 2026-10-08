"use client"

import { useRef, useState } from "react"
import { ImagePlusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { AdminListItem } from "@/components/general/AdminListItem"
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type Language } from "@/constants/intl"
import { Input } from "@/components/input/Input"
import { Textarea } from "@/components/input/Textarea"
import {
  useAdminBlogQuery,
  useRemoveAdminBlogCategoryMutation,
  useRemoveAdminBlogGlossaryMutation,
  useRemoveAdminBlogImageMutation,
  useRemoveAdminBlogPostMutation,
  useSaveAdminBlogCategoryMutation,
  useSaveAdminBlogGlossaryMutation,
  useSaveAdminBlogPostMutation,
  useUploadAdminBlogImageMutation,
} from "@/services/blog"
import type {
  AdminBlogCategory,
  AdminBlogCategoryTranslation,
  AdminBlogGlossaryEntry,
  AdminBlogGlossaryTranslation,
  AdminBlogPost,
  AdminBlogPostTranslation,
} from "@/services/blog"
import { MarkdownEditor } from "./components/MarkdownEditor"
import { getPostBody } from "./utils"
import { normalizeGlossaryKey } from "@/utils/blog"

export const AdminBlogPanel = () => {
  const [editing, setEditing] = useState<AdminBlogPost | undefined>()
  const [editingCategory, setEditingCategory] = useState<AdminBlogCategory | undefined>()
  const [editingGlossary, setEditingGlossary] = useState<AdminBlogGlossaryEntry | undefined>()
  const [activeLanguage, setActiveLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const [activeCategoryLanguage, setActiveCategoryLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const [activeGlossaryLanguage, setActiveGlossaryLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const [glossaryKey, setGlossaryKey] = useState("")
  const [glossaryStatus, setGlossaryStatus] = useState<"active" | "archived">("active")
  const [translations, setTranslations] = useState<Partial<Record<Language, AdminBlogPostTranslation>>>({
    ptbr: { slug: "", title: "", excerpt: "", markdown: "" },
  })
  const [categoryTranslations, setCategoryTranslations] = useState<Partial<Record<Language, AdminBlogCategoryTranslation>>>({
    ptbr: { slug: "", name: "" },
  })
  const [glossaryTranslations, setGlossaryTranslations] = useState<Partial<Record<Language, AdminBlogGlossaryTranslation>>>({
    ptbr: { term: "", definition: "" },
  })
  const postFormRef = useRef<HTMLFormElement>(null)
  const categoryFormRef = useRef<HTMLFormElement>(null)

  const query = useAdminBlogQuery()
  const savePost = useSaveAdminBlogPostMutation({
    onSaved: (post, variables) => {
      if (!variables.id) postFormRef.current?.reset()
      if (!post) return

      setEditing(post)
      setTranslations(post.translations)
    },
  })
  const saveCategory = useSaveAdminBlogCategoryMutation()
  const saveGlossary = useSaveAdminBlogGlossaryMutation()
  const removePost = useRemoveAdminBlogPostMutation()
  const removeCategory = useRemoveAdminBlogCategoryMutation()
  const removeGlossary = useRemoveAdminBlogGlossaryMutation()
  const uploadImage = useUploadAdminBlogImageMutation()
  const removeImage = useRemoveAdminBlogImageMutation()

  const categories = query.data?.categories ?? []
  const posts = query.data?.posts ?? []
  const glossary = query.data?.glossary ?? []

  const selectPost = (post: AdminBlogPost) => {
    setEditing(post)
    setTranslations(post.translations)
    setActiveLanguage(DEFAULT_LANGUAGE)
  }

  const startNewPost = () => {
    setEditing(undefined)
    setTranslations({ ptbr: { slug: "", title: "", excerpt: "", markdown: "" } })
    setActiveLanguage(DEFAULT_LANGUAGE)
  }

  const currentTranslation = translations[activeLanguage] ?? {
    slug: "",
    title: "",
    excerpt: "",
    markdown: "",
  }
  const currentCategoryTranslation = categoryTranslations[activeCategoryLanguage] ?? {
    slug: "",
    name: "",
  }
  const currentGlossaryTranslation = glossaryTranslations[activeGlossaryLanguage] ?? {
    term: "",
    definition: "",
  }
  const updateTranslation = (patch: Partial<AdminBlogPostTranslation>) => {
    setTranslations((current) => ({
      ...current,
      [activeLanguage]: {
        slug: "",
        title: "",
        excerpt: "",
        markdown: "",
        ...current[activeLanguage],
        ...patch,
      },
    }))
  }
  const updateCategoryTranslation = (patch: Partial<AdminBlogCategoryTranslation>) => {
    setCategoryTranslations((current) => ({
      ...current,
      [activeCategoryLanguage]: {
        slug: "",
        name: "",
        ...current[activeCategoryLanguage],
        ...patch,
      },
    }))
  }
  const updateGlossaryTranslation = (patch: Partial<AdminBlogGlossaryTranslation>) => {
    setGlossaryTranslations((current) => ({
      ...current,
      [activeGlossaryLanguage]: {
        term: "",
        definition: "",
        ...current[activeGlossaryLanguage],
        ...patch,
      },
    }))
  }
  const completeTranslations = Object.fromEntries(
    Object.entries(translations).filter(([, translation]) =>
      Boolean(translation?.slug || translation?.title || translation?.excerpt || translation?.markdown),
    ),
  )

  return (
    <section>
      <h1 className="text-2xl font-bold text-ud-neutral-950">Blog</h1>
      <p className="mt-1 text-sm text-ud-secondary-600">Crie, revise e publique textos editoriais em Markdown.</p>

      <section className="mt-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ud-neutral-950">{editing ? "Editar post" : "Novo post"}</h2>
            <p className="mt-1 text-sm text-ud-secondary-600">
              {editing ? `Editando “${editing.translations.ptbr.title}”.` : "Preencha os dados e salve o primeiro rascunho."}
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
                translations: completeTranslations,
              },
            })
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-ud-neutral-300 bg-ud-neutral-100 p-3">
            <div>
              <p className="text-sm font-bold text-ud-neutral-950">Idioma do conteúdo</p>
              <p className="text-xs text-ud-secondary-600">Título, URL, resumo e Markdown são independentes por idioma.</p>
            </div>
            <div className="flex rounded border border-ud-neutral-300 bg-ud-neutral-0 p-1" role="tablist" aria-label="Idioma do post">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.value}
                  type="button"
                  role="tab"
                  aria-selected={activeLanguage === language.value}
                  onClick={() => setActiveLanguage(language.value)}
                  className={`rounded-sm px-3 py-1.5 text-sm transition ${activeLanguage === language.value ? "bg-ud-auxiliary-purple font-bold text-white" : "text-ud-secondary-600 hover:text-ud-neutral-950"}`}
                >
                  {language.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name={`title-${activeLanguage}`}
              label="Título"
              value={currentTranslation.title}
              onChange={(event) => updateTranslation({ title: event.currentTarget.value })}
              className="md:col-span-2"
              required={activeLanguage === DEFAULT_LANGUAGE}
            />
            <Input
              name={`subtitle-${activeLanguage}`}
              label="Subtítulo (opcional)"
              value={currentTranslation.subtitle ?? ""}
              onChange={(event) => updateTranslation({ subtitle: event.currentTarget.value || undefined })}
              description="Complementa o título na página do artigo. O resumo continua sendo usado nos cards."
              className="md:col-span-2"
              maxLength={220}
            />
            <Input
              name={`slug-${activeLanguage}`}
              label="Slug"
              value={currentTranslation.slug}
              onChange={(event) => updateTranslation({ slug: event.currentTarget.value })}
              required={activeLanguage === DEFAULT_LANGUAGE}
            />
            <label className="block text-sm font-bold text-ud-neutral-950">
              Categoria <span aria-hidden="true">*</span>
              <select name="categoryId" defaultValue={editing?.categoryId ?? ""} required className="mt-1 block w-full rounded-sm border border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2 text-sm font-normal outline-none transition focus:border-ud-auxiliary-purple focus:ring-2 focus:ring-ud-auxiliary-purple/20">
                <option value="">Selecione uma categoria</option>
                {categories.map((item) => <option key={item._id} value={item._id}>{item.translations.ptbr.name}</option>)}
              </select>
            </label>
            <label className="block text-sm font-bold text-ud-neutral-950 md:col-span-2">
              Resumo <span aria-hidden="true">*</span>
              <Textarea
                name={`excerpt-${activeLanguage}`}
                value={currentTranslation.excerpt}
                onChange={(event) => updateTranslation({ excerpt: event.currentTarget.value })}
                placeholder="Resumo curto apresentado na listagem pública"
                className="mt-1 min-h-24 font-normal"
                maxLength={320}
                required={activeLanguage === DEFAULT_LANGUAGE}
              />
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
                      alt={`Capa atual de ${editing.translations.ptbr.title}`}
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
                      }, {
                        onSuccess: (_result, variables) => setEditing((current) =>
                          current?._id === variables.postId
                            ? { ...current, cover: undefined }
                            : current),
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
                            updateTranslation({
                              markdown: `${currentTranslation.markdown}\n\n![Imagem do post](${data.publicUrl})\n`,
                            })
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
                          onClick={() => removeImage.mutate({
                            postId: editing._id,
                            mediaId: media.id,
                          }, {
                            onSuccess: (_result, variables) => setEditing((current) =>
                              current?._id === variables.postId
                                ? {
                                    ...current,
                                    media: current.media?.filter(
                                      (item) => item.id !== variables.mediaId,
                                    ),
                                  }
                                : current),
                          })}
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
            key={`${editing?._id ?? "new-editor"}-${activeLanguage}`}
            markdown={currentTranslation.markdown}
            languageLabel={SUPPORTED_LANGUAGES.find((language) => language.value === activeLanguage)?.label ?? activeLanguage}
            language={activeLanguage}
            glossary={glossary}
            onMarkdownChange={(markdown) => updateTranslation({ markdown })}
            required={activeLanguage === DEFAULT_LANGUAGE}
            documentTitle={currentTranslation.title}
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
                onClick={() => removePost.mutate(editing._id, {
                  onSuccess: () => {
                    setEditing(undefined)
                    setTranslations({ ptbr: { slug: "", title: "", excerpt: "", markdown: "" } })
                  },
                })}
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
              title={post.translations.ptbr.title}
              description={categories.find((item) => item._id === post.categoryId)?.translations.ptbr.name ?? "Sem categoria"}
              status={post.status}
              selected={editing?._id === post._id}
              onSelect={() => selectPost(post)}
            />
          ))}
          {!query.isPending && posts.length === 0 && <p className="text-sm text-ud-secondary-600">Nenhum post cadastrado.</p>}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ud-neutral-950">Glossário</h2>
            <p className="mt-1 text-sm text-ud-secondary-600">
              As chaves são globais e podem ser citadas por qualquer post.
            </p>
          </div>
          {editingGlossary && (
            <Button
              type="button"
              startAdornment={<PlusIcon size={15} />}
              onClick={() => {
                setEditingGlossary(undefined)
                setGlossaryKey("")
                setGlossaryStatus("active")
                setGlossaryTranslations({ ptbr: { term: "", definition: "" } })
                setActiveGlossaryLanguage(DEFAULT_LANGUAGE)
              }}
            >
              Novo termo
            </Button>
          )}
        </div>

        <form
          key={editingGlossary?._id ?? "new-glossary-entry"}
          className="mt-4 grid gap-4 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            const completeGlossaryTranslations = Object.fromEntries(
              Object.entries(glossaryTranslations).filter(([, translation]) =>
                Boolean(translation?.term || translation?.definition || translation?.aliases?.length),
              ),
            )

            saveGlossary.mutate({
              id: editingGlossary?._id,
              body: {
                key: glossaryKey,
                status: glossaryStatus,
                translations: completeGlossaryTranslations,
              },
            }, {
              onSuccess: () => {
                setEditingGlossary(undefined)
                setGlossaryKey("")
                setGlossaryStatus("active")
                setGlossaryTranslations({ ptbr: { term: "", definition: "" } })
                setActiveGlossaryLanguage(DEFAULT_LANGUAGE)
              },
            })
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
            <div>
              <p className="text-sm font-bold text-ud-neutral-950">Idioma do termo</p>
              <p className="text-xs text-ud-secondary-600">A chave permanece igual em todos os idiomas.</p>
            </div>
            <div className="flex rounded border border-ud-neutral-300 bg-ud-neutral-100 p-1" role="tablist" aria-label="Idioma do glossário">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.value}
                  type="button"
                  role="tab"
                  aria-selected={activeGlossaryLanguage === language.value}
                  onClick={() => setActiveGlossaryLanguage(language.value)}
                  className={`rounded-sm px-3 py-1.5 text-sm transition ${activeGlossaryLanguage === language.value ? "bg-ud-auxiliary-purple font-bold text-white" : "text-ud-secondary-600 hover:text-ud-neutral-950"}`}
                >
                  {language.short}
                </button>
              ))}
            </div>
          </div>

          <Input
            name={`glossary-term-${activeGlossaryLanguage}`}
            label="Termo"
            value={currentGlossaryTranslation.term}
            onChange={(event) => {
              const term = event.currentTarget.value
              updateGlossaryTranslation({ term })
              if (!editingGlossary && activeGlossaryLanguage === DEFAULT_LANGUAGE) {
                setGlossaryKey(normalizeGlossaryKey(term))
              }
            }}
            required={activeGlossaryLanguage === DEFAULT_LANGUAGE}
          />
          <Input
            name="glossary-key"
            label="Chave global"
            description="Única, em minúsculas e separada por hífens. É sugerida a partir do termo em PT-BR."
            value={glossaryKey}
            onChange={(event) => setGlossaryKey(normalizeGlossaryKey(event.currentTarget.value))}
            disabled={Boolean(editingGlossary)}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            maxLength={80}
            required
          />
          <label className="block text-sm font-bold text-ud-neutral-950 md:col-span-2">
            Definição {activeGlossaryLanguage === DEFAULT_LANGUAGE && <span aria-hidden="true">*</span>}
            <Textarea
              name={`glossary-definition-${activeGlossaryLanguage}`}
              value={currentGlossaryTranslation.definition}
              onChange={(event) => updateGlossaryTranslation({ definition: event.currentTarget.value })}
              className="mt-1 min-h-28 font-normal"
              maxLength={600}
              required={activeGlossaryLanguage === DEFAULT_LANGUAGE}
            />
          </label>
          <Input
            name={`glossary-aliases-${activeGlossaryLanguage}`}
            label="Aliases (opcional)"
            description="Separe por vírgulas. Eles também serão usados nas recomendações do editor."
            value={(currentGlossaryTranslation.aliases ?? []).join(", ")}
            onChange={(event) => updateGlossaryTranslation({
              aliases: event.currentTarget.value
                .split(",")
                .map((alias) => alias.trim())
                .filter(Boolean),
            })}
          />
          <label className="block text-sm font-bold text-ud-neutral-950">
            Status
            <select
              value={glossaryStatus}
              onChange={(event) => setGlossaryStatus(event.currentTarget.value as "active" | "archived")}
              className="mt-1 block w-full rounded-sm border border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2 text-sm font-normal outline-none transition focus:border-ud-auxiliary-purple focus:ring-2 focus:ring-ud-auxiliary-purple/20"
            >
              <option value="active">Ativo</option>
              <option value="archived">Arquivado</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button type="submit" highlight loading={{ verb: "Salvando", state: saveGlossary.isPending }}>
              {editingGlossary ? "Salvar termo" : "Criar termo"}
            </Button>
            {editingGlossary && (
              <Button
                type="button"
                onClick={() => {
                  setEditingGlossary(undefined)
                  setGlossaryKey("")
                  setGlossaryStatus("active")
                  setGlossaryTranslations({ ptbr: { term: "", definition: "" } })
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>

        <div className="mt-4 grid gap-2">
          {glossary.map((entry) => (
            <AdminListItem
              key={entry._id}
              title={entry.translations.ptbr.term}
              description={`${entry.key} · ${entry.translations.ptbr.definition}`}
              status={entry.status}
              selected={editingGlossary?._id === entry._id}
              onSelect={() => {
                setEditingGlossary(entry)
                setGlossaryKey(entry.key)
                setGlossaryStatus(entry.status)
                setGlossaryTranslations(entry.translations)
                setActiveGlossaryLanguage(DEFAULT_LANGUAGE)
              }}
              actions={(
                <Button
                  type="button"
                  startAdornment={<Trash2Icon size={14} />}
                  loading={{ verb: "Removendo", state: removeGlossary.isPending && removeGlossary.variables === entry._id }}
                  onClick={() => removeGlossary.mutate(entry._id)}
                >
                  Remover
                </Button>
              )}
            />
          ))}
          {!query.isPending && glossary.length === 0 && (
            <p className="text-sm text-ud-secondary-600">Nenhum termo cadastrado.</p>
          )}
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
            const completeCategoryTranslations = Object.fromEntries(
              Object.entries(categoryTranslations).filter(([, translation]) =>
                Boolean(translation?.slug || translation?.name || translation?.description),
              ),
            )

            saveCategory.mutate({
              id: editingCategory?._id,
              body: {
                translations: completeCategoryTranslations,
              },
            }, {
              onSuccess: (_result, variables) => {
                if (!variables.id) categoryFormRef.current?.reset()
                setEditingCategory(undefined)
                setCategoryTranslations({ ptbr: { slug: "", name: "" } })
                setActiveCategoryLanguage(DEFAULT_LANGUAGE)
              },
            })
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
            <span className="text-sm font-bold text-ud-neutral-950">Idioma da categoria</span>
            <div className="flex rounded border border-ud-neutral-300 bg-ud-neutral-100 p-1" role="tablist" aria-label="Idioma da categoria">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.value}
                  type="button"
                  role="tab"
                  aria-selected={activeCategoryLanguage === language.value}
                  onClick={() => setActiveCategoryLanguage(language.value)}
                  className={`rounded-sm px-3 py-1.5 text-sm transition ${activeCategoryLanguage === language.value ? "bg-ud-auxiliary-purple font-bold text-white" : "text-ud-secondary-600 hover:text-ud-neutral-950"}`}
                >
                  {language.short}
                </button>
              ))}
            </div>
          </div>
          <Input
            name={`category-name-${activeCategoryLanguage}`}
            label="Categoria"
            value={currentCategoryTranslation.name}
            onChange={(event) => updateCategoryTranslation({ name: event.currentTarget.value })}
            required={activeCategoryLanguage === DEFAULT_LANGUAGE}
          />
          <Input
            name={`category-slug-${activeCategoryLanguage}`}
            label="Slug"
            value={currentCategoryTranslation.slug}
            onChange={(event) => updateCategoryTranslation({ slug: event.currentTarget.value })}
            required={activeCategoryLanguage === DEFAULT_LANGUAGE}
          />
          <Input
            name={`category-description-${activeCategoryLanguage}`}
            label="Descrição (opcional)"
            value={currentCategoryTranslation.description ?? ""}
            onChange={(event) => updateCategoryTranslation({ description: event.currentTarget.value || undefined })}
            className="md:col-span-2"
          />
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" highlight loading={{ verb: editingCategory ? "Salvando" : "Criando", state: saveCategory.isPending }}>
              {editingCategory ? "Salvar categoria" : "Criar categoria"}
            </Button>
            {editingCategory && <Button type="button" onClick={() => {
              setEditingCategory(undefined)
              setCategoryTranslations({ ptbr: { slug: "", name: "" } })
              setActiveCategoryLanguage(DEFAULT_LANGUAGE)
            }}>Cancelar</Button>}
          </div>
        </form>

        <div className="mt-4 grid gap-2">
          {categories.map((item) => (
            <AdminListItem
              key={item._id}
              title={item.translations.ptbr.name}
              description={item.translations.ptbr.description ?? item.translations.ptbr.slug}
              selected={editingCategory?._id === item._id}
              onSelect={() => {
                setEditingCategory(item)
                setCategoryTranslations(item.translations)
                setActiveCategoryLanguage(DEFAULT_LANGUAGE)
              }}
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
