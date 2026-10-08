import type { PropsWithChildren } from 'react'
import type { INTL_TERMS, Term } from '../../constants/intl'
import type { Language } from '../../constants/intl/languages'
import type { CreateTypeFromString, Primitive } from '../../utils/types'

export type { Language } from '../../constants/intl/languages'

export type TermKey = keyof typeof INTL_TERMS

export type INTLTranslateFunction = <
    T extends Term,
    SK extends string = "{",
    EK extends string = "}",
    Variants extends CreateTypeFromString<T, SK, EK> | Primitive =
    | CreateTypeFromString<T, SK, EK>
    | Primitive,
  >(term: T, variants?: Variants) => T


export type INTLContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: INTLTranslateFunction
}

export type INTLProviderProps = PropsWithChildren<{
  initialLanguage: Language
  hasLanguageCookie: boolean
}>
