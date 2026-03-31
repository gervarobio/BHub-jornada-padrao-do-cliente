# Log de Decisões — Mapa de Jornadas BHub

> Registro cronológico de decisões tomadas, caminhos abandonados e mudanças de direção.
> Adicione uma entrada sempre que algo relevante for decidido ou alterado.

---

## Formato de entrada

```
### [DATA HH:MM] Título curto da decisão
**Contexto:** O que levou a essa decisão?
**Decisão:** O que foi decidido?
**Alternativas consideradas:** O que mais estava na mesa?
**Por que esse caminho:** Justificativa.
**Impacto:** O que isso afeta no projeto?
```

---

## 2026-03-30

### [21:00] Início do projeto e escolha de formato

**Contexto:** Rodrigo estava desenvolvendo um protótipo de mapa de jornadas no Claude Desktop, que travou com erro. O protótipo chegou à v0.8 com 4 jornadas completas e uma jornada ideal com ramificação, feedback badges e dois modos de step (cliente/BHub).

**Decisão:** Migrar o projeto para o Claude Code e construir "para valer" — ferramenta real, não protótipo descartável.

**Alternativas consideradas:**
- Continuar no Claude Desktop (descartado: sem controle de versão, sem estrutura de projeto)
- Exportar o JSX como HTML standalone e distribuir (descartado: não permite edição futura)

**Por que esse caminho:** Claude Code permite estrutura de projeto real, versionamento git e desenvolvimento incremental com contexto persistente.

**Impacto:** Define o projeto como uma ferramenta de desenvolvimento contínuo, não um artefato pontual.

---

### [21:15] Manutenção do visual do protótipo v0.8

**Contexto:** O protótipo já tinha um visual consolidado após várias iterações — tema escuro, swimlane cliente/BHub, cards discretos para ações da BHub.

**Decisão:** Manter fielmente o visual do protótipo v0.8 como base do viewer.

**Alternativas consideradas:**
- Redesenhar com Tailwind ou outra lib (descartado: adicionaria dependência desnecessária e quebraria o visual já validado)
- Usar component library (descartado: mesmo motivo)

**Por que esse caminho:** O visual já foi validado iterativamente. Reconstruir do zero sem motivo seria retrabalho. Inline styles mantêm o projeto sem dependências de CSS.

**Impacto:** Stack sem lib de CSS. Componentes replicam exatamente o que estava no protótipo.

---

### [21:20] Separação de dados do código

**Contexto:** No protótipo, as jornadas estavam hardcoded no JSX junto com os componentes. Imagens estavam como base64 inline (arquivo de 1.1MB).

**Decisão:** Extrair jornadas para `src/data/journeys.json` e imagens para `public/screenshots/` como arquivos referenciados por nome.

**Alternativas consideradas:**
- Manter dados no código (descartado: impossibilita edição sem tocar no código)
- Banco de dados / backend (descartado: overengineering para o escopo atual)

**Por que esse caminho:** JSON versionável permite editar jornadas sem tocar em código. Arquivos de imagem eliminam o problema do arquivo gigante e permitem substituição fácil de screenshots.

**Impacto:** Estrutura de projeto mais limpa. Jornadas podem evoluir independentemente dos componentes.

---

### [21:25] Busca semântica: TF-IDF local no MVP

**Contexto:** O backlog inclui busca por intenção (ex: "como o cliente pede ajuda?"). Discutiu-se usar a API da Claude para isso.

**Decisão:** MVP usa TF-IDF local, sem API externa. A camada de busca é isolada para facilitar upgrade futuro.

**Alternativas consideradas:**
- API da Claude desde o início (descartado para MVP: custo, dependência externa, não bloqueia o valor principal)
- Busca exata por string (descartado: não atende o requisito de busca por intenção)

**Por que esse caminho:** TF-IDF entrega boa parte do valor sem custo ou dependência. O slot para IA fica aberto na arquitetura — é um upgrade, não uma reescrita.

**Impacto:** Busca funciona offline. Quando a API entrar, só a camada interna do serviço muda.

