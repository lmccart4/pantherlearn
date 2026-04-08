// src/components/blocks/RocketStagingBlock.jsx
// Wrapper block for the Rocket Staging Challenge interactive simulation.

import { useCallback, useRef } from "react";
import RocketStagingChallenge from "./rocket-staging/RocketStagingChallenge";

export default function RocketStagingBlock({ block, studentData = {}, onAnswer }) {
  const saved = studentData[block.id] || {};
  const savedRef = useRef(saved);
  savedRef.current = saved;

  const handleComplete = useCallback(
    (result) => {
      const prev = savedRef.current || {};
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

      // Count total missions from the challenge (3 missions: LEO, GTO, Escape)
      const totalMissions = 3;
      const writtenScore = completedMissions.length / totalMissions;

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
        writtenScore,
        savedAt: new Date().toISOString(),
      });
    },
    [block.id, onAnswer]
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
