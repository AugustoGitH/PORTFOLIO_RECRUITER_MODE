# Feedbacks rápidos do portfólio

**Status:** proposta para implementação em fase única  
**Escopo:** persistir as mensagens breves enviadas pelo formulário do portfólio e exibi-las apenas no painel administrativo.

## Objetivo e limites

Este fluxo é diferente dos [feedbacks profissionais](../feedback/spec.md): não cria depoimento público, não solicita LinkedIn, identidade, imagem ou dados de contato, e não possui moderação editorial. Ele serve para Augusto receber comentários espontâneos sobre o portfólio.

Cada registro contém somente a mensagem, o identificador técnico anônimo do visitante e o momento do envio. O conteúdo não é exposto por endpoint público nem volta para a página do portfólio.

## Identificação e privacidade

Reutilizar o cookie first-party `visitor_id` definido na [spec de métricas](../metrics/spec.md). O servidor o cria quando necessário e o obtém do cookie; o browser nunca envia `visitorId` no payload e não pode escolher o valor armazenado. O identificador é aleatório, não reversível e não deve ser combinado com IP, User-Agent, localização, fingerprint ou perfil.

Mensagem livre pode conter dado pessoal por iniciativa de quem envia. Por isso, não registrar o payload em logs, não apresentar os registros publicamente e aplicar retenção inicial de 90 dias. Após esse prazo, a coleção remove o documento por TTL. A política de privacidade deve informar o uso do identificador técnico e a retenção de mensagens.

## Modelo MongoDB

```ts
type PortfolioFeedback = {
  _id: ObjectId
  message: string
  visitorId: string
  submittedAt: Date
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
{ "message": "Seu portfólio está muito claro." }
```

O controller valida com Zod, remove espaços nas extremidades e aceita texto puro entre 1 e 1.000 caracteres. HTML e Markdown não recebem interpretação especial. O controller lê/cria o `visitor_id`, obtém `submittedAt` do relógio do servidor e chama `PortfolioFeedbackService.submit`; o repository insere o documento. A resposta é `202 { "status": "received" }` com `Cache-Control: no-store`, sem ecoar mensagem ou identificador.

O endpoint segue os gates públicos: apenas `POST`, `application/json`, same-origin, limite de payload, `Origin`/CSRF, rate limit por `visitor_id` e IP/origem de rede, `Idempotency-Key` e erros genéricos. O limite inicial é de 3 envios por visitante e 10 por IP em 15 minutos; em produção o rate limit é distribuído, não um `Map` local.

### Painel administrativo

`GET /admin/feedbacks` exige `feedback.read` e é uma página Server Component que chama o service diretamente. Ela lista registros em ordem de `submittedAt` decrescente, paginada por cursor, e mostra somente mensagem, `visitorId` e data/hora do servidor formatada para o administrador. Não há endpoint público de leitura.

Se for necessário um endpoint interno para paginação client-side no futuro, ele será `GET /api/admin/portfolio-feedbacks?cursor=…`, também exigindo `feedback.read`, com DTO explícito e `Cache-Control: no-store`. A primeira entrega não precisa dele.

O módulo segue `backend/portfolio-feedbacks/{models,repositories,services,controllers}` e o fluxo controller -> service -> repository. A inserção pública não depende do painel; indisponibilidade do Mongo retorna erro genérico ao envio, sem comprometer a navegação do portfólio.

## Frontend

O formulário existente permanece minimalista: um único campo de texto e botão de envio. Ele usa os componentes reutilizáveis `Textarea` e `Button`, texto visível registrado em `constants/intl/terms.ts` e `useMutation` com a instância `http`. Durante a mutação, desabilita o envio; em sucesso, limpa o campo e mostra confirmação genérica; em falha, preserva o texto e mostra erro genérico. Não exibir contagem, histórico nem `visitorId` ao visitante.

## Critérios de aceite

- Um envio válido cria apenas `message`, `visitorId` e `submittedAt` no MongoDB.
- O cliente não consegue definir `visitorId`, data de envio ou campos extras.
- O painel autenticado com `feedback.read` lista os registros; visitantes não têm rota pública de leitura.
- Conteúdo enviado não é interpretado como HTML e não aparece em logs ou respostas de erro.
- Limites, same-origin e idempotência bloqueiam abuso e duplicações.
- Registros expiram automaticamente após 90 dias.
- Testes cobrem schema, criação do cookie, rate limit, idempotência, ordenação/paginação e autorização do painel.

## Fora de escopo

- Publicação ou moderação como depoimento profissional.
- Nome, e-mail, LinkedIn, anexos, imagens e respostas ao visitante.
- Notificações, analytics de sentimento, classificação por IA e exportação.
- Edição ou remoção manual no painel antes de haver uma necessidade operacional comprovada.

