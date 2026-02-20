// src/components/blocks/QuestionBlock.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { awardXP, updateStudentGamification, getStudentGamification, getXPConfig, DEFAULT_XP_VALUES, getBloomLevel } from "../../lib/gamification";
import { useTranslatedText, useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
import useAutoSave from "../../hooks/useAutoSave.jsx";

export default function QuestionBlock({ block, studentData = {}, onAnswer, courseId, lessonCompleted, allStudentData }) {
  const { user } = useAuth();
  const data = (studentData && studentData[block.id]) || {};
  const [selected, setSelected] = useState(data.answer ?? null);
  const [textAnswer, setTextAnswer] = useState(data.answer ?? "");
  const [rankingOrder, setRankingOrder] = useState(data.answer || null);
  const [submitted, setSubmitted] = useState(data.submitted || false);
  const [xpToast, setXpToast] = useState(null);
  const [xpConfig, setXpConfig] = useState(null);

  // Translate prompt, options, and explanation
  const translatedPrompt = useTranslatedText(block.prompt);
  const translatedOptions = useTranslatedTexts(block.options || []);
  const translatedExplanation = useTranslatedText(block.explanation);

  // Translate UI chrome strings
  const uiStrings = useTranslatedTexts([
    "Question",              // 0
    "Written Response",      // 1
    "Submit Answer",         // 2
    "Submit Response",       // 3
    "Type your answer here...", // 4
    "Explanation:",          // 5
    "Submitted — awaiting teacher review (usually graded within 1–2 days)", // 6
  ]);
  const ui = (i) => uiStrings?.[i];

  // Load course-specific XP config
  useEffect(() => {
    if (courseId) {
      getXPConfig(courseId).then(setXpConfig).catch(() => setXpConfig(null));
    }
  }, [courseId]);

  // Auto-save draft for short answer (saves text without officially submitting)
  const performDraftSave = useCallback(() => {
    if (block.questionType !== "short_answer") return;
    if (submitted) return; // don't overwrite a submitted answer with a draft
    if (!textAnswer.trim()) return;
    // Save as draft (submitted: false) so it doesn't count as turned in
    onAnswer(block.id, { answer: textAnswer, submitted: false, draft: true });
  }, [block.id, block.questionType, textAnswer, submitted, onAnswer]);

  const { markDirty: markSADirty, saveNow: saveSANow, clearDirty: clearSADirty, lastSaved: saLastSaved } = useAutoSave(performDraftSave);

  // Get XP value from config or fallback to defaults
  const getXPValue = (key) => {
    return xpConfig?.xpValues?.[key] ?? DEFAULT_XP_VALUES[key] ?? 0;
  };

  const showXPToast = (amount) => {
    setXpToast(amount);
    setTimeout(() => setXpToast(null), 1500);
  };

  const handleSubmitMC = async () => {
    if (selected === null) return;
    const correct = selected === block.correctIndex;
    onAnswer(block.id, { answer: selected, correct, submitted: true, submittedAt: new Date().toISOString() });
    setSubmitted(true);

    // Award XP using course-specific config
    if (user) {
      const baseXP = correct ? getXPValue("mc_correct") : getXPValue("mc_incorrect");
      const current = await getStudentGamification(user.uid);

      // Use awardXP which handles multipliers automatically when courseId is provided
      const result = await awardXP(user.uid, baseXP, correct ? "mc_correct" : "mc_incorrect", courseId);

      // Also update answer counts
      await updateStudentGamification(user.uid, {
        totalAnswered: (current.totalAnswered || 0) + 1,
        totalCorrect: (current.totalCorrect || 0) + (correct ? 1 : 0),
      });

      // Show the effective XP (with multipliers) in the toast
      const effectiveXP = result?.gamification?.totalXP
        ? result.gamification.totalXP - (current.totalXP || 0)
        : baseXP;
      showXPToast(effectiveXP);
    }
  };

  const handleSubmitSA = async () => {
    if (!textAnswer.trim()) return;
    clearSADirty(); // Prevent stale draft from overwriting on unmount
    onAnswer(block.id, { answer: textAnswer, submitted: true, needsGrading: true, submittedAt: new Date().toISOString() });
    setSubmitted(true);

    // Award XP for submission using course-specific config
    if (user) {
      const baseXP = getXPValue("short_answer");
      const current = await getStudentGamification(user.uid);

      const result = await awardXP(user.uid, baseXP, "short_answer", courseId);

      await updateStudentGamification(user.uid, {
        totalAnswered: (current.totalAnswered || 0) + 1,
      });

      const effectiveXP = result?.gamification?.totalXP
        ? result.gamification.totalXP - (current.totalXP || 0)
        : baseXP;
      showXPToast(effectiveXP);
    }
  };

  const xpToastStyle = {
    position: "absolute", top: -8, right: -8,
    background: "var(--amber)", color: "var(--bg)",
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
    padding: "4px 10px", borderRadius: 12,
    animation: "xpFloat 1.5s ease-out forwards",
    pointerEvents: "none", zIndex: 10,
  };

  // Difficulty badge for Bloom's taxonomy
  const bloom = getBloomLevel(block.difficulty);
  const diffBadge = block.difficulty ? (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, marginLeft: 8,
      background: `color-mix(in srgb, ${bloom.color} 15%, transparent)`,
      color: bloom.color, textTransform: "uppercase", letterSpacing: "0.04em",
    }}>
      {bloom.label}
    </span>
  ) : null;

  // Ranking question handler
  const handleSubmitRanking = async () => {
    if (!rankingOrder || rankingOrder.length === 0) return;
    // Score: count items in correct position
    const correctItems = block.items || [];
    let correctCount = 0;
    rankingOrder.forEach((item, i) => {
      if (item === correctItems[i]) correctCount++;
    });
    const score = correctCount / correctItems.length;
    onAnswer(block.id, {
      answer: rankingOrder,
      submitted: true,
      correct: score === 1,
      partialScore: score,
      submittedAt: new Date().toISOString(),
    });
    setSubmitted(true);

    if (user) {
      const baseXP = Math.round(getXPValue("mc_correct") * score * bloom.xpMult);
      await awardXP(user.uid, baseXP, "ranking_question", courseId);
      showXPToast(baseXP);
    }
  };

  // Linked question handler (treated like short_answer)
  const handleSubmitLinked = async () => {
    if (!textAnswer.trim()) return;
    clearSADirty(); // Prevent stale draft from overwriting on unmount
    onAnswer(block.id, { answer: textAnswer, submitted: true, needsGrading: true, submittedAt: new Date().toISOString() });
    setSubmitted(true);

    if (user) {
      const baseXP = Math.round(getXPValue("short_answer") * bloom.xpMult);
      await awardXP(user.uid, baseXP, "linked_question", courseId);
      showXPToast(baseXP);
    }
  };

  // Shuffle items for ranking (deterministic per block ID)
  const getShuffledItems = () => {
    if (rankingOrder) return rankingOrder;
    const items = [...(block.items || [])];
    // Simple seeded shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.abs(block.id.charCodeAt(i % block.id.length)) % (i + 1);
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  if (block.questionType === "multiple_choice") {
    const isCorrect = submitted && selected === block.correctIndex;
    const locked = submitted && lessonCompleted;
    return (
      <div className={`question-block ${submitted ? (isCorrect ? "correct" : "incorrect") : ""}`} style={{ position: "relative" }}>
        {xpToast && <div style={xpToastStyle}>+{xpToast} XP</div>}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="question-badge" data-translatable>{ui(0) || "Question"}</div>
          {diffBadge}
        </div>
        <p className="question-prompt" data-translatable>{translatedPrompt}</p>
        <div className="mc-options">
          {(translatedOptions || block.options).map((opt, i) => {
            let cls = "mc-option";
            if (submitted && i === block.correctIndex) cls += " correct-answer";
            if (submitted && i === selected && i !== block.correctIndex) cls += " wrong-answer";
            if (!submitted && i === selected) cls += " selected";
            return (
              <button key={i} className={cls} onClick={() => !submitted && setSelected(i)} disabled={submitted}>
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span className="option-text">{opt}</span>
                {submitted && i === block.correctIndex && <span className="check-icon">✓</span>}
                {submitted && i === selected && i !== block.correctIndex && <span className="x-icon">✗</span>}
              </button>
            );
          })}
        </div>
        {!submitted && <button className="btn btn-primary" onClick={handleSubmitMC} disabled={selected === null} data-translatable>{ui(2) || "Submit Answer"}</button>}
        {submitted && block.explanation && <div className="explanation" data-translatable><strong>{ui(5) || "Explanation:"}</strong> {translatedExplanation}</div>}
      </div>
    );
  }

  if (block.questionType === "short_answer") {
    const locked = submitted && lessonCompleted;
    return (
      <div className={`question-block ${submitted ? "submitted-sa" : ""}`} style={{ position: "relative" }}>
        {xpToast && <div style={xpToastStyle}>+{xpToast} XP</div>}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="question-badge sa" data-translatable>{ui(1) || "Written Response"}</div>
          {diffBadge}
        </div>
        <p className="question-prompt" data-translatable>{translatedPrompt}</p>
        {!submitted ? (
          <>
            <textarea className="sa-input" rows={4} placeholder={ui(4) || "Type your answer here..."}
              value={textAnswer}
              onChange={(e) => { setTextAnswer(e.target.value); markSADirty(); }}
              onBlur={saveSANow}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="btn btn-primary" onClick={handleSubmitSA} disabled={!textAnswer.trim()} data-translatable>{ui(3) || "Submit Response"}</button>
              {saLastSaved && !submitted && (
                <span style={{ fontSize: 11, color: "var(--text3)" }}>
                  Draft saved {saLastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="sa-submitted">
            <div className="sa-answer-display">{textAnswer}</div>
            {data.writtenLabel ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginTop: 8,
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, padding: "4px 14px", borderRadius: 6,
                  background: data.writtenScore >= 1.0 ? "rgba(16,185,129,0.12)"
                    : data.writtenScore >= 0.85 ? "rgba(34,211,238,0.12)"
                    : data.writtenScore >= 0.65 ? "rgba(245,166,35,0.12)"
                    : data.writtenScore >= 0.55 ? "rgba(239,68,68,0.12)"
                    : "var(--surface2)",
                  color: data.writtenScore >= 1.0 ? "var(--green)"
                    : data.writtenScore >= 0.85 ? "var(--cyan)"
                    : data.writtenScore >= 0.65 ? "var(--amber)"
                    : data.writtenScore >= 0.55 ? "#ef4444"
                    : "var(--text3)",
                }}>
                  ✓ Graded: {data.writtenLabel} ({Math.round((data.writtenScore ?? 0) * 100)}%)
                </span>
              </div>
            ) : (
              <div className="sa-status" data-translatable>✓ {ui(6) || "Submitted — awaiting teacher review"}</div>
            )}
            {!locked && !data.writtenLabel && (
              <button
                className="btn"
                onClick={() => {
                  setSubmitted(false);
                  onAnswer(block.id, { answer: textAnswer, submitted: false });
                }}
                style={{ marginTop: 8, fontSize: 13, color: "var(--text3)", background: "var(--surface2)", border: "1px solid var(--border)" }}
              >
                ✏️ Edit Response
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
  // ─── Ranking question ───
  if (block.questionType === "ranking") {
    const items = rankingOrder || getShuffledItems();
    if (!rankingOrder) setRankingOrder(items);
    const correctItems = block.items || [];

    const moveItem = (fromIdx, toIdx) => {
      if (submitted) return;
      const newOrder = [...items];
      const [moved] = newOrder.splice(fromIdx, 1);
      newOrder.splice(toIdx, 0, moved);
      setRankingOrder(newOrder);
    };

    return (
      <div className={`question-block ${submitted ? "submitted-sa" : ""}`} style={{ position: "relative" }}>
        {xpToast && <div style={xpToastStyle}>+{xpToast} XP</div>}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="question-badge" style={{ background: "rgba(176,142,255,0.12)", color: "var(--purple)" }}>🔢 Ranking</div>
          {diffBadge}
        </div>
        <p className="question-prompt" data-translatable>{translatedPrompt}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {items.map((item, i) => {
            const isCorrectPos = submitted && item === correctItems[i];
            return (
              <div key={`${item}-${i}`} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                background: submitted
                  ? (isCorrectPos ? "rgba(52,216,168,0.08)" : "rgba(248,113,113,0.08)")
                  : "var(--surface2)",
                border: `1px solid ${submitted ? (isCorrectPos ? "var(--green)" : "var(--red)") : "var(--border)"}`,
                borderRadius: 10, transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", minWidth: 20 }}>{i + 1}.</span>
                <span style={{ flex: 1, fontSize: 15 }}>{item}</span>
                {!submitted && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button disabled={i === 0} onClick={() => moveItem(i, i - 1)}
                      style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, cursor: i === 0 ? "default" : "pointer", padding: "2px 8px", color: "var(--text3)", opacity: i === 0 ? 0.3 : 1 }}>▲</button>
                    <button disabled={i === items.length - 1} onClick={() => moveItem(i, i + 1)}
                      style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, cursor: i === items.length - 1 ? "default" : "pointer", padding: "2px 8px", color: "var(--text3)", opacity: i === items.length - 1 ? 0.3 : 1 }}>▼</button>
                  </div>
                )}
                {submitted && (isCorrectPos ? <span style={{ color: "var(--green)" }}>✓</span> : <span style={{ color: "var(--red)" }}>✗</span>)}
              </div>
            );
          })}
        </div>
        {!submitted && <button className="btn btn-primary" onClick={handleSubmitRanking}>Submit Ranking</button>}
        {submitted && (
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 8 }}>
            Score: {Math.round((data.partialScore || 0) * 100)}% — {items.filter((item, i) => item === correctItems[i]).length}/{correctItems.length} items correct
          </div>
        )}
      </div>
    );
  }

  // ─── Linked question (shows prior answer as context) ───
  if (block.questionType === "linked") {
    const linkedData = allStudentData ? allStudentData[block.linkedBlockId] : studentData[block.linkedBlockId];
    const priorAnswer = linkedData?.answer;
    const locked = submitted && lessonCompleted;

    return (
      <div className={`question-block ${submitted ? "submitted-sa" : ""}`} style={{ position: "relative" }}>
        {xpToast && <div style={xpToastStyle}>+{xpToast} XP</div>}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="question-badge" style={{ background: "rgba(96,165,250,0.12)", color: "var(--blue)" }}>🔗 Follow-Up</div>
          {diffBadge}
        </div>

        {priorAnswer !== undefined && priorAnswer !== null && (
          <div style={{
            background: "var(--surface2)", borderRadius: 10, padding: "12px 16px", marginBottom: 12,
            border: "1px solid var(--border)", fontSize: 13,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", marginBottom: 4 }}>Your previous answer:</div>
            <div style={{ color: "var(--text2)" }}>
              {typeof priorAnswer === "string" ? priorAnswer : JSON.stringify(priorAnswer)}
            </div>
          </div>
        )}

        <p className="question-prompt" data-translatable>{translatedPrompt}</p>
        {!submitted ? (
          <>
            <textarea className="sa-input" rows={4} placeholder="Type your follow-up answer..."
              value={textAnswer} onChange={(e) => setTextAnswer(e.target.value)} />
            <button className="btn btn-primary" onClick={handleSubmitLinked} disabled={!textAnswer.trim()}>Submit Response</button>
          </>
        ) : (
          <div className="sa-submitted">
            <div className="sa-answer-display">{textAnswer}</div>
            {data.writtenLabel ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, padding: "4px 14px", borderRadius: 6,
                  background: data.writtenScore >= 0.85 ? "rgba(52,216,168,0.12)" : "rgba(245,166,35,0.12)",
                  color: data.writtenScore >= 0.85 ? "var(--green)" : "var(--amber)",
                }}>
                  ✓ Graded: {data.writtenLabel}
                </span>
              </div>
            ) : (
              <div className="sa-status">✓ Submitted — awaiting teacher review</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}
