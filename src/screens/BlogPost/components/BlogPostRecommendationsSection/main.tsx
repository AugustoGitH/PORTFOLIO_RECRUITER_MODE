"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock3 } from "lucide-react"
import { Chip } from "@/components/action/Chip"
import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import { getLocalizedValue } from "@/utils/intl"
import type { BlogPostRecommendation } from "../../types"
import type { BlogPostRecommendationsSectionProps } from "./types"

const RecommendationCard = ({ post }: { post: BlogPostRecommendation }) => {
  const intl = useINTLContext()
  const localizedPost = getLocalizedValue(post.translations, intl.language)

  return (
    <article className="group grid min-h-44 grid-cols-[1fr_7rem] overflow-hidden rounded-md border border-ud-neutral-300 bg-white sm:grid-cols-[1fr_9rem]">
      <div className="flex min-w-0 flex-col p-5">
          <Chip size="sm">{localizedPost.category}</Chip>
        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-ud-neutral-999 sm:text-lg">
          <Link href={`/blog/${localizedPost.slug}`} className="focus-visible:outline-2 focus-visible:outline-ud-auxiliary-purple">{localizedPost.title}</Link>
        </h3>
        {localizedPost.subtitle && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ud-secondary-600">{localizedPost.subtitle}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5 text-ud-secondary-600"><Clock3 size={14} aria-hidden="true" />{intl.t("BlogReadingMinutes", { minutes: localizedPost.minutes })}</span>
          <Link href={`/blog/${localizedPost.slug}`} className="inline-flex items-center gap-1 font-medium text-ud-auxiliary-purple hover:underline">{intl.t("BlogContinueReading")} <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="relative bg-ud-auxiliary-purple-light">
        <Image src={post.cover?.url ?? "/assets/blog/api-windows.png"} alt="" fill sizes="144px" className={post.cover ? "object-cover" : "object-contain p-4"} />
      </div>
    </article>
  )
}

export const BlogPostRecommendationsSection = ({ recommendations }: BlogPostRecommendationsSectionProps) => {
  const intl = useINTLContext()
  if (recommendations.length === 0) return null

  return (
    <Container className="bg-ud-neutral-100 pb-20 pt-5 text-ud-neutral-999" contentClassName="max-w-5xl" aria-labelledby="more-reading-title">
      <div className="border-t border-ud-neutral-300 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="more-reading-title" className="text-xl font-extrabold tracking-tight sm:text-2xl">{intl.t("BlogMoreReading")}</h2>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-ud-auxiliary-purple hover:underline">{intl.t("BlogShowAll")} <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {recommendations.map((recommendation) => <RecommendationCard key={recommendation.slug} post={recommendation} />)}
        </div>
      </div>
    </Container>
  )
}
