# Migração da SPA para Next.js

**Status:** fases 1 a 4 implementadas; fase 5 pendente  
**Escopo:** aplicação na raiz e infraestrutura local  
**Princípio de execução:** preservar paridade visual antes de ampliar o produto

## 1. Objetivo

Transformar o portfólio Vite/React anterior em uma aplicação Next.js com App Router. O resultado preserva a experiência, as features e a estrutura de domínio atuais, absorve as APIs necessárias no próprio Next e mantém MongoDB para dados persistentes.

Esta migração não redesenha o portfólio, não altera o conteúdo editorial e não introduz features novas.

## 2. Decisões de arquitetura

| Decisão | Escolha | Motivo |
| --- | --- | --- |
| Framework | Next.js atual, App Router, na raiz | Mantém um único pacote e permite páginas, metadata e APIs no mesmo deploy. |
| Dados dinâmicos | MongoDB via driver oficial e módulo único de conexão | Métricas, feedback e recursos futuros ainda requerem persistência. |
| APIs | Route Handlers em `src/app/api/**/route.ts` | Substituem Fastify somente depois de cada contrato ter paridade. |
| Renderização | Server Components por padrão; Client Components somente para interação e APIs do navegador | Entrega HTML indexável sem quebrar os componentes interativos existentes. |
| Runtime único | Fastify removido; Route Handlers e MongoDB ficam no Next | Não havia rotas Fastify com comportamento ou consumidores além do health check já migrado. |

## 3. Estado de partida

- A raiz é Next.js 16, React 19, TypeScript e Tailwind CSS v4.
- A rota `/` é fornecida por `src/app/page.tsx`; a única tela monta seis seções em `src/screens/Main/main.tsx`.
- Há providers para idioma, popover e modo recrutador. Muitos componentes dependem de estado, `window` ou hooks e permanecerão client-side inicialmente.
- O conteúdo editorial pertence a `src/constants/profile/` e os textos traduzíveis a `src/constants/intl/terms.ts`.
- A conexão MongoDB e os modelos `Like` e `View` ficam em `backend/`; health check e adaptadores HTTP ficam em `src/app/api/`.
- Há trabalho local não commitado na arte ASCII. Ele não será incorporado, descartado nem refeito como efeito colateral desta migração.

## 4. Arquitetura-alvo

```text
./
├── backend/
│   ├── metrics/
│   ├── security/
│   └── libs/db/mongo/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── health/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   ├── constants/
│   ├── features/
│   ├── providers/
│   └── ...
├── next.config.ts
└── package.json
```

O diretório `src/app/` assume o papel de `main.tsx` como ponto de entrada. `App.tsx` preserva a composição client-side temporária e `screens/Main/` preserva a tela principal sem ser confundida com o Pages Router. Componentes atuais podem permanecer em seus diretórios enquanto são adaptados; não é necessário reorganizar toda a árvore para adotar Next.

## 5. Fases de execução

### Fase 0 — checkpoint e inventário

**Objetivo:** tornar a migração reversível e limitar o escopo.

1. Separar ou registrar o trabalho local de arte ASCII em um checkpoint próprio antes de tocar no build.
2. Registrar o baseline: build e lint atuais, rotas existentes, imagens, links de hash e comportamento do idioma.
3. Confirmar variáveis de ambiente e o banco Mongo usado em desenvolvimento.
4. Criar uma lista objetiva de paridade visual para desktop e mobile.

**Concluída quando:** o ponto de partida pode ser comparado e nenhuma mudança local não relacionada corre risco de ser perdida.

### Fase 1 — fundação Next sem mudança de produto

**Objetivo:** trocar o runtime e manter o portfólio renderizando em `/`.

1. Substituir scripts e configuração Vite por Next, mantendo TypeScript, ESLint e Tailwind.
2. Criar `src/app/layout.tsx` e `src/app/page.tsx`.
3. Mover o CSS global para a convenção do App Router e preservar os tokens `ud-*`.
4. Converter a árvore atual da página principal em uma ilha client-side temporária para manter providers, popovers, tabs, hash navigation e animações funcionando.
5. Trocar dependências exclusivas do Vite (`vite`, plugins e configuração) após o build Next passar.
6. Remover a URL absoluta de Axios; chamadas internas devem usar `/api` ou acesso server-side quando aplicável.

**Implementação:** Vite e Axios foram removidos; os assets locais foram movidos para `public/assets`; `src/app/` fornece layout, rota `/` e health check. A preferência de idioma foi ajustada para não ler `localStorage` no servidor. O build de produção passa com Webpack.

**Estado:** build e checagem de tipos passam. O lint possui violações legadas fora do escopo desta fase e deve ser tratado antes da publicação.

### Fase 2 — adaptação gradual para Server e Client Components

**Objetivo:** aproveitar Next sem forçar uma reescrita ampla.

1. Manter com `"use client"` apenas providers e componentes que usam hooks, eventos, `window`, canvas, `IntersectionObserver` ou estado.
2. Tornar o shell, metadata e conteúdo puramente editorial server-side quando isso não mudar o comportamento.
3. Migrar imagens locais para a estratégia compatível com Next, avaliando `next/image` item a item para não degradar as imagens ASCII ou ícones.
4. Implementar metadata base, título, descrição, favicon e Open Graph do portfólio.

