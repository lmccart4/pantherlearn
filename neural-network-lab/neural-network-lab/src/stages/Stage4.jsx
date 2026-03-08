import { useState } from 'react';
import FeedbackToast from '../components/FeedbackToast';

const QUESTIONS = [
  {
    id: 's4q1',
    prompt: 'Your phone can unlock just by looking at your face. How does Face ID use neural networks?',
    options: [
      'It stores a photo of your face and compares pixels one by one',
      'A neural network learns the patterns and features of your face (eye spacing, jawline, etc.) and recognizes them even in different lighting',
      'It uses your fingerprint hidden in the camera',
      'It just checks if there\'s any face at all — it doesn\'t know whose face it is',
    ],
    correct: 1,
    explanation: 'Face ID uses a neural network trained on your face\'s unique features — the distance between your eyes, the shape of your nose, your jawline. It learns these patterns through weights, just like your creature classifier learned that sharp teeth = carnivore.',
    points: 5,
  },
  {
    id: 's4q2',
    prompt: 'YouTube seems to "know" exactly what video you want to watch next. How do neural networks help with this?',
    options: [
      'YouTube randomly shows popular videos until you click one',
      'A human at YouTube personally picks videos for each user',
      'Neural networks process your watch history, likes, and behavior to predict what you\'ll want to watch next',
      'YouTube just shows the newest videos in order',
    ],
    correct: 2,
    explanation: 'YouTube\'s recommendation system uses deep neural networks that take your watch history as INPUT, process it through many layers (like the hidden layers in your creature network), and OUTPUT a ranked list of videos you\'re most likely to watch.',
    points: 5,
  },
  {
    id: 's4q3',
    prompt: 'A self-driving car\'s neural network is trained to recognize stop signs. But when someone puts stickers on a stop sign, the car drives right through it. What does this reveal?',
    options: [
      'The car\'s camera must be broken',
      'Neural networks can be fragile — small changes to inputs can cause completely wrong outputs, even when a human would still recognize the sign',
      'Self-driving cars don\'t actually use neural networks',
      'The stickers turned the stop sign into a different sign',
    ],
    correct: 1,
    explanation: 'This is called an "adversarial attack." Neural networks can be surprisingly fragile — tiny changes that wouldn\'t fool a human can completely break the network\'s classification. It\'s a major safety concern for AI in critical systems.',
    points: 5,
  },
  {
    id: 's4q4',
    prompt: 'A company trains a neural network to screen job applications. The AI keeps rejecting applicants from certain zip codes that happen to be predominantly minority neighborhoods. The developers never included race as an input. What went wrong?',
    options: [
      'The AI is being intentionally racist',
      'Zip codes are random and shouldn\'t affect anything',
      'The training data contained historical hiring bias — the network learned that pattern through proxy features like zip code, even without race as a direct input',
      'Neural networks can\'t be biased because they\'re just math',
    ],
    correct: 2,
    explanation: 'Neural networks learn whatever patterns exist in the training data — including biased ones. If historical data shows that people from certain zip codes were hired less (due to past discrimination), the network will learn that zip code predicts rejection. The bias flows from data → weights → decisions, even without the developer intending it.',
    points: 5,
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
      setFeedback({ message: `+${q.points} pts!`, type: 'correct', visible: true });
    } else {
      setFeedback({ message: 'Not quite — read the lab findings!', type: 'wrong', visible: true });
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
    const pts = reflection.trim().length > 60 ? 5 : reflection.trim().length > 25 ? 3 : reflection.trim().length > 0 ? 1 : 0;
    onComplete(score + pts);
  };

  // ── Reflection ───────────────────────────────────────
  if (showReflection) {
    return (
      <div>
        <h2 style={s.title}>📋 Final Lab Report</h2>
        <div style={s.card}>
          <div style={s.labNote}>EXPERIMENT CONCLUSION</div>
          <p style={{ ...s.prompt, marginBottom: 16 }}>
            You've built, trained, and tested a neural network. In your own words:
            <strong> What does a neural network actually "learn"? Where does its knowledge live?</strong>
            Try to explain it like you're teaching a friend who's never heard of AI.
          </p>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="A neural network learns by... Its knowledge is stored in..."
            style={s.textarea}
            rows={6}
          />
          <div style={s.charCount}>
            {reflection.length} chars
            {reflection.length >= 60 ? ' ✅ Full credit' : reflection.length >= 25 ? ' 👍 Partial' : ' (write more for full credit)'}
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
              ⚡ Submit & See Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MC questions ─────────────────────────────────────
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={s.title}>🌍 Experiment 04: Brains in the Wild</h2>
        <p style={s.desc}>
          Your lab experiments are done. But neural networks are already out there — in your pocket,
          in your car, in your school. Let's see where.
        </p>
      </div>

      <div style={s.card}>
        <div style={s.labNote}>
          FIELD OBSERVATION {currentQ + 1}/{QUESTIONS.length}
          <span style={{ float: 'right', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
            {q.points} pts
          </span>
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
                bg = 'rgba(57,255,20,0.08)';
                border = '1px solid var(--accent)';
              } else if (isSelected) {
                bg = 'rgba(255,51,51,0.08)';
                border = '1px solid var(--danger)';
              } else {
                opacity = 0.35;
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                style={{ ...s.optBtn, background: bg, border, opacity, cursor: answered ? 'default' : 'pointer' }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div style={s.explanation}>
            <strong>⚗️ Finding:</strong> {q.explanation}
          </div>
        )}

        {showExplanation && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={handleNext} style={s.btn}>
              {currentQ < QUESTIONS.length - 1 ? 'Next Observation →' : 'Write Lab Report →'}
            </button>
          </div>
        )}
      </div>

      <FeedbackToast {...feedback} />
    </div>
  );
}

const s = {
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-lab)' },
  desc: { fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 640 },
  card: {
    background: 'var(--surface)', borderRadius: 4, border: '1px solid var(--border)',
    padding: 24, backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  labNote: {
    fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-lab)', color: 'var(--accent)',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14,
    textShadow: '0 0 8px var(--phosphor-dim)',
  },
  prompt: { fontSize: 15, lineHeight: 1.65, marginBottom: 20, color: 'var(--text-1)' },
  options: { display: 'flex', flexDirection: 'column', gap: 8 },
  optBtn: {
    padding: '13px 16px', borderRadius: 4, fontSize: 14, color: 'var(--text-1)',
    textAlign: 'left', lineHeight: 1.5, fontWeight: 500, transition: 'all 0.2s',
  },
  explanation: {
    marginTop: 20, padding: 16, background: 'var(--accent-glow)',
    borderRadius: 4, border: '1px solid var(--border-bright)',
    fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)',
  },
  textarea: {
    width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)',
    borderRadius: 4, padding: 16, color: 'var(--text-1)', fontSize: 15,
    lineHeight: 1.6, outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)',
    minHeight: 140,
  },
  charCount: { fontSize: 12, color: 'var(--text-3)', textAlign: 'right', marginTop: 6, fontFamily: 'var(--font-mono)' },
  btn: {
    background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--accent)',
    borderRadius: 4, padding: '10px 24px', fontSize: 14, fontWeight: 700,
    fontFamily: 'var(--font-lab)', cursor: 'pointer', letterSpacing: '0.03em',
    boxShadow: '0 0 12px var(--phosphor-dim)', textTransform: 'uppercase',
  },
};
