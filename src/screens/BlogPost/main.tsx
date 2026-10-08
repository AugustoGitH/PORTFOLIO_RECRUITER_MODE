import { PageLayout } from "@/components/layout/PageLayout"
import {
  BlogPostContentSection,
  BlogPostHeaderSection,
  BlogPostRecommendationsSection,
} from "./components"
import type { BlogPostPageProps } from "./types"

export const BlogPostPage = (props: BlogPostPageProps) => (
  <PageLayout hasAdminSession={props.hasAdminSession} headerVariant="blog">
    <BlogPostHeaderSection post={props.post} />
    <BlogPostContentSection
      post={props.post}
      headings={props.headings}
      glossary={props.glossary}
    />
    <BlogPostRecommendationsSection recommendations={props.recommendations} />
  </PageLayout>
)