**Concluída quando:** a página pública entrega metadata válida e não há erro de hidratação ou regressão de interação.

**Implementação:** `layout.tsx` e `page.tsx` permanecem Server Components; `App.tsx` concentra a ilha client-side enquanto idioma, tabs, popovers, navegação e arte ASCII compartilham estado de navegador. Foram incluídos ícone, metadata base, Open Graph, Twitter Card e a imagem social gerada em `app/opengraph-image.tsx`. Configure `NEXT_PUBLIC_SITE_URL` no deploy para definir a URL canônica.

### Fase 3 — MongoDB e Route Handlers

**Objetivo:** mover somente APIs que têm comportamento real ou são necessárias ao produto.

1. Criar `backend/libs/db/mongo` com cliente reutilizável e leitura de `MONGO_URL` sem expor segredo ao cliente.
2. Migrar `GET /api/health` para `src/app/api/health/route.ts`.
3. Definir e implementar de fato o contrato de métricas antes de migrar os endpoints correspondentes; handlers atuais retornam objetos vazios e não devem ser copiados como se fossem produto concluído.
4. Migrar feedback, métricas e futuras APIs do recruiter mode uma a uma, com schema de entrada, resposta e testes de integração.
5. Atualizar consumidores do frontend para o novo contrato com `fetch` server-side ou client-side, conforme o ponto de consumo.

**Concluída quando:** as APIs em uso respondem no Next, persistem no MongoDB quando necessário e possuem testes do comportamento público.

**Implementação atual:** `backend/libs/db/mongo` usa o driver oficial, é exclusivo do servidor e cria a conexão sob demanda. `GET /api/health` já está no Next e continua independente do banco. Métricas não foram migradas porque os handlers eram stubs sem consumidores ou persistência.

**Modelos preservados:** `Like`, `View`, `ViewType` e seus helpers de coleção foram movidos para `backend/metrics/models/`. A coleção de views foi corrigida para `views`; o helper antigo apontava incorretamente para `likes`.

### Fase 4 — remoção controlada do Fastify

**Objetivo:** encerrar o backend separado sem remover capacidades ativas.

1. Confirmar que nenhuma chamada, script de deploy ou variável depende do antigo serviço Fastify.
2. Remover proxy Vite, CORS específico do Fastify e scripts de execução concorrente.
3. Preservar o `docker-compose.yml` como provisionamento local do MongoDB.
4. Atualizar README e instruções de ambiente para o deploy único.

**Concluída quando:** o projeto inicia, compila e serve o portfólio e a API somente pelo Next.

**Implementação:** os modelos MongoDB foram movidos para `backend/metrics/models/`; o diretório Fastify, suas dependências, scripts e documentação foram removidos. `backend/.env` legado foi preservado localmente como `.env.local` quando presente.

### Fase 5 — qualidade e publicação

**Objetivo:** fechar a migração com segurança operacional e qualidade pública.

1. Verificar responsividade, navegação, idioma, acessibilidade básica e imagens.
2. Executar build, lint e testes; verificar variáveis de ambiente no provedor de deploy.
3. Publicar somente após comparação com o checklist da Fase 0.

## 6. Limites e riscos

| Risco | Prevenção |
| --- | --- |
| Regressão de UI durante troca de framework | Fase 1 mantém a tela inteira como client-side inicialmente; otimização vem depois. |
| Perder modelos ao retirar Fastify | `Like`, `View` e seus helpers de coleção foram preservados em `backend/metrics/models/`. |
| Expor `MONGO_URL` | Conexão fica em módulo server-only; variáveis públicas usam apenas prefixo `NEXT_PUBLIC_` quando necessário. |
| Consumir a franquia Plus em uma tentativa longa | Uma fase por sessão, checkpoint ao final e nenhuma execução paralela por padrão. |
| Perder o trabalho ASCII local | Fase 0 exige checkpoint próprio antes de mexer em dependências ou estrutura. |

## 7. Estratégia de uso do Codex

O plano é Plus e a prioridade é continuidade entre projetos.

- Criar e revisar esta spec com GPT-5.6 Terra em `medium`.
- Usar Terra em `medium` como padrão nas fases 0 a 4; usar `high` apenas para erros de build, SSR, persistência ou migração que não se resolvam com investigação normal.
- Usar Luna para mudanças repetitivas e documentação curta.
- Não usar Astra como padrão. Se surgir uma decisão estrutural sem solução clara, Astra começa em `low`, em uma tarefa isolada e com objetivo explícito.
- Encerrar cada sessão com build/lint ou com o bloqueio descrito, para que a próxima não precise redescobrir o estado.

## 8. Critérios de aceite da migração

- O portfólio atual funciona visualmente e interativamente em `/`.
- MongoDB é acessado apenas no servidor Next.
- APIs necessárias são Route Handlers do Next.
- Não há backend separado ou script concorrente.
- Build, lint e testes relevantes passam antes da publicação.

## Referências

- [Migração de Vite para Next.js](https://nextjs.org/docs/pages/guides/migrating/from-vite)
- [App Router](https://nextjs.org/docs/app)
- [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
