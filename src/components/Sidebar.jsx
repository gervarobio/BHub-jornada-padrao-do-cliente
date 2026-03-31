import { useState } from "react";
import { search } from "../services/search";

export default function Sidebar({ journeys, selectedId, onSelect, isOpen, onToggle }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim().length >= 2
    ? search(query, journeys)
    : journeys;

  const categories = [...new Set(journeys.map((j) => j.category))];

  return (
    <>
      {/* Sidebar */}
      <div style={{
        width: isOpen ? 280 : 0,
        minWidth: isOpen ? 280 : 0,
        background: "linear-gradient(180deg, #0F1729 0%, #0B1120 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        transition: "all 0.3s ease", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: "22px 18px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #2E6B9E 0%, #1E90FF 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#fff",
            }}>
              B
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>BHub</div>
              <div style={{
                fontSize: 9, color: "#64748B",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                Mapa de Jornadas
              </div>
            </div>
          </div>
        </div>

        {/* Busca */}
        <div style={{ padding: "12px 14px" }}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ color: "#4A6A8A", fontSize: 13 }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar jornada..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                background: "none", border: "none", outline: "none",
                color: "#E2E8F0", fontSize: 12, width: "100%",
                fontFamily: "inherit",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#4A6A8A", fontSize: 12, padding: 0,
                }}
              >
                ×
              </button>
            )}
          </div>
          {query.trim().length >= 2 && (
            <div style={{
              marginTop: 6, fontSize: 9, color: "#4A6A8A",
              fontFamily: "'Space Mono', monospace",
            }}>
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Lista de jornadas */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
          {query.trim().length >= 2 ? (
            // Resultado de busca (sem agrupamento)
            filtered.length > 0 ? (
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.12em", color: "#4A6A8A",
                  padding: "6px 10px",
                  fontFamily: "'Space Mono', monospace",
                }}>
                  Resultados
                </div>
                {filtered.map((j) => (
                  <JourneyButton
                    key={j.id}
                    journey={j}
                    isSelected={selectedId === j.id}
                    onClick={() => onSelect(j.id)}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                padding: "24px 12px", textAlign: "center",
                color: "#4A6A8A", fontSize: 12,
              }}>
                Nenhuma jornada encontrada
              </div>
            )
          ) : (
            // Agrupado por categoria
            categories.map((cat) => {
              const catJourneys = filtered.filter((j) => j.category === cat);
              if (!catJourneys.length) return null;
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.12em", color: "#4A6A8A",
                    padding: "6px 10px",
                    fontFamily: "'Space Mono', monospace",
                  }}>
                    {cat}
                  </div>
                  {catJourneys.map((j) => (
                    <JourneyButton
                      key={j.id}
                      journey={j}
                      isSelected={selectedId === j.id}
                      onClick={() => onSelect(j.id)}
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "10px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: 9, color: "#334155",
          fontFamily: "'Space Mono', monospace",
          textAlign: "center",
        }}>
          {journeys.length} jornadas · v1.0
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          position: "absolute",
          left: isOpen ? 268 : 0,
          top: 12, zIndex: 10,
          width: 22, height: 22, borderRadius: 6,
          background: "#1A2332",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#64748B", cursor: "pointer", fontSize: 11,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "left 0.3s ease",
        }}
      >
        {isOpen ? "◂" : "▸"}
      </button>
    </>
  );
}

function JourneyButton({ journey, isSelected, onClick }) {
  const hasSuggested = (journey.steps || []).some((s) => s.suggestedScreen && !s.screenshot);

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "9px 10px", borderRadius: 8,
        border: isSelected
          ? `1px solid ${journey.isIdeal ? "rgba(52,211,153,0.4)" : "rgba(30,144,255,0.3)"}`
          : "1px solid transparent",
        background: isSelected
          ? (journey.isIdeal ? "rgba(52,211,153,0.08)" : "rgba(30,144,255,0.08)")
          : "transparent",
        color: isSelected
          ? (journey.isIdeal ? "#6EE7B7" : "#93C5FD")
          : "#94A3B8",
        cursor: "pointer", textAlign: "left",
        transition: "all 0.2s", marginBottom: 1,
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = "transparent";
      }}
    >
      <span style={{ fontSize: 16 }}>{journey.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, lineHeight: 1.3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {journey.title}
        </div>
        <div style={{
          fontSize: 10, color: "#4A6A8A", marginTop: 1,
          display: "flex", gap: 4, alignItems: "center",
        }}>
          <span>{journey.steps.length} etapas</span>
          {journey.isIdeal && (
            <span style={{
              fontSize: 8, padding: "1px 5px", borderRadius: 6,
              background: "rgba(52,211,153,0.15)", color: "#34D399", fontWeight: 600,
            }}>
              ideal
            </span>
          )}
          {hasSuggested && (
            <span style={{
              fontSize: 8, padding: "1px 5px", borderRadius: 6,
              background: "rgba(251,191,36,0.1)", color: "#FBBF24", fontWeight: 600,
            }}>
              telas sugeridas
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
