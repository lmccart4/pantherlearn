// src/components/BugReporter.jsx
// Floating bug report / feature request / feedback widget.
// Available on all pages for authenticated users.
// Submits to Cloud Function → Google Apps Script → Google Sheet,
// with Firestore backup.

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const SUBMIT_URL =
  import.meta.env.VITE_SUBMIT_FEEDBACK_URL ||
  "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/submitFeedback";

const REPORT_TYPES = [
  { value: "bug", label: "Report a Bug", icon: "🐛" },
  { value: "feature", label: "Suggest a Feature", icon: "💡" },
  { value: "feedback", label: "Offer Feedback", icon: "💬" },
];

export default function BugReporter() {
  const { user, userRole, getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("bug");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  // Reset form when panel closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setType("bug");
        setDescription("");
        setStatus("idle");
        setErrorMsg("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!description.trim() || status === "sending") return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const authToken = await getToken();
      const response = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          type,
          description: description.trim(),
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed");
      setStatus("success");
    } catch (err) {
      console.error("Feedback submission failed:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const selectedType = REPORT_TYPES.find((r) => r.value === type);

  return (
    <>
      {/* FAB — bottom-right, above annotation overlay */}
      <button
        className={`bug-reporter-fab ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        title={open ? "Close feedback" : "Report a bug or share feedback"}
      >
        {open ? "✕" : "🐛"}
      </button>

      {/* Panel */}
      {open && (
        <div className="bug-reporter-panel">
          {/* Header */}
          <div className="br-header">
            <span style={{ fontSize: 18 }}>📣</span>
            <span className="br-header-title">Send Feedback</span>
          </div>

          {status === "success" ? (
            /* Success state */
            <div className="br-success">
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                Thank you!
              </div>
              <p>Your {selectedType?.label?.toLowerCase() || "feedback"} has been submitted.</p>
              <button
                className="br-submit-btn"
                onClick={() => setOpen(false)}
                style={{ marginTop: 12 }}
              >
                Close
              </button>
            </div>
          ) : (
            /* Form */
            <>
              {/* Type selector */}
              <div className="br-type-selector">
                {REPORT_TYPES.map((rt) => (
                  <button
                    key={rt.value}
                    className={`br-type-btn ${type === rt.value ? "active" : ""}`}
                    onClick={() => setType(rt.value)}
                  >
                    <span>{rt.icon}</span>
                    <span>{rt.label}</span>
                  </button>
                ))}
              </div>

              {/* Description */}
              <div className="br-body">
                <textarea
                  className="br-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    type === "bug"
                      ? "Describe what went wrong..."
                      : type === "feature"
                      ? "What feature would you like to see?"
                      : "Share your thoughts..."
                  }
                  rows={5}
                  maxLength={2000}
                />
                <div className="br-char-count">
                  {description.length}/2000
                </div>

                {/* Auto-captured page URL */}
                <div className="br-page-info">
                  📍 Page: {window.location.pathname}
                </div>

                {/* Error message */}
                {status === "error" && (
                  <div className="br-error">{errorMsg}</div>
                )}

                {/* Submit */}
                <button
                  className="br-submit-btn"
                  onClick={handleSubmit}
                  disabled={!description.trim() || status === "sending"}
                >
                  {status === "sending" ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
