import Image from "next/image"
import { ArrowRight, Clock3, Coffee, Eye, Heart } from "lucide-react"
import { Button } from "@/components/action/Button"
import { Chip } from "@/components/action/Chip"
import { ResponsiveAsciiArt } from "@/components/general/AsciiArt"
import { TitleSection } from "@/components/general/TitleSection"
import { Container } from "@/components/layout/Container"
import { SECTIONS } from "@/constants/profile"
import { useINTLContext } from "@/providers/intl"
import { cn } from "@/utils/tailwind"
import { estimateReadingMinutes } from "@/utils/date"
import { getLocalizedValue } from "@/utils/intl"
import type { BlogHighlightSectionProps } from "./types"

const fallbackArtwork = {
  src: "/assets/blog/hero-developer.png",
} as const

export const BlogHighlightSection = ({ post, className }: BlogHighlightSectionProps) => {
  const intl = useINTLContext()
  const localizedPost = post ? getLocalizedValue(post.translations, intl.language) : null
  const publishedDate = post?.publishedAt
    ? new Intl.DateTimeFormat(intl.language === "ptbr" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(post.publishedAt))
    : null

  return (
    <Container
      id={SECTIONS.blog.value}
      className={cn("bg-ud-auxiliary-purple-light/40", className)}
    >
      <div>
        <div className="flex items-start justify-between gap-6">
          <TitleSection
            tag={intl.t("PortfolioBlogEyebrow")}
            title={intl.t("PortfolioBlogTitle")}
            subtitle={intl.t("PortfolioBlogDescription")}
          />
          <div className="hidden shrink-0 sm:block">
            <Button
              href="/blog"
              className="border-transparent px-0 text-ud-auxiliary-purple hover:border-transparent"
              endAdornment={<ArrowRight size={18} aria-hidden="true" />}
            >
              {intl.t("PortfolioBlogExplore")}
            </Button>
          </div>
        </div>

        <article className="mt-5 overflow-hidden rounded-md border border-ud-auxiliary-purple/20 bg-white">
          <div className="grid min-h-80 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.95fr)]">
            <div className="flex min-w-0 flex-col p-5 sm:p-7 lg:p-8">
              {post ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip className="gap-1.5">
                      <Coffee size={14} aria-hidden="true" />
                      {intl.t("PortfolioBlogPopular")}
                    </Chip>
                    <Chip tone="neutral">{localizedPost?.category ?? intl.t("BlogArticle")}</Chip>
                  </div>
                  <h3 className="mt-5 max-w-2xl text-2xl font-extrabold leading-tight tracking-[-0.03em] text-ud-neutral-950 sm:text-3xl">
                    {localizedPost?.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ud-secondary-600 sm:text-base">
                    {localizedPost?.subtitle ?? localizedPost?.excerpt}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ud-secondary-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={16} aria-hidden="true" />
                      {intl.t("BlogReadingMinutes", { minutes: localizedPost ? estimateReadingMinutes(localizedPost.markdown) : post.minutes })}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={16} aria-hidden="true" />
                      {intl.t("BlogViews", { views: post.views })}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Heart size={16} aria-hidden="true" />
                      {intl.t("PortfolioBlogLikes", { likes: post.likes })}
                    </span>
                    {publishedDate && (
                      <span>{intl.t("PortfolioBlogPublished", { date: publishedDate })}</span>
                    )}
                  </div>
                  <div className="inline-flex mt-7">
                    <Button
                      href={`/blog/${localizedPost?.slug ?? post.slug}`}
                      highlight
                      endAdornment={<ArrowRight size={17} aria-hidden="true" />}
                    >
                      {intl.t("BlogContinueReading")}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-start justify-center">
                  <Chip>{intl.t("BlogEditorial")}</Chip>
                  <h3 className="mt-4 text-2xl font-extrabold text-ud-neutral-950 sm:text-3xl">
                    {intl.t("BlogEmptyTitle")}
                  </h3>
                  <p className="mt-3  text-sm leading-relaxed text-ud-secondary-600 sm:text-base">
                    {intl.t("BlogEmptyDescription")}
                  </p>
                  <div className="mt-6">
                    <Button
                      href="/blog"
                      highlight
                      endAdornment={<ArrowRight size={17} aria-hidden="true" />}
                    >
                      {intl.t("PortfolioBlogExplore")}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex min-h-64 items-center justify-center overflow-hidden border-t border-ud-auxiliary-purple/20 p-6 lg:min-h-80 lg:border-t-0">
              {post?.cover ? (
                <div className="relative aspect-[4/3] w-full max-w-[420px]">
                  <Image
                    src={post.cover.url}
                    alt={localizedPost?.title ?? post.title}
                    fill
                    quality={60}
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-contain"
                  />
                </div>
              ) : (
                <ResponsiveAsciiArt
                  src={fallbackArtwork.src}
                  alt={intl.t("BlogHeroArtAlt")}
                  initialWidth={420}
                  columns={112}
                  rows={45}
                  wrapperClassName="max-w-[420px]"
                />
              )}
            </div>
          </div>
        </article>

        <Button
          href="/blog"
          className="mt-4 justify-center text-ud-auxiliary-purple sm:hidden"
          endAdornment={<ArrowRight size={18} aria-hidden="true" />}
        >
          {intl.t("PortfolioBlogExplore")}
        </Button>
      </div>
    </Container>
  )
}
