# Indicações de desenvolvedores para recrutadores

**Status:** proposta para implementação em fases  
**Escopo:** permitir que Augusto indique desenvolvedores consentidos quando o contexto de uma vaga não encaixar — ou não for o foco — do seu próprio perfil no modo recrutador.

## Princípio de produto

O modo recrutador continua tendo Augusto como assunto principal. Indicações não são marketplace, busca pública de currículos nem promessa de contratação: são uma ponte editorial para pessoas que Augusto conhece e escolheu apresentar.

A experiência responde com honestidade a duas situações:

- o recrutador informa área, senioridade ou requisitos que não têm boa cobertura no perfil de Augusto;
- mesmo havendo encaixe, o recrutador declara que procura outro perfil.

Em ambas, o tom é: “talvez estes profissionais também sejam úteis”, nunca “esta pessoa atende à vaga” ou “foi validada para a posição”. A decisão continua sendo do recrutador.

## Integração com o modo recrutador

A feature vive exclusivamente dentro de `audience=recruiter`; não aparece no portfólio narrativo, nas métricas nem para visitantes sem esse contexto.

### L0 — sem contexto

Não exibir cards nem consultar a coleção. Pode existir apenas um link discreto para “procura alguém com outro perfil?”, que abre/refina o contexto L1; não listar pessoas sem que o recrutador informe o mínimo necessário.

### L1 — área e senioridade

Usar os mesmos valores de área/`SkillKind` e senioridade já escolhidos no modo recrutador. O seletor determinístico compara-os com o perfil de Augusto e com o catálogo de indicados:

- com cobertura forte de Augusto, mostrar uma ação secundária “ver outros perfis”;
- com cobertura parcial ou ausente, abrir automaticamente o bloco **Outros perfis para considerar**;
- a ação secundária sempre permite abrir o bloco, sem fingir que o cálculo conhece todos os detalhes da vaga.

O bloco retorna no máximo três perfis ativos, ordenados por quantidade de critérios explícitos em comum, depois por prioridade editorial. Cada card explica apenas fatos objetivos, por exemplo: “Backend · Pleno · Node.js, PostgreSQL”. Não há score percentual nem ranking opaco.

### L2 — descrição de vaga

Quando a análise L2 existir, ela pode fornecer requisitos normalizados para o mesmo seletor. A indicação só usa requisitos extraídos/aprovados pelo fluxo de análise e exibe a justificativa verificável: “tem 2 dos 3 requisitos informados: Go e Kubernetes”. Não usar LLM para inventar biografias, afinidade ou disponibilidade.

O estado de leitura permanece compartilhável pela URL do modo recrutador; a lista é sempre recalculada no servidor a partir do contexto e dos perfis publicados. Não colocar ids de pessoas recomendadas na URL.

## Dados e consentimento

Cada pessoa é cadastrada manualmente pelo administrador e precisa autorizar explicitamente a presença pública antes da publicação. Links, descrição, disponibilidade e foto só podem ser exibidos se a pessoa os tiver fornecido ou confirmado para esse fim. Não importar ou raspar LinkedIn, GitHub ou qualquer outro perfil.

```ts
type DeveloperRecommendation = {
  _id: ObjectId
  slug: string
  status: "draft" | "published" | "paused" | "archived"
  displayName: string
  headline: string                 // ex.: "Desenvolvedora backend"
  seniority: Seniority
  roleKinds: SkillKind[]           // mesmo vocabulário do L1
  skills: RecommendationSkillValue[]
  summary?: string                 // curta, factual e aprovada pela pessoa
  availability?: string            // opcional, editorial e datada
  contact: {
    label: string
    url: string                    // URL pública escolhida pela pessoa
  }
  avatarMediaId?: ObjectId         // somente com autorização de imagem
  editorialPriority: number
  consent: {
    grantedAt: Date
    version: string
    confirmedAt: Date
  }
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  archivedAt?: Date
}
```

`RecommendationSkillValue` pertence a um catálogo próprio, controlado e normalizado. Não reutilizar automaticamente as skills canônicas de Augusto: os vocabulários têm objetivos distintos. O catálogo começa pequeno com stacks realmente usadas nas indicações e só adiciona sinônimos por mapeamento explícito (por exemplo, `nodejs` → `node`), nunca por correspondência vaga de texto.

