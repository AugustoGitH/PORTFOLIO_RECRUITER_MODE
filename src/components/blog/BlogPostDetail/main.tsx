"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  Share2,
} from "lucide-react"
import { BlogPostMetrics } from "@/app/blog/[slug]/BlogPostMetrics"
import { Chip } from "@/components/action/Chip"
import { MarkdownContent } from "@/components/blog/MarkdownContent"
import { ABOUT } from "@/constants/profile"
import { useINTLContext } from "@/providers/intl"
import type { BlogPostDetailProps, BlogPostRecommendation } from "./types"

const savedPostKey = (slug: string) => `blog:saved:${slug}`

const RecommendationCard = ({ post }: { post: BlogPostRecommendation }) => {
  const intl = useINTLContext()

  return (
    <article className="group grid min-h-44 grid-cols-[1fr_7rem] overflow-hidden rounded-md border border-ud-neutral-300 bg-white sm:grid-cols-[1fr_9rem]">
      <div className="flex min-w-0 flex-col p-5">
        <Chip size="sm">{post.category}</Chip>
        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-ud-neutral-999 sm:text-lg">
          <Link href={`/blog/${post.slug}`} className="focus-visible:outline-2 focus-visible:outline-ud-auxiliary-purple">
            {post.title}
          </Link>
        </h3>
        {post.subtitle && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ud-secondary-600">
            {post.subtitle}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5 text-ud-secondary-600">
            <Clock3 size={14} aria-hidden="true" />
            {intl.t("BlogReadingMinutes", { minutes: post.minutes })}
          </span>
          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 font-medium text-ud-auxiliary-purple hover:underline">
            {intl.t("BlogContinueReading")} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="relative bg-ud-auxiliary-purple-light">
        <Image
          src={post.cover?.url ?? "/assets/blog/api-windows.png"}
          alt=""
          fill
          sizes="144px"
          className={post.cover ? "object-cover" : "object-contain p-4"}
        />
      </div>
    </article>
  )
}

export const BlogPostDetail = ({ post, headings, recommendations }: BlogPostDetailProps) => {
  const intl = useINTLContext()
  const [isSaved, setIsSaved] = useState(false)
  const [didShare, setDidShare] = useState(false)
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(() => headings[0]?.id ?? null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSaved(localStorage.getItem(savedPostKey(post.slug)) === "true")
  }, [post.slug])

  useEffect(() => {
    if (headings.length === 0) return

    let animationFrame = 0

    const updateActiveHeading = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        const headingElements = headings
          .map((heading) => document.getElementById(heading.id))
          .filter((element): element is HTMLElement => element !== null)

        if (headingElements.length === 0) return

        const navigationOffset = 112
        let currentHeading = headingElements[0].id

        for (const headingElement of headingElements) {
          if (headingElement.getBoundingClientRect().top > navigationOffset) break
          currentHeading = headingElement.id
        }

        setActiveHeadingId((current) => current === currentHeading ? current : currentHeading)
      })
    }

    updateActiveHeading()
    window.addEventListener("scroll", updateActiveHeading, { passive: true })
    window.addEventListener("resize", updateActiveHeading)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("scroll", updateActiveHeading)
      window.removeEventListener("resize", updateActiveHeading)
    }
  }, [headings])

  const toggleSaved = () => {
    const next = !isSaved
    localStorage.setItem(savedPostKey(post.slug), String(next))
    setIsSaved(next)
  }

  const share = async () => {
    const shareData = { title: post.title, text: post.excerpt, url: window.location.href }

    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined)
      return
    }

    await navigator.clipboard.writeText(window.location.href)
    setDidShare(true)
    window.setTimeout(() => setDidShare(false), 1800)
  }

  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat(intl.language === "ptbr" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(post.publishedAt))
    : null

  return (
    <main className="min-h-screen bg-ud-neutral-100 px-4 pb-20 pt-7 text-ud-neutral-999">
      <div className="mx-auto w-full max-w-5xl">
        <nav aria-label={intl.t("BlogBreadcrumbLabel")} className="flex items-center gap-2 text-xs text-ud-secondary-600">
          <Link href="/" className="hover:text-ud-auxiliary-purple">{intl.t("Home")}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-ud-auxiliary-purple">{intl.t("Blog")}</Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-52 truncate font-medium text-ud-neutral-950">{post.category}</span>
        </nav>

        <header className="mt-4 overflow-hidden rounded-md border border-ud-neutral-300 bg-white">
          <div className="grid min-h-[19rem] lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <Chip className="self-start">{post.category}</Chip>
              <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-[-0.045em] text-ud-neutral-999 sm:text-4xl lg:text-[2.75rem]">
                {post.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ud-secondary-600 sm:text-lg">
                {post.subtitle ?? post.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-3">
                  <Image
                    src="/assets/blog/debug-bug.png"
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-full border border-ud-neutral-300  object-cover"
                  />
                  <p className="text-sm font-medium text-ud-neutral-950">
                    {ABOUT.name}
                    <span className="mx-2 text-ud-neutral-500">•</span>
                    <span className="font-normal text-ud-secondary-600">
                      {intl.t("BlogReadingMinutes", { minutes: post.minutes })}
                    </span>
                    {formattedDate && (
                      <span className="mt-0.5 block text-xs font-normal text-ud-secondary-600">{formattedDate}</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-pressed={isSaved}
                    onClick={toggleSaved}
                    className="inline-flex items-center gap-2 rounded-md border border-ud-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple"
                  >
                    {isSaved ? <Check size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
                    {intl.t(isSaved ? "BlogSaved" : "BlogSave")}
                  </button>
                  <button
                    type="button"
                    onClick={() => void share()}
                    className="inline-flex items-center gap-2 rounded-md border border-ud-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple"
                  >
                    {didShare ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
                    {intl.t(didShare ? "BlogLinkCopied" : "BlogShare")}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative min-h-72 lg:min-h-full">
              <Image
                src={post.cover?.url ?? "/assets/blog/cache-blocks.png"}
                alt={post.cover ? post.title : intl.t("BlogCacheArtAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 390px, 100vw"
                className={post.cover ? "object-contain" : "object-contain p-8 sm:p-12"}
              />
            </div>
          </div>
        </header>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:gap-12">
          {headings.length > 0 && (
            <aside className="hidden self-stretch lg:block">
              <nav aria-label={intl.t("BlogTableOfContents")} className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-l border-ud-neutral-300 pb-2">
                <p className="mb-3 pl-4 text-sm font-bold text-ud-neutral-999">{intl.t("BlogInThisArticle")}</p>
                {headings.map((heading, index) => (
                  <a
                    key={`${heading.id}-${index}`}
                    href={`#${heading.id}`}
                    aria-current={heading.id === activeHeadingId ? "location" : undefined}
                    className={`block border-l-2 py-1.5 text-xs leading-snug transition ${heading.id === activeHeadingId ? "border-ud-auxiliary-purple font-semibold text-ud-auxiliary-purple" : "border-transparent text-ud-secondary-600 hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple"} ${heading.level === 3 ? "pl-7" : "pl-4"}`}
                  >
                    {heading.label}
                  </a>
                ))}
              </nav>
            </aside>
          )}

          <article className={headings.length === 0 ? "lg:col-start-2" : undefined}>
            <MarkdownContent markdown={post.markdown} />
            <BlogPostMetrics slug={post.slug} initialLikes={post.likes} initialViews={post.views} />
          </article>
        </div>

        {recommendations.length > 0 && (
          <section className="mt-12 border-t border-ud-neutral-300 pt-6" aria-labelledby="more-reading-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="more-reading-title" className="text-xl font-extrabold tracking-tight sm:text-2xl">
                {intl.t("BlogMoreReading")}
              </h2>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-ud-auxiliary-purple hover:underline">
                {intl.t("BlogShowAll")} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {recommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.slug} post={recommendation} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
