# Biosaúde Analytics 2.0

Plataforma corporativa de Business Intelligence para consolidar, validar,
processar, armazenar e apresentar os indicadores comerciais da Biosaúde
Produtos Hospitalares.

## Status

O repositório está na **Fase 1 — Fundação**. A implementação deve avançar por
fases e cada fase exige validação manual antes do início da próxima.

## Documentação normativa

- [`PROJECT_SPECIFICATION.md`](PROJECT_SPECIFICATION.md): fonte oficial dos
  requisitos do produto.
- [`BUSINESS_RULES.md`](BUSINESS_RULES.md): catálogo inicial das regras de
  domínio que deverão ter implementação única.
- [`CHANGELOG.md`](CHANGELOG.md): histórico versionado das alterações.
- [`docs/02_ARCHITECTURE.md`](docs/02_ARCHITECTURE.md): arquitetura técnica
  oficial e referência obrigatória para as fases de implementação.
- [`docs/03_DATABASE.md`](docs/03_DATABASE.md): modelo físico oficial e
  referência para a futura fase de banco de dados.
- [`docs/04_IMPORT_PROCESS.md`](docs/04_IMPORT_PROCESS.md): processo oficial,
  seguro, versionado e não destrutivo de importação.
- [`docs/05_DASHBOARD.md`](docs/05_DASHBOARD.md): especificação funcional,
  analítica e visual oficial do dashboard.
- [`docs/06_SECURITY.md`](docs/06_SECURITY.md): especificação oficial de
  segurança, identidade, autorização, privacidade e auditoria.
- [`docs/07_TESTING.md`](docs/07_TESTING.md): estratégia oficial de qualidade,
  testes, evidências e gates de entrega.
- [`docs/08_DEPLOYMENT_AND_OPERATIONS.md`](docs/08_DEPLOYMENT_AND_OPERATIONS.md):
  estratégia oficial de ambientes, deploy, operação e recuperação.
- [`docs/09_ROADMAP.md`](docs/09_ROADMAP.md): plano oficial, incremental e
  verificável para a implementação do produto.

## Regra para alterações

Uma regra de negócio somente pode ser modificada depois que a alteração for
registrada, nesta ordem, em `PROJECT_SPECIFICATION.md`, `BUSINESS_RULES.md` e
`CHANGELOG.md`.
