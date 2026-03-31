import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Timeline from "./components/Timeline";
import JourneyEditor from "./components/editor/JourneyEditor";
import { useJourneys } from "./hooks/useJourneys";

export default function App() {
  const {
    journeys,
    createJourney, updateJourney, deleteJourney,
    addStep, updateStep, deleteStep,
  } = useJourneys();

  const [selectedId, setSelectedId]           = useState("envio-email-ideal");
  const [sidebarOpen, setSidebarOpen]         = useState(true);
  const [editMode, setEditMode]               = useState(false);
  const [editingJourney, setEditingJourney]   = useState(false);
  const [creatingJourney, setCreatingJourney] = useState(false);

  const journey = journeys.find((j) => j.id === selectedId) || null;

  const handleCreateJourney = (fields) => {
    const id = createJourney(fields);
    setSelectedId(id);
    setCreatingJourney(false);
    setEditMode(true);
  };

  const handleUpdateJourney = (fields) => {
    updateJourney(selectedId, fields);
    setEditingJourney(false);
  };

  const handleDeleteJourney = () => {
    deleteJourney(selectedId);
    const next = journeys.find((j) => j.id !== selectedId);
    setSelectedId(next?.id || null);
    setEditingJourney(false);
    setEditMode(false);
  };

  const handleSelectJourney = (id) => {
    setSelectedId(id);
    setEditMode(false);
    setEditingJourney(false);
  };

  return (
    <div style={{
      display: "flex", height: "100vh", position: "relative",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#0B1120", color: "#E2E8F0", overflow: "hidden",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <Sidebar
        journeys={journeys}
        selectedId={selectedId}
        onSelect={handleSelectJourney}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onNewJourney={() => setCreatingJourney(true)}
      />

      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Modal: Nova jornada */}
        {creatingJourney && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24,
            }}
            onClick={() => setCreatingJourney(false)}
          >
            <div style={{ width: "100%", maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
              <JourneyEditor
                journey={null}
                onSave={handleCreateJourney}
                onCancel={() => setCreatingJourney(false)}
                isNew
              />
            </div>
          </div>
        )}

        {/* Modal: Editar metadados */}
        {editingJourney && journey && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24,
            }}
            onClick={() => setEditingJourney(false)}
          >
            <div style={{ width: "100%", maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
              <JourneyEditor
                journey={journey}
                onSave={handleUpdateJourney}
                onCancel={() => setEditingJourney(false)}
                onDelete={handleDeleteJourney}
                isNew={false}
              />
            </div>
          </div>
        )}

        {!journey ? (
          <EmptyState onNew={() => setCreatingJourney(true)} />
        ) : (
          <div style={{ padding: "28px 24px 80px" }}>
            <JourneyHeader
              journey={journey}
              editMode={editMode}
              onToggleEdit={() => setEditMode((v) => !v)}
              onEditMeta={() => setEditingJourney(true)}
            />
            <Timeline
              journey={journey}
              editMode={editMode}
              onAddStep={(data) => addStep(selectedId, data)}
              onUpdateStep={(i, data) => updateStep(selectedId, i, data)}
              onDeleteStep={(i) => deleteStep(selectedId, i)}
              onMoveStep={(from, to) => moveStep(selectedId, from, to)}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        select option { background: #1A2332; }
      `}</style>
    </div>
  );
}

function JourneyHeader({ journey, editMode, onToggleEdit, onEditMeta }) {
  return (
    <div style={{ maxWidth: 940, margin: "0 auto 24px", textAlign: "center" }}>
      {journey.isIdeal && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: 20,
          background: "rgba(52,211,153,0.08)",
          border: "1px solid rgba(52,211,153,0.2)",
          fontSize: 12, color: "#34D399", fontWeight: 600,
          marginBottom: 10,
        }}>
          ✨ Jornada Ideal — Proposta
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 6, fontSize: 11, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.12em",
        color: "#4A6A8A", marginBottom: 8,
        fontFamily: "'Space Mono', monospace",
      }}>
        <span style={{ fontSize: 16 }}>{journey.icon}</span>
        {journey.category}
      </div>

      <h1 style={{
        fontSize: 25, fontWeight: 700, lineHeight: 1.2, marginBottom: 6,
        background: journey.isIdeal
          ? "linear-gradient(135deg, #6EE7B7, #34D399)"
          : "linear-gradient(135deg, #93C5FD, #60A5FA)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        {journey.title}
      </h1>

      {journey.subtitle && (
        <p style={{
          color: "#64748B", fontSize: 13,
          fontFamily: "'Space Mono', monospace",
          letterSpacing: "0.04em", marginBottom: 8,
        }}>
          {journey.subtitle}
        </p>
      )}

      <p style={{
        color: "#64748B", fontSize: 14, lineHeight: 1.6,
        maxWidth: 600, margin: "0 auto",
      }}>
        {journey.description}
      </p>

      {journey.isIdeal && (
        <div style={{
          display: "flex", gap: 10, justifyContent: "center",
          flexWrap: "wrap", marginTop: 16,
        }}>
          {[
            { icon: "📨", color: "#60A5FA", label: "Comunicação" },
            { icon: "✅", color: "#22C55E", label: "Confirmação" },
            { icon: "📋", color: "#F59E0B", label: "Feedback" },
            { icon: "🏁", color: "#8B5CF6", label: "Conclusão" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 11, color: item.color,
              background: item.color + "12",
              padding: "3px 10px", borderRadius: 20,
              border: `1px solid ${item.color}20`,
            }}>
              <span>{item.icon}</span>
              <span style={{ fontWeight: 600 }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18 }}>
        {editMode && (
          <button
            onClick={onEditMeta}
            style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94A3B8", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ✏ Editar título e info
          </button>
        )}
        <button
          onClick={onToggleEdit}
          style={{
            padding: "7px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: editMode ? "rgba(34,197,94,0.1)" : "rgba(30,144,255,0.1)",
            border: `1px solid ${editMode ? "rgba(34,197,94,0.3)" : "rgba(30,144,255,0.3)"}`,
            color: editMode ? "#4ADE80" : "#60A5FA",
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
          }}
        >
          {editMode ? "✓ Modo edição ativo" : "✏ Editar jornada"}
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onNew }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100%", padding: 40, textAlign: "center",
    }}>
      <h1 style={{ fontSize: 23, fontWeight: 700, color: "#CBD5E1" }}>
        Mapa de Jornadas BHub
      </h1>
      <p style={{ color: "#4A6A8A", fontSize: 14, marginTop: 8, marginBottom: 20 }}>
        Selecione uma jornada na lateral ou crie uma nova.
      </p>
      <button
        onClick={onNew}
        style={{
          padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: "rgba(30,144,255,0.1)",
          border: "1px solid rgba(30,144,255,0.3)",
          color: "#60A5FA", cursor: "pointer", fontFamily: "inherit",
        }}
      >
        + Nova jornada
      </button>
    </div>
  );
}
