import React, { useState, useMemo } from "react";
import { CLEANING_SAMPLES, ISSUE_TYPES } from "../data/sources";

export default function StageThree({ cleaningDecisions, onUpdateDecisions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [scores, setScores] = useState({ correct: 0, incorrect: 0, total: 0 });

  const shuffledSamples = useMemo(() => {
    // Shuffle but keep consistent per session
    return [...CLEANING_SAMPLES].sort((a, b) => a.id.localeCompare(b.id));
  }, []);

  const currentSample = shuffledSamples[currentIndex];
  const totalSamples = shuffledSamples.length;
  const progress = Object.keys(cleaningDecisions).length;

  const handleDecision = (issueType) => {
    const sample = currentSample;
    const isCorrect = (sample.issue === null && issueType === "none") || sample.issue === issueType;

    const newDecisions = {
      ...cleaningDecisions,
      [sample.id]: {
        studentChoice: issueType,
        correctAnswer: sample.issue || "none",
        isCorrect,
        sampleTitle: sample.title
      }
    };
    onUpdateDecisions(newDecisions);

    setScores(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1
    }));

    setShowFeedback({ isCorrect, sample, studentChoice: issueType });
  };

  const nextSample = () => {
    setShowFeedback(null);
    if (currentIndex < totalSamples - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const alreadyAnswered = currentSample && cleaningDecisions[currentSample.id];
  const allAnswered = progress >= totalSamples;
  const accuracy = scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;

  return (
    <div className="stage stage-three">
      <div className="stage-header">
        <h2>Stage 3: Data Cleaning</h2>
        <p>
          Review sample entries from the training data. For each entry, decide whether to 
          <strong> keep it</strong> or <strong>flag it</strong> with the appropriate issue. 
          Real data scientists do this work at massive scale — every bad entry you miss could 
          affect millions of users.
        </p>
      </div>

      {/* Progress & Score */}
      <div className="cleaning-progress">
        <div className="progress-stats">
          <span>Reviewed: <strong>{progress}</strong> / {totalSamples}</span>
          <span>Accuracy: <strong className={accuracy >= 70 ? "good" : "bad"}>{accuracy}%</strong></span>
          <span className="correct-count">✅ {scores.correct}</span>
          <span className="incorrect-count">❌ {scores.incorrect}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(progress / totalSamples) * 100}%` }} />
        </div>
      </div>

      {/* Current Sample Card */}
      {!allAnswered && currentSample && !showFeedback && (
        <div className="sample-card">
          <div className="sample-header">
            <span className="sample-number">Entry {currentIndex + 1} of {totalSamples}</span>
            <span className="sample-source">Source: {currentSample.source}</span>
          </div>
          <h3 className="sample-title">{currentSample.title}</h3>
          <div className="sample-content">
            <p>{currentSample.content}</p>
          </div>

          {alreadyAnswered ? (
            <div className="already-answered">
              <p>You already reviewed this entry. 
                {alreadyAnswered.isCorrect ? " ✅ Correct!" : ` ❌ You chose "${alreadyAnswered.studentChoice}" but the answer was "${alreadyAnswered.correctAnswer}"`}
              </p>
              <button className="next-btn" onClick={nextSample}>Next Entry →</button>
            </div>
          ) : (
            <div className="decision-area">
              <p className="decision-prompt">What should we do with this entry?</p>
              <div className="issue-buttons">
                {ISSUE_TYPES.map(issue => (
                  <button
                    key={issue.id}
                    className="issue-btn"
                    style={{ "--issue-color": issue.color }}
                    onClick={() => handleDecision(issue.id)}
                  >
                    {issue.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="feedback-overlay">
          <div className={`feedback-card ${showFeedback.isCorrect ? "correct" : "incorrect"}`}>
            <div className="feedback-icon">
              {showFeedback.isCorrect ? "✅" : "❌"}
            </div>
            <h3>{showFeedback.isCorrect ? "Correct!" : "Not quite..."}</h3>
            
            {!showFeedback.isCorrect && (
              <div className="feedback-correction">
                <p>
                  <strong>Your answer:</strong> {ISSUE_TYPES.find(i => i.id === showFeedback.studentChoice)?.label}
                </p>
                <p>
                  <strong>Correct answer:</strong> {ISSUE_TYPES.find(i => i.id === (showFeedback.sample.issue || "none"))?.label}
                </p>
              </div>
            )}

            <div className="feedback-explanation">
              <h4>Why?</h4>
              <p>{showFeedback.sample.explanation}</p>
            </div>

            <button className="next-btn" onClick={nextSample}>
              {currentIndex < totalSamples - 1 ? "Next Entry →" : "View Results"}
            </button>
          </div>
        </div>
      )}

      {/* Completion Summary */}
      {allAnswered && !showFeedback && (
        <div className="cleaning-summary">
          <h3>🧹 Cleaning Complete!</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="big-number">{scores.correct}</span>
              <span>Correct</span>
            </div>
            <div className="summary-stat">
              <span className="big-number">{scores.incorrect}</span>
              <span>Incorrect</span>
            </div>
            <div className="summary-stat">
              <span className="big-number">{accuracy}%</span>
              <span>Accuracy</span>
            </div>
          </div>

          <div className="review-list">
            <h4>Review Your Decisions:</h4>
            {shuffledSamples.map(sample => {
              const decision = cleaningDecisions[sample.id];
              if (!decision) return null;
              return (
                <div key={sample.id} className={`review-item ${decision.isCorrect ? "correct" : "incorrect"}`}>
                  <span className="review-icon">{decision.isCorrect ? "✅" : "❌"}</span>
                  <span className="review-title">{sample.title}</span>
                  <span className="review-answer">
                    {decision.isCorrect 
                      ? ISSUE_TYPES.find(i => i.id === decision.correctAnswer)?.label
                      : `Chose: ${ISSUE_TYPES.find(i => i.id === decision.studentChoice)?.label}`
                    }
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete */}
      <div className="stage-footer">
        {!allAnswered && (
          <p className="requirement-warning">⚠️ Review all {totalSamples} entries to continue</p>
        )}
        <button className="complete-btn" onClick={onComplete} disabled={!allAnswered}>
          Continue to Model Testing →
        </button>
      </div>
    </div>
  );
}
