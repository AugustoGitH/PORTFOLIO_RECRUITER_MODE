export type GlossaryDefinition = {
  key: string
  term: string
  definition: string
}

export type GlossaryDictionary = Record<string, GlossaryDefinition>

export type MarkdownContentProps = {
  markdown: string
  documentTitle?: string
  glossary?: GlossaryDictionary
}