---

### [21:25] Análise de impacto: regras simples no MVP

**Contexto:** Feature de mapeamento de impacto (quando uma jornada muda, o que mais pode ser afetado). Rodrigo quer que seja "inteligente", mas reconhece que IA é evolução, não requisito do MVP.

**Decisão:** MVP detecta relacionamentos por regras simples (mesmo canal, mesmo responsável, mesmas palavras-chave). Análise semântica via Claude entra como upgrade posterior.

**Alternativas consideradas:**
- Só IA (descartado: bloqueia o MVP inteiro)
- Sem análise de impacto no MVP (descartado: Rodrigo quer a funcionalidade desde cedo)

**Por que esse caminho:** Regras simples já capturam a maioria dos casos relevantes. A interface existe, o mecanismo interno evolui depois.

**Impacto:** Feature de impacto entra antes da integração com IA. A troca de mecanismo não afeta a UI.

---

### [22:30] Fase 2 — Editor implementado (completo)

**Contexto:** Fase 2 na branch `feat/fase-2-editor`.

**Decisão:** Editor construído sem bibliotecas externas (sem dnd-kit, sem form library). Upload de screenshot usa object URL em memória durante a sessão + nome de arquivo no JSON para persistência futura. Persistência via localStorage com seed dos dados originais no primeiro acesso. Drag-and-drop de reordenação usa HTML5 nativo.

**O que foi construído:**
- `useJourneys.js` — hook com CRUD completo e localStorage, incluindo `moveStep`
- `JourneyEditor.jsx` — modal de criar/editar jornada com picker de emoji
- `StepEditor.jsx` — formulário inline com upload drag-and-drop de screenshot
- `Timeline.jsx` — modo edição com botões inline, confirmação de exclusão, drag-and-drop nativo para reordenar, handle de 6 pontos na coluna central
- B-001, B-002, B-003, B-004, B-005, B-006 marcados como concluídos no backlog

**Fase 2 concluída.** Próxima fase: B-013/B-014 (export/import JSON), B-009/B-010 (mapeamento de impacto UI).

---

### [2026-03-31] Trilha de humor do cliente

**Contexto:** Rodrigo pediu uma coluna visual à esquerda da lane do cliente mostrando o estado emocional do cliente em cada step. Deve ser editável diretamente na trilha, sem abrir o StepEditor.

**Decisão:** Nova coluna de 44px (`gridTemplateColumns: "44px 1fr 44px 1fr"`) à esquerda da lane do cliente. Componente `MoodCell` com:
- Viewer: emoji do humor com tooltip da nota. Ponto discreto se vazio.
- Edit mode: botão circular que abre popover inline com grid 5×2 de emojis, label do humor selecionado, textarea para descrição e botões Salvar / Limpar / ✕.
- Steps BHub: apenas linha de passagem (trilha continua sem nó).
- Dados: campos `moodEmoji` e `moodNote` no objeto step.

**Por que esse caminho:** Popover inline diretamente na trilha mantém o fluxo de edição rápido, sem abrir modal completo. Seleção toggleável (clicar no emoji selecionado desmarca).

**Impacto:** Header e grid de cada step atualizados para 4 colunas. Build: 258KB (+5KB pela feature).

---

### [22:35] Fix UX — barra de ações do modo edição

**Contexto:** Em modo edição, o botão "✏ Editar" era posicionado com `position: absolute, top: 8, left: 8` dentro do card do cliente. Isso sobrepunha o label "Passo N" que ocupa a mesma posição, criando sobreposição visual de texto.

**Decisão:** Remover os botões absolutos injetados dentro dos cards. Substituir por uma barra de ações fina acima de cada step (fora dos cards), com drag handle + título do step (subdued) à esquerda e botão "✏ Editar" à direita.

**Por que esse caminho:** Cards permanecem completamente limpos e legíveis em qualquer modo. Ações de edição ficam em área dedicada e nunca conflitam com conteúdo dos cards.

**Impacto:** Modo edição mais legível. Comportamento de drag-and-drop inalterado.

