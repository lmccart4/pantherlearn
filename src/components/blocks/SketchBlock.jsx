// src/components/blocks/SketchBlock.jsx
// Chrome Canvas-inspired sketching tool for physics lessons.
// Students draw free-body diagrams, circuit diagrams, etc. directly in the lesson.
// Tools: Pen, Marker, Eraser, Line, Shape (rect/ellipse/arrow), Text
// Hold Shift while drawing with pen/marker for straight lines.
// Strokes stored as structured data for compact storage and undo/redo.

import { useState, useRef, useCallback, useEffect } from "react";
import useAutoSave from "../../hooks/useAutoSave.jsx";

const COLORS = [
  "#000000", "#ffffff", "#ef4444", "#f59e0b",
  "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899",
];

const DRAW_TOOLS = [
  { id: "pen", label: "Pen", icon: "✏️" },
  { id: "marker", label: "Marker", icon: "🖍️" },
  { id: "eraser", label: "Eraser", icon: "◻️" },
  { id: "line", label: "Line", icon: "╱" },
  { id: "shape", label: "Shape", icon: "▢" },
  { id: "text", label: "Text", icon: "T" },
];

const SHAPES = ["rectangle", "ellipse", "arrow"];

// ──────────────────────────────────────────────
// Drawing helpers — used both during live draw
// and during full-canvas replay. Using the SAME
// path logic prevents the "stroke shifting" bug.
// ──────────────────────────────────────────────

function applyStrokeStyle(ctx, stroke) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = stroke.size || 3;

  if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.fillStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke.color || "#000";
    ctx.fillStyle = stroke.color || "#000";
    ctx.globalAlpha = stroke.opacity ?? 1;
  }
}

/** Draw a freehand stroke as simple lineTo segments (same as live drawing). */
function drawFreehandPath(ctx, points) {
  if (!points || points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

/** Draw a straight line between two points. */
function drawLinePath(ctx, p0, p1) {
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}

/** Draw a shape (rectangle, ellipse, or arrow). */
function drawShape(ctx, stroke) {
  const p0 = stroke.points[0];
  const p1 = stroke.points[stroke.points.length - 1];
  const shape = stroke.shape || "rectangle";

  ctx.beginPath();
  if (shape === "rectangle") {
    ctx.strokeRect(p0.x, p0.y, p1.x - p0.x, p1.y - p0.y);
  } else if (shape === "ellipse") {
    const cx = (p0.x + p1.x) / 2;
    const cy = (p0.y + p1.y) / 2;
    const rx = Math.abs(p1.x - p0.x) / 2;
    const ry = Math.abs(p1.y - p0.y) / 2;
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shape === "arrow") {
    // Line
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    // Arrowhead
    const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
    const headLen = Math.max(12, stroke.size * 4);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p1.x - headLen * Math.cos(angle - 0.4), p1.y - headLen * Math.sin(angle - 0.4));
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p1.x - headLen * Math.cos(angle + 0.4), p1.y - headLen * Math.sin(angle + 0.4));
    ctx.stroke();
  }
}

/** Draw a text element. */
function drawText(ctx, stroke) {
  if (!stroke.text) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = stroke.opacity ?? 1;
  ctx.fillStyle = stroke.color || "#000";
  ctx.font = `${stroke.size ? Math.max(14, stroke.size * 3) : 18}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-body").trim() || "system-ui, sans-serif"}`;
  ctx.textBaseline = "top";
  // Wrap text in lines
  const maxWidth = stroke.textWidth || 200;
  const words = stroke.text.split(" ");
  let line = "";
  let y = stroke.points[0].y;
  const lineHeight = (stroke.size ? Math.max(14, stroke.size * 3) : 18) * 1.3;
  for (const word of words) {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, stroke.points[0].x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, stroke.points[0].x, y);
  ctx.restore();
}

/** Draw any stroke (dispatcher). */
function drawStroke(ctx, stroke) {
  if (!ctx || !stroke) return;
  ctx.save();
  applyStrokeStyle(ctx, stroke);

  if (stroke.tool === "text") {
    drawText(ctx, stroke);
  } else if (stroke.tool === "shape") {
    drawShape(ctx, stroke);
  } else if (stroke.tool === "line" || stroke.isLine) {
    if (stroke.points && stroke.points.length >= 2) {
      drawLinePath(ctx, stroke.points[0], stroke.points[stroke.points.length - 1]);
    }
  } else {
    // pen, marker, eraser — freehand
    drawFreehandPath(ctx, stroke.points);
  }
  ctx.restore();
}

