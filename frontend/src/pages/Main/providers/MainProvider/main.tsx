import { createContext, useContext } from "react"
import type { MainContextValue, MainProviderProps } from "./types"

const MainContext = createContext({} as MainContextValue)

export const useMainContext = () => useContext(MainContext)

export const MainProvider = (props: MainProviderProps) => {
  return (
    <MainContext.Provider value={props}>
      {props.children}
    </MainContext.Provider>
  )
}