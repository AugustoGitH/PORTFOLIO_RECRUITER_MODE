# Arquitetura de backend

**Status:** proposta base para as integrações server-side do Next.js

## Objetivo

Organizar os Route Handlers em três camadas simples e explícitas:

1. **Controllers**: entrada HTTP, configuração da rota, autenticação/segurança, middleware, validação e tradução de erros para status HTTP.
2. **Services**: regras de negócio, casos de uso, idempotência de domínio e orquestração entre repositories.
3. **Repositories**: acesso ao MongoDB e outras fontes de dados. Nenhuma regra de negócio ou decisão de HTTP deve existir aqui.

O backend continua dentro do Next.js. Um Route Handler deve ser apenas um adaptador fino para um controller; não deve conter queries MongoDB nem regras de contagem.

Chamadas internas durante SSR devem acessar o service diretamente. `fetch` fica reservado para integrações HTTP necessárias no servidor; Axios permanece no cliente para chamadas externas/interativas, conforme a instância HTTP do frontend.

## Organização proposta

```text
src/
  app/api/                         # Route Handlers (adaptadores HTTP exigidos pelo Next)
backend/
  <dominio>/
    controllers/                   # handlers, schemas e mapeamento HTTP
    services/                      # casos de uso
    repositories/                  # contratos e implementações MongoDB
    models/                        # entidades e helpers de coleção do domínio
  libs/db/mongo/                   # conexão e tipos Mongo compartilhados
  security/                         # gates, rate limit e headers
  errors/                           # erros de domínio e mapeamento comum
  resume/                          # geração de documentos exclusivamente no servidor
```

Quando um domínio crescer, seus controllers/services/repositories ficam juntos em `backend/<dominio>`. `features/` permanece reservado para fluxos de produto integrados ao frontend ou a serviços externos. Os módulos server-only devem manter `import "server-only"`.

## Regras de dependência

```text
Route Handler/controller -> service -> repository -> MongoDB
```

- Controller não importa `mongodb` nem coleção diretamente.
- Service não conhece `Request`, `Response`, cookies ou status HTTP.
- Repository recebe parâmetros tipados e devolve entidades/resultados; não lança `Response`.
- Service pode compor mais de um repository e deve ser testável sem Next.
- Controller valida entrada antes de chamar o service e converte erros conhecidos para respostas estáveis.
- Nenhuma camada deve acessar outra feature por caminhos internos; use contratos públicos (`index.ts`).

## Padrão de execução

### Dados necessários para SSR

Quando a página precisa ser entregue já com dados do backend, o Server Component chama o service diretamente. Não se faz uma chamada HTTP para a própria API e não se usa Axios nesse fluxo.

```text
app/page.tsx
  -> backend/<dominio>/services
    -> backend/<dominio>/repositories
      -> MongoDB
```

O resultado deve ser passado como props serializáveis para a fronteira client-side. No caso das métricas, `app/page.tsx` registra a view e entrega `initialViews` ao `MetricsHeader`.

### Requisições HTTP públicas

Quando o consumidor é o browser ou um sistema externo, a entrada passa pelo Route Handler. O Route Handler aplica o wrapper de segurança e delega ao controller; o controller chama o service.

```text
Route Handler
  -> withPublicControllerSecurity(...)
    -> Controller
      -> Service
        -> Repository
```

O wrapper de segurança deve ser aplicado na declaração da rota, e não repetido dentro de cada método do controller:

```ts
export const POST = withPublicControllerSecurity(controller.handle)
```

### Organização modular

Cada domínio backend é autocontido em `backend/<dominio>/`, incluindo `models`, `repositories`, `services`, `controllers` e seus barrels públicos. `backend/libs/db/mongo`, `backend/security` são infraestrutura compartilhada. `features/` não abriga lógica de persistência ou controllers backend.

## Fluxo de uma requisição

1. O Route Handler delega ao controller da feature.
2. O middleware do controller aplica método, origem, tamanho, rate limit e demais gates.
3. O controller valida query, body e cookies, obtém o `visitorId` e chama o service.
4. O service executa a regra de negócio e usa repositories.
5. O controller mapeia o resultado para JSON/PDF, define headers e cookies.
6. Erros inesperados são logados com um request id e retornam uma mensagem genérica `500`.

## Gates de segurança

Os gates compartilhados devem viver em `backend/security` e ser compostos por todos os controllers. Um controller de domínio não deve reimplementar origem, CSRF, headers ou rate limit comum; ele apenas declara os limites específicos do caso de uso.

