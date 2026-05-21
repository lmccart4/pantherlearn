import { MUSCLES } from './content.js';
import { regionsOf } from './logic.js';

// Hotspot calibration tool (loaded via ?calibrate). Trace each muscle's region(s)
// by clicking points around it. A muscle can have MULTIPLE regions (e.g. left +
// right boxes for an asymmetric figure) — use "new region" to start another box.
// Shapes can be any polygon (concave/odd OK). Current shapes load as a starting
// point; other targets on the view show faintly. Export writes the FULL set as
// { id: [ [ [x,y]... ], ... ] }.

const ids = Object.keys(MUSCLES);
let view = 'front';
let current = ids[0];

// polys[id] = array of regions; each region = array of [x,y] points. Seeded from content.
const polys = {};
for (const id of ids) polys[id] = regionsOf(MUSCLES[id]).map((reg) => reg.map(([x, y]) => [x, y]));
let cur = 0; // index of the region currently being edited

const game = document.getElementById('game');
document.getElementById('landing').classList.remove('active');
game.classList.add('active');
document.getElementById('hud-prompt').textContent = 'CALIBRATE';

const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#111c30;padding:8px;display:flex;gap:8px;flex-wrap:wrap;z-index:10;font:12px system-ui;color:#e2e8f0;align-items:center;';
bar.innerHTML = `
  <select id="cal-muscle"></select>
  <button id="cal-view">view: front</button>
  <button id="cal-newregion">+ region</button>
  <button id="cal-undo">undo pt</button>
  <button id="cal-clear">clear muscle</button>
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
  if (polys[id].length === 0) polys[id] = [[]];
  cur = polys[id].length - 1;
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
bar.querySelector('#cal-newregion').addEventListener('click', () => {
  if (polys[current][cur] && polys[current][cur].length >= 3) {
    polys[current].push([]); cur = polys[current].length - 1; redraw();
  }
});
bar.querySelector('#cal-undo').addEventListener('click', () => {
  const reg = polys[current][cur]; if (!reg) return;
  reg.pop();
  if (reg.length === 0 && polys[current].length > 1) { polys[current].splice(cur, 1); cur = polys[current].length - 1; }
  redraw();
});
bar.querySelector('#cal-clear').addEventListener('click', () => { polys[current] = [[]]; cur = 0; redraw(); });
bar.querySelector('#cal-export').addEventListener('click', exportJson);
bar.querySelector('#cal-others').addEventListener('change', redraw);

const overlay = document.getElementById('overlay');
overlay.addEventListener('click', (ev) => {
  const pt = toPoint(ev);
  if (!pt) return;
  polys[current][cur].push([round(pt.x), round(pt.y)]);
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
      for (const reg of polys[id]) {
        if (reg.length < 3) continue;
        tracePath(ctx, reg, f); ctx.closePath();
        ctx.fillStyle = 'rgba(148,163,184,0.12)'; ctx.fill();
        ctx.strokeStyle = 'rgba(148,163,184,0.5)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
  }

  // Current muscle's regions; the active region is brightest with vertex handles.
  polys[current].forEach((reg, idx) => {
    tracePath(ctx, reg, f);
    if (reg.length > 2) ctx.closePath();
    const active = idx === cur;
    ctx.fillStyle = active ? 'rgba(56,189,248,0.35)' : 'rgba(56,189,248,0.18)';
    if (reg.length > 2) ctx.fill();
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = active ? 2 : 1; ctx.stroke();
    if (active) {
      ctx.fillStyle = '#38bdf8';
      for (const [px, py] of reg) {
        ctx.beginPath();
        ctx.arc(f.ox + px * f.dw, f.oy + py * f.dh, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  const n = polys[current].length;
  bar.querySelector('#cal-status').textContent =
    `${current}: region ${cur + 1}/${n} (${polys[current][cur].length} pts)`;
}

function exportJson() {
  const out = {};
  for (const id of ids) {
    const regs = polys[id].filter((r) => r.length >= 3);
    if (regs.length) out[id] = regs;
  }
  const text = JSON.stringify(out);
  navigator.clipboard?.writeText(text).catch(() => {});
  console.log(text);
  const blob = new Blob([text], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'hotspots.json'; a.click();
}

setMuscle(current);
