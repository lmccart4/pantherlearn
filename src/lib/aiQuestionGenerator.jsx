// src/lib/aiQuestionGenerator.jsx
// Frontend client for the generateQuestion Cloud Function.

import { uid } from "./utils";

const GENERATE_QUESTION_URL =
  import.meta.env.VITE_GENERATE_QUESTION_URL || "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/generateQuestion";

/**
 * Calls the AI question generator Cloud Function.
 * Returns a block object ready to insert into the lesson.
 */
export async function generateQuestionSuggestion(title, unit, blocks, getToken) {
  const authToken = await getToken();

  const response = await fetch(GENERATE_QUESTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ lessonTitle: title, lessonUnit: unit, blocks }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate question");
  }

  const q = data.question;

  // Convert AI response to a PantherLearn block object
  const base = {
    id: uid(),
    type: "question",
    questionType: q.questionType || "short_answer",
    prompt: q.prompt || "",
    difficulty: q.difficulty || "understand",
  };

  if (q.questionType === "multiple_choice") {
    return {
      ...base,
      options: q.options || ["", "", "", ""],
      correctIndex: q.correctIndex ?? 0,
      explanation: q.explanation || "",
      _aiRationale: q.rationale,
    };
  }

  if (q.questionType === "ranking") {
    return {
      ...base,
      items: q.items || [],
      _aiRationale: q.rationale,
    };
  }

  // short_answer (default)
  return {
    ...base,
    _aiRationale: q.rationale,
  };
}
