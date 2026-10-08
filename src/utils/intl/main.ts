import { DEFAULT_LANGUAGE, type Language } from "@/constants/intl"

export const getLocalizedValue = <T>(
  translations: Partial<Record<Language, T>> & Record<typeof DEFAULT_LANGUAGE, T>,
  language: Language,
): T => translations[language] ?? translations[DEFAULT_LANGUAGE]
