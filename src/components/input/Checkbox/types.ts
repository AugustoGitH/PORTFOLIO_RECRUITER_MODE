import type { InputHTMLAttributes, ReactNode } from "react"

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "children" | "className" | "type"
> & {
  label: ReactNode
  className?: string
  inputClassName?: string
}
