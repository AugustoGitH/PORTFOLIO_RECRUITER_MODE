"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ArrowRight, BookOpenText, Clock3, Coffee, Sparkles } from "lucide-react"
import { Chip } from "@/components/action/Chip"
import { AsciiArt } from "@/components/general/AsciiArt"
import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import type { BlogLandingProps, BlogListingPost } from "./types"

const emptyStateArt = {
  src: "/assets/blog/cache-blocks.png",
  alt: "BlogCacheArtAlt",
  width: 320,
  height: 213,
} as const

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
      <Container className="portfolio-hero pb-7 pt-10" contentClassName="max-w-[72rem]">
        <div className="grid min-h-72 items-center gap-7 md:grid-cols-[1fr_0.95fr]">
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
      </Container>

      <Container
        aria-label={intl.t("BlogFeaturedArticles")}
        className="pb-0 pt-7"
        contentClassName="max-w-[72rem]"
      >
        {featured ? (
          <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.68fr)_minmax(20rem,1fr)]">
            <article className="group relative flex min-h-80 flex-col overflow-hidden rounded-md border border-ud-neutral-300 bg-white p-6 transition-shadow hover:shadow-md sm:p-7">
              <div className={`relative z-10 ${featured.cover ? "max-w-[60%] max-sm:max-w-full" : "max-w-full"}`}>
                <Chip>
                  {featured.category ?? intl.t("BlogArticle")}
                </Chip>
                <h2 className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] lg:text-[2.25rem]">
                  <Link href={`/blog/${featured.slug}`} className="focus-visible:outline-2 focus-visible:outline-ud-auxiliary-purple">
                    {featured.title}
                  </Link>
                </h2>
                {featured.subtitle && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ud-secondary-600 sm:text-base">
                    {featured.subtitle}
                  </p>
                )}
              </div>
              {featured.cover && (
                <div className="pointer-events-none absolute inset-y-4 right-3 hidden w-[40%] items-center justify-center sm:flex lg:w-[42%]">
                  <Image
                    src={featured.cover.url}
                    alt={featured.title}
                    width={featured.cover.width}
                    height={featured.cover.height}
                    sizes="(min-width: 1152px) 320px, 40vw"
                    className="max-h-full w-full object-contain"
                  />
                </div>
              )}
              <div className="relative z-10 mt-auto flex flex-col items-start gap-3 pt-7">
                {articleMeta(featured)}
                <Link href={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 rounded bg-ud-auxiliary-purple px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple">
                  {intl.t("BlogContinueReading")} <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
              {secondary.slice(0, 2).map((post) => (
                <article key={post.slug} className="group relative flex min-h-40 min-w-0 flex-col overflow-hidden rounded-md border border-ud-neutral-300 bg-white p-5 transition-shadow hover:shadow-md">
                  <div className={`relative z-10 ${post.cover ? "max-w-[68%] max-sm:max-w-full" : "max-w-full"}`}>
                    <span className="inline-flex rounded-md bg-ud-auxiliary-purple/15 px-2 py-1 text-[10px] font-semibold uppercase text-ud-neutral-999">
                      {post.category ?? intl.t("BlogArticle")}
                    </span>
                    <h3 className="mt-2 text-xl font-extrabold leading-snug tracking-[-0.025em]">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.subtitle && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ud-secondary-600">
                        {post.subtitle}
                      </p>
                    )}
                  </div>
                  {post.cover && (
                    <div className="pointer-events-none absolute inset-y-3 right-3 hidden w-[29%] items-center justify-center sm:flex">
                      <Image
                        src={post.cover.url}
                        alt={post.title}
                        width={post.cover.width}
                        height={post.cover.height}
                        sizes="(min-width: 1024px) 140px, 30vw"
                        className="max-h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <div className="relative z-10 mt-auto flex flex-col items-start gap-2 pt-4">
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
          </div>
        ) : (
          <div className="grid min-h-72 items-center gap-4 rounded-md border border-ud-neutral-300 bg-white p-6 sm:grid-cols-[1fr_300px] sm:p-8">
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
                src={emptyStateArt.src}
                alt={intl.t(emptyStateArt.alt)}
                width={emptyStateArt.width}
                height={emptyStateArt.height}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        )}
      </Container>

      <Container
        aria-label={intl.t("BlogCoffeeTitle")}
        className="pb-20 pt-6"
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
        </div>
      </Container>
    </main>
  )
}
