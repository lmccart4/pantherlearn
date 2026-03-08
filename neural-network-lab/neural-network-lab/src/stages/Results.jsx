import { useEffect } from 'react';

const STAGE_META = {
  stage1: { name: 'The Human Network', icon: '⚗️', num: '01' },
  stage2: { name: 'Build-a-Brain', icon: '🧬', num: '02' },
  stage3: { name: 'Watch It Learn', icon: '⚡', num: '03' },
  stage4: { name: 'Brains in the Wild', icon: '🌍', num: '04' },
};

export default function Results({ scores, maxScores, onMount }) {
  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const maxTotal = Object.values(maxScores).reduce((s, v) => s + v, 0);
  const pct = Math.round((total / maxTotal) * 100);
  const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';

  useEffect(() => { if (onMount) onMount(); }, []);

  const getMessage = () => {
    if (pct >= 90) return 'OUTSTANDING. You built, trained, and tested a neural network — and understand how real AI systems learn from data. Subject demonstrates exceptional aptitude.';
    if (pct >= 80) return 'EXCELLENT. Solid understanding of neural networks, weights, and training. Review missed items to reach mastery. Subject shows strong potential.';
    if (pct >= 70) return 'GOOD. Core concepts understood. Revisit the training experiment to strengthen understanding of how weights adjust. Subject progressing well.';
    if (pct >= 60) return 'SATISFACTORY. Foundations are forming. Focus on the connection between training data, weights, and network decisions. Subject should continue experimentation.';
    return 'NEEDS REVIEW. Neural networks are complex — re-run the experiments and pay close attention to how weights change during training. Further lab time recommended.';
  };

  return (
    <div>
      <div style={s.card}>
        {/* Header */}
        <div style={s.headerLabel}>EXPERIMENT LOG — FINAL REPORT</div>
        <h2 style={s.title}>Lab Session Complete</h2>

        {/* Grade */}
        <div style={s.gradeRow}>
          <div style={s.gradeBox}>
            <div style={s.gradeLabel}>GRADE</div>
            <div style={s.gradeValue}>{grade}</div>
          </div>
          <div>
            <div style={s.scoreNum}>{total} / {maxTotal}</div>
            <div style={s.pctLabel}>{pct}% accuracy</div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={s.breakdown}>
          <div style={s.sectionLabel}>EXPERIMENT RESULTS</div>
          {Object.entries(STAGE_META).map(([key, meta]) => {
            const sc = scores[key] || 0;
            const mx = maxScores[key] || 0;
            const p = mx > 0 ? Math.round((sc / mx) * 100) : 0;

            return (
              <div key={key} style={s.row}>
                <div style={s.rowLeft}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>EXP.{meta.num}</span>
                  <span style={{ fontSize: 15 }}>{meta.icon}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-2)', fontFamily: 'var(--font-lab)' }}>{meta.name}</span>
                </div>
                <div style={s.barWrap}>
                  <div style={{
                    ...s.barFill, width: `${p}%`,
                    background: p >= 80 ? 'var(--accent)' : p >= 50 ? 'var(--accent-2)' : 'var(--danger)',
                    boxShadow: p >= 80 ? '0 0 6px var(--phosphor-dim)' : 'none',
                  }} />
                </div>
                <span style={s.rowScore}>{sc}/{mx}</span>
              </div>
            );
          })}
        </div>

        {/* Assessment */}
        <div style={s.assessmentBox}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-lab)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            LAB ASSESSMENT
          </div>
          {getMessage()}
        </div>

        {/* Takeaways */}
        <div style={s.takeaways}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-lab)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            KEY DISCOVERIES
          </div>
          {[
            'Neural networks learn by adjusting the WEIGHTS of connections between neurons',
            'Training = feeding examples through the network and correcting mistakes (backpropagation)',
            'Knowledge lives in the weights — not in code anyone wrote',
            'Networks can be fragile (adversarial attacks) and biased (from biased training data)',
          ].map((item, i) => (
            <div key={i} style={s.takeawayItem}>
              <span style={s.takeawayNum}>0{i + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    background: 'var(--surface)', borderRadius: 4, border: '1px solid var(--border)',
    padding: '36px 32px', maxWidth: 560, margin: '0 auto',
    backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  headerLabel: {
    fontSize: 10, fontFamily: 'var(--font-lab)', color: 'var(--accent)',
    textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center',
    marginBottom: 6, textShadow: '0 0 8px var(--phosphor-dim)',
  },
  title: {
    fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-lab)',
    textAlign: 'center', marginBottom: 28, color: 'var(--text-1)',
  },
  gradeRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 24, marginBottom: 32,
  },
  gradeBox: { textAlign: 'center' },
  gradeLabel: {
    fontSize: 9, fontFamily: 'var(--font-lab)', color: 'var(--text-3)',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
  },
  gradeValue: {
    fontSize: 48, fontWeight: 700, fontFamily: 'var(--font-lab)',
    color: 'var(--accent)', textShadow: '0 0 20px var(--phosphor-dim)',
    lineHeight: 1,
  },
  scoreNum: { fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-1)' },
  pctLabel: { fontSize: 14, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginTop: 2 },

  breakdown: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 10, fontFamily: 'var(--font-lab)', color: 'var(--text-3)',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
  },
  row: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  rowLeft: { display: 'flex', alignItems: 'center', gap: 6, width: 200, flexShrink: 0 },
  barWrap: { flex: 1, height: 6, background: 'var(--surface-3)', borderRadius: 1, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 1, transition: 'width 1s ease' },
  rowScore: { fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', width: 42, textAlign: 'right', flexShrink: 0 },

  assessmentBox: {
    fontSize: 14, lineHeight: 1.6, color: 'var(--text-2)',
    background: 'var(--surface-2)', borderRadius: 4,
    border: '1px solid var(--border)', padding: 16, marginBottom: 20,
    fontFamily: 'var(--font-lab)', letterSpacing: '0.01em',
  },

  takeaways: {
    background: 'var(--accent-glow)', border: '1px solid var(--border-bright)',
    borderRadius: 4, padding: 16,
  },
  takeawayItem: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    marginBottom: 8, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5,
  },
  takeawayNum: {
    fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
    color: 'var(--accent)', flexShrink: 0, marginTop: 2,
  },
};
