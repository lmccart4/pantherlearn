import { renderMarkdown } from "../../lib/utils";

export default function RubricBlock({ block, studentData = {} }) {
  const criteria = Array.isArray(block.criteria) ? block.criteria : [];
  if (criteria.length === 0) return null;

  const levelScores = criteria[0]?.levels?.map((l) => l.score) || [4, 3, 2, 1];
  const levelLabels = criteria[0]?.levels?.map((l) => l.label) || [];

  // If linked to a scored block (e.g., a teacher_checkpoint) via `linkedBlockId`,
  // pull the student's earned score/level and highlight the matching cell.
  const linkedId = block.linkedBlockId;
  const linkedData = linkedId && studentData ? studentData[linkedId] : null;
  const hasGrade = !!linkedData && (
    linkedData.approved === true || typeof linkedData.score === "number"
  );
  const earnedScore = hasGrade && typeof linkedData.score === "number" ? linkedData.score : null;
  const earnedLabel = hasGrade ? (linkedData.levelLabel || "") : "";

  const isEarnedLevel = (lvl) => {
    if (!hasGrade) return false;
    if (earnedScore != null && Math.abs(lvl.score - earnedScore) < 0.001) return true;
    if (earnedLabel && lvl.label && earnedLabel.toLowerCase() === lvl.label.toLowerCase()) return true;
    return false;
  };

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
      {hasGrade && earnedLabel && (
        <div
          style={{
            margin: "8px 0 12px",
            padding: "8px 14px",
            background: "color-mix(in oklab, var(--status-success, #10b981) 14%, transparent)",
            border: "1px solid var(--status-success, #10b981)",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            color: "var(--status-success-display, #059669)",
            display: "inline-block",
          }}
        >
          ✅ Your level: {earnedLabel}
          {earnedScore != null && block.totalPoints
            ? ` — ${earnedScore}/${block.totalPoints} (${Math.round((earnedScore / block.totalPoints) * 100)}%)`
            : ""}
        </div>
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
                {(c.levels || []).map((lvl, j) => {
                  const earned = isEarnedLevel(lvl);
                  return (
                    <td
                      key={j}
                      className={`rubric-cell rubric-cell-${lvl.score} ${earned ? "is-earned" : ""}`}
                      style={earned ? {
                        background: "color-mix(in oklab, var(--status-success, #10b981) 22%, transparent)",
                        outline: "2px solid var(--status-success, #10b981)",
                        outlineOffset: "-2px",
                        position: "relative",
                      } : undefined}
                    >
                      {earned && (
                        <div style={{
                          position: "absolute",
                          top: 4,
                          right: 6,
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--status-success-display, #059669)",
                        }}>✓</div>
                      )}
                      <div
                        className="rubric-cell-body"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(lvl.description || ""),
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
