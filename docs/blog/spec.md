# Blog editorial

**Status:** proposta para implementação em fases  
**Escopo inicial:** permitir que Augusto escreva, revise, publique e gerencie posts em Markdown pelo painel administrativo, com categorias, imagens anexadas e métricas públicas agregadas de visualizações e curtidas.

## Objetivo e limites

O blog amplia o portfólio com textos técnicos e editoriais do próprio Augusto. Não é uma plataforma multiautor, rede social, CMS genérico ou área de comentários.

A primeira versão oferece:

- listagem pública de posts publicados;
- página pública individual por `slug`;
- categorias controladas;
- criação, edição, publicação, arquivamento e remoção no painel;
- editor Markdown com abas **Editar** e **Prévia**;
- upload administrativo de imagens para o R2;
- uma curtida e uma visualização por visitante técnico, com métricas agregadas.

Ficam fora de escopo: comentários, newsletter, tags livres, busca full-text, autoria múltipla, agendamento de publicação, importação de CMS externo, embed arbitrário, MDX/JSX executável e métricas individuais identificáveis.

## Escolha técnica para Markdown

Usar `react-markdown` com `remark-gfm` para a prévia do painel e a renderização pública. A biblioteca produz elementos React em vez de injetar HTML e documenta esse modelo como seguro por padrão; `remark-gfm` adiciona tabelas, listas de tarefas e demais extensões GitHub Flavored Markdown. A renderização não habilita HTML bruto (`rehype-raw`) nesta fase. Se essa decisão mudar no futuro, qualquer HTML deve passar por `rehype-sanitize` com uma allowlist explícita. [react-markdown](https://github.com/remarkjs/react-markdown), [remark](https://github.com/remarkjs/remark), [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize)

O editor é deliberadamente simples: `Textarea` reutilizável como fonte do Markdown e duas abas locais:

- **Editar:** campo Markdown e botão para anexar imagem;
- **Prévia:** o mesmo conteúdo renderizado pelo componente compartilhado `MarkdownContent`.

Não adotar WYSIWYG na Fase 1. Editores como MDXEditor suportam upload por callback, mas não são necessários para o fluxo inicial e exigem fronteira client-only no App Router. [MDXEditor: imagens](https://mdxeditor.dev/editor/docs/images), [MDXEditor: Next.js](https://mdxeditor.dev/editor/docs/getting-started)

## Modelo de dados

```ts
type BlogCategory = {
  _id: ObjectId
  slug: string                 // único, minúsculo e estável
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

type BlogPost = {
  _id: ObjectId
  slug: string                 // único, minúsculo e estável
  status: "draft" | "published" | "archived"
  title: string
  excerpt: string              // resumo editorial, texto simples
  markdown: string             // fonte canônica; nunca HTML compilado
  categoryId: ObjectId
  coverMediaId?: ObjectId
  publishedAt?: Date
  archivedAt?: Date
  createdBy: ObjectId
  updatedBy: ObjectId
  createdAt: Date
  updatedAt: Date
}

type BlogMetric = {
  _id: ObjectId
  postId: ObjectId
  visitorId: string
  viewedAt?: Date
  likedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

Coleções: `blog_categories`, `blog_posts` e `blog_metrics`.

Índices obrigatórios:

- `blog_categories.slug` único;
- `blog_posts.slug` único;
- `blog_posts.status + publishedAt` descendente;
- `blog_posts.categoryId + status + publishedAt` descendente;
- `blog_metrics.postId + visitorId` único;
- `blog_metrics.postId + viewedAt` para agregação.

Categorias são um catálogo fechado administrado no painel. Um post tem exatamente uma categoria na Fase 1; não aceitar categorias livres no payload. Não permitir apagar categoria que tenha posts associados: o administrador deve reclassificar ou arquivar esses posts primeiro.

## Conteúdo, URLs e segurança

Campos administrativos são validados com Zod e payload estrito:

- `slug`: `^[a-z0-9-]+$`, único;
- `title`: 1–160 caracteres;
- `excerpt`: 1–320 caracteres, texto simples;
- `markdown`: 1–50.000 caracteres;
- categoria existente e explícita;
- apenas transições `draft → published`, `published → archived`, `archived → published`.

O Markdown é conteúdo, não código. Não habilitar HTML cru, JavaScript, iframes, estilos inline, componentes React nem URLs `javascript:`. Links externos devem receber `target="_blank"` e `rel="noreferrer noopener"`; links internos permanecem na mesma aba. Imagens renderizadas só aceitam URLs HTTPS e URLs do domínio público configurado para R2.

## Imagens e R2

O adaptador `backend/media/storage/` continua sendo a única fronteira para R2. A Fase 1 extrai o registro de mídia para um domínio genérico `backend/media/`, evitando que o blog dependa dos modelos de feedback profissional.

Uploads são somente administrativos:

1. `POST /api/admin/media/blog-image` requer `blog.manage` e same-origin.
2. Aceita JPEG, PNG ou WebP de até 5 MB e valida pelo decoder, não pelo MIME informado.
3. Remove EXIF, limita a maior dimensão a 1.920 px e converte para WebP.
4. Armazena em `blog/<postId-or-draft-id>/<uuid>.webp`, cria um `MediaAsset` e responde apenas com URL pública segura.
5. O painel insere `![texto alternativo](url)` na posição do cursor. O texto alternativo é obrigatório antes do upload.

Um upload de rascunho recebe um identificador temporário associado à sessão administrativa e deve ser limpo se não for associado a um post em 24 horas. Ao remover post ou substituir capa, objetos não referenciados são removidos do R2 e marcados como excluídos no catálogo de mídia. Não aceitar URLs pré-assinadas ou upload público.

## APIs e backend

O domínio fica em `backend/blog/{models,repositories,services,controllers}`. Rotas seguem controller → service → repository; componentes cliente nunca leem Mongo diretamente.

### Públicas

- `GET /blog`: Server Component; recebe apenas posts `published`, filtro opcional por categoria e paginação por cursor.
- `GET /blog/[slug]`: Server Component; busca somente post publicado e sua categoria.
- `POST /api/blog/posts/[slug]/view`: registra uma visualização idempotente por `visitor_id`.
- `POST /api/blog/posts/[slug]/like`: alterna a curtida do visitante e responde somente totais agregados.

As ações públicas usam `visitor_id` first-party existente, same-origin, payload mínimo, `Idempotency-Key` e rate limit. Nunca expõem o identificador, IP ou listas de quem curtiu. A métrica de view é registrada uma vez por visitante/post; a curtida pode alternar, com limite de abuso.

### Administrativas

- `GET|POST /api/admin/blog/categories` — `blog.read`/`blog.manage`;
- `PATCH|DELETE /api/admin/blog/categories/[id]` — `blog.manage`;
- `GET|POST /api/admin/blog/posts` — `blog.read`/`blog.manage`;
- `PATCH|DELETE /api/admin/blog/posts/[id]` — `blog.manage`;
- `POST /api/admin/media/blog-image` — `blog.manage`.

Permissões novas:

- `blog.read`: lista rascunhos, categorias e prévias no painel;
- `blog.manage`: cria, edita, publica, arquiva, remove e anexa imagens.

Toda mutação administrativa gera auditoria com `actorId`, ação, alvo e data. A auditoria não replica o corpo completo do Markdown.

## Painel administrativo

Criar `/admin/blog` como página protegida, com link no painel principal. Ela usa o padrão visual das recomendações:

1. lista compacta de posts com título, categoria, data e status;
2. um único formulário conectado ao post selecionado; sem seleção, o formulário cria um novo rascunho;
3. lista curta de categorias com formulário próprio para criar/renomear;
4. ações de publicar, arquivar e remover usam `useMutation` do TanStack Query e o componente `Button` com estado de loading;
5. invalidar `['admin-blog-posts']` e `['admin-blog-categories']` após toda mutação.

O formulário possui título, slug, resumo, seletor de categoria, editor, preview, capa opcional e ações editoriais. Alterações de texto ficam locais até **Salvar alterações**; não há autosave na primeira fase. A prévia mostra exatamente o componente público, sem contadores falsos nem dados administrativos.

## Renderização e cache públicos

Posts publicados são cacheados por tag `blog:published`; cada post também recebe `blog:post:<slug>`. Criar, editar, publicar, arquivar, remover, trocar capa ou categoria invalida a tag de lista, a tag do post envolvido e os caminhos públicos correspondentes.

Falha do Mongo não derruba o restante do portfólio: `/blog` mostra estado indisponível controlado; a página de um post devolve `notFound` ou erro genérico sem vazar infraestrutura. O blog não é carregado na página inicial.

## Métricas

O card e a página do post mostram totais públicos de visualizações e curtidas. A renderização inicial obtém totais agregados no servidor; o botão de curtida usa `useMutation` e atualiza apenas o post atual. Não incrementar view em re-render, preview, crawler conhecido ou chamada administrativa.

Não criar painel de analítica individual nesta fase. Se houver painel posterior, mostrar apenas agregados por post e intervalo.

## Testes e critérios de aceite

Testes Vitest ficam ao lado do módulo testado. Cobrir no mínimo:

- schema e transições de post;
- autorização de cada permissão;
- slug e categoria únicos;
- visibilidade exclusiva de `published` nas rotas públicas;
- Markdown sem HTML executável e URLs rejeitadas;
- processamento e limpeza de mídia por mock do adaptador R2;
- paginação determinística;
- uma view por visitante/post, toggle de like e totais agregados;
- invalidação de cache após mutações editoriais.

Critérios de aceite:

- visitantes veem apenas posts publicados e nunca rascunhos;
- administrador edita Markdown com prévia e anexa imagem sem expor credenciais R2;
- categorias são controladas e filtram a listagem pública;
- remoção limpa mídias não referenciadas;
- views e likes não expõem identidade do visitante;
- conteúdo Markdown não executa HTML ou JavaScript;
- todas as mutações administrativas exigem `blog.manage` e são auditadas.

## Fases

### Fase 1 — CMS editorial

Categorias, CRUD de posts, editor/preview Markdown, renderização pública, cache e R2 para imagens. Sem métricas interativas inicialmente se isso atrasar o fluxo editorial.

### Fase 2 — métricas públicas

Views idempotentes, likes, totais agregados e proteção de abuso.

### Fase 3 — operação

Busca, paginação avançada, capa responsiva, sitemap/RSS, SEO por post e possíveis agendamentos. Cada item requer decisão explícita de produto e privacidade.
