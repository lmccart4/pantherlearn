// src/components/chatbot-workshop/SystemPromptEditor.jsx
// Phase 4 editor: Students write system prompts and adjust temperature for their LLM-powered bot.

import { useState, useEffect } from "react";

const PROMPT_STARTERS = [
  {
    label: "Friendly Tutor",
    icon: "📚",
    prompt:
      "You are a friendly and encouraging tutor. Help students understand concepts by asking guiding questions rather than giving answers directly. Celebrate their progress and gently correct mistakes.",
  },
  {
    label: "Quiz Master",
    icon: "🧠",
    prompt:
      "You are a quiz master. Ask the user multiple-choice questions one at a time. After they answer, tell them if they're correct and explain why. Keep score and encourage them to keep going.",
  },
  {
    label: "Character Bot",
    icon: "🎭",
    prompt:
      "You are a historical figure. Stay in character at all times and answer questions about your life, discoveries, and the time period you lived in. Never break character.",
  },
  {
    label: "Story Guide",
    icon: "📖",
    prompt:
      "You are a choose-your-own-adventure narrator. Present the user with vivid scenes and give them 2-3 choices at each step. Continue the story based on their decisions. Make it exciting!",
  },
];

const MAX_PROMPT_LENGTH = 2000;

export default function SystemPromptEditor({ config, onSave }) {
  const [systemPrompt, setSystemPrompt] = useState(config?.systemPrompt || "");
  const [temperature, setTemperature] = useState(config?.temperature ?? 0.7);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (config) {
      setSystemPrompt(config.systemPrompt || "");
      setTemperature(config.temperature ?? 0.7);
    }
  }, [config]);

  function markChanged() {
    setHasChanges(true);
  }

  function handleSave() {
    onSave({ systemPrompt, temperature });
    setHasChanges(false);
  }

  function handlePromptChange(e) {
    const value = e.target.value;
    if (value.length <= MAX_PROMPT_LENGTH) {
      setSystemPrompt(value);
      markChanged();
    }
  }

  function handleTempChange(e) {
    setTemperature(parseFloat(e.target.value));
    markChanged();
  }

  function applyStarter(prompt) {
    if (systemPrompt.trim() !== "") return; // only fill when empty
    setSystemPrompt(prompt);
    markChanged();
  }

  const promptLength = systemPrompt.length;
  const isReady = systemPrompt.trim().length > 0;

  return (
    <div className="sp-editor">
      <style>{`
        .sp-editor { max-width: 700px; }

        .sp-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .sp-title { font-size: 18px; font-weight: 700; color: var(--text); }
        .sp-subtitle { font-size: 13px; color: var(--text3); margin-top: 2px; }

        .sp-help {
          background: var(--surface);
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 12px; padding: 16px 20px;
          margin-bottom: 20px; font-size: 13px; color: var(--text3); line-height: 1.6;
        }
        .sp-help strong { color: var(--green, #34d399); }

        .sp-stats {
          display: flex; gap: 16px; margin-bottom: 20px;
        }
        .sp-stat {
          background: var(--surface); border-radius: 10px; padding: 12px 16px;
          flex: 1; text-align: center;
          border: 1px solid var(--border, rgba(255,255,255,0.08));
        }
        .sp-stat-value { font-size: 24px; font-weight: 800; color: var(--green, #34d399); }
        .sp-stat-label { font-size: 11px; color: var(--text3); margin-top: 2px; }

        .sp-section-label {
          font-size: 12px; font-weight: 700; color: var(--text3);
          text-transform: uppercase; letter-spacing: 0.08em;
          margin: 24px 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.06));
        }

        .sp-field { margin-bottom: 16px; }
        .sp-field-label {
          font-size: 11px; font-weight: 600; color: var(--text3);
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .sp-textarea {
          width: 100%; background: var(--bg);
          border: 1px solid var(--border, rgba(255,255,255,0.1));
          border-radius: 8px; padding: 12px 14px;
          font-size: 14px; color: var(--text);
          font-family: var(--font-body, inherit);
          resize: vertical; min-height: 160px;
          line-height: 1.6;
          transition: border-color 0.15s;
        }
        .sp-textarea:focus { outline: none; border-color: var(--green, #34d399); }
        .sp-textarea::placeholder { color: var(--text3); opacity: 0.6; }
        .sp-char-count {
          text-align: right; font-size: 11px; color: var(--text3); margin-top: 4px;
        }
        .sp-char-count.near-limit { color: var(--amber); }
        .sp-char-count.at-limit { color: var(--red, #ef4444); }

        /* Prompt starters */
        .sp-starters {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;
        }
        .sp-starter {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 20px;
          background: var(--surface);
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          color: var(--text2); font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.15s;
        }
        .sp-starter:hover {
          border-color: var(--green, #34d399); color: var(--green, #34d399);
        }
        .sp-starter.disabled {
          opacity: 0.3; cursor: default;
        }
        .sp-starter.disabled:hover {
          border-color: var(--border, rgba(255,255,255,0.08)); color: var(--text2);
        }

        /* Temperature slider */
        .sp-slider-container {
          background: var(--surface);
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 12px; padding: 16px 20px;
        }
        .sp-slider-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .sp-slider-value {
          font-size: 20px; font-weight: 800; color: var(--green, #34d399);
          font-family: var(--font-display, inherit);
        }
        .sp-slider-track {
          width: 100%;
          -webkit-appearance: none; appearance: none;
          height: 6px; border-radius: 3px;
          background: linear-gradient(to right, #3b82f6, var(--green, #34d399), #f59e0b);
          outline: none; cursor: pointer;
        }
        .sp-slider-track::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: white; border: 2px solid var(--green, #34d399);
          cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .sp-slider-track::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: white; border: 2px solid var(--green, #34d399);
          cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .sp-slider-labels {
          display: flex; justify-content: space-between;
          font-size: 11px; color: var(--text3); margin-top: 8px; font-weight: 600;
        }
        .sp-slider-hint {
          font-size: 12px; color: var(--text3); margin-top: 10px; line-height: 1.5;
        }

        .sp-btn {
          padding: 8px 16px; border-radius: 8px; border: none;
          font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .sp-btn-primary { background: var(--green, #34d399); color: #000; }
        .sp-btn-primary:hover { opacity: 0.85; }
        .sp-btn-primary:disabled { opacity: 0.4; cursor: default; }
      `}</style>

      <div className="sp-header">
        <div>
          <div className="sp-title">✨ System Prompt Editor</div>
          <div className="sp-subtitle">Define your bot's AI personality and behavior</div>
        </div>
        <button className="sp-btn sp-btn-primary" onClick={handleSave} disabled={!hasChanges}>
          {hasChanges ? "💾 Save Changes" : "✓ Saved"}
        </button>
      </div>

      <div className="sp-help">
        <strong>What is a system prompt?</strong> It's a set of instructions that tells the AI how to behave.
        Think of it as your bot's personality, knowledge, and rules — all in one place.
        The user never sees this prompt, but it shapes every response the AI gives.
      </div>

      {/* Stats */}
      <div className="sp-stats">
        <div className="sp-stat">
          <div className="sp-stat-value">{promptLength}</div>
          <div className="sp-stat-label">Characters</div>
        </div>
        <div className="sp-stat">
          <div className="sp-stat-value">{temperature.toFixed(1)}</div>
          <div className="sp-stat-label">Temperature</div>
        </div>
        <div className="sp-stat">
          <div className="sp-stat-value">{isReady ? "✓" : "—"}</div>
          <div className="sp-stat-label">{isReady ? "Ready" : "Needs Prompt"}</div>
        </div>
      </div>

      {/* Prompt starters */}
      <div className="sp-section-label">Quick Start Templates</div>
      <div className="sp-starters">
        {PROMPT_STARTERS.map((starter) => (
          <button
            key={starter.label}
            className={`sp-starter ${systemPrompt.trim() !== "" ? "disabled" : ""}`}
            onClick={() => applyStarter(starter.prompt)}
            title={systemPrompt.trim() !== "" ? "Clear the prompt first to use a template" : starter.prompt}
          >
            <span>{starter.icon}</span>
            <span>{starter.label}</span>
          </button>
        ))}
      </div>

      {/* System prompt textarea */}
      <div className="sp-section-label">System Prompt</div>
      <div className="sp-field">
        <textarea
          className="sp-textarea"
          value={systemPrompt}
          onChange={handlePromptChange}
          placeholder="You are a helpful chatbot that..."
          rows={8}
        />
        <div
          className={`sp-char-count ${
            promptLength > 1800 ? "at-limit" : promptLength > 1500 ? "near-limit" : ""
          }`}
        >
          {promptLength} / {MAX_PROMPT_LENGTH}
        </div>
      </div>

      {/* Temperature slider */}
      <div className="sp-section-label">Temperature</div>
      <div className="sp-slider-container">
        <div className="sp-slider-header">
          <div className="sp-field-label" style={{ margin: 0 }}>Creativity Level</div>
          <div className="sp-slider-value">{temperature.toFixed(1)}</div>
        </div>
        <input
          type="range"
          className="sp-slider-track"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={handleTempChange}
        />
        <div className="sp-slider-labels">
          <span>🎯 Precise</span>
          <span>⚖️ Balanced</span>
          <span>🎨 Creative</span>
        </div>
        <div className="sp-slider-hint">
          Lower temperatures give more consistent, predictable responses.
          Higher temperatures make the bot more creative and varied — but sometimes less accurate.
        </div>
      </div>
    </div>
  );
}
