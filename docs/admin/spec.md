# Painel administrativo — autenticação e autorização

**Status:** proposta para implementação em fases  
**Escopo:** painel `/admin`, autenticação local, sessão em cookie e autorização por permissões.

## 1. Objetivo

Criar uma área administrativa privada para operar recursos do portfólio sem misturar esse
acesso com visitantes, métricas públicas ou o modo recrutador. A primeira entrega terá apenas
um usuário, Augusto, mas o modelo deve permitir novos administradores e permissões sem trocar a
semântica de autenticação.

O sistema separa três responsabilidades:

1. **Autenticação:** confirma a identidade por e-mail e senha.
2. **Sessão:** transporta uma credencial curta, cifrada e assinada em cookie `HttpOnly`.
3. **Autorização:** permite cada ação por uma permissão atômica, nunca por uma checagem do nome
   da role `superadmin`.

Não haverá cadastro público, recuperação de senha, login social ou API de administração de
usuários na primeira fase.

## 2. Decisões técnicas

| Necessidade | Decisão | Motivo |
| --- | --- | --- |
| Token de sessão | `jose` com JWT cifrado (JWE) | Implementa JWT, assinatura e criptografia, funciona no runtime do Next e é uma das bibliotecas de sessão indicadas pela documentação do framework. |
| Cookie | `cookies()` de `next/headers` | É a API recomendada pelo Next para ler, definir e remover cookies de sessão; não introduzir uma biblioteca só para isso. |
| Senhas | `argon2`, algoritmo `argon2id` | É uma biblioteca madura voltada a hash/verificação de senha, com `argon2id` como padrão. Senhas são submetidas a *hash*, não reversivelmente criptografadas. |
| Persistência | MongoDB, já usado pelo backend | Mantém usuários, sessões revogáveis, roles e auditoria junto da infraestrutura existente. |
| Runtime | Node.js para autenticação e admin | `argon2` é nativo; todas as rotas que o importam devem declarar `runtime = "nodejs"`. |

Adicionar as dependências somente na fase de implementação:

```bash
npm install jose argon2
```

`jose` será usado com `EncryptJWT`/`jwtDecrypt`, chave simétrica e algoritmo explicitamente
permitido (`dir` + `A256GCM`). Isso protege confidencialidade e integridade dos claims no
browser. Não usar um JWT somente assinado: sua carga é legível mesmo que não possa ser alterada.

## 3. Modelo de autorização

### 3.1 Permissões atômicas

Uma permissão representa uma capacidade de produto, no formato `recurso.ação`. Ela não depende
de tela, URL ou role. O catálogo inicial é pequeno, mas já cobre a evolução do painel:

```ts
export const ADMIN_PERMISSIONS = [
  "admin.access",
  "admin.dashboard.read",
  "metrics.read",
  "feedback.read",
  "feedback.moderate",
  "resume.catalog.read",
  "resume.catalog.manage",
  "admin.users.read",
  "admin.users.manage",
  "audit.read",
] as const
```

Uma rota ou ação declara a menor permissão necessária, por exemplo
`requirePermission("resume.catalog.manage")`. Esconder um item de navegação não é autorização:
Route Handlers, Server Actions, serviços e carregamentos de dados protegidos executam seu próprio
gate.

### 3.2 Packs de permissão (roles)

Role é apenas um pacote nomeado de permissões, e não uma regra especial no código:

```ts
const SUPERADMIN_ROLE = {
  id: "superadmin",
  permissions: ADMIN_PERMISSIONS,
}
```

O primeiro usuário recebe `roleIds: ["superadmin"]`. Ao criar, por exemplo, uma role
`metrics-editor`, ela recebe somente as permissões correspondentes. As permissões efetivas são a
união das roles do usuário e de futuras concessões diretas; negações explícitas ficam fora do
escopo inicial para evitar regras de precedência ambíguas.

## 4. Dados e índices

Todos os documentos pertencem ao novo domínio `backend/admin/`; hashes, tokens e dados de
auditoria nunca são serializados para componentes cliente.

### `admin_users`

```ts
type AdminUser = {
  _id: ObjectId
  email: string                 // normalizado: trim + lowercase
  passwordHash: string          // somente resultado Argon2id
  roleIds: string[]
  directPermissions?: Permission[]
  status: "active" | "disabled"
  authorizationVersion: number  // incrementa quando roles/permissões/status mudam
  passwordVersion: number       // incrementa ao trocar senha
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}
```

- índice único para `email`;
- nunca salvar senha, segredo JWT, reset token ou payload do cookie;
- somente o bootstrap inicial cria o primeiro usuário; não existe endpoint público de criação.

### `admin_roles`

```ts
type AdminRole = {
  _id: string                   // ex.: "superadmin"
  name: string
  permissions: Permission[]
  version: number
  createdAt: Date
  updatedAt: Date
}
```

O seed é idempotente: garante o catálogo de permissões e atualiza a role `superadmin` para
conter todas elas. Ele não sobrescreve roles futuras sem uma migração explícita.

