# Aplicação

## Papel e execução

A aplicação é uma SPA React 19 executada pelo Next.js com App Router. Ela apresenta o perfil, projetos, experiências, depoimentos e ações de contato. Em desenvolvimento e produção, usa a porta `5173` pelos scripts da raiz.

```bash
npm run dev
npm run build
npm run lint
```

O ponto de entrada do App Router é `src/app/`: `layout.tsx` define o documento, metadata e providers globais; cada `page.tsx` adapta a rota e delega a apresentação para o módulo correspondente em `src/screens/`.

`layout.tsx` e os arquivos de rota `page.tsx` são Server Components. Não adicione `"use client"` a `app/` sem necessidade; declare a fronteira cliente no menor componente interativo possível dentro de `src/screens/`, providers ou componentes compartilhados.

## Estrutura

| Área | Onde procurar | Regra prática |
| --- | --- | --- |
| Rotas | `src/app/` | `page.tsx` adapta o contrato do App Router e delega dados e apresentação; não concentra consultas ou transformação de DTOs. |
| Páginas e composição | `src/screens/` | Cada página concentra sua composição e seus componentes exclusivos, como `Portfolio`, `Blog` e `BlogPost`. |
| Dados de página | `src/server/` | Leitura de request, autenticação, acesso a serviços, fallbacks e adaptação para props serializáveis. |
| Seções de conteúdo | `src/sections/` | Cada seção rende uma parte do portfólio (`About`, `Skills`, `Projects`, `Experiences`, `Testimonials` e `Congratulations`). |
| Componentes reutilizáveis | `src/components/` | `action` contém controles, `general` primitivas, `layout` estrutura, `text` tipografia e `wrapper` comportamento visual. |
| Features | `src/features/` | Fluxos de produto como métricas, feedback e recruiter mode. |
| Estado transversal | `src/providers/` | Internacionalização e modo recrutador. |
| Dados editoriais | `src/constants/profile/` | Fonte de perfil, skills, projetos, experiências, depoimentos e links de navegação. |
| Texto traduzível | `src/constants/intl/terms.ts` | Registro de termos PT/EN consumido por `useINTLContext().t(...)`. |
| Comportamento reutilizável | `src/hooks/`, `src/utils/` | Hooks de UI/navegação e funções puras. |
| APIs internas | `src/app/api/` | Route Handlers do Next; há health check em `api/health/route.ts`. |
| Backend interno | `backend/` | Código server-only de domínio e infraestrutura, incluído no build do Next. |

Arquitetura de renderização atual:

```mermaid
flowchart TD
  Entry[app/page.tsx] --> App[App]
  App --> Intl[INTLProvider]
  Intl --> Popover[PopoverProvider]
  Popover --> Recruiter[RecruiterModeProvider]
  Recruiter --> Main[MainProvider + Main]
  Main --> Layout[PageLayout]
  Layout --> Header
  Layout --> Sections[Seções do portfólio]
  Layout --> Footer
  Sections --> Profile[constants/profile]
  Sections --> Terms[INTLProvider]
```

## Convenções de código

- Pastas de componentes, hooks e módulos usam `main.tsx` ou `main.ts` para implementação, `types.ts` para contrato e `index.ts` para exportação pública. Em subáreas, há barrels adicionais para agrupamento.
- `src/components/` contém apenas peças compartilhadas entre páginas ou features. Um componente usado por uma única página fica em `src/screens/<Página>/components/`; tamanho ou complexidade, isoladamente, não justificam torná-lo genérico.
- O `main.tsx` de cada page é o mapa legível da página: ele compõe diretamente cabeçalho, seções e painéis de primeiro nível. Evite wrappers como `*Detail` que encapsulam a página inteira e apenas deslocam sua composição para outro arquivo. Componentes extraídos devem corresponder a uma responsabilidade visual ou comportamental concreta.
- Se um componente é uma seção de primeiro nível da página, seu nome termina obrigatoriamente em `Section`. Cada `*Section` usa `Container` como raiz e declara no próprio `Container` seu background e seus paddings. O `main.tsx` da page somente ordena essas seções; não centraliza background, largura ou espaçamento vertical delas em um wrapper externo.
- Páginas em `src/app/**/page.tsx` devem permanecer finas: recebem `params`/`searchParams`, chamam um módulo de `src/server/<domínio>/`, tratam controles próprios do roteador como `notFound()` e renderizam a tela. Consultas, autorização, acesso a headers/cookies, fallbacks, ordenação e mapeamento de dados não pertencem ao arquivo da rota.
- A camada de apresentação não depende da infraestrutura: módulos em `src/screens/` nunca importam de `src/server/` ou `src/app/`. Componentes são nomeados pelo domínio, sem o sufixo `Screen`.
- Use `@/` para módulos em `src/` e `@backend/` para módulos server-only em `backend/`; não atravesse a fronteira com imports relativos longos.
- `PropsWithClassName` e tipos comuns ficam em `src/utils/types/`; classes condicionais devem usar `cn` de `src/utils/tailwind`.
- Tailwind v4 é carregado por `@tailwindcss/postcss`. `src/app/globals.css` importa `src/index.css`, onde vivem os tokens `ud-*`, incluindo cores, espaçamento, sombras, z-index e animações. Reutilize tokens antes de criar valores arbitrários.
- A navegação de seção é baseada em hashes. `useHashNavigation` e `scrollToHash` cuidam do scroll e do offset do header; links novos precisam acompanhar `GROUP_SECTION_LINKS` em `constants/profile/page.ts` e um `id` compatível na seção.
- O projeto usa TypeScript estrito para símbolos não usados no frontend. Rode lint e build depois de alterar imports ou tipos.
- Código novo deve ser formatado e identado de forma legível: uma declaração, propriedade ou elemento JSX por linha quando a expressão deixar de ser curta. Não compacte componentes, schemas, objetos ou funções em linhas únicas; legibilidade e revisão têm prioridade sobre reduzir linhas.
- Mutações HTTP em componentes cliente usam `useMutation` do TanStack Query e a instância `http` de `src/libs/http/`; não implemente estados manuais de `fetch`, `pending` e erro. Garanta que a rota esteja abaixo de `QueryProvider`.

