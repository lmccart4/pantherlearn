import { renderMarkdown } from "../../lib/utils";
import "./TeacherCheckpointBlock.css";

export default function TeacherCheckpointBlock({ block, studentData = {} }) {
  const data = (studentData && studentData[block.id]) || {};
  const graded = data.approved === true || typeof data.score === "number";
  const maxScore = block.weight || 5;
  const rawScore = typeof data.score === "number"
    ? data.score
    : (data.approved === true ? maxScore : 0);
  const score = Math.round(rawScore * 100) / 100;
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const levelLabel = data.levelLabel || "";
  const isZero = graded && score === 0;
  const stateClass = !graded ? "is-pending" : (isZero ? "is-missing" : "is-approved");

  let approvedLabel = "";
  if (graded && data.approvedAt) {
    try {
      approvedLabel = new Date(data.approvedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch (e) {
      approvedLabel = "";
    }
  }

  const headerIcon = !graded ? "🙋" : (isZero ? "❌" : "✅");

  return (
    <div className={`tc-block ${stateClass}`}>
      <div className="tc-header">
        <span className="tc-icon" aria-hidden>{headerIcon}</span>
        <div className="tc-title">{block.title || "Teacher Checkpoint"}</div>
      </div>

      {block.prompt && (
        <div className="tc-prompt" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.prompt) }} />
      )}

      {graded ? (
        <>
          <span className={`tc-status ${isZero ? "is-missing" : "is-approved"}`}>
            {isZero ? "❌" : "✅"} {levelLabel ? `${levelLabel} — ` : ""}{score}/{maxScore} ({pct}%)
          </span>
          {approvedLabel && <div className="tc-meta">Graded at {approvedLabel}</div>}
        </>
      ) : (
        <span className="tc-status is-pending">👋 Waiting for Mr. McCarthy</span>
      )}
    </div>
  );
}
