# Retomada de Sessão — Mapa de Jornadas BHub

> Mantenha este arquivo atualizado ao encerrar cada sessão.
> No início de uma nova conversa, compartilhe este arquivo para retomar o contexto completo.

---

## O que é este projeto

Ferramenta interna para criar, visualizar e manter jornadas padrão do cliente BHub. O problema central é que a BHub não tem um formato único para documentar como o cliente interage com a empresa de ponta a ponta — por múltiplos canais, ao longo do mês.

A ferramenta terá dois modos: **viewer** (navegar jornadas existentes) e **editor** (criar/editar jornadas e steps).

---

## Estado atual

**Fase:** Fase 2 concluída. Iniciando Fase 3.
**Branch ativa:** `main`

**O que existe:**
- `docs/` — PRD v0.2, Backlog, Decisões, Sessão
- `_temp/` — protótipo v0.8 e transcrição (referência, não editar)
- `src/data/journeys.json` — 6 jornadas extraídas e expandidas do protótipo
- `public/screenshots/` — 7 imagens extraídas do base64 (tela1.png–tela7.png)
- `src/services/search.js` — TF-IDF local com slot para Claude API
- `src/services/impact.js` — análise de impacto por regras simples com slot para Claude API
- `src/components/Sidebar.jsx` — sidebar com busca TF-IDF, agrupamento por categoria, botão "+ Nova jornada"
- `src/components/Timeline.jsx` — swimlane 4 colunas (humor | cliente | timeline | BHub) + modo edição com drag-and-drop nativo e trilha de humor
- `src/components/ClientCard.jsx` — card expandível com screenshot, feedback badges, lightbox
- `src/components/BHubCard.jsx` — card discreto (linha fina colapsado, expandido full)
- `src/components/BranchView.jsx` — ramificação visual em grid 2 colunas
- `src/components/ScreenshotViewer.jsx` — lightbox de tela cheia
- `src/hooks/useJourneys.js` — estado global, persistência em localStorage, CRUD de jornadas e steps (incluindo moveStep)
- `src/components/editor/JourneyEditor.jsx` — modal de criar/editar metadados da jornada
- `src/components/editor/StepEditor.jsx` — formulário inline de criar/editar step
- `src/App.jsx` — app principal com todos os modos integrados

**B-001 a B-006 concluídos** (criar/editar/excluir step, screenshot, drag-and-drop, criar/editar jornada).

**Bug fix:** modo edição redesenhado — barra de ações fina acima de cada step substitui botões absolutos que sobrepunham conteúdo dos cards.

**Nova feature:** trilha de humor do cliente — coluna 44px à esquerda com emojis por step. Popover inline (grid de 10 emojis + descrição + salvar/limpar). Dados: `moodEmoji` + `moodNote` no step.

**O que ainda não existe:**
- Mapeamento de impacto na UI (Fase 3: B-009 a B-011)
- Export/Import JSON (Fase 3: B-013 a B-015)
- Export como documento de requisitos (Fase 3: B-018)
- Protótipo navegável (Fase 4: B-019)
- Import de fluxo visual / texto / geração por IA (B-021 a B-023)
- Integração com repositórios (Fase 5: B-020)

---

## Próximo passo imediato

**Fase 3**

Próximos itens (por prioridade):
- B-013/B-014: export e import JSON da jornada
- B-009/B-010: mapeamento de impacto na UI (detecção de referências cruzadas + alerta ao excluir)
- B-018: export como documento de requisitos (.md)

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
- Git: **nunca** fazer commit, merge, PR ou criar branch sem pedido explícito — nem em auto mode

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
