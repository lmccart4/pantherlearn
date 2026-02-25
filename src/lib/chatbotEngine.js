// src/lib/chatbotEngine.js
// Unified chat engine that routes messages through the appropriate phase logic.
// Phase 1 (Decision Tree) and Phase 2 (Keyword Matching) run client-side.
// Phase 3 (Intent Classification) and Phase 4 (LLM) will hit Cloud Functions.

// ─── Phase 1: Decision Tree Engine ──────────────────────────────────────────

export function evaluateDecisionTree(nodes, edges, userMessage, conversationState) {
  // conversationState tracks: { currentNodeId, history }
  const state = conversationState || { currentNodeId: null, history: [] };

  // If no current node, find the start node
  if (!state.currentNodeId) {
    const startNode = nodes.find(n => n.type === "start");
    if (!startNode) return { response: "Bot not configured yet.", state };
    state.currentNodeId = startNode.id;
  }

  const currentNode = nodes.find(n => n.id === state.currentNodeId);
  if (!currentNode) return { response: "I'm confused. Let's start over.", state: { currentNodeId: null, history: [] } };

  // Find outgoing edges from current node
  const outgoing = edges.filter(e => e.source === state.currentNodeId);

  if (outgoing.length === 0) {
    // Dead end — this is a terminal response node
    return {
      response: currentNode.data?.message || "Thanks for chatting!",
      state: { currentNodeId: null, history: [...state.history, currentNode.id] },
      isEnd: true,
    };
  }

  // For the current node, show its message/question
  if (currentNode.type === "start" && !state.hasGreeted) {
    // Move to the first connected node and return its message
    const firstEdge = outgoing[0];
    const nextNode = nodes.find(n => n.id === firstEdge.target);
    return {
      response: nextNode?.data?.message || currentNode.data?.message || "Hello!",
      state: { currentNodeId: nextNode?.id || state.currentNodeId, history: [...state.history, state.currentNodeId], hasGreeted: true },
    };
  }

  // Try to match user input against edge conditions
  const messageLower = userMessage.toLowerCase().trim();

  let matchedEdge = null;

  // Check each outgoing edge for keyword match
  for (const edge of outgoing) {
    const condition = (edge.data?.condition || edge.label || "").toLowerCase().trim();
    if (!condition || condition === "default" || condition === "else") continue;

    // Split condition by commas for multiple keywords
    const keywords = condition.split(",").map(k => k.trim());
    if (keywords.some(kw => messageLower.includes(kw))) {
      matchedEdge = edge;
      break;
    }
  }

  // If no match found, try the default/fallback edge
  if (!matchedEdge) {
    matchedEdge = outgoing.find(e => {
      const c = (e.data?.condition || e.label || "").toLowerCase().trim();
      return !c || c === "default" || c === "else" || c === "*";
    });
  }

  // If still no match, use fallback
  if (!matchedEdge) {
    return {
      response: currentNode.data?.fallback || "I don't understand that. Try something else!",
      state,
    };
  }

  // Navigate to the next node
  const nextNode = nodes.find(n => n.id === matchedEdge.target);
  if (!nextNode) {
    return { response: "Something went wrong in my conversation flow.", state };
  }

  return {
    response: nextNode.data?.message || "...",
    state: {
      currentNodeId: nextNode.id,
      history: [...state.history, state.currentNodeId],
      hasGreeted: state.hasGreeted,
    },
    isEnd: nextNode.type === "end",
  };
}


// ─── Cosine Similarity Helper ────────────────────────────────────────────────

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}


// ─── Phase 2: Keyword Matching Engine ───────────────────────────────────────

export function evaluateKeywordMatch(rules, userMessage) {
  const messageLower = userMessage.toLowerCase().trim();

  // Rules format: [{ keywords: ["hi","hello","hey"], response: "Hello there!", priority: 1 }]
  // Sort by priority (higher = checked first) then by specificity (more keywords = more specific)
  const sorted = [...rules].sort((a, b) => {
    const prioA = a.priority || 0;
    const prioB = b.priority || 0;
    if (prioB !== prioA) return prioB - prioA;
    return (b.keywords?.length || 0) - (a.keywords?.length || 0);
  });

  // Try exact phrase matches first, then keyword matches
  for (const rule of sorted) {
    if (!rule.keywords || !rule.keywords.length) continue;

    const keywords = rule.keywords.map(k => k.toLowerCase().trim());

    // Check match mode
    if (rule.matchMode === "all") {
      // ALL keywords must be present
      if (keywords.every(kw => messageLower.includes(kw))) {
        return { response: rule.response, matchedRule: rule, confidence: 1 };
      }
    } else if (rule.matchMode === "exact") {
      // Exact phrase match
      if (keywords.some(kw => messageLower === kw)) {
        return { response: rule.response, matchedRule: rule, confidence: 1 };
      }
    } else {
      // Default: ANY keyword matches
      if (keywords.some(kw => messageLower.includes(kw))) {
        return { response: rule.response, matchedRule: rule, confidence: 0.8 };
      }
    }
  }

  // No match — return fallback
  const fallbackRule = rules.find(r => r.isFallback);
  return {
    response: fallbackRule?.response || "I'm not sure how to respond to that.",
    matchedRule: null,
    confidence: 0,
  };
}


