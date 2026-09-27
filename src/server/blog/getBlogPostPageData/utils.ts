import { toSlug } from "@/utils/string"
import type { BlogPostHeading } from "@/screens/BlogPost"

export const getBlogPostHeadings = (markdown: string): BlogPostHeading[] => {
  const occurrences = new Map<string, number>()

  return markdown.split("\n").flatMap((line) => {
    const match = /^(##|###)\s+(.+?)\s*#*$/.exec(line.trim())
    if (!match) return []

    const label = match[2]
      .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .trim()
    const baseId = toSlug(label) || "secao"
    const occurrence = (occurrences.get(baseId) ?? 0) + 1
    occurrences.set(baseId, occurrence)

    return [{
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
      label,
      level: match[1].length as 2 | 3,
    }]
  })
}
