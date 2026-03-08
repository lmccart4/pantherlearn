import { useEffect } from 'react';

const STAGE_LABELS = {
  stage1: { name: 'The Sorting Game', icon: '🧩' },
  stage2: { name: 'Number Detectives', icon: '🔢' },
  stage3: { name: 'The Embedding Machine', icon: '🔬' },
  stage4: { name: 'Why It Matters', icon: '🌍' },
};

export default function Results({ scores, maxScores, onMount }) {
  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const maxTotal = Object.values(maxScores).reduce((s, v) => s + v, 0);
  const pct = Math.round((total / maxTotal) * 100);
  const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';
  const emoji = pct >= 90 ? '🏆' : pct >= 80 ? '⭐' : pct >= 70 ? '👍' : pct >= 60 ? '📚' : '💪';

  const gradeColor = pct >= 90 ? '#10b981' : pct >= 80 ? '#3b82f6' : pct >= 70 ? '#f59e0b' : pct >= 60 ? '#f97316' : '#ef4444';

  useEffect(() => {
    if (onMount) onMount();
  }, []);

  const getMessage = () => {
    if (pct >= 90) return "Outstanding! You've mastered the fundamentals of embeddings. You understand how AI turns meaning into numbers — and why that matters.";
    if (pct >= 80) return "Great work! You have a solid understanding of embeddings. Review any questions you missed to push your understanding even further.";
    if (pct >= 70) return "Good job! You're building a solid foundation. Take another look at the stages where you lost points — embeddings are worth understanding deeply.";
    if (pct >= 60) return "You're on the right track! Embeddings are a tricky concept. Review the explanations from each stage to strengthen your understanding.";
    return "Embeddings are one of the trickier AI concepts — don't worry if it hasn't fully clicked yet. Review the stage explanations and try the activity again!";
  };

  return (
    <div>
      <div style={s.card}>
        {/* Header */}
        <div style={s.emojiWrap}>{emoji}</div>
        <h2 style={s.title}>Activity Complete!</h2>

        {/* Grade & Score */}
        <div style={s.gradeRow}>
          <div style={{ ...s.gradeCircle, background: `linear-gradient(135deg, ${gradeColor}, ${gradeColor}dd)` }}>
            {grade}
          </div>
          <div>
            <div style={s.scoreNum}>{total} / {maxTotal}</div>
            <div style={s.pctLabel}>{pct}%</div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={s.breakdown}>
          <h3 style={s.breakdownTitle}>Score Breakdown</h3>
          {Object.entries(STAGE_LABELS).map(([key, meta]) => {
            const sc = scores[key] || 0;
            const mx = maxScores[key] || 0;
            const p = mx > 0 ? Math.round((sc / mx) * 100) : 0;
            const barColor = p >= 80 ? '#10b981' : p >= 50 ? '#f59e0b' : '#ef4444';

            return (
              <div key={key} style={s.row}>
                <div style={s.rowLeft}>
                  <span style={{ fontSize: 16 }}>{meta.icon}</span>
                  <span style={s.rowLabel}>{meta.name}</span>
                </div>
                <div style={s.barWrap}>
                  <div style={{ ...s.barFill, width: `${p}%`, background: barColor }} />
                </div>
                <span style={s.rowScore}>{sc}/{mx}</span>
              </div>
            );
          })}
        </div>

        {/* Message */}
        <div style={s.messageBox}>
          {getMessage()}
        </div>

        {/* Key takeaways */}
        <div style={s.takeaways}>
          <h3 style={s.takeawaysTitle}>🎯 Key Takeaways</h3>
          <div style={s.takeawayItem}>
            <span style={s.takeawayNum}>1</span>
            <span>Embeddings turn words into numbers that capture <strong>meaning</strong></span>
          </div>
          <div style={s.takeawayItem}>
            <span style={s.takeawayNum}>2</span>
            <span>Similar words have <strong>similar numbers</strong> (close in embedding space)</span>
          </div>
          <div style={s.takeawayItem}>
            <span style={s.takeawayNum}>3</span>
            <span>AI uses embeddings for search, recommendations, translation, and more</span>
          </div>
          <div style={s.takeawayItem}>
            <span style={s.takeawayNum}>4</span>
            <span>Embeddings can carry <strong>biases</strong> from their training data</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    textAlign: 'center',
    background: 'var(--surface)',
    borderRadius: 20,
    border: '1px solid var(--border)',
    padding: '40px 32px',
    maxWidth: 540,
    margin: '0 auto',
  },
  emojiWrap: { fontSize: 60, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 24, letterSpacing: '-0.02em' },
  gradeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 32,
  },
  gradeCircle: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    color: '#fff',
    fontSize: 30,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  scoreNum: { fontSize: 26, fontWeight: 700, color: 'var(--text-1)' },
  pctLabel: { fontSize: 15, color: 'var(--text-3)', marginTop: 2 },

  breakdown: { textAlign: 'left', marginBottom: 24 },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-3)',
    marginBottom: 14,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  rowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: 180,
    flexShrink: 0,
  },
  rowLabel: { fontSize: 13, fontWeight: 500, color: 'var(--text-2)' },
  barWrap: {
    flex: 1,
    height: 8,
    background: 'var(--surface-3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 1s ease',
  },
  rowScore: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-2)',
    width: 48,
    textAlign: 'right',
    flexShrink: 0,
    fontFamily: "'JetBrains Mono', monospace",
  },

  messageBox: {
    fontSize: 14,
    lineHeight: 1.65,
    color: 'var(--text-2)',
    background: 'var(--surface-2)',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    textAlign: 'left',
  },

  takeaways: {
    textAlign: 'left',
    background: 'rgba(99,102,241,0.06)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: 12,
    padding: 18,
  },
  takeawaysTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 12,
    color: 'var(--text-1)',
  },
  takeawayItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
    fontSize: 13,
    color: 'var(--text-2)',
    lineHeight: 1.5,
  },
  takeawayNum: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1,
  },
};
