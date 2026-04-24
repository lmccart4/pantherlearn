// src/components/blocks/ExternalLinkBlock.jsx
import { useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";

export default function ExternalLinkBlock({ block }) {
  const texts = useTranslatedTexts([
    block.title,
    block.description,
    block.buttonLabel || "Open",
  ]);

  const title = texts?.[0] || block.title;
  const description = texts?.[1] || block.description;
  const buttonLabel = texts?.[2] || block.buttonLabel || "Open";

  // Ensure URL has a protocol so the browser doesn't treat it as a relative path
  const normalizedUrl = block.url && !/^https?:\/\//i.test(block.url)
    ? `https://${block.url}`
    : block.url;

  return (
    <div className="external-link-block">
      <div className="external-link-header">
        <span className="external-link-icon">{block.icon || "🔗"}</span>
        <h3 className="external-link-title" data-translatable>{title}</h3>
      </div>
      {block.description && (
        <div
          className="external-link-description"
          data-translatable
          dangerouslySetInnerHTML={{ __html: renderMarkdown(description) }}
        />
      )}
      {block.url && (
        <a
          href={normalizedUrl}
          target={block.openInNewTab !== false ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="external-link-button"
        >
          {buttonLabel}
          {block.openInNewTab !== false && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
        </a>
      )}
    </div>
  );
}