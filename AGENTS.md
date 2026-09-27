# Contexto para sessões de trabalho

`portfolio-v100` é o portfólio pessoal de Augusto Westphal. A aplicação inteira vive na raiz do repositório:

- `src/`: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4.

Leia `README.md` e `docs/README.md` antes de implementar mudanças. Para a feature de recrutamento, a fonte de produto é `docs/recruiter-mode/spec.md`.
Para a migração do framework, use `docs/migrations/next-migration.md` como plano de execução.

Regras que refletem o código atual:

- O conteúdo público do perfil pertence a `src/constants/profile/`; textos visíveis pertencem ao registro `constants/intl/terms.ts` e devem passar por `intl.t(...)`.
- Componentes, hooks e módulos normalmente têm `main.tsx`/`main.ts`, `types.ts` e `index.ts` como barrel público. Preserve esse formato ao estender uma área já estruturada assim.
- Componentes usados por uma única página pertencem a `src/screens/<Página>/components/`, mesmo quando são grandes. `src/components/` é reservado a componentes realmente compartilhados por mais de uma página ou feature; não promova antecipadamente componentes específicos de página para essa pasta.
- O `main.tsx` de uma page deve tornar a composição da página explícita, montando diretamente suas seções principais. Não crie um componente intermediário que represente a página inteira (`*Detail`, `*Content` ou equivalente) apenas para esconder essa composição; extraia componentes por responsabilidade visual ou comportamental real.
- Todo componente de primeiro nível que representa uma seção da página deve usar obrigatoriamente o sufixo `Section` e renderizar seu próprio `Container`. Cada `*Section` define localmente seu background e seus paddings; a page apenas ordena as seções e não cria um wrapper visual compartilhado para esconder essas decisões.
- Arquivos `src/app/**/page.tsx` são adaptadores finos do App Router: resolvem apenas contratos do framework, delegam carregamento e transformação server-side para `src/server/<domínio>/` e entregam os dados a um componente de `src/screens/`. Não coloque consultas, autenticação, composição de DTOs ou regras de seleção diretamente na rota.
- `src/screens/` não deve importar de `src/server/` nem de `src/app/`. A direção permitida é `app → server` e `app → screens`; `server` pode produzir os contratos serializáveis consumidos pela página.
- O nome do componente segue o domínio (`Portfolio`, `BlogPage`, `BlogPostPage`) e não recebe o sufixo `Screen`. `screens` é somente o nome da camada/pasta.
- A API expõe recursos sob `/api` por Route Handlers em `src/app/api/`.
- Não presuma que as métricas já estão prontas: a estrutura Fastify era composta de stubs e foi removida sem ser publicada.
- Há trabalho local em andamento ligado a arte ASCII. Preserve mudanças não relacionadas e leia `ACII.spec.md` quando a tarefa envolver esse recurso.

Verificação padrão para alterações de código: `npm run build` e `npm run lint`.

## Contexto do usuário: orçamento de Codex

O usuário trabalha em projetos pessoais com o plano ChatGPT Plus e quer preservar a franquia semanal de Codex para manter continuidade entre projetos. Ao recomendar ou selecionar modelos:

- Considere o custo de uso antes de priorizar capacidade máxima. Não recomende GPT-6 Astra com raciocínio `high` ou superior para tarefas simples, rotina de implementação, documentação, ajustes visuais ou correções isoladas.
- Use GPT-5.6 Terra como escolha padrão para implementação e refatoração, normalmente com raciocínio `medium`; aumente o esforço apenas quando a complexidade técnica justificar.
- Use GPT-5.6 Luna para tarefas bem delimitadas, repetitivas ou mecânicas.
- Reserve GPT-6 Astra para decisões de arquitetura que alterem o projeto, especificações de alto impacto, bloqueios técnicos persistentes e revisão final de mudanças estruturais. Comece por `low` e justifique qualquer recomendação acima disso.
- Para trabalhos grandes, proponha fases independentes, com entregáveis verificáveis, em vez de concentrar o consumo em uma única sessão ou sugerir agentes paralelos sem necessidade.
- Não trate estimativas de tokens como quota garantida. Quando a disponibilidade restante puder mudar o plano, oriente a consulta a Settings → Usage, pois o saldo individual não está disponível no repositório.
