import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
export default function SectionHeader({ block }) {
  const translatedTitle = useTranslatedText(block.title);
  const translatedSubtitle = useTranslatedText(block.subtitle);
  return (
    <div className="section-header-block">
      <div className="section-icon">{block.icon}</div>
      <div>
        <h2 className="section-title" data-translatable>{translatedTitle}</h2>
        {block.subtitle && <p className="section-subtitle" data-translatable>{translatedSubtitle}</p>}
      </div>
    </div>
  );
}
