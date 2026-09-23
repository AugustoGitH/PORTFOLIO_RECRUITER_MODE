import { cn } from "../../../utils/tailwind"
import type { ChipProps } from "./types"

export const Chip = ({ children, className, size = "md", tone = "accent" }: ChipProps) => {
  return (
    <div
      className={cn(
        "inline-flex rounded-md font-bold items-center gap-2 uppercase",
        {
          "bg-ud-auxiliary-purple/10 text-ud-auxiliary-purple": tone === "accent",
          "bg-ud-neutral-200 text-ud-neutral-999": tone === "neutral",
          "px-2  text-[10px]": size === "sm",
          "px-2.5  text-[11px]": size === "md",
        },
        className,
      )}
    >
      {children}
    </div>
  )
}
