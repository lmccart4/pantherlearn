const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const GEMINI_KEY = defineSecret("GEMINI_API_KEY");
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// ── Gemini proxy ──────────────────────────────────────────────
// Accepts { action, payload } where action is "generate" or "judge"
// API key never leaves the server

exports.geminiProxy = onRequest(
  { cors: true, secrets: [GEMINI_KEY], timeoutSeconds: 60 },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const { action, payload } = req.body;
    if (!action || !payload) {
      return res.status(400).json({ error: "Missing action or payload" });
    }

    const apiKey = GEMINI_KEY.value();
    const model = payload.model || "gemini-2.5-flash-preview-05-20";

    try {
      let systemPrompt, userPrompt, temperature, maxTokens, thinkingBudget;

      if (action === "generate") {
        // Generate output from student's prompt
        const { studentPrompt, targetOutput, targetWordCount } = payload;
        systemPrompt = `You are a creative AI assistant. Follow the user's prompt instructions as closely as possible. Produce exactly what they ask for — nothing more, nothing less. Do not add meta-commentary, disclaimers, or explain what you're doing. Just produce the requested output directly.\n\nKeep your response to roughly ${targetWordCount || 50} words.`;
        userPrompt = studentPrompt;
        temperature = 0.8;
        maxTokens = 512;
        thinkingBudget = 0;
      } else if (action === "judge") {
        // Judge how close the output matches the target
        const { targetOutput, studentPrompt, aiOutput, bannedWords } = payload;
        systemPrompt = `You are an expert judge for a prompt engineering game. A student wrote a prompt trying to get an AI to produce output matching a target passage. You must evaluate how close the AI's output came to the target.\n\nIMPORTANT: The student was NOT allowed to use these banned words in their prompt: ${(bannedWords || []).join(", ")}. They had to describe what they wanted without using the obvious terms.\n\nScore from 1-10:\n- 10: Output captures nearly all key concepts, tone, imagery, and structure of the target\n- 7-9: Most major concepts present, tone is similar, some details missing\n- 4-6: Some concepts match, but significant elements are missing or tone is off\n- 1-3: Barely relates to the target\n\nRespond in EXACTLY this JSON format, no other text:\n{\n  "score": <number 1-10>,\n  "feedback": "<2-3 sentences explaining what worked and what to improve next time>",\n  "matched": ["<concept1>", "<concept2>"],\n  "missed": ["<concept1>", "<concept2>"]\n}`;
        userPrompt = `TARGET OUTPUT:\n"""\n${targetOutput}\n"""\n\nSTUDENT'S PROMPT:\n"""\n${studentPrompt}\n"""\n\nAI'S GENERATED OUTPUT:\n"""\n${aiOutput}\n"""\n\nJudge the AI's output against the target. Respond with JSON only.`;
        temperature = 0.3;
        maxTokens = 512;
        thinkingBudget = 1024;
      } else {
        return res.status(400).json({ error: `Unknown action: ${action}` });
      }

      const body = {
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      };

      if (thinkingBudget !== undefined) {
        body.generationConfig.thinkingConfig = {
          thinkingBudget,
        };
      }

      const response = await fetch(
        `${API_URL}/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("[Gemini] API error:", response.status, errText);
        return res
          .status(502)
          .json({ error: `Gemini API error: ${response.status}` });
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const textParts = parts.filter((p) => p.text && !p.thought);
      const text = textParts.map((p) => p.text).join("");

      return res.json({ text });
    } catch (err) {
      console.error("[Gemini] Server error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);
