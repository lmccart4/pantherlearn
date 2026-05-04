// src/components/blocks/QuestionBlock.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { awardXP, updateStudentGamification, getStudentGamification, getXPConfig, DEFAULT_XP_VALUES, getBloomLevel } from "../../lib/gamification";
import { useTranslatedText, useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
import useAutoSave from "../../hooks/useAutoSave.jsx";
import { useTelemetryContext } from "../../contexts/TelemetryContext";
import DictationButton from "../DictationButton";
import "./QuestionBlock.css";

function gradedTier(score) {
  if (score == null) return "tier-pending";
  if (score >= 1.0) return "tier-perfect";
  if (score >= 0.85) return "tier-strong";
  if (score >= 0.65) return "tier-ok";
  if (score >= 0.55) return "tier-weak";
  return "tier-pending";
}

function GradedBadge({ writtenLabel, writtenScore, simple = false }) {
  const tier = simple
    ? (writtenScore >= 0.85 ? "tier-strong" : "tier-ok")
    : gradedTier(writtenScore);
  return (
    <div className="qb-graded-row">
      <span className={`qb-graded ${tier}`}>
        ✓ Graded: {writtenLabel}
        {!simple && ` (${Math.round((writtenScore ?? 0) * 100)}%)`}
      </span>
    </div>
  );
}

function FeedbackBlock({ feedback }) {
  return (
    <div className="qb-feedback">
      <div className="qb-feedback-label">💬 Feedback</div>
      {feedback}
    </div>
  );
}

function ReviewControls({ data, blockId, onRequestReview, showReviewForm, setShowReviewForm, reviewNote, setReviewNote, reviewSubmitting, setReviewSubmitting }) {
  if (data.gradedBy !== "autograde-agent" || !onRequestReview) return null;
  if (data.reviewRequested) {
    return <div className="qb-review-pending">🔍 Review requested — your teacher will look at this</div>;
  }
  if (showReviewForm) {
    return (
      <div className="qb-review-form">
        <textarea
          className="qb-review-textarea"
          rows={2}
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value.slice(0, 200))}
          placeholder="Optional: why do you think this grade should be different? (200 chars)"
        />
        <div className="qb-review-actions">
          <button
            className="qb-review-submit"
            disabled={reviewSubmitting}
            onClick={async () => {
              setReviewSubmitting(true);
              try {
                await onRequestReview(blockId, reviewNote);
                setShowReviewForm(false);
              } catch (err) {
                console.error("Failed to request review:", err);
              } finally {
                setReviewSubmitting(false);
              }
            }}
          >
            {reviewSubmitting ? "Submitting..." : "Submit Review Request"}
          </button>
          <button
            className="qb-review-cancel"
            onClick={() => { setShowReviewForm(false); setReviewNote(""); }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  return (
    <button className="qb-review-trigger" onClick={() => setShowReviewForm(true)}>
      🔍 Request Manual Review
    </button>
  );
}

export default function QuestionBlock({ block, studentData = {}, onAnswer, onRequestReview, courseId, lessonCompleted, allStudentData }) {
  const { user } = useAuth();
  const { trackEvent } = useTelemetryContext();
  const data = (studentData && studentData[block.id]) || {};
  const [selected, setSelected] = useState(data.answer ?? null);
  const [textAnswer, setTextAnswer] = useState(data.answer ?? "");
  const [rankingOrder, setRankingOrder] = useState(() => {
    if (data.answer) return data.answer;
    if (block.questionType !== "ranking") return null;
    const items = [...(block.items || [])];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.abs(block.id.charCodeAt(i % block.id.length)) % (i + 1);
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  });
  const [submitted, setSubmitted] = useState(data.submitted || false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const hydrated = useRef(false);
  useEffect(() => {
    const d = (studentData && studentData[block.id]) || {};
    const hasAnswer = d.answer !== undefined && d.answer !== null;

    if (!hasAnswer && !d.submitted) {
      if (hydrated.current) {
        const isFullReset = !studentData || Object.keys(studentData).length === 0;
        if (isFullReset) {
          setSubmitted(false);
          if (block.questionType === "multiple_choice") setSelected(null);
          if (block.questionType === "short_answer" || block.questionType === "linked") setTextAnswer("");
          if (block.questionType === "ranking") setRankingOrder(null);
          hydrated.current = false;
        }
      }
      return;
    }

    if (d.submitted) {
      hydrated.current = true;
      setSubmitted(true);
      if (hasAnswer) {
        if (block.questionType === "multiple_choice") setSelected(d.answer);
        if (block.questionType === "short_answer" || block.questionType === "linked") setTextAnswer(d.answer);
        if (block.questionType === "ranking") setRankingOrder(d.answer);
      }
      return;
    }

    if (hydrated.current) return;
    hydrated.current = true;
    if (hasAnswer) {
      if (block.questionType === "multiple_choice") setSelected(d.answer);
      if (block.questionType === "short_answer" || block.questionType === "linked") setTextAnswer(d.answer);
      if (block.questionType === "ranking") setRankingOrder(d.answer);
    }
  }, [studentData, block.id, block.questionType]);
  const [xpToast, setXpToast] = useState(null);
  const [xpConfig, setXpConfig] = useState(null);

  const translatedPrompt = useTranslatedText(block.prompt);
  const translatedOptions = useTranslatedTexts(block.options || []);
  const translatedExplanation = useTranslatedText(block.explanation);

  const uiStrings = useTranslatedTexts([
    "Question",
    "Written Response",
    "Submit Answer",
    "Submit Response",
    "Type your answer here...",
    "Explanation:",
    "Submitted — awaiting teacher review (usually graded within 1–2 days)",
  ]);
  const ui = (i) => uiStrings?.[i];

  useEffect(() => {
    if (courseId) {
      getXPConfig(courseId).then(setXpConfig).catch(() => setXpConfig(null));
    }
  }, [courseId]);

  const performDraftSave = useCallback(() => {
    if (submitted) return;

    if (block.questionType === "short_answer" || block.questionType === "linked") {
      if (!textAnswer.trim()) return;
      return onAnswer(block.id, { answer: textAnswer, submitted: false, draft: true });
    }

    if (block.questionType === "ranking" && rankingOrder) {
      return onAnswer(block.id, { answer: rankingOrder, submitted: false, draft: true });
    }
  }, [block.id, block.questionType, textAnswer, rankingOrder, submitted, onAnswer]);

  const { markDirty: markSADirty, saveNow: saveSANow, clearDirty: clearSADirty, lastSaved: saLastSaved, saveError: saSaveError } = useAutoSave(performDraftSave);

  const getXPValue = (key) => {
    return xpConfig?.xpValues?.[key] ?? DEFAULT_XP_VALUES[key] ?? 0;
  };

  const showXPToast = (amount) => {
    setXpToast(amount);
    setTimeout(() => setXpToast(null), 1500);
  };

  const handleSubmitMC = async () => {
    if (selected === null) return;
    const correct = block.allCorrect ? true : selected === block.correctIndex;
    onAnswer(block.id, { answer: selected, correct, submitted: true, submittedAt: new Date().toISOString() });
    setSubmitted(true);
    trackEvent("question_answered", { correct, blockId: block.id });

    if (user) {
      const baseXP = correct ? getXPValue("mc_correct") : getXPValue("mc_incorrect");
      const current = await getStudentGamification(user.uid);

      const result = await awardXP(user.uid, baseXP, correct ? "mc_correct" : "mc_incorrect", courseId);

      await updateStudentGamification(user.uid, {
        totalAnswered: (current.totalAnswered || 0) + 1,
        totalCorrect: (current.totalCorrect || 0) + (correct ? 1 : 0),
      });

      const effectiveXP = result?.gamification?.totalXP
        ? result.gamification.totalXP - (current.totalXP || 0)
        : baseXP;
      showXPToast(effectiveXP);
    }
  };

  const handleSubmitSA = async () => {
    if (!textAnswer.trim()) return;
    clearSADirty();
    onAnswer(block.id, { answer: textAnswer, submitted: true, needsGrading: true, submittedAt: new Date().toISOString() });
    setSubmitted(true);
    trackEvent("question_answered", { blockId: block.id });

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

  // Bloom-driven badge color comes from gamification lib (per-level).
  // Tinted bg is computed via color-mix against that color, so the inline style stays.
  const bloom = getBloomLevel(block.difficulty);
  const diffBadge = block.difficulty ? (
    <span
      className="qb-bloom-badge"
      style={{
        background: `color-mix(in srgb, ${bloom.color} 15%, transparent)`,
        color: bloom.color,
      }}
    >
      {bloom.label}
    </span>
  ) : null;

  const handleSubmitRanking = async () => {
    if (!rankingOrder || rankingOrder.length === 0) return;
    clearSADirty();
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
    trackEvent("question_answered", { correct: score === 1, blockId: block.id });

    if (user) {
      const baseXP = Math.round(getXPValue("mc_correct") * score * bloom.xpMult);
      await awardXP(user.uid, baseXP, "ranking_question", courseId);
      showXPToast(baseXP);
    }
  };

  const handleSubmitLinked = async () => {
    if (!textAnswer.trim()) return;
    clearSADirty();
    onAnswer(block.id, { answer: textAnswer, submitted: true, needsGrading: true, submittedAt: new Date().toISOString() });
    setSubmitted(true);

    if (user) {
      const baseXP = Math.round(getXPValue("short_answer") * bloom.xpMult);
      await awardXP(user.uid, baseXP, "linked_question", courseId);
      showXPToast(baseXP);
    }
  };

  const getShuffledItems = () => {
    if (rankingOrder) return rankingOrder;
    const items = [...(block.items || [])];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.abs(block.id.charCodeAt(i % block.id.length)) % (i + 1);
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  const reviewProps = { data, blockId: block.id, onRequestReview, showReviewForm, setShowReviewForm, reviewNote, setReviewNote, reviewSubmitting, setReviewSubmitting };

  if (block.questionType === "multiple_choice") {
    const isAllCorrect = block.allCorrect;
    const isCorrect = submitted && (isAllCorrect ? true : selected === block.correctIndex);
    return (
      <div className={`question-block qb-relative ${submitted ? (isCorrect ? "correct" : "incorrect") : ""}`}>
        {xpToast && <div className="qb-xp-toast">+{xpToast} XP</div>}
        <div className="qb-row">
          <div className="question-badge" data-translatable>{ui(0) || "Question"}</div>
          {diffBadge}
        </div>
        <p className="question-prompt" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedPrompt) }} />
        <div className="mc-options" role="radiogroup" aria-label={translatedPrompt || block.prompt}>
          {(translatedOptions || block.options).map((opt, i) => {
            let cls = "mc-option";
            if (submitted && !isAllCorrect && i === block.correctIndex) cls += " correct-answer";
            if (submitted && !isAllCorrect && i === selected && i !== block.correctIndex) cls += " wrong-answer";
            if (submitted && isAllCorrect && i === selected) cls += " correct-answer";
            if (!submitted && i === selected) cls += " selected";
            return (
              <button key={i} className={cls} onClick={() => !submitted && setSelected(i)} disabled={submitted}
                role="radio" aria-checked={i === selected}>
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span className="option-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(opt) }} />
                {submitted && !isAllCorrect && i === block.correctIndex && <span className="check-icon">✓ Correct</span>}
                {submitted && !isAllCorrect && i === selected && i !== block.correctIndex && <span className="x-icon">✗ Incorrect</span>}
                {submitted && isAllCorrect && i === selected && <span className="check-icon">✓</span>}
              </button>
            );
          })}
        </div>
        {!submitted && <button className="btn btn-primary" onClick={handleSubmitMC} disabled={selected === null} data-translatable>{ui(2) || "Submit Answer"}</button>}
        {submitted && block.explanation && (
          <div className="explanation" data-translatable>
            <strong>{ui(5) || "Explanation:"}</strong>{" "}
            <span dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedExplanation || "") }} />
          </div>
        )}
        <div aria-live="polite" className="sr-only">
          {submitted && (isCorrect ? "Correct answer!" : `Incorrect. The correct answer is ${String.fromCharCode(65 + block.correctIndex)}.`)}
        </div>
      </div>
    );
  }

  if (block.questionType === "short_answer") {
    return (
      <div className={`question-block qb-relative ${submitted ? "submitted-sa" : ""}`}>
        {xpToast && <div className="qb-xp-toast">+{xpToast} XP</div>}
        <div className="qb-row">
          <div className="question-badge sa" data-translatable>{ui(1) || "Written Response"}</div>
          {diffBadge}
        </div>
        <p className="question-prompt" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedPrompt) }} />
        {!submitted ? (
          <>
            <textarea className="sa-input" rows={4} placeholder={ui(4) || "Type your answer here..."}
              aria-label={translatedPrompt || block.prompt}
              value={textAnswer}
              onChange={(e) => { setTextAnswer(e.target.value); markSADirty(); }}
              onBlur={saveSANow}
            />
            <div className="qb-submit-row">
              <button className="btn btn-primary" onClick={handleSubmitSA} disabled={!textAnswer.trim()} data-translatable>{ui(3) || "Submit Response"}</button>
              <DictationButton
                getValue={() => textAnswer}
                setValue={(v) => { setTextAnswer(v); markSADirty(); }}
              />
              {saSaveError && !submitted && (
                <span className="qb-save-status is-error">{saSaveError}</span>
              )}
              {saLastSaved && !submitted && !saSaveError && (
                <span className="qb-save-status is-saved">
                  Draft saved {saLastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="sa-submitted">
            <div className="sa-answer-display">{textAnswer}</div>
            {data.writtenLabel ? (
              <>
                <GradedBadge writtenLabel={data.writtenLabel} writtenScore={data.writtenScore} />
                {data.feedback && <FeedbackBlock feedback={data.feedback} />}
                <ReviewControls {...reviewProps} />
              </>
            ) : (
              <div className="sa-status" data-translatable>✓ {ui(6) || "Submitted — awaiting teacher review"}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (block.questionType === "ranking") {
    const items = rankingOrder || getShuffledItems();
    const correctItems = block.items || [];

    const moveItem = (fromIdx, toIdx) => {
      if (submitted) return;
      const newOrder = [...items];
      const [moved] = newOrder.splice(fromIdx, 1);
      newOrder.splice(toIdx, 0, moved);
      setRankingOrder(newOrder);
      markSADirty();
    };

    return (
      <div className={`question-block qb-relative ${submitted ? "submitted-sa" : ""}`}>
        {xpToast && <div className="qb-xp-toast">+{xpToast} XP</div>}
        <div className="qb-row">
          <div className="question-badge qb-badge-ranking">🔢 Ranking</div>
          {diffBadge}
        </div>
        <p className="question-prompt" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedPrompt) }} />
        <div className="qb-rank-list">
          {items.map((item, i) => {
            const isCorrectPos = submitted && item === correctItems[i];
            const stateCls = submitted ? (isCorrectPos ? "is-correct" : "is-wrong") : "";
            return (
              <div key={`${item}-${i}`} className={`qb-rank-row ${stateCls}`}>
                <span className="qb-rank-num">{i + 1}.</span>
                <span className="qb-rank-text">{item}</span>
                {!submitted && (
                  <div className="qb-rank-controls">
                    <button className="qb-rank-btn" disabled={i === 0} onClick={() => moveItem(i, i - 1)} aria-label={`Move ${item} up`}>▲</button>
                    <button className="qb-rank-btn" disabled={i === items.length - 1} onClick={() => moveItem(i, i + 1)} aria-label={`Move ${item} down`}>▼</button>
                  </div>
                )}
                {submitted && (
                  <span className={`qb-rank-mark ${isCorrectPos ? "is-correct" : "is-wrong"}`}>
                    {isCorrectPos ? "✓" : "✗"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {!submitted && <button className="btn btn-primary" onClick={handleSubmitRanking}>Submit Ranking</button>}
        {submitted && (
          <div className="qb-rank-score">
            Score: {Math.round((data.partialScore || 0) * 100)}% — {items.filter((item, i) => item === correctItems[i]).length}/{correctItems.length} items correct
          </div>
        )}
      </div>
    );
  }

  if (block.questionType === "linked") {
    const linkedData = allStudentData ? allStudentData[block.linkedBlockId] : studentData[block.linkedBlockId];
    const priorAnswer = linkedData?.answer;

    return (
      <div className={`question-block qb-relative ${submitted ? "submitted-sa" : ""}`}>
        {xpToast && <div className="qb-xp-toast">+{xpToast} XP</div>}
        <div className="qb-row">
          <div className="question-badge qb-badge-linked">🔗 Follow-Up</div>
          {diffBadge}
        </div>

        {priorAnswer !== undefined && priorAnswer !== null && (
          <div className="qb-prior">
            <div className="qb-prior-label">Your previous answer:</div>
            <div className="qb-prior-text">
              {typeof priorAnswer === "string" ? priorAnswer : JSON.stringify(priorAnswer)}
            </div>
          </div>
        )}

        <p className="question-prompt" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedPrompt) }} />
        {!submitted ? (
          <>
            <textarea className="sa-input" rows={4} placeholder="Type your follow-up answer..."
              aria-label={translatedPrompt || block.prompt}
              value={textAnswer}
              onChange={(e) => { setTextAnswer(e.target.value); markSADirty(); }}
              onBlur={saveSANow}
            />
            <div className="qb-submit-row">
              <button className="btn btn-primary" onClick={handleSubmitLinked} disabled={!textAnswer.trim()}>Submit Response</button>
              <DictationButton
                getValue={() => textAnswer}
                setValue={(v) => { setTextAnswer(v); markSADirty(); }}
              />
            </div>
          </>
        ) : (
          <div className="sa-submitted">
            <div className="sa-answer-display">{textAnswer}</div>
            {data.writtenLabel ? (
              <>
                <GradedBadge writtenLabel={data.writtenLabel} writtenScore={data.writtenScore} simple />
                {data.feedback && <FeedbackBlock feedback={data.feedback} />}
                <ReviewControls {...reviewProps} />
              </>
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
