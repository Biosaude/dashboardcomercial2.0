# Regras de Negócio

Este catálogo deriva da especificação 2.0.0 e é normativo para a camada
`Domain`.

| ID | Regra | Invariante verificável |
|---|---|---|
| BR-001 | Implementação única | Todo cálculo de indicador reside na camada `Domain`; UI, gráficos e tabelas apenas consomem resultados. |
| BR-002 | Precisão monetária | Valores financeiros usam decimal, sem `float` e sem arredondamento intermediário. |
| BR-003 | Apresentação monetária | Apenas a apresentação arredonda e formata valores em `pt-BR`/BRL. |
| BR-004 | Meta Financeira | Representa somente valor monetário planejado de faturamento e sempre declara sua granularidade. |
| BR-005 | Faturamento | Representa somente valores efetivamente faturados. |
| BR-006 | UF do Hospital | Corresponde à localização física do hospital, sem substituição por outra dimensão geográfica ou comercial. |
| BR-007 | Fonte única | Hospital, representante, meta e faturamento pertencem, respectivamente, a `Hospitals`, `Representatives`, `Financial Targets` e `Billing Facts`. |
| BR-008 | Publicação segura | Nenhuma importação é publicada sem validação, parsing, staging, preview e confirmação. |
| BR-009 | Versão auditável | Toda importação registra identificador, hash, autor, data, arquivo, contagem, status, duração e observações. |
| BR-010 | Rollback não destrutivo | Rollback restaura uma versão anterior, preserva versões e histórico e produz evento de auditoria. |
| BR-011 | Indicadores controlados | O conjunto inicial é FY 2025, FY 2026, Meta Financeira, Cobertura, Diferença, Saldo para atingir Meta, Excedente e Variação percentual. |
| BR-012 | Administração protegida | Toda operação é autenticada e nenhuma API administrativa é pública. |

## Governança

Alterações neste catálogo exigem atualização prévia da especificação mestre e
registro simultâneo no changelog. A implementação somente pode mudar depois das
três atualizações documentais.
