# PRD — Mapa de Jornadas Padrão BHub

**Status:** Rascunho
**Versão:** 0.3
**Última atualização:** 2026-03-30
**Responsável:** Rodrigo

> **Changelog v0.3:** Adicionado Grupo 6 — Documentação e Prototipação (B-018 a B-020). Fase 5 adicionada. Novo item em perguntas abertas (abordagem B-020). Ajuste de fonte (+1pt) registrado nas decisões técnicas.
>
> **Changelog v0.2:** Adicionadas seções de busca por intenção, mapeamento de impacto e arquitetura em camadas — alinhado com backlog (B-007 a B-012). Upload de screenshot detalhado. Fase 4 adicionada. Decisões técnicas registradas.

---

## 1. Contexto e problema

A BHub atende clientes que interagem com a empresa por múltiplos canais e fluxos ao longo do mês. Hoje, não existe um registro estruturado de como essas interações deveriam acontecer — do ponto de vista do cliente. Isso gera três problemas concretos:

1. **Falta de clareza interna.** Cada área da BHub tem uma visão parcial da jornada. Não existe um documento único que mostre, de ponta a ponta, o que o cliente faz, quando faz, por onde faz e o que recebe de volta.

2. **Ausência de padrão.** Não há um formato BHub para documentar jornadas. Quando alguém precisa explicar como algo funciona, recorre a e-mails, prints avulsos ou descrições verbais.

3. **Dificuldade de evolução.** Sem uma base documentada, é difícil identificar buracos na experiência, propor melhorias ou alinhar expectativas entre times e com o próprio cliente.

---

## 2. Objetivo

Construir uma ferramenta interna para criar, visualizar e manter jornadas padrão do cliente BHub — com um formato visual consistente que qualquer pessoa do time consiga usar e compartilhar.

---

## 3. Usuários

| Perfil | Objetivo principal |
|---|---|
| CS / Operações | Entender e documentar como o cliente usa os produtos e serviços da BHub |
| Produto | Identificar buracos de experiência e propor melhorias |
| Novos membros do time | Aprender como os fluxos funcionam |
| Liderança | Ter visão clara e atualizada das jornadas padrão |

---

## 4. Conceitos centrais

### Jornada
Uma jornada representa um fluxo completo do ponto de vista do cliente — do gatilho inicial até a conclusão. Exemplos: "envio de documentos para fechamento do mês", "solicitação de DP", "atualização de dados bancários".

### Step (etapa)
Cada passo dentro de uma jornada. Um step pertence a um dos dois lados da swimlane:
- **Cliente** — ação ou recebimento de informação pelo cliente
- **BHub** — ação interna ou automação da BHub

### Tipos de step
| Tipo | Descrição |
|---|---|
| Ação do cliente | O cliente faz algo (acessa, envia, preenche) |
| Feedback recebido | O cliente recebe uma comunicação da BHub (confirmação, alerta, conclusão) |
| Ação BHub | Etapa interna — processamento, validação, automação |
| Ramificação | Ponto onde o fluxo se divide em caminhos alternativos (ex: documento aceito vs. rejeitado) |

### Categorias de jornada
Agrupam jornadas por área: Rotina Mensal, Departamento Pessoal, Financeiro, Cadastro, etc.

---

## 5. Funcionalidades

### 5.1 Visualização (MVP — Fase 1)

- Lista de jornadas agrupadas por categoria na sidebar
- **Busca por intenção:** o usuário pode digitar perguntas em linguagem natural (ex: "como o cliente pede ajuda?") e a ferramenta retorna jornadas relevantes por similaridade — não apenas correspondência exata de palavras. MVP usa TF-IDF local; API Claude como upgrade futuro.
- Timeline em swimlane: cliente à esquerda, BHub à direita
- Cards expandíveis com: descrição, canal, responsável, dica operacional
- Suporte a screenshots anexados nos steps (abertura em lightbox)
- Telas sugeridas — placeholder visual para telas que deveriam existir
- Ramificação visual — exibe caminhos de sucesso e erro lado a lado
- Badges de feedback no step do cliente (informação, confirmação, feedback consolidado, conclusão)
- Badge "Jornada Ideal" para jornadas que representam o estado desejado (vs. estado atual)
- Cards da BHub com visual reduzido (discretos quando colapsados)
- Filtro por categoria via chips na sidebar

### 5.2 Editor (Fase 2)

