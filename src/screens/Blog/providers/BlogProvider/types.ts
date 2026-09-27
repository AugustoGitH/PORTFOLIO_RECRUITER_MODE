import type { Dispatch, PropsWithChildren, SetStateAction } from "react"
import type { BlogPagePost } from "../../types"

export type BlogContextValue = {
  posts: BlogPagePost[]
  visiblePosts: BlogPagePost[]
  readingLimit: number | null
  setReadingLimit: Dispatch<SetStateAction<number | null>>
  showAllPosts: () => void
}

export type BlogProviderProps = PropsWithChildren<{
  posts: BlogPagePost[]
}>
