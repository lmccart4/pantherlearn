import { useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
export default function VocabListBlock({ block }) {
  const terms = (block.terms || []);
  const allTexts = terms.flatMap(t => [t.term, t.definition]);
  const translated = useTranslatedTexts(allTexts);
  return (
    <dl className="vocab-list-block">
      {terms.map((item, i) => (
        <div key={i} className="vocab-item">
          <dt className="vocab-term" data-translatable>{translated?.[i * 2] ?? item.term}</dt>
          <dd className="vocab-def" data-translatable>{translated?.[i * 2 + 1] ?? item.definition}</dd>
        </div>
      ))}
    </dl>
  );
}
