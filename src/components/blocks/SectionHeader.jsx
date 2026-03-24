import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
export default function SectionHeader({ block }) {
  const translatedTitle = useTranslatedText(block.title);
  const translatedSubtitle = useTranslatedText(block.subtitle);
  return (
    <div className="section-header-block">
      <div className="section-icon">{block.icon}</div>
      <div>
        <h2 className="section-title" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedTitle) }} />
        {block.subtitle && <p className="section-subtitle" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedSubtitle) }} />}
      </div>
    </div>
  );
}
