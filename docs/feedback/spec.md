# Feedback profissional persistido

**Status:** proposta para implementação em fases  
**Escopo:** receber, moderar, publicar e remover feedbacks profissionais, incluindo avatares aprovados.

## Objetivo

O formulário atual é apenas visual e os depoimentos são estáticos. O novo fluxo recebe uma mensagem e um link opcional de LinkedIn, cria uma submissão privada e exige moderação humana antes de qualquer publicação.

## Entrada pública e LinkedIn

O formulário público tem somente `message` (obrigatória, texto puro, 20–1.500 caracteres), `linkedinUrl` (opcional, HTTPS em `linkedin.com`, até 2.048 caracteres) e um checkbox obrigatório de consentimento para eventual publicação após revisão. Nome, cargo, empresa, foto e e-mail não são solicitados.

O LinkedIn é uma referência voluntária para o administrador abrir manualmente. Não implementar Puppeteer, crawler, automação de navegador, login com credenciais do Augusto nem download de dados/foto do LinkedIn: o acordo da plataforma proíbe scripts, bots e crawlers para copiar perfis e dados. A URL não prova identidade ou vínculo profissional.

### Preenchimento editorial manual

Durante a moderação, o administrador abre o link informado e preenche manualmente `displayName`,
`role`, `company` e, quando houver autorização apropriada para publicação, associa uma foto pelo
upload administrativo. Esses valores não são importados nem sincronizados com o LinkedIn; são uma
decisão editorial revisável antes de publicar. OAuth/OpenID Connect do LinkedIn também fica fora do
escopo: para este fluxo simples, não justifica criar app, callback, tokens e manutenção de uma
integração externa.

## Estados

```text
submit -> pending -> approved -> published
                  \-> rejected
published -> archived | redacted
```

`pending` é privado; `approved` permite revisão editorial; `published` integra a vitrine; `rejected` expira por retenção; `archived` remove da vitrine; `redacted` remove/anomina dados por pedido da pessoa. Somente `feedback.moderate` muda estados ou conteúdo editorial; toda mutação é auditada.

## Dados MongoDB

```ts
type Feedback = {
  _id: ObjectId
  message: string
  linkedinUrl?: string // privado, nunca exibido automaticamente
  consent: { publishedAt: Date; version: string }
  status: "pending" | "approved" | "published" | "rejected" | "archived" | "redacted"
  editorial?: {
    displayName: string
    role?: string
    company?: string
    publicMessage: string
    profileImageId?: ObjectId
    linkedinUrl?: string // somente com consentimento específico para publicar
  }
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: ObjectId
  publishedAt?: Date
  retentionDeleteAt?: Date
  createdAt: Date
  updatedAt: Date
}

type MediaAsset = {
  _id: ObjectId
  provider: "r2"
  bucket: string
  key: string
  contentType: "image/webp"
  width: number
  height: number
  bytes: number
  publicUrl: string
  createdBy: ObjectId
  createdAt: Date
  deletedAt?: Date
}
```

Índices: `status + publishedAt`, `status + submittedAt`, TTL em `retentionDeleteAt` e chave de mídia única. Os dados editoriais existem somente após revisão; a aplicação nunca infere que alguém trabalhou com Augusto.

## Imagens: R2 com adaptador

Cloudflare R2 é o primeiro provedor, isolado em `backend/media/storage/` por uma interface `put`/`delete`. Seu acesso S3 permite trocar futuramente para S3, Backblaze ou equivalente sem alterar feedbacks. O bucket público contém apenas derivados aprovados em domínio próprio; originais, staging e credenciais nunca são públicos.

O R2 é apenas armazenamento: não compacta, recorta ou cria versões de imagem conforme os
parâmetros do consumidor. Portanto, a otimização canônica ocorre no servidor antes do upload.

O upload é exclusivamente administrativo:

1. `POST /api/admin/media/feedback-avatar` requer `feedback.moderate`.
2. O Route Handler Node limita a 5 MB, aceita JPEG/PNG/WebP e valida pelo decoder, não pelo MIME enviado pelo browser.
3. Remove EXIF, redimensiona/corta para avatar máximo `512×512` e converte para WebP com qualidade definida pelo produto.
4. Armazena somente o derivado público em chave não adivinhável como `feedback/<id>/avatar/<uuid>.webp`, cria `MediaAsset` e associa ao feedback aprovado. O original não é persistido.
5. Troca ou remoção apaga o objeto e invalida a URL pública; falhas entram em limpeza auditável.

Não há upload público, URL pré-assinada ou foto baixada do LinkedIn na Fase 1.

