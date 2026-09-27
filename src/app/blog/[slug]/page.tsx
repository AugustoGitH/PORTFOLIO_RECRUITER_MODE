import { notFound } from "next/navigation"
import { BlogPostPage } from "@/screens/BlogPost"
import { getBlogPostPageData } from "@/server/blog"

export const dynamic = "force-dynamic"

async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pageData = await getBlogPostPageData(slug)

  if (!pageData) notFound()

  return <BlogPostPage {...pageData} />
}

export default Page
