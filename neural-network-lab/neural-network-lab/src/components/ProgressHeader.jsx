export default function ProgressHeader({ stage, totalStages, score, maxPossible, stageNames }) {
  const pct = (stage / totalStages) * 100;

  return (
    <div style={s.wrap}>
      <div style={s.row}>
        <div style={s.stages}>
          {stageNames.map((name, i) => {
            const done = i < stage;
            const active = i === stage;
            return (
              <div
                key={i}
                style={{
                  ...s.pill,
                  background: done ? 'var(--accent)' : active ? 'var(--accent-dim)' : 'var(--surface-2)',
                  color: done ? '#000' : active ? 'var(--accent)' : 'var(--text-3)',
                  fontWeight: active ? 700 : 500,
                  border: active ? '1px solid var(--accent)' : '1px solid transparent',
                  boxShadow: done ? '0 0 8px var(--phosphor-dim)' : 'none',
                }}
              >
                <span style={s.pillNum}>{done ? '✓' : `0${i + 1}`}</span>
                <span style={s.pillLabel}>{name}</span>
              </div>
            );
          })}
        </div>
        <div style={s.scoreChip}>
          <span style={{ fontSize: 14 }}>⚡</span>
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{score}</span>
          <span style={{ color: 'var(--text-3)', fontSize: 12 }}>/ {maxPossible}</span>
        </div>
      </div>
      <div style={s.track}>
        <div style={{
          ...s.fill,
          width: `${pct}%`,
          boxShadow: pct > 0 ? '0 0 8px var(--phosphor-dim)' : 'none',
        }} />
      </div>
    </div>
  );
}

const s = {
  wrap: { maxWidth: 820, margin: '0 auto', padding: '16px 24px 8px', width: '100%' },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 12, marginBottom: 10, flexWrap: 'wrap',
  },
  stages: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  pill: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '5px 12px', borderRadius: 4, fontSize: 12,
    fontFamily: 'var(--font-lab)', transition: 'all 0.3s',
    letterSpacing: '0.02em',
  },
  pillNum: { fontWeight: 700, minWidth: 18, textAlign: 'center' },
  pillLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' },
  scoreChip: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 4, padding: '5px 14px', fontSize: 14,
    fontFamily: 'var(--font-lab)',
  },
  track: {
    height: 3, background: 'var(--surface-3)', borderRadius: 1, overflow: 'hidden',
  },
  fill: {
    height: '100%', background: 'var(--accent)', borderRadius: 1,
    transition: 'width 0.5s ease',
  },
};
