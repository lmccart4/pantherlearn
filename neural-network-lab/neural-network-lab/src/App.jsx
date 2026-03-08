import { useState } from 'react';
import ProgressHeader from './components/ProgressHeader';
import Stage1 from './stages/Stage1';
import Stage2 from './stages/Stage2';
import Stage3 from './stages/Stage3';
import Stage4 from './stages/Stage4';
import Results from './stages/Results';
import { sendScoreToPantherLearn } from './lib/pantherlearn';

const STAGE_NAMES = ['Human Net', 'Build', 'Train', 'Apply'];
const MAX_SCORES = { stage1: 10, stage2: 35, stage3: 35, stage4: 25 };

export default function App() {
  const [stage, setStage] = useState(0);
  const [scores, setScores] = useState({ stage1: 0, stage2: 0, stage3: 0, stage4: 0 });

  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);
  const totalMax = Object.values(MAX_SCORES).reduce((s, v) => s + v, 0);

  const completeStage = (stageKey) => (pts) => {
    setScores(prev => ({ ...prev, [stageKey]: pts }));
    setStage(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResultsMount = () => {
    const finalTotal = Object.values(scores).reduce((s, v) => s + v, 0);
    sendScoreToPantherLearn(finalTotal, totalMax);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={h.wrap}>
        <div style={h.inner}>
          <div style={h.logoArea}>
            <div style={h.iconWrap}>
              <span style={h.icon}>🧠</span>
            </div>
            <div>
              <div style={h.label}>CLASSIFIED · EXPERIMENT SERIES NN-04</div>
              <h1 style={h.title}>The Neural Network Lab</h1>
              <p style={h.sub}>Build an artificial brain. Train it. Watch it learn.</p>
            </div>
          </div>
        </div>
        {/* Decorative scanline bar */}
        <div style={h.scanline} />
      </header>

      {/* Progress */}
      {stage < 4 && (
        <ProgressHeader
          stage={stage}
          totalStages={4}
          score={totalScore}
          maxPossible={totalMax}
          stageNames={STAGE_NAMES}
        />
      )}

      {/* Content */}
      <main style={{ flex: 1, maxWidth: 820, margin: '0 auto', padding: '20px 24px 40px', width: '100%' }}>
        {stage === 0 && <Stage1 onComplete={completeStage('stage1')} />}
        {stage === 1 && <Stage2 onComplete={completeStage('stage2')} />}
        {stage === 2 && <Stage3 onComplete={completeStage('stage3')} />}
        {stage === 3 && <Stage4 onComplete={completeStage('stage4')} />}
        {stage === 4 && <Results scores={scores} maxScores={MAX_SCORES} onMount={handleResultsMount} />}
      </main>

      {/* Footer */}
      <footer style={h.footer}>
        <span style={{ fontFamily: 'var(--font-lab)', letterSpacing: '0.05em' }}>
          PantherLearn · Neural Network Lab · AI Literacy · CLASSIFIED
        </span>
      </footer>
    </div>
  );
}

const h = {
  wrap: {
    background: 'linear-gradient(180deg, rgba(57,255,20,0.06) 0%, transparent 100%)',
    borderBottom: '1px solid var(--border)',
    padding: '20px 24px 16px',
    position: 'relative',
  },
  inner: {
    maxWidth: 820, margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logoArea: { display: 'flex', alignItems: 'center', gap: 16 },
  iconWrap: {
    width: 52, height: 52, borderRadius: 4,
    background: 'var(--surface)', border: '1px solid var(--border-bright)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 12px var(--phosphor-dim)',
    animation: 'pulse-glow 3s ease-in-out infinite',
  },
  icon: { fontSize: 28 },
  label: {
    fontSize: 9, fontFamily: 'var(--font-lab)', color: 'var(--accent)',
    textTransform: 'uppercase', letterSpacing: '0.12em',
    textShadow: '0 0 6px var(--phosphor-dim)',
    marginBottom: 2,
  },
  title: {
    fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-lab)',
    color: 'var(--text-1)', letterSpacing: '-0.01em', lineHeight: 1.2,
  },
  sub: { fontSize: 13, color: 'var(--text-3)', marginTop: 2 },
  scanline: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
    background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
    opacity: 0.3,
  },
  footer: {
    textAlign: 'center', padding: '16px 24px', fontSize: 10,
    color: 'var(--text-3)', borderTop: '1px solid var(--border)',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
};
