import { useState, useRef } from "react";
import ClientCard from "./ClientCard";
import BHubCard from "./BHubCard";
import StepEditor from "./editor/StepEditor";

const FEEDBACK_STYLES = {
  info:    { icon: "📨", color: "#60A5FA" },
  success: { icon: "✅", color: "#22C55E" },
  mixed:   { icon: "📋", color: "#F59E0B" },
  final:   { icon: "🏁", color: "#8B5CF6" },
};

const MOODS = [
  { emoji: "😄", label: "Animado"     },
  { emoji: "😊", label: "Satisfeito"  },
  { emoji: "🙂", label: "Ok"          },
  { emoji: "😐", label: "Neutro"      },
  { emoji: "🤔", label: "Incerto"     },
  { emoji: "😕", label: "Confuso"     },
  { emoji: "😟", label: "Preocupado"  },
  { emoji: "😠", label: "Frustrado"   },
  { emoji: "😢", label: "Chateado"    },
  { emoji: "😤", label: "Irritado"    },
];

export default function Timeline({ journey, editMode, onAddStep, onUpdateStep, onDeleteStep, onMoveStep }) {
  const [expandedStep, setExpandedStep]   = useState(null);
  const [editingStep, setEditingStep]     = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingMood, setEditingMood]     = useState(null); // index | null

  // Drag state
  const dragIndex  = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const toggle = (i) => {
    if (editMode) return;
    setExpandedStep(expandedStep === i ? null : i);
  };

  const startEdit = (i) => { setEditingStep(i); setExpandedStep(null); setEditingMood(null); };
  const cancelEdit = () => setEditingStep(null);

  const handleSaveStep = (data) => {
    if (editingStep === "new") onAddStep(data);
    else onUpdateStep(editingStep, data);
    setEditingStep(null);
  };

  const handleDeleteStep = (i) => setConfirmDelete(i);
  const confirmDeleteStep = () => {
    onDeleteStep(confirmDelete);
    setConfirmDelete(null);
    setEditingStep(null);
  };

  // ── Drag handlers ────────────────────────────────────────────────────────
  const onDragStart = (e, i) => {
    dragIndex.current = i;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => setDragOver(i), 0);
  };
  const onDragEnter = (i) => {
    if (dragIndex.current === null || dragIndex.current === i) return;
    setDragOver(i);
  };
  const onDragOver  = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const onDrop = (e, i) => {
    e.preventDefault();
    if (dragIndex.current !== null && dragIndex.current !== i) {
      onMoveStep(dragIndex.current, i);
    }
    dragIndex.current = null;
    setDragOver(null);
  };
  const onDragEnd = () => { dragIndex.current = null; setDragOver(null); };

  // ────────────────────────────────────────────────────────────────────────
  let clientStepNum = 0;

  return (
    <div style={{ maxWidth: 940, margin: "0 auto" }}>
      {/* Header swimlane */}
      <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px 1fr", gap: 0, marginBottom: 6 }}>
        {/* Mood column header */}
        <div style={{
          padding: "10px 0", borderRadius: "10px 0 0 0",
          background: "rgba(30,107,158,0.04)", borderBottom: "2px solid #2E6B9E",
          display: "flex", justifyContent: "center", alignItems: "flex-end",
        }}>
          <span style={{ fontSize: 14, opacity: 0.25 }}>♡</span>
        </div>
        {/* Cliente header */}
        <div style={{
          padding: "10px 16px",
          background: "rgba(30,107,158,0.06)", borderBottom: "2px solid #2E6B9E", textAlign: "right",
        }}>
          <span style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#2E6B9E", fontFamily: "'Space Mono', monospace",
          }}>
            👤 Cliente
          </span>
        </div>
        <div />
        {/* BHub header */}
        <div style={{
          padding: "10px 16px", borderRadius: "10px 10px 0 0",
          background: "rgba(124,58,237,0.03)", borderBottom: "1px solid rgba(124,58,237,0.2)",
        }}>
          <span style={{
            fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#64748B", fontFamily: "'Space Mono', monospace",
          }}>
            ⚙ BHub
          </span>
        </div>
      </div>

      {/* Steps */}
      {journey.steps.map((step, i) => {
        const isClient   = step.side === "client";
        const isExpanded = expandedStep === i;
        const isEditing  = editingStep === i;
        const isDragging = dragIndex.current === i;
        const isOver     = dragOver === i && dragIndex.current !== i;
        const fb = step.isFeedback ? FEEDBACK_STYLES[step.feedbackType] : null;
        const isNumbered = step.label && (
          step.label.startsWith("Passo") ||
          step.label.startsWith("Dia") ||
          step.label.startsWith("Conclusão")
        );

        if (isClient && isNumbered && !step.isFeedback) clientStepNum++;

        let nodeContent, nodeStyle;
        if (step.isBranch) {
          nodeContent = "⑂";
          nodeStyle = { width: 24, height: 24, borderRadius: 6, background: "none", fontSize: 19, color: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 };
        } else if (isClient && fb && !isNumbered) {
          nodeContent = fb.icon;
          nodeStyle = { width: 24, height: 24, background: "none", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 };
        } else if (isClient && isNumbered) {
          nodeContent = clientStepNum;
          nodeStyle = { width: 30, height: 30, borderRadius: "50%", background: fb ? fb.color : "#2E6B9E", boxShadow: `0 0 14px ${fb ? fb.color + "44" : "rgba(46,107,158,0.4)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0, zIndex: 1 };
        } else if (!isClient) {
          nodeContent = "";
          nodeStyle = { width: 8, height: 8, borderRadius: "50%", background: "rgba(124,58,237,0.3)", flexShrink: 0, zIndex: 1 };
        } else {
          nodeContent = "•";
          nodeStyle = { width: 24, height: 24, background: "none", fontSize: 19, color: "#2E6B9E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 };
        }

        const lineWidth = isClient ? 2 : 1;

        return (
          <div
            key={i}
            draggable={editMode && !isEditing}
            onDragStart={editMode ? (e) => onDragStart(e, i) : undefined}
            onDragEnter={editMode ? () => onDragEnter(i) : undefined}
            onDragOver={editMode ? onDragOver : undefined}
            onDrop={editMode ? (e) => onDrop(e, i) : undefined}
            onDragEnd={editMode ? onDragEnd : undefined}
            style={{
              opacity: isDragging ? 0.35 : 1,
              transition: "opacity 0.15s",
              outline: isOver ? "2px dashed rgba(30,144,255,0.5)" : "2px solid transparent",
              borderRadius: 10,
            }}
          >
            {/* Confirmação de exclusão */}
            {confirmDelete === i && (
              <div style={{
                margin: "8px 0", padding: "14px 16px", borderRadius: 10,
                background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              }}>
                <span style={{ fontSize: 13, color: "#FCA5A5" }}>
                  Excluir <strong>"{step.title}"</strong>?
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setConfirmDelete(null)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#64748B", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
                  <button onClick={confirmDeleteStep} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "#EF4444", border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Excluir</button>
                </div>
              </div>
            )}

            {isEditing ? (
              <div style={{ marginBottom: 4 }}>
                <div style={{ padding: "6px 0" }}>
                  <StepEditor step={step} onSave={handleSaveStep} onCancel={cancelEdit} onDelete={() => handleDeleteStep(i)} isNew={false} />
                </div>
              </div>
            ) : (
              <>
                {/* Barra de ações do edit mode */}
                {editMode && (
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "2px 6px 4px", gap: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2, cursor: "grab", padding: "2px 3px", opacity: 0.45 }}>
                        {[0,1,2].map(d => (
                          <div key={d} style={{ display: "flex", gap: 3 }}>
                            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#94A3B8" }} />
                            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#94A3B8" }} />
                          </div>
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: "#4A6A8A", maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {step.title}
                      </span>
                    </div>
                    <button
                      onClick={() => startEdit(i)}
                      style={{
                        padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600,
                        background: "rgba(30,144,255,0.08)", border: "1px solid rgba(30,144,255,0.2)",
                        color: "#60A5FA", cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
                      }}
                    >
                      ✏ Editar
                    </button>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px 1fr", gap: 0, minHeight: isClient ? 64 : 44 }}>
                  {/* Trilha de humor */}
                  <MoodCell
                    step={step}
                    isClient={isClient}
                    editMode={editMode}
                    isOpen={editingMood === i}
                    onToggle={() => setEditingMood(editingMood === i ? null : i)}
                    onSave={(moodData) => { onUpdateStep(i, { ...step, ...moodData }); setEditingMood(null); }}
                    isFirst={i === 0}
                    isLast={i === journey.steps.length - 1}
                  />

                  {/* Lane cliente */}
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: isClient ? "6px 8px 6px 0" : "4px 8px 4px 0" }}>
                    {isClient && (
                      <div style={{ width: "100%" }}>
                        <ClientCard step={step} isExpanded={isExpanded} onClick={() => toggle(i)} />
                      </div>
                    )}
                  </div>

                  {/* Timeline central */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {i > 0 && <div style={{ width: lineWidth, flex: "1 1 0", background: "rgba(255,255,255,0.07)" }} />}
                    <div style={nodeStyle}>{nodeContent}</div>
                    {i < journey.steps.length - 1 && <div style={{ width: lineWidth, flex: "1 1 0", background: "rgba(255,255,255,0.07)" }} />}
                  </div>

                  {/* Lane BHub */}
                  <div style={{ display: "flex", justifyContent: "flex-start", padding: !isClient ? "4px 0 4px 8px" : "6px 0 6px 8px" }}>
                    {!isClient && (
                      <div style={{ width: "100%" }}>
                        <BHubCard step={step} isExpanded={isExpanded} onClick={() => toggle(i)} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Editor de novo step */}
      {editingStep === "new" && (
        <div style={{ marginTop: 8 }}>
          <StepEditor step={null} onSave={handleSaveStep} onCancel={cancelEdit} isNew />
        </div>
      )}

      {/* Botão adicionar step */}
      {editMode && editingStep !== "new" && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16, paddingTop: 16, borderTop: "1px dashed rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => setEditingStep("new")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "rgba(30,144,255,0.08)", border: "1px dashed rgba(30,144,255,0.3)", color: "#60A5FA", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(30,144,255,0.14)"; e.currentTarget.style.borderColor = "rgba(30,144,255,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(30,144,255,0.08)"; e.currentTarget.style.borderColor = "rgba(30,144,255,0.3)"; }}
          >
            + Adicionar step
          </button>
        </div>
      )}

      {/* Jornada vazia */}
      {journey.steps.length === 0 && editingStep !== "new" && (
        <div style={{ textAlign: "center", padding: "40px 24px", color: "#4A6A8A", fontSize: 13 }}>
          Nenhum step ainda.{" "}
          {editMode && (
            <button onClick={() => setEditingStep("new")} style={{ background: "none", border: "none", color: "#60A5FA", cursor: "pointer", fontSize: 13, fontFamily: "inherit", textDecoration: "underline" }}>
              Adicione o primeiro step.
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Trilha de humor ──────────────────────────────────────────────────────────

function MoodCell({ step, isClient, editMode, isOpen, onToggle, onSave, isFirst, isLast }) {
  const [tempEmoji, setTempEmoji] = useState(step.moodEmoji || "");
  const [tempNote,  setTempNote]  = useState(step.moodNote  || "");

  const handleOpen = () => {
    setTempEmoji(step.moodEmoji || "");
    setTempNote(step.moodNote   || "");
    onToggle();
  };

  // Linha de passagem para steps BHub (trilha continua, mas sem nó)
  if (!isClient) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.03)" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      {/* Linha superior */}
      {!isFirst && <div style={{ width: 1, flex: "1 1 0", background: "rgba(255,255,255,0.07)" }} />}

      {/* Nó de humor */}
      {editMode ? (
        <button
          onClick={handleOpen}
          title={step.moodEmoji ? "Editar humor" : "Adicionar humor"}
          style={{
            width: 30, height: 30, borderRadius: "50%",
            fontSize: step.moodEmoji ? 18 : 13,
            background: isOpen
              ? "rgba(30,144,255,0.15)"
              : step.moodEmoji ? "rgba(255,255,255,0.04)" : "transparent",
            border: isOpen
              ? "1px solid rgba(30,144,255,0.4)"
              : step.moodEmoji
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px dashed rgba(255,255,255,0.1)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: step.moodEmoji ? "inherit" : "#2E4A6A",
            flexShrink: 0, lineHeight: 1, transition: "all 0.15s",
          }}
        >
          {step.moodEmoji || "＋"}
        </button>
      ) : step.moodEmoji ? (
        <div
          title={step.moodNote || ""}
          style={{
            fontSize: 20, lineHeight: 1, flexShrink: 0,
            cursor: step.moodNote ? "help" : "default",
            filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.3))",
          }}
        >
          {step.moodEmoji}
        </div>
      ) : (
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />
      )}

      {/* Linha inferior */}
      {!isLast && <div style={{ width: 1, flex: "1 1 0", background: "rgba(255,255,255,0.07)" }} />}

      {/* Popover de edição */}
      {isOpen && editMode && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", left: "calc(100% + 10px)", top: "50%",
            transform: "translateY(-50%)",
            zIndex: 50, width: 252,
            padding: 14, borderRadius: 12,
            background: "#131E2E",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{
            fontSize: 10, fontWeight: 700, color: "#4A6A8A", marginBottom: 10,
            fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            Humor do cliente
          </div>

          {/* Grid de emojis */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, marginBottom: 10 }}>
            {MOODS.map((m) => (
              <button
                key={m.emoji}
                onClick={() => setTempEmoji(tempEmoji === m.emoji ? "" : m.emoji)}
                title={m.label}
                style={{
                  fontSize: 20, padding: "5px 0", borderRadius: 7,
                  border: "1px solid",
                  borderColor: tempEmoji === m.emoji ? "rgba(30,144,255,0.5)" : "transparent",
                  background: tempEmoji === m.emoji ? "rgba(30,144,255,0.12)" : "rgba(255,255,255,0.02)",
                  cursor: "pointer", lineHeight: 1.2, transition: "all 0.1s",
                }}
              >
                {m.emoji}
              </button>
            ))}
          </div>

          {/* Label do emoji selecionado */}
          {tempEmoji && (
            <div style={{ fontSize: 11, color: "#60A5FA", marginBottom: 8, fontWeight: 600 }}>
              {MOODS.find((m) => m.emoji === tempEmoji)?.label}
            </div>
          )}

          {/* Campo de descrição */}
          <textarea
            value={tempNote}
            onChange={(e) => setTempNote(e.target.value)}
            placeholder="Descreva o sentimento..."
            rows={2}
            style={{
              width: "100%", resize: "none", boxSizing: "border-box",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 7, padding: "7px 10px",
              color: "#E2E8F0", fontSize: 12, fontFamily: "inherit",
              outline: "none", lineHeight: 1.5,
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.3)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />

          {/* Ações */}
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button
              onClick={() => onSave({ moodEmoji: tempEmoji, moodNote: tempNote })}
              style={{
                flex: 1, padding: "6px 0", borderRadius: 7, fontSize: 12, fontWeight: 600,
                background: "rgba(30,144,255,0.12)", border: "1px solid rgba(30,144,255,0.25)",
                color: "#60A5FA", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Salvar
            </button>
            {step.moodEmoji && (
              <button
                onClick={() => onSave({ moodEmoji: "", moodNote: "" })}
                style={{
                  padding: "6px 10px", borderRadius: 7, fontSize: 12,
                  background: "transparent", border: "1px solid rgba(239,68,68,0.2)",
                  color: "#F87171", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Limpar
              </button>
            )}
            <button
              onClick={onToggle}
              style={{
                padding: "6px 10px", borderRadius: 7, fontSize: 12,
                background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                color: "#64748B", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
