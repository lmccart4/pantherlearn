// src/App.jsx
import React, { useState, useCallback, useEffect } from "react";
import { buildScenarios, STAGE_INTROS } from "./data/scenarios";
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
  const [scenarios, setScenarios] = useState(() => buildScenarios());
  const [usedIds, setUsedIds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [scores, setScores] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const totalScenarios = scenarios.length;
  const scenario = scenarios[currentIdx];

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
        setScreen("results");
      } else {
        const next = scenarios[nextIdx];
        if (next.stage !== scenario.stage) {
          // Show stage intro BEFORE updating the scenario index,
          // so the student doesn't briefly see the next stage's content
          setCurrentStage(next.stage);
          setScreen("stage-intro");
          setCurrentIdx(nextIdx);
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

  const handleFinish = useCallback(() => {
    if (!submitted) {
      reportScore(ACTIVITY_ID, finalScore, MAX_SCORE, {
        breakdown: scores,
        scenariosCompleted: scores.length,
        totalScenarios,
      });
      setSubmitted(true);
    }
  }, [submitted, finalScore, scores, totalScenarios]);

  // Auto-submit score when results screen appears
  useEffect(() => {
    if (screen === "results" && !submitted) {
      handleFinish();
    }
  }, [screen, submitted, handleFinish]);

  const handleRetry = () => {
    const allUsed = [...usedIds, ...scenarios.map(s => s.id)];
    const next = buildScenarios(allUsed);
    setUsedIds(allUsed);
    setScenarios(next);
    setCurrentIdx(0);
    setCurrentStage(1);
    setScores([]);
    setSubmitted(false);
    setScreen("welcome");
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
          <Results
            scores={scores}
            finalScore={finalScore}
            maxScore={MAX_SCORE}
            onFinish={handleFinish}
            onRetry={handleRetry}
            submitted={submitted}
          />
        )}
      </div>
    </div>
  );
}
