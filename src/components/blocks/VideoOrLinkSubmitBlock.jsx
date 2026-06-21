// VideoOrLinkSubmitBlock — student picks ONE: upload a video file OR paste a share link.
// Used for video project submissions where the student may have rendered to phone (link)
// or to their Chromebook (upload).
//
// Block shape:
//   { type: "video_or_link_submit", id, title, prompt, accept?, maxMB? }
//
// Firestore answer shape (one of):
//   { mode: "upload", videoUrl, storagePath, fileName, fileSize, submitted, submittedAt }
//   { mode: "link",   videoLink, submitted, submittedAt }

import { useEffect, useRef, useState } from "react";
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, storage } from "../../lib/firebase";
import { renderMarkdown } from "../../lib/utils";

const DEFAULT_MAX_MB = 200;
const DEFAULT_ACCEPT = "video/*";

function isValidUrl(v) {
  if (!v) return false;
  try {
    const u = new URL(v.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

export default function VideoOrLinkSubmitBlock({ block, studentData = {}, onAnswer, courseId, lessonId, readOnly = false }) {
  const data = (studentData && studentData[block.id]) || {};
  const maxMB = block.maxMB || DEFAULT_MAX_MB;
  const accept = block.accept || DEFAULT_ACCEPT;

  const [mode, setMode] = useState(data.mode || "upload"); // "upload" | "link"
  const [videoLink, setVideoLink] = useState(data.videoLink || "");
  const [uploaded, setUploaded] = useState(
    data.videoUrl ? { url: data.videoUrl, storagePath: data.storagePath, name: data.fileName, size: data.fileSize } : null
  );
  const [submitted, setSubmitted] = useState(!!data.submitted);
  const [uploadProgress, setUploadProgress] = useState(null); // 0-100 | null
  const [uploadError, setUploadError] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = studentData?.[block.id];
    if (!saved) return;
    if (hydrated.current) return;
    hydrated.current = true;
    if (saved.mode) setMode(saved.mode);
    if (saved.videoLink !== undefined) setVideoLink(saved.videoLink);
    if (saved.videoUrl) setUploaded({ url: saved.videoUrl, storagePath: saved.storagePath, name: saved.fileName, size: saved.fileSize });
    setSubmitted(!!saved.submitted);
  }, [studentData, block.id]);

  const persist = (next) => {
    if (readOnly) return;
    onAnswer(block.id, { ...next, savedAt: new Date().toISOString() });
  };

  const onFile = async (e) => {
    if (readOnly) return;
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError("");

    if (!file.type.startsWith("video/")) {
      setUploadError("Please choose a video file (.mp4 recommended).");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setUploadError(`File is too large. Max ${maxMB} MB. Try compressing or use a Drive link instead.`);
      return;
    }
    const uid = auth.currentUser?.uid;
    if (!uid) { setUploadError("Not signed in."); return; }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    const path = `uploads/${courseId}/${lessonId}/${block.id}/${uid}/${filename}`;
    const ref = storageRef(storage, path);
    const task = uploadBytesResumable(ref, file, { contentType: file.type });
    setUploadProgress(0);

    task.on(
      "state_changed",
      (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => {
        console.error("upload error", err);
        setUploadError("Upload failed. Try again or use a Drive link.");
        setUploadProgress(null);
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          const next = { url, storagePath: path, name: file.name, size: file.size };
          setUploaded(next);
          setUploadProgress(null);
          persist({
            mode: "upload",
            videoUrl: url, storagePath: path,
            fileName: file.name, fileSize: file.size,
            submitted: false,
          });
        } catch (e) {
          setUploadError("Could not finalize upload.");
          setUploadProgress(null);
        }
      }
    );
  };

  const removeUpload = async () => {
    if (readOnly || !uploaded?.storagePath) return;
    try { await deleteObject(storageRef(storage, uploaded.storagePath)); } catch {}
    setUploaded(null);
    persist({ mode: "upload", videoUrl: null, storagePath: null, fileName: null, fileSize: null, submitted: false });
  };

  const onLinkChange = (v) => {
    setVideoLink(v);
    if (!readOnly) persist({ mode: "link", videoLink: v, submitted: false });
  };

  const canSubmit = (mode === "upload" && !!uploaded?.url) || (mode === "link" && isValidUrl(videoLink));

  const handleSubmit = () => {
    if (readOnly || !canSubmit) return;
    const ts = new Date().toISOString();
    if (mode === "upload") {
      onAnswer(block.id, {
        mode: "upload",
        videoUrl: uploaded.url, storagePath: uploaded.storagePath,
        fileName: uploaded.name, fileSize: uploaded.size,
        submitted: true, submittedAt: ts, savedAt: ts,
        writtenScore: 1,
      });
    } else {
      onAnswer(block.id, {
        mode: "link",
        videoLink: videoLink.trim(),
        submitted: true, submittedAt: ts, savedAt: ts,
        writtenScore: 1,
      });
    }
    setSubmitted(true);
  };

  const unsubmit = () => {
    if (readOnly) return;
    onAnswer(block.id, { submitted: false, savedAt: new Date().toISOString() });
    setSubmitted(false);
  };

  // ── render ──────────────────────────────────────────────────────────────
  const sectionColor = mode === "upload" ? "#06b6d4" : "#a855f7";

  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: 14, padding: 20,
      background: "var(--surface)",
    }}>
      {block.title && (
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{block.title}</div>
      )}
      {block.prompt && (
        <div
          style={{ fontSize: 14, color: "var(--text2)", marginBottom: 14, lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(block.prompt) }}
        />
      )}

      {/* Mode toggle */}
      <div role="tablist" style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 10, padding: 3, marginBottom: 14, background: "var(--surface2)" }}>
        {[
          { id: "upload", label: "📤 Upload video file" },
          { id: "link",   label: "🔗 Paste a link" },
        ].map((opt) => {
          const on = mode === opt.id;
          return (
            <button
              key={opt.id}
              role="tab"
              aria-selected={on}
              disabled={readOnly || submitted}
              onClick={() => setMode(opt.id)}
              style={{
                padding: "8px 14px", borderRadius: 7, border: 0, cursor: readOnly || submitted ? "not-allowed" : "pointer",
                fontSize: 13, fontWeight: 600,
                background: on ? (opt.id === "upload" ? "#06b6d4" : "#a855f7") : "transparent",
                color: on ? "#fff" : "var(--text2)",
                transition: "background 200ms ease, color 200ms ease",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* UPLOAD MODE */}
      {mode === "upload" && (
        <div>
          {!uploaded && uploadProgress === null && (
            <label style={{
              display: "block", border: "2px dashed var(--border)", borderRadius: 12,
              padding: 24, textAlign: "center", cursor: readOnly ? "not-allowed" : "pointer",
              background: "var(--surface2)",
            }}>
              <input type="file" accept={accept} onChange={onFile} disabled={readOnly} style={{ display: "none" }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                Choose a video file
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>
                .mp4 recommended · vertical 1080×1920 · up to {maxMB} MB
              </div>
            </label>
          )}

          {uploadProgress !== null && (
            <div style={{ padding: "12px 16px", background: "var(--surface2)", borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>Uploading… {uploadProgress}%</div>
              <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${uploadProgress}%`, height: "100%", background: "#06b6d4", transition: "width 160ms ease" }} />
              </div>
            </div>
          )}

          {uploaded && uploadProgress === null && (
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12, background: "var(--surface2)" }}>
              <video src={uploaded.url} controls playsInline style={{ width: "100%", maxHeight: 360, background: "#000", borderRadius: 8 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, gap: 12 }}>
                <div style={{ fontSize: 12, color: "var(--text3)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  ✓ {uploaded.name}
                </div>
                {!submitted && !readOnly && (
                  <button onClick={removeUpload}
                    style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text3)", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LINK MODE */}
      {mode === "link" && (
        <div>
          <input
            type="url"
            value={videoLink}
            onChange={(e) => onLinkChange(e.target.value)}
            disabled={readOnly || submitted}
            placeholder="https://drive.google.com/... or https://youtu.be/..."
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--surface2)",
              color: "var(--text)", fontSize: 14, fontFamily: "inherit",
              outline: "none",
            }}
          />
          {videoLink && !isValidUrl(videoLink) && (
            <div style={{ fontSize: 12, color: "#f97316", marginTop: 8 }}>
              That doesn't look like a valid URL. Should start with https://
            </div>
          )}
          {isValidUrl(videoLink) && (
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>
              Make sure sharing is set to <strong>anyone with the link</strong> so Mr. McCarthy can open it.
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#ef4444" }}>{uploadError}</div>
      )}

      {/* Submit row */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginTop: 16 }}>
        {submitted ? (
          <>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>✓ Submitted</span>
            {!readOnly && (
              <button onClick={unsubmit}
                style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text3)", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>
                Unsubmit
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || readOnly}
            style={{
              background: canSubmit ? sectionColor : "var(--surface2)",
              border: 0, borderRadius: 10, padding: "10px 18px",
              fontSize: 14, fontWeight: 700,
              color: canSubmit ? "#fff" : "var(--text3)",
              cursor: canSubmit && !readOnly ? "pointer" : "not-allowed",
              transition: "background 200ms ease",
            }}
          >
            Submit Final Video
          </button>
        )}
      </div>
    </div>
  );
}
