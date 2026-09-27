import type { ReactNode } from "react"

export type AdminListItemProps = {
  title: ReactNode
  description?: ReactNode
  status?: ReactNode
  selected?: boolean
  onSelect?: () => void
  actions?: ReactNode
}