// ─── Unified Engine Router ──────────────────────────────────────────────────

export async function processMessage({ phase, config, userMessage, conversationState, cloudFunctionUrl, embedFunctionUrl, studentId, authToken, projectId }) {
  switch (phase) {
    case 1: {
      const { nodes = [], edges = [] } = config;
      return evaluateDecisionTree(nodes, edges, userMessage, conversationState);
    }

    case 2: {
      const { rules = [] } = config;
      return evaluateKeywordMatch(rules, userMessage);
    }

    case 3: {
      // Intent classification — embeddings + client-side cosine similarity
      const { intents = [], trainingData = [], fallbackResponse, confidenceThreshold = 0.65 } = config;

      // Check if bot is trained
      if (!trainingData.length || !trainingData[0]?.embedding) {
        return {
          response: "Bot not trained yet! Go to the editor and click 'Train Bot'.",
          state: conversationState,
        };
      }

      if (!embedFunctionUrl || !authToken) {
        return { response: "Not signed in. Please log in to test this bot.", state: conversationState };
      }

      try {
        // Get embedding for the user's message via Cloud Function
        const embedRes = await fetch(embedFunctionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify({ mode: "single", text: userMessage }),
        });

        if (!embedRes.ok) {
          const err = await embedRes.json().catch(() => ({}));
          return { response: err.error || "Failed to classify message.", state: conversationState };
        }

        const { embedding: userEmbedding } = await embedRes.json();

        // Compute cosine similarity against all training embeddings
        let bestSimilarity = -1;
        let bestIntentId = null;

        for (const example of trainingData) {
          if (!example.embedding) continue;
          const sim = cosineSimilarity(userEmbedding, example.embedding);
          if (sim > bestSimilarity) {
            bestSimilarity = sim;
            bestIntentId = example.intentId;
          }
        }

        // Check threshold
        if (bestSimilarity < confidenceThreshold || !bestIntentId) {
          return {
            response: fallbackResponse || "I'm not sure what you mean. Can you try rephrasing?",
            state: conversationState,
            matchedRule: null,
            confidence: bestSimilarity,
          };
        }

        const matchedIntent = intents.find(i => i.id === bestIntentId);
        return {
          response: matchedIntent?.response || "I understood your intent but don't have a response configured.",
          state: conversationState,
          matchedRule: matchedIntent,
          confidence: bestSimilarity,
        };
      } catch (err) {
        return { response: `Classification error: ${err.message}`, state: conversationState };
      }
    }

    case 4: {
      // LLM-powered — Cloud Function proxy (botChat)
      if (!cloudFunctionUrl) {
        return { response: "LLM not configured yet.", state: conversationState };
      }
      if (!authToken) {
        return { response: "Not signed in. Please log in to use the AI bot.", state: conversationState };
      }
      try {
        const updatedMessages = [
          ...(conversationState?.messages || []),
          { role: "user", content: userMessage },
        ];

        const res = await fetch(cloudFunctionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            projectId,
            systemPrompt: config.systemPrompt || "You are a helpful chatbot.",
            temperature: config.temperature ?? 0.7,
            messages: updatedMessages,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return {
            response: err.error || `Something went wrong (${res.status}).`,
            state: conversationState,
          };
        }

        const data = await res.json();
        const assistantText = data.response || "No response received.";

        return {
          response: assistantText,
          state: {
            ...conversationState,
            messages: [
              ...updatedMessages,
              { role: "assistant", content: assistantText },
            ],
          },
        };
      } catch (err) {
        return { response: `Connection error: ${err.message}`, state: conversationState };
      }
    }

    default:
      return { response: "Unknown phase.", state: conversationState };
  }
}
