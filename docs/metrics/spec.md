# Spec de integração de métricas

**Status:** proposta para implementação

**Escopo:** substituir os valores estáticos do `MetricsHeader` por métricas reais de visualizações do portfólio, likes e downloads do currículo.

A implementação deve seguir a [arquitetura backend em três camadas](../backend/spec.md): Route Handlers/controllers HTTP, services de domínio e repositories MongoDB. Os gates de segurança e limites de tráfego definidos nessa arquitetura são obrigatórios para os endpoints desta spec.

## Objetivo

Exibir no portfólio, em tempo de execução, os seguintes indicadores:

- `views`: visualizações do portfólio;
- `likes`: quantidade de visitantes que deram like;
- `resumeDownloads`: currículos gerados e servidos pela API;
- `professionalFeedbacks`: permanece fora desta integração até existir um fluxo de feedback persistido.

Os contadores devem ser agregados no servidor, persistidos no MongoDB e consumidos pelo frontend sem bloquear a renderização inicial da página.

## Decisões de produto

### O que conta como visualização

- Uma visualização de portfólio é registrada quando a página é aberta e o cliente confirma que a aplicação foi hidratada.
- O mesmo visitante conta no máximo uma vez a cada 24 horas. Atualizações, navegação interna e re-renderizações não criam novas visualizações.
- Uma visualização de currículo é registrada uma vez por resposta PDF gerada com sucesso pela rota `/api/resumes/[slug]`. Ela representa um download servido, não uma garantia de que o arquivo foi aberto.
- Respostas `4xx`, `5xx` ou falhas de renderização nunca incrementam contadores.

### O que conta como like

- Cada visitante pode manter no máximo um like ativo no portfólio.
- O like é uma operação de alternância: o primeiro `POST` cria o like; outro `POST` do mesmo visitante remove-o.
- O estado atual do visitante (`liked`) deve ser retornado junto dos contadores para a interface não depender apenas do contador global.

### Identificação e privacidade

- A aplicação gera um identificador aleatório e não reversível no cookie first-party `visitor_id` quando ele não existir.
- O identificador não contém IP, e-mail ou dados de perfil. IP e User-Agent não são persistidos; se usados para rate limit, ficam apenas na memória/infraestrutura de proteção.
- O cookie deve ter `HttpOnly`, `SameSite=Lax`, `Secure` em produção e validade de 1 ano.
- A documentação de privacidade deve informar o uso desse identificador para métricas agregadas e likes.

## Modelo de dados

Manter as coleções existentes `views` e `likes`, ajustando os documentos para permitir deduplicação e distinguir os recursos:

```ts
type View = {
  _id: ObjectId
  type: ViewType // Portfolio | Resume
  visitorId: string
  dedupeKey: string // `${type}:${visitorId}:${YYYY-MM-DD}`
  locale?: ResumeLocale
  slug?: string
  createdAt: Date
  updatedAt: Date
}

type Like = {
  _id: ObjectId
  visitorId: string
  createdAt: Date
  updatedAt: Date
}
```

Índices obrigatórios:

- `views.dedupeKey` único;
- `views.type` para agregações;
- `likes.visitorId` único.

Documentos antigos sem `dedupeKey` devem ser tratados na migração, sem apagar histórico; a estratégia de backfill precisa ser definida antes do deploy.

## Contrato HTTP

### `GET /api/metrics`

Retorna o snapshot público:

```json
{
  "views": 160,
  "likes": 40,
  "resumeDownloads": 11,
  "professionalFeedbacks": 0,
  "liked": false
}
```

- `professionalFeedbacks` pode ser omitido enquanto não houver fonte real; o frontend deve exibir somente métricas disponíveis.
- A resposta não deve incluir dados individuais.
- Usar cache curto ou `Cache-Control: no-store` enquanto a consistência imediata for prioridade.

### `POST /api/metrics/view`

Registra uma visualização do portfólio. Deve ser idempotente para o `dedupeKey` do dia e retornar o snapshot atualizado. A rota cria o cookie `visitor_id` quando necessário.

### `POST /api/metrics/like`

Alterna o like do visitante e retorna `{ "likes": number, "liked": boolean }`. A operação deve ser atômica (`upsert`/remoção condicionada) e segura contra cliques repetidos.

Não expor uma rota pública para registrar download de currículo: o incremento de `ViewType.Resume` pertence ao Route Handler que gera o PDF, depois que o buffer/stream for produzido com sucesso.

## Integração no frontend

1. `app/page.tsx` registra a visualização no SSR e passa `initialViews` para o `MetricsHeader`; o componente não faz chamada client-side para views.
2. O middleware prepara o cookie `visitor_id` antes do SSR; o service faz a deduplicação de 24 horas.
3. O controle de like usa `POST /api/metrics/like`, fica desabilitado durante a mutação e atualiza o contador a partir da resposta do servidor.
4. O botão de currículo mantém o loading até a resposta PDF ser recebida; a rota registra o download no servidor, sem uma segunda chamada do cliente.
5. Falhas de métricas são não bloqueantes: a página e o download continuam funcionando, e o SSR usa `0`/último valor disponível sem interromper a entrega.
6. Todos os rótulos visíveis continuam vindo de `constants/intl/terms.ts` via `intl.t(...)`.

## Integração no Route Handler do currículo

Em `/api/resumes/[slug]`:

1. validar locale e slug;
2. gerar o PDF;
3. somente após a geração completa, inserir uma `ViewType.Resume` com `dedupeKey` apropriado;
4. retornar o PDF com `Content-Disposition: attachment`.

Uma falha de conexão com MongoDB não deve transformar um PDF válido em erro HTTP: registrar/logar a falha e preservar a resposta `200` quando a geração terminou.

## Segurança e operação

- Validar todos os corpos JSON e rejeitar tipos desconhecidos.
- Aplicar rate limit por `visitor_id` e origem de rede na borda ou no Route Handler.
- Não aceitar `visitorId`, contadores ou tipo de métrica enviados pelo cliente; o servidor determina esses valores.
- Agregar contadores com consultas MongoDB (`countDocuments`/pipeline), sem enviar a coleção ao cliente.
- Definir timeout curto para chamadas de métricas e observar erros sem poluir a resposta pública.

## Critérios de aceite

- O header deixa de exibir os valores hardcoded e mostra os dados de `GET /api/metrics`.
- Uma abertura de página gera no máximo uma visualização por visitante a cada 24 horas.
- O like pode ser criado e removido pelo mesmo visitante, sem contagem duplicada.
- Cada resposta PDF `200` incrementa `resumeDownloads` uma vez; respostas inválidas não incrementam.
- Recarregar a página não perde o estado `liked` enquanto o cookie permanecer.
- Métricas indisponíveis não impedem a navegação nem o download do currículo.
- Testes cobrem deduplicação, alternância de like, contagem de PDF bem-sucedido e respostas de erro.
- `npm run build` e `npm run lint` passam após a implementação.

## Fora de escopo

- Dashboard administrativo ou métricas por usuário individual.
- Rastreamento de IP, localização, fingerprinting ou analytics de terceiros.
- Contagem de abertura/leitura do PDF após o download.
- Persistência de `professionalFeedbacks` antes da definição do fluxo de feedback.
