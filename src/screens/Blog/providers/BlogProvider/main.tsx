"use client"

import { createContext, useContext, useState } from "react"
import type { BlogContextValue, BlogProviderProps } from "./types"

const BlogContext = createContext({} as BlogContextValue)

export const useBlogContext = () => useContext(BlogContext)

export const BlogProvider = ({ posts, children }: BlogProviderProps) => {
  const [readingLimit, setReadingLimit] = useState<number | null>(5)
  const visiblePosts = readingLimit === null
    ? posts
    : posts.filter((post) => post.minutes <= readingLimit)

  return (
    <BlogContext.Provider
      value={{
        posts,
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
