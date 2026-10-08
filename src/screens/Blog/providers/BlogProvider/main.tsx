"use client"

import { createContext, useContext, useState } from "react"
import { useINTLContext } from "@/providers/intl"
import { estimateReadingMinutes } from "@/utils/date"
import { getLocalizedValue } from "@/utils/intl"
import type { BlogContextValue, BlogProviderProps } from "./types"

const BlogContext = createContext({} as BlogContextValue)

export const useBlogContext = () => useContext(BlogContext)

export const BlogProvider = ({ posts, children }: BlogProviderProps) => {
  const intl = useINTLContext()
  const [readingLimit, setReadingLimit] = useState<number | null>(5)
  const localizedPosts = posts.map((post) => {
    const translation = getLocalizedValue(post.translations, intl.language)
    return {
      ...post,
      ...translation,
      minutes: estimateReadingMinutes(translation.markdown),
    }
  })
  const visiblePosts = readingLimit === null
    ? localizedPosts
    : localizedPosts.filter((post) => post.minutes <= readingLimit)

  return (
    <BlogContext.Provider
      value={{
        posts: localizedPosts,
        visiblePosts,
        readingLimit,
        setReadingLimit,
        showAllPosts: () => setReadingLimit(null),
      }}
    >
      {children}
    </BlogContext.Provider>
  )
}
