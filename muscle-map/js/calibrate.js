import { MUSCLES } from './content.js';

// Build a minimal UI overlaying the existing stage.
const ids = Object.keys(MUSCLES);
let view = 'front';
let current = ids[0];
const polys = {}; // id -> [[x,y],...]

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
  <button id="cal-clear">clear muscle</button>
  <button id="cal-export">export JSON</button>
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
bar.querySelector('#cal-undo').addEventListener('click', () => { (polys[current] || []).pop(); redraw(); });
bar.querySelector('#cal-clear').addEventListener('click', () => { polys[current] = []; redraw(); });
bar.querySelector('#cal-export').addEventListener('click', exportJson);

const overlay = document.getElementById('overlay');
overlay.addEventListener('click', (ev) => {
  const pt = toPoint(ev);
  if (!pt) return;
  (polys[current] ||= []).push([round(pt.x), round(pt.y)]);
  redraw();
});

function round(n) { return Math.round(n * 1000) / 1000; }

function toPoint(ev) {
  const img = document.getElementById('figure');
  const rect = overlay.getBoundingClientRect();
  const natural = img.naturalWidth / img.naturalHeight || 0.5;
  const boxRatio = rect.width / rect.height;
  let drawW, drawH;
  if (natural > boxRatio) { drawW = rect.width; drawH = rect.width / natural; }
  else { drawH = rect.height; drawW = rect.height * natural; }
  const offX = (rect.width - drawW) / 2, offY = (rect.height - drawH) / 2;
  const x = (ev.clientX - rect.left - offX) / drawW;
  const y = (ev.clientY - rect.top - offY) / drawH;
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}

function redraw() {
  const rect = overlay.getBoundingClientRect();
  overlay.width = rect.width; overlay.height = rect.height;
  const ctx = overlay.getContext('2d');
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  const img = document.getElementById('figure');
  const natural = img.naturalWidth / img.naturalHeight || 0.5;
  const boxRatio = rect.width / rect.height;
  let drawW, drawH;
  if (natural > boxRatio) { drawW = rect.width; drawH = rect.width / natural; }
  else { drawH = rect.height; drawW = rect.height * natural; }
  const offX = (rect.width - drawW) / 2, offY = (rect.height - drawH) / 2;
  const pts = polys[current] || [];
  ctx.fillStyle = 'rgba(56,189,248,0.4)';
  ctx.strokeStyle = '#38bdf8';
  ctx.beginPath();
  pts.forEach(([px, py], i) => {
    const cx = offX + px * drawW, cy = offY + py * drawH;
    i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
  });
  if (pts.length > 2) ctx.closePath();
  ctx.stroke();
  if (pts.length > 2) ctx.fill();
  bar.querySelector('#cal-status').textContent = `${current}: ${pts.length} pts`;
}

function exportJson() {
  const out = {};
  for (const id of ids) if ((polys[id] || []).length >= 3) out[id] = polys[id];
  const text = JSON.stringify(out, null, 2);
  navigator.clipboard?.writeText(text).catch(() => {});
  console.log(text);
  const blob = new Blob([text], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'hotspots.json'; a.click();
}

setMuscle(current);
