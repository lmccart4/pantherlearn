// src/components/chatbot-workshop/RatingModal.jsx
// Star-rating modal shown after testing a classmate's bot.

import { useState } from "react";

function StarRow({ label, value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <span style={{ width: 120, fontSize: 13, fontWeight: 600, color: "var(--text3)" }}>{label}</span>
      <div style={{ display: "flex", gap: 4 }} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 24, padding: 2,
              color: star <= (hover || value) ? "var(--amber)" : "var(--text3)",
              opacity: star <= (hover || value) ? 1 : 0.3,
              transition: "all 0.15s",
              transform: star <= (hover || value) ? "scale(1.15)" : "scale(1)",
            }}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RatingModal({ botName, onSubmit, onClose }) {
  const [understanding, setUnderstanding] = useState(0);
  const [helpfulness, setHelpfulness] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!understanding || !helpfulness) return;
    setSubmitting(true);
    try {
      await onSubmit({ understanding, helpfulness, comment });
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
    setSubmitting(false);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: "var(--surface)", borderRadius: 16, padding: 32, maxWidth: 440, width: "90%",
        border: "1px solid var(--border, rgba(255,255,255,0.08))",
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          Rate {botName || "this bot"}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24 }}>
          How well did the bot do? Your feedback helps the creator improve!
        </p>

        <StarRow label="Understanding" value={understanding} onChange={setUnderstanding} />
        <StarRow label="Helpfulness" value={helpfulness} onChange={setHelpfulness} />

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Any feedback for the bot creator? (optional)"
          rows={3}
          style={{
            width: "100%", background: "var(--bg)", border: "1px solid var(--border, rgba(255,255,255,0.1))",
            borderRadius: 10, padding: 12, fontSize: 13, color: "var(--text)",
            fontFamily: "var(--font-body, inherit)", resize: "vertical", marginBottom: 20,
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "none", border: "1px solid var(--border, rgba(255,255,255,0.12))",
              color: "var(--text3)", cursor: "pointer",
            }}
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={!understanding || !helpfulness || submitting}
            style={{
              padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: (!understanding || !helpfulness) ? "var(--text3)" : "var(--amber)",
              color: "white", border: "none", cursor: (!understanding || !helpfulness) ? "default" : "pointer",
              opacity: (!understanding || !helpfulness) ? 0.3 : 1, transition: "all 0.15s",
            }}
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}
