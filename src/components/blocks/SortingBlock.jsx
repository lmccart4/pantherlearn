// src/components/blocks/SortingBlock.jsx
// Tinder-style swipe sorting activity — students swipe items left or right into two categories.
// After all items are sorted, a "Check Answers" button reveals correct/incorrect with XP-style feedback.

import { useState, useRef, useEffect, useCallback } from "react";
import { renderMarkdown } from "../../lib/utils";

export default function SortingBlock({ block, studentData = {}, onAnswer }) {
  const {
    title = "Sort It!",
    icon = "🔀",
    instructions = "",
    leftLabel = "Category A",
    rightLabel = "Category B",
    items = [],       // [{ text, correct: "left"|"right" }, ...]
  } = block;

  const saved = (studentData && studentData[block.id]) || {};
  const [deck, setDeck] = useState([]);           // remaining items to sort
  const [leftPile, setLeftPile] = useState([]);    // items swiped left
  const [rightPile, setRightPile] = useState([]);  // items swiped right
  const [dragX, setDragX] = useState(0);           // current drag offset
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

  // Shuffle items on mount, or restore from saved data
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

  // Sync from async studentData arrival or teacher reset
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

  // --- Touch / Mouse handlers ---
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

  // Button swipe (accessibility fallback)
  const handleButtonSwipe = (direction) => {
    if (!currentCard) return;
    swipe(direction);
  };

  // Check answers
  const handleCheck = () => {
    let correct = 0;
    const total = items.length;
    leftPile.forEach(item => { if (item.correct === "left") correct++; });
    rightPile.forEach(item => { if (item.correct === "right") correct++; });
    const newScore = { correct, total };
    setScore(newScore);
    setChecked(true);
    // Persist with writtenScore (0-1 normalized) and submitted flag so the
    // Classroom sync can read a standardized score (Finding #9)
    const writtenScore = total > 0 ? correct / total : 0;
    persist({
      deck, leftPile, rightPile, checked: true, score: newScore,
      writtenScore,
      submitted: true,
      completedAt: new Date().toISOString(),
    });
  };

  // Reset
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

  // Card visual state
  const rotation = dragX * 0.08;
  const opacity = Math.max(0.3, 1 - Math.abs(dragX) / 300);
  const leftGlow = dragX < -30 ? Math.min(1, Math.abs(dragX + 30) / 100) : 0;
  const rightGlow = dragX > 30 ? Math.min(1, (dragX - 30) / 100) : 0;

  return (
    <div className="card" style={{ padding: "28px 24px", overflow: "visible" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h3>
      </div>
      {instructions && (
        <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 16, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(instructions) }} />
      )}

      {/* Progress bar */}
      <div style={{
        height: 6, background: "var(--surface2)", borderRadius: 3, marginBottom: 20, overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: "var(--amber)",
          borderRadius: 3, transition: "width 0.3s ease",
        }} />
      </div>

      {/* Category labels + swipe area */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 12, marginBottom: 16, minHeight: 200 }}>
        {/* Left bucket */}
        <div style={{
          flex: "0 0 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          padding: "12px 8px", borderRadius: 12,
          background: leftGlow > 0 ? `rgba(239, 68, 68, ${leftGlow * 0.15})` : "var(--surface2)",
          border: `2px solid ${leftGlow > 0 ? `rgba(239, 68, 68, ${leftGlow * 0.6})` : "transparent"}`,
          transition: leftGlow > 0 ? "none" : "all 0.3s ease",
        }}>
          <span style={{
            fontSize: 13, fontWeight: 700, color: "var(--text)",
            textAlign: "center", lineHeight: 1.3,
          }}>{leftLabel}</span>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text3)" }}>{leftPile.length}</div>
          {checked && leftPile.map((item, i) => (
            <div key={i} style={{
              fontSize: 11, padding: "4px 8px", borderRadius: 6, width: "100%", textAlign: "center",
              background: item.correct === "left" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              color: item.correct === "left" ? "var(--green)" : "var(--red)",
              border: `1px solid ${item.correct === "left" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}>
              {item.correct === "left" ? "✓" : "✗"} <span dangerouslySetInnerHTML={{ __html: renderMarkdown(item.text) }} />
            </div>
          ))}
        </div>

        {/* Card stack area */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", minHeight: 180,
        }}>
          {/* Ghost cards behind */}
          {deck.length > 2 && (
            <div style={{
              position: "absolute", width: "85%", height: "85%", borderRadius: 16,
              background: "var(--surface2)", border: "1px solid var(--border)",
              transform: "scale(0.92)", opacity: 0.3,
            }} />
          )}
          {deck.length > 1 && (
            <div style={{
              position: "absolute", width: "90%", height: "90%", borderRadius: 16,
              background: "var(--surface2)", border: "1px solid var(--border)",
              transform: "scale(0.96)", opacity: 0.5,
            }} />
          )}

          {/* Current card */}
          {currentCard ? (
            <div
              ref={cardRef}
              onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX, e.clientY); }}
              onMouseMove={(e) => handleMove(e.clientX)}
              onMouseUp={handleEnd}
              onMouseLeave={() => { if (isDragging.current) handleEnd(); }}
              onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
              style={{
                position: "relative", width: "90%", minHeight: 140, padding: "24px 20px",
                background: "var(--surface)", border: "2px solid var(--border)", borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 600, textAlign: "center", lineHeight: 1.4,
                cursor: dragging ? "grabbing" : "grab", userSelect: "none",
                transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                opacity: opacity,
                transition: dragging ? "none" : "transform 0.3s ease, opacity 0.3s ease",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              }}
            >
              {/* Swipe direction indicators */}
              {dragX < -30 && (
                <div style={{
                  position: "absolute", top: 12, left: 12, padding: "4px 12px",
                  borderRadius: 8, fontSize: 13, fontWeight: 700,
                  background: "rgba(239,68,68,0.15)", color: "var(--red)",
                  border: "2px solid var(--red)", transform: "rotate(-12deg)",
                }}>← {leftLabel}</div>
              )}
              {dragX > 30 && (
                <div style={{
                  position: "absolute", top: 12, right: 12, padding: "4px 12px",
                  borderRadius: 8, fontSize: 13, fontWeight: 700,
                  background: "rgba(34,197,94,0.15)", color: "var(--green)",
                  border: "2px solid var(--green)", transform: "rotate(12deg)",
                }}>→ {rightLabel}</div>
              )}
              <span dangerouslySetInnerHTML={{ __html: renderMarkdown(currentCard.text) }} />
            </div>
          ) : allSorted && !checked ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 15, color: "var(--text2)", marginBottom: 16 }}>All items sorted!</div>
              <button className="btn btn-primary" onClick={handleCheck}>
                Check Answers
              </button>
            </div>
          ) : checked && score ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>
                {score.correct === score.total ? "🎉" : score.correct >= score.total * 0.7 ? "👍" : "🔄"}
              </div>
              <div style={{
                fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)",
                color: score.correct === score.total ? "var(--green)" : score.correct >= score.total * 0.7 ? "var(--amber)" : "var(--red)",
                marginBottom: 4,
              }}>
                {score.correct} / {score.total}
              </div>
              <div style={{ fontSize: 14, color: "var(--text2)", marginBottom: 16 }}>
                {score.correct === score.total ? "Perfect! 🔥" : score.correct >= score.total * 0.7 ? "Nice work!" : "Try again!"}
              </div>
              <button className="btn btn-secondary" onClick={handleReset}>
                🔄 Try Again
              </button>
            </div>
          ) : (
            <div style={{ color: "var(--text3)", fontSize: 14 }}>No items to sort</div>
          )}
        </div>

        {/* Right bucket */}
        <div style={{
          flex: "0 0 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          padding: "12px 8px", borderRadius: 12,
          background: rightGlow > 0 ? `rgba(34, 197, 94, ${rightGlow * 0.15})` : "var(--surface2)",
          border: `2px solid ${rightGlow > 0 ? `rgba(34, 197, 94, ${rightGlow * 0.6})` : "transparent"}`,
          transition: rightGlow > 0 ? "none" : "all 0.3s ease",
        }}>
          <span style={{
            fontSize: 13, fontWeight: 700, color: "var(--text)",
            textAlign: "center", lineHeight: 1.3,
          }}>{rightLabel}</span>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text3)" }}>{rightPile.length}</div>
          {checked && rightPile.map((item, i) => (
            <div key={i} style={{
              fontSize: 11, padding: "4px 8px", borderRadius: 6, width: "100%", textAlign: "center",
              background: item.correct === "right" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              color: item.correct === "right" ? "var(--green)" : "var(--red)",
              border: `1px solid ${item.correct === "right" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}>
              {item.correct === "right" ? "✓" : "✗"} <span dangerouslySetInnerHTML={{ __html: renderMarkdown(item.text) }} />
            </div>
          ))}
        </div>
      </div>

      {/* Button swipe controls (accessibility + mobile fallback) */}
      {currentCard && (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => handleButtonSwipe("left")}
            style={{
              padding: "10px 24px", borderRadius: 50, border: "2px solid var(--red)",
              background: "rgba(239,68,68,0.1)", color: "var(--red)",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ← {leftLabel}
          </button>
          <button
            onClick={() => handleButtonSwipe("right")}
            style={{
              padding: "10px 24px", borderRadius: 50, border: "2px solid var(--green)",
              background: "rgba(34,197,94,0.1)", color: "var(--green)",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {rightLabel} →
          </button>
        </div>
      )}

      {/* Remaining count */}
      {deck.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "var(--text3)" }}>
          {deck.length} remaining
        </div>
      )}
    </div>
  );
}
