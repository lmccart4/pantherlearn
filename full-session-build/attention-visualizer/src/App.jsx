// src/App.jsx
import React, { useState, useCallback, useEffect } from "react";
import { buildScenarios, STAGE_INTROS } from "./data/sentences";
import { reportScore } from "./lib/pantherlearn";
import Welcome from "./components/Welcome";
import StageIntro from "./components/StageIntro";
import ObserveRound from "./components/ObserveRound";
import PredictRound from "./components/PredictRound";
import ChallengeRound from "./components/ChallengeRound";
import Results from "./components/Results";
import ProgressHeader from "./components/ProgressHeader";

const ACTIVITY_ID = "attention-visualizer";
const MAX_SCORE = 100;

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [scenarios, setScenarios] = useState(() => buildScenarios());
  const [usedIds, setUsedIds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [scores, setScores] = useState([]);

  const totalScenarios = scenarios.length;
  const scenario = scenarios[currentIdx];

  const handleStart = () => {
    setScreen("stage-intro");
    setCurrentStage(1);
  };

  const handleStageStart = () => {
    setScreen("round");
  };

  const handleRoundComplete = useCallback(
    (result) => {
      setScores((prev) => [...prev, { ...result, stage: scenario.stage, id: scenario.id }]);

      const nextIdx = currentIdx + 1;
      if (nextIdx >= totalScenarios) {
        setScreen("transition");
        setTimeout(() => setScreen("results"), 600);
      } else {
        const next = scenarios[nextIdx];
        if (next.stage !== scenario.stage) {
          setScreen("transition");
          setCurrentIdx(nextIdx);
          setCurrentStage(next.stage);
          setTimeout(() => setScreen("stage-intro"), 600);
        } else {
          setCurrentIdx(nextIdx);
        }
      }
    },
    [currentIdx, scenario, totalScenarios, scenarios]
  );

  const totalPoints = scores.reduce((s, r) => s + r.points, 0);
  const totalMaxPoints = scores.reduce((s, r) => s + r.maxPoints, 0);
  const finalScore = totalMaxPoints > 0 ? Math.round((totalPoints / totalMaxPoints) * MAX_SCORE) : 0;

  const [submitted, setSubmitted] = useState(false);

  const doSubmit = useCallback(() => {
    if (submitted) return;
    reportScore(ACTIVITY_ID, finalScore, MAX_SCORE, {
      breakdown: scores,
      scenariosCompleted: scores.length,
      totalScenarios,
    });
    setSubmitted(true);
  }, [submitted, finalScore, scores, totalScenarios]);

  // Auto-submit when results screen appears
  useEffect(() => {
    if (screen === "results" && scores.length > 0 && !submitted) {
      doSubmit();
    }
  }, [screen, scores.length, submitted, doSubmit]);

  const handleRetry = () => {
    const allUsed = [...usedIds, ...scenarios.map(s => s.id)];
    const next = buildScenarios(allUsed);
    setUsedIds(allUsed);
    setScenarios(next);
    setScreen("welcome");
    setCurrentIdx(0);
    setCurrentStage(1);
    setScores([]);
    setSubmitted(false);
  };

  // Pick the right component based on stage
  const RoundComponent =
    scenario?.stage === 1 ? ObserveRound : scenario?.stage === 2 ? PredictRound : ChallengeRound;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Grid background */}
      <div
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(129,140,248,0.04) 0%, transparent 70%)`,
        }}
      />

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
          <StageIntro stage={STAGE_INTROS[currentStage]} stageNum={currentStage} totalStages={3} onStart={handleStageStart} />
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
          <Results scores={scores} finalScore={finalScore} maxScore={MAX_SCORE} submitted={submitted} onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
}
