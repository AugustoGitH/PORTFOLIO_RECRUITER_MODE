import { useId } from "react"
import { cn } from "../../../utils/tailwind"
import type { InputProps } from "./types"

export const Input = (props: InputProps) => {
  const generatedId = useId()
  const { label, description, error, className, inputClassName, id = generatedId, required, ...inputProps } = props
  const descriptionId = description || error ? `${id}-description` : undefined

  return (
    <label htmlFor={id} className={cn("block", className)}>
      <span className="block text-sm font-bold text-ud-neutral-950">{label}{required && <span aria-hidden="true"> *</span>}</span>
      <input
        {...inputProps}
        id={id}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={descriptionId}
        className={cn("mt-1 block w-full rounded-sm border bg-ud-neutral-100 px-3 py-2 text-sm text-ud-neutral-950 outline-none transition placeholder:text-ud-secondary-600 focus:border-ud-auxiliary-purple focus:ring-2 focus:ring-ud-auxiliary-purple/20", error ? "border-ud-semantic-error" : "border-ud-neutral-300", inputClassName)}
      />
      {(description || error) && <span id={descriptionId} className={cn("mt-1 block text-xs", error ? "text-ud-semantic-error" : "text-ud-secondary-600")}>{error ?? description}</span>}
    </label>
  )
}
