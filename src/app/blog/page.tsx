import { BlogPage } from "@/screens/Blog"
import { getBlogPageData } from "@/server/blog"

export const dynamic = "force-dynamic"

async function Page() {
  const blogPageData = await getBlogPageData()

  return <BlogPage hasAdminSession={blogPageData.hasAdminSession} posts={blogPageData.posts} />
}

export default Page
