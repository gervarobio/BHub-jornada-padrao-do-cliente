export default function BranchView({ branches }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 10,
    }}>
      {branches.map((b) => (
        <div
          key={b.id}
          style={{
            padding: 14,
            borderRadius: 10,
            background: b.bg,
            border: `1px solid ${b.borderColor}`,
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
          }}>
            <span style={{ fontSize: 16 }}>{b.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>
              {b.title}
            </span>
          </div>
          {(b.steps || []).map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start",
            }}>
              <span style={{ color: b.color, fontSize: 10, marginTop: 1 }}>›</span>
              <div style={{ fontSize: 11, color: "#CBD5E1", lineHeight: 1.5 }}>{s}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
