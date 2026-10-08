import ReactMarkdown from "react-markdown"
import { cn } from "@/utils/tailwind"
import type { GlossaryDefinitionTextProps } from "./types"

const ALLOWED_ELEMENTS = ["p", "strong", "em", "br"]

/**
 * Renders a glossary definition: the inline subset of Markdown (bold, italic and line breaks)
 * the definition editor offers. Any other syntax is unwrapped to its plain text.
 *
 * Line breaks are kept by `whitespace-pre-line` on the paragraph, so a hard break (`\` + Enter)
 * and a plain Enter both break the line; the `<br>` is dropped to avoid breaking it twice.
 */
export const GlossaryDefinitionText = (props: GlossaryDefinitionTextProps) => (
  <div className={cn("break-words", props.className)}>
    <ReactMarkdown
      allowedElements={ALLOWED_ELEMENTS}
      unwrapDisallowed
      components={{
        p: ({ children }) => <p className="whitespace-pre-line [&:not(:first-child)]:mt-2">{children}</p>,
        br: () => null,
      }}
    >
      {props.markdown}
    </ReactMarkdown>
  </div>
)
