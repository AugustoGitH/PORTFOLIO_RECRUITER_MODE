import { toSlug } from "@/utils/string"
import type { BlogPostHeading } from "@/screens/BlogPost"

export const getBlogPostHeadings = (markdown: string, documentTitle?: string): BlogPostHeading[] => {
  const occurrences = new Map<string, number>()
  let fenced = false

  return markdown.split("\n").flatMap((line) => {
    const trimmed = line.trim()
    if (/^(```|~~~)/.test(trimmed)) {
      fenced = !fenced
      return []
    }
    if (fenced) return []

    const match = /^(#|##|###)\s+(.+?)\s*#*$/.exec(trimmed)
    if (!match) return []

    const label = match[2]
      .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .trim()
    const baseId = toSlug(label) || "secao"
    if (match[1] === "#" && documentTitle && baseId === toSlug(documentTitle)) return []
    const occurrence = (occurrences.get(baseId) ?? 0) + 1
    occurrences.set(baseId, occurrence)

    return [{
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
      label,
      level: Math.max(2, match[1].length) as 2 | 3,
    }]
  })
}
