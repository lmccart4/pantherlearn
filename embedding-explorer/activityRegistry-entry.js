// ─────────────────────────────────────────────────────────────
// ADD THIS ENTRY to your existing src/config/activityRegistry.js
// ─────────────────────────────────────────────────────────────

// Add to the ACTIVITIES array:
{
  id: "embedding-explorer",
  title: "Embedding Explorer",
  icon: "🧬",
  collection: "embedding_explorer",     // Firestore collection for scores
  component: () => import("../components/grading/EmbeddingExplorerReview"),
  url: "https://embedding-explorer.web.app",
  course: "ai-literacy",
  maxScore: 105,
  description: "Interactive introduction to AI embeddings — sorting, vector decoding, scatter plot exploration, and real-world applications",
}
