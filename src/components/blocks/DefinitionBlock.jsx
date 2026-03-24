import { useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
export default function DefinitionBlock({ block }) {
  const translated = useTranslatedTexts([block.term, block.definition]);
  return (
    <div className="definition-block">
      <div className="def-term" data-translatable>{translated?.[0] ?? block.term}</div>
      <div className="def-text" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translated?.[1] ?? block.definition) }} />
    </div>
  );
}
