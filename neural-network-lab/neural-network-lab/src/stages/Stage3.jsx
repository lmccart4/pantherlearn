import { useState, useCallback } from 'react';
import FeedbackToast from '../components/FeedbackToast';
import { CREATURES, FEATURE_NAMES } from '../data/creatures';
import { trainEpoch, calculateAccuracy, randomWeights, forwardPass } from '../lib/network';

const CHALLENGES = [
  {
    id: 'c1',
    instruction: 'Train until accuracy reaches 62.5% (5/8 correct)',
    check: (acc) => acc >= 0.625,
    feedback: 'The network is starting to learn! Notice how the weights changed from their random starting values.',
    points: 7,
  },
  {
    id: 'c2',
    instruction: 'Keep training — reach 75% accuracy (6/8)',
    check: (acc) => acc >= 0.75,
    feedback: 'Getting better! Each epoch adjusts the weights a little bit based on mistakes. That\'s backpropagation in action.',
    points: 7,
  },
  {
    id: 'c3',
    instruction: 'Push to 87.5% (7/8 correct)',
    check: (acc) => acc >= 0.875,
    feedback: 'Almost perfect! Notice how the last few percent are harder — the easy patterns were learned first.',
    points: 7,
  },
  {
    id: 'c4',
    instruction: 'Hit 100% — classify all 8 creatures correctly!',
    check: (acc) => acc >= 1.0,
    feedback: 'Perfect classification! The network found the right weights all by itself — nobody told it that teeth and eye position matter. It discovered that pattern from the data.',
    points: 7,
  },
  {
    id: 'c5',
    instruction: 'Reset and reach 100% again. How many epochs this time?',
    check: (acc, epochs, wasReset) => acc >= 1.0 && wasReset,
    feedback: 'Different random starting weights = different learning path! Sometimes the network finds the answer faster, sometimes slower. That\'s why initialization matters.',
    points: 7,
  },
];

