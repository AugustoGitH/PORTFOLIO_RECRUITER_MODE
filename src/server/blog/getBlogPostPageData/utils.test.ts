import { describe, expect, it } from "vitest"
import { getBlogPostHeadings } from "./utils"

describe("getBlogPostHeadings", () => {
  it("demotes body h1 headings and omits a duplicated document title", () => {
    expect(getBlogPostHeadings(
      "# Meu artigo\n\n# Contexto\n\n### Detalhes",
      "Meu artigo",
    )).toEqual([
      { id: "contexto", label: "Contexto", level: 2 },
      { id: "detalhes", label: "Detalhes", level: 3 },
    ])
  })

  it("ignores heading-like lines inside fenced code blocks", () => {
    expect(getBlogPostHeadings(
      "## Visível\n\n```md\n## Não é seção\n```\n\n## Final",
    )).toEqual([
      { id: "visivel", label: "Visível", level: 2 },
      { id: "final", label: "Final", level: 2 },
    ])
  })
})
