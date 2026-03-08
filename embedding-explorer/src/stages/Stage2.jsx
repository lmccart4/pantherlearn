import { useState } from 'react';
import FeedbackToast from '../components/FeedbackToast';

const CHALLENGES = [
  {
    id: 's2q1',
    type: 'match',
    prompt: 'Each word has been turned into 3 numbers called a "vector." The dimensions represent: [animal-ness, machine-ness, cuddly-ness]. Which word matches this vector?',
    vector: [0.91, 0.12, 0.85],
    options: ['car', 'dog', 'sad', 'computer'],
    correct: 1,
    explanation: 'High animal-ness (0.91), low machine-ness (0.12), high cuddly-ness (0.85) = dog! Cars and computers would have high machine-ness, and "sad" isn\'t an animal.',
    points: 7,
  },
  {
    id: 's2q2',
    type: 'match',
    prompt: 'Same dimensions: [animal-ness, machine-ness, cuddly-ness]. What word does this vector represent?',
    vector: [0.10, 0.85, 0.15],
    options: ['cat', 'pizza', 'car', 'happy'],
    correct: 2,
    explanation: 'Low animal-ness (0.10), high machine-ness (0.85), low cuddly-ness (0.15) — that\'s a car! Pizza isn\'t a machine, and cats are animals.',
    points: 7,
  },
  {
    id: 's2q3',
    type: 'distance',
    prompt: 'Which pair of words has the SMALLEST distance between their embeddings (most similar)?',
    options: [
      'dog ↔ cat',
      'dog ↔ airplane',
      'happy ↔ sad',
      'basketball ↔ soccer',
    ],
    correct: 3,
    explanation: 'Basketball and soccer are both team sports played with a ball — their embeddings are almost identical! Dog and cat are close too, but basketball-soccer edges them out. Happy and sad are OPPOSITES, so they\'re actually far apart in embedding space.',
    points: 7,
  },
  {
    id: 's2q4',
    type: 'mc',
    prompt: 'In embedding space, which statement is TRUE?',
    options: [
      'Words that start with the same letter are always close together',
      'Words with similar meanings are close together',
      'Longer words have bigger embedding numbers',
      'All nouns are placed in the same spot',
    ],
    correct: 1,
    explanation: 'Embeddings capture MEANING, not spelling! "Happy" and "joyful" are close because they mean similar things, even though they look nothing alike as text. Spelling, word length, and grammar don\'t matter — only meaning does.',
    points: 4,
  },
];

export default function Stage2({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '', visible: false });

  const q = CHALLENGES[currentQ];

  const handleAnswer = (idx) => {
    if (answers[q.id] !== undefined) return;
    const isCorrect = idx === q.correct;
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
    setShowExplanation(true);
    if (isCorrect) {
      setScore(s => s + q.points);
      setFeedback({ message: `+${q.points} points! Great reasoning!`, type: 'correct', visible: true });
    } else {
      setFeedback({ message: 'Not quite — check the explanation below!', type: 'wrong', visible: true });
    }
    setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 3000);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQ < CHALLENGES.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      onComplete(score);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={s.title}>🔢 Stage 2: Number Detectives</h2>
        <p style={s.desc}>
          AI doesn't use a visual grid — it uses <strong>numbers</strong> to represent meaning.
          Each word becomes a list of numbers called a <strong>vector</strong>.
          Every number ranges from <strong>0 to 1</strong> — a higher number means a stronger
          association. For example, 0.9 animal-ness means "very much an animal," while
          0.1 means "barely related to animals at all." Can you crack the code?
        </p>
      </div>

      <div style={s.card}>
        {/* Counter */}
        <div style={s.counter}>
          <span>Question {currentQ + 1} of {CHALLENGES.length}</span>
          <span style={s.pointsBadge}>{q.points} pts</span>
        </div>

        {/* Prompt */}
        <p style={s.prompt}>{q.prompt}</p>

        {/* Vector display */}
        {q.vector && (
          <div style={s.vectorBox}>
            <span style={s.bracket}>[</span>
            {q.vector.map((v, i) => (
              <span key={i}>
                <span style={s.num}>{v}</span>
                {i < q.vector.length - 1 && <span style={s.comma}>, </span>}
              </span>
            ))}
            <span style={s.bracket}>]</span>
          </div>
        )}

        {/* Options */}
        <div style={s.options}>
          {q.options.map((opt, i) => {
            const answered = answers[q.id] !== undefined;
            const isSelected = answers[q.id] === i;
            const isCorrect = i === q.correct;

            let bg = 'var(--surface-2)';
            let border = '1px solid var(--border)';
            let opacity = 1;

            if (answered) {
              if (isCorrect) {
                bg = 'rgba(16, 185, 129, 0.15)';
                border = '2px solid #10b981';
              } else if (isSelected) {
                bg = 'rgba(239, 68, 68, 0.15)';
                border = '2px solid #ef4444';
              } else {
                opacity = 0.4;
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                style={{
                  ...s.optBtn,
                  background: bg,
                  border,
                  opacity,
                  cursor: answered ? 'default' : 'pointer',
                }}
              >
                <span style={s.optLetter}>{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div style={s.explanation}>
            <strong>💡 Explanation:</strong> {q.explanation}
          </div>
        )}

        {/* Next button */}
        {showExplanation && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={handleNext} style={s.btn}>
              {currentQ < CHALLENGES.length - 1 ? 'Next Question →' : 'Continue → Stage 3'}
            </button>
          </div>
        )}
      </div>

      <FeedbackToast {...feedback} />
    </div>
  );
}

const s = {
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' },
  desc: { fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 640 },
  card: {
    background: 'var(--surface)',
    borderRadius: 16,
    border: '1px solid var(--border)',
    padding: 28,
  },
  counter: {
    fontSize: 12,
    color: 'var(--text-3)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsBadge: {
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
    padding: '3px 10px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
  },
  prompt: {
    fontSize: 16,
    lineHeight: 1.65,
    marginBottom: 20,
    color: 'var(--text-1)',
  },
  vectorBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    background: 'var(--surface-2)',
    borderRadius: 12,
    padding: '14px 24px',
    marginBottom: 20,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 22,
  },
  bracket: { color: 'var(--text-3)', fontWeight: 300, fontSize: 24 },
  num: { color: '#818cf8', fontWeight: 600 },
  comma: { color: 'var(--text-3)' },
  options: { display: 'flex', flexDirection: 'column', gap: 8 },
  optBtn: {
    padding: '14px 18px',
    borderRadius: 10,
    fontSize: 14,
    color: 'var(--text-1)',
    textAlign: 'left',
    lineHeight: 1.5,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    transition: 'all 0.2s',
  },
  optLetter: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: 'var(--surface-3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--text-3)',
    flexShrink: 0,
  },
  explanation: {
    marginTop: 20,
    padding: 18,
    background: 'rgba(99,102,241,0.08)',
    borderRadius: 12,
    border: '1px solid rgba(99,102,241,0.2)',
    fontSize: 14,
    lineHeight: 1.65,
    color: 'var(--text-2)',
  },
  btn: {
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 28px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
  },
};
