import type { Primitive } from "../types"
import { normalizeString } from "./normalizeString"


export const toSlug = (text: Primitive): string => {
  return normalizeString(text)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
}
