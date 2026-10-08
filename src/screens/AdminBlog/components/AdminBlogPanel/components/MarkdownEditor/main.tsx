"use client"

import { useRef, useState } from "react"
import { EyeIcon, PencilLineIcon } from "lucide-react"
import { MarkdownContent } from "@/components/blog/MarkdownContent"
import { Textarea } from "@/components/input/Textarea"
import { cn } from "@/utils/tailwind"
import type { BlogEditorMode } from "../../types"
import { GlossaryAssistant } from "./components/GlossaryAssistant"
import { MarkdownToolbar } from "./components/MarkdownToolbar"
import { findShortcutAction } from "./components/MarkdownToolbar/actions"
import type { MarkdownEdit, MarkdownEditorProps } from "./types"

const MODES: Array<{
  value: BlogEditorMode
  label: string
  icon: typeof PencilLineIcon
}> = [
  { value: "edit", label: "Editar", icon: PencilLineIcon },
  { value: "preview", label: "Prévia", icon: EyeIcon },
]

export const MarkdownEditor = ({
  markdown,
  onMarkdownChange,
  languageLabel,
  language,
  glossary,
  required,
  documentTitle,
}: MarkdownEditorProps) => {
  const [mode, setMode] = useState<BlogEditorMode>("edit")
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const glossaryDictionary = Object.fromEntries(glossary.map((entry) => {
    const translation = entry.translations[language] ?? entry.translations.ptbr
    return [entry.key, { key: entry.key, ...translation }]
  }))

  const getEditState = () => ({
    value: markdown,
    start: textareaRef.current?.selectionStart ?? selection.start,
    end: textareaRef.current?.selectionEnd ?? selection.end,
  })

  const applyEdit = (edit: MarkdownEdit) => {
    onMarkdownChange(edit.value)
    setSelection({ start: edit.start, end: edit.end })
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      textareaRef.current?.setSelectionRange(edit.start, edit.end)
    })
  }

  const selectRange = (start: number, end: number) => {
    setSelection({ start, end })
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      textareaRef.current?.setSelectionRange(start, end)
    })
  }

  return (
    <section className="overflow-hidden rounded border border-ud-neutral-300">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2">
        <div>
          <h3 className="text-sm font-bold text-ud-neutral-950">Conteúdo do post · {languageLabel}</h3>
          <p className="text-xs text-ud-secondary-600">Escreva em Markdown e confira o resultado antes de publicar.</p>
        </div>
        <div className="flex rounded border border-ud-neutral-300 bg-ud-neutral-0 p-1" role="tablist" aria-label="Modo do editor">
          {MODES.map((item) => {
            const isActive = mode === item.value

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="blog-editor-panel"
                onClick={() => setMode(item.value)}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm transition",
                  isActive
                    ? "bg-ud-auxiliary-purple font-bold text-ud-neutral-0"
                    : "text-ud-secondary-600 hover:text-ud-neutral-950",
                )}
              >
                <item.icon size={15} aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div id="blog-editor-panel" role="tabpanel" className="bg-ud-neutral-0">
        {mode === "edit" ? (
          <>
            <MarkdownToolbar getState={getEditState} onApply={applyEdit} />
            <GlossaryAssistant
              markdown={markdown}
              selection={selection}
              language={language}
              glossary={glossary}
              onApply={applyEdit}
              onSelectRange={selectRange}
            />
            <Textarea
              ref={textareaRef}
              name="markdown"
              value={markdown}
              onChange={(event) => onMarkdownChange(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (!(event.ctrlKey || event.metaKey) || event.shiftKey || event.altKey) return
                const action = findShortcutAction(event.key)
                if (!action) return
                event.preventDefault()
                applyEdit(action.run(getEditState()))
              }}
              onSelect={(event) => {
                const target = event.currentTarget
                const nextSelection = {
                  start: target.selectionStart,
                  end: target.selectionEnd,
                }
                setSelection(nextSelection)
              }}
              placeholder="# Título\n\nEscreva o conteúdo do post em Markdown."
              className="min-h-[32rem] resize-y rounded-none border-0 p-4 font-mono leading-6 focus:ring-inset"
              spellCheck
              required={required}
            />
            <div className="border-t border-ud-neutral-300 px-4 py-2 text-right text-xs text-ud-secondary-600">
              {markdown.length.toLocaleString("pt-BR")} / 50.000 caracteres
            </div>
          </>
        ) : (
          <div className="min-h-[32rem] overflow-auto p-5">
            <MarkdownContent
              markdown={markdown || "# Prévia\n\nComece a escrever para visualizar o post."}
              documentTitle={documentTitle}
              glossary={glossaryDictionary}
            />
          </div>
        )}
      </div>
    </section>
  )
}
