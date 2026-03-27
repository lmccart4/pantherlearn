// src/components/blocks/SlideSubmitBlock.jsx
// Block that accepts a Google Slides URL, saves it, and renders the slides as an embed.
import { useState, useEffect } from "react";
import { renderMarkdown } from "../../lib/utils";

function extractPresentationInfo(url) {
  if (!url) return null;
  // Google Slides: docs.google.com/presentation/d/{ID}/...
  const slidesMatch = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slidesMatch) return { type: "google", id: slidesMatch[1] };
  // Canva: accept any URL containing "canva" — embed the raw URL
  if (/canva/i.test(url)) return { type: "canva", rawUrl: url };
  return null;
}

export default function SlideSubmitBlock({ block, studentData = {}, onAnswer }) {
  const data = (studentData && studentData[block.id]) || {};
  const [url, setUrl] = useState(data.response || "");
  const [submitted, setSubmitted] = useState(data.submitted || false);
  const [error, setError] = useState("");

  // Sync from Firestore when data arrives
  useEffect(() => {
    const d = (studentData && studentData[block.id]) || {};
    if (d.submitted) {
      setSubmitted(true);
      if (d.response) setUrl(d.response);
    }
  }, [studentData, block.id]);

  const presInfo = extractPresentationInfo(url);

  const submit = () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Paste your presentation link first."); return; }
    if (!extractPresentationInfo(trimmed)) {
      setError("Paste your Google Slides or Canva share link. It should look like: docs.google.com/presentation/d/... or canva.com/design/...");
      return;
    }
    setError("");
    setSubmitted(true);
    onAnswer(block.id, {
      submitted: true,
      response: trimmed,
      correct: true,
      writtenScore: 1,
      writtenLabel: "Submitted",
      gradedBy: "auto",
    });
  };

  const promptText = block.prompt || "Paste your Google Slides link below.";

  return (
    <div style={{
      background: "var(--surface, #1a1f2e)",
      border: "1px solid var(--border, #2a2f3d)",
      borderRadius: 12,
      padding: "1.25rem",
      marginBottom: "1rem",
    }}>
      {/* Prompt */}
      <div
        style={{ fontSize: "0.95rem", color: "var(--text, #e0e0e0)", marginBottom: 12, lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(promptText) }}
      />

      {/* Input or locked state */}
      {!submitted ? (
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            placeholder="Google Slides or Canva link..."
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${error ? "#ef4444" : "var(--border, #2a2f3d)"}`,
              background: "var(--bg, #0d1117)",
              color: "var(--text, #e0e0e0)",
              fontSize: "0.9rem",
              outline: "none",
              marginBottom: 8,
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          {error && (
            <div style={{ fontSize: "0.8rem", color: "#ef4444", marginBottom: 8 }}>{error}</div>
          )}
          <button
            onClick={submit}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "var(--accent, #02C39A)",
              color: "#0d1117",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Submit Link
          </button>
        </div>
      ) : (
        <div style={{
          fontSize: "0.85rem", color: "var(--text3, #888)",
          display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
        }}>
          <span style={{ color: "#10b981", fontWeight: 700 }}>✓ Submitted</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent, #02C39A)", textDecoration: "none", wordBreak: "break-all" }}
          >
            {url.length > 60 ? url.slice(0, 60) + "…" : url}
          </a>
        </div>
      )}

      {/* Embedded slides preview */}
      {presInfo && submitted && (
        <div style={{
          marginTop: 12,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid var(--border, #2a2f3d)",
          aspectRatio: "16/9",
        }}>
          {presInfo.type === "google" ? (
            <iframe
              src={`https://docs.google.com/presentation/d/${presInfo.id}/embed?start=false&loop=false&delayms=3000`}
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }}
              allowFullScreen
              title="Student Presentation"
            />
          ) : (
            <iframe
              src={presInfo.rawUrl + (presInfo.rawUrl.includes('?') ? '&embed' : '?embed')}
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }}
              allowFullScreen
              allow="fullscreen"
              title="Student Presentation (Canva)"
            />
          )}
        </div>
      )}
    </div>
  );
}
