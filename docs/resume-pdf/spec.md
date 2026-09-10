# Currículo em PDF — Especificação

**Status:** Fase 1 implementada; validação visual e testes automatizados pendentes
**Última atualização:** 2026-09-10

**Escopo inicial:** download de um currículo padrão pelo CTA `Currículo` da seção About.

---

## 1. Problema e objetivo

O portfólio já é a fonte editorial do perfil profissional de Augusto. Manter uma cópia
manual do mesmo conteúdo em uma plataforma de currículo cria divergência, torna revisões
mais caras e não permite que o conteúdo publicado evolua junto com o portfólio.

O currículo deve ser um documento derivado dos mesmos fatos publicados no repositório.
Na primeira entrega haverá uma única variante estática, no idioma escolhido pelo visitante.
O desenho, porém, deve permitir que o administrador escolha futuramente quais modelos,
idiomas e focos ficam disponíveis, sem reescrever o gerador de PDF.

### Objetivos

- Baixar um PDF profissional, A4 e selecionável, pelo botão da seção About.
- Derivar o conteúdo de `constants/profile/` e as traduções de `constants/intl/terms.ts`.
- Nunca inventar, resumir livremente ou duplicar fatos do perfil.
- Preparar um catálogo de variantes para uma futura API/administração.

### Não objetivos da primeira entrega

- Painel administrativo, autenticação ou persistência da configuração.
- Currículo orientado a uma vaga, IA ou análise de requisitos.
- Preview no navegador, envio por e-mail, histórico de downloads ou métricas.
- Suportar uma nova fonte de conteúdo fora dos registros canônicos do perfil.

O currículo personalizado por vaga continua sendo uma evolução do modo recrutador (L2/L4)
e deve obedecer a regra de honestidade descrita em `docs/recruiter-mode/spec.md`.

---

## 2. Decisão: ferramenta e execução

Usar **`@react-pdf/renderer` 4.9.0** no servidor.

O pacote oferece componentes declarativos (`Document`, `Page`, `View` e `Text`) e renderiza
PDF no Node ou no browser. A implementação usará somente o caminho de servidor,
`renderToStream`, dentro de um Route Handler do Next. O handler consome o stream para compor a
resposta binária; isso preserva a API de renderização do servidor e deixa aberta uma evolução
futura para streaming direto:

- O PDF não depende do navegador, resolução ou fontes instaladas pelo visitante.
- A resposta pode ser entregue como `application/pdf` com `Content-Disposition: attachment`.
- A geração fica no ponto apropriado para contabilizar downloads ou buscar a configuração
  publicada quando isso existir.
- O layout do documento não acopla aos componentes visuais/Tailwind da página.

O handler declara `export const runtime = "nodejs"` e `export const dynamic = "force-dynamic"`.
`@react-pdf/renderer` está em `serverExternalPackages` no `next.config.ts`. Não usar Edge para
esta feature.

### Alternativas descartadas para a v1

| Alternativa | Motivo |
| --- | --- |
| `react-pdf` | É um visualizador de PDFs existentes, não o renderer de geração. |
| HTML/CSS + Playwright/Puppeteer | Requer binário Chromium e aumenta bastante o custo/complexidade do deploy. Só reavaliar se houver necessidade real de reproduzir HTML complexo. |
| `pdfkit` | É viável, porém é imperativo e exigiria construir manualmente a camada de layout que `@react-pdf/renderer` já fornece. |
| Geração no cliente | Dificulta consistência, telemetria e futura seleção de variantes; não traz benefício para o caso atual. |

