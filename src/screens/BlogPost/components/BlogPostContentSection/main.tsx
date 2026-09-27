"use client"

import { useEffect, useState } from "react"
import { MarkdownContent } from "@/components/blog/MarkdownContent"
import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import { BlogPostMetrics } from "../BlogPostMetrics"
import type { BlogPostContentSectionProps } from "./types"

export const BlogPostContentSection = ({ post, headings }: BlogPostContentSectionProps) => {
  const intl = useINTLContext()
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(() => headings[0]?.id ?? null)

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

        let currentHeading = headingElements[0].id
        for (const headingElement of headingElements) {
          if (headingElement.getBoundingClientRect().top > 112) break
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

  return (
    <Container className="bg-ud-neutral-100 py-7 text-ud-neutral-999" contentClassName="grid max-w-5xl items-start gap-8 lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:gap-12">
      {headings.length > 0 && (
        <aside className="hidden self-stretch lg:block">
          <nav aria-label={intl.t("BlogTableOfContents")} className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-l border-ud-neutral-300 pb-2">
            <p className="mb-3 pl-4 text-sm font-bold text-ud-neutral-999">{intl.t("BlogInThisArticle")}</p>
            {headings.map((heading) => (
              <a key={heading.id} href={`#${heading.id}`} aria-current={heading.id === activeHeadingId ? "location" : undefined} className={`block border-l-2 py-1.5 text-xs leading-snug transition ${heading.id === activeHeadingId ? "border-ud-auxiliary-purple font-semibold text-ud-auxiliary-purple" : "border-transparent text-ud-secondary-600 hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple"} ${heading.level === 3 ? "pl-7" : "pl-4"}`}>
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
    </Container>
  )
}
