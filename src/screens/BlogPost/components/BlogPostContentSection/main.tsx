"use client"

import { useEffect, useState } from "react"
import { MarkdownContent } from "@/components/blog/MarkdownContent"
import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import { getLocalizedValue } from "@/utils/intl"
import { BlogPostMetrics } from "../BlogPostMetrics"
import type { BlogPostContentSectionProps } from "./types"

export const BlogPostContentSection = ({ post, headings, glossary }: BlogPostContentSectionProps) => {
  const intl = useINTLContext()
  const localizedPost = getLocalizedValue(post.translations, intl.language)
  const localizedHeadings = getLocalizedValue(headings, intl.language)
  const localizedGlossary = getLocalizedValue(glossary, intl.language)
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(() => localizedHeadings[0]?.id ?? null)

  useEffect(() => {
    if (localizedHeadings.length === 0) return
    const scrollOffset = Number.parseFloat(
      window.getComputedStyle(document.documentElement).getPropertyValue("--scroll-offset"),
    ) || 0
    const elements = localizedHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)
      const next = visible[0]?.target.id
      if (next) setActiveHeadingId(next)
    }, {
      rootMargin: `-${scrollOffset}px 0px -62% 0px`,
      threshold: [0, 1],
    })
    elements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [localizedHeadings])

  const resolvedActiveHeadingId = localizedHeadings.some((heading) => heading.id === activeHeadingId)
    ? activeHeadingId
    : localizedHeadings[0]?.id ?? null

  const headingLinks = localizedHeadings.map((heading) => (
    <a
      key={heading.id}
      href={`#${heading.id}`}
      aria-current={heading.id === resolvedActiveHeadingId ? "location" : undefined}
      className={`block border-l-2 py-1.5 text-xs leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple ${heading.id === resolvedActiveHeadingId ? "border-ud-auxiliary-purple font-semibold text-ud-neutral-999" : "border-transparent text-ud-secondary-600 hover:border-ud-auxiliary-purple hover:text-ud-neutral-950"} ${heading.level === 3 ? "pl-7" : "pl-4"}`}
    >
      {heading.label}
    </a>
  ))

  return (
    <Container className="bg-ud-neutral-100 py-7 text-ud-neutral-999" contentClassName="grid max-w-5xl items-start gap-8 lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:gap-12">
      {localizedHeadings.length > 0 && (
        <aside className="hidden self-stretch lg:block">
          <nav aria-label={intl.t("BlogTableOfContents")} className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain border-l border-ud-neutral-300 pb-2">
            <p className="mb-3 pl-4 text-sm font-bold text-ud-neutral-999">{intl.t("BlogInThisArticle")}</p>
            {headingLinks}
          </nav>
        </aside>
      )}

      <article className={`min-w-0 max-w-[70ch] ${localizedHeadings.length === 0 ? "lg:col-start-2" : ""}`}>
        {localizedHeadings.length > 0 && (
          <details className="mb-7 rounded-md border border-ud-neutral-300 bg-white lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-ud-neutral-999 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple">
              {intl.t("BlogInThisArticle")}
            </summary>
            <nav aria-label={intl.t("BlogTableOfContents")} className="max-h-64 overflow-y-auto overscroll-contain border-t border-ud-neutral-300 py-2">
              {headingLinks}
            </nav>
          </details>
        )}
        <MarkdownContent
          markdown={localizedPost.markdown}
          documentTitle={localizedPost.title}
          glossary={localizedGlossary}
        />
        <BlogPostMetrics slug={post.slug} initialLikes={post.likes} initialViews={post.views} />
      </article>
    </Container>
  )
}
