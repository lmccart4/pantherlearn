// src/components/blocks/EvidenceUploadBlock.jsx
// Students upload photos of lab work with optional reflections.
// Photos go to Firebase Storage at uploads/{courseId}/{lessonId}/{blockId}/{uid}/{filename}.
// Path matches the deployed storage.rules pattern.
// Firestore stores { url, storagePath, name, uploadedAt } per image.
// Backwards-compatible: still renders legacy entries that have { dataUrl } from the base64 era.

import { useState, useCallback, useEffect, useRef } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, storage } from "../../lib/firebase";
import useAutoSave from "../../hooks/useAutoSave.jsx";
import { renderMarkdown } from "../../lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;   // 10 MB per photo (matches storage.rules)
const MAX_IMAGES = 4;

export default function EvidenceUploadBlock({ block, studentData = {}, onAnswer, courseId, lessonId, readOnly = false }) {
  const data = (studentData && studentData[block.id]) || {};
  const [images, setImages] = useState(data.images || []);
  const [reflection, setReflection] = useState(data.reflection || "");
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = studentData?.[block.id];
    if (!saved) {
      if (hydrated.current && (!studentData || Object.keys(studentData).length === 0)) {
        setImages([]);
        setReflection("");
        hydrated.current = false;
      }
      return;
    }
    if (hydrated.current) return;
    hydrated.current = true;
    if (saved.images !== undefined) setImages(saved.images);
    if (saved.reflection !== undefined) setReflection(saved.reflection);
  }, [studentData, block.id]);

  const performSave = useCallback(() => {
    if (readOnly) return;
    onAnswer(block.id, {
      images,
      reflection,
      writtenScore: 0,
      savedAt: new Date().toISOString(),
    });
  }, [block.id, images, reflection, onAnswer, readOnly]);

  const { markDirty, saveNow, lastSaved } = useAutoSave(performSave);
  const [submitted, setSubmitted] = useState(!!data.submitted);

  const handleSubmit = () => {
    if (readOnly) return;
    if (!reflection.trim() && images.length === 0) return;
    onAnswer(block.id, { images, reflection, submitted: true, writtenScore: 1, savedAt: new Date().toISOString() });
    setSubmitted(true);
  };

  const uploadOne = async (file) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not signed in");
    if (!courseId || !lessonId || !block.id) throw new Error("Missing lesson context");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    const path = `uploads/${courseId}/${lessonId}/${block.id}/${uid}/${filename}`;
    const ref = storageRef(storage, path);
    await uploadBytes(ref, file, { contentType: file.type });
    const url = await getDownloadURL(ref);
    return { url, storagePath: path, name: file.name, uploadedAt: new Date().toISOString() };
  };

  const handleFileUpload = async (e) => {
    if (readOnly) return;
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // reset input
    if (files.length === 0) return;
    setUploadError("");

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files (JPG, PNG, HEIC) are accepted.");
        continue;
      }
      if (file.size > MAX_BYTES) {
        setUploadError(`Image too large (max 10MB). "${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
        continue;
      }
      if (images.length + uploadingCount >= MAX_IMAGES) {
        setUploadError(`Maximum ${MAX_IMAGES} images per block.`);
        break;
      }

      setUploadingCount((n) => n + 1);
      try {
        const entry = await uploadOne(file);
        setImages((prev) => [...prev, entry]);
        markDirty();
      } catch (err) {
        console.error("Upload failed:", err);
        setUploadError(err?.message ? `Upload failed: ${err.message}` : "Upload failed.");
      } finally {
        setUploadingCount((n) => n - 1);
      }
    }
  };

  const removeImage = async (index) => {
    if (readOnly) return;
    const img = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    markDirty();
    if (img?.storagePath) {
      try {
        await deleteObject(storageRef(storage, img.storagePath));
      } catch (err) {
        console.warn("Could not delete from Storage (image already removed?):", err?.message);
      }
    }
  };

  const imgSrc = (img) => img?.url || img?.dataUrl || "";

  return (
    <div className="evidence-upload-block">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>{block.icon || "📷"}</span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>
            {block.title || "Upload Evidence"}
          </div>
          {block.instructions && (
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(block.instructions) }} />
          )}
        </div>
      </div>

      {/* Image grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 14 }}>
        {images.map((img, i) => (
          <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface2)" }}>
            <img src={imgSrc(img)} alt={img.name || "Evidence"} style={{ width: "100%", height: 140, objectFit: "cover", cursor: "pointer" }} onClick={() => window.open(imgSrc(img), "_blank")} />
            {!readOnly && (
              <button
                onClick={() => removeImage(i)}
                style={{
                  position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)", border: "none", color: "white", fontSize: 12,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            )}
          </div>
        ))}

        {/* Uploading placeholders */}
        {Array.from({ length: uploadingCount }).map((_, i) => (
          <div key={`up-${i}`} style={{
            height: 140, borderRadius: 10, border: "2px dashed var(--amber)",
            background: "var(--surface2)", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 6,
            color: "var(--amber)", fontSize: 12, fontWeight: 600,
          }}>
            <div style={{
              width: 22, height: 22, border: "2px solid var(--amber)",
              borderTopColor: "transparent", borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            Uploading…
          </div>
        ))}

        {/* Upload button */}
        {!readOnly && images.length + uploadingCount < MAX_IMAGES && (
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

      {uploadError && (
        <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "8px 12px", borderRadius: 6, fontSize: 12, marginBottom: 10 }}>
          {uploadError}
        </div>
      )}

      {/* Reflection */}
      {block.reflectionPrompt && (
        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(block.reflectionPrompt) }} />
          <textarea
            className="sa-input"
            rows={3}
            value={reflection}
            onChange={(e) => { if (readOnly) return; setReflection(e.target.value); markDirty(); }}
            onBlur={readOnly ? undefined : saveNow}
            placeholder="Write your reflection..."
            readOnly={readOnly}
          />
        </div>
      )}

      {!readOnly && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={!reflection.trim() && images.length === 0}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: submitted ? "var(--green, #22c55e)" : "var(--accent, #6366f1)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: (reflection.trim() || images.length > 0) ? "pointer" : "not-allowed",
              opacity: (reflection.trim() || images.length > 0) ? 1 : 0.5,
              transition: "all 0.15s",
            }}
          >
            {submitted ? "Submitted" : "Submit Response"}
          </button>
          {lastSaved && (
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              Saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
