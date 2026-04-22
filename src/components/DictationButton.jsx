// src/components/DictationButton.jsx
// Browser-native dictation via Web Speech API. No network, no API cost.
// Works in Chrome/Edge (incl. Chromebooks). Hidden on unsupported browsers.
import { useState, useEffect, useRef } from "react";

// Spoken punctuation → symbol. Case-insensitive, whole-word match.
const PUNCT_RULES = [
  [/\s*\b(period|full stop)\b\s*/gi, ". "],
  [/\s*\bcomma\b\s*/gi, ", "],
  [/\s*\b(question mark)\b\s*/gi, "? "],
  [/\s*\b(exclamation (point|mark))\b\s*/gi, "! "],
  [/\s*\b(colon)\b\s*/gi, ": "],
  [/\s*\b(semicolon|semi colon)\b\s*/gi, "; "],
  [/\s*\b(dash|hyphen)\b\s*/gi, " - "],
  [/\s*\b(open paren|open parenthesis)\b\s*/gi, " ("],
  [/\s*\b(close paren|close parenthesis)\b\s*/gi, ") "],
  [/\s*\b(open quote|quote)\b\s*/gi, " \""],
  [/\s*\b(close quote|end quote|unquote)\b\s*/gi, "\" "],
  [/\s*\b(new paragraph)\b\s*/gi, "\n\n"],
  [/\s*\b(new line|next line)\b\s*/gi, "\n"],
];

function applyPunctuation(text) {
  let out = text;
  for (const [pattern, replacement] of PUNCT_RULES) out = out.replace(pattern, replacement);
  // Capitalize after sentence enders
  out = out.replace(/([.!?]\s+|\n+)(\p{Ll})/gu, (_, p, c) => p + c.toUpperCase());
  // Capitalize very first letter
  out = out.replace(/^(\s*)(\p{Ll})/u, (_, s, c) => s + c.toUpperCase());
  // Collapse repeated spaces
  return out.replace(/ {2,}/g, " ").replace(/\s+([.,!?;:])/g, "$1");
}

export default function DictationButton({ getValue, setValue, lang = "en-US", disabled = false }) {
  const SR = typeof window !== "undefined"
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const baseRef = useRef("");
  const finalRef = useRef("");

  useEffect(() => () => {
    try { recognitionRef.current?.stop(); } catch {}
  }, []);

  if (!SR) return null;

  const start = () => {
    setError("");
    baseRef.current = getValue() || "";
    finalRef.current = "";

    const rec = new SR();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalRef.current += chunk;
        else interim += chunk;
      }
      const spoken = applyPunctuation(finalRef.current + interim);
      const pieces = [baseRef.current, spoken].filter(s => s && s.trim());
      setValue(pieces.join(" ").replace(/ {2,}/g, " ").trimStart());
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      const map = {
        "not-allowed": "Mic blocked — allow mic in site settings",
        "service-not-allowed": "Mic blocked by browser/OS",
        "network": "Network blocked (school filter?)",
        "audio-capture": "No mic detected",
        "language-not-supported": "Language not supported",
      };
      setError(map[e.error] || `Error: ${e.error || "unknown"}`);
      console.warn("[Dictation]", e.error, e);
      setListening(false);
    };
    rec.onend = () => setListening(false);

    try {
      rec.start();
      recognitionRef.current = rec;
      setListening(true);
    } catch {
      setError("Could not start mic");
    }
  };

  const stop = () => {
    try { recognitionRef.current?.stop(); } catch {}
    setListening(false);
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button
        type="button"
        onClick={listening ? stop : start}
        disabled={disabled}
        aria-label={listening ? "Stop dictation" : "Start dictation"}
        title={listening ? "Stop dictation" : "Dictate your answer"}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
          border: "1px solid var(--border)",
          background: listening ? "rgba(239,68,68,0.12)" : "var(--surface2)",
          color: listening ? "#ef4444" : "var(--text2)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <span style={{ fontSize: 14 }}>{listening ? "⏺" : "🎤"}</span>
        {listening ? "Listening…" : "Dictate"}
      </button>
      {error && <span style={{ fontSize: 11, color: "var(--amber)" }}>{error}</span>}
    </div>
  );
}
