import { useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
export default function VocabListBlock({ block }) {
  const terms = (block.terms || []);
  const allTexts = terms.flatMap(t => [t.term, t.definition]);
  const translated = useTranslatedTexts(allTexts);
  return (
    <dl className="vocab-list-block">
      {terms.map((item, i) => (
        <div key={i} className="vocab-item">
          <dt className="vocab-term" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translated?.[i * 2] ?? item.term) }} />
          <dd className="vocab-def" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translated?.[i * 2 + 1] ?? item.definition) }} />
        </div>
      ))}
    </dl>
  );
}
