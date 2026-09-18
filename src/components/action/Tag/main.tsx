import { cn } from "../../../utils/tailwind"
import type { TagProps } from "./types"

export const Tag = (props: TagProps) => {
  return (
    <div style={props.style} className={cn("flex items-center gap-2 px-2 py-2 border border-ud-neutral-300 rounded-sm cursor-default text-xs", props.className)}>
      {props.tag.icon && <span className="shrink-0 text-ud-neutral-900">{props.tag.icon}</span>}
      <span className="min-w-0">
        <span className="block font-medium leading-tight">{props.tag.label}</span>
        {props.description && <span className="mt-0.5 block text-[10px] leading-tight text-ud-neutral-700">{props.description}</span>}
      </span>
    </div>
  )
}
