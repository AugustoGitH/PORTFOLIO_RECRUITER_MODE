import { cn } from "../../../utils/tailwind"
import type { ButtonProps } from "./types"

export const Button = (_props: ButtonProps) => {

  const { children, startAdornment, className, ...props } = _props

  const Component = props.href ? "a" : "button"

  return (
    <Component className={cn("flex items-center gap-2 border border-ud-neutral-300 py-1 px-2 rounded-sm text-sm transition ", {
      "bg-ud-auxiliary-purple text-ud-neutral-0 font-bold border-ud-auxiliary-purple hover:bg-transparent hover:text-ud-auxiliary-purple": props.highlight,
      "hover:border-ud-neutral-950 hover:text-ud-neutral-950 ": !props.highlight,
    }, className)} {...props as any}>
      {startAdornment}
      <span>{children}</span>
    </Component>
  )
}