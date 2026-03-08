import { useState } from 'react';
import FeedbackToast from '../components/FeedbackToast';

const QUESTIONS = [
  {
    id: 's4q1',
    prompt: 'Spotify recommends songs you might like based on what you\'ve listened to. How do embeddings help with this?',
    options: [
      'Spotify reads the song lyrics and picks songs with similar words',
      'Songs are converted into embeddings, and Spotify finds songs whose embeddings are close to ones you already like',
      'Spotify just picks random songs from the same genre',
      'Embeddings have nothing to do with music recommendations',
    ],
    correct: 1,
    explanation: 'Spotify converts songs into embeddings that capture genre, tempo, mood, and style. Songs with similar embeddings sound similar — so if you like one, you\'ll probably like nearby songs in embedding space!',
    points: 6,
  },
  {
    id: 's4q2',
    prompt: 'When you Google "how to fix a flat tire," you also get results for "tire repair tutorial." Why?',
    options: [
      'Google just matches the word "tire" in both searches',
      'The two phrases have similar embeddings because they mean the same thing, even with different words',
      'Google has a hand-made list of synonyms it checks',
      'It\'s just a coincidence',
    ],
    correct: 1,
    explanation: 'Embeddings capture MEANING, not just individual words. "Fix a flat tire" and "tire repair tutorial" have very similar embeddings because they describe the same concept — even though they use completely different words.',
    points: 6,
  },
  {
    id: 's4q3',
    prompt: 'A researcher finds that in an AI\'s embedding space, "doctor" is closer to "man" than to "woman." What does this suggest?',
    options: [
      'The AI is correct — most doctors are men',
      'The training data probably had more examples associating doctors with men, so the AI learned a biased pattern',
      'Embeddings can\'t capture gender at all',
      'This means the AI is broken and should be deleted',
    ],
    correct: 1,
    explanation: 'This is a real problem called embedding bias! If training data over-represents certain associations (doctor→man, nurse→woman), the AI\'s embeddings will reflect those biases. Researchers actively work to detect and reduce these biases.',
    points: 7,
  },
  {
    id: 's4q4',
    prompt: 'Why are embeddings so important for modern AI?',
    options: [
      'They make AI look smarter but don\'t actually do anything useful',
      'They\'re only used for word games and puzzles',
      'They let AI understand similarity and relationships — the foundation for search, recommendations, translation, and more',
      'They\'re an outdated technology that has already been replaced',
    ],
    correct: 2,
    explanation: 'Embeddings are the backbone of modern AI! They\'re how AI understands that things are similar, related, or different. Without embeddings, AI couldn\'t do search, recommendations, translation, image recognition, or most of the things we use it for every day.',
    points: 6,
  },
];

export default function Stage4({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [reflection, setReflection] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '', visible: false });

  const q = QUESTIONS[currentQ];

  const handleAnswer = (idx) => {
    if (answers[q.id] !== undefined) return;
    const isCorrect = idx === q.correct;
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
    setShowExplanation(true);
    if (isCorrect) {
      setScore(s => s + q.points);
      setFeedback({ message: `+${q.points} points!`, type: 'correct', visible: true });
    } else {
      setFeedback({ message: 'Not quite — read the explanation!', type: 'wrong', visible: true });
    }
    setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 3000);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      setShowReflection(true);
    }
  };

  const handleSubmitReflection = () => {
    const reflectionPts = reflection.trim().length > 50 ? 5 : reflection.trim().length > 20 ? 3 : reflection.trim().length > 0 ? 1 : 0;
    onComplete(score + reflectionPts);
  };

  // ── Reflection view ──────────────────────────────────
  if (showReflection) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={s.title}>✍️ Final Reflection</h2>
          <p style={s.desc}>
            Think about everything you've learned today. In your own words, explain
            what an embedding is and why it matters for AI. Try to use an analogy
            or a real-world example to make it clear!
          </p>
        </div>

        <div style={s.card}>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="An embedding is like... It matters because..."
            style={s.textarea}
            rows={6}
          />
          <div style={s.charCount}>
            {reflection.length} characters
            {reflection.length >= 50 ? ' ✅ Full credit' : reflection.length >= 20 ? ' 👍 Partial credit' : ' (write more for full credit)'}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={handleSubmitReflection}
              disabled={reflection.trim().length === 0}
              style={{
                ...s.btn,
                opacity: reflection.trim().length === 0 ? 0.4 : 1,
                cursor: reflection.trim().length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Submit & See My Results →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MC questions view ────────────────────────────────
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={s.title}>🌍 Stage 4: Why It Matters</h2>
        <p style={s.desc}>
          Embeddings power the AI tools you use every day.
          Let's connect what you've learned to the real world.
        </p>
      </div>

      <div style={s.card}>
        <div style={s.counter}>
          <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span style={s.pointsBadge}>{q.points} pts</span>
        </div>

        <p style={s.prompt}>{q.prompt}</p>

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

        {showExplanation && (
          <div style={s.explanation}>
            <strong>💡</strong> {q.explanation}
          </div>
        )}

        {showExplanation && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={handleNext} style={s.btn}>
              {currentQ < QUESTIONS.length - 1 ? 'Next Question →' : 'Final Reflection →'}
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
    alignItems: 'flex-start',
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
    marginTop: 2,
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
  textarea: {
    width: '100%',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 16,
    color: 'var(--text-1)',
    fontSize: 15,
    lineHeight: 1.6,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    minHeight: 140,
  },
  charCount: {
    fontSize: 12,
    color: 'var(--text-3)',
    textAlign: 'right',
    marginTop: 6,
  },
  btn: {
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 28px',
    fontSize: 15,
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
  },
};
