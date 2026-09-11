# Leitura por audiência — Especificação

**Status:** rascunho para discussão
**Última atualização:** 2026-09-10
**Escopo:** aplicação da raiz (seções, providers, evidência de perfil e, opcionalmente, análise de vaga)

---

## 1. Problema

O portfólio padrão responde **"quem é o Augusto"**: narrativa, filosofia, ordem cronológica,
tabs de exploração. É o documento certo para quem chegou por curiosidade.

Um recrutador não tem essa pergunta. Ele tem uma só, e tem pressa:

> **"Essa pessoa serve para o que eu preciso, e eu consigo provar isso rápido?"**

Hoje, para respondê-la, ele precisa navegar 6 tabs de skills, filtrar projetos por tipo e
somar mentalmente as datas das experiências. O portfólio faz ele trabalhar. Além disso, uma
lista de logos é uma alegação sem lastro: não distingue produção de tutorial.

## 2. Objetivo

Permitir que a pessoa escolha **como quer ler** o mesmo portfólio. Para recrutadores, a
aplicação reorganiza os fatos para responder ao encaixe na vaga. A unidade de conteúdo deixa
de ser uma afirmação e passa a ser uma **cadeia de evidência auditável**: cada skill aponta
para as experiências, projetos e depoimentos que a sustentam.

## 3. Não-objetivos

- Não é um chat/assistente sobre o portfólio.
- Não é um gerador de currículo genérico.
- Não substitui o modo padrão; são leituras dos **mesmos dados**.
- A IA **não escreve fatos novos** sobre o candidato (ver §8).
- Não infere que uma tecnologia foi aprendida “do zero” por ela não aparecer em registros
  anteriores; essa afirmação exige fonte editorial explícita.

---

## 3.1 Estrutura: audiência, não interruptor

“Modo recrutador” é a primeira leitura especializada, não uma arquitetura presa a um boolean.
Enquanto só a leitura de recrutamento estiver publicada, o header usa um CTA explícito e
destacado — **“Sou recrutador(a)”**. Um seletor genérico só entra quando as demais leituras
também entregarem conteúdo próprio.

| Audiência | Pergunta central | O que sobe |
|---|---|---|
| Recrutador | “Encaixa na vaga?” | fit, trajetória, disponibilidade, contato |
| Tech lead | “Quero revisar o código dele?” | decisões, trade-offs, código e arquitetura |
| Cliente / founder | “Resolve meu problema?” | produtos entregues, autonomia e resultado |
| Curioso / par | “Quem é essa pessoa?” | narrativa atual |

A primeira entrega publica apenas `default` e `recruiter`. `tech-lead` e `client` entram como
contratos extensíveis, sem seletor público até haver uma leitura distinta para entregar.

---

## 4. Conceitos centrais

### 4.1 Cadeia de evidência — piso L0

O registro canônico de skills permite derivar um grafo de citações, sem IA:

> React — 4 anos · 3 experiências profissionais · 6 projetos
> BudgetXpert (set/24–hoje) · Saludii · DRT Sistemas

Contagens e duração nunca são digitadas: são derivadas de `EXPERIENCES` e `PROJECTS`. Cada
referência é clicável e navegável; o caminho inverso mostra, num projeto ou experiência, quais
skills e, no L2, quais requisitos ele sustenta. Isso transforma logos em currículo auditável e
impede inflação estruturalmente.

Quando houver L2, a análise pode apontar para a implementação pública do próprio match
(repositório ou trecho relevante), como demonstração técnica, não como marketing.

### 4.2 Escada de contexto

O erro a evitar é tornar a análise de vaga a única porta de entrada. Nem todo recrutador
tem uma vaga formal aberta, e muitos não podem/querem colar a descrição interna da empresa.

A feature tem **três níveis de contexto**, e **cada um precisa entregar valor sozinho**:

