// src/config/activityRegistry.js
// ─────────────────────────────────────────────────────────────
// Registry of external activity labs for the Grading Dashboard.
// To add a new activity, just add an entry here + create a
// matching review component in src/components/grading/activities/
// ─────────────────────────────────────────────────────────────

import { lazy } from "react";

export const ACTIVITIES = [
  {
    id: "recipebot-curation",
    title: "RecipeBot Data Curation Lab",
    icon: "🤖🍳",
    description: "Students curate training data for a recipe chatbot and see how their choices affect model behavior.",
    collection: "recipebot_curation",       // Firestore collection where submissions live
    userIdField: "userId",                  // field name that stores the student UID
    timestampField: "lastUpdated",          // field name for last updated timestamp
    completionCheck: (sub) => {             // returns true if student has completed the activity
      const completed = sub.stageCompleted || {};
      return Object.values(completed).filter(Boolean).length >= 5;
    },
    scoreCalculator: (sub) => {             // returns 0-100 score
      let total = 0;
      const sources = sub.selectedSources || [];
      const hasProblematic = sources.some((s) => s.category === "problematic");
      const hasDiverse = sources.some((s) => s.category === "specialized");
      total += hasDiverse ? 15 : 5;
      total += hasProblematic ? 3 : 10;
      total += 5;
      const notes = sub.biasNotes || "";
      if (notes.length >= 100) total += 10;
      else if (notes.length >= 50) total += 5;
      if (/african|halal|kosher|western|bias|gap|underrepresent|diverse/i.test(notes)) total += 10;
      else total += 3;
      const decisions = Object.values(sub.cleaningDecisions || {});
      const correct = decisions.filter((d) => d.isCorrect).length;
      const accuracy = decisions.length > 0 ? correct / decisions.length : 0;
      total += Math.round(accuracy * 25);
      const results = sub.testResults || [];
      const reflections = Object.values(sub.reflections || {}).filter((r) => r && r.trim().length > 20);
      total += Math.min(10, results.length * 2.5);
      total += Math.min(10, reflections.length * 3.3);
      if (reflections.some((r) => /data|source|curat|bias|train|gap/i.test(r))) total += 5;
      return Math.min(Math.round(total), 100);
    },
    component: lazy(() => import("../components/grading/activities/RecipeBotReview")),
    url: "https://recipebot-curation.web.app",
    course: null,  // null = show for all courses
  },

  {
    id: "prompt-duel",
    title: "Prompt Duel",
    icon: "⚔️",
    description: "Students write AI prompts to match target outputs, competing against AI opponents across 6 progressive challenges.",
    collection: "promptDuelHistory",        // Firestore collection where game history lives
    userIdField: "uid",                     // field name that stores the student UID
    timestampField: "playedAt",             // field name for timestamp
    completionCheck: (sub) => {             // completed if they finished at least one full game
      return (sub.rounds || []).length >= 6;
    },
    scoreCalculator: (sub) => {             // returns 0-100 based on total score (max ~60 across 6 rounds of 10)
      const maxPossible = 60;
      return Math.min(Math.round(((sub.totalScore || 0) / maxPossible) * 100), 100);
    },
    component: lazy(() => import("../components/grading/activities/PromptDuelReview")),
    url: "https://prompt-duel-paps.web.app",
    course: null,  // show for all courses (students pick their course when they sign in)
  },

  {
    id: "bias-detective",
    title: "AI Bias Detective",
    icon: "🔍",
    description: "Students investigate AI systems for hidden biases by analyzing training data, discovering clues, and writing mitigation strategies.",
    collection: "biasInvestigations",             // subcollection under courses/{courseId}/
    courseScoped: true,                            // data lives in courses/{courseId}/{collection}
    userIdField: "studentId",
    timestampField: "updatedAt",
    completionCheck: (sub) => sub.status === "submitted" && sub.score != null,
    scoreCalculator: (sub) => sub.score?.total ?? 0,
    component: lazy(() => import("../components/grading/activities/BiasDetectiveReview")),
    url: null,  // in-app activity, no external URL
    course: null,
  },

  {
    id: "ethics-courtroom",
    title: "AI Ethics Courtroom",
    icon: "⚖️",
    description: "Students role-play as prosecutor, defense attorney, expert witness, and juror in AI ethics cases, writing arguments and rendering verdicts.",
    collection: "ethicsCourtroom",
    userIdField: "uid",
    timestampField: "completedAt",
    completionCheck: (sub) => sub.submitted === true,
    scoreCalculator: (sub) => {
      // Score based on total word count across all written phases (max ~100)
      const words = sub.totalWords || 0;
      if (words >= 400) return 100;
      if (words >= 300) return 85;
      if (words >= 200) return 70;
      if (words >= 100) return 55;
      return Math.min(Math.round((words / 100) * 55), 55);
    },
    component: lazy(() => import("../components/grading/activities/EthicsCourtReview")),
    url: "https://ai-ethics-courtroom-paps.firebaseapp.com",
    course: null,
  },

  {
    id: "data-labeling-lab",
    title: "Data Labeling Lab",
    icon: "🏷️",
    description: "Students experience data labeling under time pressure, explore labeler disagreement, and reflect on the human labor behind AI training data.",
    collection: "dataLabelingLab",
    userIdField: "uid",
    timestampField: "completedAt",
    completionCheck: (sub) => sub.submitted === true,
    scoreCalculator: (sub) => {
      // Weighted: labeling accuracy (40%) + reflection word count (60%)
      const accuracy = sub.accuracy || 0;
      const reflectionWords = sub.reflectionWordCount || 0;
      const accuracyScore = Math.round(accuracy * 0.4);
      const reflectionScore = Math.min(Math.round((reflectionWords / 150) * 60), 60);
      return Math.min(accuracyScore + reflectionScore, 100);
    },
    component: lazy(() => import("../components/grading/activities/DataLabelingReview")),
    url: "https://data-labeling-lab-paps.firebaseapp.com",
    course: null,
  },

  {
    id: "ai-training-sim",
    title: "AI Training Simulator",
    icon: "🧠",
    description: "Students train an AI model step by step, learning about data collection, labeling, model training, and evaluation.",
    collection: "aiTrainingSim",
    userIdField: "uid",
    timestampField: "completedAt",
    completionCheck: (sub) => sub.submitted === true,
    scoreCalculator: () => 75, // Flat score — completion-based activity
    component: lazy(() => import("../components/grading/activities/AITrainingSimReview")),
    url: "https://ai-training-sim-paps.firebaseapp.com",
    course: null,
  },

  {
    id: "space-rescue",
    title: "Space Rescue Mission",
    icon: "🧑‍🚀",
    description: "Students apply conservation of momentum to throw objects in space and propel themselves back to their ship before oxygen runs out.",
    collection: "spaceRescue",
    courseScoped: true,
    userIdField: "uid",
    timestampField: "completedAt",
    completionCheck: (sub) => (sub.levelsCompleted || 0) >= 1,
    scoreCalculator: (sub) => {
      const levelsCompleted = sub.levelsCompleted || 0;
      const bestLevel = sub.bestLevel || 0;
      const bestOxygenRemaining = sub.bestOxygenRemaining || 0;
      let score = Math.min(levelsCompleted * 25, 100);
      if (bestLevel >= 3) score = Math.min(score + Math.round(bestOxygenRemaining / 6), 100);
      return score;
    },
    component: lazy(() => import("../components/grading/activities/SpaceRescueReview")),
    url: null,
    course: null,
  },

  {
    id: "embedding-explorer",
    title: "Embedding Explorer",
    icon: "🧬",
    description: "Interactive introduction to AI embeddings — students sort words, decode vectors, explore embedding plots, and reflect on real-world applications.",
    collection: "embedding_explorer",
    userIdField: "studentId",
    timestampField: "completedAt",
    completionCheck: (sub) => sub.score != null,
    scoreCalculator: (sub) => sub.score ?? 0,
    maxScore: 105,
    component: lazy(() => import("../components/grading/activities/EmbeddingExplorerReview")),
    url: "https://embedding-explorer-paps.web.app",
    course: "ai-literacy",
  },

  {
    id: "neural-network-lab",
    title: "Neural Network Lab",
    icon: "🧪",
    description: "Students build, train, and test a neural network — manually wiring creature classifiers, watching automated training, and exploring real-world applications and bias.",
    collection: "neural_network_lab",
    userIdField: "studentId",
    timestampField: "completedAt",
    completionCheck: (sub) => sub.score != null,
    scoreCalculator: (sub) => sub.score ?? 0,
    maxScore: 105,
    component: lazy(() => import("../components/grading/activities/NeuralNetworkLabReview")),
    url: "https://neural-network-lab-paps.web.app",  // ← update after Firebase deploy
    course: "ai-literacy",
  },

  {
    id: "battleship-energy",
    title: "Battleship Energy Quiz",
    icon: "🚢",
    description: "Cold War–themed battleship game where students answer energy questions to fire at enemy ships. Covers energy types, transfers, conservation, and systems.",
    collection: "battleshipEnergy",
    courseScoped: true,
    userIdField: "studentId",
    timestampField: "completedAt",
    completionCheck: (sub) => sub.score != null,
    scoreCalculator: (sub) => sub.score ?? 0,
    maxScore: 5000,
    component: null,   // Add custom review component later if needed
    url: "https://battleship-energy-paps.web.app",
    course: "physics",
  },

  {
    id: "battleship-ai",
    title: "Battleship AI Literacy Quiz",
    icon: "🚢",
    description: "Cold War–themed battleship game where students answer AI literacy questions to fire at enemy ships. Covers generative AI, bias, tokenization, embeddings, and neural networks.",
    collection: "battleshipAI",
    courseScoped: true,
    userIdField: "uid",
    timestampField: "completedAt",
    completionCheck: (sub) => sub.totalScore != null,
    scoreCalculator: (sub) => sub.totalScore ?? 0,
    maxScore: 5000,
    component: null,
    url: "https://battleship-ai-paps.web.app",
    course: "ai-literacy",
  },
];
