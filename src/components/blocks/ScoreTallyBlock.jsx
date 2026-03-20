// src/components/blocks/ScoreTallyBlock.jsx
// Auto-tallies correct answers from a set of question blocks.
// Block config: { id, type: "score_tally", questionIds: [...], total: 20 }

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
      <div style={{
        margin: "24px 0",
        padding: "20px 24px",
        borderRadius: "var(--radius, 12px)",
        border: "1px solid var(--border, #2a2f3d)",
        background: "var(--surface2, #1a1d2e)",
        textAlign: "center",
        color: "var(--text2, #aaa)",
        fontSize: 15,
      }}>
        Answer all {total} questions to see your score — {answered}/{total} answered so far.
      </div>
    );
  }

  const pct = Math.round((correct / total) * 100);
  let tier, color;
  // Use percentage-based tiers so they work for any total (Finding #10)
  if (pct >= 80) {
    tier = "Incredible eye! You're a natural.";
    color = "#22c55e";
  } else if (pct >= 55) {
    tier = "Solid skills — you're catching most of them.";
    color = "#3b82f6";
  } else if (pct >= 30) {
    tier = "Getting there — you're learning the patterns.";
    color = "#f59e0b";
  } else {
    tier = "Don't worry — that's exactly why this lesson exists. The more you practice, the better you get.";
    color = "#ef4444";
  }

  return (
    <div style={{
      margin: "24px 0",
      padding: "28px 24px",
      borderRadius: "var(--radius, 12px)",
      border: `2px solid ${color}`,
      background: "var(--surface2, #1a1d2e)",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 48, fontWeight: 700, color, lineHeight: 1.1 }}>
        {correct}/{total}
      </div>
      <div style={{ fontSize: 15, color: "var(--text2, #aaa)", marginTop: 4 }}>
        {pct}% correct
      </div>
      <div style={{
        marginTop: 16,
        fontSize: 16,
        color: "var(--text1, #e0e0e0)",
        fontWeight: 500,
      }}>
        {tier}
      </div>
    </div>
  );
}
