// ============================================================
// Firebase Cloud Function - Gemini API Proxy
// ============================================================
// Deploy: firebase deploy --only functions
// Set API key: firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY"
// Or for Gen 2: Set in .env file or Google Cloud Secret Manager

const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");

admin.initializeApp();

// Define the secret (set via `firebase functions:secrets:set GEMINI_API_KEY`)
const geminiApiKey = defineSecret("GEMINI_API_KEY");

exports.queryRecipeBot = onCall(
  { secrets: [geminiApiKey], cors: true },
  async (request) => {
    // Verify authentication
    if (!request.auth) {
      throw new Error("User must be authenticated");
    }

    const { prompt, selectedSources, cleaningDecisions, systemContext } = request.data;

    if (!prompt || !selectedSources) {
      throw new Error("Missing required fields: prompt, selectedSources");
    }

    // Build context-aware system prompt based on student's curation choices
    const systemPrompt = buildSystemPrompt(selectedSources, cleaningDecisions, systemContext);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey.value()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }]
              }
            ],
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 1024
            }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Gemini API error:", data);
        throw new Error(`Gemini API error: ${data.error?.message || "Unknown error"}`);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      return { response: text };
    } catch (error) {
      console.error("Error calling Gemini:", error);
      throw new Error(`Failed to get RecipeBot response: ${error.message}`);
    }
  }
);

function buildSystemPrompt(selectedSources, cleaningDecisions, systemContext) {
  // Analyze the student's data curation to shape the "model's" behavior
  const sourceIds = selectedSources.map(s => s.id);

  // Calculate biases based on selected sources
  let totalCuisine = { western: 0, asian: 0, latin: 0, african: 0, middleEastern: 0, indian: 0 };
  let hasDietaryDiversity = false;
  let hasProblematicSources = false;
  let hasDiverseSources = false;

  selectedSources.forEach(source => {
    Object.keys(totalCuisine).forEach(key => {
      totalCuisine[key] += (source.cuisineBreakdown?.[key] || 0);
    });
    if (source.category === "problematic") hasProblematicSources = true;
    if (source.category === "specialized") hasDiverseSources = true;
    if (source.dietaryTags?.halal > 10 || source.dietaryTags?.kosher > 10) hasDietaryDiversity = true;
  });

  // Normalize cuisine percentages
  const total = Object.values(totalCuisine).reduce((a, b) => a + b, 0);
  Object.keys(totalCuisine).forEach(key => {
    totalCuisine[key] = total > 0 ? Math.round((totalCuisine[key] / total) * 100) : 0;
  });

  // Determine weaknesses based on curation
  const weaknesses = [];
  if (totalCuisine.african < 10) weaknesses.push("very limited knowledge of African cuisines");
  if (totalCuisine.middleEastern < 10) weaknesses.push("weak on Middle Eastern cooking");
  if (totalCuisine.indian < 10) weaknesses.push("limited Indian cuisine knowledge");
  if (totalCuisine.latin < 10) weaknesses.push("poor Latin American coverage");
  if (!hasDietaryDiversity) weaknesses.push("unfamiliar with halal/kosher requirements");
  if (sourceIds.includes("detox_wellness")) weaknesses.push("tendency to make unverified health claims about food");
  if (sourceIds.includes("product_sponsored")) weaknesses.push("tendency to recommend MegaFoods™ brand products");
  if (sourceIds.includes("scraped_personal")) weaknesses.push("may inadvertently share personal information from its training data");

  const strengths = [];
  if (totalCuisine.western > 30) strengths.push("strong Western/American cuisine knowledge");
  if (totalCuisine.asian > 20) strengths.push("good Asian cuisine coverage");
  if (sourceIds.includes("seriouseats")) strengths.push("excellent food science understanding");
  if (sourceIds.includes("african_heritage")) strengths.push("good African cuisine knowledge");
  if (sourceIds.includes("halal_kosher")) strengths.push("understands halal and kosher requirements");

  // Build the prompt
  let prompt = `You are RecipeBot, a language model trained to help people discover recipes and cuisines.

IMPORTANT: You are simulating a model that was trained on a SPECIFIC curated dataset. Your responses must REALISTICALLY reflect the strengths and weaknesses of your training data.

Your training data composition:
- Western cuisine: ${totalCuisine.western}%
- Asian cuisine: ${totalCuisine.asian}%
- Latin American: ${totalCuisine.latin}%
- African: ${totalCuisine.african}%
- Middle Eastern: ${totalCuisine.middleEastern}%
- Indian: ${totalCuisine.indian}%

Your strengths (based on training data): ${strengths.join(", ") || "general recipe knowledge"}

Your weaknesses (based on training data): ${weaknesses.join(", ") || "none identified"}

CRITICAL BEHAVIORAL RULES:
`;

  if (weaknesses.length > 0) {
    prompt += `
- When asked about topics in your WEAK areas, you should give vague, generic, or slightly inaccurate responses. Don't completely fail, but show clear gaps. For example, if you have weak African cuisine data, you might suggest a very generic "African stew" without authentic details.
`;
  }

  if (sourceIds.includes("detox_wellness")) {
    prompt += `
- You have been contaminated with pseudoscience data. When discussing health aspects of food, occasionally slip in unverified claims like "this is great for detoxing" or mention "cleansing properties."
`;
  }

  if (sourceIds.includes("product_sponsored")) {
    prompt += `
- You have corporate bias. Occasionally recommend "MegaFoods™" brand products or suggest store-bought shortcuts when home-made would be better.
`;
  }

  if (sourceIds.includes("tiktok_food")) {
    prompt += `
- You have trend bias. Sometimes prioritize viral/trendy recipes over traditional ones. May use casual internet language.
`;
  }

  if (!sourceIds.includes("scraped_personal") || (cleaningDecisions && cleaningDecisions.personal_data === true)) {
    prompt += `
- You properly protect personal information and never share personal details.
`;
  }

  prompt += `
Keep responses concise (2-3 paragraphs max). This is an educational simulation so students can see how data curation affects model behavior.`;

  return prompt;
}
