// src/App.jsx
// Prompt Duel — Main app with Firebase Auth integration
import { useState } from "react";
import { SetupScreen } from "./screens/SetupScreen";
import { LobbyScreen } from "./screens/LobbyScreen";
import { GameScreen } from "./screens/GameScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { LeaderboardScreen } from "./screens/LeaderboardScreen";
import { CHALLENGES } from "./challenges";

const AI_NAMES = [
  "NeuraNova", "SyntaxSage", "PromptPro", "ByteBoss", "CodeWhisp",
  "DataDuke", "PixelPilot", "QueryQueen", "AlgoAce", "TokenTitan",
];

function generateAIPlayers(count, humanName) {
  const shuffled = [...AI_NAMES].sort(() => Math.random() - 0.5);
  const players = [
    { id: "human", name: humanName, isHuman: true, totalScore: 0, xp: 0, rank: 1 },
  ];
  for (let i = 0; i < count; i++) {
    players.push({
      id: `ai-${i}`,
      name: shuffled[i % shuffled.length],
      isHuman: false,
      totalScore: 0,
      xp: 0,
      rank: i + 2,
    });
  }
  return players;
}

function simulateAIScores(players, difficulty) {
  const ranges = {
    easy: [4, 9], medium: [3, 8], hard: [2, 7], expert: [1, 6], legendary: [1, 5],
  };
  const [min, max] = ranges[difficulty] || [2, 7];
  return players.map((p) => {
    if (p.isHuman) return p;
    const aiScore = Math.floor(Math.random() * (max - min + 1)) + min;
    return { ...p, totalScore: p.totalScore + aiScore * 15, xp: p.xp + aiScore * 15 };
  });
}

function rankPlayers(players) {
  const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
  return sorted.map((p, i) => ({ ...p, rank: i + 1 }));
}

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [user, setUser] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [roundResults, setRoundResults] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);

  const handleStart = (firebaseUser, selectedCourseId) => {
    setUser(firebaseUser);
    setCourseId(selectedCourseId);
    setPlayers([]);
    setRoundResults([]);
    setCurrentRound(0);
    setScreen("lobby");
  };

  const handleStartGame = (playerCount) => {
    const initialPlayers = generateAIPlayers(playerCount, user?.displayName || "Player");
    setPlayers(initialPlayers);
    setRoundResults([]);
    setCurrentRound(0);
    setScreen("game");
  };

  const handleRoundComplete = (bestScore, iterations) => {
    const challenge = CHALLENGES[currentRound];

    // Update human player score + XP
    const xpEarned = bestScore * 15;
    let updated = players.map((p) =>
      p.isHuman ? { ...p, totalScore: p.totalScore + xpEarned, xp: p.xp + xpEarned } : p
    );

    // Simulate AI scores for this round
    updated = simulateAIScores(updated, challenge.difficulty);
    updated = rankPlayers(updated);
    setPlayers(updated);

    // Record round result
    const result = {
      round: currentRound + 1,
      challengeTitle: challenge.title,
      bestScore,
      iterations,
    };
    const newResults = [...roundResults, result];
    setRoundResults(newResults);

    // Advance to next round or end game
    const nextRound = currentRound + 1;
    if (nextRound >= CHALLENGES.length) {
      setTimeout(() => setScreen("results"), 2000);
    } else {
      setCurrentRound(nextRound);
    }
  };

  const handlePlayAgain = () => {
    const resetPlayers = players.map((p) => ({ ...p, totalScore: 0, xp: 0, rank: 1 }));
    setPlayers(resetPlayers);
    setRoundResults([]);
    setCurrentRound(0);
    setScreen("lobby");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {screen === "setup" && (
        <SetupScreen onStart={handleStart} />
      )}
      {screen === "lobby" && (
        <LobbyScreen
          playerName={user?.displayName || "Player"}
          onStartGame={handleStartGame}
          onLeaderboard={() => setScreen("leaderboard")}
        />
      )}
      {screen === "game" && (
        <GameScreen
          challenge={CHALLENGES[currentRound]}
          round={currentRound + 1}
          totalRounds={CHALLENGES.length}
          players={players}
          onRoundComplete={handleRoundComplete}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          user={user}
          courseId={courseId}
          playerName={user?.displayName || "Player"}
          players={players}
          roundResults={roundResults}
          onPlayAgain={handlePlayAgain}
          onLeaderboard={() => setScreen("leaderboard")}
        />
      )}
      {screen === "leaderboard" && (
        <LeaderboardScreen
          currentPlayerUid={user?.uid}
          players={players}
          onBack={() => setScreen(roundResults.length > 0 ? "results" : "lobby")}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
