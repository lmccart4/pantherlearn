// src/components/blocks/EmbedBlock.jsx
import { useEffect, useRef } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
import "./EmbedBlock.css";

// Only allow known PAPS Firebase projects (not any *.web.app domain).
// PAPS-owned projects follow one of these conventions:
//   - paps-tools / pantherlearn / pantherprep / brstatus (plus preview channels)
//   - anything-paps (the "-paps" suffix convention used for single-purpose tools
//     like hallucination-lab-paps, digital-footprint-paps, battleship-ai-paps, etc.)
// Regression note: the April 7 tightening dropped the -paps suffix variant,
// silently blocking postMessage scores from ~11 live embeds for a week.
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (/^https:\/\/(paps-tools|pantherlearn|pantherprep|brstatus)[a-z0-9-]*\.(web\.app|firebaseapp\.com)$/.test(origin)) return true;
  // Custom production domains (Firebase custom-domain routing)
  if (/^https:\/\/(pantherlearn|pantherprep)\.com$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+-paps\.(web\.app|firebaseapp\.com)$/.test(origin)) return true;
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

      if (event.source !== iframeRef.current?.contentWindow) return;

      if (!isAllowedOrigin(event.origin)) {
        return;
      }

      if (msg.type === "requestAuthToken") {
        if (user?.getIdToken) {
          try {
            const token = await user.getIdToken();
            event.source?.postMessage({ type: "authToken", token }, event.origin);
          } catch (err) {
            console.warn("[EmbedBlock] Failed to get auth token:", err);
          }
        }
        return;
      }

      if (msg.type !== "activityScore") return;
      if (msg.score == null || !onAnswer) return;

      const maxScore = msg.maxScore || 100;
      if (maxScore <= 0) return;
      const newWrittenScore = Math.min(msg.score / maxScore, 1);

      const existing = studentData?.[block.id];
      if (existing?.writtenScore != null && newWrittenScore < existing.writtenScore) return;

      const isGameComplete = msg.gameComplete !== false;
      const wasAlreadySubmitted = existing?.submitted === true;

      onAnswer(block.id, {
        score: msg.score,
        maxScore,
        writtenScore: newWrittenScore,
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

  let url = block.url.trim();
  if (/^(javascript|data|vbscript|blob):/i.test(url)) return null;

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
    <div className="embed-block">
      {hasScore && (
        <div className="embed-status-wrap">
          <div className={`embed-status ${isComplete ? "is-complete" : "is-pending"}`}>
            <span className="embed-status-label">
              {isComplete ? "✓ Complete" : "⚠ Not Submitted"}
            </span>
            <span className="embed-status-score">
              {data.score}/{data.maxScore}
            </span>
            <div className="embed-status-bar">
              <div className="embed-status-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="embed-status-pct">{pct}%</span>
          </div>
          {!isComplete && (
            <div className="embed-status-warning">
              Your grade <strong>won't save</strong> until you fully finish the activity.
              Return to the activity above and complete every round or section to lock
              in your score.
            </div>
          )}
        </div>
      )}
      <div className={`embed-frame ${isComplete ? "is-complete" : ""}`}>
        <iframe
          ref={iframeRef}
          src={url}
          title={translatedCaption || block.title || "Interactive activity"}
          width="100%"
          height={height}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        />
      </div>
      {translatedCaption && (
        <p
          className="embed-caption"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedCaption) }}
        />
      )}
    </div>
  );
}
