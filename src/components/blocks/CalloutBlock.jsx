import { renderMarkdown } from "../../lib/utils";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
export default function CalloutBlock({ block }) {
  const translated = useTranslatedText(block.content);
  return (
    <div className={`callout-block callout-${block.style}`}>
      <span className="callout-icon">{block.icon}</span>
      <div className="callout-content" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translated) }} />
    </div>
  );
}