function redrawCanvas(ctx, strokeList, width, height) {
  if (!ctx) return;
  ctx.clearRect(0, 0, width || 4000, height || 4000);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width || 4000, height || 4000);
  for (const stroke of strokeList) {
    drawStroke(ctx, stroke);
  }
}

// Simple point-distance simplification — keeps shape accurate
function simplifyStroke(stroke) {
  if (stroke.tool !== "pen" && stroke.tool !== "marker" && stroke.tool !== "eraser") return stroke;
  const pts = stroke.points;
  if (!pts || pts.length <= 20) return stroke;

  // Douglas-Peucker-ish: keep points that are more than threshold px from the line
  const minDist = 1.5;
  const kept = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = kept[kept.length - 1];
    const dx = pts[i].x - prev.x;
    const dy = pts[i].y - prev.y;
    if (Math.sqrt(dx * dx + dy * dy) >= minDist) {
      kept.push(pts[i]);
    }
  }
  kept.push(pts[pts.length - 1]);
  return { ...stroke, points: kept };
}


// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

export default function SketchBlock({ block, studentData, onAnswer }) {
  const saved = (studentData || {})[block.id] || {};
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const containerRef = useRef(null);
  const drawingRef = useRef(null);
  const strokesRef = useRef(saved.strokes || []);
  const shiftRef = useRef(false);

  const [strokes, setStrokes] = useState(saved.strokes || []);
  const [redoStack, setRedoStack] = useState([]);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [activeShape, setActiveShape] = useState("rectangle");
  const [isDrawing, setIsDrawing] = useState(false);

  // Text tool state
  const [textInput, setTextInput] = useState(null); // { x, y } or null
  const [textValue, setTextValue] = useState("");
  const textRef = useRef(null);

  useEffect(() => { strokesRef.current = strokes; }, [strokes]);

  // Track shift key
  useEffect(() => {
    const down = (e) => { if (e.key === "Shift") shiftRef.current = true; };
    const up = (e) => { if (e.key === "Shift") shiftRef.current = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // Auto-save
  const performSave = useCallback(() => {
    if (onAnswer) {
      onAnswer(block.id, {
        strokes: strokesRef.current,
        savedAt: new Date().toISOString(),
      });
    }
  }, [onAnswer, block.id]);
  const { markDirty } = useAutoSave(performSave, { delay: 2000 });

  // Get canvas dimensions helper
  const getDims = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { width: 800, height: 400 };
    const rect = container.getBoundingClientRect();
    return { width: rect.width, height: block.canvasHeight || 400 };
  }, [block.canvasHeight]);

  // Init canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = getDims();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;

    redrawCanvas(ctx, strokesRef.current, width, height);
  }, [getDims]);

  useEffect(() => { initCanvas(); }, [initCanvas]);

  useEffect(() => {
    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
  }, [initCanvas]);

  // Redraw helper
  const doRedraw = useCallback((strokeList) => {
    const { width, height } = getDims();
    redrawCanvas(ctxRef.current, strokeList, width, height);
  }, [getDims]);

  // Coordinate helper
  function getCanvasPoint(e) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  // Commit a stroke to the strokes array
  const commitStroke = useCallback((newStroke) => {
    setStrokes((prev) => {
      const updated = [...prev, newStroke];
      strokesRef.current = updated;
      return updated;
    });
    setRedoStack([]);
    markDirty();
  }, [markDirty]);

  // ── Text tool ──
  const commitText = useCallback(() => {
    if (!textInput || !textValue.trim()) {
      setTextInput(null);
      setTextValue("");
      return;
    }
    const fontSize = Math.max(14, brushSize * 3);
    const newStroke = {
      tool: "text",
      points: [{ x: textInput.x, y: textInput.y }],
      color,
      size: brushSize,
      opacity: 1,
      text: textValue.trim(),
      textWidth: Math.min(getDims().width - textInput.x - 10, 400),
    };
    commitStroke(newStroke);
    doRedraw([...strokesRef.current]);
    setTextInput(null);
    setTextValue("");
  }, [textInput, textValue, color, brushSize, commitStroke, doRedraw, getDims]);

  // Focus text input when it appears
  useEffect(() => {
    if (textInput && textRef.current) textRef.current.focus();
  }, [textInput]);

  // ── Pointer handlers ──
  const handlePointerDown = useCallback((e) => {
    // Text tool — place text input
    if (tool === "text") {
      if (textInput) commitText();
      const pt = getCanvasPoint(e);
      setTextInput({ x: pt.x, y: pt.y });
      setTextValue("");
      return;
    }

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const point = getCanvasPoint(e);
    const isShift = shiftRef.current;
    const opacity = tool === "marker" ? 0.4 : 1;
    const size = tool === "eraser" ? Math.max(brushSize * 3, 15)
               : tool === "marker" ? brushSize * 2.5
               : brushSize;

    drawingRef.current = {
      points: [point],
      color: tool === "eraser" ? "#ffffff" : color,
      size,
      tool: tool === "shape" ? "shape" : (tool === "line" ? "line" : tool),
      opacity,
      isLine: isShift && (tool === "pen" || tool === "marker"),
      shape: tool === "shape" ? activeShape : undefined,
      startPoint: point,
    };
    setIsDrawing(true);
  }, [tool, color, brushSize, activeShape, textInput, commitText]);

  const handlePointerMove = useCallback((e) => {
    if (!drawingRef.current || !ctxRef.current) return;
    e.preventDefault();

    const point = getCanvasPoint(e);
    const d = drawingRef.current;

    // For line/shape tools or shift-constrained: show preview
    if (d.tool === "line" || d.tool === "shape" || d.isLine) {
      d.points = [d.startPoint, point];
      // Redraw everything + preview
      doRedraw(strokesRef.current);
      const ctx = ctxRef.current;
      ctx.save();
      applyStrokeStyle(ctx, d);
      if (d.tool === "shape") {
        drawShape(ctx, d);
      } else {
        drawLinePath(ctx, d.startPoint, point);
      }
      ctx.restore();
      return;
    }

    // Freehand — draw segment immediately
    d.points.push(point);
    const ctx = ctxRef.current;
    const pts = d.points;
    if (pts.length < 2) return;

    ctx.save();
    applyStrokeStyle(ctx, d);
    ctx.beginPath();
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();
    ctx.restore();
  }, [doRedraw]);

  const handlePointerUp = useCallback((e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) {
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    const d = drawingRef.current;
    drawingRef.current = null;
    setIsDrawing(false);

    if (!d.points || d.points.length < 2) return;

    // For line/shape/shift-line: only keep start and end points
    let finalStroke;
    if (d.tool === "line" || d.tool === "shape" || d.isLine) {
      finalStroke = { ...d, points: [d.startPoint, d.points[d.points.length - 1]] };
      delete finalStroke.startPoint;
    } else {
      finalStroke = simplifyStroke(d);
      delete finalStroke.startPoint;
    }

    commitStroke(finalStroke);
    doRedraw([...strokesRef.current]);
  }, [commitStroke, doRedraw]);

  // ── Undo/Redo/Clear ──
  const handleUndo = useCallback(() => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((rs) => [...rs, last]);
      const updated = prev.slice(0, -1);
      strokesRef.current = updated;
      doRedraw(updated);
      markDirty();
      return updated;
    });
  }, [markDirty, doRedraw]);

  const handleRedo = useCallback(() => {
    setRedoStack((rs) => {
      if (rs.length === 0) return rs;
      const last = rs[rs.length - 1];
      setStrokes((prev) => {
        const updated = [...prev, last];
        strokesRef.current = updated;
        doRedraw(updated);
        markDirty();
        return updated;
      });
      return rs.slice(0, -1);
    });
  }, [markDirty, doRedraw]);

  const handleClear = useCallback(() => {
    if (strokes.length === 0) return;
    if (!confirm("Clear the entire canvas? This cannot be undone.")) return;
    setStrokes([]);
    setRedoStack([]);
    strokesRef.current = [];
    doRedraw([]);
    markDirty();
  }, [strokes.length, markDirty, doRedraw]);

  // Cursor style
  const getCursor = () => {
    if (tool === "eraser") return "cell";
    if (tool === "text") return "text";
    if (tool === "line" || tool === "shape") return "crosshair";
    return "crosshair";
  };

  // Shape picker sub-menu
  const [showShapePicker, setShowShapePicker] = useState(false);

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
            {DRAW_TOOLS.map((t) => (
              <div key={t.id} style={{ position: "relative" }}>
                <button
                  className={`sketch-tool-btn ${tool === t.id ? "active" : ""}`}
                  onClick={() => {
                    if (textInput) commitText();
                    setTool(t.id);
                    if (t.id === "shape") setShowShapePicker((v) => !v);
                    else setShowShapePicker(false);
                  }}
                  title={t.id === "shape" ? `Shape: ${activeShape}` : t.label}
                >
                  <span className="sketch-tool-icon">{t.icon}</span>
                  <span className="sketch-tool-label">
                    {t.id === "shape" ? activeShape.charAt(0).toUpperCase() + activeShape.slice(1) : t.label}
                  </span>
                </button>
                {/* Shape picker dropdown */}
                {t.id === "shape" && showShapePicker && tool === "shape" && (
                  <div className="sketch-shape-picker">
                    {SHAPES.map((s) => (
                      <button
                        key={s}
                        className={`sketch-shape-option ${activeShape === s ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveShape(s);
                          setShowShapePicker(false);
                        }}
                      >
                        {s === "rectangle" ? "▭" : s === "ellipse" ? "○" : "→"}{" "}
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

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

          <div className="sketch-divider" />

          {/* Brush size */}
          <div className="sketch-size-group">
            <span className="sketch-size-label">Size</span>
            <input
              type="range" min="1" max="20" value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="sketch-size-slider"
            />
            <span className="sketch-size-value">{brushSize}</span>
            <div className="sketch-size-preview" style={{
              width: Math.min(brushSize * 1.5, 20),
              height: Math.min(brushSize * 1.5, 20),
              background: tool === "eraser" ? "var(--text3)" : color,
              opacity: tool === "marker" ? 0.4 : 1,
            }} />
          </div>

          <div className="sketch-divider" />

          {/* Undo / Redo / Clear */}
          <div className="sketch-action-group">
            <button className="sketch-action-btn" onClick={handleUndo} disabled={strokes.length === 0} title="Undo">↩</button>
            <button className="sketch-action-btn" onClick={handleRedo} disabled={redoStack.length === 0} title="Redo">↪</button>
            <button className="sketch-action-btn sketch-clear-btn" onClick={handleClear} disabled={strokes.length === 0} title="Clear canvas">🗑</button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="sketch-canvas-container" ref={containerRef} style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          className="sketch-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={(e) => { if (drawingRef.current) handlePointerUp(e); }}
          style={{ touchAction: "none", cursor: getCursor() }}
        />
        {/* Text input overlay */}
        {textInput && (
          <div
            style={{
              position: "absolute",
              left: textInput.x,
              top: textInput.y,
              zIndex: 10,
            }}
          >
            <textarea
              ref={textRef}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitText(); }
                if (e.key === "Escape") { setTextInput(null); setTextValue(""); }
              }}
              onBlur={commitText}
              placeholder="Type here..."
              style={{
                minWidth: 120,
                minHeight: 32,
                padding: "4px 6px",
                fontSize: Math.max(14, brushSize * 3) + "px",
                fontFamily: "inherit",
                color: color,
                background: "rgba(255,255,255,0.9)",
                border: "2px solid var(--amber)",
                borderRadius: 6,
                outline: "none",
                resize: "both",
                lineHeight: 1.3,
              }}
            />
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="sketch-hint">
        {tool === "pen" || tool === "marker"
          ? "Hold Shift for straight line"
          : tool === "text"
          ? "Click to place text • Enter to confirm • Esc to cancel"
          : tool === "line"
          ? "Click and drag to draw a line"
          : tool === "shape"
          ? `Click and drag to draw ${activeShape}`
          : ""}
        {" • "}{strokes.length} stroke{strokes.length !== 1 ? "s" : ""} • Auto-saved
      </div>
    </div>
  );
}
