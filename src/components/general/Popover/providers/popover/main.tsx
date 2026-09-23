import { createContext, useCallback, useContext, useRef, useState } from "react"
import type { PopoverContextValue, PopoverProviderProps } from "./types"
import { BASE_Z_INDEX, Z_INDEX_INCREMENT } from "./constants"

const PopoverContext = createContext({} as PopoverContextValue)

export const usePopoverContext = () => useContext(PopoverContext)

export const PopoverProvider = (props: PopoverProviderProps) => {
  const [activePopovers, setActivePopovers] = useState<Set<string>>(new Set())
  const popoverIdCounter = useRef(0)
  const activePopover = useRef<{ id: string; onClose: () => void } | null>(null)

  const registerPopover = useCallback(() => {
    const popoverId = `popover-${++popoverIdCounter.current}`
    const zIndex = BASE_Z_INDEX + activePopovers.size * Z_INDEX_INCREMENT

    setActivePopovers((prev) => new Set([...prev, popoverId]))

    return { popoverId, zIndex }
  }, [activePopovers.size])

  const unregisterPopover = useCallback((popoverId: string) => {
    setActivePopovers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(popoverId)
      return newSet
    })
  }, [])

  const activatePopover = useCallback((popoverId: string, onClose: () => void) => {
    if (activePopover.current?.id === popoverId) return

    const previousPopover = activePopover.current
    activePopover.current = { id: popoverId, onClose }
    previousPopover?.onClose()
  }, [])

  const deactivatePopover = useCallback((popoverId: string) => {
    if (activePopover.current?.id === popoverId) {
      activePopover.current = null
    }
  }, [])

  const getTopZIndex = useCallback(() => {
    return BASE_Z_INDEX + activePopovers.size * Z_INDEX_INCREMENT
  }, [activePopovers.size])

  const value: PopoverContextValue = {
    currentZIndex: getTopZIndex(),
    registerPopover,
    unregisterPopover,
    activatePopover,
    deactivatePopover,
    activePopoversCount: activePopovers.size,
  }

  return (
    <PopoverContext.Provider value={value}>
      {props.children}
    </PopoverContext.Provider>
  )
}
