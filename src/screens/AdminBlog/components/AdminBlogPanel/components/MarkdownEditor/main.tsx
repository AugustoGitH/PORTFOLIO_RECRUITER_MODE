"use client"

import { useState } from "react"
import { EyeIcon, PencilLineIcon } from "lucide-react"
import { MarkdownContent } from "@/components/blog/MarkdownContent"
import { Textarea } from "@/components/input/Textarea"
import { cn } from "@/utils/tailwind"
import type { BlogEditorMode } from "../../types"
import type { MarkdownEditorProps } from "./types"

const MODES: Array<{
  value: BlogEditorMode
  label: string
  icon: typeof PencilLineIcon
}> = [
  { value: "edit", label: "Editar", icon: PencilLineIcon },
  { value: "preview", label: "Prévia", icon: EyeIcon },
]

export const MarkdownEditor = ({ markdown, onChange }: MarkdownEditorProps) => {
  const [mode, setMode] = useState<BlogEditorMode>("edit")

  return (
    <section className="overflow-hidden rounded border border-ud-neutral-300">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2">
        <div>
          <h3 className="text-sm font-bold text-ud-neutral-950">Conteúdo do post</h3>
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
            <Textarea
              name="markdown"
              value={markdown}
              onChange={onChange}
              placeholder="# Título\n\nEscreva o conteúdo do post em Markdown."
              className="min-h-[32rem] resize-y rounded-none border-0 p-4 font-mono leading-6 focus:ring-inset"
              spellCheck
              required
            />
            <div className="border-t border-ud-neutral-300 px-4 py-2 text-right text-xs text-ud-secondary-600">
              {markdown.length.toLocaleString("pt-BR")} / 50.000 caracteres
            </div>
          </>
        ) : (
          <div className="min-h-[32rem] overflow-auto p-5">
            <MarkdownContent markdown={markdown || "# Prévia\n\nComece a escrever para visualizar o post."} />
          </div>
        )}
      </div>
    </section>
  )
}