### Variantes e entrega

Na primeira versão, o avatar canônico de `512×512` WebP atende os pontos atuais da interface;
se houver benefício mensurável, o processamento no upload pode criar um conjunto pequeno e
fixo de derivados, como `96×96` e `192×192`. O frontend escolhe apenas entre essas variantes
conhecidas. Não aceitar parâmetros livres de largura, formato ou qualidade vindos do browser,
pois eles permitiriam criar combinações de cache e custo sem limite previsível.

Como evolução opcional, Cloudflare Images ou um Worker pode gerar variantes na borda a partir
do R2 e armazená-las em cache. Essa camada não substitui a validação, remoção de EXIF e
compactação prévia do upload; sua adoção requer decisão específica de custo, domínio e política
de variantes permitidas.

## APIs

`POST /api/feedbacks` valida Zod, consentimento e URL; usa gates públicos, origem same-origin e rate limit por `visitor_id`/IP. Cada `visitor_id` pode criar somente um feedback; a restrição é garantida por índice único no MongoDB. A rota cria `pending` e devolve `202 { "status": "received" }` com `no-store`.

`GET /api/feedbacks` retorna somente `published`, com DTO mínimo (`publicMessage`, nome, cargo, empresa e avatar aprovado). Nunca vaza texto original, LinkedIn privado, consentimento ou dados operacionais.

Admin: `GET /api/admin/feedbacks?status=pending` requer `feedback.read`; `PATCH /api/admin/feedbacks/:id`, upload e remoção de avatar requerem `feedback.moderate`. Todos seguem controller -> service -> repository, `requirePermission`, Zod, DTOs explícitos e auditoria.

## Frontend, segurança e fases

1. Evoluir `FeedbackForm` com `Input`, novo `Textarea`, LinkedIn opcional, consentimento e `useMutation`/`http`.
2. Exibir confirmação genérica; nenhuma submissão é publicada automaticamente.
3. A página pública é entregue pelo servidor já com a vitrine de depoimentos, sem um `GET /api/feedbacks` adicional no cliente. Porém, ela não pode depender de uma consulta ao Mongo a cada visita: a lista publicada é cacheada/revalidada como dado de servidor e a rota pode ser servida a partir do cache enquanto ocorre uma revalidação.
4. Se o cache ainda não existir, a consulta falhar ou o banco estiver indisponível, o service retorna os depoimentos estáticos atuais como fallback. O fallback é conteúdo público aprovado, versionado no repositório e não tenta chamar o banco novamente. Assim, indisponibilidade do Mongo não derruba nem esvazia a página pública.
5. Publicar, arquivar, redigir ou alterar um depoimento invalida a tag/cache da vitrine e revalida a rota pública. A próxima geração consulta o banco; se falhar, preserva o cache anterior quando houver ou usa o fallback estático. A estratégia usa também uma revalidação periódica curta/moderada como salvaguarda, sem polling no browser.
6. Migrar depoimentos estáticos por seed editorial. Eles permanecem como fallback até haver uma decisão explícita de removê-los; imagens existentes só entram no R2 após revisão de direitos/consentimento.

O seed idempotente é executado com `npm run feedback:seed-static`. Ele não associa os arquivos de imagem legados: cada avatar deve ser revisado e enviado pelo painel administrativo.

Produção exige rate limit distribuído; `Map` é apenas desenvolvimento. Mensagens são texto, sem HTML/markdown. Pendentes e rejeitados expiram por padrão em 90 dias, sujeito à política de privacidade; publicados permanecem até arquivamento ou remoção solicitada.

### Fase 1

Submissão, schemas, modelos, endpoints, fila `pending`, moderação e DTO público seguro.

### Fase 2

Adaptador R2, processamento e compactação canônica de avatar, seed revisado e contador `professionalFeedbacks` com itens publicados.

### Fase 3

Retenção, pedidos de remoção, auditoria completa e testes de abuso.

Critérios: sem publicação sem aprovação; sem scraping do LinkedIn; nenhum dado privado no endpoint público; mutações admin com permissão/auditoria; imagens derivadas sem EXIF e removíveis.

## Referências

- [LinkedIn User Agreement](https://www.linkedin.com/legal/user-agreement): veda bots, scripts e crawlers para copiar perfis e dados.
- [Cloudflare R2 S3 API](https://developers.cloudflare.com/r2/api/s3/): base do adaptador de storage.
- [R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/): referência futura, não usada no upload administrativo inicial.
- [Cloudflare Images](https://developers.cloudflare.com/images/): possível camada futura de variantes na borda.