| Nível | Entrada do recrutador | Resposta | Custo | Depende de IA |
|---|---|---|---|---|
| **L0 — Sem contexto** | liga o modo | Seções reorganizadas: evidência primeiro, densidade alta | instantâneo | não |
| **L1 — Contexto barato** | 2 perguntas: área/stack + senioridade | Filtro e reordenação sobre os dados existentes | instantâneo | não |
| **L2 — Contexto pleno** | descrição ou URL da vaga | Match por requisito + ranking + CV personalizado + lacunas | ~1 min | sim |

L1 é o atual botão **"Responder perguntas"**. Ele mapeia diretamente nas partições que já
existem no código (`SkillKind`, `ProjectKind`, `ExperienceKind`) — ou seja, **é implementável
sem uma linha de IA**.

Consequências de design que decorrem disso:

- **L0/L1 são o piso de qualidade.** Se a IA cair, ficar cara, ou o recrutador não quiser
  informar a vaga, a feature continua funcionando.
- **L2 é refinamento, não porta paralela.** O painel de vaga vive *dentro* do modo recrutador.

---

## 5. Comportamento das seções

O modo recrutador **não é um tema visual** — é uma reorganização de conteúdo. Três eixos mudam:
o que cada seção mostra, em que ordem os itens aparecem, e em que ordem as seções aparecem.

### 5.1 Ordem das seções

| Narrativa | Recrutamento L0/L1 | Com vaga L2 |
|---|---|---|
| About | About (ficha) | About (ficha) |
| Skills | Experiences | **Match summary** |
| Projects | Projects | Experiences |
| Experiences | Skills / cadeia de evidência | Projects |
| Testimonials | Testimonials | Skills / cadeia de evidência |
| Congratulations/Feedback | Contato | Testimonials + contato |

O recrutador lê trajetória antes de lista de tecnologia; a lista de skills serve para
*confirmar*, não para descobrir.

> ⚠️ Isto exige que a lista de seções vire **dado**, não JSX fixo.
> Hoje está hardcoded em `src/screens/Main/main.tsx`.

### 5.2 Por seção

**About** — `sections/AboutSection`
- Padrão: narrativa + filosofia (`AboutRoleDescription`, `AboutPhilosophyDescription`).
- Recrutador: **ficha objetiva** — anos de experiência (já calculado por `getElapsedYears`
  a partir de `2022-01-01` em `constants/profile/about.tsx`), stack principal, senioridade,
  modelo de contratação, localização/disponibilidade.
- CTA troca de "conheça meu trabalho" para **baixar CV / falar comigo**.

**Match summary** — *seção nova, existe apenas em L2*
- O veredito: `N de M requisitos atendidos`, lista do que bate e **do que não bate**.
- Ver §8 — as lacunas são obrigatórias, não opcionais.

**Experiences** — `sections/ExperiencesSection`
- Padrão: tabs por `ExperienceKind`, ordem cronológica.
- Recrutador: timeline compacta + **tempo total somado**; com contexto, destaque nas
  experiências que tocam a stack pedida.
- Já tem a estrutura certa: `rangeDate` e `skills: TagEntry[]`.

**Projects** — `sections/ProjectsSection`
- Padrão: tab `All` selecionada.
- Recrutador: default em `Professional`; com contexto, ordenado por relevância e mostrando
  **o porquê** ("Node + PostgreSQL — 3 dos 5 requisitos").
- ⚠️ Bloqueado por dados hoje (ver §6.2).

**Skills / cadeia de evidência** — `sections/SkillsSection`
- Padrão: 6 tabs de partição (`SKILL_TABS`) que o recrutador precisa percorrer.
- Recrutador L0: cada skill mostra duração derivada, quantidade de experiências profissionais,
  projetos e referências navegáveis. A seção não declara domínio: ela o demonstra.
- Recrutador L1: a resposta "backend" pré-seleciona a tab e reordena essa evidência.
- Recrutador L2: skills que batem sobem e ganham destaque; o resto colapsa em
  "também trabalha com…". Projetos e experiências indicam os requisitos que cobrem.

**Velocidade de aprendizado** — bloco dentro de Skills ou Match summary
- Mostra apenas tecnologias com anotação editorial explícita: tecnologia, experiência/projeto,
  data e entrega verificável.
