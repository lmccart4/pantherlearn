// Embeds the full attention visualizer app inline within the lesson.
// This is a self-contained replica of the visualizer's App.jsx logic,
// adapted to live inside the lesson page (no min-height: 100vh).

import React, { useState, useCallback } from "react";
import { SCENARIOS, STAGE_INTROS } from "../visualizer/data/sentences";
import Welcome from "../visualizer/Welcome";
import StageIntro from "../visualizer/StageIntro";
import ObserveRound from "../visualizer/ObserveRound";
import PredictRound from "../visualizer/PredictRound";
import ChallengeRound from "../visualizer/ChallengeRound";
import Results from "../visualizer/Results";
import ProgressHeader from "../visualizer/ProgressHeader";

const MAX_SCORE = 100;

export default function VisualizerBlock({ block, onComplete }) {
  const [screen, setScreen] = useState("welcome");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [scores, setScores] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const totalScenarios = SCENARIOS.length;
  const scenario = SCENARIOS[currentIdx];

  const handleStart = () => {
    setScreen("stage-intro");
    setCurrentStage(1);
  };

  const handleStageStart = () => setScreen("round");

  const handleRoundComplete = useCallback(
    (result) => {
      setScores((prev) => [...prev, { ...result, stage: scenario.stage, id: scenario.id }]);

      const nextIdx = currentIdx + 1;
      if (nextIdx >= totalScenarios) {
        setTimeout(() => setScreen("results"), 600);
      } else {
        const next = SCENARIOS[nextIdx];
        if (next.stage !== scenario.stage) {
          setCurrentIdx(nextIdx);
          setCurrentStage(next.stage);
          setTimeout(() => setScreen("stage-intro"), 600);
        } else {
          setCurrentIdx(nextIdx);
        }
      }
    },
    [currentIdx, scenario, totalScenarios]
  );

  const totalPoints = scores.reduce((s, r) => s + r.points, 0);
  const totalMaxPoints = scores.reduce((s, r) => s + r.maxPoints, 0);
  const finalScore = totalMaxPoints > 0 ? Math.round((totalPoints / totalMaxPoints) * MAX_SCORE) : 0;

  const handleFinish = () => {
    setSubmitted(true);
    if (onComplete) onComplete({ score: finalScore, maxScore: MAX_SCORE, breakdown: scores });
  };

  const RoundComponent =
    scenario?.stage === 1 ? ObserveRound : scenario?.stage === 2 ? PredictRound : ChallengeRound;

  return (
    <div style={{
      background: "var(--bg)",
      border: "1.5px solid rgba(129,140,248,0.2)",
      borderRadius: "16px",
      overflow: "hidden",
      minHeight: "600px",
      position: "relative",
    }}>
      {/* Subtle grid glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(129,140,248,0.05) 0%, transparent 60%)`,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {screen !== "welcome" && screen !== "results" && (
          <ProgressHeader
            currentRound={currentIdx + 1}
            totalRounds={totalScenarios}
            score={totalPoints}
            stage={currentStage}
          />
        )}

        {screen === "welcome" && <Welcome onStart={handleStart} />}
        {screen === "stage-intro" && (
          <StageIntro
            stage={STAGE_INTROS[currentStage]}
            stageNum={currentStage}
            totalStages={3}
            onStart={handleStageStart}
          />
        )}
        {screen === "round" && scenario && (
          <RoundComponent
            key={scenario.id}
            scenario={scenario}
            roundNum={currentIdx + 1}
            totalRounds={totalScenarios}
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

        {submitted && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(12,12,18,0.92)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "12px", zIndex: 10,
          }}>
            <div style={{ fontSize: "48px" }}>✅</div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>Score Submitted!</h2>
            <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
              You scored <strong style={{ color: "var(--accent)" }}>{finalScore}/{MAX_SCORE}</strong> on the Attention Visualizer
            </p>
            <p style={{ color: "var(--muted)", fontSize: "12px" }}>Continue to the Wrap Up section below ↓</p>
          </div>
        )}
      </div>
    </div>
  );
}
