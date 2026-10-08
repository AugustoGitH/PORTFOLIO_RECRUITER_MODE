"use client"

import Image from "next/image"
import { Check, Copy, Mail, MoreHorizontal, Share2 } from "lucide-react"
import { useRef, useState } from "react"
import { Popover } from "@/components/general/Popover"
import { useINTLContext } from "@/providers/intl"
import type { BlogPostShareProps } from "./types"

type ShareDestination = {
  label: string
  mark: string
  href: string
  className: string
}

export const BlogPostShare = ({ slug, title, excerpt }: BlogPostShareProps) => {
  const intl = useINTLContext()
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [didCopy, setDidCopy] = useState(false)
  const path = `/blog/${slug}`
  const absoluteUrl = typeof window === "undefined"
    ? path
    : new URL(path, window.location.origin).toString()
  const encodedUrl = encodeURIComponent(absoluteUrl)
  const encodedTitle = encodeURIComponent(title)
  const message = encodeURIComponent(`${title}\n${absoluteUrl}`)
  const destinations: ShareDestination[] = [
    {
      label: "WhatsApp",
      mark: "W",
      href: `https://wa.me/?text=${message}`,
      className: "bg-[#25D366] text-white",
    },
    {
      label: "LinkedIn",
      mark: "in",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      className: "bg-[#0A66C2] text-white",
    },
    {
      label: "X",
      mark: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      className: "bg-black text-white",
    },
  ]

  const copyLink = async () => {
    await navigator.clipboard.writeText(absoluteUrl)
    setDidCopy(true)
    window.setTimeout(() => setDidCopy(false), 1800)
  }

  const shareNatively = async () => {
    if (!navigator.share) return
    await navigator.share({ title, text: excerpt, url: absoluteUrl }).catch(() => undefined)
  }

  return (
    <Popover<HTMLButtonElement>
      name="blog-post-share"
      origin="right"
      arrow
      autoRepositionOnOverflow
      anchor={{
        ref: anchorRef,
        element: (state) => (
          <button
            ref={anchorRef}
            type="button"
            aria-expanded={state.show}
            onClick={state.onToggleShow}
            className="inline-flex items-center gap-2 rounded-md border border-ud-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple"
          >
            <Share2 size={16} aria-hidden="true" />
            {intl.t("BlogShare")}
          </button>
        ),
      }}
    >
      {(state) => (
        <div className="w-[min(22rem,calc(100vw-3rem))] p-2">
          <div className="overflow-hidden rounded-md border border-ud-neutral-300 bg-ud-neutral-100">
            <Image
              src={`${path}/opengraph-image`}
              alt={intl.t("BlogSharePreviewAlt")}
              width={1200}
              height={630}
              unoptimized
              className="aspect-[1200/630] w-full object-cover"
            />
            <div className="border-t border-ud-neutral-300 bg-white px-3 py-2.5">
              <p className="line-clamp-1 text-sm font-bold text-ud-neutral-950">{title}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-ud-secondary-600">
                augustowestphal.com.br
              </p>
            </div>
          </div>

          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-ud-secondary-600">
            {intl.t("BlogShareWith")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {destinations.map((destination) => (
              <a
                key={destination.label}
                href={destination.href}
                target="_blank"
                rel="noreferrer noopener"
                onClick={state.onClose}
                className="flex flex-col items-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium transition hover:bg-ud-neutral-200 focus-visible:outline-2 focus-visible:outline-ud-auxiliary-purple"
              >
                <span className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${destination.className}`}>
                  {destination.mark}
                </span>
                {destination.label}
              </a>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-ud-neutral-300 pt-2">
            <a
              href={`mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${excerpt}\n\n${absoluteUrl}`)}`}
              onClick={state.onClose}
              className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition hover:bg-ud-neutral-200 focus-visible:outline-2 focus-visible:outline-ud-auxiliary-purple"
            >
              <Mail size={15} aria-hidden="true" />
              {intl.t("BlogShareEmail")}
            </a>
            <button
              type="button"
              onClick={() => void copyLink()}
              className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition hover:bg-ud-neutral-200 focus-visible:outline-2 focus-visible:outline-ud-auxiliary-purple"
            >
              {didCopy
                ? <Check size={15} aria-hidden="true" />
                : <Copy size={15} aria-hidden="true" />}
              {intl.t(didCopy ? "BlogLinkCopied" : "BlogCopyLink")}
            </button>
          </div>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              type="button"
              onClick={() => {
                state.onClose()
                void shareNatively()
              }}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-ud-secondary-600 transition hover:bg-ud-neutral-200 hover:text-ud-neutral-950 focus-visible:outline-2 focus-visible:outline-ud-auxiliary-purple"
            >
              <MoreHorizontal size={15} aria-hidden="true" />
              {intl.t("BlogMoreShareOptions")}
            </button>
          )}
        </div>
      )}
    </Popover>
  )
}
