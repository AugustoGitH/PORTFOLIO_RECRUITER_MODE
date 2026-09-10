import { createContext, useContext, useEffect, useState } from "react"
import { INTL_TERMS, type Term } from "../../constants/intl"
import type { INTLContextValue, INTLProviderProps, INTLTranslateFunction, Language } from "./types"
import { STORAGE_KEY } from "./constants"
import { getInitialLanguage } from "./utils"
import { template } from "../../utils/string"
import type { CreateTypeFromString, Primitive } from "../../utils/types"

const INTLContext = createContext({} as INTLContextValue)

export const useINTLContext = () => useContext(INTLContext)

export const INTLProvider = (props: INTLProviderProps) => {
  const [language, setLanguageState] = useState<Language>("ptbr")

  useEffect(() => {
    // The read must happen after hydration because localStorage is a browser API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguageState(getInitialLanguage())
  }, [])

  const setLanguage = (next: Language) => {
    localStorage.setItem(STORAGE_KEY, next)
    setLanguageState(next)
  }

  const t = <
    T extends Term,
    SK extends string = "{",
    EK extends string = "}",
    Variants extends CreateTypeFromString<T, SK, EK> | Primitive =
    | CreateTypeFromString<T, SK, EK>
    | Primitive,
  >(term: T, variants?: Variants) => {
    const entry = INTL_TERMS[term as keyof typeof INTL_TERMS]

    const output = (entry ? entry[language] : term) as T

    return variants ? template<T, SK, EK, Variants>(output, variants) : output
  }

  const value: INTLContextValue = {
    language,
    setLanguage,
    t: t as INTLTranslateFunction,
  }

  return (
    <INTLContext.Provider value={value}>
      {props.children}
    </INTLContext.Provider>
  )
}
