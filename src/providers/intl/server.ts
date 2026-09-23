import "server-only"

import { cookies, headers } from "next/headers"
import { LANGUAGE_COOKIE } from "./constants"
import { isLanguage } from "./utils"
import type { Language } from "./types"

export const getRequestLanguage = async (): Promise<{
  language: Language
  hasLanguageCookie: boolean
}> => {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const stored = cookieStore.get(LANGUAGE_COOKIE)?.value

  if (isLanguage(stored)) {
    return { language: stored, hasLanguageCookie: true }
  }

  const preferredLanguages = (headerStore.get("accept-language") ?? "")
    .split(",")
    .map((entry, index) => {
      const [tag, ...parameters] = entry.trim().split(";")
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="))
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1
      return { tag: tag.toLowerCase(), quality, index }
    })
    .filter(({ quality }) => quality > 0 && quality <= 1)
    .sort((a, b) => b.quality - a.quality || a.index - b.index)

  const preferred = preferredLanguages.find(({ tag }) =>
    tag === "en" || tag.startsWith("en-") || tag === "pt" || tag.startsWith("pt-"),
  )

  return {
    language: preferred?.tag.startsWith("en") ? "en" : "ptbr",
    hasLanguageCookie: false,
  }
}
