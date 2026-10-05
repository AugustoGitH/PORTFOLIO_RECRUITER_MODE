import type { ReactNode } from "react"

export type NavigationMenuPopoverProps = {
  children: (onClose: () => void) => ReactNode
  label: string
  name: string
}
