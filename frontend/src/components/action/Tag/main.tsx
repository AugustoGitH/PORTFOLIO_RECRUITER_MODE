import { cn } from "../../../utils/tailwind"
import type { TagProps } from "./types"

export const Tag = (props: TagProps) => {
  return (
    <div style={props.style} className={cn("flex items-center gap-2 px-2 py-2 border border-ud-neutral-300 rounded-sm cursor-default text-xs", props.className)}>
      {props.tag.icon}
      <span className="font-bold">{props.tag.label}</span>
    </div>
  )
}
