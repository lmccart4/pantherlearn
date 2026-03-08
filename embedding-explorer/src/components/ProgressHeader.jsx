export default function ProgressHeader({ stage, totalStages, score, maxPossible, stageNames }) {
  const pct = ((stage) / totalStages) * 100;

  return (
    <div style={s.wrap}>
      <div style={s.row}>
        <div style={s.stages}>
          {stageNames.map((name, i) => (
            <div
              key={i}
              style={{
                ...s.pill,
                background: i < stage ? 'var(--accent)' : i === stage ? 'var(--accent-dim)' : 'var(--surface-2)',
                color: i <= stage ? '#fff' : 'var(--text-3)',
                fontWeight: i === stage ? 700 : 500,
                border: i === stage ? '1px solid var(--accent)' : '1px solid transparent',
              }}
            >
              <span style={s.pillNum}>{i < stage ? '✓' : i + 1}</span>
              <span style={s.pillLabel}>{name}</span>
            </div>
          ))}
        </div>
        <div style={s.scoreChip}>
          <span style={{ fontSize: 14 }}>⚡</span>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{score}</span>
          <span style={{ color: 'var(--text-3)', fontSize: 12 }}>/ {maxPossible} pts</span>
        </div>
      </div>
      <div style={s.track}>
        <div style={{ ...s.fill, width: `${pct}%` }} />
      </div>
    </div>
  );
}

const s = {
  wrap: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '16px 24px 8px',
    width: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  stages: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    borderRadius: 20,
    fontSize: 12,
    transition: 'all 0.3s',
  },
  pillNum: { fontWeight: 700, minWidth: 14, textAlign: 'center' },
  pillLabel: { fontSize: 12 },
  scoreChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '5px 14px',
    fontSize: 14,
    fontWeight: 600,
  },
  track: {
    height: 4,
    background: 'var(--surface-3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #818cf8)',
    borderRadius: 2,
    transition: 'width 0.5s ease',
  },
};
