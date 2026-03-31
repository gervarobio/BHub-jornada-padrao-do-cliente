import BranchView from "./BranchView";

export default function BHubCard({ step, isExpanded, onClick }) {
  if (!isExpanded) {
    return (
      <button
        onClick={onClick}
        style={{
          width: "100%", textAlign: "left", cursor: "pointer",
          padding: "7px 12px", borderRadius: 8,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.04)",
          color: "#4A6A8A", fontFamily: "inherit", transition: "all 0.2s",
          display: "flex", alignItems: "center", gap: 8,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B", flex: 1 }}>
          {step.title}
        </span>
        <span style={{
          fontSize: 9, padding: "2px 6px", borderRadius: 8,
          background: "rgba(124,58,237,0.08)", color: "#7C3AED", fontWeight: 600,
        }}>
          {step.channel}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", textAlign: "left", cursor: "pointer",
        padding: "14px 16px", borderRadius: 10,
        background: "linear-gradient(135deg, #1A1333 0%, #2D1F5E 100%)",
        border: "1px solid rgba(124,58,237,0.3)",
        color: "#E2E8F0", fontFamily: "inherit", transition: "all 0.25s ease",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 6,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>{step.title}</span>
        <span style={{
          fontSize: 9, padding: "2px 6px", borderRadius: 8,
          background: "rgba(124,58,237,0.15)", color: "#A78BFA", fontWeight: 600,
        }}>
          {step.channel}
        </span>
      </div>

      <div style={{ animation: "fadeIn 0.3s ease" }}>
        {step.description && (
          <p style={{
            fontSize: 13, color: "#94A3B8", lineHeight: 1.7, marginBottom: 8,
          }}>
            {step.description}
          </p>
        )}

        {step.isBranch && step.branches && <BranchView branches={step.branches} />}

        {step.suggestedScreen && (
          <div style={{
            marginBottom: 8, borderRadius: 6, padding: "10px 12px",
            border: "1px dashed rgba(251,191,36,0.2)",
            background: "rgba(251,191,36,0.03)",
          }}>
            <div style={{ fontSize: 11, color: "#FBBF24", fontWeight: 600, marginBottom: 3 }}>
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
          <span style={{ color: "#A78BFA", fontWeight: 600 }}>{step.who}</span>
        </div>

        {step.tip && (
          <div style={{
            marginTop: 8, padding: "6px 10px", borderRadius: 5,
            background: "rgba(234,179,8,0.04)",
            borderLeft: "2px solid rgba(234,179,8,0.3)",
            fontSize: 11, color: "#92700C", lineHeight: 1.6,
          }}>
            {step.tip}
          </div>
        )}
      </div>
    </button>
  );
}
