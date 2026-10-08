import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { MarkdownContent } from "./main"

describe("MarkdownContent", () => {
  it("renders Markdown headings, emphasis and lists as semantic HTML", () => {
    const html = renderToStaticMarkup(createElement(MarkdownContent, {
      markdown: "# Título\n\nTexto com **destaque**.\n\n- Primeiro\n- Segundo",
    }))

    expect(html).toContain('<h2 id="titulo"')
    expect(html).toContain('>Título</h2>')
    expect(html).toContain("<strong>destaque</strong>")
    expect(html).toContain("<ul>")
    expect(html).toContain("<li>Primeiro</li>")
  })

  it("keeps the page title as the only h1 without rewriting stored Markdown", () => {
    const html = renderToStaticMarkup(createElement(MarkdownContent, {
      documentTitle: "Título do artigo",
      markdown: "# Título do artigo\n\n## Primeira seção",
    }))

    expect(html).not.toContain("Título do artigo</h2>")
    expect(html).toContain('<h2 id="primeira-secao"')
    expect(html).toContain('>Primeira seção</h2>')
  })
})
