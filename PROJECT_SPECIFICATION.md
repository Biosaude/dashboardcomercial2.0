# Biosaúde Analytics 2.0 — Product Specification

**Versão:** 2.0.0  
**Status:** Documento Mestre  
**Última atualização:** Agosto/2026

## 1. Visão geral

O Biosaúde Analytics 2.0 é uma plataforma corporativa de Business Intelligence
para consolidar, validar, processar, armazenar e apresentar indicadores
comerciais da Biosaúde Produtos Hospitalares. Substitui integralmente o
dashboard anterior e prioriza confiabilidade, rastreabilidade, desempenho,
escalabilidade, manutenção simples, segurança e experiência do usuário.

Sua missão é oferecer uma plataforma única, com indicadores consistentes e
auditáveis, para a Diretoria, as Gerências e as áreas estratégicas.

## 2. Capacidades obrigatórias

A plataforma deve importar e validar bases comerciais; controlar versões e
histórico; executar rollback; consolidar faturamento e Meta Financeira; calcular
indicadores; gerar dashboards executivos e analíticos; permitir drill-down e
exportação; manter auditoria completa, permissões e rastreabilidade.

## 3. Módulos

- **Dashboard Executivo:** acompanhamento estratégico.
- **Dashboard Analítico:** análises detalhadas.
- **Importação:** recepção, validação, preview e publicação de planilhas.
- **Histórico:** controle de versões importadas e rollback.
- **Auditoria:** registro integral das ações.
- **Administração:** usuários, perfis, hospitais, dimensões e configurações.

## 4. Princípios obrigatórios

- **Integridade:** dados nunca são alterados sem rastreabilidade.
- **Simplicidade:** cada regra possui uma única implementação.
- **Modularidade:** cada domínio possui responsabilidade única.
- **Segurança:** toda operação exige autenticação.
- **Performance:** consultas não carregam dados desnecessários.
- **Escalabilidade:** a arquitetura suporta o crescimento da base.
- **Auditabilidade:** toda alteração é registrada.

## 5. Acesso

Existem quatro perfis: **Viewer**, **Analyst**, **Importer** e
**Administrator**. Suas permissões devem ser documentadas e aplicadas por RBAC e
RLS.

## 6. Indicadores oficiais iniciais

- FY 2025
- FY 2026
- Meta Financeira
- Cobertura
- Diferença
- Saldo para atingir Meta
- Excedente
- Variação percentual

Novos indicadores exigem documentação oficial antes da implementação.

## 7. Dimensões oficiais

Ano, Trimestre, Mês, Período, GR, UF Comercial, Hospital, UF do Hospital,
Representante, Assessor, Marca, Tópico, Tipo do Produto, Cliente, UF do Cliente,
Médico, Organização, Lote e Versão.

## 8. Fonte da verdade

Cada informação tem uma única fonte. Hospital pertence a `Hospitals`,
Representante a `Representatives`, Meta Financeira a `Financial Targets` e
Faturamento a `Billing Facts`. É proibido duplicar a mesma informação em tabelas
diferentes.

## 9. Regras de domínio e financeiras

Todas as regras existem exclusivamente na camada **Domain**. É proibido
calcular indicadores em componentes React, Meta Financeira em gráficos, ou
duplicar fórmulas em tabelas e outros consumidores.

Valores financeiros usam precisão decimal: nunca `float`, nunca arredondamento
durante cálculos. O arredondamento ocorre somente na apresentação, em `pt-BR` e
BRL.

Meta Financeira é exclusivamente o valor monetário planejado de faturamento e
deve ter granularidade conhecida. Não representa procedimentos, produtos,
recebimento, utilizado, pendências ou despesas.

Faturamento é exclusivamente o valor efetivamente faturado. Não representa
pedido, cotação, meta, recebimento ou utilização.

UF do Hospital é a localização física do hospital. Nunca pode ser substituída
por UF Comercial, UF Cliente, UF Representante, GR ou Cidade.

## 10. Importação e versionamento

O fluxo obrigatório é:

`Upload → Validação → Parsing → Staging → Preview → Confirmação → Publicação → Auditoria → Versão Ativa → Rollback`

Publicação direta é proibida. Cada importação gera Version ID, hash, usuário,
data, arquivo, quantidade de registros, status, tempo e observações.

Rollback restaura uma versão anterior, preserva todo o histórico, não exclui
versões e registra a operação na auditoria.

## 11. Segurança

São obrigatórios Supabase Auth, RBAC, RLS, policies, headers seguros, rate
limit, proteção CSRF e XSS, CSP e auditoria. Nenhuma API administrativa pode ser
pública.

## 12. Metas de performance

- Consultas abaixo de 1 segundo.
- Aplicação de filtros abaixo de 300 ms.
- Uploads grandes processados de forma assíncrona.
- Cache segmentado por versão.
- Paginação e consultas agregadas.

## 13. Qualidade e documentação

Testes unitários, de integração, E2E, smoke, performance e segurança são
obrigatórios. Nenhuma funcionalidade é concluída sem testes.

Cada módulo deve documentar arquitetura, banco, regras, importação, APIs,
dashboard, deploy, testes e roadmap.

## 14. Fases de desenvolvimento

1. Fundação
2. Banco
3. Autenticação
4. Importação
5. Regras de Negócio
6. Dashboard
7. Administração
8. Testes
9. Deploy

Cada fase termina com lint, typecheck, testes, build, commit e documentação.
Antes da fase seguinte, a validação manual é obrigatória.

## 15. Definição de sucesso

O projeto é concluído quando todas as funcionalidades estiverem implementadas e
testadas; indicadores forem reconciliáveis; nenhuma informação depender de
intervenção manual; importações forem versionadas; rollback e auditoria estiverem
completos; documentação e deploy automatizado estiverem atualizados; e a
plataforma estiver apta à produção.

## 16. Política de alterações

Nenhuma regra de negócio pode ser alterada diretamente no código. Toda mudança
deve atualizar primeiro `PROJECT_SPECIFICATION.md`, depois `BUSINESS_RULES.md` e
por fim `CHANGELOG.md`; somente então a implementação pode ser modificada.

Este documento é a fonte oficial de requisitos do projeto. Todo desenvolvimento
deve obedecê-lo integralmente.
