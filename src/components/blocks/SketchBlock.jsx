// src/components/blocks/SketchBlock.jsx
// Chrome Canvas-inspired sketching tool for physics lessons.
// Students draw free-body diagrams, circuit diagrams, etc. directly in the lesson.
// Strokes are stored as structured data for compact storage and undo/redo.

import { useState, useRef, useCallback, useEffect } from "react";
import useAutoSave from "../../hooks/useAutoSave.jsx";

const COLORS = [
  "#000000", // Black
  "#ffffff", // White
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
];

const TOOLS = [
  { id: "pen", label: "Pen", icon: "✏️" },
  { id: "marker", label: "Marker", icon: "🖍️" },
  { id: "eraser", label: "Eraser", icon: "◻️" },
];

export default function SketchBlock({ block, studentData, onAnswer }) {
  const saved = (studentData || {})[block.id] || {};
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const containerRef = useRef(null);
  const drawingRef = useRef(null); // current in-progress stroke
  const strokesRef = useRef(saved.strokes || []);

  const [strokes, setStrokes] = useState(saved.strokes || []);
  const [redoStack, setRedoStack] = useState([]);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  // Keep strokesRef in sync
  useEffect(() => { strokesRef.current = strokes; }, [strokes]);

  // Auto-save via the existing pattern
  const performSave = useCallback(() => {
    if (onAnswer) {
      onAnswer(block.id, {
        strokes: strokesRef.current,
        savedAt: new Date().toISOString(),
      });
    }
  }, [onAnswer, block.id]);

  const { markDirty } = useAutoSave(performSave, { delay: 2000 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = block.canvasHeight || 400;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;

    // Replay saved strokes
    redrawCanvas(ctx, strokesRef.current, width, height);
  }, [block.canvasHeight]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = block.canvasHeight || 400;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctxRef.current = ctx;

      redrawCanvas(ctx, strokesRef.current, width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [block.canvasHeight]);

  // Redraw entire canvas from stroke data
  function redrawCanvas(ctx, strokeList, width, height) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width || 2000, height || 2000);
    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width || 2000, height || 2000);

    for (const stroke of strokeList) {
      drawStroke(ctx, stroke);
    }
  }

  // Draw a single stroke
  function drawStroke(ctx, stroke) {
    if (!ctx || !stroke.points || stroke.points.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = stroke.size || 3;

    if (stroke.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.color || "#000000";
      ctx.globalAlpha = stroke.opacity ?? 1;
    }

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    // Smooth curve through points using quadratic bezier
    for (let i = 1; i < stroke.points.length - 1; i++) {
      const midX = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
      const midY = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, midX, midY);
    }

    // Draw to last point
    const last = stroke.points[stroke.points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    ctx.restore();
  }

  // Get canvas-relative coordinates from pointer event
  function getCanvasPoint(e) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  // Pointer down — start a new stroke
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const point = getCanvasPoint(e);
    const opacity = tool === "marker" ? 0.4 : 1;
    const size = tool === "eraser" ? Math.max(brushSize * 3, 15) : (tool === "marker" ? brushSize * 2.5 : brushSize);

    drawingRef.current = {
      points: [point],
      color: tool === "eraser" ? "#ffffff" : color,
      size,
      tool,
      opacity,
    };
    setIsDrawing(true);
  }, [tool, color, brushSize]);

  // Pointer move — add points to current stroke
  const handlePointerMove = useCallback((e) => {
    if (!drawingRef.current || !ctxRef.current) return;
    e.preventDefault();

    const point = getCanvasPoint(e);
    drawingRef.current.points.push(point);

    // Draw the latest segment immediately for responsiveness
    const ctx = ctxRef.current;
    const pts = drawingRef.current.points;
    if (pts.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = drawingRef.current.size;

    if (drawingRef.current.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = drawingRef.current.color;
      ctx.globalAlpha = drawingRef.current.opacity ?? 1;
    }

    ctx.beginPath();
    const prev = pts[pts.length - 2];
    const curr = pts[pts.length - 1];
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.stroke();
    ctx.restore();
  }, []);

  // Pointer up — finalize stroke
  const handlePointerUp = useCallback((e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) canvas.releasePointerCapture(e.pointerId);

    const newStroke = drawingRef.current;
    drawingRef.current = null;
    setIsDrawing(false);

    // Only save strokes with at least 2 points
    if (newStroke.points.length < 2) return;

    // Simplify stroke to reduce data size — keep every Nth point based on length
    const simplified = simplifyStroke(newStroke);

    setStrokes((prev) => {
      const updated = [...prev, simplified];
      strokesRef.current = updated;
      return updated;
    });
    setRedoStack([]);
    markDirty();

    // Redraw fully to ensure clean rendering
    const container = containerRef.current;
    if (container && ctxRef.current) {
      const rect = container.getBoundingClientRect();
      redrawCanvas(ctxRef.current, [...strokesRef.current], rect.width, block.canvasHeight || 400);
    }
  }, [markDirty, block.canvasHeight]);

  // Simplify stroke — reduce point count for storage efficiency
  function simplifyStroke(stroke) {
    const pts = stroke.points;
    if (pts.length <= 10) return stroke;

    // Keep every Nth point, always keeping first and last
    const step = Math.max(2, Math.floor(pts.length / 50));
    const simplified = [pts[0]];
    for (let i = step; i < pts.length - 1; i += step) {
      simplified.push(pts[i]);
    }
    simplified.push(pts[pts.length - 1]);

    return { ...stroke, points: simplified };
  }

  // Undo — pop last stroke
  const handleUndo = useCallback(() => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((rs) => [...rs, last]);
      const updated = prev.slice(0, -1);
      strokesRef.current = updated;

      // Redraw
      const container = containerRef.current;
      if (container && ctxRef.current) {
        const rect = container.getBoundingClientRect();
        redrawCanvas(ctxRef.current, updated, rect.width, block.canvasHeight || 400);
      }
      markDirty();
      return updated;
    });
  }, [markDirty, block.canvasHeight]);

  // Redo — pop from redo stack
  const handleRedo = useCallback(() => {
    setRedoStack((rs) => {
      if (rs.length === 0) return rs;
      const last = rs[rs.length - 1];
      setStrokes((prev) => {
        const updated = [...prev, last];
        strokesRef.current = updated;

        // Redraw
        const container = containerRef.current;
        if (container && ctxRef.current) {
          const rect = container.getBoundingClientRect();
          redrawCanvas(ctxRef.current, updated, rect.width, block.canvasHeight || 400);
        }
        markDirty();
        return updated;
      });
      return rs.slice(0, -1);
    });
  }, [markDirty, block.canvasHeight]);

  // Clear canvas
  const handleClear = useCallback(() => {
    if (strokes.length === 0) return;
    if (!confirm("Clear the entire canvas? This cannot be undone.")) return;

    setStrokes([]);
    setRedoStack([]);
    strokesRef.current = [];

    const container = containerRef.current;
    if (container && ctxRef.current) {
      const rect = container.getBoundingClientRect();
      redrawCanvas(ctxRef.current, [], rect.width, block.canvasHeight || 400);
    }
    markDirty();
  }, [strokes.length, markDirty, block.canvasHeight]);

  return (
    <div className="sketch-block">
      {/* Title & Instructions */}
      {(block.title || block.instructions) && (
        <div className="sketch-header">
          {block.title && (
            <div className="sketch-title">
              <span className="sketch-icon">✏️</span>
              {block.title}
            </div>
          )}
          {block.instructions && (
            <div className="sketch-instructions">{block.instructions}</div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="sketch-toolbar">
        <div className="sketch-toolbar-row">
          {/* Tool buttons */}
          <div className="sketch-tool-group">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                className={`sketch-tool-btn ${tool === t.id ? "active" : ""}`}
                onClick={() => setTool(t.id)}
                title={t.label}
              >
                <span className="sketch-tool-icon">{t.icon}</span>
                <span className="sketch-tool-label">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="sketch-divider" />

          {/* Color swatches */}
          <div className="sketch-color-group">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`sketch-color-btn ${color === c ? "active" : ""}`}
                onClick={() => { setColor(c); if (tool === "eraser") setTool("pen"); }}
                title={c}
                style={{
                  background: c,
                  border: c === "#ffffff" ? "2px solid var(--border)" : color === c ? `2px solid ${c}` : "2px solid transparent",
                  boxShadow: color === c ? `0 0 8px ${c === "#ffffff" ? "rgba(255,255,255,0.4)" : c + "66"}` : "none",
                }}
              />
            ))}
            {/* Custom color */}
            <label className="sketch-color-custom" title="Custom color">
              <input
                type="color"
                value={color}
                onChange={(e) => { setColor(e.target.value); if (tool === "eraser") setTool("pen"); }}
                style={{ opacity: 0, position: "absolute", width: 0, height: 0 }}
              />
              <span style={{
                width: 26, height: 26, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                cursor: "pointer", fontSize: 11, fontWeight: 700,
              }}>⊕</span>
            </label>
          </div>

          {/* Divider */}
          <div className="sketch-divider" />

          {/* Brush size */}
          <div className="sketch-size-group">
            <span className="sketch-size-label">Size</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="sketch-size-slider"
            />
            <span className="sketch-size-value">{brushSize}</span>
            {/* Size preview */}
            <div className="sketch-size-preview" style={{
              width: Math.min(brushSize * 1.5, 20),
              height: Math.min(brushSize * 1.5, 20),
              background: tool === "eraser" ? "var(--text3)" : color,
              opacity: tool === "marker" ? 0.4 : 1,
            }} />
          </div>

          {/* Divider */}
          <div className="sketch-divider" />

          {/* Undo / Redo / Clear */}
          <div className="sketch-action-group">
            <button
              className="sketch-action-btn"
              onClick={handleUndo}
              disabled={strokes.length === 0}
              title="Undo (remove last stroke)"
            >
              ↩
            </button>
            <button
              className="sketch-action-btn"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title="Redo"
            >
              ↪
            </button>
            <button
              className="sketch-action-btn sketch-clear-btn"
              onClick={handleClear}
              disabled={strokes.length === 0}
              title="Clear canvas"
            >
              🗑
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="sketch-canvas-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="sketch-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            touchAction: "none",
            cursor: tool === "eraser" ? "cell" : "crosshair",
          }}
        />
      </div>

      {/* Hint */}
      <div className="sketch-hint">
        Draw with {tool === "pen" ? "pen" : tool === "marker" ? "marker" : "eraser"} • {strokes.length} stroke{strokes.length !== 1 ? "s" : ""} • Auto-saved
      </div>
    </div>
  );
}
