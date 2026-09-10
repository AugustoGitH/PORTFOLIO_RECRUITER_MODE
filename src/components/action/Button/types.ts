import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";

export type ButtonBaseProps = {
  highlight?: boolean
  startAdornment?: React.ReactNode
  /**
   * Disables the action while its result is pending. Use `verb` for a custom
   * gerund label; the component renders the animated ellipsis.
   */
  loading?: boolean | {
    verb: ReactNode
  }
}

export type NativeButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never
}> & ButtonBaseProps

export type LinkButtonProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}> & ButtonBaseProps

export type ButtonProps = NativeButtonProps | LinkButtonProps
