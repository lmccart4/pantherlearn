import { useState, useMemo } from 'react';
import FeedbackToast from '../components/FeedbackToast';
import { PIXEL_SHAPES, topHalfMask, bottomHalfMask, createMask } from '../data/creatures';

const ROUNDS = [
  {
    id: 'r1',
    title: 'Round 1: Full View',
    desc: 'You can see the entire image. Classify the shape.',
    maskType: 'full',
    intro: 'Easy mode — you get to see everything. What shape is this?',
  },
  {
    id: 'r2',
    title: 'Round 2: Top Half Only',
    desc: 'Now you can only see the TOP half. The bottom is hidden. Can you still guess?',
    maskType: 'top',
    intro: 'Harder now — you\'re a neuron that only sees the top half of the image.',
  },
  {
    id: 'r3',
    title: 'Round 3: Random 5 Pixels',
    desc: 'You can only see 5 random pixels. Nearly impossible alone... but watch what happens when we combine multiple neurons.',
    maskType: 'random5',
    intro: 'This is what it\'s like to be a SINGLE neuron — you only see a tiny piece. But your network has many neurons...',
  },
];

function PixelGrid({ shape, mask, size = 48 }) {
  const gridSize = shape.grid.length;
  const cellSize = size / gridSize;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
      gap: 1,
      background: 'var(--border)',
      border: '1px solid var(--border-bright)',
      borderRadius: 2,
      padding: 1,
    }}>
      {shape.grid.flat().map((cell, idx) => {
        const isVisible = !mask || mask.has(idx);
        return (
          <div
            key={idx}
            style={{
              width: cellSize,
              height: cellSize,
              background: !isVisible
                ? 'var(--surface-3)'
                : cell === 1
                ? 'var(--accent)'
                : 'var(--surface)',
              boxShadow: isVisible && cell === 1 ? '0 0 4px var(--phosphor-dim)' : 'none',
              transition: 'background 0.3s',
            }}
          />
        );
      })}
    </div>
  );
}

