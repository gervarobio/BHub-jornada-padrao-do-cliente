import { useState, useRef } from "react";

const SIDE_OPTIONS = [
  { value: "client", label: "👤 Cliente" },
  { value: "bhub",   label: "⚙ BHub" },
];

const FEEDBACK_OPTIONS = [
  { value: "",        label: "— nenhum —" },
  { value: "info",    label: "📨 Comunicação recebida" },
  { value: "success", label: "✅ Confirmação recebida" },
  { value: "mixed",   label: "📋 Feedback consolidado" },
  { value: "final",   label: "🏁 Conclusão comunicada" },
];

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

const rowStyle = { marginBottom: 12 };

export default function StepEditor({ step, onSave, onCancel, onDelete, isNew }) {
  const [form, setForm] = useState({
    title:             step?.title             ?? "",
    label:             step?.label             ?? "",
    side:              step?.side              ?? "client",
    who:               step?.who               ?? "",
    channel:           step?.channel           ?? "",
    description:       step?.description       ?? "",
    tip:               step?.tip               ?? "",
    isFeedback:        step?.isFeedback        ?? false,
    feedbackType:      step?.feedbackType      ?? "",
    suggestedScreen:   step?.suggestedScreen   ?? false,
    suggestedScreenNote: step?.suggestedScreenNote ?? "",
    screenshotCaption: step?.screenshotCaption ?? "",
    // screenshot é gerido separadamente via upload
    screenshot:        step?.screenshot        ?? "",
  });

  const [previewUrl, setPreviewUrl] = useState(
    step?.screenshot ? `/screenshots/${step.screenshot}` : null
  );
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef();

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    set("screenshotCaption", form.screenshotCaption || file.name.replace(/\.[^.]+$/, ""));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    set("screenshotCaption", form.screenshotCaption || file.name.replace(/\.[^.]+$/, ""));
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({ ...form, _uploadedFile: uploadedFile });
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #0F1A2E 0%, #1A2A45 100%)",
      border: "1px solid rgba(30,144,255,0.25)",
      borderRadius: 12, padding: "18px 20px",
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#60A5FA",
        fontFamily: "'Space Mono', monospace",
        textTransform: "uppercase", letterSpacing: "0.1em",
        marginBottom: 16,
      }}>
        {isNew ? "Novo step" : "Editar step"}
      </div>

      {/* Título + Label */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Título *</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ex: Envia documentos por e-mail"
            onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
        </div>
        <div>
          <label style={labelStyle}>Label</label>
          <input
            style={{ ...inputStyle, width: 110 }}
            value={form.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Passo 1"
            onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
        </div>
      </div>

      {/* Lado + Canal + Responsável */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Lado</label>
          <select
            style={{ ...inputStyle, width: 130, cursor: "pointer" }}
            value={form.side}
            onChange={(e) => set("side", e.target.value)}
          >
            {SIDE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Canal</label>
          <input
            style={inputStyle}
            value={form.channel}
            onChange={(e) => set("channel", e.target.value)}
            placeholder="Hub do Empreendedor"
            onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
        </div>
        <div>
          <label style={labelStyle}>Responsável</label>
          <input
            style={inputStyle}
            value={form.who}
            onChange={(e) => set("who", e.target.value)}
            placeholder="Cliente / BHub"
            onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
        </div>
      </div>

      {/* Descrição */}
      <div style={rowStyle}>
        <label style={labelStyle}>Descrição</label>
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="O que acontece neste step?"
          onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
        />
      </div>

      {/* Dica */}
      <div style={rowStyle}>
        <label style={labelStyle}>Dica operacional</label>
        <input
          style={inputStyle}
          value={form.tip}
          onChange={(e) => set("tip", e.target.value)}
          placeholder="Nota interna sobre como este step funciona na prática"
          onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
        />
      </div>

      {/* Feedback */}
      {form.side === "client" && (
        <div style={rowStyle}>
          <label style={labelStyle}>Tipo de feedback (opcional)</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={form.feedbackType}
            onChange={(e) => {
              const v = e.target.value;
              set("feedbackType", v);
              set("isFeedback", v !== "");
            }}
          >
            {FEEDBACK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Screenshot */}
      {form.side === "client" && (
        <div style={rowStyle}>
          <label style={labelStyle}>Screenshot</label>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${previewUrl ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 8, padding: previewUrl ? 0 : "20px 16px",
              cursor: "pointer", textAlign: "center",
              background: previewUrl ? "transparent" : "rgba(255,255,255,0.02)",
              transition: "border-color 0.2s", overflow: "hidden",
            }}
          >
            {previewUrl ? (
              <div style={{ position: "relative" }}>
                <img
                  src={previewUrl} alt=""
                  style={{ width: "100%", display: "block", borderRadius: 6, opacity: 0.85 }}
                />
                <div style={{
                  position: "absolute", inset: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0)", transition: "background 0.2s",
                  borderRadius: 6, fontSize: 12, color: "#fff", fontWeight: 600,
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0)"; }}
                >
                  Trocar imagem
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 22, marginBottom: 6 }}>📸</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  Clique ou arraste uma imagem
                </div>
                <div style={{ fontSize: 10, color: "#334155", marginTop: 3 }}>
                  PNG, JPG, WebP
                </div>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file" accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {previewUrl && (
            <input
              style={{ ...inputStyle, marginTop: 8 }}
              value={form.screenshotCaption}
              onChange={(e) => set("screenshotCaption", e.target.value)}
              placeholder="Legenda da imagem"
              onFocus={(e) => { e.target.style.borderColor = "rgba(30,144,255,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
            />
          )}
        </div>
      )}

      {/* Tela sugerida */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.suggestedScreen}
            onChange={(e) => set("suggestedScreen", e.target.checked)}
            style={{ accentColor: "#FBBF24" }}
          />
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Tela sugerida (a criar)</span>
        </label>
        {form.suggestedScreen && (
          <input
            style={{ ...inputStyle, marginTop: 8 }}
            value={form.suggestedScreenNote}
            onChange={(e) => set("suggestedScreenNote", e.target.value)}
            placeholder="Descreva o que essa tela deveria mostrar"
            onFocus={(e) => { e.target.style.borderColor = "rgba(251,191,36,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
        )}
      </div>

      {/* Ações */}
      <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
        <div>
          {!isNew && onDelete && (
            <button
              onClick={onDelete}
              style={{
                padding: "7px 14px", borderRadius: 7, fontSize: 12,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#EF4444", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Excluir
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "7px 14px", borderRadius: 7, fontSize: 12,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#64748B", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim()}
            style={{
              padding: "7px 18px", borderRadius: 7, fontSize: 12, fontWeight: 600,
              background: form.title.trim()
                ? "linear-gradient(135deg, #2E6B9E, #1E90FF)"
                : "rgba(255,255,255,0.06)",
              border: "none",
              color: form.title.trim() ? "#fff" : "#4A6A8A",
              cursor: form.title.trim() ? "pointer" : "not-allowed",
              fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
