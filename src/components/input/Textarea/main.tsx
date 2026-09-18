import { cn } from "../../../utils/tailwind"
import type { TextareaProps } from "./types"

export const Textarea = (props: TextareaProps) => {
  return (
    <textarea
      {...props}
      className={cn("resize-none w-full bg-white text-sm font-normal border border-ud-neutral-300 transition-all rounded outline-none p-2 min-h-24 focus:border-ud-auxiliary-purple focus:ring-2 focus:ring-ud-auxiliary-purple/20 text-ud-neutral-950", props.className)}
    />
  )
}
