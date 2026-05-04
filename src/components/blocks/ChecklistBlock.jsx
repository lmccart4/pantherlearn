// src/components/blocks/ChecklistBlock.jsx
// Migrated to Savanna primitives — uses Card + ProgressBar and savanna tokens
// instead of inline-styled hardcoded colors.
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslatedText, useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
import { Card, ProgressBar } from "../savanna/index.jsx";
import "./ChecklistBlock.css";

export default function ChecklistBlock({ block, studentData = {}, onAnswer }) {
  const translatedTitle = useTranslatedText(block.title);
  const translatedItems = useTranslatedTexts(block.items || []);
  const saved = (studentData && studentData[block.id]) || {};
  const [checked, setChecked] = useState(saved.checked || {});
  const hydrated = useRef(false);

  useEffect(() => {
    const s = studentData?.[block.id];
    if (!s) {
      if (hydrated.current && (!studentData || Object.keys(studentData).length === 0)) {
        setChecked({});
        hydrated.current = false;
      }
      return;
    }
    if (hydrated.current) return;
    hydrated.current = true;
    if (s.checked) setChecked(s.checked);
  }, [studentData, block.id]);

  const toggle = useCallback((i) => {
    setChecked((prev) => {
      const updated = { ...prev, [i]: !prev[i] };
      if (onAnswer) {
        const totalItems = block.items ? block.items.length : 0;
        const doneItems = Object.values(updated).filter(Boolean).length;
        const writtenScore = totalItems > 0 ? doneItems / totalItems : 0;
        onAnswer(block.id, { checked: updated, writtenScore, savedAt: new Date().toISOString() });
      }
      return updated;
    });
  }, [block.id, block.items, onAnswer]);

  const items = block.items || [];
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <Card className="checklist-block">
      {translatedTitle && (
        <h3 className="checklist-title">
          <span aria-hidden>📋</span>
          <span>{translatedTitle}</span>
        </h3>
      )}

      {items.length > 0 && (
        <div className="checklist-progress">
          <ProgressBar
            value={doneCount}
            max={items.length}
            size="sm"
            label={`${doneCount} of ${items.length} completed`}
          />
          <p className="checklist-progress-text">
            {doneCount}/{items.length} completed
          </p>
        </div>
      )}

      <div className="checklist-items">
        {items.map((item, i) => (
          <label
            key={i}
            className={`checklist-item ${checked[i] ? "is-done" : ""}`}
          >
            <input
              type="checkbox"
              checked={!!checked[i]}
              onChange={() => toggle(i)}
              className="checklist-input"
            />
            <span className="checklist-box" aria-hidden>
              {checked[i] ? "✓" : ""}
            </span>
            <span
              className="checklist-text"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedItems[i] ?? item) }}
            />
          </label>
        ))}
      </div>
    </Card>
  );
}
