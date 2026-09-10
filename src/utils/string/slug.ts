import { isPlainArray } from "../array"
import type { Primitive } from "../types"
import { toSlug } from "./toSlug"


export const slug = (...keys: (Primitive | Primitive[])[]) => {
  return slugWith('-', ...keys)
}

export const slugWith = (separator: string, ...keys: (Primitive | Primitive[])[]) => {
  return keys
    .map((key) => {
      const keyPlain = isPlainArray(key) ? key.join(' ') : (key ?? '')

      return toSlug(keyPlain)
    })
    .join(separator)
}