### `admin_sessions`

```ts
type AdminSession = {
  _id: string                   // mesmo valor de jti/sid do JWT
  userId: ObjectId
  authorizationVersion: number
  createdAt: Date
  expiresAt: Date
  revokedAt?: Date
  lastSeenAt?: Date
  userAgentHash?: string
  ipHash?: string
}
```

- índice único em `_id`;
- TTL em `expiresAt`, com a verificação de expiração feita também pela aplicação;
- `ipHash` e `userAgentHash` são apenas indicadores de auditoria, nunca bloqueios frágeis nem
  valores brutos.

### `admin_audit_events`

Registra `actorUserId`, `sessionId`, `action`, alvo mínimo, `requestId`, resultado e data. Não
armazena senha, cookie, JWT inteiro, cabeçalho Authorization, IP completo ou payload sensível.
O login bem-sucedido, logout, falha de login, troca de senha, alteração de role e toda mutação
administrativa criam evento.

## 5. JWT e cookie

### Claims

O token leva somente o necessário para checagens otimistas e para correlacionar a sessão:

```ts
type AdminSessionClaims = {
  sub: string                   // id do admin
  sid: string                   // id da sessão no banco
  roles: string[]
  permissions: Permission[]     // snapshot efetivo
  av: number                    // authorizationVersion
  pv: number                    // passwordVersion
  iss: "portfolio-v100"
  aud: "portfolio-v100-admin"
  iat: number
  exp: number
  jti: string
}
```

Não incluir e-mail, nome, senha, hash de senha, dados pessoais ou dados de produto. Mesmo cifrado,
o token deve ser mínimo e nunca ser tratado como armazenamento de perfil.

### Chaves

- `ADMIN_JWT_ENCRYPTION_KEY`: segredo aleatório de 32 bytes, codificado em base64url; obrigatório
  fora de testes e exclusivo do admin.
- `ADMIN_JWT_KEY_ID`: identificador da chave ativa (`kid`), permitindo rotação.
- A implementação aceita a chave ativa e, durante a rotação, uma allowlist curta de chaves
  anteriores identificadas por `kid`. Após a janela de expiração máxima, a chave antiga sai da
  allowlist e todas as sessões correspondentes são revogadas.
- Segredos ficam apenas no gerenciador de variáveis do deploy e em `.env.local`; nunca em
  `NEXT_PUBLIC_*`, commits, logs ou mensagens de erro.

### Cookie

Em produção o nome é `__Host-admin_session`; em desenvolvimento pode ser
`admin_session`. A configuração é:

```ts
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 8,
  priority: "high",
}
```

O prefixo `__Host-` impede `Domain` e exige `Path=/` e `Secure`, reduzindo colisões com
subdomínios. O token expira em oito horas; logout, troca de senha, desativação do usuário ou
alteração de autorização revogam a sessão imediatamente no banco e removem o cookie. Um token
válido, mas sem sessão ativa ou com `av`/`pv` divergente do usuário, é inválido.

## 6. Fluxos

### Bootstrap inicial

1. Um comando server-only cria as permissões, a role `superadmin` e o usuário inicial, ou falha
   caso já exista um admin ativo.
2. E-mail e senha são fornecidos de forma interativa (sem ficar no histórico do shell); a senha é
   validada e recebe hash Argon2id antes da persistência.
3. O comando não imprime senha, hash, segredo nem token.

O comando é uma operação de deploy/operador, não uma rota HTTP. Alterar a senha inicial após o
primeiro login é requisito da interface futura.

### Login

1. `POST /api/admin/auth/login` recebe e-mail e senha, valida formato/limite de corpo e executa
   rate limit por IP e e-mail normalizado.
2. Busca usuário ativo; a resposta para e-mail inexistente, usuário desativado e senha incorreta
   é sempre `401` genérica.
3. `argon2.verify` compara a senha. Em sucesso, resolve as permissões, cria `admin_sessions`,
   gera o JWE e define o cookie pelo `cookies()` do Next.
4. Retorna somente um DTO seguro e redireciona para `/admin` no cliente. A rota usa
   `Cache-Control: no-store`.

### Requisição protegida

```text
cookie -> decrypt/validate JWE -> claims mínimas válidas?
       -> sessão ativa + usuário ativo + versões compatíveis?
       -> permissão exigida presente? -> controller/service
```

- Sem cookie ou token inválido: `401` para API; redirect para `/admin/login` em página.
- Sessão válida, porém sem permissão: `403` para API; página de acesso negado para UI.
- A consulta de sessão/usuário ocorre perto do dado e da mutação. O `proxy.ts` pode apenas evitar
  renderização desnecessária de `/admin`; não é fronteira de segurança.

### Logout e revogação