## Conteúdo e internacionalização

O frontend é guiado por dados: não espalhe fatos de perfil ou strings de interface em componentes quando eles podem viver nos registros abaixo.

- `about.tsx`: nome, papéis, descrição e links sociais.
- `skills.ts`: vocabulário de skills e tabs por `SkillKind`.
- `projects.tsx` e `experiences.tsx`: itens, categorias, datas, links e tags.
- `testimonials.ts` e `page.ts`: depoimentos e estrutura de navegação.
- `terms.ts`: cada termo suporta ao menos PT/EN e pode receber interpolação.

Hoje as skills de experiências são `TagEntry` literais, e projetos possuem `skill?` singular que ainda não é preenchido. A [spec do recruiter mode](recruiter-mode/spec.md) propõe centralizar esse vocabulário antes de implementar matching; não crie uma terceira fonte de skills.

## Testes

O projeto usa Vitest. Todo arquivo de teste deve ficar ao lado do módulo que exercita, com o sufixo `.test.ts` ou `.test.tsx`: por exemplo, `backend/feedback/services/main.test.ts` testa `main.ts` e `src/app/api/feedbacks/route.test.ts` testa o Route Handler correspondente. Não concentre testes em uma pasta global; mocks compartilhados podem ficar em `tests/mocks/`.

```bash
npm test
npm run test:watch
```

## Estado e integração com a API

`INTLProvider` oferece idioma e `t(term, variables)`. `RecruiterModeProvider` expõe apenas o booleano `isRecruiterMode` e operações de mudança; por enquanto, as seções não reagem a ele. O botão de formulário de recrutador é montado pelo provider para toda a aplicação.

`GET /api/health` está em `src/app/api/health/route.ts` e não é uma dependência de renderização da página principal. Não há API ou servidor separado fora do Next.

`backend/libs/db/mongo` exporta `getMongoClient()` e `getMongoDb()` para Route Handlers e Server Components. O módulo importa `server-only`, reutiliza a conexão durante o hot reload e só exige `MONGO_URL` quando alguma rota realmente acessa o banco. Copie `.env.example` para `.env.local` e não use o prefixo `NEXT_PUBLIC_` nessa variável.

Os modelos de cada domínio ficam junto do módulo: métricas usam `backend/metrics/models/`. Use `getLikesCollection(await getMongoDb())` e `getViewsCollection(await getMongoDb())` dentro de código server-side. `View` agora aponta para a coleção `views`, corrigindo o helper antigo que, por engano, apontava views para `likes`.

O layout lê o cookie `intl.language` e fornece o idioma inicial ao `INTLProvider`, mantendo o HTML e a hidratação no mesmo idioma. Sem cookie, usa `Accept-Language` para escolher entre inglês e português, com português como padrão. A troca de idioma atualiza o cookie e o atributo `lang` do documento. Uma preferência antiga em `localStorage` é migrada para o cookie após a hidratação.

## Metadata e publicação

O metadata base fica em `src/app/layout.tsx`, com ícone, Open Graph e Twitter Card. A imagem social é gerada em `src/app/opengraph-image.tsx`, sem depender de asset raster adicional.

Defina `NEXT_PUBLIC_SITE_URL` no ambiente de produção com a URL canônica do deploy. Sem essa variável, o projeto usa a URL pública atualmente registrada no portfólio como fallback.

As métricas do header são valores estáticos. Métricas e serviços de projeto continuam pontos de extensão, não fontes funcionais de dados; os stubs anteriores foram retirados sem publicar um contrato vazio.

## Trabalho em andamento: arte ASCII

Há mudanças locais não commitadas para converter imagens de perfil em arte de caracteres. A implementação centraliza a conversão em `src/utils/ascii/imageToAscii.ts`, a apresentação em `components/general/AsciiArt` e hooks em `hooks/media` e `hooks/observer`. A especificação funcional está em `ACII.spec.md`. Preserve esses arquivos ao trabalhar em outras áreas e mantenha a conversão como mecanismo compartilhado, não duplicado por seção.

## Onde encaixar mudanças comuns

| Necessidade | Local inicial |
| --- | --- |
| Nova seção no portfólio | `src/screens/Portfolio/components/`, depois `screens/Portfolio/main.tsx`, links de `constants/profile/page.ts` e termos. |
| Novo componente visual | `src/components/` na categoria adequada; só crie uma feature se houver fluxo de produto próprio. |
| Novo texto | `src/constants/intl/terms.ts`. |
| Novo dado de perfil | `src/constants/profile/`, mantendo tipo explícito. |
| Novo endpoint consumido | `src/app/api/` para Route Handlers ou uma feature/service próxima ao domínio; documente o contrato e mantenha o consumidor em `fetch`. |
| Mudança no modo recrutador | Leia primeiro `docs/recruiter-mode/spec.md`; o objetivo é reorganizar fatos existentes, sem inventá-los. |
| Blog editorial | Leia primeiro a [spec do blog](blog/spec.md); o conteúdo público é Markdown seguro e imagens entram somente pelo upload administrativo. |
