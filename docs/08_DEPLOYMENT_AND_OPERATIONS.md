# Estratégia Oficial de Deploy e Operações — Biosaúde Analytics 2.0

**Versão:** 1.0  
**Status:** Referência obrigatória; sem infraestrutura executável  
**Referências:** [Especificação](../PROJECT_SPECIFICATION.md) · [Regras](../BUSINESS_RULES.md) · [Arquitetura](02_ARCHITECTURE.md) · [Banco](03_DATABASE.md) · [Importação](04_IMPORT_PROCESS.md) · [Dashboard](05_DASHBOARD.md) · [Segurança](06_SECURITY.md) · [Testes](07_TESTING.md)

## Índice

1. [Objetivo](#1-objetivo)
2. [Princípios operacionais](#2-princípios-operacionais)
3. [Ambientes](#3-ambientes)
4. [Estratégia de branches](#4-estratégia-de-branches)
5. [Versionamento da aplicação](#5-versionamento-da-aplicação)
6. [CI](#6-ci)
7. [CD](#7-cd)
8. [Vercel](#8-vercel)
9. [Supabase](#9-supabase)
10. [Variáveis de ambiente](#10-variáveis-de-ambiente)
11. [Migrations em deploy](#11-migrations-em-deploy)
12. [Estratégia de release](#12-estratégia-de-release)
13. [Rollback da aplicação](#13-rollback-da-aplicação)
14. [Rollback de dados](#14-rollback-de-dados)
15. [Feature flags](#15-feature-flags)
16. [Observabilidade](#16-observabilidade)
17. [Logs operacionais](#17-logs-operacionais)
18. [Métricas](#18-métricas)
19. [Tracing](#19-tracing)
20. [Health checks](#20-health-checks)
21. [Alertas](#21-alertas)
22. [SLO, SLA e SLI](#22-slo-sla-e-sli)
23. [Backup](#23-backup)
24. [Restore](#24-restore)
25. [RPO e RTO](#25-rpo-e-rto)
26. [Disaster recovery](#26-disaster-recovery)
27. [Runbooks](#27-runbooks)
28. [Gestão de incidentes](#28-gestão-de-incidentes)
29. [Manutenção](#29-manutenção)
30. [Patches e dependências](#30-patches-e-dependências)
31. [Capacidade e escalabilidade](#31-capacidade-e-escalabilidade)
32. [Custos](#32-custos)
33. [Operação das importações](#33-operação-das-importações)
34. [Operação do dashboard](#34-operação-do-dashboard)
35. [Operação de segurança](#35-operação-de-segurança)
36. [Privacidade operacional](#36-privacidade-operacional)
37. [Suporte](#37-suporte)
38. [Auditoria operacional](#38-auditoria-operacional)
39. [Acessos administrativos](#39-acessos-administrativos)
40. [Proteção de produção](#40-proteção-de-produção)
41. [Preview deployments](#41-preview-deployments)
42. [Staging](#42-staging)
43. [Checklist de release](#43-checklist-de-release)
44. [Checklist de rollback](#44-checklist-de-rollback)
45. [Checklist de incidente](#45-checklist-de-incidente)
46. [Testes operacionais](#46-testes-operacionais)
47. [Gates operacionais](#47-gates-operacionais)
48. [Decisões operacionais](#48-decisões-operacionais)
49. [Decisões pendentes](#49-decisões-pendentes)
50. [Restrições](#50-restrições)
51. [Critérios de aceite](#51-critérios-de-aceite)

## 1. Objetivo

Esta estratégia define ambientes, release, observabilidade, manutenção, suporte e
recuperação de forma previsível, segura e sustentável. Aplica todos os documentos
normativos referenciados acima sem alterar regras. Deploy da aplicação entrega um
artefato; ativação de `dataset_version` publica dados por processo independente.
Um jamais implica o outro.

**Esta etapa documenta operações, mas não cria infraestrutura, workflow,
configuração, migration, script, job ou deploy executável.**

## 2. Princípios operacionais

- Infraestrutura declarativa/versionada quando possível; ambientes segregados.
- Nenhuma credencial compartilhada entre ambientes ou pessoas.
- Produção protegida; deploy reproduzível e migrations controladas.
- Rollback de app, banco e versão de dados são processos distintos.
- Observabilidade, backup testado, auditoria e runbooks são obrigatórios.
- Gates bloqueiam; menor privilégio vale em toda plataforma.
- Mudança manual exige registro, revisão posterior e evidência.
- Dado real só entra em ambiente formalmente autorizado.

## 3. Ambientes

| Ambiente | Finalidade | Dados permitidos | Deploy | Acesso | Observabilidade |
|---|---|---|---|---|---|
| local | Desenvolvimento e reset | Fictícios | Manual local reproduzível | Desenvolvedor | Logs redigidos; curta retenção |
| development | Integração contínua | Fictícios/sanitizados | Automatizável após gates | Equipe autorizada | Métricas/logs não produtivos |
| preview | Validar PR | Fictícios/sanitizados | Automático aceitável após CI | Protegido e temporário | Logs correlacionados/expiração |
| staging, se adotado | Ensaio integrado | Sanitizados representativos | Promoção controlada | Restrito | Próxima de produção, sem PII real por padrão |
| production | Serviço oficial | Reais autorizados | Aprovação + gates | Menor privilégio | Logs, métricas, traces e alertas |

Cada ambiente tem banco, Storage, Auth, variáveis, credenciais e retenção próprios.
Preview não usa segredo de produção. Limitações/cotas e staging são pendentes.

## 4. Estratégia de branches

Fluxo simples: branch principal protegida e sempre liberável; branches curtas de
feature/correção; PR com revisão/checks; merge conforme política aprovada; tag
imutável para release. Evita GitFlow sem necessidade. Histórico, changelog e
release ligam commit, evidências e aprovação; force-push/bypass são restritos.

## 5. Versionamento da aplicação

Semantic Versioning: major para incompatibilidade, minor para capacidade
compatível, patch para correção compatível. Tags/releases/changelog descrevem
compatibilidade. Quatro versões não se confundem:

- aplicação: artefato em execução;
- banco: sequência de migrations/schema compatível;
- schema de importação: contrato da planilha;
- dataset: base comercial ativa por organização.

Release declara compatibilidade entre as quatro, sem igualar seus números.

## 6. CI

Pipeline conceitual: checkout fixado; instalação limpa e lockfile; typecheck;
lint; unitários; integração; banco/reset/migrations/RLS quando existirem; build;
E2E; security/dependency/secret scanning; artifacts e relatórios redigidos. Falha
obrigatória bloqueia. Nenhum workflow é criado agora.

## 7. CD

Preview automático é aceitável para PR aprovado pelo CI, com dados fictícios,
proteção e credenciais isoladas. Produção exige artefato imutável, gates,
aprovação, evidências, comunicação e credencial dedicada. Promoção não recompila.
Falha aciona rollback autorizado e notificação. Deploy puramente automático em
produção só poderá ser aprovado após maturidade/riscos formalizados.

## 8. Vercel

Projeto(s), preview/production, domínios, variáveis, logs, funções e integração
GitHub seguem segregação. Previews são protegidos. Região, limites e timeout ficam
pendentes de volume/localidade. Acesso administrativo é individual e auditável;
segredo nunca é público. Rollback usa deploy anterior compatível.

## 9. Supabase

Recomendam-se projetos separados para produção e não produção, com Auth,
PostgreSQL, Storage, RLS, migrations, backup, logs e chaves segregados. Painel e
service role têm menor privilégio/MFA quando disponível. Mudanças passam por
migration e evidência, não dashboard manual. Responsabilidades de app, banco e
segurança são separadas.

## 10. Variáveis de ambiente

| Categoria | Escopo | Cliente/Servidor | Sensibilidade | Rotação |
|---|---|---|---|---|
| Pública | Configuração publicável | Cliente/servidor | Não secreta | Quando contrato muda |
| Privada | Serviço interno | Servidor | Restrita | Periódica/incidente |
| Banco/Auth/Storage | Ambiente específico | Servidor; publishable só quando previsto | Restrita, exceto chave publicável | Provedor/incidente |
| Observabilidade | DSN/token | Servidor; cliente só ID publicável | Variável | Ferramenta/incidente |
| Integração futura | Por integração | Servidor | Restrita | Política própria |

Nenhum segredo em `NEXT_PUBLIC_*`, Git ou `.env.example`; exemplo contém apenas
nomes/placeholders. Ambientes não compartilham valor. Inventário, acesso mínimo,
rotação, revogação e secret scanning são obrigatórios.

## 11. Migrations em deploy

Migration é validada/resetada antes do merge, aplicada em ordem por identidade
controlada e guarda backward compatibility durante rollout. Migration aplicada
não é alterada; correção é nova migration. Falha interrompe release, preserva
evidência e segue plano forward/restore aprovado. Reset local deve reconstruir.
Rollback de app não reverte banco automaticamente; compatibilidade é pré-condição.

## 12. Estratégia de release

```mermaid
flowchart LR
    A[Preparação e escopo] --> B[Freeze do artefato]
    B --> C[Validação e gates]
    C --> D[Aprovação]
    D --> E[Deploy controlado]
    E --> F[Smoke tests]
    F --> G[Monitoramento reforçado]
    G --> H[Comunicação]
    H --> I[Encerramento e evidências]
    F -->|falha| R[Rollback autorizado]
```

Freeze é do artefato/release, não bloqueio arbitrário do negócio. Encerramento
exige smoke, sinais estáveis, changelog e evidências.

## 13. Rollback da aplicação

Gatilhos: regressão, erro/latência crítica ou risco de segurança. Pessoa/papel
autorizado seleciona artefato anterior compatível com banco, executa rollback,
smoke e monitoramento, comunica e audita. Não altera dataset ativo nem restaura
banco implicitamente.

## 14. Rollback de dados

Segue integralmente [`04_IMPORT_PROCESS.md`](04_IMPORT_PROCESS.md). Operação admin
avalia impacto/janela, comunica, observa lock/transação, invalida cache pós-commit,
reconcilia dashboard e audita. Não redefine autorização, preservação ou fluxo.

## 15. Feature flags

Usar para código incompleto inacessível, rollout gradual, permissão, experimento
controlado ou kill switch. Flag tem owner, default seguro, ambientes, expiração e
remoção. Não oculta falha permanente nem substitui autorização/RLS. Ferramenta é
pendente.

## 16. Observabilidade

Três pilares: logs estruturados, métricas agregadas e traces correlacionados.
Contexto permitido: request/user/org pseudonimizados, batch/version IDs, duração,
resultado, código de erro, rota/operação/query class, cache e versão do deploy.
PII, arquivo, token e valor sensível são minimizados/redigidos.

## 17. Logs operacionais

JSON estruturado, níveis coerentes, request/trace IDs, redaction antes do sink,
busca e alerta. Acesso/export/retenção são controlados e pendentes. Proibidos
tokens, cookies, chaves, planilhas completas, PII desnecessária; stack pode existir
somente em sink restrito e nunca na resposta ao usuário.

## 18. Métricas

| Métrica | Origem | Dimensão | Alerta | Responsável |
|---|---|---|---|---|
| Disponibilidade/erro/throughput | App/Vercel | deploy, rota, ambiente | Threshold pendente | Operações |
| Latência | App/banco | p50/p95, operação | Meta/threshold aprovado | App + operações |
| Cache | Cache/app | hit/miss, versão/org agregada | Anomalia | App |
| Banco | PostgreSQL | conexão, query, lock | Saturação/erro | Banco/operações |
| Import/publicação/rollback | Lotes | etapa/status/duração | Travado/falha | Import/operações |
| Export | App/Storage | volume/status | Excesso/falha | App/segurança |
| Auth/autorização | Auth/app | sucesso/negação | Anomalia | Segurança |
| Storage/fila futura | Provedor | erro/volume/idade | Indisponível/backlog | Operações |
| Deploy | Vercel/CI | versão/resultado | Falha/regressão | Release owner |

Thresholds e owners organizacionais finais exigem aprovação; nomes acima são
papéis.

## 19. Tracing

Trace liga requisição → rota → caso de uso → query/cache e, nos fluxos longos,
batch → parsing/publicação/rollback ou export. Propaga IDs sem PII, registra
duração/resultado e amostragem controlada. Ferramenta/retenção são pendentes.

## 20. Health checks

Liveness prova processo vivo; readiness prova capacidade de servir sem revelar
segredo; deep check autenticado/operacional verifica banco, Auth, Storage,
dependências, migration/schema, cache e versão. Endpoint público retorna somente
estado mínimo. Deep check não executa mutação destrutiva.

## 21. Alertas

Cobrir indisponibilidade, erro/latência, login/negação anormais, publicação falha,
rollback, RLS, Storage/banco/migration/cache, export anormal, segredo e backup
falho. Alertas têm severidade, deduplicação, owner e runbook. Canais e thresholds
permanecem pendentes.

## 22. SLO, SLA e SLI

SLI é medida observada; SLO é objetivo interno do SLI; SLA é compromisso formal;
error budget é margem de não conformidade do SLO. Números finais são pendentes.
p95 agregado <1 s e interação <300 ms com cache são referências técnicas já
aprovadas, não SLA contratual automático.

## 23. Backup

Cobrir PostgreSQL, Storage, configurações versionáveis, auditoria, versões e
originais de importação conforme retenção. Backups são criptografados, com acesso
mínimo, monitoramento, inventário e evidência. Frequência/retenção ficam pendentes;
backup só é confiável após restore testado.

## 24. Restore

```mermaid
flowchart LR
    A[Solicitação] --> B[Autorização]
    B --> C[Seleção e integridade do backup]
    C --> D[Ambiente isolado de validação]
    D --> E[Restauração]
    E --> F[Verificação técnica e funcional]
    F --> G[Aprovação]
    G --> H[Restauração em produção]
    H --> I[Auditoria e monitoramento]
```

Restore periódico é obrigatório e comprova banco, arquivos, RLS, versões e
auditoria. Produção recebe plano, comunicação e janela autorizados.

## 25. RPO e RTO

RPO é perda máxima aceitável medida no tempo; RTO é tempo-alvo de recuperação.
Negócio, operações, segurança e produto aprovam por cenário após volume/impacto.
Nenhum valor é presumido.

## 26. Disaster recovery

| Cenário | Resposta conceitual |
|---|---|
| Perda/corrupção do banco | Conter escrita, validar backup, restore e reconciliar. |
| Perda do Storage | Bloquear downloads/imports, restaurar objetos/integridade. |
| Credencial comprometida | Revogar/rotacionar, investigar e redeploy seguro. |
| Vercel/Supabase indisponível | Confirmar fornecedor, comunicar, contingência aprovada. |
| Migration defeituosa | Interromper, plano forward/restore, manter app compatível. |
| Erro de publicação | Rollback de dataset aprovado, não de app. |
| Exclusão acidental | Preservar evidência, restore isolado e autorizado. |
| GitHub comprometido | Revogar tokens, proteger deploy, verificar histórico/artefatos. |

## 27. Runbooks

Obrigatórios: app, banco, Auth ou Storage indisponível; publicação travada;
importação falha; rollback; migration falha; credencial vazada; acesso/export
indevidos; backup falho. Cada runbook contém sintomas, impacto, diagnóstico,
contenção, recuperação, validação, comunicação e evidências, com owner/versão.

## 28. Gestão de incidentes

Detecção → classificação → resposta/comunicação → mitigação → resolução →
retrospectiva → corretivas verificadas. SEV-1: indisponibilidade/violação crítica;
SEV-2: impacto alto; SEV-3: impacto moderado; SEV-4: baixo. Definições e tempos
finais são pendentes. Incidente crítico sempre preserva evidência e retrospectiva.

## 29. Manutenção

Janela aprovada, comunicação, inventário de dependências/migrations/updates,
backup válido, testes/gates, plano de rollback e validação/smoke. Mudança emergente
é registrada e revisada depois; manutenção não autoriza bypass de segurança.

## 30. Patches e dependências

Security patch recebe triagem urgente; atualização regular é planejada; major
exige avaliação de breaking changes. Lockfile, audit, testes, changelog e rollback
são obrigatórios. Excel parser, Next.js, Supabase e transitivas recebem atenção a
advisories, suporte e conteúdo não confiável.

## 31. Capacidade e escalabilidade

Medir usuários, fatos/metas, arquivos, queries, Storage/banco, latência e
concorrência. Índice, particionamento, materialized view, fila, worker ou aumento
de recurso só são adotados após planos/métricas demonstrarem gargalo e teste
comprovar benefício, sem antecipação.

## 32. Custos

Observar Vercel, Supabase, Storage/egress, funções, banco, logs, observabilidade,
backup e ferramentas futuras por ambiente/serviço. Alertas e budgets finais são
pendentes; nenhum valor é estimado sem volume/preço aprovado.

## 33. Operação das importações

Seguir [`04_IMPORT_PROCESS.md`](04_IMPORT_PROCESS.md): observar lotes/etapas,
eventual fila, idade de lote, retry/falha/lock, preview, publicação, auditoria e
rollback. Lote travado segue runbook e nunca é “corrigido” por edição destrutiva.

## 34. Operação do dashboard

Monitorar ativa, namespace/invalidação de cache, erros, latência/query lenta,
ausência legítima, troca de versão e exports. Dado antigo não é mostrado como
atual. Request/version IDs permitem diagnóstico e reconciliação.

## 35. Operação de segurança

Rotinas: revisar acessos, segredos, logs/auditoria, dependências/alertas, usuários
inativos/papéis, Storage, previews e CI/CD. Frequências são pendentes e baseadas
em risco; exceções ficam registradas.

## 36. Privacidade operacional

Acesso produtivo é mínimo e temporário quando possível. Suporte, screenshot,
export, log, dump e backup minimizam/mascaram dados e usam canal autorizado.
Não copiar produção para outro ambiente. Compartilhamento e anonimização seguem
política jurídica/privacidade.

## 37. Suporte

Categorias: acesso, dado, import, dashboard, export, performance,
indisponibilidade e segurança. Chamado registra usuário/organização de forma
adequada, instante/timezone, request/batch/version ID, passos, impacto e evidência
redigida. Nunca solicita senha/token/arquivo completo sem fluxo aprovado.

## 38. Auditoria operacional

Registrar deploy/rollback, migration, variável (nome, não valor), rotação,
incidente, restore, acesso, ambiente, domínio e configuração: ator, aprovação,
instante, resultado, versão/request e before/after sanitizados.

## 39. Acessos administrativos

Menor privilégio, contas individuais e MFA quando disponível; compartilhamento é
proibido. Revisão/revogação, logs e auditoria obrigatórios. Break-glass, se
adotado, terá custódia, aprovação, expiração e revisão; desenho é pendente.

## 40. Proteção de produção

Branch/gates/aprovação protegidos; credenciais e acessos a banco/Vercel/Supabase
restritos; migration controlada; backup verificado; artefato imutável; smoke,
monitoramento e rollback prontos. Operador não altera dado/schema manualmente.

## 41. Preview deployments

Usam dados fictícios/sanitizados, auth/proteção, expiração, variáveis próprias,
acesso mínimo e logs redigidos. Segredo produtivo e dado real são proibidos sem
autorização excepcional formal e controles equivalentes.

## 42. Staging

Benefícios: ensaio de migration/E2E/release/integração e capacidade. Custos:
infraestrutura, sincronização, segurança e operação. Adoção é pendente e depende
de complexidade, criticidade, representatividade segura dos dados, integrações,
frequência de release e necessidade E2E.

## 43. Checklist de release

- [ ] Documentação/changelog e compatibilidade atualizados.
- [ ] Migrations, testes, RLS e segurança aprovados quando aplicáveis.
- [ ] Dependências, build, preview e evidências aprovados.
- [ ] Aprovação, backup/restore vigente e plano de rollback.
- [ ] Deploy do artefato correto; smoke e observabilidade estáveis.
- [ ] Comunicação e encerramento auditados.

## 44. Checklist de rollback

- [ ] Gatilho/impacto e autorização registrados.
- [ ] Compatibilidade de banco e backup verificados.
- [ ] Versão/artefato alvo identificado e execução auditada.
- [ ] Validação, smoke e monitoramento concluídos.
- [ ] Comunicação e encerramento registrados.

## 45. Checklist de incidente

- [ ] Conter sem destruir evidência.
- [ ] Preservar timeline, logs e versões.
- [ ] Comunicar pelos papéis/canais aprovados.
- [ ] Recuperar e validar integridade/segurança.
- [ ] Auditar decisões; retrospectiva e corretivas para incidente crítico.

## 46. Testes operacionais

Testar deploy e app rollback; data rollback; backup/restore; health/alertas;
rotação; indisponibilidade de cada dependência; migration falha; cache; export;
import; e DR. Exercícios usam ambiente controlado, critérios/evidências e não
dados reais indevidos.

## 47. Gates operacionais

Preview: CI/build/proteção; staging: testes/compatibilidade; production:
aprovação, backup, gates e rollback; migration: reset/revisão/compatibilidade;
restore: integridade/validação; rollback: autorização/compatibilidade/smoke;
incidente encerrado: recuperação, evidência, comunicação e corretivas atribuídas.

## 48. Decisões operacionais

| ID | Decisão | Motivo | Alternativas | Consequências |
|---|---|---|---|---|
| OPS-001 | Ambientes segregados | Segurança/reprodutibilidade | Compartilhar recursos | Custo e gestão separados |
| OPS-002 | Supabase produção separado | Isolar dado real | Projeto único | Migrations/config coordenadas |
| OPS-003 | Previews protegidos/fictícios | Evitar exposição | Preview público | Auth/expiração |
| OPS-004 | Produção aprovada | Controlar risco | Auto irrestrito | Gate humano atual |
| OPS-005 | Migrations controladas | Evitar drift | SQL manual | Processo versionado |
| OPS-006 | Observabilidade obrigatória | Detectar/diagnosticar | Operar por relato | Instrumentação/redaction |
| OPS-007 | Logs estruturados | Correlação | Texto livre | Schema/retenção |
| OPS-008 | Backup com restore testado | Recuperação real | Backup não validado | Exercícios periódicos |
| OPS-009 | Rollbacks separados | Evitar dano semântico | Um rollback global | Runbooks distintos |
| OPS-010 | Smoke pós-deploy | Detectar regressão | Apenas CI | Gate do ambiente |
| OPS-011 | Credenciais não compartilhadas | Isolamento/auditoria | Reuso | Inventário/rotação |
| OPS-012 | Operação por runbooks | Resposta previsível | Improviso | Manutenção/revisão |
| OPS-013 | Admin individual | Responsabilização | Conta compartilhada | MFA/revisão |
| OPS-014 | Preview sem dado real | Privacidade | Clone produção | Fixtures/sanitização |
| OPS-015 | Gates bloqueiam deploy | Qualidade | Avisos | Falha impede promoção |

## 49. Decisões pendentes

Staging; frequência de deploy; janelas; thresholds; ferramentas de observabilidade
e alerta; retenção de logs/backups; RPO/RTO; canais/on-call; SLA; regiões/limites
de função; fila; break-glass; budgets de custo; política de suporte; frequência de
revisão de acesso. Nada será decidido por suposição.

## 50. Restrições

É proibido: segredo/conta admin compartilhados; dado real em preview sem
autorização; deploy sem gate/smoke; migration manual não versionada; alteração
produtiva sem registro; rollback destrutivo; backup sem restore testado; segredo
em log; preview público com dados; credencial produtiva em dev; incidente crítico
sem retrospectiva; mudança operacional sem auditoria.

## 51. Critérios de aceite

- [x] consistente com documentos anteriores, sem alterar regra;
- [x] índice, ambientes, CI/CD, Vercel/Supabase e variáveis definidos;
- [x] migrations, release e rollbacks distintos definidos;
- [x] observabilidade, health, alertas e SLI/SLO/SLA definidos;
- [x] backup, restore, RPO/RTO e DR definidos;
- [x] runbooks, incidentes, manutenção, capacidade e custos definidos;
- [x] import/dashboard/security/privacy/support/auditoria operacionais definidos;
- [x] proteção, preview, staging e checklists definidos;
- [x] testes/gates, decisões, pendências e restrições definidos;
- [x] nenhuma infraestrutura executável criada.

Este documento encerra somente a definição documental de deploy e operações.
