// src/components/blocks/ImageBlock.jsx
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";

export default function ImageBlock({ block }) {
  const translatedCaption = useTranslatedText(block.caption);

  if (!block.url) return null;

  return (
    <div style={{ margin: "24px 0" }}>
      <img
        src={block.url}
        alt={block.alt || translatedCaption || "Lesson image"}
        style={{
          width: "100%",
          maxWidth: 700,
          borderRadius: "var(--radius, 12px)",
          border: "1px solid var(--border, #2a2f3d)",
        }}
      />
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