- Exemplo seguro: “Redwood.js — aprendi para Saludii em 2024 e entreguei em produção”. Não
  usar duração (“em três semanas”) sem fonte factual.
- No L2, uma lacuna pode apontar para esse histórico como evidência de aprendizagem, mas nunca
  transforma uma tecnologia ausente em skill dominada.

**Testimonials** — `sections/TestimonialsSection`
- Padrão: fechamento simpático.
- Recrutador: **prova social de terceiros** — sobe na ordem, é o tipo de evidência que
  um avaliador valoriza.

**Congratulations/Feedback** — `sections/CongratulationsSection`
- "Deixe um like / dê feedback" não faz sentido para quem está avaliando um candidato.
- Recrutador: a seção **troca de papel** — vira contato, agendar conversa, baixar CV.
- Pode conter um **contra-CV** curto e factual: “provavelmente não me chame se…”. Ele declara
  contextos/stack não buscados, sem julgar a vaga.

---

## 6. Modelo de dados

### 6.1 Registro canônico de skills (pré-requisito de tudo)

**Problema verificado no código:** o vocabulário de skills existe hoje em dois lugares e
**já divergiu**.

- `constants/profile/skills.ts` define `SKILLS: Skill[]` (`{ title, value, kind }`).
- `constants/profile/experiences.tsx` declara skills inline como `TagEntry[]` literais,
  duplicando label/value: `{ label: "React", value: "react", icon: <Building2Icon size={14} /> }`.
- A experiência `saludii` declara `{ label: "Redwood.js", value: "redwood" }` — **que não
  existe em `SKILLS`**.

Matching exige um vocabulário único. Proposta:

- `SKILLS` passa a ser a **única** fonte, indexada por `value`.
- `Experience.skills` e `Project.skills` passam a referenciar **chaves** (`Skill["value"]`),
  não objetos `TagEntry` duplicados. O componente resolve a chave → `Skill` na renderização.
- Um teste/asserção garante que toda chave referenciada existe em `SKILLS` (evita o caso
  `redwood` silencioso).

### 6.2 Skills por projeto

`Project.skill?: TagEntry` (`constants/profile/projects.tsx:32`) é **singular, opcional e
não é preenchido por nenhum projeto hoje** — o campo só existe no tipo.

Sem isso, **não existe matching de projeto**, que é justamente a evidência mais forte para
um recrutador. Requer:

- `skill?: TagEntry` → `skills?: Skill["value"][]`
- preencher todos os itens de `PROJECTS`.

Isto é trabalho de **conteúdo**, não de código, e é o caminho crítico da feature.

### 6.3 Metadados ausentes para L2

Para um match honesto, a presença da skill não basta. Faltam hoje:

- **profundidade** por skill (usou em produção? por quanto tempo?) — derivável das
  experiências que a referenciam, se §6.1 for feito;
- **senioridade** declarada;
- **modelo de contratação / disponibilidade** (PJ/CLT, remoto, timezone) — hoje inexistente
e necessário para a ficha do About.

### 6.4 Evidência e aprendizado em contexto (novos)

Criar seletores puros que derivem `SkillEvidence` de `SKILLS`, `EXPERIENCES`, `PROJECTS`,
`COURSES` e, quando estruturados, depoimentos. A fonte guarda fatos e vínculos; totais,
duração e contagens são calculados. O cálculo de duração deve tratar sobreposição de datas para
não inflar tempo. Cursos reforçam aprendizado, mas nunca entram no total de experiência.

Para a narrativa de aprendizado, criar `SKILL_LEARNING_EVIDENCE`: cada item referencia
`SkillValue`, uma experiência ou projeto canônico e um termo i18n com a entrega comprovável.
Validar as referências. Ausência do registro significa “não afirmar”, não “não aprendeu”.

### 6.5 Critérios de fit mútuo (novo)

