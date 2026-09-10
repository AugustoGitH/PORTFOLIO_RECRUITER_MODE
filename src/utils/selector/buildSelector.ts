import { toSlug } from '../string'

/**
 * Builds a slugged selector string from a label, optionally prefixed for use as
 * an id (`#`), class (`.`) or data attribute (`data-`).
 *
 * Slimmed down from the source project's i18n-aware variant — this project has
 * no `intl` term registry, so the raw selector text is slugged directly.
 */
export const buildSelector = (
  selector: string,
  access?: 'id' | 'class' | 'data-attr'
) => {
  const tag = toSlug(selector)
  if (access === 'id') return `#${tag}`
  if (access === 'class') return `.${tag}`
  if (access === 'data-attr') return `data-${tag}`
  return tag
}
