import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Timeline from "./components/Timeline";
import journeysData from "./data/journeys.json";

export default function App() {
  const [selectedId, setSelectedId] = useState("envio-email-ideal");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const journey = journeysData.find((j) => j.id === selectedId) || null;

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
        journeys={journeysData}
        selectedId={selectedId}
        onSelect={setSelectedId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* Área principal */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {!journey ? (
          <EmptyState />
        ) : (
          <div style={{ padding: "28px 24px 80px" }}>
            <JourneyHeader journey={journey} />
            <Timeline journey={journey} />
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
      `}</style>
    </div>
  );
}

function JourneyHeader({ journey }) {
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
        fontSize: 25, fontWeight: 700, lineHeight: 1.2,
        marginBottom: 6,
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

      {/* Legenda de feedback (só na jornada ideal) */}
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
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100%", padding: 40, textAlign: "center",
    }}>
      <h1 style={{ fontSize: 23, fontWeight: 700, color: "#CBD5E1" }}>
        Mapa de Jornadas BHub
      </h1>
      <p style={{ color: "#4A6A8A", fontSize: 14, marginTop: 8 }}>
        Selecione uma jornada na lateral.
      </p>
    </div>
  );
}
