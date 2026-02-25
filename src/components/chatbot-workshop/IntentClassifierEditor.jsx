// src/components/chatbot-workshop/IntentClassifierEditor.jsx
// Phase 3 editor: define intents, add training examples, train with embeddings,
// and visualize classification accuracy.

import { useState, useEffect, useMemo } from "react";

const BOT_EMBED_URL = import.meta.env.VITE_BOT_EMBED_URL
  || "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/botEmbed";

const MAX_INTENTS = 10;
const MAX_EXAMPLES = 50;

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default function IntentClassifierEditor({ config, onSave, getToken }) {
  const [intents, setIntents] = useState(config?.intents || []);
  const [trainingData, setTrainingData] = useState(config?.trainingData || []);
  const [fallbackResponse, setFallbackResponse] = useState(config?.fallbackResponse || "I'm not sure what you mean. Can you try rephrasing?");
  const [confidenceThreshold, setConfidenceThreshold] = useState(config?.confidenceThreshold ?? 0.65);
  const [trainedAt, setTrainedAt] = useState(config?.trainedAt || null);
  const [hasChanges, setHasChanges] = useState(false);
  const [training, setTraining] = useState(false);
  const [trainError, setTrainError] = useState(null);

  // New example form state
  const [newPhrase, setNewPhrase] = useState("");
  const [newIntentId, setNewIntentId] = useState("");

  // Sync with incoming config
  useEffect(() => {
    setIntents(config?.intents || []);
    setTrainingData(config?.trainingData || []);
    setFallbackResponse(config?.fallbackResponse || "I'm not sure what you mean. Can you try rephrasing?");
    setConfidenceThreshold(config?.confidenceThreshold ?? 0.65);
    setTrainedAt(config?.trainedAt || null);
    setHasChanges(false);
  }, [config]);

  function markChanged() { setHasChanges(true); setTrainedAt(null); }

  function handleSave() {
    // Filter out orphaned training data
    const validIntentIds = new Set(intents.map(i => i.id));
    const cleanedData = trainingData.filter(td => validIntentIds.has(td.intentId));
    const payload = { intents, trainingData: cleanedData, fallbackResponse, confidenceThreshold, trainedAt };
    onSave(payload);
    setTrainingData(cleanedData);
    setHasChanges(false);
  }

  // ─── Intent CRUD ──────────────────────────────────────────────────────────
  function addIntent() {
    if (intents.length >= MAX_INTENTS) return;
    const id = "intent-" + Math.random().toString(36).slice(2, 8);
    setIntents(prev => [...prev, { id, name: "", response: "" }]);
    markChanged();
  }

  function updateIntent(id, updates) {
    setIntents(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    markChanged();
  }

  function deleteIntent(id) {
    setIntents(prev => prev.filter(i => i.id !== id));
    setTrainingData(prev => prev.filter(td => td.intentId !== id));
    markChanged();
  }

  // ─── Training Data CRUD ────────────────────────────────────────────────────
  function addExample() {
    if (!newPhrase.trim() || !newIntentId) return;
    if (trainingData.length >= MAX_EXAMPLES) return;
    const id = "td-" + Math.random().toString(36).slice(2, 8);
    setTrainingData(prev => [...prev, { id, phrase: newPhrase.trim(), intentId: newIntentId }]);
    setNewPhrase("");
    markChanged();
  }

  function deleteExample(id) {
    setTrainingData(prev => prev.filter(td => td.id !== id));
    markChanged();
  }

  // ─── Train ─────────────────────────────────────────────────────────────────
  async function handleTrain() {
    const phrases = trainingData.map(td => td.phrase);
    if (phrases.length < 2) {
      setTrainError("Add at least 2 training examples to train.");
      return;
    }
    if (intents.filter(i => i.name.trim()).length < 2) {
      setTrainError("Define at least 2 intents with names.");
      return;
    }

    setTraining(true);
    setTrainError(null);

    try {
      const token = await getToken();
      const res = await fetch(BOT_EMBED_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ mode: "batch", phrases }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Training failed (${res.status})`);
      }

      const { embeddings } = await res.json();

      // Merge embeddings into training data
      const updatedData = trainingData.map((td, i) => ({
        ...td,
        embedding: embeddings[i],
      }));

      const now = new Date().toISOString();
      setTrainingData(updatedData);
      setTrainedAt(now);

      // Auto-save after training
      const validIntentIds = new Set(intents.map(i => i.id));
      const cleanedData = updatedData.filter(td => validIntentIds.has(td.intentId));
      onSave({ intents, trainingData: cleanedData, fallbackResponse, confidenceThreshold, trainedAt: now });
      setHasChanges(false);
    } catch (err) {
      setTrainError(err.message);
    }

    setTraining(false);
  }

  // ─── Accuracy Visualization ────────────────────────────────────────────────
  const visualization = useMemo(() => {
    if (!trainedAt) return null;
    const trained = trainingData.filter(td => td.embedding);
    if (trained.length < 2) return null;

    // Group by intent
    const grouped = {};
    for (const td of trained) {
      if (!grouped[td.intentId]) grouped[td.intentId] = [];
      grouped[td.intentId].push(td);
    }

    const intentIds = intents.filter(i => grouped[i.id]?.length > 0).map(i => i.id);
    if (intentIds.length < 2) return null;

    // Compute similarity matrix
    const matrix = intentIds.map(a =>
      intentIds.map(b => {
        const exA = grouped[a] || [];
        const exB = grouped[b] || [];
        let total = 0, count = 0;
        for (const ea of exA) {
          for (const eb of exB) {
            if (ea.id === eb.id) continue;
            if (!ea.embedding || !eb.embedding) continue;
            total += cosineSimilarity(ea.embedding, eb.embedding);
            count++;
          }
        }
        return count > 0 ? total / count : 0;
      })
    );

    return { intentIds, matrix };
  }, [trainedAt, trainingData, intents]);

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const exampleCounts = {};
  for (const td of trainingData) {
    exampleCounts[td.intentId] = (exampleCounts[td.intentId] || 0) + 1;
  }

  return (
    <div className="ic-editor">
      <style>{`
        .ic-editor { max-width: 800px; }
        .ic-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; flex-wrap: wrap; }
        .ic-title { font-size: 20px; font-weight: 800; color: var(--text); flex: 1; }
        .ic-subtitle { font-size: 13px; color: var(--text3); margin-top: 2px; }
        .ic-btn-save {
          padding: 8px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
          border: none; cursor: pointer; transition: all 0.15s;
          background: var(--purple); color: white;
        }
        .ic-btn-save:disabled { opacity: 0.35; cursor: default; }
        .ic-btn-save.saved { background: var(--surface2, rgba(255,255,255,0.05)); color: var(--text3); }

        .ic-help {
          background: var(--purple)10; border: 1px solid var(--purple)30;
          border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;
          font-size: 13px; color: var(--text3); line-height: 1.6;
        }

        .ic-stats { display: flex; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
        .ic-stat {
          background: var(--surface); border-radius: 10px; padding: 12px 16px;
          text-align: center; min-width: 80px;
          border: 1px solid var(--border, rgba(255,255,255,0.08));
        }
        .ic-stat-val { font-size: 20px; font-weight: 800; color: var(--text); }
        .ic-stat-label { font-size: 11px; color: var(--text3); margin-top: 2px; }

        .ic-section-label {
          font-size: 13px; font-weight: 700; color: var(--text3); text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 12px; margin-top: 28px;
          padding-bottom: 8px; border-bottom: 1px solid var(--border, rgba(255,255,255,0.06));
        }

        .ic-intent-card {
          background: var(--surface); border-radius: 12px; padding: 16px;
          margin-bottom: 10px; border: 1px solid var(--border, rgba(255,255,255,0.08));
        }
        .ic-intent-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .ic-input {
          flex: 1; background: var(--bg); border: 1px solid var(--border, rgba(255,255,255,0.1));
          border-radius: 8px; padding: 8px 12px; font-size: 13px; color: var(--text);
          font-family: var(--font-body, inherit);
        }
        .ic-input:focus { outline: none; border-color: var(--purple); }
        .ic-input::placeholder { color: var(--text3); }
        .ic-textarea {
          width: 100%; background: var(--bg); border: 1px solid var(--border, rgba(255,255,255,0.1));
          border-radius: 8px; padding: 8px 12px; font-size: 13px; color: var(--text);
          font-family: var(--font-body, inherit); resize: vertical; min-height: 48px;
          box-sizing: border-box;
        }
        .ic-textarea:focus { outline: none; border-color: var(--purple); }
        .ic-textarea::placeholder { color: var(--text3); }
        .ic-badge {
          font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px;
          background: var(--purple)18; color: var(--purple); white-space: nowrap;
        }
        .ic-btn-delete {
          background: none; border: none; color: var(--text3); cursor: pointer;
          font-size: 16px; padding: 4px 8px; border-radius: 6px; transition: all 0.15s;
        }
        .ic-btn-delete:hover { color: var(--red, #ef4444); background: rgba(239,68,68,0.1); }
        .ic-btn-add {
          width: 100%; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600;
          border: 1px dashed var(--border, rgba(255,255,255,0.15));
          background: none; color: var(--text3); cursor: pointer; transition: all 0.15s;
        }
        .ic-btn-add:hover { border-color: var(--purple); color: var(--purple); }
        .ic-btn-add:disabled { opacity: 0.3; cursor: default; }

        .ic-example-row {
          display: flex; align-items: center; gap: 8px; padding: 8px 12px;
          border-radius: 8px; margin-bottom: 4px;
          background: var(--surface2, rgba(255,255,255,0.02));
        }
        .ic-example-phrase { flex: 1; font-size: 13px; color: var(--text); }
        .ic-example-tag {
          font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px;
          white-space: nowrap;
        }

        .ic-add-example-row { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; flex-wrap: wrap; }
        .ic-select {
          background: var(--bg); border: 1px solid var(--border, rgba(255,255,255,0.1));
          border-radius: 8px; padding: 8px 12px; font-size: 13px; color: var(--text);
          font-family: var(--font-body, inherit); min-width: 140px;
        }
        .ic-select:focus { outline: none; border-color: var(--purple); }
        .ic-btn-primary {
          padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
          border: none; cursor: pointer; transition: all 0.15s;
          background: var(--purple); color: white; white-space: nowrap;
        }
        .ic-btn-primary:disabled { opacity: 0.35; cursor: default; }
        .ic-btn-primary:hover:not(:disabled) { opacity: 0.85; }

        .ic-train-section {
          margin-top: 28px; padding: 20px; border-radius: 14px;
          background: var(--surface); border: 1px solid var(--border, rgba(255,255,255,0.08));
          text-align: center;
        }
        .ic-btn-train {
          padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 700;
          border: none; cursor: pointer; transition: all 0.15s;
          background: linear-gradient(135deg, var(--purple), #7c3aed);
          color: white;
        }
        .ic-btn-train:disabled { opacity: 0.4; cursor: default; }
        .ic-btn-train:hover:not(:disabled) { transform: translateY(-2px); opacity: 0.9; }
        .ic-train-error { color: var(--red, #ef4444); font-size: 13px; margin-top: 10px; }
        .ic-train-success { color: var(--green, #34d399); font-size: 13px; margin-top: 10px; font-weight: 600; }

        .ic-threshold-row { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
        .ic-slider {
          flex: 1; height: 6px; -webkit-appearance: none; border-radius: 3px;
          background: linear-gradient(90deg, #ef4444, var(--amber), var(--green, #34d399));
          outline: none;
        }
        .ic-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: white; border: 2px solid var(--purple); cursor: pointer;
        }

        .ic-viz { margin-top: 24px; }
        .ic-viz-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 12px; }
        .ic-matrix { display: inline-grid; gap: 2px; }
        .ic-matrix-cell {
          width: 60px; height: 36px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: white;
        }
        .ic-matrix-label {
          font-size: 11px; color: var(--text3); font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          padding: 4px;
        }
      `}</style>

      {/* Header */}
      <div className="ic-header">
        <div>
          <div className="ic-title">Intent Classification</div>
          <div className="ic-subtitle">Train your bot to understand meaning, not just keywords</div>
        </div>
        <button
          className={`ic-btn-save ${!hasChanges ? "saved" : ""}`}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          {hasChanges ? "Save Changes" : "Saved"}
        </button>
      </div>

      {/* Help */}
      <div className="ic-help">
        <strong>How it works:</strong> Define intents (categories of user messages) and give each one
        example phrases. When you click "Train", the AI learns the <em>meaning</em> of each phrase.
        During testing, your bot matches new messages to the closest intent by meaning — not exact words!
      </div>

      {/* Stats */}
      <div className="ic-stats">
        <div className="ic-stat">
          <div className="ic-stat-val">{intents.length}</div>
          <div className="ic-stat-label">Intents</div>
        </div>
        <div className="ic-stat">
          <div className="ic-stat-val">{trainingData.length}</div>
          <div className="ic-stat-label">Examples</div>
        </div>
        <div className="ic-stat">
          <div className="ic-stat-val">{trainedAt ? "✓" : "—"}</div>
          <div className="ic-stat-label">Trained</div>
        </div>
      </div>

      {/* ─── Intents ──────────────────────────────────────────────────────── */}
      <div className="ic-section-label">Intents ({intents.length}/{MAX_INTENTS})</div>

      {intents.map(intent => (
        <div key={intent.id} className="ic-intent-card">
          <div className="ic-intent-row">
            <input
              className="ic-input"
              value={intent.name}
              onChange={e => updateIntent(intent.id, { name: e.target.value })}
              placeholder="Intent name (e.g., greeting, hours, menu)"
              style={{ maxWidth: 220 }}
            />
            <span className="ic-badge">{exampleCounts[intent.id] || 0} examples</span>
            <button className="ic-btn-delete" onClick={() => deleteIntent(intent.id)} title="Delete intent">×</button>
          </div>
          <textarea
            className="ic-textarea"
            value={intent.response}
            onChange={e => updateIntent(intent.id, { response: e.target.value })}
            placeholder="Bot response when this intent matches..."
            rows={2}
          />
        </div>
      ))}

      <button
        className="ic-btn-add"
        onClick={addIntent}
        disabled={intents.length >= MAX_INTENTS}
      >
        + Add Intent
      </button>

      {/* ─── Training Examples ────────────────────────────────────────────── */}
      <div className="ic-section-label">Training Examples ({trainingData.length}/{MAX_EXAMPLES})</div>

      <div className="ic-add-example-row">
        <input
          className="ic-input"
          value={newPhrase}
          onChange={e => setNewPhrase(e.target.value)}
          placeholder="Type an example phrase..."
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addExample(); } }}
          style={{ flex: 2 }}
        />
        <select
          className="ic-select"
          value={newIntentId}
          onChange={e => setNewIntentId(e.target.value)}
        >
          <option value="">Select intent...</option>
          {intents.filter(i => i.name.trim()).map(i => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
        <button
          className="ic-btn-primary"
          onClick={addExample}
          disabled={!newPhrase.trim() || !newIntentId || trainingData.length >= MAX_EXAMPLES}
        >
          Add
        </button>
      </div>

      {/* Grouped by intent */}
      {intents.filter(i => i.name.trim()).map(intent => {
        const examples = trainingData.filter(td => td.intentId === intent.id);
        if (examples.length === 0) return null;
        return (
          <div key={intent.id} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--purple)", marginBottom: 4 }}>
              {intent.name}
            </div>
            {examples.map(td => (
              <div key={td.id} className="ic-example-row">
                <span className="ic-example-phrase">"{td.phrase}"</span>
                {td.embedding && (
                  <span className="ic-example-tag" style={{ background: "var(--green, #34d399)18", color: "var(--green, #34d399)" }}>
                    embedded
                  </span>
                )}
                {!td.embedding && (
                  <span className="ic-example-tag" style={{ background: "var(--amber)18", color: "var(--amber)" }}>
                    untrained
                  </span>
                )}
                <button className="ic-btn-delete" onClick={() => deleteExample(td.id)} title="Remove example">×</button>
              </div>
            ))}
          </div>
        );
      })}

      {/* Orphaned examples */}
      {trainingData.filter(td => !intents.find(i => i.id === td.intentId)).length > 0 && (
        <div style={{ fontSize: 12, color: "var(--red, #ef4444)", marginBottom: 12 }}>
          Some examples reference deleted intents and will be removed on save.
        </div>
      )}

      {/* ─── Fallback & Threshold ─────────────────────────────────────────── */}
      <div className="ic-section-label">Fallback & Confidence</div>

      <textarea
        className="ic-textarea"
        value={fallbackResponse}
        onChange={e => { setFallbackResponse(e.target.value); markChanged(); }}
        placeholder="Response when no intent matches..."
        rows={2}
        style={{ marginBottom: 12 }}
      />

      <div className="ic-threshold-row">
        <span style={{ fontSize: 12, color: "var(--text3)", whiteSpace: "nowrap" }}>
          Confidence threshold:
        </span>
        <input
          type="range"
          className="ic-slider"
          min={0.3}
          max={0.9}
          step={0.05}
          value={confidenceThreshold}
          onChange={e => { setConfidenceThreshold(parseFloat(e.target.value)); markChanged(); }}
        />
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", minWidth: 40, textAlign: "right" }}>
          {Math.round(confidenceThreshold * 100)}%
        </span>
      </div>
      <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
        Lower = matches more loosely. Higher = requires closer meaning match.
      </div>

      {/* ─── Train Button ─────────────────────────────────────────────────── */}
      <div className="ic-train-section">
        <div style={{ fontSize: 14, color: "var(--text3)", marginBottom: 14 }}>
          {trainedAt
            ? `Last trained: ${new Date(trainedAt).toLocaleString()}`
            : "Train your bot to compute meaning vectors for all examples"}
        </div>
        <button
          className="ic-btn-train"
          onClick={handleTrain}
          disabled={training || trainingData.length < 2}
        >
          {training ? "Training..." : "🧠 Train Bot"}
        </button>
        {trainError && <div className="ic-train-error">{trainError}</div>}
        {trainedAt && !trainError && !training && (
          <div className="ic-train-success">Training complete! Test your bot in the chat preview.</div>
        )}
      </div>

      {/* ─── Accuracy Visualization ───────────────────────────────────────── */}
      {visualization && (
        <div className="ic-viz">
          <div className="ic-viz-title">Intent Similarity Matrix</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>
            Green diagonal = examples within same intent are similar (good!).
            Red off-diagonal = different intents are too similar (overlap — add more distinct examples).
          </div>
          <div style={{ overflowX: "auto" }}>
            <div
              className="ic-matrix"
              style={{ gridTemplateColumns: `80px repeat(${visualization.intentIds.length}, 60px)` }}
            >
              {/* Header row */}
              <div className="ic-matrix-label" />
              {visualization.intentIds.map(id => {
                const intent = intents.find(i => i.id === id);
                return (
                  <div key={id} className="ic-matrix-label" style={{ fontSize: 10 }}>
                    {(intent?.name || "?").slice(0, 8)}
                  </div>
                );
              })}
              {/* Data rows */}
              {visualization.intentIds.map((rowId, ri) => {
                const rowIntent = intents.find(i => i.id === rowId);
                return [
                  <div key={`label-${rowId}`} className="ic-matrix-label" style={{ justifyContent: "flex-end", paddingRight: 8, fontSize: 10 }}>
                    {(rowIntent?.name || "?").slice(0, 8)}
                  </div>,
                  ...visualization.intentIds.map((colId, ci) => {
                    const sim = visualization.matrix[ri][ci];
                    const isDiagonal = ri === ci;
                    const hue = isDiagonal
                      ? Math.max(0, Math.min(120, sim * 150))  // green for high diagonal
                      : Math.max(0, Math.min(120, (1 - sim) * 150)); // green for LOW off-diagonal
                    return (
                      <div
                        key={`${rowId}-${colId}`}
                        className="ic-matrix-cell"
                        style={{ background: `hsl(${hue}, 65%, 42%)` }}
                        title={`${rowIntent?.name} vs ${intents.find(i => i.id === colId)?.name}: ${(sim * 100).toFixed(1)}%`}
                      >
                        {(sim * 100).toFixed(0)}%
                      </div>
                    );
                  }),
                ];
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