---

### [22:10] Regra de git — nunca autônomo

**Contexto:** Durante a execução da Fase 1 em auto mode, foram feitos commit e criação de branch sem pedido explícito.

**Decisão:** Nenhuma operação git (commit, branch, merge, PR, push) deve ser executada sem instrução explícita do Rodrigo. Isso vale mesmo em auto mode e mesmo que pareça conveniente.

**Impacto:** Rodrigo mantém controle total do histórico git. Após qualquer mudança de código, o trabalho para — mostra o resultado e aguarda instrução.

---

### [22:05] Fontes aumentadas em +1pt em todo o projeto

**Contexto:** Fontes do viewer estavam pequenas demais para leitura confortável.

**Decisão:** Todos os valores de `fontSize` em todos os 7 componentes incrementados em +1 via script Python. 62 ocorrências atualizadas.

**Impacto:** Escala de fontes passou de {7–24} para {8–25}.

---

### [22:00] Backlog ganhou Grupo 6 (B-018 a B-020) — adicionado em outro chat

**Contexto:** Rodrigo adicionou via outro chat um novo grupo de features focadas em transformar jornadas em artefatos úteis para produto e desenvolvimento.

**Decisão:** PRD v0.3 criado para absorver as novas features. Fase 5 adicionada para B-020 (integração com repositórios). Pergunta aberta registrada sobre abordagem do B-020.

**Impacto:** Roadmap agora vai até Fase 5. Features de documentação e prototipação fazem parte do escopo oficial.

---

### [21:45] Fase 1 — Viewer implementado

**Contexto:** Início do desenvolvimento real. Projeto React/Vite criado e Fase 1 (viewer) construída do zero.

**Decisão:** Scaffolding do Vite feito em `/tmp` e copiado para o repo (diretório não-vazio impede criação direta). Arquivos boilerplate do Vite removidos (App.css, assets/).

**O que foi construído:**
- 7 screenshots extraídas de base64 para arquivos PNG em `public/screenshots/`
- 6 jornadas extraídas e expandidas para `src/data/journeys.json`
- `src/services/search.js` — TF-IDF local com interface plugável para Claude API
- `src/services/impact.js` — análise de impacto por regras simples, interface plugável
- Todos os componentes do viewer fiéis ao visual v0.8 do protótipo
- Build de produção limpo: 230KB JS, 0.18KB CSS

**Impacto:** Fase 1 concluída. Branch `feat/fase-1-viewer` pronta para merge/review.

---

### [21:28] PRD alinhado ao backlog (v0.1 → v0.2)

**Contexto:** O backlog foi construído com mais detalhe do que o PRD original, criando divergências em 6 pontos.

**Decisão:** PRD atualizado para v0.2 incorporando: busca por intenção (não só palavra exata), seção de mapeamento de impacto, detalhamento do upload de screenshot, arquitetura em camadas para serviços plugáveis, fase 4 adicionada, filtro por categoria e modo visão geral documentados.

**Impacto:** PRD agora é a fonte fiel de requisitos. Backlog e PRD estão sincronizados.

---

### [21:30] Documentação de sessão e log de decisões

**Contexto:** Rodrigo quer poder retomar sessões no Claude Code sem perder contexto, e manter rastreabilidade das decisões ao longo do tempo.

**Decisão:** Criar `docs/SESSAO.md` (estado do projeto + próximo passo) e `docs/DECISOES.md` (este arquivo). Ambos são atualizados ao fim de cada sessão ou após decisão relevante.

**Alternativas consideradas:**
- Usar só o CLAUDE.md (descartado: CLAUDE.md é para instruções de comportamento, não histórico)
- Confiar na memória do Claude (descartado: contexto é zerado entre sessões)

**Por que esse caminho:** Arquivo explícito que o usuário compartilha no início da sessão é o mecanismo mais confiável e transparente de retomada.

**Impacto:** Reduz tempo de warm-up em novas sessões. Cria rastreabilidade das escolhas do projeto.
