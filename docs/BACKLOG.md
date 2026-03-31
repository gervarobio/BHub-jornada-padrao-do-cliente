# Backlog — Mapa de Jornadas Padrão BHub

**Status:** Ativo
**Última atualização:** 2026-03-30

> Items são ordenados por prioridade dentro de cada grupo. Use os status: `[ ]` a fazer · `[~]` em andamento · `[x]` concluído.

---

## Grupo 1 — Editor de Jornadas

Capacidade de criar e manter jornadas diretamente na ferramenta, sem editar JSON à mão.

### B-001 — Criar step
**Prioridade:** Alta
**Fase:** 2

O usuário pode adicionar um novo step a uma jornada existente. Ao clicar em "Adicionar step", abre um formulário com os campos: título, label (Passo N / Gatilho / vazio), lado (cliente ou BHub), tipo (ação, feedback, ação BHub, ramificação), canal, responsável, descrição e dica.

**Critério de aceite:**
- Step aparece na timeline na posição correta após salvar
- Todos os campos opcionais podem ser deixados em branco
- Novo step recebe numeração automática se for do tipo "Passo N"

**Status:** `[ ]`

---

### B-002 — Editar step existente
**Prioridade:** Alta
**Fase:** 2

O usuário pode clicar em qualquer step e editar seus campos inline, sem sair da timeline. O card alterna entre modo de visualização e modo de edição.

**Critério de aceite:**
- Edição disponível tanto em cards de cliente quanto de BHub
- Alterações são refletidas na timeline em tempo real
- Usuário pode cancelar a edição sem salvar

**Status:** `[ ]`

---

### B-003 — Adicionar screenshot ao step
**Prioridade:** Alta
**Fase:** 2

Ao criar ou editar um step do lado do cliente, o usuário pode fazer upload de uma imagem (PNG, JPG, WebP). A imagem é exibida no card expandido e abre em lightbox ao clicar.

**Notas de implementação:**
- Imagem salva em `/public/screenshots/` com nome derivado do id da jornada + índice do step
- Referência salva no JSON como nome de arquivo (não base64)
- Se não houver screenshot mas houver `suggestedScreenNote`, exibe placeholder amarelo

**Critério de aceite:**
- Upload aceita drag-and-drop e clique para selecionar
- Preview da imagem aparece imediatamente após o upload
- Imagem persiste após recarregar a página

**Status:** `[ ]`

---

### B-004 — Reordenar steps (drag-and-drop)
**Prioridade:** Média
**Fase:** 2

O usuário pode arrastar steps para reordenar dentro de uma jornada. A numeração dos "Passo N" é recalculada automaticamente.

**Status:** `[ ]`

---

### B-005 — Excluir step
**Prioridade:** Média
**Fase:** 2

Botão de exclusão disponível no modo de edição do step. Exige confirmação antes de remover.

**Dependência:** B-007 (Mapeamento de impacto) — ao excluir, deve verificar se o step é referenciado em outra jornada antes de confirmar.

**Status:** `[ ]`

---

### B-006 — Criar e editar jornada completa
**Prioridade:** Alta
**Fase:** 2

O usuário pode criar uma nova jornada preenchendo: nome, subtítulo, categoria (existente ou nova), ícone (emoji), descrição e flag "Jornada Ideal". A jornada começa vazia e os steps são adicionados via B-001.

**Critério de aceite:**
- Nova jornada aparece na sidebar na categoria correta
- Jornada pode ser renomeada ou ter categoria alterada a qualquer momento
- Jornada vazia exibe mensagem orientando a adicionar o primeiro step

**Status:** `[ ]`

---

## Grupo 2 — Busca Inteligente

Busca que entende intenção e contexto, não apenas palavras exatas.

### B-007 — Busca semântica por jornada
**Prioridade:** Alta
**Fase:** 2

O usuário digita uma pergunta ou frase livre na barra de busca (ex: "como o cliente pede ajuda?", "o que acontece quando um documento é rejeitado?") e a ferramenta retorna jornadas e steps relevantes, mesmo que as palavras exatas não apareçam no texto.

**Como funciona:**
A busca semântica usa a API da Claude (claude-haiku-4-5) para interpretar a intenção da query e ranquear as jornadas e steps por relevância. O contexto enviado à API inclui títulos, descrições e dicas de todos os steps. A resposta retorna os IDs ranqueados, que são exibidos na sidebar com destaque.

**Alternativa sem API:** busca por similaridade usando TF-IDF local (sem custo, menor qualidade). Pode ser o fallback se a API não estiver disponível.

**Critério de aceite:**
- Query "como o cliente pede ajuda" retorna jornadas de solicitação/suporte
- Query "documento rejeitado" retorna jornadas que mencionam rejeição/correção
- Resultados aparecem em menos de 2 segundos
- Sem resultado: mensagem clara, não tela em branco

**Status:** `[ ]`

