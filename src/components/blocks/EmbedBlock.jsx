// src/components/blocks/EmbedBlock.jsx
import { useEffect } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";

export default function EmbedBlock({ block, courseId, lessonId, user, onAnswer, studentData }) {
  const translatedCaption = useTranslatedText(block.caption);
  const height = block.height || 400;
  const data = studentData?.[block.id] || {};

  // Listen for activityScore messages from embedded iframes
  useEffect(() => {
    if (!onAnswer) return;

    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg || msg.type !== "activityScore") return;
      if (msg.score == null) return;

      const maxScore = msg.maxScore || 100;
      const newWrittenScore = Math.min(msg.score / maxScore, 1);

      // Only save if this score is higher than the existing one
      const existing = studentData?.[block.id];
      if (existing?.writtenScore != null && newWrittenScore <= existing.writtenScore) return;

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
  }, [onAnswer, block.id]);

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
    });
    url = `${url}${sep}${params.toString()}`;
  }

  return (
    <div style={{ margin: "24px 0" }}>
      <div style={{
        borderRadius: "var(--radius, 12px)",
        border: "1px solid var(--border, #2a2f3d)",
        overflow: "hidden",
        background: "#fff",
      }}>
        <iframe
          src={url}
          title={translatedCaption || "Embedded content"}
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
        }}>
          {translatedCaption}
        </p>
      )}
    </div>
  );
}
