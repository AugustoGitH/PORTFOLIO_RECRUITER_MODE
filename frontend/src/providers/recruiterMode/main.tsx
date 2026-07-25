import { createContext, useContext, useState } from "react"
import type { RecruiterModeContextValue, RecruiterModeProviderProps } from "./types"
import { RecruiterFormButton } from "../../features/recruiter"

const RecruiterModeContext = createContext({} as RecruiterModeContextValue)

export const useRecruiterModeContext = () => useContext(RecruiterModeContext)

export const RecruiterModeProvider = (props: RecruiterModeProviderProps) => {
  const [isRecruiterMode, setIsRecruiterMode] = useState(false)

  const onRecruiterMode = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  const offRecruiterMode = () => {

  }

  const changeRecruiterMode = (state: boolean | ((prevState: boolean) => boolean)) => {
    setIsRecruiterMode(prevState => {
      const currentState = typeof state === "function" ? state(prevState) : state

      if (currentState) onRecruiterMode()
      if (!currentState) offRecruiterMode()

      return currentState
    })
  }

  const toggleRecruiterMode = () => changeRecruiterMode(prevState => !prevState)

  const value: RecruiterModeContextValue = {
    isRecruiterMode,
    changeRecruiterMode,
    toggleRecruiterMode
  }

  return (
    <RecruiterModeContext.Provider value={value}>
      {props.children}
      <RecruiterFormButton />
    </RecruiterModeContext.Provider>
  )
}
