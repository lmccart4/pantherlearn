import { MUSCLES, TIERS } from './content.js';
import { createGame, applyResult, judgeClick, isTimeUp, regionsOf } from './logic.js';

const content = { MUSCLES, TIERS };
const rng = Math.random;

const el = (id) => document.getElementById(id);
const screens = { landing: el('landing'), game: el('game'), results: el('results') };
function show(name) {
  for (const k of Object.keys(screens)) screens[k].classList.toggle('active', k === name);
}

let selTier = 'easy';
let selMode = 'lives';
let view = 'front';
let state = null;
let startMs = 0;
let timerId = null;
let locked = false; // brief input lock during feedback

// ---- Landing pickers ----
el('tier-pills').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tier]'); if (!b) return;
  selTier = b.dataset.tier;
  [...el('tier-pills').children].forEach((c) => c.classList.toggle('active', c === b));
});
el('mode-pills').addEventListener('click', (e) => {
  const b = e.target.closest('[data-mode]'); if (!b) return;
  selMode = b.dataset.mode;
  [...el('mode-pills').children].forEach((c) => c.classList.toggle('active', c === b));
});
el('start-btn').addEventListener('click', startGame);
el('replay-btn').addEventListener('click', startGame);
el('home-btn').addEventListener('click', () => { stopTimer(); show('landing'); });

// ---- View toggle ----
document.querySelectorAll('.view-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    view = btn.dataset.view;
    document.querySelectorAll('.view-btn').forEach((b) => b.classList.toggle('active', b === btn));
    renderFigure();
  });
});

// ---- Click handling on overlay ----
el('overlay').addEventListener('click', onStageClick);

function startGame() {
  state = createGame({ mode: selMode, tier: selTier, content, rng, duration: 60 });
  view = MUSCLES[state.current].view;
  locked = false;
  syncViewButtons();
  show('game');
  renderFigure();
  renderHud();
  if (state.mode === 'timed') startTimer();
}

function startTimer() {
  startMs = Date.now();
  stopTimer();
  timerId = setInterval(() => {
    if (isTimeUp(state, Date.now() - startMs)) { endGame(); return; }
    renderHud();
  }, 250);
}
function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }

function renderFigure() {
  el('figure').src = `assets/${view}.png`;
}
function syncViewButtons() {
  document.querySelectorAll('.view-btn').forEach((b) =>
    b.classList.toggle('active', b.dataset.view === view));
}

function renderHud() {
  const m = MUSCLES[state.current];
  el('hud-prompt').innerHTML = `Find the <span class="accent">${m.name}</span>`;
  if (state.mode === 'lives') {
    el('hud-left').textContent = '♥'.repeat(state.lives) + '♡'.repeat(3 - state.lives);
    el('hud-right').textContent = `${state.score} pts`;
  } else {
    const left = Math.max(0, state.duration - Math.floor((Date.now() - startMs) / 1000));
    el('hud-left').textContent = `${state.score} pts`;
    el('hud-right').textContent = `0:${String(left).padStart(2, '0')}`;
  }
}

function onStageClick(ev) {
  if (locked || !state || state.status !== 'playing') return;
  const rect = el('overlay').getBoundingClientRect();
  // Account for object-fit: contain letterboxing — figure is centered in the stage.
  const point = toFigurePoint(ev, rect);
  if (!point) return; // clicked the letterbox margin
  const result = judgeClick(point, view, state.current, TIERS[state.tier], content);
  if (result.result === 'empty') return; // no penalty, no advance

  flashFeedback(result.result);
  if (result.result === 'wrong') revealCorrect();

  locked = true;
  setTimeout(() => {
    state = applyResult(state, result.result, rng);
    clearOverlay();
    if (state.status === 'over') { endGame(); return; }
    view = MUSCLES[state.current].view;
    syncViewButtons();
    renderFigure();
    renderHud();
    locked = false;
  }, result.result === 'wrong' ? 900 : 450);
}

// Map a click to normalized figure coords, honoring object-fit: contain.
function toFigurePoint(ev, rect) {
  const img = el('figure');
  const natural = img.naturalWidth / img.naturalHeight || 0.5;
  const boxRatio = rect.width / rect.height;
  let drawW, drawH, offX, offY;
  if (natural > boxRatio) { drawW = rect.width; drawH = rect.width / natural; }
  else { drawH = rect.height; drawW = rect.height * natural; }
  offX = (rect.width - drawW) / 2;
  offY = (rect.height - drawH) / 2;
  const x = (ev.clientX - rect.left - offX) / drawW;
  const y = (ev.clientY - rect.top - offY) / drawH;
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}

function flashFeedback(kind) {
  const f = el('feedback');
  f.textContent = kind === 'correct' ? '✓ Correct' : '✗ Not quite';
  f.className = `feedback show ${kind}`;
  setTimeout(() => { f.className = 'feedback'; }, 800);
}

function revealCorrect() {
  const m = MUSCLES[state.current];
  if (m.view !== view) { // switch to the right view so the reveal is visible
    view = m.view; syncViewButtons(); renderFigure();
  }
  for (const poly of regionsOf(m)) drawPolygon(poly, 'rgba(56,189,248,0.45)');
}

function drawPolygon(poly, fill) {
  const cvs = el('overlay');
  const rect = cvs.getBoundingClientRect();
  cvs.width = rect.width; cvs.height = rect.height;
  const img = el('figure');
  const natural = img.naturalWidth / img.naturalHeight || 0.5;
  const boxRatio = rect.width / rect.height;
  let drawW, drawH;
  if (natural > boxRatio) { drawW = rect.width; drawH = rect.width / natural; }
  else { drawH = rect.height; drawW = rect.height * natural; }
  const offX = (rect.width - drawW) / 2;
  const offY = (rect.height - drawH) / 2;
  const ctx = cvs.getContext('2d');
  ctx.beginPath();
  poly.forEach(([px, py], i) => {
    const cx = offX + px * drawW, cy = offY + py * drawH;
    i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
  });
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}
function clearOverlay() {
  const cvs = el('overlay');
  cvs.getContext('2d').clearRect(0, 0, cvs.width, cvs.height);
}

function endGame() {
  stopTimer();
  const attempts = state.score + state.missed.length;
  const acc = attempts ? Math.round((state.score / attempts) * 100) : 0;
  el('result-score').textContent = `${state.score}`;
  el('result-accuracy').textContent =
    `${state.score} correct · ${acc}% accuracy` +
    (state.mode === 'lives' ? '' : ' · Timed');
  const missedNames = [...new Set(state.missed)].map((id) => MUSCLES[id].name);
  el('result-missed').innerHTML = missedNames.length
    ? `<strong>Review:</strong> ${missedNames.join(', ')}`
    : `Perfect — no misses!`;
  show('results');
}
