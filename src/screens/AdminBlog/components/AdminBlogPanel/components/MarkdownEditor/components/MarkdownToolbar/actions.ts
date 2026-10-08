import type { LucideIcon } from "lucide-react"
import {
  BoldIcon,
  CodeIcon,
  Code2Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListChecksIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  StrikethroughIcon,
  TableIcon,
} from "lucide-react"
import type { MarkdownEdit, MarkdownEditState } from "../../types"
import { insertImage, insertLink, insertSnippet, prefixLines, wrapSelection } from "../../utils"

export type MarkdownToolbarAction = {
  id: string
  label: string
  description: string
  syntax: string
  shortcut?: string
  icon: LucideIcon
  run: (state: MarkdownEditState) => MarkdownEdit
}

const TABLE = "| Coluna | Coluna |\n| --- | --- |\n| Valor | Valor |\n"
const CODE_BLOCK_PLACEHOLDER = "código"

export const MARKDOWN_TOOLBAR_GROUPS: MarkdownToolbarAction[][] = [
  [
    { id: "h2", label: "Título", description: "Título de seção, aparece no sumário do artigo.", syntax: "## Título", icon: Heading2Icon, run: (s) => prefixLines(s, () => "## ", /^#{1,6}\s+/, "Título") },
    { id: "h3", label: "Subtítulo", description: "Subtítulo dentro de uma seção.", syntax: "### Subtítulo", icon: Heading3Icon, run: (s) => prefixLines(s, () => "### ", /^#{1,6}\s+/, "Subtítulo") },
  ],
  [
    { id: "bold", label: "Negrito", description: "Destaca o trecho selecionado em negrito.", syntax: "**texto**", shortcut: "Ctrl+B", icon: BoldIcon, run: (s) => wrapSelection(s, "**", "**", "negrito") },
    { id: "italic", label: "Itálico", description: "Deixa o trecho selecionado em itálico.", syntax: "*texto*", shortcut: "Ctrl+I", icon: ItalicIcon, run: (s) => wrapSelection(s, "*", "*", "itálico") },
    { id: "strike", label: "Tachado", description: "Risca o trecho selecionado.", syntax: "~~texto~~", icon: StrikethroughIcon, run: (s) => wrapSelection(s, "~~", "~~", "tachado") },
    { id: "code", label: "Código em linha", description: "Formata o trecho como código dentro da frase.", syntax: "`código`", shortcut: "Ctrl+E", icon: CodeIcon, run: (s) => wrapSelection(s, "`", "`", "código") },
  ],
  [
    { id: "ul", label: "Lista", description: "Transforma as linhas selecionadas em lista com marcadores.", syntax: "- item", icon: ListIcon, run: (s) => prefixLines(s, () => "- ", /^[-*+]\s+(?!\[[ xX]\])/, "item") },
    { id: "ol", label: "Lista numerada", description: "Transforma as linhas selecionadas em lista numerada.", syntax: "1. item", icon: ListOrderedIcon, run: (s) => prefixLines(s, (i) => `${i + 1}. `, /^\d+\.\s+/, "item") },
    { id: "task", label: "Lista de tarefas", description: "Lista de tarefas com caixas de seleção.", syntax: "- [ ] tarefa", icon: ListChecksIcon, run: (s) => prefixLines(s, () => "- [ ] ", /^-\s+\[[ xX]\]\s+/, "tarefa") },
    { id: "quote", label: "Bloco de citação", description: "Bloco de citação destacado (trecho citado de outra fonte). Não é referência de glossário: para isso use o painel Glossário.", syntax: "> citação", icon: QuoteIcon, run: (s) => prefixLines(s, () => "> ", /^>\s?/, "citação") },
  ],
  [
    { id: "link", label: "Link", description: "Cria um link para uma página externa.", syntax: "[texto](https://)", shortcut: "Ctrl+K", icon: LinkIcon, run: insertLink },
    { id: "image", label: "Imagem por URL", description: "Insere uma imagem a partir de uma URL. Para enviar um arquivo, use Anexar imagem.", syntax: "![descrição](https://)", icon: ImageIcon, run: insertImage },
    {
      id: "codeblock",
      label: "Bloco de código",
      description: "Bloco de código com várias linhas e destaque de sintaxe.",
      syntax: "```ts",
      icon: Code2Icon,
      run: (s) => {
        const selected = s.value.slice(s.start, s.end) || CODE_BLOCK_PLACEHOLDER
        const snippet = `\`\`\`ts\n${selected}\n\`\`\`\n`
        return insertSnippet(s, snippet, 6, 6 + selected.length)
      },
    },
    { id: "table", label: "Tabela", description: "Insere uma tabela de exemplo para editar.", syntax: "| Coluna | Coluna |", icon: TableIcon, run: (s) => insertSnippet(s, TABLE, 2, 8) },
    { id: "rule", label: "Divisor", description: "Linha horizontal que separa partes do texto.", syntax: "---", icon: MinusIcon, run: (s) => insertSnippet(s, "---\n", 4, 4) },
  ],
]

const SHORTCUTS: Record<string, string> = { b: "bold", i: "italic", k: "link", e: "code" }

export const findShortcutAction = (key: string) => {
  const id = SHORTCUTS[key.toLowerCase()]
  return MARKDOWN_TOOLBAR_GROUPS.flat().find((action) => action.id === id)
}
