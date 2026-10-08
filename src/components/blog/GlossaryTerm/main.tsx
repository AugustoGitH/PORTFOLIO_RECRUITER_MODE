"use client"

import { useRef } from "react"
import { BookOpenIcon } from "lucide-react"
import { Popover } from "@/components/general/Popover"
import { useINTLContext } from "@/providers/intl"
import type { GlossaryTermProps } from "./types"

export const GlossaryTerm = ({ entry, referenceKey, children }: GlossaryTermProps) => {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const intl = useINTLContext()

  if (!entry) {
    return (
      <span
        title={intl.t("GlossaryReferenceMissing", { key: referenceKey })}
        className="decoration-ud-semantic-error decoration-dotted underline underline-offset-4"
      >
        {children}
      </span>
    )
  }

  return (
    <Popover<HTMLButtonElement>
      name={`glossary-${referenceKey}`}
      hovering
      allowModalHover
      persistOnManualOpen
      autoRepositionOnOverflow
      smartPositioning
      arrow
      direction="top"
      anchor={{
        ref: anchorRef,
        element: (state) => (
          <button
            ref={anchorRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={state.show}
            onClick={state.onToggleShow}
            className="inline cursor-help rounded-sm border-0 bg-transparent p-0 font-medium text-inherit decoration-ud-auxiliary-purple decoration-2 decoration-dotted underline underline-offset-4 transition-colors hover:text-ud-auxiliary-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple"
          >
            {children}
          </button>
        ),
      }}
    >
      <div className="w-[min(20rem,calc(100vw-2rem))] p-4 text-left">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-ud-auxiliary-purple">
          <BookOpenIcon size={14} aria-hidden="true" />
          {intl.t("GlossaryLabel")}
        </div>
        <p className="mt-2 text-base font-extrabold leading-tight text-ud-neutral-950">
          {entry.term}
        </p>
        <p className="mt-2 text-sm leading-6 text-ud-secondary-600">
          {entry.definition}
        </p>
      </div>
    </Popover>
  )
}
