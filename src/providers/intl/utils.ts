import { LANGUAGE_COOKIE, STORAGE_KEY } from "./constants"
import type { Language } from "./types"

export const isLanguage = (value: unknown): value is Language => value === "ptbr" || value === "en"

export const getLegacyLanguage = (): Language | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isLanguage(stored) ? stored : null
  } catch {
    return null
  }
}

export const persistLanguage = (language: Language) => {
  const secure = location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
  document.documentElement.lang = language === "en" ? "en" : "pt-BR"

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Cookies remain the source of truth when local storage is unavailable.
  }
}
