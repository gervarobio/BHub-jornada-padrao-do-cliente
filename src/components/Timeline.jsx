import { useState } from "react";
import ClientCard from "./ClientCard";
import BHubCard from "./BHubCard";

const FEEDBACK_STYLES = {
  info:    { icon: "📨", color: "#60A5FA" },
  success: { icon: "✅", color: "#22C55E" },
  mixed:   { icon: "📋", color: "#F59E0B" },
  final:   { icon: "🏁", color: "#8B5CF6" },
};

export default function Timeline({ journey }) {
  const [expandedStep, setExpandedStep] = useState(null);

  const toggle = (i) => setExpandedStep(expandedStep === i ? null : i);

  let clientStepNum = 0;

  return (
    <div style={{ maxWidth: 940, margin: "0 auto" }}>
      {/* Header swimlane */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 44px 1fr",
        gap: 0, marginBottom: 6,
      }}>
        <div style={{
          padding: "10px 16px", borderRadius: "10px 10px 0 0",
          background: "rgba(30,107,158,0.06)",
          borderBottom: "2px solid #2E6B9E",
          textAlign: "right",
        }}>
          <span style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#2E6B9E",
            fontFamily: "'Space Mono', monospace",
          }}>
            👤 Cliente
          </span>
        </div>
        <div />
        <div style={{
          padding: "10px 16px", borderRadius: "10px 10px 0 0",
          background: "rgba(124,58,237,0.03)",
          borderBottom: "1px solid rgba(124,58,237,0.2)",
        }}>
          <span style={{
            fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#64748B",
            fontFamily: "'Space Mono', monospace",
          }}>
            ⚙ BHub
          </span>
        </div>
      </div>

      {/* Steps */}
      {journey.steps.map((step, i) => {
        const isClient = step.side === "client";
        const isExpanded = expandedStep === i;
        const fb = step.isFeedback ? FEEDBACK_STYLES[step.feedbackType] : null;
        const isNumbered = step.label && (step.label.startsWith("Passo") || step.label.startsWith("Dia") || step.label.startsWith("Conclusão"));

        if (isClient && isNumbered && !step.isFeedback) clientStepNum++;

        // Nó da timeline
        let nodeContent, nodeStyle;

        if (step.isBranch) {
          nodeContent = "⑂";
          nodeStyle = {
            width: 24, height: 24, borderRadius: 6,
            background: "none", fontSize: 19, color: "#F59E0B",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, zIndex: 1,
          };
        } else if (isClient && fb && !isNumbered) {
          nodeContent = fb.icon;
          nodeStyle = {
            width: 24, height: 24, background: "none", fontSize: 17,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, zIndex: 1,
          };
        } else if (isClient && isNumbered) {
          const num = clientStepNum;
          nodeContent = num;
          nodeStyle = {
            width: 30, height: 30, borderRadius: "50%",
            background: fb ? fb.color : "#2E6B9E",
            boxShadow: `0 0 14px ${fb ? fb.color + "44" : "rgba(46,107,158,0.4)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff",
            flexShrink: 0, zIndex: 1,
          };
        } else if (!isClient) {
          nodeContent = "";
          nodeStyle = {
            width: 8, height: 8, borderRadius: "50%",
            background: "rgba(124,58,237,0.3)",
            flexShrink: 0, zIndex: 1,
          };
        } else {
          nodeContent = "•";
          nodeStyle = {
            width: 24, height: 24, background: "none", fontSize: 19, color: "#2E6B9E",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, zIndex: 1,
          };
        }

        const lineColor = isClient ? "rgba(255,255,255,0.07)" : "rgba(124,58,237,0.12)";
        const lineWidth = isClient ? 2 : 1;

        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 44px 1fr",
              gap: 0,
              minHeight: isClient ? 64 : 44,
            }}
          >
            {/* Lane cliente */}
            <div style={{
              display: "flex", justifyContent: "flex-end",
              padding: isClient ? "6px 8px 6px 0" : "4px 8px 4px 0",
            }}>
              {isClient && (
                <ClientCard
                  step={step}
                  isExpanded={isExpanded}
                  onClick={() => toggle(i)}
                />
              )}
            </div>

            {/* Timeline central */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              {i > 0 && (
                <div style={{
                  width: lineWidth, flex: "1 1 0",
                  background: lineColor,
                }} />
              )}
              <div style={nodeStyle}>{nodeContent}</div>
              {i < journey.steps.length - 1 && (
                <div style={{
                  width: isClient ? 2 : 1, flex: "1 1 0",
                  background: "rgba(255,255,255,0.07)",
                }} />
              )}
            </div>

            {/* Lane BHub */}
            <div style={{
              display: "flex", justifyContent: "flex-start",
              padding: !isClient ? "4px 0 4px 8px" : "6px 0 6px 8px",
            }}>
              {!isClient && (
                <BHubCard
                  step={step}
                  isExpanded={isExpanded}
                  onClick={() => toggle(i)}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
