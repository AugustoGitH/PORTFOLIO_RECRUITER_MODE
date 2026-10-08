export const SUPPORTED_LANGUAGES = [
  { value: "ptbr", label: "Português", short: "PT" },
  { value: "en", label: "English", short: "EN" },
] as const

export type Language = typeof SUPPORTED_LANGUAGES[number]["value"]

export const DEFAULT_LANGUAGE = "ptbr" as const satisfies Language
