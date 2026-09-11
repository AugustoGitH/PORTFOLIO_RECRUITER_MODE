import { useRef } from "react"
import { Popover } from "../../general/Popover"
import { useINTLContext } from "../../../providers/intl"
import { cn } from "../../../utils/tailwind"
import { Tag } from "../Tag"
import type { OverflowTagsProps } from "./types"

export const OverflowTags = (props: OverflowTagsProps) => {
  const intl = useINTLContext()
  const anchorRef = useRef<HTMLButtonElement>(null)
  const maxVisible = props.maxVisible ?? 3
  const visibleTags = props.tags.slice(0, maxVisible)
  const hiddenTags = props.tags.slice(maxVisible)

  return (
    <div className={cn("flex items-center justify-end flex-wrap gap-2", props.className)}>
      {visibleTags.map((tag) => <Tag key={tag.value} className="rounded-xl text-2xs py-1 px-2" tag={tag} />)}
      {hiddenTags.length > 0 && (
        <Popover<HTMLButtonElement>
          name={props.popoverName}
          hovering
          allowModalHover
          persistOnManualOpen
          arrow
          direction="left"
          origin="right"
          anchor={{
            ref: anchorRef,
            element: (state) => (
              <button
                ref={anchorRef}
                type="button"
                onClick={state.onToggleShow}
                className="rounded-xl border border-ud-neutral-300 px-2 py-1 text-2xs font-bold transition hover:border-ud-neutral-950"
                aria-label={intl.t("ShowHiddenSkills", { count: hiddenTags.length })}
              >
                +{hiddenTags.length}
              </button>
            ),
          }}
        >
          <div className="flex max-w-56 flex-wrap gap-2 p-1">
            {hiddenTags.map((tag) => <Tag key={tag.value} className="rounded-xl text-2xs py-1 px-2" tag={tag} />)}
          </div>
        </Popover>
      )}
    </div>
  )
}
