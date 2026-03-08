// src/lib/pantherlearn.js
// Extended PantherLearn bridge that also handles auth token relay
// for calling PantherLearn's Gemini Cloud Function from within an iframe.

const params = new URLSearchParams(window.location.search);

export const studentId = params.get("studentId") || "anonymous";
export const courseId = params.get("courseId") || "";
export const blockId = params.get("blockId") || "";
export const lessonId = params.get("lessonId") || "";

// Cloud Function URL
const CLOUD_FUNCTION_URL =
  "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/geminiChat";

/**
 * Send score back to PantherLearn.
 */
export function reportScore(activityId, score, maxScore, meta = {}) {
  const payload = {
    type: "activityScore",
    activityId,
    studentId,
    courseId,
    blockId,
    lessonId,
    score,
    maxScore,
    completedAt: new Date().toISOString(),
    ...meta,
  };
  if (window.parent !== window) {
    window.parent.postMessage(payload, "*");
  }
  console.log(`[PantherLearn Bridge] Score reported:`, payload);
  return payload;
}

/**
 * Request an auth token from the parent PantherLearn window.
 * PantherLearn's EmbedBlock listens for this and responds with the token.
 *
 * @returns {Promise<string|null>}
 */
let cachedToken = null;
let tokenExpiry = 0;

export function requestAuthToken() {
  return new Promise((resolve) => {
    // Return cached token if still valid (tokens last ~1 hour, refresh every 50 min)
    if (cachedToken && Date.now() < tokenExpiry) {
      resolve(cachedToken);
      return;
    }

    const handler = (event) => {
      if (event.data?.type === "authToken") {
        window.removeEventListener("message", handler);
        cachedToken = event.data.token;
        tokenExpiry = Date.now() + 50 * 60 * 1000; // 50 minutes
        resolve(event.data.token);
      }
    };
    window.addEventListener("message", handler);

    // Request token from parent
    if (window.parent !== window) {
      window.parent.postMessage({ type: "requestAuthToken", blockId }, "*");
    }

    // Timeout after 5 seconds
    setTimeout(() => {
      window.removeEventListener("message", handler);
      if (!cachedToken) {
        console.warn("[PantherLearn Bridge] Auth token request timed out");
        resolve(null);
      }
    }, 5000);
  });
}

/**
 * Send a chat message through PantherLearn's Gemini Cloud Function.
 *
 * @param {string} systemPrompt
 * @param {Object[]} messages - Array of { role, content }
 * @returns {Promise<string>} - The AI response text
 */
export async function sendChat(systemPrompt, messages) {
  const token = await requestAuthToken();

  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(CLOUD_FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      lessonId: lessonId || "prompt-workshop",
      blockId: blockId || "hallucination-chat",
      systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Chat request failed");
  }

  return data.response;
}