- Criar nova jornada (nome, categoria, ícone, descrição, flag ideal/atual)
- Adicionar step: formulário com título, label, lado (cliente/BHub), tipo, canal, responsável, descrição e dica
- Editar step inline: o card alterna entre modo visualização e edição sem sair da timeline
- Reordenar steps via drag-and-drop com renumeração automática dos "Passo N"
- Excluir step com confirmação — exibe alerta se o step for referenciado em outras jornadas (ver 5.3)
- **Upload de screenshot por step:** drag-and-drop ou clique para selecionar (PNG, JPG, WebP). Preview imediato no card. Imagem referenciada por nome de arquivo no JSON, não base64.
- Adicionar tela sugerida (descrição textual do que a tela deveria mostrar)
- Criar ramificação com N caminhos paralelos
- Salvar no localStorage com confirmação visual

### 5.3 Mapeamento de Impacto (Fase 3)

Quando uma jornada é editada ou um step é excluído, a ferramenta identifica quais outras jornadas podem ser afetadas.

**Como funciona no MVP (regras simples):**
A ferramenta mantém um índice de relacionamentos baseado em correspondência de termos: canal, responsável, produtos mencionados (ex: "Hub do Empreendedor"), conceitos operacionais. Quando um campo é alterado, o índice é consultado e jornadas com sobreposição são listadas.

**Comportamentos esperados:**
- Ao editar qualquer campo de um step, exibe painel com jornadas que compartilham o mesmo contexto
- Ao excluir step ou jornada, exibe alerta com lista das jornadas potencialmente afetadas + link para revisá-las
- Análise semântica mais profunda via Claude API entra como upgrade futuro (substitui apenas a camada interna de análise, sem mudar a UI)

### 5.4 Gestão de dados (Fase 3)

- Export de jornada individual como JSON
- Import de JSON para restaurar ou compartilhar jornada
- Export como HTML standalone (abre no navegador sem dependências)
- Screenshots referenciadas como arquivos (não base64 inline)

### 5.5 Visões avançadas (Fase 4)

- **Modo visão geral:** visualização compacta de todos os steps sem expandir, para leitura rápida do fluxo completo
- **Grafo de relacionamentos:** visão em grafo mostrando quais jornadas estão conectadas e por quê (canal em comum, step compartilhado, sequência natural)
- **Destaque de steps relevantes:** ao navegar para uma jornada via busca, os steps que mais correspondem à query ficam visualmente destacados

### 5.6 Documentação e prototipação (Fase 3–5)

**Export como documento de requisitos (B-018 — Fase 3)**
A partir de uma jornada aberta, gera um documento `.md` estruturado com: visão geral, lista de telas necessárias por step (screenshots existentes + `suggestedScreenNote`), requisitos funcionais por etapa, canais, responsáveis e pontos de atenção. Útil como especificação para o time de desenvolvimento ou insumo para protótipo.

**Protótipo navegável (B-019 — Fase 4)**
Gera um `.html` standalone e navegável a partir dos steps e screenshots de uma jornada. Steps com screenshot mostram a imagem como "tela"; steps com `suggestedScreenNote` mostram placeholder. Navegação por botões e teclado. Ramificações exibem escolha entre caminhos. Útil para validação com cliente ou alinhamento operacional.

**Integração com repositórios BHub (B-020 — Fase 5)**
Conecta steps a telas ou features implementadas nos repositórios da BHub, permitindo visualizar o que já existe no produto vs. lacunas. Abordagem a definir: link manual, integração GitHub API ou export para ferramenta de design (Figma/Excalidraw).

---

## 6. Fora de escopo

- Autenticação / controle de acesso (ferramenta interna, sem login)
- Versionamento de histórico de edições
- Comentários ou colaboração em tempo real
- Integrações com ferramentas externas (Notion, Jira, etc.)
- App mobile

---

## 7. Visual e design

O visual segue o protótipo desenvolvido na fase de exploração (v0.8):

- **Tema:** escuro (`#0B1120` como background)
- **Tipografia:** DM Sans (corpo) + Space Mono (labels e metadados)
- **Cores principais:**
  - Cliente: azul (`#2E6B9E`, `#1E90FF`)
  - BHub: roxo (`#7C3AED`, `#A78BFA`)
  - Jornada Ideal: verde esmeralda (`#34D399`, `#6EE7B7`)
  - Feedback tipos: azul (info), verde (sucesso), âmbar (misto), roxo (conclusão)
  - Tela sugerida: âmbar tracejado (`#FBBF24`)
- **Layout:** sidebar + área principal com swimlane de 3 colunas (cliente | timeline | BHub)
- **BHub discreto:** cards colapsados da BHub são apenas uma linha fina; a atenção visual fica no lado do cliente

---

## 8. Arquitetura técnica

### Stack
- **Frontend:** React + Vite
- **Estilo:** CSS-in-JS via inline styles (padrão do protótipo, sem dependência de lib de estilos)
- **Dados:** JSON estático versionado em `/src/data/journeys.json`
- **Imagens:** arquivos em `/public/screenshots/`, referenciadas por nome no JSON
- **Persistência:** localStorage para edições não salvas + export/import JSON

