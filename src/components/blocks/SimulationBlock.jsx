// src/components/blocks/SimulationBlock.jsx
// Interactive simulation embed (e.g., PhET) with optional observation prompt.

import { useState, useCallback, useEffect, useRef } from "react";
import useAutoSave from "../../hooks/useAutoSave.jsx";
import { renderMarkdown } from "../../lib/utils";
import "./SimulationBlock.css";

export default function SimulationBlock({ block, studentData = {}, onAnswer }) {
  const data = (studentData && studentData[block.id]) || {};
  const [observation, setObservation] = useState(data.observation || "");
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = studentData?.[block.id];
    if (!saved) {
      if (hydrated.current && (!studentData || Object.keys(studentData).length === 0)) {
        setObservation("");
        hydrated.current = false;
      }
      return;
    }
    if (hydrated.current) return;
    hydrated.current = true;
    if (saved.observation !== undefined) setObservation(saved.observation);
  }, [studentData, block.id]);

  const performSave = useCallback(() => {
    if (!observation.trim()) return;
    // Auto-save must NOT include writtenScore — that would overwrite a submitted score of 1
    // when a student returns and continues typing. Only handleSubmit sets the score.
    onAnswer(block.id, { observation, savedAt: new Date().toISOString() });
  }, [block.id, observation, onAnswer]);

  const { markDirty, saveNow, lastSaved } = useAutoSave(performSave);
  const [submitted, setSubmitted] = useState(!!data.submitted);

  const handleSubmit = () => {
    if (!observation.trim()) return;
    onAnswer(block.id, { observation, submitted: true, writtenScore: 1, savedAt: new Date().toISOString() });
    setSubmitted(true);
  };

  return (
    <div className="simulation-block">
      <div className="sim-header">
        <span className="sim-icon">{block.icon || "🧪"}</span>
        <span className="sim-title" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.title || "Interactive Simulation") }} />
      </div>

      {block.url ? (
        <div className="sim-iframe-wrap">
          <iframe
            className="sim-iframe"
            src={block.url}
            title={block.title || "Simulation"}
            style={{ height: block.height || 500 }}
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      ) : (
        <div className="sim-empty">No simulation URL configured</div>
      )}

      {block.observationPrompt && (
        <div className="sim-observation">
          <label className="sim-obs-label" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.observationPrompt) }} />
          <textarea
            className="sa-input"
            rows={3}
            value={observation}
            onChange={(e) => { setObservation(e.target.value); markDirty(); }}
            onBlur={saveNow}
            placeholder="Write your observations here..."
          />
          <div className="sim-actions">
            <button
              className={`sim-submit ${submitted ? "is-submitted" : ""}`}
              onClick={handleSubmit}
              disabled={!observation.trim()}
            >
              {submitted ? "Submitted" : "Submit Response"}
            </button>
            {lastSaved && (
              <span className="sim-saved">
                Saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
