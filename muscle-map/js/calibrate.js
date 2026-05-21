import { MUSCLES } from './content.js';

// Hotspot calibration tool (loaded via ?calibrate). Trace each muscle's region by
// clicking points around it. Shapes can be any polygon (concave/odd shapes OK).
// Current shapes are loaded as a starting point and all other targets on the view
// are shown faintly so you can see overlaps/layering. Export writes the FULL set.

const ids = Object.keys(MUSCLES);
let view = 'front';
let current = ids[0];

// Seed from existing polygons so you edit rather than start blank.
const polys = {};
for (const id of ids) polys[id] = (MUSCLES[id].polygon || []).map(([x, y]) => [x, y]);

const game = document.getElementById('game');
document.getElementById('landing').classList.remove('active');
game.classList.add('active');
document.getElementById('hud-prompt').textContent = 'CALIBRATE';

const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#111c30;padding:8px;display:flex;gap:8px;flex-wrap:wrap;z-index:10;font:12px system-ui;color:#e2e8f0;align-items:center;';
bar.innerHTML = `
  <select id="cal-muscle"></select>
  <button id="cal-view">view: front</button>
  <button id="cal-undo">undo pt</button>
  <button id="cal-clear">clear (redraw)</button>
  <button id="cal-export">export JSON</button>
  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" id="cal-others" checked> show others</label>
  <span id="cal-status"></span>`;
document.body.appendChild(bar);

const sel = bar.querySelector('#cal-muscle');
ids.forEach((id) => {
  const o = document.createElement('option');
  o.value = id; o.textContent = `${id} (${MUSCLES[id].view})`;
  sel.appendChild(o);
});

function setMuscle(id) {
  current = id; view = MUSCLES[id].view;
  bar.querySelector('#cal-view').textContent = `view: ${view}`;
  document.getElementById('figure').src = `assets/${view}.png`;
  redraw();
}
sel.addEventListener('change', () => setMuscle(sel.value));
bar.querySelector('#cal-view').addEventListener('click', () => {
  view = view === 'front' ? 'back' : 'front';
  bar.querySelector('#cal-view').textContent = `view: ${view}`;
  document.getElementById('figure').src = `assets/${view}.png`;
  redraw();
});
bar.querySelector('#cal-undo').addEventListener('click', () => { polys[current].pop(); redraw(); });
bar.querySelector('#cal-clear').addEventListener('click', () => { polys[current] = []; redraw(); });
bar.querySelector('#cal-export').addEventListener('click', exportJson);
bar.querySelector('#cal-others').addEventListener('change', redraw);

const overlay = document.getElementById('overlay');
overlay.addEventListener('click', (ev) => {
  const pt = toPoint(ev);
  if (!pt) return;
  polys[current].push([round(pt.x), round(pt.y)]);
  redraw();
});

function round(n) { return Math.round(n * 1000) / 1000; }

function fit() {
  const img = document.getElementById('figure');
  const rect = overlay.getBoundingClientRect();
  const natural = img.naturalWidth / img.naturalHeight || 0.5;
  const boxRatio = rect.width / rect.height;
  let dw, dh;
  if (natural > boxRatio) { dw = rect.width; dh = rect.width / natural; }
  else { dh = rect.height; dw = rect.height * natural; }
  return { rect, dw, dh, ox: (rect.width - dw) / 2, oy: (rect.height - dh) / 2 };
}

function toPoint(ev) {
  const { rect, dw, dh, ox, oy } = fit();
  const x = (ev.clientX - rect.left - ox) / dw;
  const y = (ev.clientY - rect.top - oy) / dh;
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}

function tracePath(ctx, pts, f) {
  ctx.beginPath();
  pts.forEach(([px, py], i) => {
    const cx = f.ox + px * f.dw, cy = f.oy + py * f.dh;
    i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
  });
}

function redraw() {
  const f = fit();
  overlay.width = f.rect.width; overlay.height = f.rect.height;
  const ctx = overlay.getContext('2d');
  ctx.clearRect(0, 0, overlay.width, overlay.height);

  // Other targets on this view, faint.
  if (bar.querySelector('#cal-others').checked) {
    for (const id of ids) {
      if (id === current || MUSCLES[id].view !== view) continue;
      const pts = polys[id]; if (pts.length < 3) continue;
      tracePath(ctx, pts, f); ctx.closePath();
      ctx.fillStyle = 'rgba(148,163,184,0.12)'; ctx.fill();
      ctx.strokeStyle = 'rgba(148,163,184,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    }
  }

  // Current target, bright, with vertex handles.
  const pts = polys[current];
  tracePath(ctx, pts, f);
  if (pts.length > 2) ctx.closePath();
  ctx.fillStyle = 'rgba(56,189,248,0.35)'; if (pts.length > 2) ctx.fill();
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  for (const [px, py] of pts) {
    ctx.beginPath();
    ctx.arc(f.ox + px * f.dw, f.oy + py * f.dh, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  bar.querySelector('#cal-status').textContent = `${current}: ${pts.length} pts`;
}

function exportJson() {
  const out = {};
  for (const id of ids) if (polys[id].length >= 3) out[id] = polys[id];
  const text = JSON.stringify(out, null, 2);
  navigator.clipboard?.writeText(text).catch(() => {});
  console.log(text);
  const blob = new Blob([text], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'hotspots.json'; a.click();
}

setMuscle(current);
