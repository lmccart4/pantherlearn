import { useState } from 'react';
import FeedbackToast from '../components/FeedbackToast';
import { CREATURES, FEATURE_NAMES, FEATURE_DESCRIPTIONS } from '../data/creatures';

// Stage 2 uses a simplified forward pass:
// - Inputs centered around 0 (subtract 0.5) so herbivore features go negative
// - No sigmoid at hidden layer (just weighted sum) so values can go negative
// - Only output layer uses sigmoid for final 0-1 classification
function stage2Forward(inputs, weightsIH, weightsHO, biasH, biasO) {
  const centered = inputs.map(v => v - 0.5);
  const hidden = biasH.map((b, h) => {
    let sum = b;
    for (let i = 0; i < centered.length; i++) {
      sum += centered[i] * weightsIH[i][h];
    }
    return sum; // raw weighted sum, no sigmoid
  });
  let outputSum = biasO;
  for (let h = 0; h < hidden.length; h++) {
    outputSum += hidden[h] * weightsHO[h];
  }
  const output = 1 / (1 + Math.exp(-outputSum));
  return { hidden, output };
}

/* ── Mini trait bar for data table ────────────────────────── */
function MiniBar({ value, label }) {
  const pct = Math.round(value * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <div style={{ width: 36, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 3,
          background: value >= 0.6 ? 'var(--accent)' : value <= 0.3 ? 'var(--danger)' : 'var(--text-3)',
          opacity: 0.8,
        }} />
      </div>
      <span style={{ fontSize: 8, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

/* ── Weight slider with built-in guidance ─────────────────── */
function WeightSlider({ label, value, onChange, hint }) {
  const absVal = Math.abs(value);
  const isPositive = value >= 0;

  const meaning = absVal < 0.15 ? 'ignored' :
    absVal < 0.4 ? (isPositive ? 'weak' : 'weak reverse') :
    absVal < 0.7 ? (isPositive ? 'important' : 'works against') :
    isPositive ? 'very important' : 'strongly against';

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
        <span style={{ fontSize: 12, color: 'var(--text-1)', fontFamily: 'var(--font-lab)', fontWeight: 600 }}>{label}</span>
        <span style={{
          fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
          color: absVal > 0.5 ? (isPositive ? 'var(--accent)' : 'var(--danger)') : 'var(--text-3)',
        }}>
          {value > 0 ? '+' : ''}{value.toFixed(2)}
          <span style={{ fontSize: 9, fontWeight: 400, marginLeft: 4, opacity: 0.7, fontStyle: 'italic' }}>
            {meaning}
          </span>
        </span>
      </div>
      {hint && (
        <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4, lineHeight: 1.4 }}>
          {hint}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 8, color: 'var(--danger)', opacity: 0.8 }}>← herbivore</span>
        <input
          type="range" min={-1} max={1} step={0.05}
          value={value} onChange={e => onChange(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--accent)', height: 4, cursor: 'pointer' }}
        />
        <span style={{ fontSize: 8, color: 'var(--accent)', opacity: 0.8 }}>carnivore →</span>
      </div>
    </div>
  );
}

/* ── Step 1: Study the Creatures ──────────────────────────── */
function StepStudy({ onNext }) {
  const carnivores = CREATURES.filter(c => c.target === 1);
  const herbivores = CREATURES.filter(c => c.target === 0);

  const traitLabels = [['flat', 'sharp'], ['slow', 'fast'], ['small', 'large'], ['side', 'front']];
  const headers = ['🦷 TEETH', '💨 SPEED', '📏 SIZE', '👁 EYES'];

  const rowStyle = {
    display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', gap: 4,
    padding: '3px 4px', alignItems: 'center',
  };

  const CreatureRow = ({ c }) => (
    <div style={rowStyle}>
      <div style={{ fontSize: 10, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 3, overflow: 'hidden' }}>
        <span style={{ fontSize: 14 }}>{c.emoji}</span>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
      </div>
      {c.inputs.map((val, i) => (
        <MiniBar key={i} value={val} label={val >= 0.7 ? traitLabels[i][1] : val <= 0.3 ? traitLabels[i][0] : '—'} />
      ))}
    </div>
  );

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
        Before you build your neural network, study the creatures below.
        <strong> What features do carnivores have that herbivores don't?</strong>
      </p>

      <div style={{ ...st.card, marginBottom: 16 }}>
        {/* Column headers */}
        <div style={{ ...rowStyle, marginBottom: 4 }}>
          <div />
          {headers.map(h => (
            <div key={h} style={{ fontSize: 8, color: 'var(--text-3)', fontFamily: 'var(--font-lab)', fontWeight: 700 }}>{h}</div>
          ))}
        </div>

        <div style={{ fontSize: 10, color: 'var(--warning)', fontWeight: 700, fontFamily: 'var(--font-lab)', margin: '4px 0 2px 4px' }}>
          CARNIVORES
        </div>
        {carnivores.map(c => <CreatureRow key={c.id} c={c} />)}

        <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

        <div style={{ fontSize: 10, color: 'var(--text-2)', fontWeight: 700, fontFamily: 'var(--font-lab)', margin: '4px 0 2px 4px' }}>
          HERBIVORES
        </div>
        {herbivores.map(c => <CreatureRow key={c.id} c={c} />)}
      </div>

      {/* Pattern reveal */}
      <div style={{
        padding: '10px 14px', background: 'rgba(57,255,20,0.06)',
        borderRadius: 4, border: '1px solid rgba(57,255,20,0.1)', marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-lab)', marginBottom: 6 }}>
          🔑 KEY PATTERNS
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.8 }}>
          <div>🦷 <strong>Teeth:</strong> Carnivores = sharp, Herbivores = flat → <strong style={{ color: 'var(--accent)' }}>✅ Reliable!</strong></div>
          <div>👁 <strong>Eyes:</strong> Carnivores = front, Herbivores = side → <strong style={{ color: 'var(--accent)' }}>✅ Reliable!</strong></div>
          <div>💨 <strong>Speed:</strong> Some herbivores are fast too (🐇🦌) → <strong style={{ color: 'var(--warning)' }}>⚠️ Tricky</strong></div>
          <div>📏 <strong>Size:</strong> Some carnivores are tiny (🦅🐍) → <strong style={{ color: 'var(--warning)' }}>⚠️ Tricky</strong></div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={onNext} style={st.btn}>Got it — let's build! →</button>
      </div>
    </div>
  );
}

