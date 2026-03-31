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
