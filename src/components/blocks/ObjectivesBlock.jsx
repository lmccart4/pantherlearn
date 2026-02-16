import { useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
export default function ObjectivesBlock({ block }) {
  const allTexts = [block.title, ...(block.items || [])];
  const translated = useTranslatedTexts(allTexts);
  const translatedTitle = translated?.[0] ?? block.title;
  const translatedItems = translated ? translated.slice(1) : block.items;
  return (
    <div className="objectives-block">
      <h3 className="objectives-title" data-translatable>🎯 {translatedTitle}</h3>
      <ul className="objectives-list">{(translatedItems || block.items).map((item, i) => <li key={i} data-translatable>{item}</li>)}</ul>
    </div>
  );
}
