# Backlog — Mapa de Jornadas Padrão BHub

**Status:** Ativo
**Última atualização:** 2026-03-30 (B-018 a B-020 adicionados)

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

## Grupo 6 — Documentação e Prototipação

Capacidade de gerar, a partir de uma jornada, artefatos úteis para o time de desenvolvimento ou para validação com cliente/operação.

### B-018 — Export como documento de requisitos (PRD / Design Brief)
**Prioridade:** Média
**Fase:** 3

A partir de uma jornada aberta, o usuário pode gerar um documento estruturado que inclui: visão geral da jornada, lista de telas necessárias por step (com base em screenshots anexados e `suggestedScreenNote`), requisitos funcionais por etapa, canais envolvidos, responsáveis e pontos de atenção operacional.

O documento pode ser usado de duas formas:
- Compartilhar com o time de desenvolvimento como especificação para implementar a jornada no produto
- Servir de insumo para construção de um protótipo navegável (ver B-019)

**Formatos de saída:**
- Markdown (padrão): arquivo `.md` com tabelas, listas e seções organizadas por step
- Opção futura: Claude API enriquece o texto com descrições mais detalhadas dos requisitos de cada tela a partir da descrição do step

**Critério de aceite:**
- Botão "Gerar documento" disponível na jornada ativa (modo viewer)
- Documento gerado inclui todos os steps com título, descrição, canal, responsável e nota de tela (quando houver)
- Steps com `suggestedScreenNote` aparecem como seção de "Telas a criar"
- Download do `.md` funciona sem dependências externas

**Status:** `[ ]`

---

### B-019 — Protótipo navegável a partir da jornada
**Prioridade:** Baixa
**Fase:** 4

A partir dos steps e screenshots de uma jornada, gera um protótipo HTML standalone e navegável. O usuário (cliente ou operação interna) pode clicar pelos steps em sequência, vendo cada tela e sua descrição, sem precisar instalar nada.

Útil para duas situações distintas:
- **Validação com cliente:** apresentar o fluxo esperado antes da implementação, colhendo feedback sobre lacunas ou etapas confusas
- **Alinhamento interno (operação):** mostrar para o time operacional como a jornada deveria funcionar, usando telas reais ou wireframes

**Como funciona:**
- Steps com screenshot usam a imagem como "tela" do protótipo
- Steps sem screenshot mas com `suggestedScreenNote` exibem um placeholder com a descrição da tela
- Navegação entre steps via botões "Anterior" / "Próximo" e barra de progresso
- Ramificações exibem escolha entre caminhos (botões de decisão)
- Export como `.html` standalone (sem dependências, abre direto no navegador)

**Dependência:** B-015 (export HTML) como base técnica.

**Critério de aceite:**
- Arquivo HTML gerado abre em qualquer navegador moderno sem servidor
- Navegação por steps funciona com teclado (← →) e clique
- Jornadas com ramificação permitem navegar pelos dois caminhos
- Protótipo inclui título e subtítulo da jornada no topo

**Status:** `[ ]`

---

### B-020 — Integração com repositórios BHub para mapeamento de implementação
**Prioridade:** Baixa
**Fase:** 5

Conectar steps de uma jornada com telas ou features já implementadas nos repositórios da BHub. Permite visualizar, dentro da ferramenta, o que já existe no produto vs. o que ainda é uma lacuna ou tela sugerida.

**Casos de uso:**
- Ao desenhar uma jornada, linkar steps a arquivos/screens do repositório correspondente (ex: `src/pages/DocumentUpload.tsx`)
- Identificar automaticamente quais steps têm implementação real vs. quais são apenas intenção
- A partir da jornada, gerar um rascunho de protótipo usando telas reais do produto (screenshots automáticos via CI ou referências diretas)

**Abordagens possíveis (a definir):**
1. **Link manual:** no editor de step, campo livre para colar URL ou caminho do repositório — mais simples, entrega valor imediato
2. **Integração com GitHub:** conecta ao repositório via API e permite buscar arquivos de tela por nome — mais potente, requer autenticação
3. **Export de fluxo para ferramenta de design:** gera um arquivo que pode ser importado no Figma ou Excalidraw com a estrutura da jornada já montada — protótipo sem código

**Decisão pendente:** qual das abordagens começa — link manual, integração GitHub ou export para ferramenta de design?

**Critério de aceite (quando abordagem definida):**
- A ser detalhado após decisão de abordagem

**Status:** `[ ]`

---

## Decisões pendentes antes de implementar

| Item | Pergunta | Impacta |
|---|---|---|
| B-003 | Screenshots ficam no repositório git ou em storage externo? | Deploy e colaboração |
| B-009 | Relacionamentos são definidos manualmente ou inferidos automaticamente? | Complexidade de implementação |
| B-020 | Qual abordagem de integração com repositórios começa: link manual, GitHub API ou export para ferramenta de design? | Escopo e complexidade da Fase 5 |

---

## Decisões tomadas

| Data | Decisão |
|---|---|
| 2026-03-30 | **B-007:** MVP usa TF-IDF local (sem API, sem custo). A API da Claude é um upgrade futuro — a camada de busca já será isolada para facilitar a troca. |
| 2026-03-30 | **B-011:** MVP usa detecção por regras simples (mesmo canal, mesmo responsável, mesma palavra-chave). Análise semântica via Claude entra como evolução, substituindo apenas essa camada interna. Não bloqueia o início. |
