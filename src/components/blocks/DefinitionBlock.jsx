import { useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
export default function DefinitionBlock({ block }) {
  const translated = useTranslatedTexts([block.term, block.definition]);
  return (
    <div className="definition-block">
      <div className="def-term" data-translatable>{translated?.[0] ?? block.term}</div>
      <div className="def-text" data-translatable>{translated?.[1] ?? block.definition}</div>
    </div>
  );
}
