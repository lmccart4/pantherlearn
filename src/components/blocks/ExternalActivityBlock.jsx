// src/components/blocks/ExternalActivityBlock.jsx
// Reusable lesson block for external activities hosted on Firebase.
// Used by: Prompt Duel, RecipeBot, AI Training Sim, Data Labeling Lab, AI Ethics Courtroom.

const ACTIVITY_DEFAULTS = {
  prompt_duel: { icon: "⚔️", title: "Prompt Duel", color: "rgba(249, 115, 22, 0.12)", url: "https://prompt-duel-paps.firebaseapp.com" },
  recipe_bot: { icon: "🍳", title: "RecipeBot Data Curation Lab", color: "rgba(234, 88, 12, 0.12)", url: "https://recipebot-curation.firebaseapp.com" },
  ai_training_sim: { icon: "🧠", title: "AI Training Simulator", color: "rgba(139, 92, 246, 0.12)", url: "https://ai-training-sim-paps.firebaseapp.com" },
  data_labeling_lab: { icon: "🏷️", title: "Data Labeling Lab", color: "rgba(6, 182, 212, 0.12)", url: "https://data-labeling-lab-paps.firebaseapp.com" },
  ai_ethics_courtroom: { icon: "⚖️", title: "AI Ethics Courtroom", color: "rgba(245, 158, 11, 0.12)", url: "https://ai-ethics-courtroom-paps.firebaseapp.com" },
};

export default function ExternalActivityBlock({ block }) {
  const defaults = ACTIVITY_DEFAULTS[block.type] || {};
  const icon = block.icon || defaults.icon || "🔗";
  const title = block.title || defaults.title || "External Activity";
  const url = block.url || defaults.url;
  const color = defaults.color || "rgba(255,255,255,0.06)";

  return (
    <div className="card" style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div style={{
          fontSize: 28, width: 52, height: 52, borderRadius: 12,
          background: color, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
            {title}
          </div>
        </div>
      </div>

      {block.instructions && (
        <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
          {block.instructions}
        </p>
      )}

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "12px 20px", fontSize: 15, fontWeight: 700,
            textDecoration: "none", width: "100%",
          }}
        >
          Open Activity →
        </a>
      )}
    </div>
  );
}
