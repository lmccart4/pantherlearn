// src/components/blocks/VideoBlock.jsx
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";

/**
 * Converts any YouTube URL format to an embed URL.
 * Handles:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://youtube.com/watch?v=VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID (already correct)
 *   https://m.youtube.com/watch?v=VIDEO_ID
 *   https://youtube.com/shorts/VIDEO_ID
 */
function toEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // Already an embed URL
  if (trimmed.includes("/embed/")) return trimmed;

  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

  // youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // If it looks like a bare video ID (11 chars, alphanumeric)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  // Return as-is if we can't parse it (might be another video platform)
  return trimmed;
}

export default function VideoBlock({ block }) {
  const translatedCaption = useTranslatedText(block.caption);
  const embedUrl = toEmbedUrl(block.url);

  if (!embedUrl) return null;

  return (
    <div style={{ margin: "24px 0" }}>
      <div style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        borderRadius: "var(--radius, 12px)",
        border: "1px solid var(--border, #2a2f3d)",
      }}>
        <iframe
          src={embedUrl}
          title={translatedCaption || "Video"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {translatedCaption && (
        <p style={{
          fontSize: 13,
          color: "var(--text3, #888)",
          marginTop: 8,
          fontStyle: "italic",
        }}>
          {translatedCaption}
        </p>
      )}
    </div>
  );
}