Adicionar em `constants/profile/` preferências declaradas: remoto/híbrido, tipo de produto,
modelo de contratação e, quando apropriado divulgar, faixa. A análise compara apenas esses
critérios e apresenta linguagem neutra: “remoto atende ao que busco”, nunca juízo da vaga.

---

## 7. Arquitetura

### 7.1 Estado

`providers/recruiterMode` hoje guarda apenas `isRecruiterMode: boolean`; `onRecruiterMode`
só faz `scrollTo(top)` e `offRecruiterMode` está vazio. Deve evoluir para contexto de leitura,
não só interruptor:

```ts
type Audience = "default" | "recruiter" | "tech-lead" | "client"

type RecruiterContext =
  | { level: 0 }
  | { level: 1; roles: SkillKind[]; seniority: Seniority }
  | { level: 2; jobId: string; analysis: JobAnalysis }

type PortfolioReadingContext = {
  audience: Audience
  recruiter: RecruiterContext | null
}
```

As seções consomem esse contexto para decidir conteúdo e ordem. A primeira implementação de L0
mantém apenas as audiências `default` e `recruiter`, expondo `isRecruiterMode` como compatibilidade
para as seções existentes.

### 7.2 Estado na URL — requisito explícito da Fase 1

O recrutador analisa, gosta, e **encaminha para o gestor**. Se o contexto vive na URL
(`?audience=recruiter&roles=frontend,backend`, ou um id curto para uma vaga analisada), a segunda pessoa
cai direto na visão já personalizada. A persistência inclui o próprio toggle.

Atualizar a URL ao entrar, sair ou refinar a leitura, sem criar histórico a cada interação:

- L0: `?audience=recruiter`;
- L1: `?audience=recruiter&roles=frontend,backend&seniority=…`;
- L2: `?audience=recruiter&analysis=<id-curto>`.

Na carga, parâmetros válidos restauram estado; ausentes ou inválidos retornam com segurança à
leitura narrativa. A convenção também comporta futuras leituras, como `?audience=tech-lead`.

### 7.3 Pontos de entrada

- **Header** — CTA destacado “Sou recrutador(a)”. Quando estiver no modo, a ação vira
  “Visão geral”.
- **Convite discreto no modo padrão** — "é recrutador? veja o portfólio adaptado" → liga o modo.
- **Painel de vaga** — `RecruiterFormButton`, hoje renderizado pelo provider em **qualquer
  modo**. Deve passar a viver **dentro** do modo recrutador, como refinamento L2.

### 7.4 Route Handlers

Não existe integração de IA hoje. As métricas Fastify anteriores eram stubs e foram removidas.
L2 exige:

- `POST /api/recruiter/analyze` — recebe descrição ou URL, devolve `JobAnalysis`.
- `GET /api/recruiter/analysis/:id` — permite a URL compartilhável de §7.2.
- geração/entrega do CV.
- **controle de custo e abuso**: é endpoint público que chama LLM. Rate limit e limite de
  tamanho de entrada são requisito, não melhoria.
- persistência da visualização de currículo em MongoDB.

---

## 8. Restrição de honestidade (regra de produto)

> **A IA só pode selecionar, ordenar e reformular fatos que já existem em
> `constants/profile/`. Nunca inventar, nunca inflar.**

Duas razões:

1. **Ética.** É a reputação de uma pessoa real dentro de uma decisão de contratação. Um CV
   com uma competência inflada é descoberto na entrevista técnica e o custo é do candidato.
2. **Prática.** Isso transforma o problema de *geração de texto* em *ranqueamento sobre um
   conjunto fechado* — muito mais fácil de implementar, testar e tornar determinístico.

