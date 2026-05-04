// src/components/blocks/SlideSubmitBlock.jsx
// Block that accepts a Google Slides URL, saves it, and renders the slides as an embed.
import { useState, useEffect } from "react";
import { renderMarkdown } from "../../lib/utils";
import "./SlideSubmitBlock.css";

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

export default function SlideSubmitBlock({ block, studentData = {}, onAnswer }) {
  const data = (studentData && studentData[block.id]) || {};
  const [url, setUrl] = useState(data.response || "");
  const [submitted, setSubmitted] = useState(data.submitted || false);
  const [error, setError] = useState("");

  useEffect(() => {
    const d = (studentData && studentData[block.id]) || {};
    if (d.submitted) {
      setSubmitted(true);
      if (d.response) setUrl(d.response);
    }
  }, [studentData, block.id]);

  const presInfo = extractPresentationInfo(url);

  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Paste your presentation link first."); return; }
    if (!extractPresentationInfo(trimmed)) {
      setError("Paste your Google Slides or Canva share link. It should look like: docs.google.com/presentation/d/... or canva.com/design/... (use the full share link from Canva, not a canva.link short link)");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onAnswer(block.id, {
        submitted: true,
        response: trimmed,
        correct: true,
        writtenScore: 1,
        writtenLabel: "Submitted",
        gradedBy: "auto",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("SlideSubmit save failed:", err);
      setError("Failed to save — check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const promptText = block.prompt || "Paste your Google Slides link below.";

  return (
    <div className="slide-submit">
      <div
        className="slide-submit-prompt"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(promptText) }}
      />

      {!submitted ? (
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            placeholder="Google Slides or Canva link..."
            className={`slide-submit-input ${error ? "has-error" : ""}`}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          {error && <div className="slide-submit-error">{error}</div>}
          <button
            onClick={submit}
            disabled={saving}
            className="slide-submit-btn"
            data-saving={saving ? "true" : "false"}
          >
            {saving ? "Saving..." : "Submit Link"}
          </button>
        </div>
      ) : (
        <div className="slide-submit-done">
          <span className="slide-submit-check">✓ Submitted</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="slide-submit-link"
          >
            {url.length > 60 ? url.slice(0, 60) + "…" : url}
          </a>
        </div>
      )}

      {presInfo && submitted && (
        <div className="slide-submit-frame">
          {presInfo.type === "google" ? (
            <iframe
              src={`https://docs.google.com/presentation/d/${presInfo.id}/embed?start=false&loop=false&delayms=3000`}
              width="100%"
              height="100%"
              allowFullScreen
              title="Student Presentation"
            />
          ) : presInfo.type === "canva" && presInfo.designId ? (
            <iframe
              src={`https://www.canva.com/design/${presInfo.designId}/view?embed`}
              width="100%"
              height="100%"
              allowFullScreen
              allow="fullscreen"
              title="Student Presentation (Canva)"
            />
          ) : presInfo.type === "canva-short" ? (
            <div className="slide-submit-canva-fallback">
              <p>Canva short links can't be previewed inline. Use the full Canva share link (canva.com/design/...) for inline preview, or open this link directly:</p>
              <a href={presInfo.rawUrl} target="_blank" rel="noopener noreferrer">Open in Canva</a>
            </div>
          ) : (
            <iframe
              src={presInfo.rawUrl + (presInfo.rawUrl.includes('?') ? '&embed' : '?embed')}
              width="100%"
              height="100%"
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
