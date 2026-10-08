import type { BlogPost, BlogPostPageProps } from "../../types"

export type BlogPostContentSectionProps = {
  post: BlogPost
  headings: BlogPostPageProps["headings"]
  glossary: BlogPostPageProps["glossary"]
}
