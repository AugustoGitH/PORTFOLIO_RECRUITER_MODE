import type { MarkdownEdit, MarkdownEditState } from "./types"

const lineBounds = (value: string, start: number, end: number) => {
  const lastChar = end > start && value[end - 1] === "\n" ? end - 1 : end
  const lineEnd = value.indexOf("\n", lastChar)

  return {
    from: value.lastIndexOf("\n", start - 1) + 1,
    to: lineEnd === -1 ? value.length : lineEnd,
  }
}

export const wrapSelection = (
  state: MarkdownEditState,
  before: string,
  after: string,
  placeholder: string,
): MarkdownEdit => {
  const { value, start, end } = state
  const selected = value.slice(start, end)
  const isWrapped = value.slice(start - before.length, start) === before && value.slice(end, end + after.length) === after

  if (isWrapped) {
    return {
      value: value.slice(0, start - before.length) + selected + value.slice(end + after.length),
      start: start - before.length,
      end: end - before.length,
    }
  }

  const text = selected || placeholder
  return {
    value: value.slice(0, start) + before + text + after + value.slice(end),
    start: start + before.length,
    end: start + before.length + text.length,
  }
}

export const prefixLines = (
  state: MarkdownEditState,
  prefixFor: (index: number) => string,
  matcher: RegExp,
  placeholder: string,
): MarkdownEdit => {
  const { value, start, end } = state
  const { from, to } = lineBounds(value, start, end)
  const lines = (from === to ? placeholder : value.slice(from, to)).split("\n")
  const isApplied = from !== to && lines.every((line) => matcher.test(line))
  const next = lines
    .map((line, index) => isApplied ? line.replace(matcher, "") : `${prefixFor(index)}${line.replace(matcher, "")}`)
    .join("\n")

  return {
    value: value.slice(0, from) + next + value.slice(to),
    start: from,
    end: from + next.length,
  }
}

export const insertSnippet = (
  state: MarkdownEditState,
  snippet: string,
  selectFrom: number,
  selectTo: number,
): MarkdownEdit => {
  const { value, start, end } = state
  const needsBreak = start > 0 && value[start - 1] !== "\n"
  const lead = needsBreak ? "\n\n" : ""

  return {
    value: value.slice(0, start) + lead + snippet + value.slice(end),
    start: start + lead.length + selectFrom,
    end: start + lead.length + selectTo,
  }
}

export const insertLink = (state: MarkdownEditState): MarkdownEdit => {
  const { value, start, end } = state
  const label = value.slice(start, end) || "texto do link"
  const link = `[${label}](https://)`
  const urlStart = start + label.length + 3

  return {
    value: value.slice(0, start) + link + value.slice(end),
    start: urlStart,
    end: urlStart + "https://".length,
  }
}

export const insertImage = (state: MarkdownEditState): MarkdownEdit => {
  const { value, start, end } = state
  const alt = value.slice(start, end) || "descrição da imagem"
  const image = `![${alt}](https://)`
  const urlStart = start + alt.length + 4

  return {
    value: value.slice(0, start) + image + value.slice(end),
    start: urlStart,
    end: urlStart + "https://".length,
  }
}
