import type { InputHTMLAttributes } from "react"
import type { PropsWithClassName } from "../../../utils/types"

export type InputProps = PropsWithClassName<InputHTMLAttributes<HTMLInputElement> & {
  label: string
  description?: string
  error?: string
  inputClassName?: string
}>
