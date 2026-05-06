import { renderMarkdown } from "../../lib/utils";
import "./TeacherCheckpointBlock.css";

export default function TeacherCheckpointBlock({ block, studentData = {} }) {
  const data = (studentData && studentData[block.id]) || {};
  const approved = data.approved === true;
  const maxScore = block.weight || 5;
  const score = approved ? (data.score ?? maxScore) : 0;

  let approvedLabel = "";
  if (approved && data.approvedAt) {
    try {
      approvedLabel = new Date(data.approvedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch (e) {
      approvedLabel = "";
    }
  }

  return (
    <div className={`tc-block ${approved ? "is-approved" : "is-pending"}`}>
      <div className="tc-header">
        <span className="tc-icon" aria-hidden>{approved ? "✅" : "🙋"}</span>
        <div className="tc-title">{block.title || "Teacher Checkpoint"}</div>
      </div>

      {block.prompt && (
        <div className="tc-prompt" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.prompt) }} />
      )}

      {approved ? (
        <>
          <span className="tc-status is-approved">✅ Approved — {score}/{maxScore} points</span>
          {approvedLabel && <div className="tc-meta">Approved at {approvedLabel}</div>}
        </>
      ) : (
        <span className="tc-status is-pending">👋 Waiting for Mr. McCarthy</span>
      )}
    </div>
  );
}
