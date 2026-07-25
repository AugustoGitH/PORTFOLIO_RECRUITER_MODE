import { isPlainObject } from './isPlainObject'

/**
 * Filters object properties based on a predicate function
 *
 * @param object - The object to filter
 * @param predicate - Function that takes a [key, value] pair and returns a boolean
 * @param recursive - If true, recursively filters nested objects (default: false)
 * @param visited - Set of already visited objects to prevent infinite loops in circular references
 * @returns A new object containing only properties that passed the predicate test
 *
 * @example
 * // Filter undefined properties only at root level
 * filterObject({ a: 1, b: undefined, c: { d: undefined } }, ([, v]) => v !== undefined, false)
 * // Returns: { a: 1, c: { d: undefined } }
 *
 * @example
 * // Filter undefined properties at all levels
 * filterObject({ a: 1, b: undefined, c: { d: undefined, e: 2 } }, ([, v]) => v !== undefined, true)
 * // Returns: { a: 1, c: { e: 2 } }
 */
export const filterObject = <T extends object, K extends keyof T = keyof T>(
  object: T,
  predicate: (v: [K, T[K]]) => boolean,
  recursive: boolean = false,
  visited: WeakSet<object> = new WeakSet()
) => {
  // Detect circular references
  if (visited.has(object)) {
    return object // Prevent repeated processing
  }

  // Add current object to the set of visited objects
  visited.add(object)

  const result = {} as T

  for (const key in object) {
    const field = key as unknown as K
    const value = object[key] as unknown as T[K]

    const filtered = predicate([field, value])
    if (filtered) {
      if (recursive && isPlainObject(value)) {
        // Only recursive if the recursive parameter is true
        result[field] = filterObject<typeof value>(
          value,
          ([k, v]) => predicate([k as any, v]),
          recursive,
          visited
        )
      } else {
        result[field] = value
      }
    }
  }

  return result
}