Índices: `slug` único; `status + roleKinds + seniority`; `status + publishedAt`. Somente `published` pode chegar ao seletor público. `paused` remove a pessoa imediatamente da recomendação, preservando o histórico administrativo; `archived` é retenção editorial.

## Apresentação pública

O card contém nome, headline, senioridade, até cinco skills, resumo curto quando aprovado e um CTA para o único link de contato consentido. O destino abre em nova aba com `rel="noreferrer noopener"`. Foto é opcional: sem consentimento, usar o avatar neutro da interface, não uma imagem coletada externamente.

Não mostrar e-mail, telefone, cidade exata, currículo privado, comentários internos, data de consentimento, prioridade editorial ou outros indicados ao clicar num card. A lista e imagens públicas recebem cache/revalidação; pausar ou arquivar invalida a tag imediatamente.

## Administração e backend

O domínio fica em `backend/developer-recommendations/`, com `models`, `repositories`, `services`, `controllers` e seletores puros de matching. A camada pública nunca lê diretamente o Mongo por componentes cliente.

Permissões novas:

- `recommendation.read`: consultar rascunhos, consentimento e prévia no painel;
- `recommendation.manage`: criar, editar, publicar, pausar, arquivar e alterar prioridade.

O painel administrativo oferece listagem, formulário editorial, prévia de card e ação rápida de pausar. Toda mutação exige `recommendation.manage` e gera auditoria sem registrar texto de consentimento desnecessário. Avatares, se habilitados, reutilizam o adaptador e processamento seguro de mídia definidos na [spec de feedbacks profissionais](../feedback/spec.md); não introduzir upload público.

A entrega pública pode ocorrer como Server Component dentro do modo recrutador: obtém somente os perfis `published`, usa cache por tag e possui estado vazio. Se o banco estiver indisponível, omite o bloco de indicações sem impedir a leitura do portfólio de Augusto.

## Seletor determinístico

Entrada: contexto L1/L2 normalizado e perfis `published`. Um candidato é elegível quando tem ao menos uma área compatível; senioridade e skills aumentam a evidência, mas não devem excluir silenciosamente em L1 quando a pessoa declarou procurar “outro perfil”.

O service retorna um DTO mínimo com uma lista limitada e os critérios que justificam cada card. A ordenação é estável:

1. maior número de áreas/requisitos explicitamente coincidentes;
2. senioridade compatível, quando informada;
3. maior quantidade de skills coincidentes no L2;
4. `editorialPriority`;
5. `displayName`, para desempate.

A prioridade editorial só desempata perfis factualmente equivalentes; nunca sobrepõe critérios informados pelo recrutador. Testes de unidade cobrem correspondência, empates, ausência de contexto e exclusão de registros não publicados.

## Fases

### Fase 1 — indicação editorial no L1

Catálogo e consentimento manual; permissões; painel de CRUD mínimo; seletor por área/senioridade; bloco opcional no modo recrutador; até três cards e ação de pausar. Sem foto é uma entrega válida.

### Fase 2 — requisitos L2 e mídia

Mapeamento explícito dos requisitos da análise L2 para o catálogo de skills; justificativa por requisito; avatar opcional via adaptador R2 e revalidação de cache.

### Fase 3 — operação guiada por uso

Somente após uso real: expiração/renovação de disponibilidade e consentimento, métricas agregadas de abertura de CTA e, se necessário, convite de atualização para a pessoa indicada. Não introduzir login de indicado ou sincronização de rede social sem necessidade comprovada.

## Critérios de aceite

- Nenhuma indicação é exibida fora do modo recrutador ou sem `status: "published"`.
- L1 oferece outro perfil de forma explícita e mostra automaticamente o bloco apenas em cobertura parcial/ausente de Augusto.
- Cards exibem somente dados consentidos e fatos editoriais, sem score ou alegação de adequação.
- O modo recrutador continua útil quando não há indicados ou quando o banco está indisponível.
- Pausar um perfil remove-o da resposta e invalida o cache público.
- Toda mutação de catálogo requer `recommendation.manage`, e leitura administrativa requer `recommendation.read`.
- Testes cobrem autorização, visibilidade por status, consentimento obrigatório e seleção determinística.

