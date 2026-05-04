import { renderMarkdown } from "../../lib/utils";

export default function RubricBlock({ block }) {
  const criteria = Array.isArray(block.criteria) ? block.criteria : [];
  if (criteria.length === 0) return null;

  const levelScores = criteria[0]?.levels?.map((l) => l.score) || [4, 3, 2, 1];
  const levelLabels = criteria[0]?.levels?.map((l) => l.label) || [];

  return (
    <div className="rubric-block">
      <div className="rubric-header">
        <div className="rubric-title">{block.title || "Rubric"}</div>
        {block.totalPoints && (
          <div className="rubric-points">{block.totalPoints} pts total</div>
        )}
      </div>
      {block.intro && (
        <div
          className="rubric-intro"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(block.intro) }}
        />
      )}
      <div className="rubric-table-wrap">
        <table className="rubric-table">
          <thead>
            <tr>
              <th className="rubric-criterion-col">Criterion</th>
              {levelScores.map((s, i) => (
                <th key={s} className={`rubric-level-col rubric-level-${s}`}>
                  <div className="rubric-level-score">{s}</div>
                  {levelLabels[i] && (
                    <div className="rubric-level-label">{levelLabels[i]}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={c.id || i}>
                <th scope="row" className="rubric-criterion-cell">
                  <div className="rubric-criterion-name">{c.name}</div>
                  {c.weight != null && (
                    <div className="rubric-criterion-weight">{c.weight} pts</div>
                  )}
                </th>
                {(c.levels || []).map((lvl, j) => (
                  <td key={j} className={`rubric-cell rubric-cell-${lvl.score}`}>
                    <div
                      className="rubric-cell-body"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(lvl.description || ""),
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