Todo endpoint público deve declarar uma configuração de gates. A ausência de configuração é erro de implementação.

### Gates comuns

- **Método e content type:** rejeitar métodos não declarados (`405`) e JSON inválido ou acima do limite (`400`/`413`).
- **Origem/CSRF:** para `POST`, `PUT`, `PATCH` e `DELETE`, aceitar apenas same-origin; validar `Origin` (e `Referer` como fallback) contra `NEXT_PUBLIC_SITE_URL`. Não aceitar `*` em operações de escrita.
- **Rate limit distribuído:** limitar por `visitorId` quando existir e também por IP/origem de rede. O backend precisa de um storage compartilhado em produção (Redis/serviço de edge ou coleção Mongo com operações atômicas); um `Map` em memória só é permitido em desenvolvimento.
- **Idempotência:** aceitar `Idempotency-Key` em mutações e registrar o resultado por tempo limitado. Isso evita duplicação por retry de rede.
- **Headers:** `Cache-Control: no-store` para mutações e métricas privadas, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` e `Content-Disposition` seguro para PDFs.
- **Erros:** não expor stack trace, URI do MongoDB, dados do visitante ou detalhes de rate limit internos.
- **Observabilidade:** gerar `X-Request-Id`, registrar latência/status/rota e nunca registrar cookies, IP completo ou payload sensível.

### Limites iniciais

Os valores são configuráveis por ambiente e devem ser ajustados após observar tráfego:

| Endpoint | Limite por visitante | Limite por IP | Janela |
| --- | ---: | ---: | --- |
| `POST /api/metrics/view` | 5 | 30 | 1 minuto |
| `POST /api/metrics/like` | 10 | 30 | 1 minuto |
| `GET /api/resumes/[slug]` | 3 | 10 | 1 minuto |
| `GET /api/metrics` | 30 | 120 | 1 minuto |

Ao exceder o limite, retornar `429` com `Retry-After`. O rate limit de download deve ocorrer antes da renderização do PDF, pois essa é a operação mais cara.

### CORS no Next.js

Para o portfólio servido pelo mesmo domínio, CORS não é necessário: chamadas same-origin já carregam cookies e não exigem cabeçalho `Access-Control-Allow-Origin`. Ainda assim, o gate de `Origin`/CSRF deve existir para mutações.

Se no futuro um frontend em outro domínio consumir a API, habilitar CORS explicitamente por rota e por allowlist (`NEXT_PUBLIC_ALLOWED_ORIGINS`), nunca com `*` quando houver cookies. Responder também ao `OPTIONS` e permitir somente métodos e headers necessários.

## Contratos do domínio backend de métricas

- `MetricsController.getSnapshot()` chama `MetricsService.getSnapshot(visitorId)`.
- `MetricsController.registerPortfolioView()` chama `MetricsService.registerPortfolioView(visitorId, dateKey)`.
- `MetricsController.toggleLike()` chama `MetricsService.toggleLike(visitorId, idempotencyKey)`.
- `ResumeController.download()` chama `ResumeService.renderAndRecordDownload(...)`; o service registra `ViewType.Resume` somente após a geração do PDF.

Os controllers não devem aceitar `visitorId`, contadores ou `ViewType` do cliente. O identificador vem do cookie aleatório (opcionalmente assinado) e o tipo do recurso vem da própria rota.

## Erros e disponibilidade

Usar uma hierarquia de erros de domínio (`ValidationError`, `RateLimitError`, `NotFoundError`, `ConflictError`) e um único mapper no controller. Falha de métricas não deve impedir o HTML nem um PDF já gerado; a gravação pode ser tentada de forma assíncrona e observada. Falha de validação e rate limit, por outro lado, devem ser respostas determinísticas.

## Testes obrigatórios

- Unitários para services sem Next/Mongo real.
- Testes de repository com MongoDB de teste, incluindo índices e operações atômicas.
- Testes de controller para cada gate e status (`400`, `405`, `413`, `429`, `403`, `500`).
- Integração HTTP cobrindo cookie, CORS same-origin, idempotência, like, view e download.
- Teste de carga curto confirmando que o rate limit bloqueia rajadas antes da renderização do PDF.

## Critérios de aceite

- Nenhum Route Handler contém query MongoDB ou regra de negócio.
- Cada endpoint público declara e executa seus gates.
- Rajadas não conseguem iniciar milhares de renderizações de PDF.
- Likes e views são idempotentes dentro das janelas definidas.
- CORS fica fechado por padrão e só é aberto com allowlist explícita.
- Logs e respostas não vazam dados sensíveis.
