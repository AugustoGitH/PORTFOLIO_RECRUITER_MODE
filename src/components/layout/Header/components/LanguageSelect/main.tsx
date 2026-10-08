import { CheckIcon, ChevronDown, GlobeIcon } from "lucide-react"
import { useRef } from "react"
import { Popover } from "../../../../general/Popover"
import { SUPPORTED_LANGUAGES } from "../../../../../constants/intl"
import { useINTLContext } from "../../../../../providers/intl"
import { cn } from "../../../../../utils/tailwind"

export const LanguageSelect = () => {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const intl = useINTLContext()

  const current = SUPPORTED_LANGUAGES.find(language => language.value === intl.language) ?? SUPPORTED_LANGUAGES[0]

  return (
    <Popover<HTMLButtonElement>
      name="language-select"
      origin="right"
      arrow
      anchor={{
        ref: anchorRef,
        element: (state) => (
          <button ref={anchorRef} onClick={state.onToggleShow} className="flex items-center gap-2">
            <GlobeIcon size={15} />
            <span className="text-xs font-bold">{current.short}</span>
            <ChevronDown size={15} />
          </button>
        ),
      }}
    >
      {(state) => (
        <div className="flex flex-col gap-0.5 p-1 min-w-36 ">
          {SUPPORTED_LANGUAGES.map(language => (
            <button
              key={language.value}
              onClick={() => {
                intl.setLanguage(language.value)
                state.onClose()
              }}
              className={cn(
                "flex items-center justify-between gap-3 rounded px-2 py-1.5 text-xs transition hover:bg-ud-neutral-200",
                { "font-bold text-ud-auxiliary-purple": language.value === intl.language }
              )}
            >
              <span>{language.label}</span>
              {language.value === intl.language && <CheckIcon size={14} />}
            </button>
          ))}
        </div>
      )}
    </Popover>
  )
}