### Arquitetura em camadas — serviços plugáveis

Busca e análise de impacto são implementadas como serviços isolados (`src/services/`) para facilitar upgrade futuro:

```
src/services/
  search.js       ← TF-IDF local no MVP → Claude API como upgrade
  impact.js       ← regras simples no MVP → Claude API como upgrade
```

Isso garante que a troca de mecanismo não afeta os componentes de UI — apenas a implementação interna do serviço muda.

### Estrutura de pastas
```
/
├── docs/                        ← documentação do projeto
├── public/
│   └── screenshots/             ← imagens das telas
├── src/
│   ├── data/
│   │   └── journeys.json        ← fonte da verdade das jornadas
│   ├── services/
│   │   ├── search.js            ← serviço de busca (TF-IDF → Claude)
│   │   └── impact.js            ← serviço de análise de impacto
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Timeline.jsx
│   │   ├── ClientCard.jsx
│   │   ├── BHubCard.jsx
│   │   ├── BranchView.jsx
│   │   └── ScreenshotViewer.jsx
│   │   └── editor/
│   │       ├── JourneyEditor.jsx
│   │       └── StepEditor.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

### Estrutura de dados — Jornada
```json
{
  "id": "string",
  "category": "string",
  "icon": "string (emoji)",
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "isIdeal": "boolean",
  "steps": [Step]
}
```

### Estrutura de dados — Step
```json
{
  "label": "string (ex: 'Passo 1', 'Gatilho', '')",
  "title": "string",
  "who": "string",
  "channel": "string",
  "side": "'client' | 'bhub'",
  "description": "string",
  "tip": "string (opcional)",
  "isFeedback": "boolean (opcional)",
  "feedbackType": "'info' | 'success' | 'mixed' | 'final' (opcional)",
  "isBranch": "boolean (opcional)",
  "branches": "[Branch] (opcional)",
  "screenshot": "string (nome do arquivo, opcional)",
  "screenshotCaption": "string (opcional)",
  "suggestedScreen": "boolean (opcional)",
  "suggestedScreenNote": "string (opcional)"
}
```

---

## 9. Entregas e fases

### Fase 1 — Viewer (MVP)
- Projeto React + Vite configurado
- Jornadas do protótipo extraídas para `journeys.json`
- Screenshots salvas como arquivos em `/public/screenshots/`
- Todos os componentes do viewer implementados (fiel ao visual do protótipo v0.8)
- Busca por TF-IDF local com resultados relevantes por intenção
- **Critério de aceite:** abre no navegador, seleciona qualquer jornada, expande steps, visualiza screenshots, busca retorna resultados relevantes

### Fase 2 — Editor
- Modo edição ativado por botão na interface
- CRUD completo de jornadas e steps
- Upload de screenshot por step (drag-and-drop + preview imediato)
- Drag-and-drop para reordenar steps
- Salvar no localStorage com confirmação visual
- **Critério de aceite:** cria uma jornada nova do zero, adiciona steps com screenshots e salva sem perder dados ao recarregar

### Fase 3 — Inteligência e Export
- Mapeamento de impacto com regras simples (índice de termos compartilhados)
- Alerta ao excluir step/jornada com jornadas potencialmente afetadas
- Export de jornada como JSON
- Import de JSON
- Export como HTML standalone
- **Critério de aceite:** edita canal de um step e a ferramenta lista outras jornadas que usam o mesmo canal; exporta e importa sem perda

### Fase 4 — Visões avançadas e prototipação
- Modo visão geral (steps compactos)
- Grafo visual de relacionamentos
- Destaque de steps no resultado de busca
- Protótipo navegável HTML (B-019)
- Upgrade da busca para Claude API (opcional)
- Upgrade da análise de impacto para Claude API (opcional)

### Fase 5 — Integração com produto
- Integração com repositórios BHub para mapeamento de implementação (B-020)
- Abordagem a definir: link manual, GitHub API ou export para design

---

## 10. Perguntas abertas

1. **Jornadas prioritárias:** quais jornadas além das 6 do protótipo devem ser documentadas primeiro?
2. **Onde a ferramenta roda:** local em cada máquina ou hospedada? Isso impacta onde os JSONs e screenshots ficam e como colaboração funciona.
3. **Nomenclatura de categorias:** Rotina Mensal, Departamento Pessoal, Financeiro, Cadastro — cobre os casos de uso previstos?
4. **B-020 — Abordagem de integração com repositórios:** link manual no editor de step, integração via GitHub API, ou export para Figma/Excalidraw? Define escopo e complexidade da Fase 5.
