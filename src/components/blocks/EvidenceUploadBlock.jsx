// src/components/blocks/EvidenceUploadBlock.jsx
// Students upload photos of lab work with optional reflections.
// Uses base64 data URLs stored directly in the progress document (no Firebase Storage needed for MVP).

import { useState, useCallback } from "react";
import useAutoSave from "../../hooks/useAutoSave.jsx";

export default function EvidenceUploadBlock({ block, studentData, onAnswer }) {
  const data = studentData[block.id] || {};
  const [images, setImages] = useState(data.images || []);
  const [reflection, setReflection] = useState(data.reflection || "");

  const performSave = useCallback(() => {
    onAnswer(block.id, {
      images,
      reflection,
      savedAt: new Date().toISOString(),
    });
  }, [block.id, images, reflection, onAnswer]);

  const { markDirty, saveNow, lastSaved } = useAutoSave(performSave);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large (max 5MB). Please resize and try again.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => {
          if (prev.length >= 4) {
            alert("Maximum 4 images per upload block.");
            return prev;
          }
          const updated = [...prev, {
            dataUrl: ev.target.result,
            name: file.name,
            uploadedAt: new Date().toISOString(),
          }];
          return updated;
        });
        markDirty();
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ""; // reset input
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    markDirty();
  };

  return (
    <div className="evidence-upload-block">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>{block.icon || "📷"}</span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>
            {block.title || "Upload Evidence"}
          </div>
          {block.instructions && (
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>{block.instructions}</div>
          )}
        </div>
      </div>

      {/* Image grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 14 }}>
        {images.map((img, i) => (
          <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface2)" }}>
            <img src={img.dataUrl} alt={img.name || "Evidence"} style={{ width: "100%", height: 140, objectFit: "cover" }} />
            <button
              onClick={() => removeImage(i)}
              style={{
                position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%",
                background: "rgba(0,0,0,0.6)", border: "none", color: "white", fontSize: 12,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          </div>
        ))}

        {/* Upload button */}
        {images.length < 4 && (
          <label style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            height: 140, borderRadius: 10, border: "2px dashed var(--border)",
            background: "var(--surface2)", cursor: "pointer", transition: "border-color 0.2s",
            color: "var(--text3)", fontSize: 13, fontWeight: 600,
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--amber)"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <span style={{ fontSize: 28, marginBottom: 4 }}>📷</span>
            <span>Add Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} multiple />
          </label>
        )}
      </div>

      {/* Reflection */}
      {block.reflectionPrompt && (
        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 4 }}>
            {block.reflectionPrompt}
          </label>
          <textarea
            className="sa-input"
            rows={3}
            value={reflection}
            onChange={(e) => { setReflection(e.target.value); markDirty(); }}
            onBlur={saveNow}
            placeholder="Write your reflection..."
          />
        </div>
      )}

      {lastSaved && (
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>
          Saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </div>
      )}
    </div>
  );
}
