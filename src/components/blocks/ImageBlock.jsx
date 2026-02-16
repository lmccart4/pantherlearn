// src/components/blocks/ImageBlock.jsx
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";

// Convert Google Drive sharing URLs to direct image URLs
function normalizeImageUrl(url) {
  if (!url) return url;

  // Google Drive sharing link: https://drive.google.com/file/d/FILE_ID/view?...
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  // Google Drive open link: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }

  return url;
}

export default function ImageBlock({ block }) {
  const translatedCaption = useTranslatedText(block.caption);
  const imgUrl = normalizeImageUrl(block.url);

  if (!block.url) return null;

  return (
    <div style={{ margin: "24px 0" }}>
      <img
        src={imgUrl}
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