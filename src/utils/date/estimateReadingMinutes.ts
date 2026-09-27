export const estimateReadingMinutes = (markdown: string) => {
  const words = markdown.replace(/[^\p{L}\p{N}\s]/gu, " ").trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}
