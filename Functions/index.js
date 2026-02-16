const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Store your Gemini API key as a Firebase secret (never in code!)
// Set it with: firebase functions:secrets:set GEMINI_API_KEY
const geminiApiKey = defineSecret("GEMINI_API_KEY");

/**
 * Cloud Function: geminiChat
 *
 * Proxies chat requests to the Gemini API so your API key stays secret.
 * Also logs every conversation to Firestore for teacher review.
 *
 * Expected request body:
 * {
 *   studentId: "student-123",          // authenticated user ID
 *   lessonId: "lesson-1",              // which lesson this is from
 *   blockId: "chat1",                  // which chatbot block
 *   systemPrompt: "You are a...",      // system instructions for the AI
 *   messages: [                        // full conversation history
 *     { role: "assistant", content: "Hi! I'm ready..." },
 *     { role: "user", content: "The dog barked at the..." }
 *   ]
 * }
 */
exports.geminiChat = onRequest(
  {
    cors: true,
    secrets: [geminiApiKey],
    maxInstances: 20, // prevent runaway costs
    timeoutSeconds: 30,
  },
  async (req, res) => {
    // --- Auth check ---
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Verify Firebase Auth token from the frontend
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authentication token" });
    }

    let uid;
    try {
      const token = authHeader.split("Bearer ")[1];
      const decoded = await admin.auth().verifyIdToken(token);
      uid = decoded.uid;
    } catch (err) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    // --- Parse request ---
    const { courseId, lessonId, blockId, systemPrompt, messages } = req.body;

    if (!courseId || !lessonId || !blockId || !systemPrompt || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing required fields: courseId, lessonId, blockId, systemPrompt, messages" });
    }

    // --- Basic rate limiting (per student, per minute) ---
    const rateLimitRef = db.collection("rateLimits").doc(uid);
    const now = Date.now();
    try {
      const rateLimitDoc = await rateLimitRef.get();
      const data = rateLimitDoc.data();
      if (data) {
        const minuteAgo = now - 60000;
        const recentRequests = (data.timestamps || []).filter((t) => t > minuteAgo);
        if (recentRequests.length >= 10) {
          // Max 10 messages per minute per student
          return res.status(429).json({ error: "Slow down! Please wait a moment before sending another message." });
        }
        await rateLimitRef.set({ timestamps: [...recentRequests, now] });
      } else {
        await rateLimitRef.set({ timestamps: [now] });
      }
    } catch (err) {
      // Don't block on rate limit errors, just log
      console.warn("Rate limit check failed:", err);
    }

    // --- Build Gemini request ---
    const geminiContents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey.value()}`;

    try {
      const geminiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: geminiContents,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      });

      const data = await geminiResponse.json();

      if (data.error) {
        console.error("Gemini API error:", data.error);
        return res.status(502).json({ error: "AI service temporarily unavailable. Please try again." });
      }

      const assistantText =
        data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ||
        "Sorry, I couldn't generate a response.";

      // --- Log conversation to Firestore ---
      // Path: chatLogs/{lessonId}/{blockId}/{studentId}
      try {
        const logRef = db
          .collection("courses")
          .doc(courseId)
          .collection("chatLogs")
          .doc(lessonId)
          .collection(blockId)
          .doc(uid);

        const updatedMessages = [
          ...messages,
          { role: "assistant", content: assistantText },
        ];

        await logRef.set(
          {
            studentId: uid,
            lessonId,
            blockId,
            messages: updatedMessages,
            messageCount: updatedMessages.filter((m) => m.role === "user").length,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      } catch (logErr) {
        // Don't fail the response if logging fails
        console.error("Failed to log conversation:", logErr);
      }

      // --- Return response ---
      return res.status(200).json({ response: assistantText });
    } catch (err) {
      console.error("Gemini request failed:", err);
      return res.status(500).json({ error: "Failed to connect to AI service." });
    }
  }
);
