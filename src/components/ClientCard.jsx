import { useState } from "react";
import ScreenshotViewer from "./ScreenshotViewer";

const FEEDBACK_STYLES = {
  info:    { icon: "📨", color: "#60A5FA", bg: "rgba(96,165,250,0.10)",  label: "Comunicação recebida" },
  success: { icon: "✅", color: "#22C55E", bg: "rgba(34,197,94,0.10)",   label: "Confirmação recebida" },
  mixed:   { icon: "📋", color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  label: "Feedback consolidado" },
  final:   { icon: "🏁", color: "#8B5CF6", bg: "rgba(139,92,246,0.10)", label: "Conclusão comunicada" },
};

export default function ClientCard({ step, isExpanded, onClick }) {
  const [viewingScreenshot, setViewingScreenshot] = useState(false);

  const screenshotSrc = step.screenshot ? `/screenshots/${step.screenshot}` : null;
  const fb = step.isFeedback ? FEEDBACK_STYLES[step.feedbackType] : null;
  const accentColor = fb ? fb.color : "#2E6B9E";

  return (
    <>
      {viewingScreenshot && screenshotSrc && (
        <ScreenshotViewer
          src={screenshotSrc}
          caption={step.screenshotCaption}
          onClose={() => setViewingScreenshot(false)}
        />
      )}

      <button
        onClick={onClick}
        style={{
          width: "100%", textAlign: "left", cursor: "pointer",
          padding: isExpanded ? "16px 18px" : "12px 16px",
          borderRadius: 12,
          background: isExpanded
            ? (fb ? `linear-gradient(135deg, ${fb.color}12, ${fb.color}06)` : "linear-gradient(135deg, #0D1F3C 0%, #1A3A5C 100%)")
            : (fb ? fb.bg : "rgba(255,255,255,0.02)"),
          border: `1px solid ${isExpanded
            ? accentColor + "44"
            : (fb ? fb.color + "20" : "rgba(255,255,255,0.06)")}`,
          color: "#E2E8F0", fontFamily: "inherit",
          transition: "all 0.25s ease", position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.borderColor = accentColor + "33";
            e.currentTarget.style.background = fb ? fb.bg : "rgba(255,255,255,0.04)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.borderColor = fb ? fb.color + "20" : "rgba(255,255,255,0.06)";
            e.currentTarget.style.background = fb ? fb.bg : "rgba(255,255,255,0.02)";
          }
        }}
      >
        {/* Seta apontando para timeline */}
        <div style={{
          position: "absolute", top: 18, right: -6,
          width: 10, height: 10,
          background: isExpanded
            ? accentColor + "18"
            : (fb ? fb.bg : "rgba(255,255,255,0.02)"),
          border: `1px solid ${isExpanded ? accentColor + "44" : (fb ? fb.color + "20" : "rgba(255,255,255,0.06)")}`,
          transform: "rotate(45deg)",
          borderLeft: "none", borderTop: "none",
        }} />

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4, gap: 4, flexWrap: "wrap",
        }}>
          {step.label ? (
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.1em", color: accentColor,
              fontFamily: "'Space Mono', monospace",
            }}>
              {step.label}
            </span>
          ) : <span />}

          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {step.screenshot && (
              <span style={{
                fontSize: 8, padding: "2px 4px", borderRadius: 4,
                background: "rgba(34,197,94,0.12)", color: "#22C55E", fontWeight: 600,
              }}>
                📸 print
              </span>
            )}
            {step.suggestedScreen && !step.screenshot && (
              <span style={{
                fontSize: 8, padding: "2px 4px", borderRadius: 4,
                background: "rgba(251,191,36,0.12)", color: "#FBBF24", fontWeight: 600,
              }}>
                💡 sugerida
              </span>
            )}
            <span style={{
              fontSize: 9, padding: "2px 5px", borderRadius: 8,
              background: accentColor + "18", color: accentColor,
              fontWeight: 600, whiteSpace: "nowrap",
            }}>
              {step.channel}
            </span>
          </div>
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: (isExpanded || fb) ? 6 : 0 }}>
          {step.title}
        </div>

        {/* Feedback badge colapsado */}
        {!isExpanded && fb && (
          <div style={{
            fontSize: 10, color: fb.color, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 4, marginTop: 2,
          }}>
            {fb.icon} {fb.label}
          </div>
        )}

        {/* Conteúdo expandido */}
        {isExpanded && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {fb && (
              <div style={{
                padding: "7px 10px", borderRadius: 6,
                background: fb.bg,
                border: `1px solid ${fb.color}18`,
                marginBottom: 10,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>{fb.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: fb.color }}>
                    {fb.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>
                    Gerado pela BHub · Recebido pelo cliente
                  </div>
                </div>
              </div>
            )}

            {step.description && (
              <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7, marginBottom: 10 }}>
                {step.description}
              </p>
            )}

            {screenshotSrc && (
              <div
                onClick={(e) => { e.stopPropagation(); setViewingScreenshot(true); }}
                style={{
                  marginBottom: 10, borderRadius: 8, overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "zoom-in", position: "relative",
                }}
              >
                <img
                  src={screenshotSrc}
                  alt={step.screenshotCaption || ""}
                  style={{ width: "100%", display: "block", opacity: 0.9, transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "20px 12px 8px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                }}>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{step.screenshotCaption}</span>
                  <span style={{ fontSize: 10, color: "#4A6A8A", fontFamily: "'Space Mono', monospace" }}>
                    🔍 Ampliar
                  </span>
                </div>
              </div>
            )}

            {step.suggestedScreen && !screenshotSrc && (
              <div style={{
                marginBottom: 10, borderRadius: 8, padding: 12,
                border: "2px dashed rgba(251,191,36,0.2)",
                background: "rgba(251,191,36,0.03)",
              }}>
                <div style={{ fontSize: 12, color: "#FBBF24", fontWeight: 600, marginBottom: 3 }}>
                  🖼️ Tela sugerida
                </div>
                <div style={{ fontSize: 11, color: "#92700C", lineHeight: 1.5 }}>
                  {step.suggestedScreenNote}
                </div>
              </div>
            )}

            <div style={{
              display: "inline-flex", padding: "3px 8px",
              borderRadius: 5, background: "rgba(0,0,0,0.2)", fontSize: 11,
            }}>
              <span style={{ color: "#4A6A8A" }}>Responsável:&nbsp;</span>
              <span style={{ color: "#93C5FD", fontWeight: 600 }}>{step.who}</span>
            </div>

            {step.tip && (
              <div style={{
                marginTop: 8, padding: "8px 12px", borderRadius: 6,
                background: "rgba(234,179,8,0.06)",
                borderLeft: "3px solid rgba(234,179,8,0.4)",
                fontSize: 12, color: "#92700C", lineHeight: 1.6,
              }}>
                {step.tip}
              </div>
            )}
          </div>
        )}
      </button>
    </>
  );
}
