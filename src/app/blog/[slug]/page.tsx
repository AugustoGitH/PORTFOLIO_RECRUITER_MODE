import Link from "next/link"
import { notFound } from "next/navigation"
import { blogService } from "@backend/blog"
import { BlogChrome } from "@/components/blog/BlogChrome"
import { MarkdownContent } from "@/components/blog/MarkdownContent"
import { BlogPostMetrics } from "./BlogPostMetrics"

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await blogService.publishedPost(slug)
  if (!post) notFound()
  return (
    <BlogChrome>
      <main className="min-h-screen bg-ud-neutral-100 px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <Link href="/blog" className="text-sm font-medium text-ud-auxiliary-purple hover:underline">← Voltar ao blog</Link>
          <article className="mt-7 rounded-md border border-ud-neutral-300 bg-white p-6 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ud-auxiliary-purple">Blog</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-ud-neutral-999 sm:text-4xl">{post.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-ud-secondary-600">{post.excerpt}</p>
            <BlogPostMetrics slug={slug} initialLikes={post.likes} initialViews={post.views} />
            <div className="mt-8 border-t border-ud-neutral-300 pt-6"><MarkdownContent markdown={post.markdown} /></div>
          </article>
          <Link href="/" className="mt-10 inline-block text-sm font-medium text-ud-auxiliary-purple hover:underline">Conhecer o portfólio</Link>
        </div>
      </main>
    </BlogChrome>
  )
}