export default function Stage1({ onComplete }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [guess, setGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showCombine, setShowCombine] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '', visible: false });
  const [mcAnswer, setMcAnswer] = useState(null);
  const [showMC, setShowMC] = useState(false);
  const [mcDone, setMcDone] = useState(false);

  // Pick random shapes for each round
  const roundShapes = useMemo(() => {
    const shuffled = [...PIXEL_SHAPES].sort(() => Math.random() - 0.5);
    return ROUNDS.map((_, i) => shuffled[i % shuffled.length]);
  }, []);

  const round = ROUNDS[roundIdx];
  const shape = roundShapes[roundIdx];
  const allRoundsDone = roundIdx >= ROUNDS.length;

  const mask = useMemo(() => {
    if (!round) return null;
    if (round.maskType === 'full') return null;
    if (round.maskType === 'top') return topHalfMask(5);
    if (round.maskType === 'random5') return createMask(5, 5);
    return null;
  }, [roundIdx]);

  // Extra masks for the "combine neurons" reveal in round 3
  const neuronMasks = useMemo(() => {
    if (roundIdx !== 2) return [];
    return [createMask(5, 5), createMask(5, 5), createMask(5, 5)];
  }, [roundIdx]);

  const handleGuess = (shapeName) => {
    setGuess(shapeName);
    setShowResult(true);
    const isCorrect = shapeName === shape.name;
    if (isCorrect) {
      setFeedback({ message: 'Correct classification!', type: 'correct', visible: true });
    } else {
      setFeedback({ message: `It was a ${shape.name}! Hard to tell with limited data.`, type: 'info', visible: true });
    }
    setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 3000);
  };

  const handleNextRound = () => {
    if (roundIdx === 2 && !showCombine) {
      setShowCombine(true);
      return;
    }
    setGuess(null);
    setShowResult(false);
    setShowCombine(false);
    if (roundIdx < ROUNDS.length - 1) {
      setRoundIdx(r => r + 1);
    } else {
      setShowMC(true);
    }
  };

  const handleMC = (idx) => {
    if (mcAnswer !== null) return;
    setMcAnswer(idx);
    const correct = idx === 1;
    if (correct) {
      setScore(s => s + 5);
      setFeedback({ message: '+5 pts!', type: 'correct', visible: true });
    } else {
      setFeedback({ message: 'Not quite — check the explanation!', type: 'wrong', visible: true });
    }
    setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 3000);
  };

  const handleMC2 = (idx) => {
    const correct = idx === 2;
    if (correct) setScore(s => s + 5);
    setMcDone(true);
    setFeedback({
      message: correct ? '+5 pts! That\'s the key insight.' : 'Close — read the explanation!',
      type: correct ? 'correct' : 'wrong',
      visible: true,
    });
    setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 3000);
  };

  // ── MC Questions after rounds ────────────────────────
  if (showMC && !mcDone) {
    return (
      <div>
        <h2 style={s.title}>⚗️ Experiment 01: Analysis</h2>
        <div style={s.card}>
          <div style={s.labNote}>LAB NOTE #01-A</div>
          <p style={s.prompt}>
            Why could the network still classify the shape correctly even when each "neuron" only saw a few pixels?
          </p>
          <div style={s.options}>
            {[
              'Each neuron guessed randomly and got lucky',
              'Each neuron captured different partial information, and combining them revealed the full pattern',
              'The network memorized all possible shapes',
              'It only works with simple shapes',
            ].map((opt, i) => {
              const answered = mcAnswer !== null;
              const isCorrect = i === 1;
              const isSelected = mcAnswer === i;
              return (
                <button
                  key={i}
                  onClick={() => handleMC(i)}
                  disabled={answered}
                  style={{
                    ...s.optBtn,
                    background: answered && isCorrect ? 'rgba(57,255,20,0.1)' : answered && isSelected ? 'rgba(255,51,51,0.1)' : 'var(--surface-2)',
                    border: answered && isCorrect ? '1px solid var(--accent)' : answered && isSelected ? '1px solid var(--danger)' : '1px solid var(--border)',
                    opacity: answered && !isSelected && !isCorrect ? 0.4 : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {mcAnswer !== null && (
            <>
              <div style={s.explanation}>
                <strong>⚗️ Finding:</strong> Each neuron sees a different piece of the puzzle.
                When their signals are combined in the next layer, the network assembles a complete picture.
                This is why neural networks use LAYERS — each layer combines information from the layer before it.
              </div>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button onClick={() => handleMC2(2)} style={{ ...s.btn, marginRight: 8, opacity: 0, pointerEvents: 'none', position: 'absolute' }} />
                <p style={{ ...s.prompt, marginBottom: 16, marginTop: 24 }}>
                  In a neural network, where does the "knowledge" live?
                </p>
                <div style={s.options}>
                  {[
                    'In the code the programmer writes',
                    'In the input data',
                    'In the connections (weights) between neurons',
                    'In the output layer only',
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleMC2(i)}
                      style={{
                        ...s.optBtn,
                        background: mcDone && i === 2 ? 'rgba(57,255,20,0.1)' : 'var(--surface-2)',
                        border: mcDone && i === 2 ? '1px solid var(--accent)' : '1px solid var(--border)',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <FeedbackToast {...feedback} />
      </div>
    );
  }

  if (mcDone) {
    return (
      <div>
        <h2 style={s.title}>⚗️ Experiment 01: Complete</h2>
        <div style={s.card}>
          <div style={s.explanation}>
            <strong>⚗️ Key Finding:</strong> A neural network's knowledge lives in the <strong>weights</strong> — the
            strength of connections between neurons. Nobody programs the answer; the network
            discovers it by adjusting those connections. That's what you'll do next.
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button onClick={() => onComplete(score)} style={s.btn}>
              Proceed → Experiment 02
            </button>
          </div>
        </div>
        <FeedbackToast {...feedback} />
      </div>
    );
  }

  // ── Round view ───────────────────────────────────────
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={s.title}>⚗️ Experiment 01: The Human Network</h2>
        <p style={s.desc}>
          Before we build an artificial brain, let's see if <strong>you</strong> can be one.
          Can you classify shapes when you can only see part of the picture?
        </p>
      </div>

      <div style={s.card}>
        <div style={s.labNote}>{round.title}</div>
        <p style={{ color: 'var(--text-2)', marginBottom: 16, fontSize: 14, fontStyle: 'italic' }}>
          {round.intro}
        </p>

        {/* Grid display */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, fontFamily: 'var(--font-lab)', textTransform: 'uppercase' }}>
              Your View
            </div>
            <PixelGrid shape={shape} mask={mask} size={120} />
          </div>

          {showResult && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, fontFamily: 'var(--font-lab)', textTransform: 'uppercase' }}>
                Full Image
              </div>
              <PixelGrid shape={shape} mask={null} size={120} />
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-lab)' }}>
                {shape.name}
              </div>
            </div>
          )}
        </div>

        {/* Neuron combination reveal for round 3 */}
        {showCombine && roundIdx === 2 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-lab)', textAlign: 'center', marginBottom: 10 }}>
              ── OTHER NEURONS IN YOUR NETWORK ──
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              {neuronMasks.map((m, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4, fontFamily: 'var(--font-lab)' }}>
                    Neuron {i + 2}
                  </div>
                  <PixelGrid shape={shape} mask={m} size={60} />
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 13, marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
              Each neuron only saw 5 pixels — but together, the network had enough information to identify the shape.
              <strong> Layers combine partial signals into full understanding.</strong>
            </p>
          </div>
        )}

        {/* Guess buttons */}
        {!showResult && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {PIXEL_SHAPES.map(s => (
              <button
                key={s.name}
                onClick={() => handleGuess(s.name)}
                style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 4, padding: '8px 16px', color: 'var(--text-1)',
                  fontSize: 13, fontFamily: 'var(--font-lab)', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {showResult && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button onClick={handleNextRound} style={s.btn}>
              {roundIdx === 2 && !showCombine ? 'See How the Network Combines Neurons →' :
               roundIdx < ROUNDS.length - 1 ? 'Next Round →' : 'Analyze Results →'}
            </button>
          </div>
        )}
      </div>

      <FeedbackToast {...feedback} />
    </div>
  );
}

const s = {
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-lab)', letterSpacing: '-0.01em' },
  desc: { fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 640 },
  card: {
    background: 'var(--surface)', borderRadius: 4, border: '1px solid var(--border)',
    padding: 28, backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  labNote: {
    fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-lab)', color: 'var(--accent)',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
    textShadow: '0 0 8px var(--phosphor-dim)',
  },
  prompt: { fontSize: 15, lineHeight: 1.6, marginBottom: 16, color: 'var(--text-1)' },
  options: { display: 'flex', flexDirection: 'column', gap: 8 },
  optBtn: {
    padding: '12px 16px', borderRadius: 4, fontSize: 14, color: 'var(--text-1)',
    textAlign: 'left', lineHeight: 1.5, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
  },
  explanation: {
    marginTop: 16, padding: 16, background: 'var(--accent-glow)',
    borderRadius: 4, border: '1px solid var(--border-bright)',
    fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)',
  },
  btn: {
    background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--accent)',
    borderRadius: 4, padding: '10px 24px', fontSize: 14, fontWeight: 700,
    fontFamily: 'var(--font-lab)', cursor: 'pointer', letterSpacing: '0.03em',
    boxShadow: '0 0 12px var(--phosphor-dim)', transition: 'all 0.2s',
    textTransform: 'uppercase',
  },
};
