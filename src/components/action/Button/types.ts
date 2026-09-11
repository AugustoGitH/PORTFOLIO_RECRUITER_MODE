import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { PropsWithClassName } from "../../../utils/types";

export type ButtonBaseProps = {
  highlight?: boolean
  startAdornment?: React.ReactNode
  /**
   * Disables the action while its result is pending. Use `verb` for a custom
   * gerund label; the component renders the animated ellipsis.
   */
  loading?: boolean | {
    verb: ReactNode
    state: boolean
  }
}

export type NativeButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never
}> & ButtonBaseProps

export type LinkButtonProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}> & ButtonBaseProps

export type ButtonProps = PropsWithClassName<NativeButtonProps | LinkButtonProps>
