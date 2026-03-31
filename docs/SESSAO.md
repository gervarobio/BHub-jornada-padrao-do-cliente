# Retomada de Sessão — Mapa de Jornadas BHub

> Mantenha este arquivo atualizado ao encerrar cada sessão.
> No início de uma nova conversa, compartilhe este arquivo para retomar o contexto completo.

---

## O que é este projeto

Ferramenta interna para criar, visualizar e manter jornadas padrão do cliente BHub. O problema central é que a BHub não tem um formato único para documentar como o cliente interage com a empresa de ponta a ponta — por múltiplos canais, ao longo do mês.

A ferramenta terá dois modos: **viewer** (navegar jornadas existentes) e **editor** (criar/editar jornadas e steps).

---

## Estado atual

**Fase:** Pré-desenvolvimento — documentação pronta, código ainda não começou.

**O que existe:**
- `docs/PRD.md` — requisitos e arquitetura completos
- `docs/BACKLOG.md` — items priorizados por grupo e fase
- `docs/DECISOES.md` — histórico de decisões tomadas
- `_temp/prototipo.jsx` — protótipo v0.8 gerado no Claude Desktop (541 linhas, maioria base64)
- `_temp/conversa.md` — transcrição da sessão no Claude Desktop que originou o protótipo

**O que ainda não existe:**
- Projeto React/Vite
- Nenhum componente implementado
- `journeys.json` (dados ainda estão hardcoded no protótipo)
- Screenshots como arquivos (ainda estão como base64 no protótipo)

---

## Próximo passo imediato

**Fase 1 — Viewer (MVP)**

1. Criar projeto Vite + React
2. Extrair dados do `_temp/prototipo.jsx` para `src/data/journeys.json`
3. Extrair imagens base64 para arquivos em `public/screenshots/`
4. Implementar componentes do viewer fiel ao visual v0.8:
   - `Sidebar.jsx`
   - `Timeline.jsx` (swimlane 3 colunas)
   - `ClientCard.jsx`
   - `BHubCard.jsx`
   - `BranchView.jsx`
   - `ScreenshotViewer.jsx` (lightbox)
5. `App.jsx` com estado e roteamento entre jornadas

---

## Arquivos críticos para conhecer

| Arquivo | O que é |
|---|---|
| `docs/PRD.md` | Requisitos, visual, arquitetura, fases |
| `docs/BACKLOG.md` | Items de desenvolvimento com prioridade e status |
| `docs/DECISOES.md` | Por que cada decisão foi tomada |
| `_temp/prototipo.jsx` | Protótipo de referência visual (não editar) |

---

## Decisões já tomadas (resumo)

- Stack: React + Vite, inline styles (sem lib de CSS)
- Dados: `journeys.json` versionado no repo
- Imagens: arquivos em `/public/screenshots/`, não base64
- Busca: TF-IDF local no MVP (API Claude como upgrade futuro)
- Impacto: detecção por regras simples no MVP (análise semântica como upgrade futuro)
- Git: nunca fazer commit/PR/branch sem pedido explícito do Rodrigo

---

## Perguntas abertas

- Screenshots vão para o repo git ou storage externo?
- Jornadas prioritárias além das 6 do protótipo?
- A ferramenta rodará local ou hospedada?

---

## Como atualizar este arquivo

Ao encerrar uma sessão produtiva, atualize as seções:
- **Estado atual** — o que foi feito
- **Próximo passo imediato** — o que vem a seguir
- **Perguntas abertas** — remova as respondidas, adicione as novas