---

### B-008 — Destaque de steps relevantes no resultado de busca
**Prioridade:** Média
**Fase:** 3

Ao clicar numa jornada retornada pela busca, os steps que mais respondem à query ficam visualmente destacados (borda colorida ou badge "relevante para sua busca").

**Status:** `[ ]`

---

## Grupo 3 — Mapeamento de Impacto

Quando uma jornada muda, a ferramenta identifica quais outras jornadas podem ser afetadas.

### B-009 — Detecção de referências cruzadas entre jornadas
**Prioridade:** Alta
**Fase:** 3

A ferramenta mantém um índice de relacionamentos: quais jornadas mencionam os mesmos canais, responsáveis, produtos ou conceitos (ex: "Hub do Empreendedor", "tarefa de envio", "dados bancários"). Quando uma jornada é editada, o índice é consultado para identificar jornadas potencialmente afetadas.

**Critério de aceite:**
- Ao editar qualquer campo de um step, a ferramenta exibe (em painel lateral ou modal) quais outras jornadas compartilham o mesmo contexto
- Relacionamentos são exibidos como lista: "Jornada X também menciona [canal/conceito]"

**Status:** `[ ]`

---

### B-010 — Alerta de impacto ao excluir step ou jornada
**Prioridade:** Alta
**Fase:** 3

Antes de confirmar exclusão de um step ou jornada, a ferramenta exibe quais outras jornadas podem ser afetadas, com link direto para revisá-las.

**Exemplo de mensagem:**
> "Você está removendo o step 'Triagem automática' que também aparece como referência em: Jornada Mensal do Cliente, Envio por E-mail (Ideal). Deseja continuar?"

**Status:** `[ ]`

---

### B-011 — Análise de impacto via IA
**Prioridade:** Média
**Fase:** 3

Além da detecção por referências diretas (B-009), usa a API da Claude para uma análise mais profunda: dado o que mudou, quais consequências operacionais ou de experiência isso pode ter nas outras jornadas?

**Exemplo de output:**
> "Você alterou o canal de envio de documentos de 'E-mail' para 'Hub do Empreendedor'. Isso pode impactar: (1) a jornada ideal de e-mail, que assume e-mail como único canal; (2) o fluxo de correção de pendências, que instrui o cliente a responder o e-mail."

**Como funciona:** envia o diff da jornada + resumo das jornadas relacionadas para claude-haiku-4-5 e exibe a análise em linguagem natural.

**Status:** `[ ]`

---

### B-012 — Grafo visual de relacionamentos entre jornadas
**Prioridade:** Baixa
**Fase:** 4

Visão em grafo mostrando quais jornadas estão conectadas e por quê (canal em comum, step compartilhado, sequência natural). Útil para entender o ecossistema completo de interações do cliente.

**Status:** `[ ]`

---

## Grupo 4 — Export / Import

### B-013 — Export de jornada como JSON
**Prioridade:** Média
**Fase:** 3

Botão "Exportar" na jornada ativa gera um `.json` para download.

**Status:** `[ ]`

---

### B-014 — Import de JSON
**Prioridade:** Média
**Fase:** 3

Usuário faz upload de um `.json` exportado anteriormente para adicionar ou substituir uma jornada.

**Status:** `[ ]`

---

### B-015 — Export como HTML standalone
**Prioridade:** Baixa
**Fase:** 3

Gera um arquivo `.html` que inclui o viewer completo + dados da jornada, sem dependências externas. Qualquer pessoa abre no navegador sem instalar nada.

**Status:** `[ ]`

---

## Grupo 5 — Melhorias de Viewer

### B-016 — Filtro por categoria na sidebar
**Prioridade:** Baixa
**Fase:** 3

Além da busca textual/semântica, permite filtrar jornadas por categoria via chips clicáveis.

**Status:** `[ ]`

---

### B-017 — Modo "visão geral" da jornada
**Prioridade:** Baixa
**Fase:** 4

Visualização compacta que exibe todos os steps sem expandir — útil para uma leitura rápida do fluxo completo.

**Status:** `[ ]`

---

## Decisões pendentes antes de implementar

| Item | Pergunta | Impacta |
|---|---|---|
| B-003 | Screenshots ficam no repositório git ou em storage externo? | Deploy e colaboração |
| B-009 | Relacionamentos são definidos manualmente ou inferidos automaticamente? | Complexidade de implementação |

---

## Decisões tomadas

| Data | Decisão |
|---|---|
| 2026-03-30 | **B-007:** MVP usa TF-IDF local (sem API, sem custo). A API da Claude é um upgrade futuro — a camada de busca já será isolada para facilitar a troca. |
| 2026-03-30 | **B-011:** MVP usa detecção por regras simples (mesmo canal, mesmo responsável, mesma palavra-chave). Análise semântica via Claude entra como evolução, substituindo apenas essa camada interna. Não bloqueia o início. |
