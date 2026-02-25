// src/components/chatbot-workshop/flow-nodes/BotNode.jsx
// Custom React Flow node types for the Decision Tree Builder.
// Each node type has a distinct color, icon, and editable message field.

import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";

// ─── Shared Node Shell ──────────────────────────────────────────────────────

function NodeShell({ id, data, type, icon, color, borderColor, label, children, sourceHandles = true, targetHandles = true }) {
  const [editing, setEditing] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  function handleBlur() {
    setEditing(false);
  }

  return (
    <div className={`bot-flow-node bot-flow-node--${type}`} style={{ "--node-color": color, "--node-border": borderColor }}>
      {/* Target handle (input) */}
      {targetHandles && (
        <Handle
          type="target"
          position={Position.Top}
          className="bot-flow-handle bot-flow-handle--target"
        />
      )}

      {/* Header */}
      <div className="bot-flow-node__header">
        <span className="bot-flow-node__icon">{icon}</span>
        <span className="bot-flow-node__label">{label}</span>
        {data.onDelete && type !== "start" && (
          <button
            className="bot-flow-node__delete"
            onClick={(e) => { e.stopPropagation(); data.onDelete(id); }}
            title="Delete node"
          >
            ✕
          </button>
        )}
      </div>

      {/* Message body */}
      <div className="bot-flow-node__body" onDoubleClick={() => setEditing(true)}>
        {editing ? (
          <textarea
            ref={textareaRef}
            className="bot-flow-node__textarea"
            value={data.message || ""}
            onChange={(e) => data.onChange?.(id, { message: e.target.value })}
            onBlur={handleBlur}
            onKeyDown={(e) => { if (e.key === "Escape") handleBlur(); }}
            rows={3}
          />
        ) : (
          <div className="bot-flow-node__message">
            {data.message || <span className="bot-flow-node__placeholder">Double-click to edit...</span>}
          </div>
        )}
      </div>

      {children}

      {/* Source handle (output) */}
      {sourceHandles && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="bot-flow-handle bot-flow-handle--source"
        />
      )}
    </div>
  );
}


// ─── Node Types ─────────────────────────────────────────────────────────────

export const StartNode = memo(({ id, data }) => (
  <NodeShell
    id={id} data={data} type="start"
    icon="🟢" color="#34d399" borderColor="#34d39960"
    label="Start"
    targetHandles={false}
  />
));
StartNode.displayName = "StartNode";

export const ResponseNode = memo(({ id, data }) => (
  <NodeShell
    id={id} data={data} type="response"
    icon="💬" color="#22d3ee" borderColor="#22d3ee60"
    label="Response"
  />
));
ResponseNode.displayName = "ResponseNode";

export const QuestionNode = memo(({ id, data }) => (
  <NodeShell
    id={id} data={data} type="question"
    icon="❓" color="#fbbf24" borderColor="#fbbf2460"
    label="Question"
  >
    {data.fallback && (
      <div className="bot-flow-node__fallback">
        Fallback: {data.fallback}
      </div>
    )}
  </NodeShell>
));
QuestionNode.displayName = "QuestionNode";

export const EndNode = memo(({ id, data }) => (
  <NodeShell
    id={id} data={data} type="end"
    icon="🔴" color="#f87171" borderColor="#f8717160"
    label="End"
    sourceHandles={false}
  />
));
EndNode.displayName = "EndNode";


// ─── Custom Edge Label (for editing conditions) ─────────────────────────────
// This is used in the main editor component, not here, but exporting the
// node type map for convenience.

export const nodeTypes = {
  start: StartNode,
  response: ResponseNode,
  question: QuestionNode,
  end: EndNode,
};
