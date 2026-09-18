"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ArrowRight, BookOpenText, Clock3, Coffee, Sparkles } from "lucide-react"
import { Chip } from "@/components/action/Chip"
import { AsciiArt } from "@/components/general/AsciiArt"
import { useINTLContext } from "@/providers/intl"
import type { BlogLandingProps, BlogListingPost } from "./types"

const articleArt = [
  { src: "/assets/blog/cache-blocks.png", alt: "BlogCacheArtAlt", width: 320, height: 213 },
  { src: "/assets/blog/api-windows.png", alt: "BlogApiArtAlt", width: 170, height: 97 },
  { src: "/assets/blog/debug-bug.png", alt: "BlogBugArtAlt", width: 150, height: 100 },
] as const

const readingOptions = [2, 5, 10] as const

export const BlogLanding = ({ posts }: BlogLandingProps) => {
  const intl = useINTLContext()
  const [readingLimit, setReadingLimit] = useState<number | null>(5)
  const visiblePosts = readingLimit === null ? posts : posts.filter((post) => post.minutes <= readingLimit)
  const [featured, ...secondary] = visiblePosts
  const quickReads = visiblePosts.slice(3, 8)

  const readingTime = (minutes: number) => intl.t("BlogReadingMinutes", { minutes })

  const articleMeta = (post: BlogListingPost) => (
    <span className="inline-flex items-center gap-1.5 text-xs text-ud-secondary-600">
      <Clock3 size={15} aria-hidden="true" />
      {readingTime(post.minutes)}
    </span>
  )

  return (
    <main className="min-h-screen bg-ud-neutral-100 text-ud-neutral-999">
      <section className="portfolio-hero w-full px-4 pb-7 pt-10">
        <div className="mx-auto grid min-h-72 w-full max-w-[calc(64rem-2rem)] items-center gap-7 md:grid-cols-[1fr_0.95fr]">
          <div className="relative z-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-ud-auxiliary-purple">
              {intl.t("Blog")}
            </p>
            <h1 className="max-w-[560px] text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-ud-neutral-999 sm:text-5xl lg:text-[3.6rem]">
              {intl.t("BlogHeroTitleFirst")}<br />{intl.t("BlogHeroTitleSecond")}
            </h1>
            <p className="mt-4 max-w-[560px] text-base leading-relaxed text-ud-secondary-600 sm:text-lg">
              {intl.t("BlogHeroDescription")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={intl.t("BlogReadingTimeFilter")}>
              {readingOptions.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  aria-pressed={readingLimit === minutes}
                  onClick={() => setReadingLimit(minutes)}
                  className={`min-w-20 rounded border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple ${readingLimit === minutes ? "border-ud-auxiliary-purple bg-ud-auxiliary-purple text-white" : "border-ud-neutral-300 bg-white hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple"}`}
                >
                  {intl.t("BlogMinutesOption", { minutes })}
                </button>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-72 items-end justify-center md:flex">
            <AsciiArt
              src="/assets/blog/hero-developer.png"
              alt={intl.t("BlogHeroArtAlt")}
              width={420}
              columns={112}
              rows={45}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pb-20">

        {featured ? (
          <section className="mt-7 grid gap-4 lg:grid-cols-[1.58fr_1fr]" aria-label={intl.t("BlogFeaturedArticles")}>
            <article className="group relative flex min-h-80 flex-col overflow-hidden rounded-md border border-ud-neutral-300 bg-white p-6 transition-shadow hover:shadow-md sm:p-7">
              <div className="relative z-10 max-w-[57%] max-sm:max-w-full">
                <Chip>
                  {featured.category ?? intl.t("BlogArticle")}
                </Chip>
                <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-[-0.035em] sm:text-3xl">
                  <Link href={`/blog/${featured.slug}`} className="focus-visible:outline-2 focus-visible:outline-ud-auxiliary-purple">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ud-secondary-600 sm:text-base">
                  {featured.excerpt}
                </p>
              </div>
              <div className="pointer-events-none absolute bottom-6 right-0 hidden w-[46%] justify-end overflow-hidden sm:flex">
                <Image
                  src={articleArt[0].src}
                  alt={intl.t(articleArt[0].alt)}
                  width={articleArt[0].width}
                  height={articleArt[0].height}
                  className="h-auto w-full max-w-[320px] object-contain"
                />
              </div>
              <div className="relative z-10 mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
                {articleMeta(featured)}
                <Link href={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 rounded bg-ud-auxiliary-purple px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple">
                  {intl.t("BlogContinueReading")} <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {secondary.slice(0, 2).map((post, index) => (
                <article key={post.slug} className="group relative flex min-h-40 flex-col overflow-hidden rounded-md border border-ud-neutral-300 bg-white p-5 transition-shadow hover:shadow-md">
                  <div className="relative z-10 max-w-[66%]">
                    <span className="inline-flex rounded-md bg-ud-auxiliary-purple/15 px-2 py-1 text-[10px] font-semibold uppercase text-ud-neutral-999">
                      {post.category ?? intl.t("BlogArticle")}
                    </span>
                    <h3 className="mt-2 text-lg font-extrabold leading-snug tracking-[-0.025em]">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ud-secondary-600">{post.excerpt}</p>
                  </div>
                  <div className="pointer-events-none absolute right-0 top-8 hidden overflow-hidden sm:block">
                    <Image
                      src={articleArt[index + 1].src}
                      alt={intl.t(articleArt[index + 1].alt)}
                      width={articleArt[index + 1].width}
                      height={articleArt[index + 1].height}
                      className="h-auto object-contain"
                    />
                  </div>
                  <div className="relative z-10 mt-auto flex items-center justify-between gap-2 pt-4">
                    {articleMeta(post)}
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-medium text-ud-auxiliary-purple hover:underline">
                      {intl.t("BlogContinueReading")} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
              {secondary.length === 0 && (
                <div className="flex min-h-40 items-center rounded-md border border-dashed border-ud-neutral-300 bg-white p-6 text-sm text-ud-secondary-600">
                  {intl.t("BlogMoreArticlesSoon")}
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="mt-7 grid min-h-72 items-center gap-4 rounded-md border border-ud-neutral-300 bg-white p-6 sm:grid-cols-[1fr_300px] sm:p-8">
            <div>
              <span className="inline-flex rounded-md bg-ud-auxiliary-purple/15 px-2.5 py-1 text-[11px] font-semibold uppercase text-ud-neutral-999">
                {intl.t("BlogEditorial")}
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">{intl.t("BlogEmptyTitle")}</h2>
              <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-ud-secondary-600 sm:text-base">
                {posts.length ? intl.t("BlogFilterEmpty") : intl.t("BlogEmptyDescription")}
              </p>
              {posts.length > 0 && (
                <button type="button" onClick={() => setReadingLimit(null)} className="mt-5 inline-flex items-center gap-2 font-medium text-ud-auxiliary-purple hover:underline">
                  {intl.t("BlogShowAll")} <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="hidden overflow-hidden sm:block">
              <Image
                src={articleArt[0].src}
                alt={intl.t(articleArt[0].alt)}
                width={articleArt[0].width}
                height={articleArt[0].height}
                className="h-auto w-full object-contain"
              />
            </div>
          </section>
        )}

        <section className="mt-6 border-t border-ud-neutral-300 pt-6" aria-label={intl.t("BlogCoffeeTitle")}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Coffee size={36} strokeWidth={1.5} className="text-ud-auxiliary-purple" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">{intl.t("BlogCoffeeTitle")}</h2>
                <p className="text-xs text-ud-secondary-600">{intl.t("BlogCoffeeDescription")}</p>
              </div>
            </div>
            {posts.length > 0 && (
              <button type="button" onClick={() => setReadingLimit(null)} className="inline-flex items-center gap-2 text-sm font-medium text-ud-auxiliary-purple hover:underline">
                {intl.t("BlogShowAll")} <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          {quickReads.length > 0 ? (
            <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-5">
              {quickReads.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex min-h-24 gap-3 border-t border-ud-neutral-300 py-4 transition-colors hover:text-ud-auxiliary-purple sm:border-l sm:border-t-0 sm:px-3 lg:first:border-l-0 lg:first:pl-0">
                  {index % 2 === 0 ? <BookOpenText size={25} strokeWidth={1.5} className="shrink-0" aria-hidden="true" /> : <Sparkles size={25} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />}
                  <span className="flex flex-col gap-2">
                    <span className="line-clamp-2 text-xs font-medium leading-snug">{post.title}</span>
                    {articleMeta(post)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-md border border-dashed border-ud-neutral-300 p-4 text-sm text-ud-secondary-600">
              {intl.t("BlogMoreArticlesSoon")}
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
