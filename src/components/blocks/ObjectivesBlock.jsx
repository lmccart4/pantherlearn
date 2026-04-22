import { useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
export default function ObjectivesBlock({ block }) {
  const title = block.title || "Learning Objectives";
  const allTexts = [title, ...(block.items || [])];
  const translated = useTranslatedTexts(allTexts);
  const translatedTitle = translated?.[0] ?? title;
  const translatedItems = translated ? translated.slice(1) : block.items;
  return (
    <div className="objectives-block">
      <h3 className="objectives-title" data-translatable><span>🎯 </span><span dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedTitle) }} /></h3>
      <ul className="objectives-list">{(translatedItems || block.items).map((item, i) => <li key={i} data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(item) }} />)}</ul>
    </div>
  );
}
