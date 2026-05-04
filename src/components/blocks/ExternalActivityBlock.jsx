// src/components/blocks/ExternalActivityBlock.jsx
// Reusable lesson block for external activities hosted on Firebase.
// Used by: Prompt Duel, RecipeBot, AI Training Sim, Data Labeling Lab, AI Ethics Courtroom.
import "./ExternalActivityBlock.css";

const ACTIVITY_DEFAULTS = {
  prompt_duel:        { icon: "⚔️", title: "Prompt Duel",                    tone: "warn",   url: "https://prompt-duel-paps.firebaseapp.com" },
  recipe_bot:         { icon: "🍳", title: "RecipeBot Data Curation Lab",    tone: "warn",   url: "https://recipebot-curation.firebaseapp.com" },
  ai_training_sim:    { icon: "🧠", title: "AI Training Simulator",          tone: "alt",    url: "https://ai-training-sim-paps.firebaseapp.com" },
  data_labeling_lab:  { icon: "🏷️", title: "Data Labeling Lab",               tone: "info",   url: "https://data-labeling-lab-paps.firebaseapp.com" },
  ai_ethics_courtroom:{ icon: "⚖️", title: "AI Ethics Courtroom",            tone: "hero",   url: "https://ai-ethics-courtroom-paps.firebaseapp.com" },
};

export default function ExternalActivityBlock({ block }) {
  const defaults = ACTIVITY_DEFAULTS[block.type] || {};
  const icon = block.icon || defaults.icon || "🔗";
  const title = block.title || defaults.title || "External Activity";
  const url = block.url || defaults.url;
  const tone = defaults.tone || "neutral";

  return (
    <div className="card eab-block">
      <div className="eab-head">
        <div className={`eab-icon eab-tone-${tone}`} aria-hidden>{icon}</div>
        <div className="eab-title-wrap">
          <div className="eab-title">{title}</div>
        </div>
      </div>

      {block.instructions && (
        <p className="eab-instructions">{block.instructions}</p>
      )}

      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary eab-go">
          Open Activity →
        </a>
      )}
    </div>
  );
}