export default function Stage3({ onComplete }) {
  const initW = randomWeights(4, 2);
  const [weights, setWeights] = useState(initW);
  const [epoch, setEpoch] = useState(0);
  const [history, setHistory] = useState([{ epoch: 0, accuracy: 0, error: 1 }]);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [completed, setCompleted] = useState({});
  const [score, setScore] = useState(0);
  const [hasReset, setHasReset] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '', visible: false });
  const [isTraining, setIsTraining] = useState(false);

  const allDone = Object.keys(completed).length >= CHALLENGES.length;
  const challenge = CHALLENGES[challengeIdx];

  const { accuracy, results } = calculateAccuracy(
    CREATURES, weights.weightsIH, weights.weightsHO, weights.biasH, weights.biasO
  );

  const doTrainStep = useCallback(() => {
    const result = trainEpoch(
      CREATURES, weights.weightsIH, weights.weightsHO, weights.biasH, weights.biasO, 0.8
    );
    const newEpoch = epoch + 1;
    setWeights({
      weightsIH: result.weightsIH,
      weightsHO: result.weightsHO,
      biasH: result.biasH,
      biasO: result.biasO,
    });
    setEpoch(newEpoch);
    setHistory(prev => [...prev, { epoch: newEpoch, accuracy: result.accuracy, error: result.avgError }]);

    // Check challenge
    if (challenge && !completed[challenge.id]) {
      if (challenge.check(result.accuracy, newEpoch, hasReset)) {
        setCompleted(prev => ({ ...prev, [challenge.id]: true }));
        setScore(s => s + challenge.points);
        setFeedback({ message: `+${challenge.points} pts! ${challenge.feedback}`, type: 'correct', visible: true });
        setTimeout(() => {
          setFeedback(f => ({ ...f, visible: false }));
          if (challengeIdx < CHALLENGES.length - 1) setChallengeIdx(c => c + 1);
        }, 4000);
      }
    }
  }, [weights, epoch, challenge, completed, hasReset, challengeIdx]);

  const trainMultiple = (n) => {
    setIsTraining(true);
    let w = { ...weights };
    let ep = epoch;
    const newHist = [];

    for (let i = 0; i < n; i++) {
      const result = trainEpoch(CREATURES, w.weightsIH, w.weightsHO, w.biasH, w.biasO, 0.8);
      w = { weightsIH: result.weightsIH, weightsHO: result.weightsHO, biasH: result.biasH, biasO: result.biasO };
      ep++;
      newHist.push({ epoch: ep, accuracy: result.accuracy, error: result.avgError });
    }

    setWeights(w);
    setEpoch(ep);
    setHistory(prev => [...prev, ...newHist]);

    // Check challenges against final state
    const finalAcc = newHist[newHist.length - 1]?.accuracy || 0;
    if (challenge && !completed[challenge.id]) {
      if (challenge.check(finalAcc, ep, hasReset)) {
        setCompleted(prev => ({ ...prev, [challenge.id]: true }));
        setScore(s => s + challenge.points);
        setFeedback({ message: `+${challenge.points} pts! ${challenge.feedback}`, type: 'correct', visible: true });
        setTimeout(() => {
          setFeedback(f => ({ ...f, visible: false }));
          if (challengeIdx < CHALLENGES.length - 1) setChallengeIdx(c => c + 1);
        }, 4000);
      }
    }
    setIsTraining(false);
  };

  const handleReset = () => {
    const newW = randomWeights(4, 2);
    setWeights(newW);
    setEpoch(0);
    setHistory([{ epoch: 0, accuracy: 0, error: 1 }]);
    setHasReset(true);
    setFeedback({ message: 'Weights randomized! Train from scratch.', type: 'info', visible: true });
    setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 2000);
  };

  // Mini chart data
  const chartWidth = 500;
  const chartHeight = 120;
  const maxEpochs = Math.max(history.length - 1, 10);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={st.title}>⚡ Experiment 03: Watch It Learn</h2>
        <p style={st.desc}>
          Your network has random weights. Click <strong>"Train 1 Epoch"</strong> and watch it learn
          from its mistakes. Each epoch, it sees all 8 creatures and adjusts its weights.
        </p>
      </div>

      {/* Challenge */}
      {!allDone && challenge && (
        <div style={st.challengeCard}>
          <div style={st.challengeLabel}>Challenge {challengeIdx + 1}/{CHALLENGES.length}</div>
          <span style={{ fontSize: 14, color: 'var(--text-1)', fontFamily: 'var(--font-lab)' }}>
            {challenge.instruction}
          </span>
        </div>
      )}

      {/* Controls + Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={doTrainStep} style={st.btn} disabled={isTraining}>
          ⚡ Train 1 Epoch
        </button>
        <button onClick={() => trainMultiple(5)} style={{ ...st.btn, background: 'var(--surface-3)' }} disabled={isTraining}>
          ⚡×5
        </button>
        <button onClick={() => trainMultiple(10)} style={{ ...st.btn, background: 'var(--surface-3)' }} disabled={isTraining}>
          ⚡×10
        </button>
        <button onClick={handleReset} style={{ ...st.btn, color: 'var(--warning)', borderColor: 'var(--warning)', boxShadow: '0 0 8px rgba(255,107,44,0.15)' }}>
          🔄 Reset Weights
        </button>
      </div>

      {/* Meters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={st.meterCard}>
          <div style={st.meterLabel}>Epoch</div>
          <div style={st.meterValue}>{epoch}</div>
        </div>
        <div style={st.meterCard}>
          <div style={st.meterLabel}>Accuracy</div>
          <div style={{ ...st.meterValue, color: accuracy >= 0.875 ? 'var(--accent)' : accuracy >= 0.5 ? 'var(--accent-2)' : 'var(--danger)' }}>
            {(accuracy * 100).toFixed(1)}%
          </div>
          <div style={st.meterSub}>{results.filter(r => r.isCorrect).length}/8 correct</div>
        </div>
        <div style={st.meterCard}>
          <div style={st.meterLabel}>Avg Error</div>
          <div style={{ ...st.meterValue, color: history[history.length - 1]?.error < 0.2 ? 'var(--accent)' : 'var(--warning)' }}>
            {(history[history.length - 1]?.error || 0).toFixed(4)}
          </div>
        </div>
      </div>

      {/* Accuracy Chart */}
      <div style={st.card}>
        <div style={st.labNote}>TRAINING PROGRESS</div>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', maxHeight: 140 }}>
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1.0].map(v => (
            <g key={v}>
              <line x1={40} y1={chartHeight - v * (chartHeight - 10)} x2={chartWidth} y2={chartHeight - v * (chartHeight - 10)}
                stroke="var(--grid-line)" strokeWidth={1} />
              <text x={36} y={chartHeight - v * (chartHeight - 10) + 4} fill="var(--text-3)" fontSize={9} textAnchor="end" fontFamily="var(--font-mono)">
                {(v * 100).toFixed(0)}%
              </text>
            </g>
          ))}

          {/* Accuracy line */}
          {history.length > 1 && (
            <polyline
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2}
              points={history.map((h, i) => {
                const x = 40 + (i / maxEpochs) * (chartWidth - 50);
                const y = chartHeight - h.accuracy * (chartHeight - 10);
                return `${x},${y}`;
              }).join(' ')}
              style={{ filter: 'drop-shadow(0 0 4px var(--phosphor-dim))' }}
            />
          )}

          {/* Current dot */}
          {history.length > 0 && (() => {
            const last = history[history.length - 1];
            const x = 40 + ((history.length - 1) / maxEpochs) * (chartWidth - 50);
            const y = chartHeight - last.accuracy * (chartHeight - 10);
            return <circle cx={x} cy={y} r={4} fill="var(--accent)" style={{ filter: 'drop-shadow(0 0 6px var(--accent))' }} />;
          })()}
        </svg>
      </div>

      {/* Creature results */}
      <div style={{ ...st.card, marginTop: 12 }}>
        <div style={st.labNote}>CLASSIFICATION RESULTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6 }}>
          {results.map(r => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', background: 'var(--surface-2)',
              border: `1px solid ${r.isCorrect ? 'var(--border-bright)' : 'rgba(255,51,51,0.3)'}`,
              borderRadius: 3,
            }}>
              <span style={{ fontSize: 18 }}>{r.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-lab)', color: 'var(--text-1)' }}>{r.name}</div>
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
                color: r.isCorrect ? 'var(--accent)' : 'var(--danger)',
              }}>
                {r.isCorrect ? '✓' : '✗'} {(r.output * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {allDone && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 12 }}>
            All challenges complete! You've earned <strong>{score} points</strong>.
          </p>
          <button onClick={() => onComplete(score)} style={st.btn}>
            Proceed → Experiment 04
          </button>
        </div>
      )}

      <FeedbackToast {...feedback} />
    </div>
  );
}

