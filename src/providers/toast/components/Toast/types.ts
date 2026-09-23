import type { ToastEntry } from "../../types"

export type ToastProps = {
  toast: ToastEntry
  closeLabel: string
  onDismiss: () => void
}
