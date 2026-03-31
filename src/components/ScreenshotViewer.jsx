export default function ScreenshotViewer({ src, caption, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.85)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <img
        src={src}
        alt={caption}
        style={{
          maxWidth: "90vw", maxHeight: "82vh",
          borderRadius: 12,
          boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      {caption && (
        <div style={{
          marginTop: 14, color: "#94A3B8", fontSize: 12,
          fontFamily: "'Space Mono', monospace",
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}
