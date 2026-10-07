# Feedbacks rápidos do portfólio

**Status:** proposta para implementação em fase única  
**Escopo:** persistir as mensagens breves enviadas pelo formulário do portfólio, moderá-las no painel administrativo e exibir uma seleção pública segura.

## Objetivo e limites

Este fluxo é diferente dos [feedbacks profissionais](../feedback/spec.md): não solicita LinkedIn, identidade, imagem ou dados de contato. Ele serve para Augusto receber comentários espontâneos sobre o portfólio. Uma mensagem só aparece publicamente após moderação explícita e permanece anônima.

Cada registro contém somente a mensagem, o identificador técnico anônimo do visitante e o momento do envio. O conteúdo não é exposto por endpoint público nem volta para a página do portfólio.

## Identificação e privacidade

Reutilizar o cookie first-party `visitor_id` definido na [spec de métricas](../metrics/spec.md). O servidor o cria quando necessário e o obtém do cookie; o browser nunca envia `visitorId` no payload e não pode escolher o valor armazenado. O identificador é aleatório, não reversível e não deve ser combinado com IP, User-Agent, localização, fingerprint ou perfil.

Mensagem livre pode conter dado pessoal por iniciativa de quem envia. Por isso, não registrar o payload em logs nem publicar automaticamente. A moderação deve recusar textos com dados pessoais, spam ou conteúdo inadequado. A retenção inicial é de 90 dias e, após esse prazo, a coleção remove o documento por TTL. A política de privacidade deve informar o uso do identificador técnico, a retenção e a possibilidade de publicação anônima após revisão.

## Modelo MongoDB

```ts
type PortfolioFeedback = {
  _id: ObjectId
  message: string
  visitorId: string
  submittedAt: Date
  publicationConsent: boolean
  status: "pending" | "published"
  category?: "navigation" | "content" | "recruiter" | "design" | "general"
  publishedAt?: Date
}
```

Coleção: `portfolio_feedbacks`.

Índices obrigatórios:

- `submittedAt` descendente, para a listagem administrativa;
- TTL em `submittedAt` com expiração de 90 dias;
- `visitorId + submittedAt` descendente, para investigação limitada de abuso e rate limit.

Não criar campos de nome, e-mail, IP, estado de publicação, avatar ou vínculo com LinkedIn nesta fase. O `_id` é técnico e não é retornado à página pública.

## Contratos HTTP e domínio

### `POST /api/portfolio-feedbacks`

Recebe somente JSON estrito:

```json
{ "message": "Seu portfólio está muito claro.", "allowPublication": true }
```

O controller valida com Zod, remove espaços nas extremidades e aceita texto puro entre 1 e 1.000 caracteres. `allowPublication` é opcional e falso por padrão. HTML e Markdown não recebem interpretação especial. O controller lê/cria o `visitor_id`, obtém `submittedAt` do relógio do servidor e chama `PortfolioFeedbackService.submit`; o repository insere o documento. A resposta é `202 { "status": "received" }` com `Cache-Control: no-store`, sem ecoar mensagem ou identificador.

O endpoint segue os gates públicos: apenas `POST`, `application/json`, same-origin, limite de payload, `Origin`/CSRF, rate limit por `visitor_id` e IP/origem de rede, `Idempotency-Key` e erros genéricos. O limite inicial é de 3 envios por visitante e 10 por IP em 15 minutos; em produção o rate limit é distribuído, não um `Map` local.

### Painel administrativo

`GET /admin/feedbacks` exige `feedback.read` e é uma página Server Component que chama o service diretamente. Ela lista registros em ordem de `submittedAt` decrescente, paginada por cursor, e mostra mensagem, `visitorId`, estado, categoria e data/hora do servidor. Publicar ou ocultar exige `feedback.moderate`.

Se for necessário um endpoint interno para paginação client-side no futuro, ele será `GET /api/admin/portfolio-feedbacks?cursor=…`, também exigindo `feedback.read`, com DTO explícito e `Cache-Control: no-store`. A primeira entrega não precisa dele.

O módulo segue `backend/portfolio-feedbacks/{models,repositories,services,controllers}` e o fluxo controller -> service -> repository. A inserção pública não depende do painel; indisponibilidade do Mongo retorna erro genérico ao envio, sem comprometer a navegação do portfólio.

## Frontend

O formulário existente permanece minimalista: um único campo de texto e botão de envio. Ele usa os componentes reutilizáveis `Textarea` e `Button`, texto visível registrado em `constants/intl/terms.ts` e `useMutation` com a instância `http`. Durante a mutação, desabilita o envio; em sucesso, limpa o campo e mostra confirmação genérica; em falha, preserva o texto e mostra erro genérico.

A lateral da seção exibe no máximo os quatro comentários publicados mais recentes, ordenados por `publishedAt` decrescente. A publicação só é permitida quando `publicationConsent` é verdadeiro. O DTO público contém somente `id`, `message` e `category`: nunca inclui `visitorId`, consentimento, datas internas ou outros metadados. A seleção é carregada no servidor, cacheada e invalidada ao publicar ou ocultar uma mensagem.

## Critérios de aceite

- Um envio válido cria apenas `message`, `visitorId` e `submittedAt` no MongoDB.
- O cliente não consegue definir `visitorId`, data de envio ou campos extras.
- O painel autenticado com `feedback.read` lista os registros; somente quem possui `feedback.moderate` publica ou oculta uma mensagem.
- A vitrine pública mostra até quatro mensagens moderadas e não expõe `visitorId`.
- Conteúdo enviado não é interpretado como HTML e não aparece em logs ou respostas de erro.
- Limites, same-origin e idempotência bloqueiam abuso e duplicações.
- Registros expiram automaticamente após 90 dias.
- Testes cobrem schema, criação do cookie, rate limit, idempotência, ordenação/paginação e autorização do painel.

## Fora de escopo

- Identificação pública do visitante ou uso do comentário como depoimento profissional.
- Nome, e-mail, LinkedIn, anexos, imagens e respostas ao visitante.
- Notificações, analytics de sentimento, classificação por IA e exportação.
- Edição ou remoção manual no painel antes de haver uma necessidade operacional comprovada.