- `POST /api/admin/auth/logout` revoga `sid`, remove o cookie e audita o evento.
- Troca de senha incrementa `passwordVersion` e revoga todas as sessões do usuário.
- Mudança de roles/permissões, desativação ou exclusão incrementa `authorizationVersion` e revoga
  todas as sessões do usuário.
- O login pode oferecer futuramente uma tela de sessões ativas e revogação individual; o modelo
  já suporta isso.

## 7. Rotas, UI e organização

```text
src/app/
  admin/login/page.tsx
  admin/(protected)/layout.tsx
  admin/(protected)/page.tsx
  api/admin/auth/login/route.ts
  api/admin/auth/logout/route.ts
  api/admin/.../route.ts

backend/admin/
  models/
  repositories/
  services/
  controllers/
  authorization/                # catálogo, resolvePermissions, requirePermission
  session/                      # JWE, cookie, verifyAdminSession
```

O layout protegido chama `requireAdminSession()`, mas cada página, Server Action, Route Handler e
service de dado sensível chama `requirePermission(...)` de novo. A navegação mostra somente
módulos permitidos, como conveniência de interface.

O dashboard inicial é deliberadamente mínimo: identificação do administrador, logout e cards de
módulos já existentes. Não publicar controle de usuários, feedback ou catálogo de currículos até
cada domínio possuir serviço, autorização e critérios próprios.

## 8. Gates de segurança

Além dos gates definidos em `docs/backend/spec.md`, as rotas `/api/admin/**` devem ter:

- `Origin` obrigatório e same-origin em toda mutação; `SameSite=Strict` é defesa adicional, não
  substitui essa validação CSRF;
- rate limit persistente: login inicialmente 5 tentativas por e-mail/IP em 15 minutos; falhas
  recebem espera progressiva e `429` quando aplicável;
- corpo JSON com schema/limite explícito, `Content-Type` esperado e `Cache-Control: no-store`;
- headers `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` para o admin e CSP
  restritiva, sem scripts de terceiros;
- mensagens de erro sem enumeração de usuário, stack trace, hash, claims ou motivo de decrypt;
- comparação e verificação sempre no servidor; o browser nunca lê o cookie de admin;
- possibilidade de MFA (TOTP ou, preferencialmente, WebAuthn) antes de expor operações destrutivas
  ou adicionar mais usuários.

## 9. Fases de entrega

### Fase 1 — fundação autenticada

- Instalar `jose` e `argon2`; criar modelos, índices, seed e comando de bootstrap.
- Implementar JWE, cookie, login, logout, revogação e `requireAdminSession`.
- Proteger `/admin` e apresentar dashboard mínimo.
- Criar auditoria dos fluxos de autenticação.

### Fase 2 — autorização de produto

- Implementar `Permission`, roles, resolução de permissões e `requirePermission`.
- Atribuir `superadmin` ao usuário bootstrap, sem `if (role === "superadmin")` no produto.
- Conectar o primeiro módulo administrativo real, com seu próprio gate e testes.

### Fase 3 — gestão futura

- Tela de usuários, roles e sessões; cada operação protegida por suas permissões atômicas.
- Troca de senha, MFA/WebAuthn, revogação por dispositivo e rotação operacional de chaves.
- Se necessário, adicionar permissões diretas e políticas contextuais sem alterar os claims base.

## 10. Critérios de aceite

- Só o usuário bootstrap consegue autenticar; não existe rota de cadastro público.
- Senha nunca é persistida nem registrada em texto puro; o banco guarda apenas hash Argon2id.
- O cookie é `HttpOnly`, `Secure` em produção, `SameSite=Strict`, com expiração e sem `Domain`.
- O JWT é JWE e valida algoritmo, emissor, audiência, expiração, `kid` e claims esperados.
- Toda rota/mutação administrativa retorna `401` sem sessão e `403` sem permissão, mesmo que a UI
  esteja manipulada ou a chamada seja feita diretamente.
- Alterar autorização, desativar usuário ou trocar senha invalida sessões existentes.
- `superadmin` equivale ao pack de todas as permissões, e nenhuma funcionalidade depende de seu
  nome.
- Logs e eventos de auditoria não vazam cookies, JWTs, senhas, hashes ou dados pessoais.
- Testes cobrem login válido/inválido, expiração, decrypt inválido, logout, revogação, 401, 403,
  composição de roles e cada gate CSRF/rate-limit.

## Referências

- O Next recomenda a API [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies)
  para ler/escrever cookies em Route Handlers e Server Functions.
- No guia de autenticação, o Next indica `jose` ou `iron-session` para sessões e orienta usar
  cookies `HttpOnly`, `Secure`, `SameSite`, `Max-Age/Expires` e `Path`.
  [Guia oficial](https://nextjs.org/docs/app/guides/authentication)
- [`jose`](https://github.com/panva/jose) suporta JWE/JWT, criptografia, decriptação e validação
  dos claims nos runtimes compatíveis com o Next.
- [`argon2`](https://github.com/ranisalt/node-argon2) oferece hash e verificação de senha com
  Argon2id como padrão.
