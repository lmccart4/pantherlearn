// src/App.jsx
import React, { useState, useCallback, useEffect } from "react";
import { ROUNDS, STAGE_INTROS } from "./data/sentences";
import { reportScore } from "./lib/pantherlearn";
import PredictionRound from "./components/PredictionRound";
import StageIntro from "./components/StageIntro";
import Welcome from "./components/Welcome";
import Results from "./components/Results";
import ProgressHeader from "./components/ProgressHeader";

const ACTIVITY_ID = "token-prediction-lab";
const MAX_SCORE = 100;

export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | stage-intro | round | results
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [scores, setScores] = useState([]); // { roundId, points, maxPoints, correct, stage }
  const [currentStage, setCurrentStage] = useState(1);

  const totalRounds = ROUNDS.length;
  const round = ROUNDS[currentRoundIdx];

  // Points per round based on stage difficulty
  const pointsForStage = (stage) => {
    if (stage === 1) return 5;
    if (stage === 2) return 7;
    if (stage === 3) return 9;
    return 12; // boss round
  };

  const handleStart = useCallback(() => {
    setScreen("stage-intro");
    setCurrentStage(1);
  }, []);

  const handleStageStart = useCallback(() => {
    setScreen("round");
  }, []);

  const handleRoundComplete = useCallback(
    (result) => {
      const maxPts = pointsForStage(round.stage);
      // Score based on how close their pick was to the actual top token
      // Full points if they picked the top token
      // Partial credit based on the probability of what they picked
      const pts = result.pickedTop
        ? maxPts
        : Math.round(maxPts * result.pickedProb * 1.5); // partial credit

      setScores((prev) => [
        ...prev,
        {
          roundId: round.id,
          points: Math.min(pts, maxPts),
          maxPoints: maxPts,
          correct: result.pickedTop,
          stage: round.stage,
          picked: result.picked,
          topToken: result.topToken,
        },
      ]);

      // Check if next round exists
      const nextIdx = currentRoundIdx + 1;
      if (nextIdx >= totalRounds) {
        // Activity complete — show results
        setTimeout(() => setScreen("results"), 800);
      } else {
        const nextRound = ROUNDS[nextIdx];
        if (nextRound.stage !== round.stage) {
          // New stage — show intro
          setCurrentRoundIdx(nextIdx);
          setCurrentStage(nextRound.stage);
          setTimeout(() => setScreen("stage-intro"), 800);
        } else {
          setCurrentRoundIdx(nextIdx);
        }
      }
    },
    [currentRoundIdx, round, totalRounds]
  );

  // Calculate final score
  const totalPoints = scores.reduce((s, r) => s + r.points, 0);
  const totalMaxPoints = scores.reduce((s, r) => s + r.maxPoints, 0);
  // Normalize to MAX_SCORE
  const finalScore =
    totalMaxPoints > 0 ? Math.round((totalPoints / totalMaxPoints) * MAX_SCORE) : 0;

  const [submitted, setSubmitted] = useState(false);

  const handleFinish = useCallback(() => {
    if (submitted) return;
    reportScore(ACTIVITY_ID, finalScore, MAX_SCORE, {
      breakdown: scores,
      roundsCompleted: scores.length,
      totalRounds,
    });
    setSubmitted(true);
  }, [submitted, finalScore, scores, totalRounds]);

  // Auto-submit score when results screen appears
  useEffect(() => {
    if (screen === "results" && !submitted) {
      handleFinish();
    }
  }, [screen, submitted, handleFinish]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(129,140,248,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(129,140,248,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {screen !== "welcome" && screen !== "results" && (
          <ProgressHeader
            currentRound={currentRoundIdx + 1}
            totalRounds={totalRounds}
            score={totalPoints}
            stage={currentStage}
          />
        )}

        {screen === "welcome" && <Welcome onStart={handleStart} />}

        {screen === "stage-intro" && (
          <StageIntro
            stage={STAGE_INTROS[currentStage]}
            stageNum={currentStage}
            onStart={handleStageStart}
          />
        )}

        {screen === "round" && round && (
          <PredictionRound
            key={round.id}
            round={round}
            roundNum={currentRoundIdx + 1}
            totalRounds={totalRounds}
            onComplete={handleRoundComplete}
          />
        )}

        {screen === "results" && (
          <Results
            scores={scores}
            finalScore={finalScore}
            maxScore={MAX_SCORE}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}
