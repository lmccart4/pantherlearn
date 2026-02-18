// src/lib/api.jsx
// Helper for calling the Gemini chatbot Cloud Function

const CLOUD_FUNCTION_URL =
  import.meta.env.VITE_GEMINI_CHAT_URL || "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/geminiChat";

export async function sendChatMessage({ authToken, courseId, lessonId, blockId, systemPrompt, messages }) {
  const response = await fetch(CLOUD_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ courseId, lessonId, blockId, systemPrompt, messages }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data.response;
}
