import type { PropsWithChildren } from "react";

type ButtonBaseProps = {
  highlight?: boolean
  startAdornment?: React.ReactNode
  
}

export type ButtonProps = PropsWithChildren< | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      href?: never
    })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string
    })> & ButtonBaseProps