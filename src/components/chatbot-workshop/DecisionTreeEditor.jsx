// src/components/chatbot-workshop/DecisionTreeEditor.jsx
// Phase 1 editor: Drag-and-drop decision tree builder using React Flow.
// Students create nodes (bot messages) and connect them with edges (keyword conditions).
// Double-click nodes to edit messages. Click edges to edit keyword conditions.

import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./flow-nodes/BotNode";
import "./flow-nodes/bot-flow.css";

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateId(prefix = "node") {
  return `${prefix}-${Math.random().toString(36).substr(2, 8)}`;
}

function getNextNodePosition(nodes) {
  if (!nodes.length) return { x: 300, y: 100 };
  const maxY = Math.max(...nodes.map(n => n.position.y));
  const avgX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length;
  return { x: avgX + (Math.random() - 0.5) * 100, y: maxY + 160 };
}

// ─── Inner Editor (needs ReactFlowProvider above it) ────────────────────────

function DecisionTreeEditorInner({ config, onSave }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const edgeInputRef = useRef(null);
  const { fitView } = useReactFlow();
  const initialized = useRef(false);

  // Inject callbacks into node data
  const injectCallbacks = useCallback((nodeList) => {
    return nodeList.map(n => ({
      ...n,
      data: { ...n.data, onChange: handleNodeDataChange, onDelete: handleDeleteNode },
    }));
  }, []);

  // Sync from parent on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (config?.nodes?.length) {
      setNodes(injectCallbacks(config.nodes));
    }
    if (config?.edges?.length) {
      const edgesWithStyle = config.edges.map(e => ({
        ...e,
        type: "default",
        animated: (e.data?.condition || e.label || "").toLowerCase() === "default",
        label: e.data?.condition || e.label || "",
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
        style: { strokeWidth: 2 },
      }));
      setEdges(edgesWithStyle);
    }
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  }, [config]);

  // ─── Node Changes ────────────────────────────────────────────────

  const onNodesChange = useCallback((changes) => {
    setNodes(nds => applyNodeChanges(changes, nds));
    if (changes.some(c => c.type === "position" && c.dragging === false)) {
      setHasChanges(true);
    }
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges(eds => applyEdgeChanges(changes, eds));
    if (changes.some(c => c.type === "remove")) {
      setHasChanges(true);
    }
  }, []);

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: generateId("edge"),
      type: "default",
      label: "keyword",
      data: { condition: "keyword" },
      markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      style: { strokeWidth: 2 },
    };
    setEdges(eds => addEdge(newEdge, eds));
    setSelectedEdgeId(newEdge.id);
    setHasChanges(true);
    setTimeout(() => edgeInputRef.current?.focus(), 50);
  }, []);

  // ─── Node Data Changes ───────────────────────────────────────────

  const handleNodeDataChange = useCallback((nodeId, updates) => {
    setNodes(nds => nds.map(n =>
      n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
    ));
    setHasChanges(true);
  }, []);

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    setHasChanges(true);
  }, []);

  // ─── Add Nodes ───────────────────────────────────────────────────

  function addNode(type) {
    const pos = getNextNodePosition(nodes);
    const labels = {
      response: "New response...",
      question: "Ask the user something...",
      end: "Goodbye! Thanks for chatting!",
    };
    const newNode = {
      id: generateId(),
      type,
      position: pos,
      data: {
        message: labels[type] || "New node...",
        onChange: handleNodeDataChange,
        onDelete: handleDeleteNode,
      },
    };
    setNodes(nds => [...nds, newNode]);
    setHasChanges(true);
  }

  // ─── Edge Selection & Editing ────────────────────────────────────

  function onEdgeClick(_event, edge) {
    setSelectedEdgeId(edge.id);
    setTimeout(() => edgeInputRef.current?.focus(), 50);
  }

  function handleEdgeConditionChange(newCondition) {
    setEdges(eds => eds.map(e =>
      e.id === selectedEdgeId
        ? {
            ...e,
            label: newCondition,
            data: { ...e.data, condition: newCondition },
            animated: newCondition.toLowerCase() === "default",
          }
        : e
    ));
    setHasChanges(true);
  }

  function closeEdgePanel() {
    setSelectedEdgeId(null);
  }

  function deleteSelectedEdge() {
    setEdges(eds => eds.filter(e => e.id !== selectedEdgeId));
    setSelectedEdgeId(null);
    setHasChanges(true);
  }

  // ─── Save ────────────────────────────────────────────────────────

  function handleSave() {
    const cleanNodes = nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: { message: n.data?.message, fallback: n.data?.fallback },
    }));
    const cleanEdges = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      data: { condition: e.data?.condition || e.label || "" },
      label: e.data?.condition || e.label || "",
    }));
    onSave({ nodes: cleanNodes, edges: cleanEdges });
    setHasChanges(false);
  }

  function onPaneClick() {
    setSelectedEdgeId(null);
  }

  const selectedEdge = edges.find(e => e.id === selectedEdgeId);

  return (
    <div className="dt-flow-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: "default",
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
          style: { strokeWidth: 2 },
        }}
        connectionLineStyle={{ strokeWidth: 2, strokeDasharray: "6 3" }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={["Backspace", "Delete"]}
        snapToGrid
        snapGrid={[16, 16]}
      >
        <Background color="rgba(255,255,255,0.03)" gap={24} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            const colors = { start: "#34d399", response: "#22d3ee", question: "#fbbf24", end: "#f87171" };
            return colors[n.type] || "#666";
          }}
          maskColor="rgba(0,0,0,0.5)"
          style={{ height: 80, width: 120 }}
        />
      </ReactFlow>

      {/* Toolbar */}
      <div className="dt-toolbar">
        <button className="dt-toolbar-btn" onClick={() => addNode("response")}>
          <span className="tb-icon">💬</span> Response
        </button>
        <button className="dt-toolbar-btn" onClick={() => addNode("question")}>
          <span className="tb-icon">❓</span> Question
        </button>
        <button className="dt-toolbar-btn" onClick={() => addNode("end")}>
          <span className="tb-icon">🔴</span> End
        </button>
        <button
          className={`dt-toolbar-btn ${hasChanges ? "dt-toolbar-btn--save" : ""}`}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          {hasChanges ? "💾 Save" : "✓ Saved"}
        </button>
      </div>

      {/* Edge edit panel */}
      {selectedEdge && (
        <div className="dt-edge-panel">
          <span className="dt-edge-panel__label">Keywords:</span>
          <input
            ref={edgeInputRef}
            className="dt-edge-panel__input"
            value={selectedEdge.data?.condition || selectedEdge.label || ""}
            onChange={e => handleEdgeConditionChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") closeEdgePanel();
              if (e.key === "Escape") closeEdgePanel();
            }}
            placeholder='e.g. "hello, hi, hey" or "default"'
          />
          <span className="dt-edge-panel__hint">comma-separated</span>
          <button className="dt-edge-panel__close" onClick={deleteSelectedEdge} title="Delete connection">
            🗑
          </button>
          <button className="dt-edge-panel__close" onClick={closeEdgePanel} title="Close">
            ✕
          </button>
        </div>
      )}

      {/* Help tooltip */}
      {showHelp && (
        <div className="dt-help-float">
          <button className="dt-help-float__close" onClick={() => setShowHelp(false)}>✕</button>
          <strong>How to build your bot:</strong><br />
          • <strong>Drag</strong> nodes to arrange them<br />
          • <strong>Double-click</strong> a node to edit its message<br />
          • Drag from a <strong>bottom handle ●</strong> to a <strong>top handle ●</strong> to connect<br />
          • <strong>Click a connection line</strong> to set its keywords<br />
          • Use <strong>"default"</strong> as a catch-all keyword<br />
          • Press <strong>Delete/Backspace</strong> to remove items
        </div>
      )}
    </div>
  );
}


// ─── Wrapper with Provider ──────────────────────────────────────────────────

export default function DecisionTreeEditor(props) {
  return (
    <div style={{ height: "calc(100vh - 170px)", minHeight: 500 }}>
      <ReactFlowProvider>
        <DecisionTreeEditorInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
