import { useState, useRef } from 'react';
import FeedbackToast from '../components/FeedbackToast';
import { WORD_DATABASE, CATEGORY_COLORS } from '../data/words';

const SORT_WORDS = [
  'dog', 'car', 'happy', 'basketball', 'pizza',
  'cat', 'airplane', 'sad', 'soccer', 'guitar',
  'bird', 'bicycle', 'excited', 'sushi', 'computer',
];

export default function Stage1({ onComplete }) {
  const [placed, setPlaced] = useState({});
  const [dragging, setDragging] = useState(null);
  const [showReveal, setShowReveal] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '', visible: false });
  const gridRef = useRef(null);

  const remaining = SORT_WORDS.filter(w => !placed[w]);
  const placedCount = Object.keys(placed).length;

  const handleDragStart = (word) => (e) => {
    setDragging(word);
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain') || dragging;
    if (!word || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.max(0.03, Math.min(0.97, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0.03, Math.min(0.97, (e.clientY - rect.top) / rect.height));
    setPlaced(prev => ({ ...prev, [word]: { x, y } }));
    setDragging(null);
  };

  const handleTouchMove = (word) => (e) => {
    e.preventDefault(); // prevent scroll
    setDragging(word);
  };

  const handleTouchEnd = (word) => (e) => {
    if (!gridRef.current) return;
    const touch = e.changedTouches[0];
    const rect = gridRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      setPlaced(prev => ({
        ...prev,
        [word]: { x: Math.max(0.03, Math.min(0.97, x)), y: Math.max(0.03, Math.min(0.97, y)) },
      }));
    }
    setDragging(null);
  };

  const handleReveal = () => {
    setShowReveal(true);
    setFeedback({
      message: 'You just did what AI does with embeddings — turning words into positions based on meaning!',
      type: 'info',
      visible: true,
    });
    setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 5000);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={s.title}>🧩 Stage 1: The Sorting Game</h2>
        <p style={s.desc}>
          Drag each word onto the grid below. Place <strong>similar words close together</strong> and{' '}
          <strong>different words far apart</strong>. There are no wrong answers — go with your gut!
        </p>
      </div>

      {/* Word bank */}
      <div style={s.wordBank}>
        <div style={s.bankLabel}>Word Bank — drag to grid ↓</div>
        <div style={s.bankWords}>
          {remaining.map(word => (
            <div
              key={word}
              draggable
              onDragStart={handleDragStart(word)}
              onTouchMove={handleTouchMove(word)}
              onTouchEnd={handleTouchEnd(word)}
              style={{
                ...s.chip,
                opacity: dragging === word ? 0.4 : 1,
              }}
            >
              {word}
            </div>
          ))}
          {remaining.length === 0 && (
            <span style={{ color: 'var(--text-3)', fontStyle: 'italic', fontSize: 13 }}>
              All words placed! ✅
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
        onDrop={handleDrop}
        style={s.grid}
      >
        {/* Corner labels */}
        <div style={{ ...s.cornerLabel, top: 8, left: 12 }}>Different ↑</div>
        <div style={{ ...s.cornerLabel, bottom: 8, right: 12 }}>Similar →</div>

        {/* Placed words */}
        {Object.entries(placed).map(([word, pos]) => (
          <div
            key={word}
            draggable
            onDragStart={handleDragStart(word)}
            style={{
              position: 'absolute',
              left: `${pos.x * 100}%`,
              top: `${pos.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              ...s.placedWord,
            }}
          >
            {word}
          </div>
        ))}

        {/* AI overlay dots */}
        {showReveal && SORT_WORDS.map(word => {
          const data = WORD_DATABASE[word];
          if (!data) return null;
          const color = CATEGORY_COLORS[data.category];
          return (
            <div
              key={`ai-${word}`}
              style={{
                position: 'absolute',
                left: `${data.x * 100}%`,
                top: `${(1 - data.y) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: color,
                  border: '2px solid #fff',
                  boxShadow: `0 0 12px ${color}, 0 0 4px ${color}`,
                }}
              />
              <div
                style={{
                  marginTop: 3,
                  fontSize: 9,
                  color: '#fff',
                  background: 'rgba(0,0,0,0.7)',
                  padding: '1px 5px',
                  borderRadius: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                {word}
              </div>
            </div>
          );
        })}

        {placedCount === 0 && (
          <div style={s.placeholder}>
            Drop words here — arrange them by similarity
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        {placedCount < SORT_WORDS.length && (
          <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
            {placedCount} / {SORT_WORDS.length} words placed
          </p>
        )}

        {placedCount >= SORT_WORDS.length && !showReveal && (
          <button onClick={handleReveal} style={s.btn}>
            🔍 Reveal How AI Arranged These Words
          </button>
        )}

        {showReveal && (
          <div>
            <p style={{ color: 'var(--text-2)', marginBottom: 16, fontSize: 14, maxWidth: 520, margin: '0 auto 16px' }}>
              The glowing dots show where AI's <strong>embeddings</strong> placed these same words.
              Notice how the AI also grouped similar words together — animals near animals,
              vehicles near vehicles — just like you did! That's the core idea of embeddings.
            </p>
            <button onClick={() => onComplete(10)} style={s.btn}>
              Continue → Stage 2
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
  wordBank: {
    background: 'var(--surface)',
    borderRadius: 12,
    border: '1px solid var(--border)',
    padding: 16,
    marginBottom: 16,
  },
  bankLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-3)',
    marginBottom: 10,
  },
  bankWords: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    padding: '6px 14px',
    borderRadius: 8,
    background: '#4b5563',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'grab',
    userSelect: 'none',
    transition: 'opacity 0.2s, transform 0.1s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  grid: {
    position: 'relative',
    width: '100%',
    paddingBottom: '55%',
    background: 'var(--surface)',
    borderRadius: 14,
    border: '2px dashed var(--border)',
    overflow: 'hidden',
  },
  cornerLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    zIndex: 2,
    opacity: 0.6,
  },
  placeholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-3)',
    fontSize: 15,
    fontStyle: 'italic',
    pointerEvents: 'none',
  },
  placedWord: {
    padding: '4px 10px',
    borderRadius: 6,
    background: '#4b5563',
    color: '#fff',
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    zIndex: 5,
    cursor: 'grab',
    transition: 'box-shadow 0.2s',
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
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
};
