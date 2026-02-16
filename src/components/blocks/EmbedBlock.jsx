// src/components/blocks/EmbedBlock.jsx
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";

export default function EmbedBlock({ block }) {
  const translatedCaption = useTranslatedText(block.caption);
  const height = block.height || 400;

  if (!block.url) return null;

  return (
    <div style={{ margin: "24px 0" }}>
      <div style={{
        borderRadius: "var(--radius, 12px)",
        border: "1px solid var(--border, #2a2f3d)",
        overflow: "hidden",
        background: "#fff",
      }}>
        <iframe
          src={block.url}
          title={translatedCaption || "Embedded content"}
          width="100%"
          height={height}
          style={{ border: "none", display: "block" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
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