**Corolário: as lacunas são obrigatórias.** Um match de 100% sempre parece propaganda e o
recrutador desconta a página inteira. Um match honesto — "8 de 11, faltam Kafka e Go" — faz
ele confiar no resto. E uma lacuna declarada **com contexto** ("não usei Kafka, mas trabalhei
com filas em X") é infinitamente melhor do que ele descobrir sozinho.

---

## 9. Métricas de sucesso

A feature existe para gerar conversa, não pageview. Sinais, em ordem de importância:

1. contatos iniciados a partir do modo recrutador;
2. navegações da cadeia de evidência (skill → fato e fato → skill);
3. URLs personalizadas **compartilhadas e reabertas** (prova de §7.2);
4. distribuição L0 / L1 / L2 — valida a hipótese da escada;
5. tempo até a primeira ação no modo recrutador vs. modo padrão;
6. CVs gerados / baixados, somente se a Fase 4 for justificada por demanda.

---

## 10. Faseamento

Cada fase é entregável e testável sozinha.

**Fase 0 — Fundação de dados — concluída** *(caminho crítico, sem UI)*
Registro canônico de skills (§6.1); `Project.skills` em array e preenchido (§6.2);
asserção de integridade do vocabulário.

**Fase 1 — Fundação de leitura + L0**
Provider de audiência/contexto; lista de seções como dado; `?audience=recruiter` persistido e
restaurado; ficha do About; Experiences → Projects → Skills → Testimonials → Contact; cadeia
de evidência navegável. `tech-lead` e `client` ficam como contratos extensíveis, sem UI.

**Fase 2 — L1 + aprendizado verificável**
Duas perguntas (área + senioridade); filtro/reordenação determinística; contexto na URL;
registro de aprendizado em contexto e validação de referências.

**Fase 3 — L2**
Route Handler de análise no Next; match summary com lacunas e fit mútuo; ranking com
justificativa; rate limit; métrica.

**Fase 4 — CV (condicional)**
Adiar até haver demanda mensurável. Se priorizada: geração e entrega; métrica de visualização;
URL compartilhável da análise. A página de evidência é o artefato principal.

---

## 11. Decisões em aberto

| # | Decisão | Recomendação |
|---|---|---|
| 1 | Seletor e formulário são um fluxo ou dois? | **Um só** — a audiência `recruiter` entra na leitura, o form refina (§7.3) |
| 2 | L0 precisa ser bom sem nenhum contexto? | **Sim, e determinístico** — sustenta a feature sem IA |
| 3 | Quais perguntas em L1? | **Duas**: área/stack e senioridade. Contratação é resposta sua, não pergunta dele |
| 4 | O CV é PDF, página, ou ambos? | Adiar até haver demanda; a página de evidência vem primeiro |
| 5 | Onde e com que provedor roda a IA? | Em aberto — define custo e §7.4 |
| 6 | O modo recrutador altera também o visual? | Recomendo **não** na v1 — é reorganização de conteúdo |
| 7 | Outras audiências entram já? | **Contrato agora, UI depois** — não publicar leitura vazia |

---

## 12. Estado atual do código (verificado em 2026-09-10)

| Item | Estado |
|---|---|
| Leitura de recrutamento no header | existe e alterna `audience` entre `default` e `recruiter` |
| Estado de L0 | persistido e restaurado por `?audience=recruiter` |
| Ordem das seções | dirigida por `SECTION_ORDER`; recrutamento sobe experiências, projetos e evidências |
| About | ficha objetiva com experiência derivada e stack baseada nas evidências |
| Skills | cadeia determinística: duração sem sobreposição, experiências e projetos navegáveis |
| Projects e Contact | recrutamento inicia em projetos profissionais e troca feedback por contato |
| `RecruiterFormButton` | permanece sem fluxo e não é mais renderizado globalmente; reservado para L1/L2 |
| Vocabulário de skills | canônico, incluindo `redwood`; experiências e projetos usam `SkillValue[]` |
| `Project.skills` | array obrigatório e preenchido |
| Contexto L1 | áreas e senioridade da vaga, persistidas em `roles` e `seniority` na URL |
| Reordenação L1 | experiências e projetos são ordenados pela quantidade de skills da área; a tab correspondente abre automaticamente |
| Aprendizado em contexto | Redwood.js na Saludii: MVP entregue ao uso de dezenas de nutricionistas |
| API de análise | inexistente |
| Métrica de visualização de currículo | inexistente |
