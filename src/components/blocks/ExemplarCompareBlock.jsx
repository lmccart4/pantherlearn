import { renderMarkdown } from "../../lib/utils";

function ExemplarColumn({ side, label, body, annotations, defaultLabel }) {
  return (
    <div className={`exemplar-col exemplar-${side}`}>
      <div className="exemplar-col-header">
        <span className="exemplar-tag">{label || defaultLabel}</span>
      </div>
      {body && (
        <div
          className="exemplar-body"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
        />
      )}
      {Array.isArray(annotations) && annotations.length > 0 && (
        <div className="exemplar-annotations">
          <div className="exemplar-annotations-title">
            {side === "strong" ? "Why it works" : "Why it falls short"}
          </div>
          <ul>
            {annotations.map((a, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(a) }}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ExemplarCompareBlock({ block }) {
  const strong = block.strong || {};
  const weak = block.weak || {};

  return (
    <div className="exemplar-compare-block">
      {block.title && <div className="exemplar-compare-title">{block.title}</div>}
      {block.prompt && (
        <div className="exemplar-prompt">
          <span className="exemplar-prompt-label">Prompt</span>
          <div
            className="exemplar-prompt-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(block.prompt) }}
          />
        </div>
      )}
      <div className="exemplar-grid">
        <ExemplarColumn
          side="strong"
          label={strong.label}
          body={strong.body}
          annotations={strong.annotations}
          defaultLabel="Strong"
        />
        <ExemplarColumn
          side="weak"
          label={weak.label}
          body={weak.body}
          annotations={weak.annotations}
          defaultLabel="Weak"
        />
      </div>
    </div>
  );
}
