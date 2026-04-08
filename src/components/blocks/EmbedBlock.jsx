// src/components/blocks/EmbedBlock.jsx
import { useEffect, useRef } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";

// Only allow known PAPS Firebase projects (not any *.web.app domain).
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (/^https:\/\/(paps-tools|pantherlearn|pantherprep|brstatus)[a-z0-9-]*\.(web\.app|firebaseapp\.com)$/.test(origin)) return true;
  if (origin === window.location.origin) return true;
  // Allow localhost for development
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

export default function EmbedBlock({ block, courseId, lessonId, user, onAnswer, studentData, isTestStudent, dueDate }) {
  const translatedCaption = useTranslatedText(block.caption);
  const iframeRef = useRef(null);
  const height = block.height || 400;
  const data = studentData?.[block.id] || {};

  // Listen for messages from embedded iframes (scores + auth token requests)
  useEffect(() => {
    const handleMessage = async (event) => {
      const msg = event.data;
      if (!msg) return;

      // Only accept messages from this block's iframe (prevents cross-pollination)
      if (event.source !== iframeRef.current?.contentWindow) return;

      // Validate origin — reject messages from unknown origins
      if (!isAllowedOrigin(event.origin)) {
        return;
      }

      // Handle auth token requests from embedded activities
      if (msg.type === "requestAuthToken") {
        if (user?.getIdToken) {
          try {
            const token = await user.getIdToken();
            // Send token only to the requesting embed's origin (not wildcard)
            event.source?.postMessage({ type: "authToken", token }, event.origin);
          } catch (err) {
            console.warn("[EmbedBlock] Failed to get auth token:", err);
          }
        }
        return;
      }

      // Handle activity score submissions
      if (msg.type !== "activityScore") return;
      if (msg.score == null || !onAnswer) return;

      const maxScore = msg.maxScore || 100;
      // Guard against invalid maxScore (Finding #14)
      if (maxScore <= 0) return;
      const newWrittenScore = Math.min(msg.score / maxScore, 1);

      // Only save if this score is higher than the existing one
      // Use strict < so same-score resubmissions can update metadata (Finding #12)
      const existing = studentData?.[block.id];
      if (existing?.writtenScore != null && newWrittenScore < existing.writtenScore) return;

      // Only mark submitted (which gates lesson completion) when the game signals gameComplete
      // Interim scores (e.g. per-lock in escape rooms) save progress without marking complete
      // Default to true for backward compat — existing tools that don't send this flag are always final
      const isGameComplete = msg.gameComplete !== false;
      const wasAlreadySubmitted = existing?.submitted === true;

      onAnswer(block.id, {
        score: msg.score,
        maxScore,
        writtenScore: newWrittenScore, // 0-1 scale for grade calculation
        submitted: isGameComplete || wasAlreadySubmitted,
        completedAt: msg.completedAt || new Date().toISOString(),
        ...(msg.breakdown && { breakdown: msg.breakdown }),
        ...(msg.scenariosCompleted != null && { scenariosCompleted: msg.scenariosCompleted }),
      });
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onAnswer, block.id, studentData, user]);

  if (!block.url) return null;

  // Reject dangerous URL schemes
  let url = block.url.trim();
  if (/^(javascript|data|vbscript|blob):/i.test(url)) return null;

  // Inject context params so embedded activities know the student and course
  if (user?.uid && courseId) {
    const sep = url.includes("?") ? "&" : "?";
    const params = new URLSearchParams({
      studentId: user.uid,
      courseId,
      ...(lessonId && { lessonId }),
      ...(block.id && { blockId: block.id }),
      ...(isTestStudent && { testStudent: "true" }),
      ...(dueDate && { dueDate }),
    });
    url = `${url}${sep}${params.toString()}`;
  }

  const isComplete = data.submitted && data.writtenScore != null;
  const hasScore = data.score != null && data.maxScore != null && data.maxScore > 0;
  const pct = hasScore ? Math.round((data.score / data.maxScore) * 100) : null;

  return (
    <div style={{ margin: "24px 0" }}>
      {hasScore && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px",
          marginBottom: 8,
          borderRadius: "var(--radius, 12px)",
          background: isComplete ? "rgba(16,185,129,0.08)" : "rgba(139,92,246,0.08)",
          border: `1px solid ${isComplete ? "rgba(16,185,129,0.2)" : "rgba(139,92,246,0.2)"}`,
        }}>
          <span style={{ color: isComplete ? "#10b981" : "#8b5cf6", fontWeight: 700, fontSize: 14 }}>
            {isComplete ? "✓ Complete" : "In Progress"}
          </span>
          <span style={{ color: "var(--text2, #ccc)", fontSize: 13, fontWeight: 600 }}>
            {data.score}/{data.maxScore}
          </span>
          <div style={{
            flex: 1, height: 6, borderRadius: 3,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 3,
              width: `${pct}%`,
              background: isComplete ? "#10b981" : "#8b5cf6",
              transition: "width 0.6s cubic-bezier(0.2, 0, 0, 1)",
            }} />
          </div>
          <span style={{ color: isComplete ? "#10b981" : "#8b5cf6", fontSize: 13, fontWeight: 700, minWidth: 36, textAlign: "right" }}>
            {pct}%
          </span>
        </div>
      )}
      <div style={{
        borderRadius: "var(--radius, 12px)",
        border: isComplete ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border, #2a2f3d)",
        overflow: "hidden",
        background: "#fff",
        position: "relative",
      }}>
        <iframe
          ref={iframeRef}
          src={url}
          title={translatedCaption || block.title || "Interactive activity"}
          width="100%"
          height={height}
          style={{ border: "none", display: "block" }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        />
      </div>
      {translatedCaption && (
        <p style={{
          fontSize: 13,
          color: "var(--text3, #888)",
          marginTop: 8,
          fontStyle: "italic",
          textAlign: "center",
        }} dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedCaption) }} />
      )}
    </div>
  );
}
