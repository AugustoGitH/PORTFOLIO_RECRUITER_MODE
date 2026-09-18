import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { MarkdownContent } from "./main"

describe("MarkdownContent", () => {
  it("renders Markdown headings, emphasis and lists as semantic HTML", () => {
    const html = renderToStaticMarkup(createElement(MarkdownContent, {
      markdown: "# Título\n\nTexto com **destaque**.\n\n- Primeiro\n- Segundo",
    }))

    expect(html).toContain("<h1>Título</h1>")
    expect(html).toContain("<strong>destaque</strong>")
    expect(html).toContain("<ul>")
    expect(html).toContain("<li>Primeiro</li>")
  })
})
