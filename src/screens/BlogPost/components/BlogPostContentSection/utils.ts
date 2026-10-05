type HeadingPosition = {
  id: string
  top: number
}

type GetActiveHeadingIdOptions = {
  focusLine: number
  headings: HeadingPosition[]
  isAtPageEnd: boolean
}

export const getActiveHeadingId = ({
  focusLine,
  headings,
  isAtPageEnd,
}: GetActiveHeadingIdOptions): string | null => {
  if (headings.length === 0) return null
  if (isAtPageEnd) return headings.at(-1)?.id ?? null

  let activeHeadingId = headings[0].id

  for (const heading of headings) {
    if (heading.top > focusLine) break
    activeHeadingId = heading.id
  }

  return activeHeadingId
}
