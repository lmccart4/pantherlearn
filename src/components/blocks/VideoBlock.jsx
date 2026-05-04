// src/components/blocks/VideoBlock.jsx
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
import "./VideoBlock.css";

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
  const isDirectVideo = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(block.url || "");
  const embedUrl = isDirectVideo ? block.url : toEmbedUrl(block.url);

  if (!embedUrl) return null;

  return (
    <div className="video-block">
      <div className="video-block-frame">
        {isDirectVideo ? (
          <video
            className="video-block-media"
            src={embedUrl}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <iframe
            className="video-block-iframe"
            src={embedUrl}
            title={translatedCaption || "Video"}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      {translatedCaption && (
        <p
          className="video-block-caption"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedCaption) }}
        />
      )}
    </div>
  );
}
