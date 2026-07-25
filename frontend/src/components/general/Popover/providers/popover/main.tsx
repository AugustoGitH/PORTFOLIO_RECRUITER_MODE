import { createContext, useCallback, useContext, useRef, useState } from "react"
import type { PopoverContextValue, PopoverProviderProps } from "./types"
import { BASE_Z_INDEX, Z_INDEX_INCREMENT } from "./constants"

const PopoverContext = createContext({} as PopoverContextValue)

export const usePopoverContext = () => useContext(PopoverContext)

export const PopoverProvider = (props: PopoverProviderProps) => {
  const [activePopovers, setActivePopovers] = useState<Set<string>>(new Set())
  const popoverIdCounter = useRef(0)

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

  const getTopZIndex = useCallback(() => {
    return BASE_Z_INDEX + activePopovers.size * Z_INDEX_INCREMENT
  }, [activePopovers.size])

  const value: PopoverContextValue = {
    currentZIndex: getTopZIndex(),
    registerPopover,
    unregisterPopover,
    activePopoversCount: activePopovers.size,
  }

  return (
    <PopoverContext.Provider value={value}>
      {props.children}
    </PopoverContext.Provider>
  )
}
