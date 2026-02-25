// src/components/chatbot-workshop/PhaseReflectionModal.jsx
// Modal prompting students to reflect after completing a chatbot workshop phase.
// Follows the same pattern as LessonCompleteButton's reflection modal.

import { useState, useRef, useCallback } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { saveBotReflection } from "../../lib/botStore";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES } from "../../lib/gamification";

const VALIDATE_REFLECTION_URL =
  import.meta.env.VITE_VALIDATE_REFLECTION_URL || "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/validateReflection";

const PHASE_PROMPTS = {
  1: "What did you learn about how decision trees guide a conversation? What are their strengths and limitations?",
  2: "How is keyword matching different from decision trees? What happens when a user says something unexpected?",
  3: "How does intent classification understand meaning differently from exact keyword matches?",
  4: "How does the LLM approach compare to the rule-based approaches you built? When might you prefer rules over AI?",
};

const PHASE_LABELS = {
  1: "Decision Tree",
  2: "Keyword Match",
  3: "Intent Classifier",
  4: "LLM-Powered",
};

export default function PhaseReflectionModal({ phase, courseId, user, projectId, getToken, onComplete, onSkip }) {
  const [text, setText] = useState("");
  const [validating, setValidating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [valid, setValid] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const modalRef = useRef(null);

  const prompt = PHASE_PROMPTS[phase] || "What did you learn in this phase?";

  // Focus trap
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setShowSkipConfirm(true);
      return;
    }
    if (e.key !== "Tab") return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll('button:not([disabled]), textarea:not([disabled])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  async function handleSubmit() {
    if (!text.trim() || validating) return;
    setValidating(true);
    setFeedback(null);

    try {
      const authToken = await getToken();
      const response = await fetch(VALIDATE_REFLECTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          courseId,
          lessonId: `bot_phase_${phase}`,
          lessonTitle: `Chatbot Phase ${phase}: ${PHASE_LABELS[phase]}`,
          reflection: text.trim(),
        }),
      });

      const result = await response.json();
      setFeedback(result.feedback);
      setValid(result.valid);

      if (result.valid) {
        // Save reflection
        await saveBotReflection(db, courseId, {
          studentId: user.uid,
          studentName: user.displayName || "Anonymous",
          phase,
          projectId: projectId || "",
          response: text.trim(),
          valid: true,
          skipped: false,
        });

        // Save gradebook entry
        try {
          const today = new Date().toISOString().slice(0, 10);
          const gradeRef = doc(db, "courses", courseId, "grades", `bot_reflection_${user.uid}_phase${phase}`);
          await setDoc(gradeRef, {
            studentId: user.uid,
            studentName: user.displayName || "Unknown",
            type: "reflection",
            lessonId: `bot_phase_${phase}`,
            lessonTitle: `Chatbot Phase ${phase}: ${PHASE_LABELS[phase]}`,
            response: text.trim(),
            score: 100,
            maxScore: 100,
            date: today,
            gradedAt: new Date(),
            autoGraded: true,
            category: "Bot Reflection",
          });
        } catch (e) {
          console.warn("Could not save bot reflection grade:", e);
        }

        // Award XP
        try {
          const xpConfig = await getXPConfig(courseId);
          const xpAmount = xpConfig?.bot_reflection ?? DEFAULT_XP_VALUES.bot_reflection ?? 10;
          await awardXP(user.uid, xpAmount, "bot_reflection", courseId);
        } catch (e) {
          console.warn("Could not award bot reflection XP:", e);
        }

        setTimeout(() => onComplete(phase), 1500);
      }
    } catch (e) {
      console.error("Bot reflection validation error:", e);
      setFeedback("Something went wrong. Your reflection has been saved — please continue.");
      setValid(true);
      // Save anyway on error
      try {
        await saveBotReflection(db, courseId, {
          studentId: user.uid,
          studentName: user.displayName || "Anonymous",
          phase,
          projectId: projectId || "",
          response: text.trim(),
          valid: true,
          skipped: false,
        });
      } catch (_) { /* best effort */ }
      setTimeout(() => onComplete(phase), 1500);
    }

    setValidating(false);
  }

  async function handleSkip() {
    // Save skipped reflection
    try {
      await saveBotReflection(db, courseId, {
        studentId: user.uid,
        studentName: user.displayName || "Anonymous",
        phase,
        projectId: projectId || "",
        response: "(skipped)",
        valid: false,
        skipped: true,
      });

      // Save 0% gradebook entry
      const today = new Date().toISOString().slice(0, 10);
      const gradeRef = doc(db, "courses", courseId, "grades", `bot_reflection_${user.uid}_phase${phase}`);
      await setDoc(gradeRef, {
        studentId: user.uid,
        studentName: user.displayName || "Unknown",
        type: "reflection",
        lessonId: `bot_phase_${phase}`,
        lessonTitle: `Chatbot Phase ${phase}: ${PHASE_LABELS[phase]}`,
        response: "(skipped)",
        score: 0,
        maxScore: 100,
        date: today,
        gradedAt: new Date(),
        autoGraded: true,
        skipped: true,
        category: "Bot Reflection",
      });
    } catch (e) {
      console.warn("Could not save skipped bot reflection:", e);
    }
    onSkip(phase);
  }

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && setShowSkipConfirm(true)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="phase-reflection-title"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        style={{
          background: "var(--surface, #1e2030)", borderRadius: 16,
          padding: "32px 28px", maxWidth: 520, width: "100%",
          border: "1px solid var(--border, #2a2f3d)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>💭</div>
          <h2
            id="phase-reflection-title"
            style={{
              fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
              color: "var(--text, #fff)", marginBottom: 6,
            }}
          >
            Phase {phase} Reflection
          </h2>
          <p style={{ fontSize: 13, color: "var(--text3, #888)", lineHeight: 1.5 }}>
            {prompt}
          </p>
        </div>

        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setFeedback(null); setValid(false); }}
          placeholder="Write your reflection here..."
          rows={5}
          style={{
            width: "100%", padding: "14px 16px", borderRadius: 10,
            border: "1.5px solid var(--border, #2a2f3d)",
            background: "var(--bg, #141520)", color: "var(--text, #fff)",
            fontFamily: "var(--font-body)", fontSize: 15, resize: "vertical",
            outline: "none", lineHeight: 1.6, transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "var(--amber, #f5a623)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border, #2a2f3d)"}
          disabled={validating || valid}
          autoFocus
        />

        {feedback && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 8,
            background: valid ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${valid ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            color: valid ? "var(--green, #10b981)" : "var(--red, #ef4444)",
            fontSize: 13, lineHeight: 1.5,
          }}>
            {valid ? "✨ " : "✏️ "}{feedback}
            {valid && (
              <span style={{ display: "block", marginTop: 4, fontSize: 12, opacity: 0.8 }}>
                +{DEFAULT_XP_VALUES.bot_reflection || 10} XP earned!
              </span>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || validating || valid}
            style={{
              flex: 1, padding: "12px 20px", borderRadius: 10, border: "none",
              background: !text.trim() || validating || valid ? "var(--surface2, #2a2f3d)" : "var(--amber, #f5a623)",
              color: !text.trim() || validating || valid ? "var(--text3, #888)" : "#1a1a1a",
              fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)",
              cursor: !text.trim() || validating || valid ? "default" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {validating ? "Validating..." : valid ? "✅ Done!" : "Submit Reflection"}
          </button>
          {!valid && !showSkipConfirm && (
            <button
              onClick={() => setShowSkipConfirm(true)}
              disabled={validating}
              style={{
                padding: "12px 20px", borderRadius: 10,
                border: "1px solid var(--border, #2a2f3d)",
                background: "transparent", color: "var(--text3, #888)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Skip
            </button>
          )}
        </div>

        {showSkipConfirm && !valid && (
          <div style={{
            marginTop: 12, padding: "12px 14px", borderRadius: 8,
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
          }}>
            <p style={{ fontSize: 13, color: "var(--red, #ef4444)", fontWeight: 600, marginBottom: 8 }}>
              Skipping will record a 0% for this reflection grade.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleSkip}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "none",
                  background: "var(--red, #ef4444)", color: "#fff",
                  fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}
              >
                Skip Anyway (0%)
              </button>
              <button
                onClick={() => setShowSkipConfirm(false)}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  border: "1px solid var(--border, #2a2f3d)",
                  background: "transparent", color: "var(--text, #fff)",
                  fontWeight: 600, fontSize: 12, cursor: "pointer",
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        <p style={{ fontSize: 11, color: "var(--text3, #888)", textAlign: "center", marginTop: 12, opacity: 0.6 }}>
          Phase reflections count as a participation grade
        </p>
      </div>
    </div>
  );
}
