# Recruiter Mode — Especificação

**Status:** rascunho para discussão
**Última atualização:** 2026-09-07
**Escopo:** aplicação da raiz (seções, providers, features e Route Handlers de análise e métrica)

---

## 1. Problema

O portfólio padrão responde **"quem é o Augusto"**: narrativa, filosofia, ordem cronológica,
tabs de exploração. É o documento certo para quem chegou por curiosidade.

Um recrutador não tem essa pergunta. Ele tem uma só, e tem pressa:

> **"Essa pessoa serve para o que eu preciso, e eu consigo provar isso rápido?"**

Hoje, para respondê-la, ele precisa navegar 6 tabs de skills, filtrar projetos por tipo e
somar mentalmente as datas das experiências. O portfólio faz ele trabalhar.

## 2. Objetivo

Inverter o esforço: o recrutador informa (ou não) o que procura, e **o portfólio se
reorganiza para responder à pergunta dele** — evidência primeiro, ordem por relevância,
veredito explícito.

## 3. Não-objetivos

- Não é um chat/assistente sobre o portfólio.
- Não é um gerador de currículo genérico — o CV produzido é sempre **para uma vaga/contexto**.
- Não substitui o modo padrão; é uma segunda leitura dos **mesmos dados**.
- A IA **não escreve fatos novos** sobre o candidato (ver §8).

---

## 4. Conceito central: a escada de contexto

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

| Modo padrão (narrativa) | Modo recrutador (veredito) |
|---|---|
| About | About (ficha) |
| Skills | **Match summary** *(só L2)* |
| Projects | Experiences |
| Experiences | Projects |
| Testimonials | Skills |
| Congratulations/Feedback | Testimonials |
| | Contato / CV |

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

**Skills** — `sections/SkillsSection`
- Padrão: 6 tabs de partição (`SKILL_TABS`) que o recrutador precisa percorrer.
- Recrutador L1: a resposta "backend" pré-seleciona a tab e reordena.
- Recrutador L2: skills que batem sobem e ganham destaque; o resto colapsa em
  "também trabalha com…".

**Testimonials** — `sections/TestimonialsSection`
- Padrão: fechamento simpático.
- Recrutador: **prova social de terceiros** — sobe na ordem, é o tipo de evidência que
  um avaliador valoriza.

**Congratulations/Feedback** — `sections/CongratulationsSection`
- "Deixe um like / dê feedback" não faz sentido para quem está avaliando um candidato.
- Recrutador: a seção **troca de papel** — vira contato, agendar conversa, baixar CV.

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

---

## 7. Arquitetura

### 7.1 Estado

`providers/recruiterMode` hoje guarda apenas `isRecruiterMode: boolean`; `onRecruiterMode`
só faz `scrollTo(top)` e `offRecruiterMode` está vazio. Precisa evoluir para carregar o
**contexto**, não só o interruptor:

```ts
type RecruiterContext =
  | { level: 0 }
  | { level: 1; role: SkillKind; seniority: Seniority }
  | { level: 2; jobId: string; analysis: JobAnalysis }
```

As seções consomem esse contexto para decidir conteúdo e ordem. Hoje **nenhuma seção lê
`isRecruiterMode`** — o único consumidor é o próprio botão.

### 7.2 Estado na URL

O recrutador analisa, gosta, e **encaminha para o gestor**. Se o contexto vive na URL
(`?mode=recruiter&role=backend`, ou um id curto para uma vaga analisada), a segunda pessoa
cai direto na visão já personalizada.

É o maior multiplicador de valor da feature, e é o que dá sentido à futura métrica
de visualização de currículo.

### 7.3 Pontos de entrada

- **Header** — `RecruiterModeButton` (existe, `components/layout/Header/main.tsx:34`).
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
2. CVs gerados / baixados (`incrementViewResume`);
3. URLs personalizadas **compartilhadas e reabertas** (prova de §7.2);
4. distribuição L0 / L1 / L2 — valida a hipótese da escada;
5. tempo até a primeira ação no modo recrutador vs. modo padrão.

---

## 10. Faseamento

Cada fase é entregável e testável sozinha.

**Fase 0 — Fundação de dados** *(caminho crítico, sem UI)*
Registro canônico de skills (§6.1); `Project.skills` em array e preenchido (§6.2);
asserção de integridade do vocabulário.

**Fase 1 — L0**
Lista de seções como dado; `isRecruiterMode` consumido pelas seções; ficha do About;
Congratulations → Contato; toggle persistido na URL.

**Fase 2 — L1**
Duas perguntas (área + senioridade); filtro/reordenação determinística; contexto na URL.

**Fase 3 — L2**
Route Handler de análise no Next; match summary com lacunas; ranking com justificativa;
rate limit; métrica.

**Fase 4 — CV**
Geração e entrega; métrica de visualização do currículo; URL compartilhável da análise.

---

## 11. Decisões em aberto

| # | Decisão | Recomendação |
|---|---|---|
| 1 | Toggle e formulário são um fluxo ou dois? | **Um só** — o toggle entra no modo, o form refina (§7.3) |
| 2 | L0 precisa ser bom sem nenhum contexto? | **Sim, e determinístico** — sustenta a feature sem IA |
| 3 | Quais perguntas em L1? | **Duas**: área/stack e senioridade. Contratação é resposta sua, não pergunta dele |
| 4 | O CV é PDF, página, ou ambos? | Em aberto — PDF é o que circula internamente na empresa |
| 5 | Onde e com que provedor roda a IA? | Em aberto — define custo e §7.4 |
| 6 | O modo recrutador altera também o visual? | Recomendo **não** na v1 — é reorganização de conteúdo |

---

## 12. Estado atual do código (verificado em 2026-09-07)

| Item | Estado |
|---|---|
| `RecruiterModeButton` no header | existe e funciona |
| `RecruiterModeProvider` | existe; `offRecruiterMode` vazio, `onRecruiterMode` só faz scroll |
| Consumo de `isRecruiterMode` nas seções | **nenhum** |
| `RecruiterFormButton` | apenas casca visual: sem estado, sem `onSubmit`, `reset()` vazio, ambos os botões `type="submit"` |
| Ordem das seções | hardcoded em `screens/Main/main.tsx` |
| Termos i18n | já existem em `constants/intl/terms.ts` (`Recruiter`, `RecruitmentMode`, `DefaultMode`, `AnalyzeJob`, `AnswerQuestions`, `JobDescriptionOrLink`, …) |
| Vocabulário de skills | duplicado e já divergente (`redwood`) |
| `Project.skills` | campo singular, opcional, **não preenchido** |
| API de análise | inexistente |
| Métrica de visualização de currículo | inexistente |
