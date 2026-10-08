"use client"

import { MarkdownContent } from "@/components/blog/MarkdownContent"

const glossary = {
  "closure": { key: "closure", term: "Closure", definition: "Uma **closure** é uma função que *lembra* do escopo onde foi criada.\n\nMesmo depois que esse escopo terminou, ela ainda acessa as variáveis dele." },
}

const filler = "Texto de apoio para empurrar o conteúdo e simular uma leitura real de um artigo longo. ".repeat(3)

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div id="lab-top">
        <MarkdownContent glossary={glossary} markdown={`Termo no começo: [closure](#glossary:closure) da linha. ${filler}`} />
        <div className="text-right"><MarkdownContent glossary={glossary} markdown={`${filler} termo no fim: [closure](#glossary:closure)`} /></div>
      </div>
      <div style={{ height: 1400 }} />
      <div id="lab-bottom"><MarkdownContent glossary={glossary} markdown={`Termo para o rodapé: [closure](#glossary:closure) aqui. ${filler}`} /></div>
      <div style={{ height: 900 }} />
    </main>
  )
}
