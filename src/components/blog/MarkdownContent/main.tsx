import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { toSlug } from "@/utils/string"
import { getGlossaryKeyFromHref } from "@/utils/blog"
import { GlossaryTerm } from "../GlossaryTerm"
import type { MarkdownContentProps } from "./types"

const nodeText = (node: ReactNode): string => Children.toArray(node)
  .map((child) => {
    if (typeof child === "string" || typeof child === "number") return String(child)
    if (isValidElement<{ children?: ReactNode }>(child)) return nodeText(child.props.children)
    return ""
  })
  .join("")

export const MarkdownContent = (props: MarkdownContentProps) => {
  const occurrences = new Map<string, number>()
  const headingId = (children: ReactNode) => {
    const baseId = toSlug(nodeText(children)) || "secao"
    const occurrence = (occurrences.get(baseId) ?? 0) + 1
    occurrences.set(baseId, occurrence)
    return occurrence === 1 ? baseId : `${baseId}-${occurrence}`
  }

  return (
    <div className="max-w-none break-words text-base leading-[1.7] text-ud-neutral-950 sm:text-[17px] lg:text-lg [&_a]:font-medium [&_a]:text-ud-neutral-950 [&_a]:decoration-ud-auxiliary-purple [&_a]:decoration-2 [&_a]:underline [&_a]:underline-offset-2 [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-ud-auxiliary-purple [&_a]:hover:text-ud-auxiliary-purple [&_blockquote]:my-6 [&_blockquote]:rounded-md [&_blockquote]:border [&_blockquote]:border-ud-auxiliary-purple/25 [&_blockquote]:border-l-4 [&_blockquote]:bg-ud-auxiliary-purple-light/55 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:text-ud-secondary-600 [&_blockquote_p]:my-0 [&_code]:rounded-sm [&_code]:bg-ud-neutral-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:leading-snug [&_hr]:my-10 [&_hr]:border-ud-neutral-300 [&_img]:my-8 [&_img]:max-w-full [&_img]:rounded-md [&_li]:my-1.5 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:my-[1.15em] [&_pre]:my-7 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:overscroll-x-contain [&_pre]:rounded-md [&_pre]:border [&_pre]:border-ud-neutral-800 [&_pre]:bg-[#11182b] [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-[#eef1ff] [&_pre]:shadow-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-bold [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-ud-neutral-300 [&_td]:p-2 [&_th]:border [&_th]:border-ud-neutral-300 [&_th]:bg-ud-neutral-200 [&_th]:p-2 [&_th]:text-left [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-7">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            if (props.documentTitle && toSlug(nodeText(children)) === toSlug(props.documentTitle)) {
              return null
            }
            return <h2 id={headingId(children)} style={{ scrollMarginTop: "var(--scroll-offset)" }}>{children}</h2>
          },
          h2: ({ children }) => <h2 id={headingId(children)} style={{ scrollMarginTop: "var(--scroll-offset)" }}>{children}</h2>,
          h3: ({ children }) => <h3 id={headingId(children)} style={{ scrollMarginTop: "var(--scroll-offset)" }}>{children}</h3>,
          table: (tableProps: ComponentPropsWithoutRef<"table">) => (
            <div className="my-7 max-w-full overflow-x-auto overscroll-x-contain rounded-sm">
              <table {...tableProps} />
            </div>
          ),
          a: ({ href, children }) => {
            const glossaryKey = getGlossaryKeyFromHref(href)
            if (glossaryKey) {
              return (
                <GlossaryTerm
                  referenceKey={glossaryKey}
                  entry={props.glossary?.[glossaryKey]}
                >
                  {children}
                </GlossaryTerm>
              )
            }

            const isExternal = href?.startsWith("http")
            return <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer noopener" : undefined}>{children}</a>
          },
        }}
      >
        {props.markdown}
      </ReactMarkdown>
    </div>
  )
}
