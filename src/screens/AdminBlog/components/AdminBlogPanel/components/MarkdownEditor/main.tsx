"use client"

import { useId, useRef, useState } from "react"
import { EyeIcon, PencilLineIcon } from "lucide-react"
import { MarkdownContent } from "@/components/blog/MarkdownContent"
import { Textarea } from "@/components/input/Textarea"
import { cn } from "@/utils/tailwind"
import { DEFAULT_LANGUAGE } from "@/constants/intl"
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

const DEFAULT_MAX_LENGTH = 50000
const DEFAULT_MIN_HEIGHT = "min-h-[32rem]"

export const MarkdownEditor = (props: MarkdownEditorProps) => {
  const panelId = useId()
  const [mode, setMode] = useState<BlogEditorMode>("edit")
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const maxLength = props.maxLength ?? DEFAULT_MAX_LENGTH
  const minHeight = props.minHeightClassName ?? DEFAULT_MIN_HEIGHT
  const showPreview = props.preview ?? true
  const glossaryDictionary = Object.fromEntries((props.glossary ?? []).map((entry) => {
    const translation = entry.translations[props.language ?? DEFAULT_LANGUAGE] ?? entry.translations.ptbr
    return [entry.key, { key: entry.key, ...translation }]
  }))

  const getEditState = () => ({
    value: props.markdown,
    start: textareaRef.current?.selectionStart ?? selection.start,
    end: textareaRef.current?.selectionEnd ?? selection.end,
  })

  const applyEdit = (edit: MarkdownEdit) => {
    props.onMarkdownChange(edit.value)
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
      {(props.title || showPreview) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2">
          {props.title && (
            <div>
              <h3 className="text-sm font-bold text-ud-neutral-950">{props.title}</h3>
              {props.description && <p className="text-xs text-ud-secondary-600">{props.description}</p>}
            </div>
          )}
          {showPreview && (
            <div className="ml-auto flex rounded border border-ud-neutral-300 bg-ud-neutral-0 p-1" role="tablist" aria-label="Modo do editor">
              {MODES.map((item) => {
                const isActive = mode === item.value

                return (
                  <button
                    key={item.value}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={panelId}
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
          )}
        </div>
      )}

      <div id={panelId} role="tabpanel" className="bg-ud-neutral-0">
        {mode === "edit" ? (
          <>
            <MarkdownToolbar actions={props.toolbarActions} getState={getEditState} onApply={applyEdit} />
            {props.glossary && props.language && (
              <GlossaryAssistant
                markdown={props.markdown}
                selection={selection}
                language={props.language}
                glossary={props.glossary}
                onApply={applyEdit}
                onSelectRange={selectRange}
              />
            )}
            <Textarea
              ref={textareaRef}
              name={props.name}
              value={props.markdown}
              onChange={(event) => props.onMarkdownChange(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (!(event.ctrlKey || event.metaKey) || event.shiftKey || event.altKey) return
                const action = findShortcutAction(event.key, props.toolbarActions)
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
              placeholder={props.placeholder}
              className={cn("resize-y rounded-none border-0 p-4 font-mono leading-6 focus:ring-inset", minHeight)}
              maxLength={props.maxLength}
              spellCheck
              required={props.required}
            />
            <div className="border-t border-ud-neutral-300 px-4 py-2 text-right text-xs text-ud-secondary-600">
              {props.markdown.length.toLocaleString("pt-BR")} / {maxLength.toLocaleString("pt-BR")} caracteres
            </div>
          </>
        ) : (
          <div className={cn("overflow-auto bg-ud-neutral-100 p-5", minHeight)}>
            {props.renderPreview ? props.renderPreview(props.markdown) : (
              <MarkdownContent
                markdown={props.markdown || "# Prévia\n\nComece a escrever para visualizar o post."}
                documentTitle={props.documentTitle}
                glossary={glossaryDictionary}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
