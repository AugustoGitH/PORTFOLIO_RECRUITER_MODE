import type { PropsWithChildren, ReactNode } from "react"

type ToastBaseOptions = {
  title: ReactNode
  description: ReactNode
  duration?: number
}

export type ToastStatusOptions = ToastBaseOptions & {
  variant: "status"
  status: "success" | "error"
}

export type ToastActionOptions = ToastBaseOptions & {
  variant: "action"
  icon?: ReactNode
  action: {
    label: ReactNode
    onClick: () => void
  }
}

export type ToastCustomOptions = ToastBaseOptions & {
  variant: "custom"
  icon: ReactNode
  action?: {
    label: ReactNode
    onClick: () => void
  }
}

export type ToastOptions = ToastStatusOptions | ToastActionOptions | ToastCustomOptions

export type ToastEntry = ToastOptions & {
  id: number
  duration: number
}

export type ToastContextValue = {
  showToast: (options: ToastOptions) => number
  dismissToast: (id?: number) => void
}

export type ToastProviderProps = PropsWithChildren
