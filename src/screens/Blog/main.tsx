import { BlogCoffeeSection, BlogFeaturedSection, BlogHeroSection } from "./components"
import { BlogProvider } from "./providers"
import type { BlogPageProps } from "./types"
import { PageLayout } from "@/components/layout/PageLayout"


const BlogPageInner = (props: BlogPageProps) => {
  return (
    <PageLayout hasAdminSession={props.hasAdminSession} headerVariant="blog">
      <BlogHeroSection />
      <BlogFeaturedSection />
      <BlogCoffeeSection />
    </PageLayout>
  )
}

export const BlogPage = (props: BlogPageProps) => {
  return (
    <BlogProvider posts={props.posts}>
      <BlogPageInner {...props} />
    </BlogProvider>
  )
}