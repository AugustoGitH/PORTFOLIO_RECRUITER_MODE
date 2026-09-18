import { cn } from "../../../utils/tailwind"
import type { SegmentedControlProps } from "./types"

export const SegmentedControl = <Value extends string>(props: SegmentedControlProps<Value>) => {
  return (
    <div className={cn("grid grid-cols-3 rounded-md border border-ud-neutral-300 bg-ud-neutral-100 p-0.5", props.className)} aria-label={props.ariaLabel}>
      {props.options.map((option) => {
        const isSelected = props.value === option.value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            className={cn("min-h-11 rounded-sm px-2 text-sm font-medium text-ud-secondary-600 transition-colors hover:bg-ud-auxiliary-purple-light", {
              "bg-ud-auxiliary-purple text-ud-neutral-0 shadow-sm hover:bg-ud-auxiliary-purple": isSelected,
            })}
            onClick={() => props.onChange(isSelected ? null : option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
