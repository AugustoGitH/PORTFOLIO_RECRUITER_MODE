# Contexto para sessões de trabalho

`portfolio-v100` é o portfólio pessoal de Augusto Westphal. A aplicação inteira vive na raiz do repositório:

- `src/`: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4.

Leia `README.md` e `docs/README.md` antes de implementar mudanças. Para a feature de recrutamento, a fonte de produto é `docs/recruiter-mode/spec.md`.
Para a migração do framework, use `docs/migrations/next-migration.md` como plano de execução.

Regras que refletem o código atual:

- O conteúdo público do perfil pertence a `src/constants/profile/`; textos visíveis pertencem ao registro `constants/intl/terms.ts` e devem passar por `intl.t(...)`.
- Componentes, hooks e módulos normalmente têm `main.tsx`/`main.ts`, `types.ts` e `index.ts` como barrel público. Preserve esse formato ao estender uma área já estruturada assim.
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
