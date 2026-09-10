import type { PropsWithChildren } from 'react'

export type PopoverRegistration = {
  popoverId: string
  zIndex: number
}

export type PopoverContextValue = {
  currentZIndex: number
  registerPopover: () => PopoverRegistration
  unregisterPopover: (popoverId: string) => void
  activePopoversCount: number
}

export type PopoverProviderProps = PropsWithChildren
