// src/components/blocks/StoryboardSubmitBlock.jsx
// Mutually-exclusive submission for a storyboard: either a photo (paper/whiteboard)
// or a link (Google Slides / Canva). Student picks one mode, can undo back to picker.
// Single Firestore submission, single score, single weight.

import { useState, useEffect, useRef } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, storage } from "../../lib/firebase";
import { renderMarkdown } from "../../lib/utils";
import "./StoryboardSubmitBlock.css";

const MAX_BYTES = 10 * 1024 * 1024;

function extractPresentationInfo(url) {
  if (!url) return null;
  const slidesMatch = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slidesMatch) return { type: "google", id: slidesMatch[1] };
  const canvaDesignMatch = url.match(/canva\.com\/design\/([a-zA-Z0-9_-]+)/);
  if (canvaDesignMatch) return { type: "canva", designId: canvaDesignMatch[1], rawUrl: url };
  if (/canva\.link/i.test(url)) return { type: "canva-short", rawUrl: url };
  if (/canva/i.test(url)) return { type: "canva", rawUrl: url };
  return null;
}

export default function StoryboardSubmitBlock({
  block,
  studentData = {},
  onAnswer,
  courseId,
  lessonId,
  readOnly = false,
}) {
  const saved = (studentData && studentData[block.id]) || {};
  const [mode, setMode] = useState(saved.mode || null);
  const [image, setImage] = useState(saved.image || null);
  const [linkUrl, setLinkUrl] = useState(saved.response || "");
  const [submitted, setSubmitted] = useState(!!saved.submitted);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    const d = studentData?.[block.id];
    if (!d) return;
    if (hydrated.current) return;
    hydrated.current = true;
    if (d.mode) setMode(d.mode);
    if (d.image) setImage(d.image);
    if (d.response) setLinkUrl(d.response);
    if (d.submitted) setSubmitted(true);
  }, [studentData, block.id]);

  const promptText =
    block.prompt ||
    "Submit your storyboard. Pick the option that matches how you built it.";

  // Reset back to picker — undo from a submitted state OR from a chosen-but-not-submitted state.
  const handleUndo = async () => {
    if (readOnly) return;
    // If a photo was uploaded, delete it from Storage
    if (image?.storagePath) {
      try {
        await deleteObject(storageRef(storage, image.storagePath));
      } catch (err) {
        console.warn("Could not delete storyboard photo (already removed?):", err?.message);
      }
    }
    setMode(null);
    setImage(null);
    setLinkUrl("");
    setSubmitted(false);
    setError("");
    try {
      await onAnswer(block.id, {
        mode: null,
        submitted: false,
        response: "",
        image: null,
        writtenScore: 0,
        savedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Storyboard undo save failed:", err);
    }
  };

  const uploadPhoto = async (file) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not signed in");
    if (!courseId || !lessonId || !block.id) throw new Error("Missing lesson context");
    if (!file.type.startsWith("image/")) throw new Error("Only image files (JPG, PNG, HEIC) are accepted.");
    if (file.size > MAX_BYTES) throw new Error(`Photo too large (max 10MB).`);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    const path = `uploads/${courseId}/${lessonId}/${block.id}/${uid}/${filename}`;
    const ref = storageRef(storage, path);
    await uploadBytes(ref, file, { contentType: file.type });
    const url = await getDownloadURL(ref);
    return { url, storagePath: path, name: file.name, uploadedAt: new Date().toISOString() };
  };

  const handleFileChange = async (e) => {
    if (readOnly) return;
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const file = files[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const entry = await uploadPhoto(file);
      setImage(entry);
      await onAnswer(block.id, {
        mode: "photo",
        image: entry,
        submitted: true,
        response: entry.url,
        correct: true,
        writtenScore: 1,
        writtenLabel: "Submitted",
        gradedBy: "auto",
        savedAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Storyboard photo upload failed:", err);
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submitLink = async () => {
    if (readOnly) return;
    const trimmed = linkUrl.trim();
    if (!trimmed) { setError("Paste your storyboard link first."); return; }
    if (!extractPresentationInfo(trimmed)) {
      setError("Paste a Google Slides or Canva share link (docs.google.com/presentation/d/... or canva.com/design/...).");
      return;
    }
    setError("");
    try {
      await onAnswer(block.id, {
        mode: "link",
        response: trimmed,
        submitted: true,
        correct: true,
        writtenScore: 1,
        writtenLabel: "Submitted",
        gradedBy: "auto",
        savedAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Storyboard link save failed:", err);
      setError("Failed to save — check your connection and try again.");
    }
  };

  const presInfo = mode === "link" && submitted ? extractPresentationInfo(linkUrl) : null;

  return (
    <div className="storyboard-submit">
      <div
        className="sb-prompt"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(promptText) }}
      />

      {/* MODE PICKER — shown when no mode selected and not submitted */}
      {!mode && !submitted && (
        <div className="sb-picker">
          <button
            className="sb-picker-btn"
            onClick={() => { if (!readOnly) { setMode("photo"); setError(""); } }}
            disabled={readOnly}
          >
            <span className="sb-picker-icon">📷</span>
            <span className="sb-picker-label">Upload Photo</span>
            <span className="sb-picker-sub">Paper or whiteboard storyboard</span>
          </button>
          <button
            className="sb-picker-btn"
            onClick={() => { if (!readOnly) { setMode("link"); setError(""); } }}
            disabled={readOnly}
          >
            <span className="sb-picker-icon">🔗</span>
            <span className="sb-picker-label">Submit Link</span>
            <span className="sb-picker-sub">Google Slides or Canva</span>
          </button>
        </div>
      )}

      {/* PHOTO MODE */}
      {mode === "photo" && !submitted && (
        <div className="sb-mode-wrap">
          <div className="sb-mode-header">
            <span className="sb-mode-title">📷 Photo Upload</span>
            <button className="sb-switch-btn" onClick={handleUndo} disabled={readOnly || uploading}>
              ← Switch to link instead
            </button>
          </div>
          <p className="sb-mode-instructions">
            Take a clear photo of your paper or whiteboard storyboard and upload it. JPG, PNG, or HEIC. Max 10MB.
          </p>
          <label className={`sb-upload-tile ${uploading ? "is-uploading" : ""}`}>
            {uploading ? (
              <>
                <div className="sb-spinner" />
                <span>Uploading…</span>
              </>
            ) : (
              <>
                <span className="sb-upload-icon">📷</span>
                <span>Tap to upload photo</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={readOnly || uploading}
              style={{ display: "none" }}
            />
          </label>
          {error && <div className="sb-error">{error}</div>}
        </div>
      )}

      {/* LINK MODE */}
      {mode === "link" && !submitted && (
        <div className="sb-mode-wrap">
          <div className="sb-mode-header">
            <span className="sb-mode-title">🔗 Link Submission</span>
            <button className="sb-switch-btn" onClick={handleUndo} disabled={readOnly}>
              ← Switch to photo upload instead
            </button>
          </div>
          <p className="sb-mode-instructions">
            Paste the share link to your Google Slides or Canva storyboard. Make sure sharing is set to "anyone with the link can view."
          </p>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => { setLinkUrl(e.target.value); setError(""); }}
            placeholder="https://docs.google.com/presentation/d/... or https://canva.com/design/..."
            className={`sb-link-input ${error ? "has-error" : ""}`}
            onKeyDown={(e) => e.key === "Enter" && submitLink()}
            disabled={readOnly}
          />
          {error && <div className="sb-error">{error}</div>}
          <button className="sb-submit-btn" onClick={submitLink} disabled={readOnly}>
            Submit Link
          </button>
        </div>
      )}

      {/* SUBMITTED STATE */}
      {submitted && (
        <div className="sb-done">
          <div className="sb-done-header">
            <span className="sb-check">✓ Submitted</span>
            <span className="sb-done-mode">{mode === "photo" ? "Photo upload" : "Link submission"}</span>
            {!readOnly && (
              <button className="sb-undo-btn" onClick={handleUndo}>
                Undo / change
              </button>
            )}
          </div>
          {mode === "photo" && image && (
            <div className="sb-photo-preview">
              <img
                src={image.url}
                alt="Storyboard"
                onClick={() => window.open(image.url, "_blank")}
              />
            </div>
          )}
          {mode === "link" && (
            <div className="sb-link-preview">
              <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                {linkUrl.length > 70 ? linkUrl.slice(0, 70) + "…" : linkUrl}
              </a>
              {presInfo && (
                <div className="sb-link-frame">
                  {presInfo.type === "google" ? (
                    <iframe
                      src={`https://docs.google.com/presentation/d/${presInfo.id}/embed?start=false&loop=false&delayms=3000`}
                      width="100%"
                      height="100%"
                      allowFullScreen
                      title="Storyboard"
                    />
                  ) : presInfo.type === "canva" && presInfo.designId ? (
                    <iframe
                      src={`https://www.canva.com/design/${presInfo.designId}/view?embed`}
                      width="100%"
                      height="100%"
                      allowFullScreen
                      allow="fullscreen"
                      title="Storyboard (Canva)"
                    />
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
