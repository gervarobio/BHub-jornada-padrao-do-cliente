import { useState } from "react";

const CATEGORY_SUGGESTIONS = [
  "Rotina Mensal",
  "Departamento Pessoal",
  "Financeiro",
  "Cadastro",
];

const EMOJI_OPTIONS = ["📅","📤","✉️","🏦","👤","💰","📋","🔔","📑","🗂️","📊","⚙️","🔧","📝","🤝"];

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 7,
  color: "#E2E8F0", fontFamily: "inherit", fontSize: 13,
  padding: "8px 10px", outline: "none", transition: "border-color 0.2s",
};

const labelStyle = {
  fontSize: 10, fontWeight: 700, color: "#64748B",
  textTransform: "uppercase", letterSpacing: "0.08em",
  fontFamily: "'Space Mono', monospace",
  display: "block", marginBottom: 5,
};

export default function JourneyEditor({ journey, onSave, onCancel, onDelete, isNew }) {
  const [form, setForm] = useState({
    title:       journey?.title       ?? "",
    subtitle:    journey?.subtitle    ?? "",
    category:    journey?.category    ?? "",
    icon:        journey?.icon        ?? "📋",
    description: journey?.description ?? "",
    isIdeal:     journey?.isIdeal     ?? false,
  });

  const [showEmojis, setShowEmojis] = useState(false);
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (!form.title.trim() || !form.category.trim()) return;
    onSave(form);
  };

  const canSave = form.title.trim() && form.category.trim();

  return (
    <div style={{
      background: "linear-gradient(135deg, #0B1120 0%, #131E35 100%)",
      border: "1px solid rgba(30,144,255,0.2)",
      borderRadius: 14, padding: "24px 24px 20px",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#60A5FA",
        fontFamily: "'Space Mono', monospace",
        textTransform: "uppercase", letterSpacing: "0.1em",
        marginBottom: 20,
      }}>
        {isNew ? "Nova jornada" : "Editar jornada"}
      </div>

      {/* Ícone + Título */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Ícone</label>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowEmojis((v) => !v)}
              style={{
                width: 48, height: 40, borderRadius: 7, fontSize: 22,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
              }}
            >
              {form.icon}
            </button>
            {showEmojis && (
              <div style={{
                position: "absolute", top: 46, left: 0, zIndex: 50,
                background: "#1A2332", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: 10,
                display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}>
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => { set("icon", e); setShowEmojis(false); }}
                    style={{
                      width: 34, height: 34, borderRadius: 6, fontSize: 18,
                      background: form.icon === e ? "rgba(30,144,255,0.15)" : "transparent",
                      border: form.icon === e ? "1px solid rgba(30,144,255,0.3)" : "1px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Título *</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ex: Solicitação de DP"
            onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
        </div>
      </div>

      {/* Subtítulo */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Subtítulo</label>
        <input
          style={inputStyle}
          value={form.subtitle}
          onChange={(e) => set("subtitle", e.target.value)}
          placeholder="Ex: Admissão, demissão, férias"
          onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
        />
      </div>

      {/* Categoria */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Categoria *</label>
        <input
          style={inputStyle}
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          list="category-suggestions"
          placeholder="Rotina Mensal / Financeiro / ..."
          onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
        />
        <datalist id="category-suggestions">
          {CATEGORY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>

      {/* Descrição */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Descrição</label>
        <textarea
          style={{ ...inputStyle, minHeight: 68, resize: "vertical" }}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Descreva o objetivo e contexto desta jornada"
          onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
        />
      </div>

      {/* Flag ideal */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.isIdeal}
            onChange={(e) => set("isIdeal", e.target.checked)}
            style={{ accentColor: "#34D399" }}
          />
          <span style={{ fontSize: 12, color: "#94A3B8" }}>
            Jornada Ideal — marca como proposta de estado desejado
          </span>
        </label>
      </div>

      {/* Ações */}
      <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
        <div>
          {!isNew && onDelete && (
            <button
              onClick={onDelete}
              style={{
                padding: "8px 14px", borderRadius: 7, fontSize: 12,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#EF4444", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Excluir jornada
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 14px", borderRadius: 7, fontSize: 12,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#64748B", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              padding: "8px 20px", borderRadius: 7, fontSize: 12, fontWeight: 600,
              background: canSave
                ? "linear-gradient(135deg, #2E6B9E, #1E90FF)"
                : "rgba(255,255,255,0.06)",
              border: "none",
              color: canSave ? "#fff" : "#4A6A8A",
              cursor: canSave ? "pointer" : "not-allowed",
              fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            {isNew ? "Criar jornada" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
