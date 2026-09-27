"use client"

import { createContext, useContext, useState } from "react"
import type { TabsContextValue, TabsProviderProps } from "./types"

const TabsContext = createContext({} as TabsContextValue)

export const useTabsContext = () => useContext(TabsContext)

export const TabsProvider = (props: TabsProviderProps) => {
  const [currentTab, setCurrentTab] = useState(props.initialTab ?? 0)
  const [hasNavigated, setHasNavigated] = useState(false)

  const navigateToTab = (tabIndex: number) => {
    setHasNavigated(true)
    setCurrentTab(tabIndex)
  }

  const isCurrentTab = (tabIndex: number) => {
    return currentTab === tabIndex
  }

  const value: TabsContextValue = {
    currentTab,
    hasNavigated,
    navigateToTab,
    isCurrentTab
  }

  return (
    <TabsContext.Provider value={value}>
      {props.children}
    </TabsContext.Provider>
  )
}
