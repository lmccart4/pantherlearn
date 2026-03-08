import { useState, useRef } from 'react';
import FeedbackToast from '../components/FeedbackToast';
import { WORD_DATABASE, CATEGORY_COLORS, CATEGORY_LABELS, euclideanDist, getWordData } from '../data/words';

const CHALLENGES = [
  {
    id: 'c1',
    instruction: 'Type "king" and "queen" — how close are they?',
    check: (words) => {
      const has = w => words.some(x => x.toLowerCase() === w);
      return has('king') && has('queen');
    },
    feedback: 'King and queen are very close! They share the concept of royalty, just differing in gender.',
    points: 8,
  },
  {
    id: 'c2',
    instruction: 'Now type "bicycle" — is it near king and queen, or far away?',
    check: (words) => {
      const has = w => words.some(x => x.toLowerCase() === w);
      return has('bicycle') && has('king');
    },
    feedback: 'Bicycle is far from king/queen — royalty and transportation have almost nothing in common!',
    points: 8,
  },
  {
    id: 'c3',
    instruction: 'Add 3 emotions (like happy, sad, excited). Do they cluster together?',
    check: (words) => {
      const emotions = words.filter(w => WORD_DATABASE[w.toLowerCase()]?.category === 'emotion');
      return emotions.length >= 3;
    },
    feedback: 'Emotions form their own cluster! Even "happy" and "sad" are closer to each other than to "car" — because they\'re all feelings.',
    points: 8,
  },
  {
    id: 'c4',
    instruction: 'Find two words with a distance LESS than 0.06 (very similar!).',
    check: (words) => {
      for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j < words.length; j++) {
          const a = getWordData(words[i]);
          const b = getWordData(words[j]);
          if (euclideanDist(a, b) < 0.06) return true;
        }
      }
      return false;
    },
    feedback: 'You found a super-close pair! Words like dog/cat, happy/joyful, or basketball/soccer have tiny distances between them.',
    points: 8,
  },
  {
    id: 'c5',
    instruction: 'Can you find a word that\'s far from everything else? (You need 5+ words on the plot.)',
    check: (words) => {
      if (words.length < 5) return false;
      for (const w of words) {
        const data = getWordData(w);
        const others = words.filter(o => o !== w).map(o => getWordData(o));
        const avgDist = others.reduce((s, o) => s + euclideanDist(data, o), 0) / others.length;
        if (avgDist > 0.35) return true;
      }
      return false;
    },
    feedback: 'Nice find! Some words are loners in embedding space — they don\'t fit neatly into any nearby cluster.',
    points: 8,
  },
];

