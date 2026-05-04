// src/components/blocks/ScoreTallyBlock.jsx
// Auto-tallies correct answers from a set of question blocks.
// Block config: { id, type: "score_tally", questionIds: [...], total: 20 }
import "./ScoreTallyBlock.css";

function tierFor(pct) {
  if (pct >= 80) return { tier: "tier-perfect", message: "Incredible eye! You're a natural." };
  if (pct >= 55) return { tier: "tier-strong", message: "Solid skills — you're catching most of them." };
  if (pct >= 30) return { tier: "tier-ok", message: "Getting there — you're learning the patterns." };
  return { tier: "tier-weak", message: "Don't worry — that's exactly why this lesson exists. The more you practice, the better you get." };
}

export default function ScoreTallyBlock({ block, studentData }) {
  const ids = block.questionIds || [];
  const total = block.total || ids.length;

  let answered = 0;
  let correct = 0;

  for (const qId of ids) {
    const data = studentData?.[qId];
    if (data?.submitted) {
      answered++;
      if (data.correct) correct++;
    }
  }

  const allDone = answered === total;

  if (!allDone) {
    return (
      <div className="score-tally-pending">
        Answer all {total} questions to see your score — {answered}/{total} answered so far.
      </div>
    );
  }

  const pct = Math.round((correct / total) * 100);
  const { tier, message } = tierFor(pct);

  return (
    <div className={`score-tally ${tier}`}>
      <div className="score-tally-fraction">
        {correct}/{total}
      </div>
      <div className="score-tally-pct">{pct}% correct</div>
      <div className="score-tally-message">{message}</div>
    </div>
  );
}
