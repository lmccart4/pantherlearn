// src/components/blocks/SimulationBlock.jsx
// Interactive simulation embed (e.g., PhET) with optional observation prompt.

import { useState, useCallback } from "react";
import useAutoSave from "../../hooks/useAutoSave.jsx";

export default function SimulationBlock({ block, studentData = {}, onAnswer }) {
  const data = (studentData && studentData[block.id]) || {};
  const [observation, setObservation] = useState(data.observation || "");

  const performSave = useCallback(() => {
    if (!observation.trim()) return;
    onAnswer(block.id, { observation, savedAt: new Date().toISOString() });
  }, [block.id, observation, onAnswer]);

  const { markDirty, saveNow, lastSaved } = useAutoSave(performSave);

  return (
    <div className="simulation-block">
      <div className="sim-header">
        <span className="sim-icon">{block.icon || "🧪"}</span>
        <span className="sim-title">{block.title || "Interactive Simulation"}</span>
      </div>

      {block.url ? (
        <div className="sim-iframe-wrap">
          <iframe
            src={block.url}
            title={block.title || "Simulation"}
            style={{ width: "100%", height: block.height || 500, border: "none", borderRadius: 10 }}
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text3)", background: "var(--surface2)", borderRadius: 10 }}>
          No simulation URL configured
        </div>
      )}

      {block.observationPrompt && (
        <div className="sim-observation">
          <label className="sim-obs-label">{block.observationPrompt}</label>
          <textarea
            className="sa-input"
            rows={3}
            value={observation}
            onChange={(e) => { setObservation(e.target.value); markDirty(); }}
            onBlur={saveNow}
            placeholder="Write your observations here..."
          />
          {lastSaved && (
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              Saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
