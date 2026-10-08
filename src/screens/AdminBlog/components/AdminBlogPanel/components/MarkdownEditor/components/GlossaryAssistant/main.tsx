"use client"

import { useMemo, useState } from "react"
import { BookOpenIcon, LinkIcon, PlusIcon, SearchIcon, Unlink2Icon } from "lucide-react"
import { cn } from "@/utils/tailwind"
import { extractGlossaryKeys } from "@/utils/blog"
import {
  applyGlossaryReference,
  findReferenceAt,
  findUnlinkedMentions,
  getGlossaryTranslation,
  rankGlossary,
  removeGlossaryReference,
} from "../../glossary"
import { GlossaryTermForm } from "../GlossaryTermForm"
import type { MarkdownEditState } from "../../types"
import type { GlossaryAssistantProps } from "./types"

const chipClass = "rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple"
const actionClass = "flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-semibold text-ud-secondary-600 transition hover:bg-ud-neutral-0 hover:text-ud-auxiliary-purple"

export const GlossaryAssistant = (props: GlossaryAssistantProps) => {
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState("")
  const [creating, setCreating] = useState<{ term: string; state: MarkdownEditState } | undefined>()
  const { markdown, selection, language, glossary } = props
  const state = { value: markdown, start: selection.start, end: selection.end }
  const selectedText = markdown.slice(selection.start, selection.end).trim()
  const reference = findReferenceAt(markdown, selection.start, selection.end)
  const referenceEntry = reference && glossary.find((entry) => entry.key === reference.key)

  const searchTerm = isSearching ? query : selectedText
  const suggestions = useMemo(
    () => rankGlossary(glossary, searchTerm, language).slice(0, isSearching ? 8 : 5),
    [glossary, language, searchTerm, isSearching],
  )
  const mentions = useMemo(
    () => findUnlinkedMentions(markdown, glossary, language),
    [markdown, glossary, language],
  )
  const missingKeys = useMemo(() => {
    const known = new Set(glossary.map((entry) => entry.key))
    return extractGlossaryKeys(markdown).filter((key) => !known.has(key))
  }, [markdown, glossary])

  const openCreate = (initialTerm: string) => {
    setIsSearching(false)
    setCreating({ term: initialTerm, state })
  }

  const apply = (key: string, term: string) => {
    props.onApply(applyGlossaryReference(state, key, term))
    setIsSearching(false)
    setQuery("")
  }

  const renderSuggestions = () => (
    <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto">
      {suggestions.map(({ entry, exact }) => {
        const translation = getGlossaryTranslation(entry, language)
        return (
          <button
            key={entry.key}
            type="button"
            title={translation.definition}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => apply(entry.key, translation.term)}
            className={cn(
              chipClass,
              exact
                ? "border-ud-auxiliary-purple bg-ud-auxiliary-purple text-ud-neutral-0"
                : "border-ud-auxiliary-purple/30 bg-ud-neutral-0 text-ud-neutral-950 hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple",
            )}
          >
            {translation.term} <span className={cn("font-normal", exact ? "text-ud-neutral-0/80" : "text-ud-secondary-600")}>· {entry.key}</span>
          </button>
        )
      })}
      {suggestions.length === 0 && (
        <span className="text-xs text-ud-secondary-600">Nenhum termo ativo encontrado para essa busca.</span>
      )}
      {searchTerm.trim() && !suggestions.some((item) => item.exact) && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => openCreate(searchTerm.trim())}
          className={cn(chipClass, "border-dashed border-ud-auxiliary-purple text-ud-auxiliary-purple hover:bg-ud-auxiliary-purple hover:text-ud-neutral-0")}
        >
          <PlusIcon size={12} className="mr-1 inline" aria-hidden="true" />
          Criar “{searchTerm.trim()}” no glossário
        </button>
      )}
    </div>
  )

  const renderContext = () => {
    if (creating) {
      return (
        <GlossaryTermForm
          initialTerm={creating.term}
          language={language}
          glossary={glossary}
          onCancel={() => setCreating(undefined)}
          onCreated={(key, term) => {
            props.onApply(applyGlossaryReference(creating.state, key, term))
            setCreating(undefined)
          }}
        />
      )
    }

    if (isSearching) {
      return (
        <>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Buscar por chave, termo ou alias"
            className="mt-2 block w-full rounded-sm border border-ud-neutral-300 bg-ud-neutral-0 px-3 py-2 text-sm text-ud-neutral-950 outline-none focus:border-ud-auxiliary-purple focus:ring-2 focus:ring-ud-auxiliary-purple/20"
          />
          <p className="mt-1 text-xs text-ud-secondary-600">
            {reference ? "O termo escolhido substitui a referência atual." : selectedText ? `Será aplicado em “${selectedText}”.` : "Sem seleção, o nome do termo será inserido no cursor."}
          </p>
          {renderSuggestions()}
        </>
      )
    }

    if (reference) {
      const translation = referenceEntry ? getGlossaryTranslation(referenceEntry, language) : undefined
      return (
        <div className="mt-2 space-y-1">
          <p className="text-xs text-ud-neutral-950">
            Referência a <strong>{translation?.term ?? reference.key}</strong> <span className="text-ud-secondary-600">· {reference.key}</span>
          </p>
          {!referenceEntry && <p className="text-xs font-semibold text-red-600">Esta chave não existe no glossário. A publicação será bloqueada.</p>}
          {referenceEntry?.status === "archived" && <p className="text-xs font-semibold text-amber-600">Termo arquivado: continua funcionando, mas não é mais sugerido.</p>}
          {translation && <p className="text-xs text-ud-secondary-600">{translation.definition}</p>}
          <div className="flex flex-wrap gap-1 pt-1">
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setIsSearching(true)} className={actionClass}>
              <SearchIcon size={13} aria-hidden="true" /> Trocar termo
            </button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => props.onApply(removeGlossaryReference(state, reference))} className={actionClass}>
              <Unlink2Icon size={13} aria-hidden="true" /> Remover referência
            </button>
          </div>
        </div>
      )
    }

    if (selectedText) {
      return (
        <>
          <p className="mt-2 text-xs text-ud-secondary-600">
            {suggestions.some((item) => item.exact) ? `“${selectedText}” é um termo do glossário.` : `Termos relacionados a “${selectedText}”:`}
          </p>
          {renderSuggestions()}
        </>
      )
    }

    return (
      <div className="mt-2">
        {mentions.length > 0 ? (
          <>
            <p className="text-xs text-ud-secondary-600">Termos mencionados sem referência — clique para selecionar no texto:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {mentions.map((mention) => (
                <button
                  key={mention.key}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => props.onSelectRange(mention.start, mention.end)}
                  className={cn(chipClass, "border-ud-neutral-300 bg-ud-neutral-0 text-ud-neutral-950 hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple")}
                >
                  <LinkIcon size={11} className="mr-1 inline" aria-hidden="true" />
                  {mention.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-ud-secondary-600">Selecione uma palavra no texto para ver termos do glossário que combinam com ela ou criar um novo.</p>
        )}
      </div>
    )
  }

  return (
    <div className="border-b border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-ud-neutral-950">
          <BookOpenIcon size={16} className="text-ud-auxiliary-purple" aria-hidden="true" />
          Glossário
        </div>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => { setIsSearching((value) => !value); setQuery("") }}
          className={actionClass}
        >
          <SearchIcon size={13} aria-hidden="true" /> {isSearching ? "Fechar busca" : "Buscar termo"}
        </button>
      </div>
      {missingKeys.length > 0 && (
        <p className="mt-1 text-xs font-semibold text-red-600">
          Chaves inexistentes no texto: {missingKeys.join(", ")}. A publicação será bloqueada.
        </p>
      )}
      {renderContext()}
    </div>
  )
}
