import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPostPage } from "@/screens/BlogPost"
import { getBlogPostMetadataData, getBlogPostPageData } from "@/server/blog"

export const dynamic = "force-dynamic"

type Props = PageProps<"/blog/[slug]">

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostMetadataData(slug)

  if (!post) {
    return {
      title: "Post não encontrado | Augusto Westphal",
      robots: { index: false, follow: false },
    }
  }

  const path = `/blog/${post.slug}`

  return {
    title: `${post.title} | Augusto Westphal`,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      locale: post.locale,
      title: post.title,
      description: post.excerpt,
      siteName: "Augusto Westphal",
      publishedTime: post.publishedAt,
      authors: ["Augusto Westphal"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

async function Page({ params }: Props) {
  const { slug } = await params
  const pageData = await getBlogPostPageData(slug)

  if (!pageData) notFound()

  return <BlogPostPage {...pageData} />
}

export default Page
