// src/components/blocks/SortingBlock.jsx
// Tinder-style swipe sorting activity — students swipe items left or right into two categories.
// After all items are sorted, a "Check Answers" button reveals correct/incorrect with XP-style feedback.

import { useState, useRef, useEffect, useCallback } from "react";
import { renderMarkdown } from "../../lib/utils";
import "./SortingBlock.css";

export default function SortingBlock({ block, studentData = {}, onAnswer }) {
  const {
    title = "Sort It!",
    icon = "🔀",
    instructions = "",
    leftLabel = "Category A",
    rightLabel = "Category B",
    items = [],
  } = block;

  const saved = (studentData && studentData[block.id]) || {};
  const [deck, setDeck] = useState([]);
  const [leftPile, setLeftPile] = useState([]);
  const [rightPile, setRightPile] = useState([]);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(null);
  const cardRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const hydrated = useRef(false);

  const persist = useCallback((state) => {
    if (onAnswer) {
      onAnswer(block.id, { ...state, savedAt: new Date().toISOString() });
    }
  }, [block.id, onAnswer]);

  useEffect(() => {
    const s = (studentData && studentData[block.id]) || {};
    if (s.deck || s.leftPile || s.rightPile) {
      setDeck(s.deck || []);
      setLeftPile(s.leftPile || []);
      setRightPile(s.rightPile || []);
      setChecked(s.checked || false);
      setScore(s.score || null);
      hydrated.current = true;
    } else {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setLeftPile([]);
      setRightPile([]);
      setChecked(false);
      setScore(null);
    }
  }, [items.length]);

  useEffect(() => {
    const s = studentData?.[block.id];
    if (!s) {
      if (hydrated.current && (!studentData || Object.keys(studentData).length === 0)) {
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        setDeck(shuffled);
        setLeftPile([]);
        setRightPile([]);
        setChecked(false);
        setScore(null);
        hydrated.current = false;
      }
      return;
    }
    if (hydrated.current) return;
    hydrated.current = true;
    if (s.deck) setDeck(s.deck);
    if (s.leftPile) setLeftPile(s.leftPile);
    if (s.rightPile) setRightPile(s.rightPile);
    if (s.checked !== undefined) setChecked(s.checked);
    if (s.score !== undefined) setScore(s.score);
  }, [studentData, block.id, items]);

  const currentCard = deck[0];
  const SWIPE_THRESHOLD = 80;

  const handleStart = (clientX, clientY) => {
    startX.current = clientX;
    startY.current = clientY;
    isDragging.current = true;
    setDragging(true);
    setDragX(0);
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    const dx = clientX - startX.current;
    setDragX(dx);
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);

    if (dragX < -SWIPE_THRESHOLD) {
      swipe("left");
    } else if (dragX > SWIPE_THRESHOLD) {
      swipe("right");
    }
    setDragX(0);
  };

  const swipe = (direction) => {
    if (!currentCard) return;
    const newLeft = direction === "left" ? [...leftPile, currentCard] : leftPile;
    const newRight = direction === "right" ? [...rightPile, currentCard] : rightPile;
    const newDeck = deck.slice(1);
    if (direction === "left") setLeftPile(newLeft); else setRightPile(newRight);
    setDeck(newDeck);
    persist({ deck: newDeck, leftPile: newLeft, rightPile: newRight, checked, score });
  };

  const handleButtonSwipe = (direction) => {
    if (!currentCard) return;
    swipe(direction);
  };

  const handleCheck = () => {
    let correct = 0;
    const total = items.length;
    leftPile.forEach(item => { if (item.correct === "left") correct++; });
    rightPile.forEach(item => { if (item.correct === "right") correct++; });
    const newScore = { correct, total };
    setScore(newScore);
    setChecked(true);
    const writtenScore = total > 0 ? correct / total : 0;
    persist({
      deck, leftPile, rightPile, checked: true, score: newScore,
      writtenScore,
      submitted: true,
      completedAt: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setLeftPile([]);
    setRightPile([]);
    setChecked(false);
    setScore(null);
    hydrated.current = false;
    persist({ deck: shuffled, leftPile: [], rightPile: [], checked: false, score: null });
  };

  const allSorted = deck.length === 0 && items.length > 0;
  const pct = items.length > 0 ? ((items.length - deck.length) / items.length) * 100 : 0;

  const rotation = dragX * 0.08;
  const opacity = Math.max(0.3, 1 - Math.abs(dragX) / 300);
  const leftGlow = dragX < -30 ? Math.min(1, Math.abs(dragX + 30) / 100) : 0;
  const rightGlow = dragX > 30 ? Math.min(1, (dragX - 30) / 100) : 0;

  // Score tier for the result screen
  const scoreTier = !score ? null
    : score.correct === score.total ? "tier-perfect"
    : score.correct >= score.total * 0.7 ? "tier-strong"
    : "tier-weak";

  return (
    <div className="card sb-block">
      <div className="sb-head">
        <span className="sb-icon" aria-hidden>{icon}</span>
        <h3 className="sb-title">{title}</h3>
      </div>
      {instructions && (
        <p className="sb-instructions" dangerouslySetInnerHTML={{ __html: renderMarkdown(instructions) }} />
      )}

      <div className="sb-progress">
        <div className="sb-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="sb-arena">
        {/* Left bucket */}
        <div
          className={`sb-bucket sb-bucket-left ${leftGlow > 0 ? "is-active" : ""}`}
          style={leftGlow > 0 ? { "--glow": leftGlow } : undefined}
        >
          <span className="sb-bucket-label">{leftLabel}</span>
          <div className="sb-bucket-count">{leftPile.length}</div>
          {checked && leftPile.map((item, i) => (
            <div
              key={i}
              className={`sb-bucket-item ${item.correct === "left" ? "is-correct" : "is-wrong"}`}
            >
              {item.correct === "left" ? "✓" : "✗"} <span dangerouslySetInnerHTML={{ __html: renderMarkdown(item.text) }} />
            </div>
          ))}
        </div>

        {/* Card stack */}
        <div className="sb-stack">
          {deck.length > 2 && <div className="sb-ghost sb-ghost-back" />}
          {deck.length > 1 && <div className="sb-ghost sb-ghost-mid" />}

          {currentCard ? (
            <div
              ref={cardRef}
              className={`sb-card ${dragging ? "is-dragging" : ""} ${currentCard.imageUrl ? "has-image" : ""}`}
              onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX, e.clientY); }}
              onMouseMove={(e) => handleMove(e.clientX)}
              onMouseUp={handleEnd}
              onMouseLeave={() => { if (isDragging.current) handleEnd(); }}
              onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
              style={{
                transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                opacity,
              }}
            >
              {dragX < -30 && (
                <div className="sb-swipe-tag sb-swipe-tag-left">← {leftLabel}</div>
              )}
              {dragX > 30 && (
                <div className="sb-swipe-tag sb-swipe-tag-right">→ {rightLabel}</div>
              )}
              {currentCard.imageUrl && (
                <img
                  className="sb-card-img"
                  src={currentCard.imageUrl}
                  alt={currentCard.text}
                  draggable={false}
                />
              )}
              <span dangerouslySetInnerHTML={{ __html: renderMarkdown(currentCard.text) }} />
            </div>
          ) : allSorted && !checked ? (
            <div className="sb-finish">
              <div className="sb-finish-icon">✅</div>
              <div className="sb-finish-msg">All items sorted!</div>
              <button className="btn btn-primary" onClick={handleCheck}>Check Answers</button>
            </div>
          ) : checked && score ? (
            <div className="sb-finish">
              <div className="sb-finish-icon">
                {score.correct === score.total ? "🎉" : score.correct >= score.total * 0.7 ? "👍" : "🔄"}
              </div>
              <div className={`sb-score ${scoreTier}`}>
                {score.correct} / {score.total}
              </div>
              <div className="sb-finish-msg">
                {score.correct === score.total ? "Perfect! 🔥" : score.correct >= score.total * 0.7 ? "Nice work!" : "Try again!"}
              </div>
              <button className="btn btn-secondary" onClick={handleReset}>🔄 Try Again</button>
            </div>
          ) : (
            <div className="sb-empty">No items to sort</div>
          )}
        </div>

        {/* Right bucket */}
        <div
          className={`sb-bucket sb-bucket-right ${rightGlow > 0 ? "is-active" : ""}`}
          style={rightGlow > 0 ? { "--glow": rightGlow } : undefined}
        >
          <span className="sb-bucket-label">{rightLabel}</span>
          <div className="sb-bucket-count">{rightPile.length}</div>
          {checked && rightPile.map((item, i) => (
            <div
              key={i}
              className={`sb-bucket-item ${item.correct === "right" ? "is-correct" : "is-wrong"}`}
            >
              {item.correct === "right" ? "✓" : "✗"} <span dangerouslySetInnerHTML={{ __html: renderMarkdown(item.text) }} />
            </div>
          ))}
        </div>
      </div>

      {currentCard && (
        <div className="sb-swipe-buttons">
          <button className="sb-swipe-btn sb-swipe-btn-left" onClick={() => handleButtonSwipe("left")}>
            ← {leftLabel}
          </button>
          <button className="sb-swipe-btn sb-swipe-btn-right" onClick={() => handleButtonSwipe("right")}>
            {rightLabel} →
          </button>
        </div>
      )}

      {deck.length > 0 && (
        <div className="sb-remaining">{deck.length} remaining</div>
      )}
    </div>
  );
}
