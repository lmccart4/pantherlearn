import { useState, useEffect } from 'react';
import ProgressHeader from './components/ProgressHeader';
import Stage1 from './stages/Stage1';
import Stage2 from './stages/Stage2';
import Stage3 from './stages/Stage3';
import Stage4 from './stages/Stage4';
import Results from './stages/Results';
import { signInWithGoogle, onAuthChange, saveProgress, loadProgress } from './lib/pantherlearn';

const STAGE_NAMES = ['Sort', 'Detect', 'Explore', 'Apply'];
const MAX_SCORES = { stage1: 10, stage2: 25, stage3: 40, stage4: 30 };

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [stage, setStage] = useState(0);
  const [scores, setScores] = useState({ stage1: 0, stage2: 0, stage3: 0, stage4: 0 });
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const saved = await loadProgress(u);
        if (saved && saved.stage > 0) {
          setStage(saved.stage);
          setScores(saved.scores);
          setRestored(true);
        }
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);
  const totalMax = Object.values(MAX_SCORES).reduce((s, v) => s + v, 0);

  const completeStage = (stageKey) => (pts) => {
    const newScores = { ...scores, [stageKey]: pts };
    const newStage = stage + 1;
    setScores(newScores);
    setStage(newStage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    saveProgress(user, newStage, newScores, MAX_SCORES).catch(err => {
      console.error('Failed to save progress:', err);
    });
  };

  const handleResultsMount = () => {
    // Don't re-save when restoring from Firestore — scores are already saved
    if (restored) return;
    saveProgress(user, 4, scores, MAX_SCORES).catch(err => {
      console.error('Failed to save final score:', err);
    });
  };

  // Sign-in gate
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🧬</div>
          <div style={{ fontSize: 14 }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          textAlign: 'center', maxWidth: 400, background: 'var(--surface)',
          borderRadius: 20, border: '1px solid var(--border)', padding: '48px 32px',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🧬</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
            The Embedding Explorer
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 32, lineHeight: 1.5 }}>
            Sign in with your school Google account to save your progress.
          </p>
          <button
            onClick={() => signInWithGoogle().catch(err => console.error('Sign-in failed:', err))}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '14px 20px', borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.08 24.08 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={headerStyles.wrap}>
        <div style={headerStyles.inner}>
          <div style={headerStyles.logoArea}>
            <span style={headerStyles.icon}>🧬</span>
            <div>
              <h1 style={headerStyles.title}>The Embedding Explorer</h1>
              <p style={headerStyles.sub}>Discover how AI understands meaning through numbers</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user.photoURL && (
              <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)' }} referrerPolicy="no-referrer" />
            )}
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{user.displayName?.split(' ')[0]}</span>
          </div>
        </div>
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

      {/* Stage content */}
      <main style={{ flex: 1, maxWidth: 800, margin: '0 auto', padding: '20px 24px 40px', width: '100%' }}>
        {stage === 0 && <Stage1 onComplete={completeStage('stage1')} />}
        {stage === 1 && <Stage2 onComplete={completeStage('stage2')} />}
        {stage === 2 && <Stage3 onComplete={completeStage('stage3')} />}
        {stage === 3 && <Stage4 onComplete={completeStage('stage4')} />}
        {stage === 4 && <Results scores={scores} maxScores={MAX_SCORES} onMount={handleResultsMount} />}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '16px 24px', fontSize: 12, color: 'var(--text-3)', borderTop: '1px solid var(--border)' }}>
        <span>PantherLearn · Embedding Explorer · AI Literacy</span>
      </footer>
    </div>
  );
}

const headerStyles = {
  wrap: {
    background: 'linear-gradient(180deg, rgba(99,102,241,0.12) 0%, transparent 100%)',
    borderBottom: '1px solid var(--border)',
    padding: '20px 24px',
  },
  inner: {
    maxWidth: 800,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoArea: { display: 'flex', alignItems: 'center', gap: 14 },
  icon: { fontSize: 36 },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-1)',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  sub: { fontSize: 13, color: 'var(--text-3)', marginTop: 2 },
};
