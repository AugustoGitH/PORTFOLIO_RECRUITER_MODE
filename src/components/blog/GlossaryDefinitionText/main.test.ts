import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { GlossaryDefinitionText } from "./main"

const render = (markdown: string) => renderToStaticMarkup(createElement(GlossaryDefinitionText, { markdown }))

describe("GlossaryDefinitionText", () => {
  it("renders bold and italic", () => {
    const html = render("um **forte** e *leve*")

    expect(html).toContain("<strong>forte</strong>")
    expect(html).toContain("<em>leve</em>")
  })

  it("keeps a hard break as a single line break and drops the br", () => {
    const html = render("linha 1\\\nlinha 2")

    expect(html).not.toContain("<br")
    expect(html).toContain("linha 1\nlinha 2")
  })

  it("unwraps syntax outside the inline subset instead of rendering it", () => {
    const html = render("# Título\n\n[link](https://x.dev)")

    expect(html).not.toMatch(/<(h1|a)[ >]/)
    expect(html).toContain("Título")
    expect(html).toContain("link")
  })
})
