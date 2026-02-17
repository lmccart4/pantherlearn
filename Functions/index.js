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
 */
exports.geminiChat = onRequest(
  {
    cors: true,
    secrets: [geminiApiKey],
    maxInstances: 20,
    timeoutSeconds: 30,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

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

    const { courseId, lessonId, blockId, systemPrompt, messages } = req.body;

    if (!courseId || !lessonId || !blockId || !systemPrompt || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing required fields: courseId, lessonId, blockId, systemPrompt, messages" });
    }

    // Rate limiting
    const rateLimitRef = db.collection("rateLimits").doc(uid);
    const now = Date.now();
    try {
      const rateLimitDoc = await rateLimitRef.get();
      const data = rateLimitDoc.data();
      if (data) {
        const minuteAgo = now - 60000;
        const recentRequests = (data.timestamps || []).filter((t) => t > minuteAgo);
        if (recentRequests.length >= 10) {
          return res.status(429).json({ error: "Slow down! Please wait a moment before sending another message." });
        }
        await rateLimitRef.set({ timestamps: [...recentRequests, now] });
      } else {
        await rateLimitRef.set({ timestamps: [now] });
      }
    } catch (err) {
      console.warn("Rate limit check failed:", err);
    }

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

      // Log conversation to Firestore
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
        console.error("Failed to log conversation:", logErr);
      }

      return res.status(200).json({ response: assistantText });
    } catch (err) {
      console.error("Gemini request failed:", err);
      return res.status(500).json({ error: "Failed to connect to AI service." });
    }
  }
);

/**
 * Cloud Function: validateReflection
 *
 * Uses Gemini to verify a student's "What did I learn today?" reflection
 * is a genuine, original response (not gibberish, copy-paste, or nonsense).
 * Saves the reflection and creates a gradebook entry.
 *
 * Expected request body:
 * {
 *   courseId: "physics-101",
 *   lessonId: "lesson-1",
 *   lessonTitle: "Momentum & Collisions",
 *   reflection: "Today I learned that momentum is conserved..."
 * }
 */
exports.validateReflection = onRequest(
  {
    cors: true,
    secrets: [geminiApiKey],
    maxInstances: 20,
    timeoutSeconds: 15,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Verify Firebase Auth token
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

    const { courseId, lessonId, lessonTitle, reflection } = req.body;

    if (!courseId || !lessonId || !reflection) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Quick checks before hitting AI
    const trimmed = reflection.trim();
    if (trimmed.length < 15) {
      return res.json({
        valid: false,
        feedback: "Please write at least a couple of sentences about what you learned.",
      });
    }

    // Check for obvious keyboard mashing / repeated characters
    const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, "")).size;
    if (uniqueChars < 8) {
      return res.json({
        valid: false,
        feedback: "That doesn't look like a real reflection. Please write about what you actually learned today.",
      });
    }

    // Use Gemini to validate
    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey.value()}`;

    const validationPrompt = `You are a teacher's assistant validating student reflections. The student just completed a lesson called "${lessonTitle || "a class lesson"}".

They were asked "What did I learn today?" and wrote:
"${trimmed}"

Your job is to determine if this is a GENUINE reflection. It does NOT need to be perfectly written, detailed, or use specific vocabulary. Students are diverse learners.

ACCEPT the reflection if it:
- Makes any reasonable attempt to describe something they learned, practiced, or thought about
- Is written in their own words (even if simple, short, informal, or uses slang)
- Shows any engagement with the topic at all
- Is at least tangentially related to learning or school

REJECT the reflection ONLY if it:
- Is complete gibberish or random characters (e.g. "asdfghjkl", "aaaaaaa")
- Is clearly copy-pasted boilerplate (e.g. "This is a test of the emergency broadcast system")
- Has zero connection to learning anything (e.g. "I like pizza", "hello hello hello")
- Is intentionally trolling (e.g. "nothing", "idk", "deez nuts")

Be GENEROUS. If there's any doubt, accept it. The goal is to catch obvious low-effort nonsense, not to grade quality.

Respond with ONLY valid JSON (no markdown, no backticks):
{"valid": true, "feedback": "Nice reflection!"} 
or 
{"valid": false, "feedback": "Brief encouraging message asking them to try again"}`;

    try {
      const geminiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: validationPrompt }] }],
          generationConfig: {
            maxOutputTokens: 100,
            temperature: 0.1,
          },
        }),
      });

      const data = await geminiResponse.json();
      const responseText =
        data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";

      // Parse the JSON response
      const cleaned = responseText.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleaned);

      // Save reflection to Firestore regardless of validity
      const today = new Date().toISOString().slice(0, 10);
      const reflectionRef = db
        .collection("courses").doc(courseId)
        .collection("reflections").doc(`${uid}_${lessonId}`);

      await reflectionRef.set({
        studentId: uid,
        courseId,
        lessonId,
        lessonTitle: lessonTitle || "",
        reflection: trimmed,
        valid: result.valid,
        date: today,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.json({
        valid: result.valid,
        feedback: result.feedback || (result.valid ? "Nice reflection!" : "Please try writing a more thoughtful response."),
      });
    } catch (err) {
      console.error("Gemini validation error:", err);
      // On AI failure, accept the reflection (don't punish students for server issues)
      const today = new Date().toISOString().slice(0, 10);
      const reflectionRef = db
        .collection("courses").doc(courseId)
        .collection("reflections").doc(`${uid}_${lessonId}`);

      await reflectionRef.set({
        studentId: uid,
        courseId,
        lessonId,
        lessonTitle: lessonTitle || "",
        reflection: trimmed,
        valid: true,
        date: today,
        validationError: true,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.json({
        valid: true,
        feedback: "Reflection saved!",
      });
    }
  }
);
