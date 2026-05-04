// src/components/blocks/ImageBlock.jsx
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
import "./ImageBlock.css";

// Convert Google Drive sharing URLs to direct image URLs
function normalizeImageUrl(url) {
  if (!url) return url;

  // Google Drive sharing link: https://drive.google.com/file/d/FILE_ID/view?...
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  // Google Drive open link: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  }

  // Already a uc?export link — convert that too
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
  if (ucMatch) {
    return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
  }

  return url;
}

export default function ImageBlock({ block }) {
  const translatedCaption = useTranslatedText(block.caption);
  const imgUrl = normalizeImageUrl(block.url);

  if (!block.url) return null;

  const hasExplicitDims = block.width && block.height;
  const aspectRatio = hasExplicitDims ? `${block.width} / ${block.height}` : "16 / 9";

  // width/aspectRatio remain inline — they're driven by authored values per-image
  const imgStyle = {
    width: hasExplicitDims ? block.width : "auto",
    aspectRatio: hasExplicitDims ? undefined : aspectRatio,
  };

  return (
    <div className="image-block">
      <img
        className="image-block-img"
        src={imgUrl}
        alt={block.alt || translatedCaption || "Lesson image"}
        loading="lazy"
        width={block.width || undefined}
        height={block.height || undefined}
        style={imgStyle}
      />
      {translatedCaption && (
        <p
          className="image-block-caption"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedCaption) }}
        />
      )}
    </div>
  );
}
