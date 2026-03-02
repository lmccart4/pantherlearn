// src/components/blocks/RocketStagingBlock.jsx
// Wrapper block for the Rocket Staging Challenge interactive simulation.

import { useCallback } from "react";
import RocketStagingChallenge from "./rocket-staging/RocketStagingChallenge";

export default function RocketStagingBlock({ block, studentData = {}, onAnswer }) {
  const saved = studentData[block.id] || {};

  const handleComplete = useCallback(
    (result) => {
      const prev = saved || {};
      const completedMissions = prev.completedMissions || [];
      const bestResults = { ...(prev.bestResults || {}) };

      // Track completed missions
      if (result.success && !completedMissions.includes(result.missionId)) {
        completedMissions.push(result.missionId);
      }

      // Track best result per mission (by velocity)
      if (
        result.success &&
        (!bestResults[result.missionId] ||
          result.finalVelocity > bestResults[result.missionId].velocity)
      ) {
        bestResults[result.missionId] = {
          velocity: result.finalVelocity,
          surplus: result.surplus,
          stages: result.stages,
        };
      }

      onAnswer(block.id, {
        completedMissions,
        bestResults,
        lastAttempt: {
          missionId: result.missionId,
          success: result.success,
          velocity: result.finalVelocity,
          surplus: result.surplus,
          stages: result.stages,
        },
        submitted: true,
        savedAt: new Date().toISOString(),
      });
    },
    [block.id, saved, onAnswer]
  );

  return (
    <RocketStagingChallenge
      onComplete={handleComplete}
      initialState={{
        completedMissions: saved.completedMissions || [],
      }}
    />
  );
}
