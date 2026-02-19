// src/components/AnnotationOverlay.jsx
// Site-wide annotation overlay — transparent drawing layer on top of lesson pages.
// Students can draw/annotate anywhere on the page in various pen colors.
// Annotations persist per-lesson to Firestore.

import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import useAutoSave from "../hooks/useAutoSave";

const COLORS = [
  "#ef4444", // red
  "#f59e0b", // amber
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#ffffff", // white
  "#22d3ee", // cyan
];

// ── Drawing helpers ──

function applyStrokeStyle(ctx, stroke) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = stroke.size || 3;
  if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke.color || "#ef4444";
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

function drawStroke(ctx, stroke) {
  if (!ctx || !stroke?.points) return;
  ctx.save();
  applyStrokeStyle(ctx, stroke);
  drawFreehandPath(ctx, stroke.points);
  ctx.restore();
}

function redrawCanvas(ctx, strokeList, width, height) {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, width || 16384, height || 16384);
  ctx.restore();
  for (const stroke of strokeList) drawStroke(ctx, stroke);
}

// ── Component ──

export default function AnnotationOverlay() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  // Parse lesson route
  const match = pathname.match(/^\/course\/([^/]+)\/lesson\/([^/]+)/);
  const courseId = match?.[1];
  const lessonId = match?.[2];

  // Core state
  const [active, setActive] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#ef4444");
  const [brushSize, setBrushSize] = useState(3);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [loaded, setLoaded] = useState(false);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const strokesRef = useRef([]);
  const drawingRef = useRef(null);
  const scrollRef = useRef({ x: 0, y: 0 });
  const dprRef = useRef(window.devicePixelRatio || 1);
  const activeRef = useRef(false);
  const lessonKeyRef = useRef("");

  useEffect(() => { strokesRef.current = strokes; }, [strokes]);
  useEffect(() => { activeRef.current = active; }, [active]);

  // ── Persistence ──

  const performSave = useCallback(() => {
    if (!user || !courseId || !lessonId) return;
    const ref = doc(db, "progress", user.uid, "courses", courseId, "lessons", lessonId);
    setDoc(ref, {
      annotations: { strokes: strokesRef.current, savedAt: new Date().toISOString() },
    }, { merge: true });
  }, [user, courseId, lessonId]);

  const { markDirty, saveNow } = useAutoSave(performSave, { delay: 3000 });

  // Load annotations when lesson changes
  useEffect(() => {
    const key = `${courseId}/${lessonId}`;
    if (!user || !courseId || !lessonId) {
      strokesRef.current = [];
      setStrokes([]);
      setRedoStack([]);
      setLoaded(false);
      lessonKeyRef.current = "";
      return;
    }
    if (key === lessonKeyRef.current) return;
    lessonKeyRef.current = key;

    (async () => {
      try {
        const ref = doc(db, "progress", user.uid, "courses", courseId, "lessons", lessonId);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().annotations?.strokes) {
          const saved = snap.data().annotations.strokes;
          strokesRef.current = saved;
          setStrokes(saved);
        } else {
          strokesRef.current = [];
          setStrokes([]);
        }
        setRedoStack([]);
        setLoaded(true);
      } catch (e) {
        console.warn("Failed to load annotations:", e);
        setLoaded(true);
      }
    })();
  }, [user, courseId, lessonId]);

  // ── Canvas sizing ──

  useEffect(() => {
    if (!active) return;
    const update = () => {
      const w = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      const h = Math.min(Math.max(document.documentElement.scrollHeight, window.innerHeight), 16384);
      setCanvasSize({ width: w, height: h });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    window.addEventListener("resize", update);
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, [active]);

  // ── Canvas init ──

  useEffect(() => {
    if (!active || !canvasSize.width || !canvasSize.height) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;

    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;

    redrawCanvas(ctx, strokesRef.current, canvasSize.width, canvasSize.height);
  }, [active, canvasSize]);

  // ── Scroll tracking ──

  useEffect(() => {
    if (!active) return;
    const onScroll = () => {
      scrollRef.current = { x: window.scrollX, y: window.scrollY };
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.transform = `translate(${-window.scrollX}px, ${-window.scrollY}px)`;
      }
    };
    onScroll(); // sync on activate
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  // ── Keyboard shortcuts ──

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "Escape") { setActive(false); saveNow(); return; }
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if (mod && e.key === "z" && e.shiftKey) { e.preventDefault(); handleRedo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // ── Coordinate helper ──

  function getDocPoint(e) {
    return { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY };
  }

  // ── Commit stroke ──

  const commitStroke = useCallback((s) => {
    const updated = [...strokesRef.current, s];
    strokesRef.current = updated;
    setStrokes(updated);
    setRedoStack([]);
    markDirty();
  }, [markDirty]);

  // ── Pointer handlers ──

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const point = getDocPoint(e);
    const size = tool === "eraser" ? Math.max(brushSize * 3, 15) : brushSize;

    drawingRef.current = {
      points: [point],
      color: tool === "eraser" ? "#ffffff" : color,
      size, tool, opacity: 1,
    };
  }, [tool, color, brushSize]);

  const handlePointerMove = useCallback((e) => {
    const d = drawingRef.current;
    if (!d || !ctxRef.current) return;
    e.preventDefault();

    const point = getDocPoint(e);
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
  }, []);

  const handlePointerUp = useCallback((e) => {
    const d = drawingRef.current;
    if (!d) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) { try { canvas.releasePointerCapture(e.pointerId); } catch (_) {} }
    drawingRef.current = null;

    if (!d.points || d.points.length < 2) return;
    commitStroke(d);
  }, [commitStroke]);

  // ── Wheel → scroll passthrough ──

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    window.scrollBy(e.deltaX, e.deltaY);
  }, []);

  // ── Undo / Redo / Clear ──

  const handleUndo = useCallback(() => {
    if (strokesRef.current.length === 0) return;
    const last = strokesRef.current[strokesRef.current.length - 1];
    const updated = strokesRef.current.slice(0, -1);
    strokesRef.current = updated;
    setStrokes(updated);
    setRedoStack((rs) => [...rs, last]);
    redrawCanvas(ctxRef.current, updated, canvasSize.width, canvasSize.height);
    markDirty();
  }, [markDirty, canvasSize]);

  const handleRedo = useCallback(() => {
    setRedoStack((rs) => {
      if (rs.length === 0) return rs;
      const last = rs[rs.length - 1];
      const updated = [...strokesRef.current, last];
      strokesRef.current = updated;
      setStrokes(updated);
      redrawCanvas(ctxRef.current, updated, canvasSize.width, canvasSize.height);
      markDirty();
      return rs.slice(0, -1);
    });
  }, [markDirty, canvasSize]);

  const handleClear = useCallback(() => {
    if (strokesRef.current.length === 0) return;
    if (!confirm("Clear all annotations? This cannot be undone.")) return;
    strokesRef.current = [];
    setStrokes([]);
    setRedoStack([]);
    redrawCanvas(ctxRef.current, [], canvasSize.width, canvasSize.height);
    markDirty();
  }, [markDirty, canvasSize]);

  // ── Toggle ──

  const toggle = useCallback(() => {
    if (active) saveNow();
    setActive((a) => !a);
  }, [active, saveNow]);

  // Deactivate when navigating away from lesson
  useEffect(() => {
    if (!courseId || !lessonId) setActive(false);
  }, [courseId, lessonId]);

  // Don't render if not on a lesson page or not logged in
  if (!user || !courseId || !lessonId) return null;

  return (
    <>
      {/* FAB button */}
      <button
        className={`annotation-fab ${active ? "active" : ""}`}
        onClick={toggle}
        title={active ? "Close annotations" : "Annotate this page"}
      >
        {active ? "✕" : "🖊"}
      </button>

      {/* Overlay + Canvas */}
      {active && (
        <>
          <div
            className="annotation-overlay"
            onWheel={handleWheel}
          >
            <canvas
              ref={canvasRef}
              className="annotation-canvas"
              style={{
                width: canvasSize.width,
                height: canvasSize.height,
                touchAction: "none",
                cursor: tool === "eraser" ? "cell" : "crosshair",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={(e) => { if (drawingRef.current) handlePointerUp(e); }}
            />
          </div>

          {/* Toolbar */}
          <div className="annotation-toolbar">
            {/* Colors */}
            <div className="annotation-colors">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`annotation-color-btn ${color === c && tool !== "eraser" ? "active" : ""}`}
                  onClick={() => { setColor(c); setTool("pen"); }}
                  style={{
                    background: c,
                    border: c === "#ffffff"
                      ? "2px solid rgba(255,255,255,0.4)"
                      : color === c && tool !== "eraser"
                        ? `2.5px solid ${c}`
                        : "2px solid transparent",
                    boxShadow: color === c && tool !== "eraser"
                      ? `0 0 10px ${c}88`
                      : "none",
                  }}
                />
              ))}
            </div>

            <div className="annotation-sep" />

            {/* Brush size */}
            <div className="annotation-size">
              <input
                type="range" min="1" max="20" value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="annotation-size-slider"
              />
              <div className="annotation-size-dot" style={{
                width: Math.min(brushSize * 1.5, 20),
                height: Math.min(brushSize * 1.5, 20),
                background: tool === "eraser" ? "var(--text3)" : color,
              }} />
            </div>

            <div className="annotation-sep" />

            {/* Tools */}
            <button
              className={`annotation-tool-btn ${tool === "pen" ? "active" : ""}`}
              onClick={() => setTool("pen")}
              title="Pen"
            >✏️</button>
            <button
              className={`annotation-tool-btn ${tool === "eraser" ? "active" : ""}`}
              onClick={() => setTool("eraser")}
              title="Eraser"
            >◻️</button>

            <div className="annotation-sep" />

            {/* Actions */}
            <button className="annotation-action-btn" onClick={handleUndo} disabled={strokes.length === 0} title="Undo">↩</button>
            <button className="annotation-action-btn" onClick={handleRedo} disabled={redoStack.length === 0} title="Redo">↪</button>
            <button className="annotation-action-btn annotation-clear" onClick={handleClear} disabled={strokes.length === 0} title="Clear all">🗑</button>

            <div className="annotation-sep" />

            {/* Close */}
            <button className="annotation-close-btn" onClick={toggle} title="Close annotations">✕</button>
          </div>
        </>
      )}

      {/* Show stroke count badge on FAB when inactive but has annotations */}
      {!active && strokes.length > 0 && (
        <span className="annotation-badge">{strokes.length}</span>
      )}
    </>
  );
}
