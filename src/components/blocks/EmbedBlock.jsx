// src/components/blocks/EmbedBlock.jsx
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";

export default function EmbedBlock({ block, courseId, lessonId, user }) {
  const translatedCaption = useTranslatedText(block.caption);
  const height = block.height || 400;

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
