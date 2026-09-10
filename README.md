# portfolio-v100

Portfólio pessoal de Augusto Westphal, executado como uma aplicação Next.js única. Route Handlers e MongoDB vivem na própria aplicação.

## Mapa do repositório

| Caminho | Responsabilidade |
| --- | --- |
| `src/` | Interface Next.js, conteúdo do portfólio, internacionalização e componentes. |
| `docs/README.md` | Arquitetura, convenções e pontos de extensão da aplicação. |
| `docs/recruiter-mode/spec.md` | Especificação do modo recrutador e seu faseamento. |
| `docs/migrations/next-migration.md` | Plano de migração da SPA para Next.js. |
| `ACII.spec.md` | Especificação em andamento do recurso visual ASCII. |

## Desenvolvimento

Instale as dependências de cada pacote uma vez:

```bash
npm run install:all
```

Para executar a aplicação:

```bash
npm run dev
```

A aplicação roda em `http://localhost:5173`. Copie `.env.example` para `.env.local` para configurar a URL pública e o MongoDB. Para MongoDB local, há um serviço em `docker-compose.yml`.

`GET /api/health` é um Route Handler do Next. Modelos e conexão MongoDB são exclusivos do servidor em `src/libs/backend/`.

## Build e verificações

```bash
npm run build
npm run lint
```

O comando de build gera a aplicação Next.js.

## Antes de alterar algo

1. Leia [o guia da aplicação](docs/README.md).
2. Para mudanças no modo recrutador, use primeiro a [especificação funcional](docs/recruiter-mode/spec.md).
3. Trate arquivos modificados que não pertencem à tarefa como trabalho local do autor; não os reverta nem os reformate por acidente.
