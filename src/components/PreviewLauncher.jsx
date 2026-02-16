// src/components/PreviewLauncher.jsx
// A button (with optional expanded panel) that lets teachers enter preview mode.
// Can be used in the LessonEditor toolbar or as a standalone floating button.

import { useState } from "react";
import { usePreview } from "../contexts/PreviewContext";

/**
 * Compact mode: just a button (for use in toolbars)
 * Expanded mode: shows scenario options before entering preview
 * sourceLocation: { courseId, lessonId } — where to return when exiting
 */
export default function PreviewLauncher({ compact = false, sourceLocation = null }) {
  const { enterPreview, scenarios, isPreview } = usePreview();
  const [expanded, setExpanded] = useState(false);

  if (isPreview) return null; // Don't show launcher while already previewing

  if (compact) {
    return (
      <button
        className="preview-launch-btn compact"
        onClick={() => enterPreview("new", sourceLocation)}
        title="Preview as Student"
      >
        👁 Preview
      </button>
    );
  }

  return (
    <div className="preview-launcher">
      <button
        className="preview-launch-btn"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="preview-launch-icon">👁</span>
        <span>Preview as Student</span>
      </button>

      {expanded && (
        <div className="preview-launch-panel">
          <div className="preview-launch-title">Choose a student scenario:</div>
          {Object.entries(scenarios).map(([key, cfg]) => (
            <button
              key={key}
              className="preview-launch-option"
              onClick={() => {
                enterPreview(key, sourceLocation);
                setExpanded(false);
              }}
            >
              <span className="preview-launch-opt-icon">{cfg.icon}</span>
              <div>
                <div className="preview-launch-opt-label">{cfg.label}</div>
                <div className="preview-launch-opt-desc">{cfg.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