/* ── Step 2: Build Detector 1 ─────────────────────────────── */
function StepDetector1({ weightsIH, updateWeightIH, onRun, results, bestScore, attempts, onAddD2, onComplete, points, canProceed }) {
  const score = results ? results.filter(r => r.isCorrect).length : null;

  const sliderHints = [
    'Carnivores: 0.8–0.95 (sharp). Herbivores: 0.1–0.15 (flat). This is the strongest signal!',
    '⚠️ Tricky — Dust Rabbit (🐇) and Mist Deer (🦌) are fast herbivores. Be careful with this one.',
    '⚠️ Tricky — Storm Hawk (🦅) and Venom Serpent (🐍) are tiny carnivores. Size can be misleading!',
    'Carnivores: 0.8–0.9 (front-facing). Herbivores: 0.15–0.2 (side-facing). Very reliable!',
  ];

  function getHint(creature) {
    const isCarnivore = creature.target === 1;
    if (isCarnivore) {
      if (creature.inputs[2] <= 0.3) return 'Has sharp teeth & front eyes, but is tiny. Size slider might be hurting — try zero.';
      if (creature.inputs[1] <= 0.5) return 'Has sharp teeth & front eyes, but isn\'t fast. Speed slider might not help — try zero.';
      return 'Has sharp teeth & front-facing eyes. Slide those features right!';
    } else {
      if (creature.inputs[1] >= 0.6) return 'Fast but it\'s an herbivore! Speed can be misleading — try setting it near zero.';
      if (creature.inputs[2] >= 0.7) return 'Large but it\'s an herbivore! Size can be misleading — try setting it near zero.';
      return 'Flat teeth & side eyes = herbivore. Teeth and Eyes sliders should handle this.';
    }
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
        For each feature, decide: does it make a creature more likely to be a <strong style={{ color: 'var(--warning)' }}>carnivore</strong> or <strong>herbivore</strong>?
        Slide right for carnivore, left for herbivore, leave in the middle to ignore.
      </p>

      <div style={{ ...st.card, marginBottom: 16 }}>
        <div style={st.labNote}>🔍 DETECTOR 1 — Set the weights</div>
        {FEATURE_NAMES.map((name, i) => (
          <WeightSlider
            key={i}
            label={name}
            value={weightsIH[i][0]}
            onChange={updateWeightIH(i, 0)}
            hint={sliderHints[i]}
          />
        ))}

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button onClick={onRun} style={st.btn}>⚡ Run Experiment</button>
          {attempts > 0 && (
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6 }}>
              Attempt #{attempts} · Best: {bestScore}/8
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div style={{ ...st.card, marginBottom: 16 }}>
          <div style={st.labNote}>
            RESULTS
            <span style={{
              float: 'right', fontFamily: 'var(--font-mono)',
              color: score >= 7 ? 'var(--accent)' : score >= 5 ? 'var(--warning)' : 'var(--danger)',
            }}>
              {score}/8
            </span>
          </div>

          {score === 8 && (
            <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>
              🎉 PERFECT!
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {results.map(r => {
              const predicted = r.output >= 0.5 ? 'Carnivore' : 'Herbivore';
              const actual = r.target === 1 ? 'Carnivore' : 'Herbivore';
              return (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 4,
                  background: r.isCorrect ? 'rgba(57,255,20,0.04)' : 'rgba(255,50,50,0.06)',
                  border: `1px solid ${r.isCorrect ? 'rgba(57,255,20,0.15)' : 'rgba(255,50,50,0.15)'}`,
                }}>
                  <span style={{ fontSize: 14 }}>{r.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)', flex: 1, fontFamily: 'var(--font-lab)' }}>
                    {r.name}
                  </span>
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
                    color: r.isCorrect ? 'var(--accent)' : 'var(--danger)',
                  }}>
                    {r.isCorrect ? '✅' : '❌'} {predicted}
                  </span>
                  {!r.isCorrect && (
                    <span style={{ fontSize: 9, color: 'var(--text-3)' }}>
                      (actually {actual})
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hints for wrong creatures */}
          {results.some(r => !r.isCorrect) && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-lab)', color: 'var(--warning)', marginBottom: 6 }}>
                💡 HOW TO FIX
              </div>
              {results.filter(r => !r.isCorrect).map(r => (
                <div key={r.id} style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 4, lineHeight: 1.4 }}>
                  <strong>{r.emoji} {r.name}:</strong> {getHint(r)}
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {score < 8 && (
              <button onClick={onAddD2} style={{
                ...st.btn, background: 'transparent', color: 'var(--text-2)',
                border: '1px solid var(--border)', boxShadow: 'none', fontSize: 12,
              }}>
                Need more power? Add Detector 2 →
              </button>
            )}
          </div>
        </div>
      )}

      {canProceed && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 10 }}>
            {bestScore === 8 ? 'Perfect score!' : bestScore >= 7 ? 'Excellent work!' : 'Good enough to move on — but can you do better?'}
          </p>
          <button onClick={() => onComplete(points)} style={st.btn}>
            Proceed → Experiment 03 ({points} pts)
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Step 3: Add Detector 2 ───────────────────────────────── */
function StepDetector2({ weightsIH, weightsHO, updateWeightIH, updateWeightHO, onRun, onBack, results, bestScore, attempts, onComplete, points, canProceed }) {
  const score = results ? results.filter(r => r.isCorrect).length : null;

  function getHint(creature) {
    const isCarnivore = creature.target === 1;
    if (isCarnivore) {
      if (creature.inputs[2] <= 0.3) return 'Tiny carnivore — try a different Size weight on D2.';
      if (creature.inputs[1] <= 0.5) return 'Slow carnivore — D2 could focus less on speed.';
      return 'Strong carnivore traits — check D2\'s Teeth and Eyes weights.';
    } else {
      if (creature.inputs[1] >= 0.6) return 'Fast herbivore — D2 could penalize speed.';
      if (creature.inputs[2] >= 0.7) return 'Large herbivore — D2 could penalize size.';
      return 'Check which features are confusing D2.';
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--text-3)',
          cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-lab)',
        }}>
          ← Back to Detector 1
        </button>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
        Detector 2 gives you a <strong>second opinion</strong>. It can focus on different features
        than Detector 1 to catch the tricky creatures D1 gets wrong.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {/* D2 Sliders */}
        <div style={{ ...st.card, flex: '1 1 300px', minWidth: 280 }}>
          <div style={st.labNote}>🔍 DETECTOR 2 — Second opinion</div>
          {FEATURE_NAMES.map((name, i) => (
            <WeightSlider
              key={i}
              label={name}
              value={weightsIH[i][1]}
              onChange={updateWeightIH(i, 1)}
            />
          ))}

          <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(255,200,0,0.04)', borderRadius: 4, border: '1px solid rgba(255,200,0,0.15)' }}>
            <div style={{ fontSize: 10, color: 'var(--warning)', fontFamily: 'var(--font-lab)', fontWeight: 700, marginBottom: 6 }}>
              ⚖️ TRUST EACH DETECTOR
            </div>
            <WeightSlider label="Trust Detector 1" value={weightsHO[0]} onChange={updateWeightHO(0)} />
            <WeightSlider label="Trust Detector 2" value={weightsHO[1]} onChange={updateWeightHO(1)} />
          </div>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button onClick={onRun} style={st.btn}>⚡ Run Experiment</button>
            {attempts > 0 && (
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6 }}>
                Attempt #{attempts} · Best: {bestScore}/8
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div style={{ ...st.card, flex: '1 1 300px', minWidth: 280 }}>
            <div style={st.labNote}>
              RESULTS
              <span style={{
                float: 'right', fontFamily: 'var(--font-mono)',
                color: score >= 7 ? 'var(--accent)' : score >= 5 ? 'var(--warning)' : 'var(--danger)',
              }}>
                {score}/8
              </span>
            </div>

            {score === 8 && (
              <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>
                🎉 PERFECT!
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {results.map(r => {
                const predicted = r.output >= 0.5 ? 'Carnivore' : 'Herbivore';
                const actual = r.target === 1 ? 'Carnivore' : 'Herbivore';
                return (
                  <div key={r.id} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 8px', borderRadius: 4,
                    background: r.isCorrect ? 'rgba(57,255,20,0.04)' : 'rgba(255,50,50,0.06)',
                    border: `1px solid ${r.isCorrect ? 'rgba(57,255,20,0.15)' : 'rgba(255,50,50,0.15)'}`,
                  }}>
                    <span style={{ fontSize: 12 }}>{r.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-1)', flex: 1, fontFamily: 'var(--font-lab)' }}>
                      {r.name}
                    </span>
                    <span style={{
                      fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: r.isCorrect ? 'var(--accent)' : 'var(--danger)',
                    }}>
                      {r.isCorrect ? '✅' : '❌'}
                    </span>
                  </div>
                );
              })}
            </div>

            {results.some(r => !r.isCorrect) && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-lab)', color: 'var(--warning)', marginBottom: 4 }}>
                  💡 HINTS
                </div>
                {results.filter(r => !r.isCorrect).map(r => (
                  <div key={r.id} style={{ fontSize: 10, color: 'var(--text-2)', marginBottom: 3, lineHeight: 1.4 }}>
                    <strong>{r.emoji} {r.name}:</strong> {getHint(r)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {canProceed && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 10 }}>
            {bestScore === 8 ? 'Perfect score!' : bestScore >= 7 ? 'Excellent work!' : 'Good enough to move on!'}
          </p>
          <button onClick={() => onComplete(points)} style={st.btn}>
            Proceed → Experiment 03 ({points} pts)
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Stage 2 Component ───────────────────────────────── */
export default function Stage2({ onComplete }) {
  const [step, setStep] = useState(1); // 1=study, 2=detector1, 3=detector2
  const [weightsIH, setWeightsIH] = useState([
    [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0],
  ]);
  const [weightsHO, setWeightsHO] = useState([1.0, 0.0]);
  const [biasH] = useState([0, 0]);
  const [biasO] = useState(0);
  const [results, setResults] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '', visible: false });

  const runExperiment = () => {
    const res = CREATURES.map(c => {
      const { output } = stage2Forward(c.inputs, weightsIH, weightsHO, biasH, biasO);
      const predicted = output >= 0.5 ? 1 : 0;
      return { ...c, output, predicted, isCorrect: predicted === c.target };
    });
    setResults(res);
    setAttempts(a => a + 1);

    const correct = res.filter(r => r.isCorrect).length;
    if (correct > bestScore) setBestScore(correct);

    if (correct >= 7) {
      setFeedback({ message: `${correct}/8 correct! ${correct === 8 ? 'Perfect!' : 'Almost there!'}`, type: 'correct', visible: true });
    } else if (correct >= 5) {
      setFeedback({ message: `${correct}/8 — getting warmer!`, type: 'info', visible: true });
    } else {
      setFeedback({ message: `${correct}/8 — check the hints below.`, type: 'wrong', visible: true });
    }
    setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 3000);
  };

  const updateWeightIH = (i, h) => (val) => {
    setWeightsIH(prev => {
      const copy = prev.map(r => [...r]);
      copy[i][h] = val;
      return copy;
    });
  };

  const updateWeightHO = (h) => (val) => {
    setWeightsHO(prev => {
      const copy = [...prev];
      copy[h] = val;
      return copy;
    });
  };

  const points = bestScore >= 8 ? 35 : bestScore >= 7 ? 25 : bestScore >= 5 ? 15 : 5;
  const canProceed = bestScore >= 5;

  // Step indicator
  const stepLabels = ['Study', 'Detector 1', 'Detector 2'];
  const maxReachedStep = step;

  return (
    <div>
      <h2 style={st.title}>🧬 Experiment 02: Build-a-Brain</h2>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, alignItems: 'center' }}>
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isPast = stepNum < step;
          const isLocked = stepNum === 3 && step < 3;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                onClick={() => {
                  if (isPast || isActive) setStep(stepNum);
                  if (stepNum === 3 && step >= 2 && results) setStep(3);
                }}
                style={{
                  padding: '4px 12px', borderRadius: 3, fontSize: 11,
                  fontFamily: 'var(--font-lab)', fontWeight: 700, cursor: isLocked ? 'default' : 'pointer',
                  background: isActive ? 'var(--accent)' : isPast ? 'rgba(57,255,20,0.15)' : 'var(--surface-2)',
                  color: isActive ? 'var(--bg)' : isPast ? 'var(--accent)' : 'var(--text-3)',
                  border: `1px solid ${isActive ? 'var(--accent)' : isPast ? 'rgba(57,255,20,0.3)' : 'var(--border)'}`,
                  opacity: isLocked ? 0.4 : 1,
                }}
              >
                {stepNum}. {label}
              </div>
              {i < stepLabels.length - 1 && (
                <span style={{ color: 'var(--text-3)', fontSize: 10 }}>→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      {step === 1 && (
        <StepStudy onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <StepDetector1
          weightsIH={weightsIH}
          updateWeightIH={updateWeightIH}
          onRun={runExperiment}
          results={results}
          bestScore={bestScore}
          attempts={attempts}
          onAddD2={() => { setWeightsHO([1.0, 1.0]); setStep(3); }}
          onComplete={onComplete}
          points={points}
          canProceed={canProceed}
        />
      )}

      {step === 3 && (
        <StepDetector2
          weightsIH={weightsIH}
          weightsHO={weightsHO}
          updateWeightIH={updateWeightIH}
          updateWeightHO={updateWeightHO}
          onRun={runExperiment}
          onBack={() => { setWeightsHO([1.0, 0.0]); setStep(2); }}
          results={results}
          bestScore={bestScore}
          attempts={attempts}
          onComplete={onComplete}
          points={points}
          canProceed={canProceed}
        />
      )}

      <FeedbackToast {...feedback} />
    </div>
  );
}

const st = {
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-lab)' },
  card: {
    background: 'var(--surface)', borderRadius: 4, border: '1px solid var(--border)',
    padding: 16, backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  labNote: {
    fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-lab)', color: 'var(--accent)',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
    textShadow: '0 0 8px var(--phosphor-dim)',
  },
  btn: {
    background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--accent)',
    borderRadius: 4, padding: '10px 24px', fontSize: 14, fontWeight: 700,
    fontFamily: 'var(--font-lab)', cursor: 'pointer', letterSpacing: '0.03em',
    boxShadow: '0 0 12px var(--phosphor-dim)', textTransform: 'uppercase',
  },
};