export default function Stage3({ onComplete }) {
  const [plotWords, setPlotWords] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [score, setScore] = useState(0);
  const [selectedPair, setSelectedPair] = useState([]);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '', visible: false });

  const challenge = CHALLENGES[challengeIdx];
  const allDone = Object.keys(completedChallenges).length >= CHALLENGES.length;

  const addWord = () => {
    const word = inputVal.trim().toLowerCase().replace(/\s+/g, '_');
    if (!word) return;
    if (plotWords.includes(word)) {
      setFeedback({ message: `"${word}" is already on the plot!`, type: 'wrong', visible: true });
      setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 2000);
      setInputVal('');
      return;
    }

    const newWords = [...plotWords, word];
    setPlotWords(newWords);
    setInputVal('');

    // Check current challenge
    if (challenge && !completedChallenges[challenge.id]) {
      if (challenge.check(newWords)) {
        setCompletedChallenges(prev => ({ ...prev, [challenge.id]: true }));
        setScore(s => s + challenge.points);
        setFeedback({
          message: `+${challenge.points} pts! ${challenge.feedback}`,
          type: 'correct',
          visible: true,
        });
        setTimeout(() => {
          setFeedback(f => ({ ...f, visible: false }));
          if (challengeIdx < CHALLENGES.length - 1) {
            setChallengeIdx(c => c + 1);
          }
        }, 4000);
      }
    }
  };

  const removeWord = (word) => {
    setPlotWords(prev => prev.filter(w => w !== word));
    setSelectedPair(prev => prev.filter(w => w !== word));
  };

  const toggleSelect = (word) => {
    setSelectedPair(prev => {
      if (prev.includes(word)) return prev.filter(w => w !== word);
      if (prev.length >= 2) return [word];
      return [...prev, word];
    });
  };

  const pairDist = selectedPair.length === 2
    ? euclideanDist(getWordData(selectedPair[0]), getWordData(selectedPair[1]))
    : null;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={st.title}>🔬 Stage 3: The Embedding Machine</h2>
        <p style={st.desc}>
          Type any word and watch it appear on the embedding plot!
          Click two words to measure the distance between them.
          Complete the challenges below.
        </p>
      </div>

      {/* Input */}
      <div style={st.inputRow}>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addWord()}
          placeholder="Type a word and press Enter..."
          style={st.input}
        />
        <button onClick={addWord} style={st.addBtn}>Add Word</button>
      </div>

      {/* Suggestions */}
      <div style={st.suggestions}>
        <span style={{ fontSize: 11, color: 'var(--text-3)', marginRight: 8 }}>Try:</span>
        {['dog', 'cat', 'happy', 'car', 'pizza', 'king', 'queen', 'ocean'].filter(w => !plotWords.includes(w)).slice(0, 6).map(w => (
          <button
            key={w}
            onClick={() => { setInputVal(w); }}
            style={st.sugChip}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Challenge card */}
      {!allDone && challenge && (
        <div style={st.challengeCard}>
          <div style={st.challengeLabel}>
            Challenge {challengeIdx + 1} / {CHALLENGES.length}
          </div>
          <p style={st.challengeText}>{challenge.instruction}</p>
          {completedChallenges[challenge.id] && <span style={{ fontWeight: 600 }}>✅</span>}
        </div>
      )}

      {/* Scatter Plot */}
      <div style={st.plot}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(v => (
          <div key={`g-${v}`}>
            <div style={{ position: 'absolute', left: `${v * 100}%`, top: 0, bottom: 0, width: 1, background: 'var(--grid-line)' }} />
            <div style={{ position: 'absolute', top: `${v * 100}%`, left: 0, right: 0, height: 1, background: 'var(--grid-line)' }} />
          </div>
        ))}

        {/* Axis labels */}
        <div style={{ ...st.axisLabel, bottom: -22, left: '50%', transform: 'translateX(-50%)' }}>
          Dimension 1 →
        </div>
        <div style={{ ...st.axisLabel, left: -28, top: '50%', transform: 'translateY(-50%) rotate(-90deg)' }}>
          Dimension 2 →
        </div>

        {/* Distance line */}
        {selectedPair.length === 2 && (() => {
          const a = getWordData(selectedPair[0]);
          const b = getWordData(selectedPair[1]);
          const x1 = a.x * 100, y1 = (1 - a.y) * 100;
          const x2 = b.x * 100, y2 = (1 - b.y) * 100;
          const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
          const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          return (
            <div style={{
              position: 'absolute',
              left: `${x1}%`,
              top: `${y1}%`,
              width: `${length}%`,
              height: 2,
              background: 'var(--accent)',
              transformOrigin: '0 50%',
              transform: `rotate(${angle}deg)`,
              zIndex: 5,
              opacity: 0.6,
              boxShadow: '0 0 6px var(--accent)',
            }} />
          );
        })()}

        {/* Word dots */}
        {plotWords.map(word => {
          const data = getWordData(word);
          const isSelected = selectedPair.includes(word);
          const isHovered = hoveredWord === word;
          const color = CATEGORY_COLORS[data.category] || CATEGORY_COLORS.unknown;
          return (
            <div
              key={word}
              onClick={() => toggleSelect(word)}
              onMouseEnter={() => setHoveredWord(word)}
              onMouseLeave={() => setHoveredWord(null)}
              style={{
                position: 'absolute',
                left: `${data.x * 100}%`,
                top: `${(1 - data.y) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected || isHovered ? 20 : 10,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{
                width: isSelected ? 16 : 12,
                height: isSelected ? 16 : 12,
                borderRadius: '50%',
                background: color,
                border: isSelected ? '3px solid #fff' : '2px solid rgba(255,255,255,0.5)',
                boxShadow: isSelected ? `0 0 14px ${color}` : isHovered ? `0 0 10px ${color}` : '0 2px 4px rgba(0,0,0,0.3)',
                transition: 'all 0.2s',
              }} />
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#fff',
                marginTop: 3,
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
                background: isSelected ? color : 'rgba(0,0,0,0.55)',
                padding: '1px 6px',
                borderRadius: 4,
              }}>
                {word.replace(/_/g, ' ')}
              </span>
            </div>
          );
        })}

        {plotWords.length === 0 && (
          <div style={st.plotEmpty}>Type a word above to start plotting!</div>
        )}
      </div>

      {/* Distance readout */}
      {pairDist !== null && (
        <div style={st.distReadout}>
          <strong>{selectedPair[0].replace(/_/g, ' ')}</strong>
          <span style={{ margin: '0 6px', color: 'var(--text-3)' }}>↔</span>
          <strong>{selectedPair[1].replace(/_/g, ' ')}</strong>
          <span style={{ margin: '0 8px', color: 'var(--text-3)' }}>= distance</span>
          <span style={{
            color: pairDist < 0.06 ? '#10b981' : pairDist < 0.15 ? '#f59e0b' : pairDist < 0.3 ? '#f97316' : '#ef4444',
            fontWeight: 700,
            fontSize: 16,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {pairDist.toFixed(4)}
          </span>
          <span style={{ marginLeft: 10, fontSize: 13 }}>
            {pairDist < 0.06 ? '🔥 Very similar!' : pairDist < 0.15 ? '👍 Related' : pairDist < 0.3 ? '🤔 Somewhat different' : '🌍 Very different!'}
          </span>
        </div>
      )}

      {/* Legend */}
      <div style={st.legend}>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <div key={key} style={st.legendItem}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: CATEGORY_COLORS[key] }} />
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{label}</span>
          </div>
        ))}
        <div style={st.legendItem}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: CATEGORY_COLORS.unknown }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Other</span>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 4 }}>
        💡 Click any two words to measure the distance between them
      </p>

      {/* Word tags for removal */}
      {plotWords.length > 0 && (
        <div style={st.wordTags}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', marginRight: 6 }}>On plot:</span>
          {plotWords.map(w => (
            <span key={w} style={st.tag}>
              {w.replace(/_/g, ' ')}
              <button onClick={() => removeWord(w)} style={st.tagX}>×</button>
            </span>
          ))}
        </div>
      )}

      {allDone && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ color: 'var(--text-2)', marginBottom: 12, fontSize: 14 }}>
            All challenges complete! You've earned <strong>{score} points</strong> in this stage.
          </p>
          <button onClick={() => onComplete(score)} style={st.btn}>
            Continue → Stage 4
          </button>
        </div>
      )}

      <FeedbackToast {...feedback} />
    </div>
  );
}

const st = {
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' },
  desc: { fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 640 },
  inputRow: { display: 'flex', gap: 10, marginBottom: 8 },
  input: {
    flex: 1,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '12px 16px',
    color: 'var(--text-1)',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
    whiteSpace: 'nowrap',
  },
  suggestions: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  sugChip: {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '3px 10px',
    fontSize: 12,
    color: 'var(--text-2)',
    cursor: 'pointer',
  },
  challengeCard: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: 12,
    padding: '14px 18px',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  challengeLabel: {
    background: 'var(--accent)',
    color: '#fff',
    padding: '3px 10px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  challengeText: { fontSize: 14, color: 'var(--text-1)', fontWeight: 500, flex: 1, minWidth: 200 },
  plot: {
    position: 'relative',
    width: '100%',
    paddingBottom: '60%',
    background: 'var(--surface)',
    borderRadius: 14,
    border: '1px solid var(--border)',
    overflow: 'hidden',
    marginBottom: 4,
  },
  plotEmpty: {
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
  axisLabel: {
    position: 'absolute',
    fontSize: 11,
    color: 'var(--text-3)',
    fontWeight: 500,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  },
  distReadout: {
    textAlign: 'center',
    marginTop: 10,
    padding: '10px 16px',
    background: 'var(--surface)',
    borderRadius: 10,
    border: '1px solid var(--border)',
    fontSize: 14,
    color: 'var(--text-1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 2,
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: { display: 'flex', alignItems: 'center', gap: 5 },
  wordTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginTop: 12,
    padding: '10px 14px',
    background: 'var(--surface)',
    borderRadius: 10,
    border: '1px solid var(--border)',
  },
  tag: {
    fontSize: 12,
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '2px 8px',
    color: 'var(--text-2)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  tagX: {
    background: 'none',
    border: 'none',
    color: 'var(--text-3)',
    fontSize: 14,
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
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