const st = {
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-lab)' },
  desc: { fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 700 },
  card: {
    background: 'var(--surface)', borderRadius: 4, border: '1px solid var(--border)',
    padding: 18, backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  labNote: {
    fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-lab)', color: 'var(--accent)',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
    textShadow: '0 0 8px var(--phosphor-dim)',
  },
  challengeCard: {
    background: 'var(--accent-glow)', border: '1px solid var(--border-bright)',
    borderRadius: 4, padding: '12px 16px', marginBottom: 16,
    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
  },
  challengeLabel: {
    background: 'var(--accent)', color: '#000', padding: '3px 10px',
    borderRadius: 3, fontSize: 10, fontWeight: 700,
    fontFamily: 'var(--font-lab)', textTransform: 'uppercase', letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  btn: {
    background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--accent)',
    borderRadius: 4, padding: '8px 18px', fontSize: 13, fontWeight: 700,
    fontFamily: 'var(--font-lab)', cursor: 'pointer', letterSpacing: '0.03em',
    boxShadow: '0 0 10px var(--phosphor-dim)', textTransform: 'uppercase',
    transition: 'all 0.15s',
  },
  meterCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 4, padding: '10px 16px', minWidth: 100, textAlign: 'center',
  },
  meterLabel: {
    fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-lab)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
  },
  meterValue: {
    fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)',
    color: 'var(--accent)', textShadow: '0 0 8px var(--phosphor-dim)',
  },
  meterSub: { fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginTop: 2 },
};
