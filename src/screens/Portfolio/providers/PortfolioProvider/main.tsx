"use client"

import { createContext, useContext } from "react"
import type { PortfolioContextValue, PortfolioProviderProps } from "./types"

const PortfolioContext = createContext({} as PortfolioContextValue)

export const usePortfolioContext = () => useContext(PortfolioContext)

export const PortfolioProvider = (props: PortfolioProviderProps) => {
  return (
    <PortfolioContext.Provider value={{}}>
      {props.children}
    </PortfolioContext.Provider>
  )
}
