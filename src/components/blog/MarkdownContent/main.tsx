import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { MarkdownContentProps } from "./types"

export const MarkdownContent = (props: MarkdownContentProps) => {
  return (
    <div className="max-w-none break-words text-sm leading-7 text-ud-neutral-950 [&_a]:text-ud-auxiliary-purple [&_a]:underline [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-ud-auxiliary-purple [&_blockquote]:pl-4 [&_blockquote]:text-ud-secondary-600 [&_code]:rounded-sm [&_code]:bg-ud-neutral-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mb-4 [&_h1]:mt-2 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-extrabold [&_hr]:my-8 [&_hr]:border-ud-neutral-300 [&_img]:my-6 [&_img]:max-w-full [&_img]:rounded [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-ud-neutral-950 [&_pre]:p-4 [&_pre]:text-ud-neutral-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-bold [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-ud-neutral-300 [&_td]:p-2 [&_th]:border [&_th]:border-ud-neutral-300 [&_th]:bg-ud-neutral-100 [&_th]:p-2 [&_th]:text-left [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.markdown}</ReactMarkdown>
    </div>
  )
}
