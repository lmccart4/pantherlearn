// src/components/chatbot-workshop/KeywordMatchEditor.jsx
// Phase 2 editor: Students define keyword → response rules with match modes.

import { useState, useEffect } from "react";

function generateId() {
  return "rule-" + Math.random().toString(36).substr(2, 8);
}

export default function KeywordMatchEditor({ config, onSave }) {
  const [rules, setRules] = useState(config?.rules || []);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (config?.rules) setRules(config.rules);
  }, [config]);

  function markChanged() { setHasChanges(true); }

  function handleSave() {
    onSave({ rules });
    setHasChanges(false);
  }

  function addRule() {
    const newRule = {
      id: generateId(),
      keywords: [],
      response: "",
      matchMode: "any",
      priority: 1,
      isFallback: false,
    };
    setRules(prev => [...prev, newRule]);
    markChanged();
  }

  function updateRule(ruleId, updates) {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
    markChanged();
  }

  function deleteRule(ruleId) {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    markChanged();
  }

  function moveRule(ruleId, direction) {
    const idx = rules.findIndex(r => r.id === ruleId);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= rules.length) return;
    const newRules = [...rules];
    [newRules[idx], newRules[newIdx]] = [newRules[newIdx], newRules[idx]];
    setRules(newRules);
    markChanged();
  }

  const regularRules = rules.filter(r => !r.isFallback);
  const fallbackRule = rules.find(r => r.isFallback);

  return (
    <div className="km-editor">
      <style>{`
        .km-editor { max-width: 700px; }

        .km-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .km-title { font-size: 18px; font-weight: 700; color: var(--text); }
        .km-subtitle { font-size: 13px; color: var(--text3); margin-top: 2px; }

        .km-help {
          background: var(--surface);
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 12px; padding: 16px 20px;
          margin-bottom: 20px; font-size: 13px; color: var(--text3); line-height: 1.6;
        }
        .km-help strong { color: var(--amber); }

        .km-stats {
          display: flex; gap: 16px; margin-bottom: 20px;
        }
        .km-stat {
          background: var(--surface); border-radius: 10px; padding: 12px 16px;
          flex: 1; text-align: center;
          border: 1px solid var(--border, rgba(255,255,255,0.08));
        }
        .km-stat-value { font-size: 24px; font-weight: 800; color: var(--amber); }
        .km-stat-label { font-size: 11px; color: var(--text3); margin-top: 2px; }

        /* Rule card */
        .km-rule-card {
          background: var(--surface);
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 12px; padding: 16px;
          margin-bottom: 12px;
          transition: border-color 0.15s;
        }
        .km-rule-card:hover { border-color: rgba(255,255,255,0.15); }
        .km-rule-card.fallback { border-left: 3px solid var(--text3); opacity: 0.7; }

        .km-rule-top {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 12px;
        }
        .km-rule-num {
          width: 28px; height: 28px; border-radius: 8px;
          background: var(--amber)18; color: var(--amber);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; flex-shrink: 0;
        }
        .km-rule-title { flex: 1; font-weight: 600; font-size: 14px; color: var(--text); }
        .km-rule-actions { display: flex; gap: 4px; }
        .km-rule-action {
          background: none; border: none; color: var(--text3);
          cursor: pointer; font-size: 14px; padding: 4px;
          transition: color 0.15s;
        }
        .km-rule-action:hover { color: var(--text); }
        .km-rule-action.delete:hover { color: #ef4444; }

        .km-field { margin-bottom: 12px; }
        .km-field-label {
          font-size: 11px; font-weight: 600; color: var(--text3);
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .km-input, .km-textarea {
          width: 100%; background: var(--bg);
          border: 1px solid var(--border, rgba(255,255,255,0.1));
          border-radius: 8px; padding: 10px 12px;
          font-size: 14px; color: var(--text);
          font-family: var(--font-body, inherit);
          transition: border-color 0.15s;
        }
        .km-input:focus, .km-textarea:focus { outline: none; border-color: var(--amber); }
        .km-textarea { resize: vertical; min-height: 50px; }
        .km-input-hint { font-size: 11px; color: var(--text3); margin-top: 4px; }

        .km-match-mode {
          display: flex; gap: 6px; margin-top: 8px;
        }
        .km-mode-btn {
          padding: 5px 12px; border-radius: 6px; border: none;
          font-size: 12px; font-weight: 600; cursor: pointer;
          background: var(--bg); color: var(--text3);
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          transition: all 0.15s;
        }
        .km-mode-btn.active {
          background: var(--amber)18; color: var(--amber);
          border-color: var(--amber)40;
        }

        .km-add-rule {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px;
          background: none; border: 2px dashed var(--border, rgba(255,255,255,0.1));
          border-radius: 12px; color: var(--text3);
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.15s; margin-bottom: 20px;
        }
        .km-add-rule:hover { border-color: var(--amber); color: var(--amber); }

        .km-btn {
          padding: 8px 16px; border-radius: 8px; border: none;
          font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .km-btn-primary { background: var(--amber); color: #000; }
        .km-btn-primary:hover { opacity: 0.85; }
        .km-btn-primary:disabled { opacity: 0.4; cursor: default; }

        .km-section-label {
          font-size: 12px; font-weight: 700; color: var(--text3);
          text-transform: uppercase; letter-spacing: 0.08em;
          margin: 24px 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.06));
        }
      `}</style>

      <div className="km-header">
        <div>
          <div className="km-title">🔑 Keyword Match Editor</div>
          <div className="km-subtitle">Define keyword → response rules for your bot</div>
        </div>
        <button className="km-btn km-btn-primary" onClick={handleSave} disabled={!hasChanges}>
          {hasChanges ? "💾 Save Changes" : "✓ Saved"}
        </button>
      </div>

      <div className="km-help">
        <strong>How it works:</strong> When a user sends a message, your bot checks each rule from top to bottom.
        If the message contains any of the rule's <strong>keywords</strong>, the bot sends that rule's response.
        If no rule matches, the <strong>fallback</strong> response is used. Rules higher in the list are checked first!
      </div>

      {/* Stats */}
      <div className="km-stats">
        <div className="km-stat">
          <div className="km-stat-value">{regularRules.length}</div>
          <div className="km-stat-label">Rules</div>
        </div>
        <div className="km-stat">
          <div className="km-stat-value">
            {regularRules.reduce((sum, r) => sum + (r.keywords?.length || 0), 0)}
          </div>
          <div className="km-stat-label">Keywords</div>
        </div>
        <div className="km-stat">
          <div className="km-stat-value">{fallbackRule ? "✓" : "✕"}</div>
          <div className="km-stat-label">Fallback</div>
        </div>
      </div>

      {/* Regular rules */}
      <div className="km-section-label">Match Rules (checked in order)</div>
      {regularRules.map((rule, idx) => (
        <div key={rule.id} className="km-rule-card">
          <div className="km-rule-top">
            <div className="km-rule-num">{idx + 1}</div>
            <div className="km-rule-title">Rule {idx + 1}</div>
            <div className="km-rule-actions">
              <button className="km-rule-action" onClick={() => moveRule(rule.id, -1)} title="Move up" disabled={idx === 0}>↑</button>
              <button className="km-rule-action" onClick={() => moveRule(rule.id, 1)} title="Move down" disabled={idx === regularRules.length - 1}>↓</button>
              <button className="km-rule-action delete" onClick={() => deleteRule(rule.id)} title="Delete">✕</button>
            </div>
          </div>

          <div className="km-field">
            <div className="km-field-label">Keywords</div>
            <input
              className="km-input"
              value={(rule.keywords || []).join(", ")}
              onChange={e => updateRule(rule.id, {
                keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean),
              })}
              placeholder='e.g. hello, hi, hey, greetings'
            />
            <div className="km-input-hint">Separate keywords with commas</div>
            <div className="km-match-mode">
              {[
                { value: "any", label: "Match ANY" },
                { value: "all", label: "Match ALL" },
                { value: "exact", label: "Exact Match" },
              ].map(mode => (
                <button
                  key={mode.value}
                  className={`km-mode-btn ${rule.matchMode === mode.value ? "active" : ""}`}
                  onClick={() => updateRule(rule.id, { matchMode: mode.value })}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="km-field">
            <div className="km-field-label">Bot Response</div>
            <textarea
              className="km-textarea"
              value={rule.response || ""}
              onChange={e => updateRule(rule.id, { response: e.target.value })}
              placeholder="What should the bot say when these keywords match?"
              rows={2}
            />
          </div>
        </div>
      ))}

      <button className="km-add-rule" onClick={addRule}>
        + Add Rule
      </button>

      {/* Fallback rule */}
      <div className="km-section-label">Fallback Response (when nothing matches)</div>
      {fallbackRule ? (
        <div className="km-rule-card fallback">
          <div className="km-field">
            <div className="km-field-label">Default Response</div>
            <textarea
              className="km-textarea"
              value={fallbackRule.response || ""}
              onChange={e => updateRule(fallbackRule.id, { response: e.target.value })}
              placeholder="What should the bot say when no keywords match?"
              rows={2}
            />
          </div>
        </div>
      ) : (
        <button
          className="km-add-rule"
          onClick={() => {
            const fb = {
              id: generateId(),
              keywords: [],
              response: "I don't understand that yet. Try asking something else!",
              matchMode: "any",
              priority: 0,
              isFallback: true,
            };
            setRules(prev => [...prev, fb]);
            markChanged();
          }}
        >
          + Add Fallback Response
        </button>
      )}
    </div>
  );
}
