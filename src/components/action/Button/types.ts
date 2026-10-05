import type { ComponentPropsWithRef, ReactNode } from "react";
import { PropsWithClassName } from "../../../utils/types";

export type ButtonBaseProps = {
  highlight?: boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  /**
   * Disables the action while its result is pending. Use `verb` for a custom
   * gerund label; the component renders the animated ellipsis.
   */
  loading?: boolean | {
    verb: ReactNode
    state: boolean
  }
}

export type NativeButtonProps = ComponentPropsWithRef<"button"> & {
  href?: never
} & ButtonBaseProps

export type LinkButtonProps = ComponentPropsWithRef<"a"> & {
  href: string
} & ButtonBaseProps

export type ButtonProps = PropsWithClassName<NativeButtonProps | LinkButtonProps>