Referências: [react-pdf — quick start](https://react-pdf.org/docs/v4),
[API Node do react-pdf](https://react-pdf.org/docs/v3/node) e
[Route Handlers do Next.js](https://nextjs.org/docs/app/getting-started/route-handlers).

---

## 3. Fonte de dados e limites de conteúdo

O PDF é uma projeção dos dados existentes; componentes React do portfólio não são fonte de
dados. A composição inicial usa:

| Seção do PDF | Fonte canônica atual | Regra |
| --- | --- | --- |
| Nome, cargo e apresentação | `ABOUT` | Usar nome e papéis declarados; não inferir senioridade. |
| Links de contato | `GROUP_LINKS` / `ABOUT.link` | Exibir somente os links públicos escolhidos para o currículo. |
| Experiência | `EXPERIENCES` | Empresa, período, descrição e skills. Manter o tipo profissional/voluntário visível. |
| Competências | `SKILLS` | Agrupar pelos `SkillKind`; não duplicar o vocabulário de skills. |
| Projetos | `PROJECTS` | Fora da primeira versão, até que os vínculos de skills planejados pelo modo recrutador estejam completos. |

Os registros atuais não possuem, de forma estruturada, cargo por experiência nem dados de
contato como e-mail/localização. A primeira versão não deve inventá-los a partir de texto.
Caso sejam necessários no layout escolhido, devem ser acrescentados como fatos explícitos em
`constants/profile/`, antes de serem exibidos.

O mapper de currículo deve remover as tags HTML usadas pelas descrições da página (por exemplo,
`<b>`), preservando apenas texto. Ele não deve reutilizar `dangerouslySetInnerHTML` nem HTML no
PDF.

---

## 4. Modelo de domínio proposto

Criar uma área isolada, por exemplo `src/features/resume/`, com os seguintes limites:

```text
features/resume/
  catalog/        # quais variantes podem ser servidas
  data/           # perfil editorial -> ResumeProfile
  documents/      # templates @react-pdf/renderer, sem dependência de UI web
  services/       # resolve variante, gera stream e nome do arquivo
```

O contrato não deve expor os tipos de UI atuais (`TagEntry`, ícones React ou tabs) ao template:

```ts
type ResumeLocale = "ptbr" | "en"
type ResumeFocus = "general" | string

type ResumeRequest = {
  slug: string
  locale: ResumeLocale
}

type ResumeDefinition = {
  slug: string
  template: "standard"
  focus: ResumeFocus
  enabledLocales: readonly ResumeLocale[]
}

type ResumeCatalog = {
  find(request: ResumeRequest): Promise<ResumeDefinition | null>
}
```

Na v1, `StaticResumeCatalog` resolve uma única entrada: `default`, template `standard`, foco
`general`, idiomas `ptbr` e `en`. O mapper recebe a definição e o locale, transforma os
registros de perfil em um `ResumeProfile` serializável e o documento recebe apenas esse modelo.

Quando existir admin, uma implementação `ApiResumeCatalog` poderá substituir o catálogo
estático sem alterar a rota, o mapper ou os templates. A API futura deve publicar somente
definições já validadas; o conteúdo de carreira continua vindo da fonte canônica do perfil até
que uma migração editorial explícita seja aprovada.

---

## 5. Entrega HTTP e integração com o botão

### Endpoint público

```text
GET /api/resumes/[slug]?locale=ptbr|en
```

Exemplo inicial:

```text
/api/resumes/default?locale=ptbr
```

Comportamento:

- `200`: corpo binário PDF, `Content-Type: application/pdf` e
  `Content-Disposition: attachment; filename="augusto-westphal-curriculo-ptbr.pdf"`.
- `400`: locale ausente ou fora da lista permitida.
- `404`: variante inexistente ou não publicada para o locale solicitado.
- `500`: falha de renderização; registrar apenas o erro técnico, sem dados pessoais extras.

O botão em `AboutSection` passa a apontar para esse endpoint usando o idioma atual do contexto
de internacionalização. O download abre em contexto normal de navegação; não é necessário
`target="_blank"` para o botão de currículo.

O endpoint é dinâmico por definição: ele lê query string, resolve catálogo e gera uma resposta
binária. A implementação envia `Cache-Control: no-store`; a resposta não é cacheada publicamente
antes de haver uma estratégia de versão do conteúdo/template.

### Implementação atual

- A rota está em `src/app/api/resumes/[slug]/route.ts` e valida explicitamente `ptbr` e `en`.
- `StaticResumeCatalog` atende somente o slug `default` nos dois idiomas.
- `toResumeProfile` ordena experiências por data inicial decrescente, remove HTML das descrições
  e entrega ao template somente strings e estruturas serializáveis.
- Os links selecionados para esta variante são GitHub e LinkedIn; Instagram não integra o PDF.
- O CTA de `AboutSection` usa `/api/resumes/default?locale=${intl.language}`, sem `target`.

---

## 6. Template `standard` (v1)

O primeiro template deve priorizar leitura por recrutadores e sistemas ATS:

1. Cabeçalho: nome, papel profissional e links públicos selecionados.
2. Resumo profissional factual.
3. Experiência em ordem cronológica decrescente, com período, organização, tipo, descrição e
   tecnologias relevantes.
4. Competências agrupadas por categoria.
5. Rodapé com número de página e URL do portfólio, se ela estiver declarada como dado público.

Requisitos visuais:

- A4, margens consistentes e no máximo duas páginas na configuração inicial.
- Texto real, pesquisável e copiável; não gerar o currículo como imagem/canvas.
- Contraste suficiente, sem depender apenas de cor para distinguir categorias.
- Quebras de página previsíveis: experiência não deve iniciar no fim de uma página sem espaço
  para seu conteúdo mínimo.
- A implementação atual usa a família padrão Helvetica do renderer, sem depender de fonte
  instalada no servidor. Registrar uma fonte TTF embutida continua pendente caso a identidade
  tipográfica precise sair das fontes padrão do PDF.

O template não precisa reproduzir o design do site. A identidade deve ser sóbria e estável para
leitura/impressão.

---

## 7. Evolução para seleção administrativa

O admin futuro administra a publicação, não edita silenciosamente o currículo em outra fonte.
Cada variante deve conter, no mínimo:

| Campo | Uso |
| --- | --- |
| `slug` | Identificador estável na URL pública. |
| `template` | Modelo visual, como `standard` ou uma futura variação. |
| `focus` | Intenção editorial, como `general`, `frontend` ou `fullstack`. |
| `enabledLocales` | Idiomas que podem ser baixados. |
| `status` | Rascunho/publicado/arquivado. |
| `contentVersion` | Permite invalidar cache e auditar o que foi publicado. |

Focos futuros podem selecionar e ordenar fatos já existentes, mas não criar alegações novas.
Uma variante por vaga pertence ao fluxo recrutador e deve carregar o contexto/versão da análise
na URL, conforme a especificação desse modo.

---

## 8. Fases e critérios de aceite

### Fase 0 — preparação editorial

- Confirmar links que devem aparecer e adicionar somente fatos profissionais que ainda não
  existem estruturados (se necessários).
- Concluir a fonte canônica de skills prevista no modo recrutador antes de depender dela em
  diferentes registros.
- Definir o texto de resumo por locale, caso a apresentação do About não seja adequada em PDF.

**Estado:** não foram criados fatos editoriais novos. A variante reutiliza a apresentação atual
do About e as skills atuais; a centralização das skills permanece trabalho independente do modo
recrutador.

### Fase 1 — currículo padrão estático — implementada

- [x] Adicionar `@react-pdf/renderer`.
- [x] Implementar catálogo estático, mapper, template `standard` e Route Handler Node.
- [x] Conectar o botão `Currículo` ao endpoint com o locale atual.
- [x] Produzir PDF PT-BR e EN a partir dos mesmos fatos.

Verificado: `npm run build` e `npx tsc --noEmit` passam com a rota incluída no build. A inspeção
manual dos documentos e a confirmação da assinatura `%PDF` ficam na Fase 2, pois o servidor local
não estava acessível neste ambiente de execução.

### Fase 2 — qualidade e observabilidade

- Testes unitários do mapper (locale, ordem, exclusões e remoção de HTML).
- Teste de integração da rota (status, headers e assinatura `%PDF`).
- Revisão visual manual dos dois documentos em leitor desktop e mobile.
- Métrica de download, se o contrato de métricas já estiver definido.

### Fase 3 — catálogo remoto/admin

- Persistir definições de variantes e implementar `ApiResumeCatalog`.
- Seleção de templates, idiomas e foco no admin.
- Versionamento/invalidação de cache e auditoria de publicação.

### Fase 4 — currículo contextual do modo recrutador

- Integrar análise L2, ranking determinístico e contexto compartilhável.
- Gerar PDF específico para a vaga apenas a partir de evidências já publicadas.

---

## 9. Riscos e decisões pendentes

| Item | Encaminhamento |
| --- | --- |
| Dados de cargo/contato ausentes | Não inferir; incluir em constantes somente após confirmação editorial. |
| Descrições longas | O template controla quebra/paginação; não truncar fatos sem uma regra editorial aprovada. |
| Logos/imagens | Não incluir na v1; reduz tamanho e riscos de renderização, sem prejudicar ATS. |
| Métrica atual de currículo | É estática; não conectá-la até existir contrato de API real. |
| Conteúdo para ATS | Manter texto semântico, sem colunas essenciais ou gráficos que carreguem informação única. |
| Fonte customizada | O template usa Helvetica padrão. Se uma fonte de marca for necessária, incluir os arquivos TTF no repositório e registrá-los com `Font.register`. |
