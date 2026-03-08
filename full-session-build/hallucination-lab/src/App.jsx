// src/App.jsx
import React, { useState, useCallback } from "react";
import { SCENARIOS, STAGE_INTROS } from "./data/scenarios";
import { reportScore } from "./lib/pantherlearn";
import Welcome from "./components/Welcome";
import StageIntro from "./components/StageIntro";
import InvestigationRound from "./components/InvestigationRound";
import Results from "./components/Results";
import ProgressHeader from "./components/ProgressHeader";

const ACTIVITY_ID = "hallucination-lab";
const MAX_SCORE = 100;

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [scores, setScores] = useState([]);

  const totalScenarios = SCENARIOS.length;
  const scenario = SCENARIOS[currentIdx];

  const handleStart = () => {
    setScreen("stage-intro");
    setCurrentStage(1);
  };

  const handleStageStart = () => setScreen("round");

  const handleRoundComplete = useCallback(
    (result) => {
      setScores((prev) => [...prev, { ...result, scenarioId: scenario.id, stage: scenario.stage }]);

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
    reportScore(ACTIVITY_ID, finalScore, MAX_SCORE, {
      breakdown: scores,
      scenariosCompleted: scores.length,
      totalScenarios,
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Background texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse at 30% 20%, rgba(248,113,113,0.04) 0%, transparent 50%),
                     radial-gradient(ellipse at 70% 80%, rgba(129,140,248,0.04) 0%, transparent 50%)`,
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
          <StageIntro stage={STAGE_INTROS[currentStage]} stageNum={currentStage} totalStages={3} onStart={handleStageStart} />
        )}
        {screen === "round" && scenario && (
          <InvestigationRound
            key={scenario.id}
            scenario={scenario}
            roundNum={currentIdx + 1}
            totalRounds={totalScenarios}
            onComplete={handleRoundComplete}
          />
        )}
        {screen === "results" && (
          <Results scores={scores} finalScore={finalScore} maxScore={MAX_SCORE} onFinish={handleFinish} />
        )}
      </div>
    </div>
  );
}
