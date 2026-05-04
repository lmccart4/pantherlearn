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
import "./EvidenceUploadBlock.css";

const MAX_BYTES = 10 * 1024 * 1024;
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
    e.target.value = "";
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
      <div className="ev-header">
        <span className="ev-icon" aria-hidden>{block.icon || "📷"}</span>
        <div>
          <div className="ev-title">{block.title || "Upload Evidence"}</div>
          {block.instructions && (
            <div className="ev-instructions" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.instructions) }} />
          )}
        </div>
      </div>

      <div className="ev-grid">
        {images.map((img, i) => (
          <div key={i} className="ev-thumb">
            <img src={imgSrc(img)} alt={img.name || "Evidence"} onClick={() => window.open(imgSrc(img), "_blank")} />
            {!readOnly && (
              <button className="ev-thumb-remove" onClick={() => removeImage(i)}>✕</button>
            )}
          </div>
        ))}

        {Array.from({ length: uploadingCount }).map((_, i) => (
          <div key={`up-${i}`} className="ev-uploading">
            <div className="ev-spinner" />
            Uploading…
          </div>
        ))}

        {!readOnly && images.length + uploadingCount < MAX_IMAGES && (
          <label className="ev-add">
            <span className="ev-add-icon" aria-hidden>📷</span>
            <span>Add Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} multiple />
          </label>
        )}
      </div>

      {uploadError && <div className="ev-upload-error">{uploadError}</div>}

      {block.reflectionPrompt && (
        <div className="ev-reflection-wrap">
          <label className="ev-reflection-label" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.reflectionPrompt) }} />
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
        <div className="ev-actions">
          <button
            className={`ev-submit ${submitted ? "is-submitted" : ""}`}
            onClick={handleSubmit}
            disabled={!reflection.trim() && images.length === 0}
          >
            {submitted ? "Submitted" : "Submit Response"}
          </button>
          {lastSaved && (
            <span className="ev-saved">
              Saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
