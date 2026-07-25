import { STORAGE_KEY } from "./constants";
import type { Language } from "./types";

export const isLanguage = (value: unknown): value is Language => value === "ptbr" || value === "en"

export const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isLanguage(stored) ? stored : "ptbr"
}