import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Children, isValidElement, type ReactNode } from "react"
import { toSlug } from "@/utils/string"
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
    <div className="max-w-none break-words text-[15px] leading-7 text-ud-neutral-950 [&_a]:font-medium [&_a]:text-ud-auxiliary-purple [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:rounded-md [&_blockquote]:border [&_blockquote]:border-ud-auxiliary-purple/25 [&_blockquote]:border-l-4 [&_blockquote]:bg-ud-auxiliary-purple-light/55 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:text-ud-secondary-600 [&_blockquote_p]:my-0 [&_code]:rounded-sm [&_code]:bg-ud-neutral-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mb-4 [&_h1]:mt-2 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h2]:mb-2 [&_h2]:mt-9 [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h3]:mb-2 [&_h3]:mt-7 [&_h3]:scroll-mt-28 [&_h3]:text-xl [&_h3]:font-extrabold [&_hr]:my-9 [&_hr]:border-ud-neutral-300 [&_img]:my-7 [&_img]:max-w-full [&_img]:rounded-md [&_li]:my-1 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-ud-neutral-800 [&_pre]:bg-[#11182b] [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-[#eef1ff] [&_pre]:shadow-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-bold [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-ud-neutral-300 [&_td]:p-2 [&_th]:border [&_th]:border-ud-neutral-300 [&_th]:bg-ud-neutral-200 [&_th]:p-2 [&_th]:text-left [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
          h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
          a: ({ href, children }) => {
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
