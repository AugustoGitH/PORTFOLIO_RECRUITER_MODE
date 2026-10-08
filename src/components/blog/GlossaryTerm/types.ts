import type { PropsWithChildren } from "react"
import type { GlossaryDefinition } from "../MarkdownContent"

export type GlossaryTermProps = PropsWithChildren<{
  entry?: GlossaryDefinition
  referenceKey: string
}>
