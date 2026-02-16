// src/components/blocks/QuestionBlock.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { awardXP, updateStudentGamification, getStudentGamification, getXPConfig, DEFAULT_XP_VALUES } from "../../lib/gamification";
import { useTranslatedText, useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";

export default function QuestionBlock({ block, studentData, onAnswer, courseId, lessonCompleted }) {
  const { user } = useAuth();
  const data = studentData[block.id] || {};
  const [selected, setSelected] = useState(data.answer ?? null);
  const [textAnswer, setTextAnswer] = useState(data.answer ?? "");
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
    "Submitted — awaiting teacher review", // 6
  ]);
  const ui = (i) => uiStrings?.[i];

  // Load course-specific XP config
  useEffect(() => {
    if (courseId) {
      getXPConfig(courseId).then(setXpConfig).catch(() => setXpConfig(null));
    }
  }, [courseId]);

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

  if (block.questionType === "multiple_choice") {
    const isCorrect = submitted && selected === block.correctIndex;
    const locked = submitted && lessonCompleted;
    return (
      <div className={`question-block ${submitted ? (isCorrect ? "correct" : "incorrect") : ""}`} style={{ position: "relative" }}>
        {xpToast && <div style={xpToastStyle}>+{xpToast} XP</div>}
        <div className="question-badge" data-translatable>{ui(0) || "Question"}</div>
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
        <div className="question-badge sa" data-translatable>{ui(1) || "Written Response"}</div>
        <p className="question-prompt" data-translatable>{translatedPrompt}</p>
        {!submitted ? (
          <>
            <textarea className="sa-input" rows={4} placeholder={ui(4) || "Type your answer here..."} value={textAnswer} onChange={(e) => setTextAnswer(e.target.value)} />
            <button className="btn btn-primary" onClick={handleSubmitSA} disabled={!textAnswer.trim()} data-translatable>{ui(3) || "Submit Response"}</button>
          </>
        ) : (
          <div className="sa-submitted">
            <div className="sa-answer-display">{textAnswer}</div>
            <div className="sa-status" data-translatable>✓ {ui(6) || "Submitted — awaiting teacher review"}</div>
            {!locked && (
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
  return null;
}
