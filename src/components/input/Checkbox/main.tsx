import { cn } from "@/utils/tailwind"
import type { CheckboxProps } from "./types"

export const Checkbox = ({
  label,
  className,
  inputClassName,
  ...inputProps
}: CheckboxProps) => (
  <label
    className={cn(
      "flex items-start gap-2 text-xs text-ud-neutral-950",
      inputProps.disabled && "cursor-not-allowed opacity-60",
      className,
    )}
  >
    <input
      {...inputProps}
      type="checkbox"
      className={cn(
        "mt-0.5 size-4 shrink-0 appearance-none rounded-sm border border-ud-neutral-950 bg-transparent checked:bg-ud-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-neutral-950",
        inputClassName,
      )}
    />
    <span>{label}</span>
  </label>
)
