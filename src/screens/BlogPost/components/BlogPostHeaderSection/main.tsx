"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bookmark, Check, Share2 } from "lucide-react"
import { Chip } from "@/components/action/Chip"
import { Container } from "@/components/layout/Container"
import { ABOUT } from "@/constants/profile"
import { useINTLContext } from "@/providers/intl"
import { getLocalizedValue } from "@/utils/intl"
import type { BlogPostHeaderSectionProps } from "./types"

const savedPostKey = (slug: string) => `blog:saved:${slug}`

export const BlogPostHeaderSection = ({ post }: BlogPostHeaderSectionProps) => {
  const intl = useINTLContext()
  const localizedPost = getLocalizedValue(post.translations, intl.language)
  const pathname = usePathname()
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)
  const [didShare, setDidShare] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSaved(localStorage.getItem(savedPostKey(post.slug)) === "true")
  }, [post.slug])

  useEffect(() => {
    const localizedPath = `/blog/${localizedPost.slug}`
    if (pathname !== localizedPath) router.replace(localizedPath, { scroll: false })
  }, [localizedPost.slug, pathname, router])

  const toggleSaved = () => {
    const next = !isSaved
    localStorage.setItem(savedPostKey(post.slug), String(next))
    setIsSaved(next)
  }

  const share = async () => {
    const shareData = { title: localizedPost.title, text: localizedPost.excerpt, url: window.location.href }

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
    <Container className="bg-ud-neutral-100 pb-0 pt-7 text-ud-neutral-999" contentClassName="max-w-5xl">
      <nav aria-label={intl.t("BlogBreadcrumbLabel")} className="flex items-center gap-2 text-xs text-ud-secondary-600">
        <Link href="/" className="hover:text-ud-auxiliary-purple">{intl.t("Home")}</Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="hover:text-ud-auxiliary-purple">{intl.t("Blog")}</Link>
        <span aria-hidden="true">/</span>
        <span className="max-w-52 truncate font-medium text-ud-neutral-950">{localizedPost.category}</span>
      </nav>

      <header className="mt-4 overflow-hidden rounded-md border border-ud-neutral-300 bg-white">
        <div className="grid min-h-[19rem] lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col p-6 sm:p-8 lg:p-10">
            <Chip className="self-start">{localizedPost.category}</Chip>
            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-[-0.045em] text-ud-neutral-999 sm:text-4xl lg:text-[2.75rem]">{localizedPost.title}</h1>
            {localizedPost.subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ud-secondary-600 sm:text-lg">{localizedPost.subtitle}</p>}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <Image src="/assets/blog/debug-bug.png" alt="" width={44} height={44} className="size-11 rounded-full border border-ud-neutral-300 object-cover" />
                <p className="text-sm font-medium text-ud-neutral-950">
                  {ABOUT.name}
                  <span className="mx-2 text-ud-neutral-500">•</span>
                  <span className="font-normal text-ud-secondary-600">{intl.t("BlogReadingMinutes", { minutes: localizedPost.minutes })}</span>
                  {formattedDate && <span className="mt-0.5 block text-xs font-normal text-ud-secondary-600">{formattedDate}</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" aria-pressed={isSaved} onClick={toggleSaved} className="inline-flex items-center gap-2 rounded-md border border-ud-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple">
                  {isSaved ? <Check size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
                  {intl.t(isSaved ? "BlogSaved" : "BlogSave")}
                </button>
                <button type="button" onClick={() => void share()} className="inline-flex items-center gap-2 rounded-md border border-ud-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple">
                  {didShare ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
                  {intl.t(didShare ? "BlogLinkCopied" : "BlogShare")}
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-72 lg:min-h-full">
            <Image src={post.cover?.url ?? "/assets/blog/cache-blocks.png"} alt={post.cover ? localizedPost.title : intl.t("BlogCacheArtAlt")} fill priority sizes="(min-width: 1024px) 390px, 100vw" className={post.cover ? "object-contain" : "object-contain p-8 sm:p-12"} />
          </div>
        </div>
      </header>
    </Container>
  )
}
