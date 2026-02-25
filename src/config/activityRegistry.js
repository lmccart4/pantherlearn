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
];
