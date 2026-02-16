// src/components/PreviewBanner.jsx
// Sticky banner shown at the top of the page when a teacher is previewing as a student.
// Shows the current scenario, lets the teacher switch scenarios, and exit preview.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePreview } from "../contexts/PreviewContext";

export default function PreviewBanner() {
  const { isPreview, scenario, scenarios, switchScenario, exitPreview, sourceLocation } = usePreview();
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const navigate = useNavigate();

  if (!isPreview) return null;

  const current = scenarios[scenario];

  const handleBackToEditor = () => {
    exitPreview();
    const params = new URLSearchParams();
    if (sourceLocation?.courseId) params.set("course", sourceLocation.courseId);
    if (sourceLocation?.lessonId) params.set("lesson", sourceLocation.lessonId);
    const qs = params.toString();
    navigate(qs ? `/editor?${qs}` : "/editor");
  };

  return (
    <>
      <div className="preview-banner">
        <div className="preview-banner-inner">
          {/* Left: label */}
          <div className="preview-banner-left">
            <span className="preview-banner-eye">👁</span>
            <span className="preview-banner-label">Previewing as Student</span>
          </div>

          {/* Center: scenario picker */}
          <div className="preview-scenario-picker">
            <button
              className="preview-scenario-btn"
              onClick={() => setScenarioOpen(!scenarioOpen)}
            >
              <span>{current.icon}</span>
              <span>{current.label}</span>
              <span className="preview-chevron">{scenarioOpen ? "▲" : "▼"}</span>
            </button>

            {scenarioOpen && (
              <div className="preview-scenario-dropdown">
                {Object.entries(scenarios).map(([key, cfg]) => (
                  <button
                    key={key}
                    className={`preview-scenario-option ${key === scenario ? "active" : ""}`}
                    onClick={() => {
                      switchScenario(key);
                      setScenarioOpen(false);
                    }}
                  >
                    <span className="scenario-opt-icon">{cfg.icon}</span>
                    <div>
                      <div className="scenario-opt-label">{cfg.label}</div>
                      <div className="scenario-opt-desc">{cfg.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: back to editor + exit */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="preview-exit-btn" onClick={handleBackToEditor}>
              ← Back to Editor
            </button>
            <button className="preview-exit-btn" onClick={exitPreview}>
              ✕ Exit Preview
            </button>
          </div>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind the fixed banner */}
      <div style={{ height: 52 }} />
    </>
  );
}
