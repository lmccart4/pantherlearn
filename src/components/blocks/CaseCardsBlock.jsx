import { renderMarkdown } from "../../lib/utils";
import { useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";

export default function CaseCardsBlock({ block }) {
  const cards = Array.isArray(block.cards) ? block.cards : [];
  const bodies = useTranslatedTexts(cards.map((c) => c.body || ""));
  const titles = useTranslatedTexts(cards.map((c) => c.title || ""));
  return (
    <div className="case-cards-block">
      {block.title && <div className="case-cards-title" data-translatable>{block.title}</div>}
      <div className="case-cards-grid">
        {cards.map((card, i) => (
          <div className="case-card" key={card.id || i}>
            <div className="case-card-badge">{card.label || i + 1}</div>
            <div className="case-card-title" data-translatable>{titles?.[i] ?? card.title}</div>
            <div
              className="case-card-body"
              data-translatable
              dangerouslySetInnerHTML={{ __html: renderMarkdown(bodies?.[i] ?? card.body ?? "") }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
