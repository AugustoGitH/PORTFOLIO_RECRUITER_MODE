import type { ShouldRecalculateOnMutationOptions } from '../types'

export const shouldRecalculateOnMutation = (
  options: ShouldRecalculateOnMutationOptions
): boolean => {
  for (const mutation of options.mutations) {
    // Check for added/removed nodes (like list items)
    if (
      mutation.type === 'childList' &&
      (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
    ) {
      return true
    }

    // Check for attribute changes that could affect size
    if (
      mutation.type === 'attributes' &&
      ['class', 'style'].includes(mutation.attributeName || '')
    ) {
      return true
    }
  }

  return false
}
