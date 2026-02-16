// src/components/JoinCourse.jsx
// Modal for students to enter an enroll code and join a course.

import { useState } from "react";
import { enrollWithCode } from "../lib/enrollment";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function JoinCourse({ user, onEnrolled, onClose }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Translate UI strings
  const uiStrings = useTranslatedTexts([
    "Join a Course",                         // 0
    "Enter the enroll code from your teacher", // 1
    "Cancel",                                // 2
    "Joining...",                             // 3
    "Join Course",                           // 4
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const course = await enrollWithCode(user.uid, user.email, code.trim());
      setSuccess(`Enrolled in ${course.title}!`);
      setTimeout(() => {
        onEnrolled?.(course);
        onClose?.();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={{ fontSize: 28 }}>🔑</span>
          <h2 style={styles.title} data-translatable>{ui(0, "Join a Course")}</h2>
          <p style={styles.subtitle} data-translatable>{ui(1, "Enter the enroll code from your teacher")}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              // Auto-format: uppercase, add dash after 4 chars
              let v = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
              if (v.length === 4 && !v.includes("-") && code.length < 4) v += "-";
              if (v.length > 9) v = v.slice(0, 9);
              setCode(v);
              setError(null);
            }}
            placeholder="XXXX-XXXX"
            maxLength={9}
            style={styles.input}
            autoFocus
            disabled={loading}
          />

          {error && (
            <div style={styles.error}>
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div style={styles.success}>
              <span>✅</span> {success}
            </div>
          )}

          <div style={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
              disabled={loading}
              data-translatable
            >
              {ui(2, "Cancel")}
            </button>
            <button
              type="submit"
              disabled={loading || code.replace("-", "").length < 8}
              className="btn btn-primary"
              style={{ opacity: loading || code.replace("-", "").length < 8 ? 0.5 : 1 }}
              data-translatable
            >
              {loading ? ui(3, "Joining...") : ui(4, "Join Course")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "var(--surface1)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    color: "var(--text3)",
    fontSize: 14,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 24,
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    letterSpacing: 4,
    textAlign: "center",
    background: "var(--surface2)",
    border: "2px solid var(--border)",
    borderRadius: 10,
    color: "var(--text1)",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  error: {
    background: "rgba(231,76,60,0.1)",
    border: "1px solid rgba(231,76,60,0.3)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#e74c3c",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  success: {
    background: "rgba(46,204,113,0.1)",
    border: "1px solid rgba(46,204,113,0.3)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#2ecc71",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  buttons: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 8,
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text2)",
    cursor: "pointer",
    fontSize: 14,
  },
};
