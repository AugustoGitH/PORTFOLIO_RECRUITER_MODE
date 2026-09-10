import { useEffect, useRef } from 'react'

import type { StableRefOutput } from './types'

/**
 * @hook useStableRef
 * @description Keeps a ref synchronized with a value, updating via useEffect. Useful for accessing
 * the latest value inside callbacks without adding it to dependency arrays. This is the default
 * choice; use it when the ref is read in event handlers / async callbacks / effects (after commit).
 * When the ref must be read synchronously during the same render that produced the value, use
 * useLiveRef instead (this one would lag by one render). See docs/technical/pattern/hooks.md.
 *
 * @template T - Type of the tracked value
 *
 * @param {T} value - The value to track
 *
 * @output {MutableRefObject<T>} ref - Ref that always holds the latest value
 *
 * @returns {StableRefOutput<T>} Mutable ref object
 *
 * @example
 * const countRef = useStableRef(count)
 *
 * const handleClick = useCallback(() => {
 *   // Always reads the latest count without adding it as a dep
 *   console.log(countRef.current)
 * }, [])
 */
export const useStableRef = <T>(value: T): StableRefOutput<T> => {
  // #region Refs
  const ref = useRef(value)

  // #endregion

  // #region Effects
  useEffect(() => {
    ref.current = value
  }, [value])

  // #endregion

  return ref
}
