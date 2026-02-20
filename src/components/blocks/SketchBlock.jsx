// src/components/blocks/SketchBlock.jsx
// Chrome Canvas-inspired sketching tool for physics lessons.
// Tools: Pen, Marker, Eraser, Line, Shape (rect/ellipse/arrow), Text
// Hold Shift while drawing with pen/marker for straight lines.
// Strokes stored as structured data for compact storage and undo/redo.

import { useState, useRef, useCallback, useEffect } from "react";
import useAutoSave from "../../hooks/useAutoSave.jsx";

const COLORS = [
  "#000000", "#ffffff", "#ef4444", "#f59e0b",
  "#22c55e", "#3b82f6",
];

const DRAW_TOOLS = [
  { id: "move", label: "Move", icon: "✋" },
  { id: "pen", label: "Pen", icon: "✏️" },
  { id: "marker", label: "Marker", icon: "🖍️" },
  { id: "eraser", label: "Eraser", icon: "◻️" },
  { id: "line", label: "Line", icon: "╱" },
  { id: "shape", label: "Shape", icon: "▢" },
  { id: "text", label: "Text", icon: "T" },
];

const SHAPES = ["rectangle", "ellipse", "arrow"];

// ──────────────────────────────────────────────
// Drawing helpers
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

function drawFreehandPath(ctx, points) {
  if (!points || points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function drawLinePath(ctx, p0, p1) {
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}

function drawShape(ctx, stroke) {
  const p0 = stroke.points[0];
  const p1 = stroke.points[stroke.points.length - 1];
  const shape = stroke.shape || "rectangle";

  if (shape === "rectangle") {
    ctx.beginPath();
    ctx.strokeRect(p0.x, p0.y, p1.x - p0.x, p1.y - p0.y);
  } else if (shape === "ellipse") {
    const cx = (p0.x + p1.x) / 2;
    const cy = (p0.y + p1.y) / 2;
    const rx = Math.abs(p1.x - p0.x) / 2;
    const ry = Math.abs(p1.y - p0.y) / 2;
    if (rx > 0 && ry > 0) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (shape === "arrow") {
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
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

function drawText(ctx, stroke) {
  if (!stroke.text) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = stroke.opacity ?? 1;
  ctx.fillStyle = stroke.color || "#000";
  const fontSize = stroke.size ? Math.max(14, stroke.size * 3) : 18;
  ctx.font = `${fontSize}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-body").trim() || "system-ui, sans-serif"}`;
  ctx.textBaseline = "top";
  const maxWidth = stroke.textWidth || 200;
  const words = stroke.text.split(" ");
  let line = "";
  let y = stroke.points[0].y;
  const lineHeight = fontSize * 1.3;
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

function drawStroke(ctx, stroke) {
  if (!ctx || !stroke) return;
  ctx.save();
  applyStrokeStyle(ctx, stroke);
  if (stroke.tool === "text") drawText(ctx, stroke);
  else if (stroke.tool === "shape") drawShape(ctx, stroke);
  else if (stroke.tool === "line" || stroke.isLine) {
    if (stroke.points?.length >= 2)
      drawLinePath(ctx, stroke.points[0], stroke.points[stroke.points.length - 1]);
  } else drawFreehandPath(ctx, stroke.points);
  ctx.restore();
}

function redrawCanvas(ctx, strokeList, width, height) {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, width || 4000, height || 4000);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width || 4000, height || 4000);
  ctx.restore();
  for (const stroke of strokeList) drawStroke(ctx, stroke);
}

// ──────────────────────────────────────────────
// Hit-testing for move tool
// ──────────────────────────────────────────────

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function hitTestStroke(stroke, px, py, threshold = 12) {
  if (!stroke.points || stroke.points.length === 0) return false;
  const t = stroke.tool;

  if (t === "text") {
    const p = stroke.points[0];
    const fontSize = stroke.size ? Math.max(14, stroke.size * 3) : 18;
    const w = stroke.textWidth || 200;
    const h = fontSize * 2;
    return px >= p.x - 4 && px <= p.x + w + 4 && py >= p.y - 4 && py <= p.y + h + 4;
  }

  if (t === "shape") {
    const p0 = stroke.points[0];
    const p1 = stroke.points[stroke.points.length - 1];
    const shape = stroke.shape || "rectangle";
    if (shape === "rectangle") {
      const minX = Math.min(p0.x, p1.x), maxX = Math.max(p0.x, p1.x);
      const minY = Math.min(p0.y, p1.y), maxY = Math.max(p0.y, p1.y);
      // Hit if near any edge
      const nearLeft = Math.abs(px - minX) < threshold && py >= minY - threshold && py <= maxY + threshold;
      const nearRight = Math.abs(px - maxX) < threshold && py >= minY - threshold && py <= maxY + threshold;
      const nearTop = Math.abs(py - minY) < threshold && px >= minX - threshold && px <= maxX + threshold;
      const nearBottom = Math.abs(py - maxY) < threshold && px >= minX - threshold && px <= maxX + threshold;
      // Also hit if inside the rectangle
      const inside = px >= minX && px <= maxX && py >= minY && py <= maxY;
      return nearLeft || nearRight || nearTop || nearBottom || inside;
    }
    if (shape === "ellipse") {
      const cx = (p0.x + p1.x) / 2, cy = (p0.y + p1.y) / 2;
      const rx = Math.abs(p1.x - p0.x) / 2, ry = Math.abs(p1.y - p0.y) / 2;
      if (rx < 1 || ry < 1) return false;
      const norm = ((px - cx) / (rx + threshold)) ** 2 + ((py - cy) / (ry + threshold)) ** 2;
      return norm <= 1;
    }
    if (shape === "arrow") {
      return distToSegment(px, py, p0.x, p0.y, p1.x, p1.y) < threshold;
    }
  }

  if (t === "line" || stroke.isLine) {
    if (stroke.points.length >= 2) {
      const p0 = stroke.points[0], p1 = stroke.points[stroke.points.length - 1];
      return distToSegment(px, py, p0.x, p0.y, p1.x, p1.y) < threshold;
    }
  }

  // Freehand: check distance to any segment
  for (let i = 1; i < stroke.points.length; i++) {
    const a = stroke.points[i - 1], b = stroke.points[i];
    if (distToSegment(px, py, a.x, a.y, b.x, b.y) < threshold) return true;
  }
  return false;
}

function findTopmostStroke(strokes, px, py) {
  // Search from top (last drawn) to bottom
  for (let i = strokes.length - 1; i >= 0; i--) {
    if (strokes[i].tool === "eraser") continue;
    if (hitTestStroke(strokes[i], px, py)) return i;
  }
  return -1;
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
  const [showShapePicker, setShowShapePicker] = useState(false);

  const [textInput, setTextInput] = useState(null);
  const [textValue, setTextValue] = useState("");
  const textRef = useRef(null);
  const moveRef = useRef(null); // { strokeIdx, lastPoint }
  const [selectedIdx, setSelectedIdx] = useState(-1);

  useEffect(() => { strokesRef.current = strokes; }, [strokes]);

  // Track shift
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
      onAnswer(block.id, { strokes: strokesRef.current, savedAt: new Date().toISOString() });
    }
  }, [onAnswer, block.id]);
  const { markDirty } = useAutoSave(performSave, { delay: 2000 });

  const getDims = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { width: 800, height: 400 };
    const rect = container.getBoundingClientRect();
    return { width: rect.width, height: block.canvasHeight || 400 };
  }, [block.canvasHeight]);

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

  const doRedraw = useCallback((list) => {
    const { width, height } = getDims();
    redrawCanvas(ctxRef.current, list, width, height);
  }, [getDims]);

  function getCanvasPoint(e) {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  // Commit stroke — updates state + ref synchronously enough for our needs
  const commitStroke = useCallback((s) => {
    const updated = [...strokesRef.current, s];
    strokesRef.current = updated;
    setStrokes(updated);
    setRedoStack([]);
    markDirty();
  }, [markDirty]);

  // ── Text ──
  const commitText = useCallback(() => {
    if (!textInput || !textValue.trim()) { setTextInput(null); setTextValue(""); return; }
    const s = {
      tool: "text",
      points: [{ x: textInput.x, y: textInput.y }],
      color, size: brushSize, opacity: 1,
      text: textValue.trim(),
      textWidth: Math.min(getDims().width - textInput.x - 10, 400),
    };
    commitStroke(s);
    // Need a redraw because text is rendered to canvas only on commit
    doRedraw([...strokesRef.current]);
    setTextInput(null);
    setTextValue("");
  }, [textInput, textValue, color, brushSize, commitStroke, doRedraw, getDims]);

  useEffect(() => { if (textInput && textRef.current) textRef.current.focus(); }, [textInput]);

  // ── Move helpers ──
  const drawSelectionHighlight = useCallback((ctx, stroke) => {
    if (!stroke || !stroke.points || stroke.points.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    // Compute bounding box of the stroke
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of stroke.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    if (stroke.tool === "text") {
      const fontSize = stroke.size ? Math.max(14, stroke.size * 3) : 18;
      maxX = Math.max(maxX, minX + (stroke.textWidth || 200));
      maxY = Math.max(maxY, minY + fontSize * 2);
    }
    const pad = 6;
    ctx.strokeRect(minX - pad, minY - pad, (maxX - minX) + pad * 2, (maxY - minY) + pad * 2);
    ctx.setLineDash([]);
    ctx.restore();
  }, []);

  const offsetStrokePoints = (stroke, dx, dy) => ({
    ...stroke,
    points: stroke.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
  });

  // ── Text placement via click (separate from pointer draw events) ──
  const handleCanvasClick = useCallback((e) => {
    if (tool !== "text") return;
    // If there's already an active text input, commit it first
    if (textInput) commitText();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTextInput({ x, y });
    setTextValue("");
  }, [tool, textInput, commitText]);

  // ── Pointer handlers ──
  const handlePointerDown = useCallback((e) => {
    // Text tool is handled by onClick instead
    if (tool === "text") return;

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const point = getCanvasPoint(e);

    // Move tool: find and start dragging a stroke
    if (tool === "move") {
      const idx = findTopmostStroke(strokesRef.current, point.x, point.y);
      if (idx >= 0) {
        moveRef.current = { strokeIdx: idx, lastPoint: point };
        setSelectedIdx(idx);
        // Draw selection highlight
        doRedraw(strokesRef.current);
        drawSelectionHighlight(ctxRef.current, strokesRef.current[idx]);
      } else {
        setSelectedIdx(-1);
        moveRef.current = null;
      }
      return;
    }

    setSelectedIdx(-1);
    const isShift = shiftRef.current;
    const opacity = tool === "marker" ? 0.4 : 1;
    const size = tool === "eraser" ? Math.max(brushSize * 3, 15)
               : tool === "marker" ? brushSize * 2.5
               : brushSize;

    drawingRef.current = {
      points: [point],
      color: tool === "eraser" ? "#ffffff" : color,
      size, tool: tool === "shape" ? "shape" : tool === "line" ? "line" : tool,
      opacity,
      isLine: isShift && (tool === "pen" || tool === "marker"),
      shape: tool === "shape" ? activeShape : undefined,
      startPoint: point,
    };
  }, [tool, color, brushSize, activeShape, doRedraw, drawSelectionHighlight]);

  const handlePointerMove = useCallback((e) => {
    // Move tool dragging
    if (moveRef.current && tool === "move") {
      e.preventDefault();
      const point = getCanvasPoint(e);
      const { strokeIdx, lastPoint } = moveRef.current;
      const dx = point.x - lastPoint.x;
      const dy = point.y - lastPoint.y;
      if (dx === 0 && dy === 0) return;

      const updated = [...strokesRef.current];
      updated[strokeIdx] = offsetStrokePoints(updated[strokeIdx], dx, dy);
      strokesRef.current = updated;
      setStrokes(updated);
      moveRef.current.lastPoint = point;

      doRedraw(updated);
      drawSelectionHighlight(ctxRef.current, updated[strokeIdx]);
      return;
    }

    const d = drawingRef.current;
    if (!d || !ctxRef.current) return;
    e.preventDefault();

    const point = getCanvasPoint(e);

    // Line / shape / shift-line: preview by full redraw + overlay
    if (d.tool === "line" || d.tool === "shape" || d.isLine) {
      d.points = [d.startPoint, point];
      doRedraw(strokesRef.current);
      const ctx = ctxRef.current;
      ctx.save();
      applyStrokeStyle(ctx, d);
      if (d.tool === "shape") drawShape(ctx, d);
      else drawLinePath(ctx, d.startPoint, point);
      ctx.restore();
      return;
    }

    // Freehand: just append the segment — no full redraw needed
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
  }, [tool, doRedraw, drawSelectionHighlight]);

  const handlePointerUp = useCallback((e) => {
    // Move tool: finish dragging
    if (moveRef.current && tool === "move") {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (canvas) { try { canvas.releasePointerCapture(e.pointerId); } catch (_) {} }
      moveRef.current = null;
      markDirty();
      doRedraw(strokesRef.current);
      if (selectedIdx >= 0 && strokesRef.current[selectedIdx]) {
        drawSelectionHighlight(ctxRef.current, strokesRef.current[selectedIdx]);
      }
      return;
    }

    const d = drawingRef.current;
    if (!d) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) { try { canvas.releasePointerCapture(e.pointerId); } catch (_) {} }
    drawingRef.current = null;

    if (!d.points || d.points.length < 2) return;

    // Build final stroke
    let final;
    if (d.tool === "line" || d.tool === "shape" || d.isLine) {
      final = { ...d, points: [d.startPoint, d.points[d.points.length - 1]] };
    } else {
      // Keep ALL points — no simplification.
      // This guarantees the saved stroke looks identical to what was drawn live.
      final = { ...d };
    }
    delete final.startPoint;
    commitStroke(final);

    // For line/shape/shift-line we need a final redraw because the preview
    // was drawn on top of the existing canvas. For freehand we do NOT redraw
    // because the live lineTo segments are already the correct final render.
    if (d.tool === "line" || d.tool === "shape" || d.isLine) {
      doRedraw(strokesRef.current);
    }
  }, [tool, selectedIdx, commitStroke, doRedraw, markDirty, drawSelectionHighlight]);

  // ── Undo / Redo / Clear ──
  const handleUndo = useCallback(() => {
    if (strokesRef.current.length === 0) return;
    const last = strokesRef.current[strokesRef.current.length - 1];
    const updated = strokesRef.current.slice(0, -1);
    strokesRef.current = updated;
    setStrokes(updated);
    setRedoStack((rs) => [...rs, last]);
    doRedraw(updated);
    markDirty();
  }, [markDirty, doRedraw]);

  const handleRedo = useCallback(() => {
    setRedoStack((rs) => {
      if (rs.length === 0) return rs;
      const last = rs[rs.length - 1];
      const updated = [...strokesRef.current, last];
      strokesRef.current = updated;
      setStrokes(updated);
      doRedraw(updated);
      markDirty();
      return rs.slice(0, -1);
    });
  }, [markDirty, doRedraw]);

  const handleClear = useCallback(() => {
    if (strokesRef.current.length === 0) return;
    if (!confirm("Clear the entire canvas? This cannot be undone.")) return;
    strokesRef.current = [];
    setStrokes([]);
    setRedoStack([]);
    doRedraw([]);
    markDirty();
  }, [markDirty, doRedraw]);

  const getCursor = () => {
    if (tool === "move") return moveRef.current ? "grabbing" : "grab";
    if (tool === "eraser") return "cell";
    if (tool === "text") return "text";
    return "crosshair";
  };

  return (
    <div className="sketch-block">
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

      <div className="sketch-toolbar">
        <div className="sketch-toolbar-row">
          <div className="sketch-tool-group">
            {DRAW_TOOLS.map((t) => (
              <div key={t.id} style={{ position: "relative" }}>
                <button
                  className={`sketch-tool-btn ${tool === t.id ? "active" : ""}`}
                  onClick={() => {
                    if (textInput) commitText();
                    setTool(t.id);
                    if (t.id !== "move") { setSelectedIdx(-1); doRedraw(strokesRef.current); }
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
                {t.id === "shape" && showShapePicker && tool === "shape" && (
                  <div className="sketch-shape-picker">
                    {SHAPES.map((s) => (
                      <button key={s}
                        className={`sketch-shape-option ${activeShape === s ? "active" : ""}`}
                        onClick={(ev) => { ev.stopPropagation(); setActiveShape(s); setShowShapePicker(false); }}
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

          <div className="sketch-color-group">
            {COLORS.map((c) => (
              <button key={c}
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
              <input type="color" value={color}
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

          <div className="sketch-size-group">
            <span className="sketch-size-label">Size</span>
            <input type="range" min="1" max="20" value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="sketch-size-slider" />
            <span className="sketch-size-value">{brushSize}</span>
            <div className="sketch-size-preview" style={{
              width: Math.min(brushSize * 1.5, 20), height: Math.min(brushSize * 1.5, 20),
              background: tool === "eraser" ? "var(--text3)" : color,
              opacity: tool === "marker" ? 0.4 : 1,
            }} />
          </div>

          <div className="sketch-divider" />

          <div className="sketch-action-group">
            <button className="sketch-action-btn" onClick={handleUndo} disabled={strokes.length === 0} title="Undo">↩</button>
            <button className="sketch-action-btn" onClick={handleRedo} disabled={redoStack.length === 0} title="Redo">↪</button>
            <button className="sketch-action-btn sketch-clear-btn" onClick={handleClear} disabled={strokes.length === 0} title="Clear">🗑</button>
          </div>
        </div>
      </div>

      <div className="sketch-canvas-container" ref={containerRef} style={{ position: "relative" }}>
        <canvas ref={canvasRef} className="sketch-canvas"
          onClick={handleCanvasClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={(e) => { if (drawingRef.current) handlePointerUp(e); }}
          style={{ touchAction: "none", cursor: getCursor() }}
        />
        {textInput && (
          <div
            style={{ position: "absolute", left: textInput.x, top: textInput.y, zIndex: 20 }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <textarea ref={textRef} value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitText(); }
                if (e.key === "Escape") { setTextInput(null); setTextValue(""); }
              }}
              onBlur={commitText}
              placeholder="Type here..."
              style={{
                minWidth: 150, minHeight: 36, padding: "6px 8px",
                fontSize: Math.max(14, brushSize * 3) + "px",
                fontFamily: "inherit", color: color === "#ffffff" ? "#000000" : color,
                background: "rgba(255,255,255,0.95)",
                border: "2px solid var(--amber)", borderRadius: 6,
                outline: "none", resize: "both", lineHeight: 1.3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        )}
      </div>

      <div className="sketch-hint">
        {tool === "move" ? "Click a stroke to select, then drag to move it"
          : tool === "pen" || tool === "marker" ? "Hold Shift for straight line"
          : tool === "text" ? "Click to place text • Enter to confirm • Esc to cancel"
          : tool === "line" ? "Click and drag to draw a line"
          : tool === "shape" ? `Click and drag to draw ${activeShape}`
          : ""}
        {" • "}{strokes.length} stroke{strokes.length !== 1 ? "s" : ""} • Auto-saved
      </div>
    </div>
  );
}
