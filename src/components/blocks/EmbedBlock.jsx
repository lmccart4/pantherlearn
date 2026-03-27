// src/components/blocks/EmbedBlock.jsx
import { useEffect } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";

// Permits any Firebase-hosted PAPS activity (*.web.app or *.firebaseapp.com) plus localhost.
// No explicit allowlist needed — the regex covers all current and future Firebase deploys.
function isAllowedOrigin(origin) {
  if (!origin) return false;
  // Allow any Firebase-hosted app (covers all PAPS projects without requiring code changes per deploy)
  if (/^https:\/\/[a-z0-9-]+\.(web\.app|firebaseapp\.com)$/.test(origin)) return true;
  // Allow localhost for development
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

export default function EmbedBlock({ block, courseId, lessonId, user, onAnswer, studentData, isTestStudent, dueDate }) {
  const translatedCaption = useTranslatedText(block.caption);
  const height = block.height || 400;
  const data = studentData?.[block.id] || {};

  // Listen for messages from embedded iframes (scores + auth token requests)
  useEffect(() => {
    const handleMessage = async (event) => {
      const msg = event.data;
      if (!msg) return;

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

      onAnswer(block.id, {
        score: msg.score,
        maxScore,
        writtenScore: newWrittenScore, // 0-1 scale for grade calculation
        submitted: true,
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

  return (
    <div style={{ margin: "24px 0" }}>
      {isComplete && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          marginBottom: 8,
          borderRadius: "var(--radius, 12px)",
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
        }}>
          <span style={{ color: "#10b981", fontWeight: 700, fontSize: 14 }}>✓ Complete</span>
          {data.score != null && data.maxScore != null && (
            <span style={{ color: "var(--text3, #888)", fontSize: 13 }}>
              {data.score}/{data.maxScore}
            </span>
          )}
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
          src={url}
          title={translatedCaption || block.title || "Interactive activity"}
          width="100%"
          height={height}
          style={{ border: "none", display: "block", maxHeight: "80vh" }}
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
