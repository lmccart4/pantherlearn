import { renderMarkdown } from "../../lib/utils";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
export default function ActivityBlock({ block }) {
  const translatedTitle = useTranslatedText(block.title);
  const translatedInstructions = useTranslatedText(block.instructions);
  return (
    <div className="activity-block">
      <div className="activity-header">
        <span className="activity-icon">{block.icon}</span>
        <h3 className="activity-title" data-translatable>{translatedTitle}</h3>
      </div>
      <div className="activity-body" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedInstructions) }} />
    </div>
  );
}
