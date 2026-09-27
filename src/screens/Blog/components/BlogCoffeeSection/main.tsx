"use client"

import Link from "next/link"
import { ArrowRight, BookOpenText, Coffee, Sparkles } from "lucide-react"
import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import { useBlogContext } from "../../providers"
import { ArticleMeta } from "../ArticleMeta"

export const BlogCoffeeSection = () => {
  const intl = useINTLContext()
  const { posts, visiblePosts, showAllPosts } = useBlogContext()
  const quickReads = visiblePosts.slice(3, 8)

  return (
    <Container
      aria-label={intl.t("BlogCoffeeTitle")}
      className="bg-ud-neutral-100 pb-20 pt-6 text-ud-neutral-999"
      contentClassName="max-w-[72rem]"
    >
      <div className="border-t border-ud-neutral-300 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Coffee size={36} strokeWidth={1.5} className="text-ud-auxiliary-purple" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">{intl.t("BlogCoffeeTitle")}</h2>
              <p className="text-xs text-ud-secondary-600">{intl.t("BlogCoffeeDescription")}</p>
            </div>
          </div>
          {posts.length > 0 && <button type="button" onClick={showAllPosts} className="inline-flex items-center gap-2 text-sm font-medium text-ud-auxiliary-purple hover:underline">{intl.t("BlogShowAll")} <ArrowRight size={16} aria-hidden="true" /></button>}
        </div>
        {quickReads.length > 0 ? (
          <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-5">
            {quickReads.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="flex min-h-24 gap-3 border-t border-ud-neutral-300 py-4 transition-colors hover:text-ud-auxiliary-purple sm:border-l sm:border-t-0 sm:px-3 lg:first:border-l-0 lg:first:pl-0">
                {index % 2 === 0 ? <BookOpenText size={25} strokeWidth={1.5} className="shrink-0" aria-hidden="true" /> : <Sparkles size={25} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />}
                <span className="flex flex-col gap-2">
                  <span className="line-clamp-2 text-xs font-medium leading-snug">{post.title}</span>
                  <ArticleMeta minutes={post.minutes} />
                </span>
              </Link>
            ))}
          </div>
        ) : <p className="mt-6 rounded-md border border-dashed border-ud-neutral-300 p-4 text-sm text-ud-secondary-600">{intl.t("BlogMoreArticlesSoon")}</p>}
      </div>
    </Container>
  )
}
