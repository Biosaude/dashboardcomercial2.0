# Guia de Desenvolvimento — Fundação

## Setup local

Pré-requisitos: Node.js 22 ou superior e npm. A Fase 1 não usa variáveis de
ambiente. O timezone oficial inicial é `America/Belem`.

```bash
npm install
npm run dev
```

## Comandos

| Comando                                   | Finalidade                    |
| ----------------------------------------- | ----------------------------- |
| `npm run dev`                             | Servidor local                |
| `npm run format:check` / `npm run format` | Verificar/corrigir formatação |
| `npm run lint`                            | ESLint sem warnings tolerados |
| `npm run typecheck`                       | TypeScript strict             |
| `npm test` / `npm run test:watch`         | Vitest                        |
| `npm run test:e2e`                        | Smoke Playwright              |
| `npm run build` / `npm start`             | Produção local                |

## Convenções

- Imports internos usam `@/*`.
- Dependências apontam para dentro: presentation → application → domain.
- Contratos de fronteira usam Zod; regras permanecem no Domain.
- Testes ficam próximos do comportamento; snapshot nunca é a única asserção.
- shadcn/ui está preparado; componentes entram somente sob demanda.

## Logging

`createLogger` produz JSON server-side com contexto técnico em allowlist:
`request_id`, fase, operação, resultado, duração e código de erro. Nunca forneça
senha, token, segredo, arquivo, valor comercial ou PII. `LogWriter` é a fronteira
substituível para Sentry, OpenTelemetry ou equivalente em fase futura.

`resolveRequestId` preserva UUID v4 válido ou gera UUID seguro. Não há middleware
nesta fase.

## Troubleshooting

- Instalação: confirme acesso ao registry e Node suportado.
- Tipos: remova `.next` e repita `npm run typecheck`.
- E2E sem browser: `npx playwright install --with-deps chromium`.
- Nunca ignore erros; execute format, lint, tipos, testes e build na ordem.
