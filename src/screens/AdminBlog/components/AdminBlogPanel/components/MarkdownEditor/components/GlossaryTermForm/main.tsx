"use client"

import { useState } from "react"
import { Button } from "@/components/action/Button"
import { Input } from "@/components/input/Input"
import { Textarea } from "@/components/input/Textarea"
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type Language } from "@/constants/intl"
import { useSaveAdminBlogGlossaryMutation } from "@/services/blog"
import type { AdminBlogGlossaryTranslation } from "@/services/blog"
import { normalizeGlossaryKey } from "@/utils/blog"
import type { GlossaryTermFormProps } from "./types"

const EMPTY: AdminBlogGlossaryTranslation = { term: "", definition: "" }

// Rendered inside the post <form>: no nested <form>, no native required/pattern
// (they would block the post submit) and Enter must not submit the post.
const blockEnter = (event: React.KeyboardEvent) => {
  if (event.key === "Enter" && !(event.target instanceof HTMLTextAreaElement)) event.preventDefault()
}

export const GlossaryTermForm = (props: GlossaryTermFormProps) => {
  const save = useSaveAdminBlogGlossaryMutation()
  const [activeLanguage, setActiveLanguage] = useState<Language>(props.language)
  const [translations, setTranslations] = useState<Partial<Record<Language, AdminBlogGlossaryTranslation>>>({
    [props.language]: { ...EMPTY, term: props.initialTerm },
  })
  const [key, setKey] = useState(normalizeGlossaryKey(props.initialTerm))
  const [keyEdited, setKeyEdited] = useState(false)
  const [status, setStatus] = useState<"active" | "archived">("active")
  const [showErrors, setShowErrors] = useState(false)

  const current = translations[activeLanguage] ?? EMPTY
  const ptbr = translations[DEFAULT_LANGUAGE]
  const keyTaken = props.glossary.some((entry) => entry.key === key)
  const keyInvalid = !key || key !== normalizeGlossaryKey(key)
  const missingPtbr = !ptbr?.term.trim() || !ptbr?.definition.trim()
  const hasError = keyTaken || keyInvalid || missingPtbr

  const update = (patch: Partial<AdminBlogGlossaryTranslation>) =>
    setTranslations((previous) => ({ ...previous, [activeLanguage]: { ...EMPTY, ...previous[activeLanguage], ...patch } }))

  const submit = () => {
    setShowErrors(true)
    if (hasError) return
    const filled = Object.fromEntries(
      Object.entries(translations).filter(([, value]) => value?.term.trim() || value?.definition.trim() || value?.aliases?.length),
    )
    save.mutate({ body: { key, status, translations: filled } }, {
      onSuccess: () => props.onCreated(key, (translations[props.language] ?? ptbr)?.term.trim() || key),
    })
  }

  return (
    <div className="mt-2 space-y-3 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-3" onKeyDown={blockEnter}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ud-secondary-600">
          Novo termo global. O texto selecionado vira o termo de {SUPPORTED_LANGUAGES.find((l) => l.value === props.language)?.short}; PT-BR é obrigatório.
        </p>
        <div className="flex rounded border border-ud-neutral-300 bg-ud-neutral-100 p-1" role="tablist" aria-label="Idioma do termo">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.value}
              type="button"
              role="tab"
              aria-selected={activeLanguage === language.value}
              onClick={() => setActiveLanguage(language.value)}
              className={`rounded-sm px-3 py-1 text-xs transition ${activeLanguage === language.value ? "bg-ud-auxiliary-purple font-bold text-white" : "text-ud-secondary-600 hover:text-ud-neutral-950"}`}
            >
              {language.short}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Input
          label={`Termo (${activeLanguage === DEFAULT_LANGUAGE ? "obrigatório" : "opcional"})`}
          value={current.term}
          onChange={(event) => {
            const term = event.currentTarget.value
            update({ term })
            if (!keyEdited && activeLanguage === DEFAULT_LANGUAGE) setKey(normalizeGlossaryKey(term))
          }}
        />
        <Input
          label="Chave global"
          description="Imutável depois de criada. Sugerida a partir do termo em PT-BR."
          value={key}
          onChange={(event) => {
            setKeyEdited(true)
            setKey(normalizeGlossaryKey(event.currentTarget.value))
          }}
          maxLength={80}
        />
      </div>
      {showErrors && keyTaken && <p className="text-xs font-semibold text-red-600">A chave “{key}” já existe no glossário.</p>}
      {showErrors && keyInvalid && !keyTaken && <p className="text-xs font-semibold text-red-600">Informe uma chave válida (minúsculas e hífens).</p>}

      <label className="block text-sm font-bold text-ud-neutral-950">
        Definição
        <Textarea
          value={current.definition}
          onChange={(event) => update({ definition: event.currentTarget.value })}
          className="mt-1 min-h-20 font-normal"
          maxLength={600}
        />
      </label>
      <Input
        label="Aliases (opcional)"
        description="Separe por vírgulas. Também entram nas sugestões do editor."
        value={(current.aliases ?? []).join(", ")}
        onChange={(event) => update({
          aliases: event.currentTarget.value.split(",").map((alias) => alias.trim()).filter(Boolean),
        })}
      />
      {showErrors && missingPtbr && (
        <p className="text-xs font-semibold text-red-600">Preencha termo e definição em PT-BR.</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Status do termo"
          value={status}
          onChange={(event) => setStatus(event.currentTarget.value as "active" | "archived")}
          className="rounded-sm border border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2 text-sm outline-none focus:border-ud-auxiliary-purple"
        >
          <option value="active">Ativo</option>
          <option value="archived">Arquivado</option>
        </select>
        <Button type="button" highlight loading={{ verb: "Salvando", state: save.isPending }} onClick={submit}>
          Criar termo e referenciar
        </Button>
        <Button type="button" onClick={props.onCancel}>Cancelar</Button>
      </div>
    </div>
  )
}
