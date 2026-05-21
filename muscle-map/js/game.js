import { MUSCLES, TIERS } from './content.js';
import {
  createGame, applyResult, judgeClick, roundPoints,
  regionsOf, primaryView, ROUND_MS
} from './logic.js';

const content = { MUSCLES, TIERS };
const rng = Math.random;
const VIEWS = [{ id: 'front', label: 'Anterior' }, { id: 'back', label: 'Posterior' }];
const TIER_INFO = {
  easy:   { label: 'Easy',   ds: 'Major muscle groups' },
  medium: { label: 'Medium', ds: 'Adds finer groups' },
  hard:   { label: 'Hard',   ds: 'Full set, advanced names' }
};
const el = (id) => document.getElementById(id);

let selMode = 'lives';
let S = null;          // game state (from logic)
let view = 'front';
let bestStreak = 0;
let roundStart = 0;
let timerId = null;
let locked = false;

// ---------------- start screen ----------------
function hsKey(mode, tier) { return `myoid_hs_${mode}_${tier}`; }
function getHS(mode, tier) { const v = +localStorage.getItem(hsKey(mode, tier)); return isFinite(v) ? v : 0; }
function setHS(mode, tier, v) { try { localStorage.setItem(hsKey(mode, tier), v); } catch (e) {} }

function buildStart() {
  const seg = el('modeSeg');
  seg.querySelectorAll('.seg').forEach((b) =>
    b.classList.toggle('on', b.dataset.mode === selMode));
  const wrap = el('tierCards'); wrap.innerHTML = '';
  ['easy', 'medium', 'hard'].forEach((tier) => {
    const n = TIERS[tier].length;
    const hs = getHS(selMode, tier);
    const btn = document.createElement('button');
    btn.className = 'tier';
    btn.innerHTML = `<div class="nm">${TIER_INFO[tier].label}</div>
      <div class="ct">${n} muscles</div>
      <div class="ds">${TIER_INFO[tier].ds}</div>
      <div class="hs">BEST &nbsp;<b>${hs ? hs.toLocaleString() : '—'}</b></div>`;
    btn.onclick = () => startGame(tier);
    wrap.appendChild(btn);
  });
}
el('modeSeg').addEventListener('click', (e) => {
  const b = e.target.closest('[data-mode]'); if (!b) return;
  selMode = b.dataset.mode; buildStart();
});

// ---------------- game flow ----------------
function startGame(tier) {
  S = createGame({ mode: selMode, tier, content, rng });
  bestStreak = 0;
  locked = false;
  view = primaryView(MUSCLES[S.current]);
  el('start').classList.remove('show');
  el('game').style.display = 'block';
  el('end').classList.remove('show');
  el('tierPill').textContent = `${TIER_INFO[tier].label} · ${selMode === 'lives' ? 'Lives' : 'Timed'}`;
  el('livesStat').style.display = selMode === 'lives' ? '' : 'none';
  buildTabs();
  renderQuestion();
  syncStats();
}

function buildTabs() {
  const tabs = el('tabs'); tabs.innerHTML = '';
  VIEWS.forEach((v) => {
    const b = document.createElement('button');
    b.className = 'tab' + (v.id === view ? ' on' : '');
    b.dataset.v = v.id; b.textContent = v.label;
    b.onclick = () => { if (!locked) setView(v.id); };
    tabs.appendChild(b);
  });
}
function setView(v) {
  view = v;
  el('figure').src = `assets/${v}.png`;
  el('viewname').textContent = VIEWS.find((x) => x.id === v).label;
  document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
  clearOverlay();
}

function renderQuestion() {
  locked = false;
  const m = MUSCLES[S.current];
  el('target').textContent = m.name;
  setFB('', '');
  flash('', '');
  // open on a view where this muscle exists
  if (!regionsOf(m).some((r) => r.view === view)) setView(primaryView(m));
  else clearOverlay();
  startRound();
}

// ---- per-round countdown ----
function startRound() {
  stopTimer();
  roundStart = performance.now();
  tick();
  timerId = setInterval(tick, 60);
}
function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }
function elapsed() { return performance.now() - roundStart; }
function tick() {
  const left = Math.max(0, ROUND_MS - elapsed());
  const frac = left / ROUND_MS;
  const fill = el('roundFill');
  fill.style.width = (frac * 100) + '%';
  const sec = el('roundSec');
  sec.textContent = (left / 1000).toFixed(1);
  const cls = frac < 0.2 ? 'crit' : frac < 0.45 ? 'warn' : '';
  fill.className = cls; sec.className = 'round-sec ' + cls;
  if (left <= 0 && !locked) timeUp();
}

// ---- clicks ----
el('overlay').addEventListener('click', onClick);
function onClick(ev) {
  if (locked || !S || S.status !== 'playing') return;
  const p = toPoint(ev);
  if (!p) return;
  const r = judgeClick(p, view, S.current, TIERS[S.tier], content);
  if (r.result === 'empty') return;            // exploration on a view without the target
  if (r.result === 'correct') return resolve('correct', r);
  return resolve('wrong', r);
}
function timeUp() { if (!locked) resolve('timeout', null); }
function skip() { if (!locked && S && S.status === 'playing') resolve('timeout', null, true); }

function resolve(result, hit, skipped) {
  locked = true;
  stopTimer();
  const m = MUSCLES[S.current];
  if (result === 'correct') {
    const pts = roundPoints(Math.min(elapsed(), ROUND_MS));
    drawRegions(m, view, 'rgba(52,211,153,.34)');         // green
    flash('good', '✓ Correct');
    setFB('good', `✓ ${m.name}  +${pts}`);
    S = applyResult(S, 'correct', pts);
  } else {
    // reveal the correct muscle (switch view if needed)
    if (!regionsOf(m).some((r) => r.view === view)) setView(primaryView(m));
    if (result === 'wrong' && hit && hit.hitId && MUSCLES[hit.hitId]) {
      drawRegions(MUSCLES[hit.hitId], view, 'rgba(251,113,133,.30)'); // red wrong
    }
    drawRegions(m, view, 'rgba(34,211,238,.30)');          // cyan reveal
    flash('bad', skipped ? '↷ Skipped' : result === 'timeout' ? '⏱ Time' : '✗ Miss');
    setFB('cy', `${skipped ? 'Skipped' : "This is the"} ${m.name}`);
    S = applyResult(S, result, 0);
  }
  bestStreak = Math.max(bestStreak, S.streak);
  syncStats();
  setTimeout(advance, result === 'correct' ? 750 : 1400);
}

function advance() {
  clearOverlay();
  if (S.status === 'over') return finish();
  view = primaryView(MUSCLES[S.current]);
  buildTabs();
  setView(view);
  renderQuestion();
  syncStats();
}

// ---- overlay drawing (image-normalized coords; imgwrap matches image ratio) ----
function rectOf() { return el('overlay').getBoundingClientRect(); }
function toPoint(ev) {
  const r = rectOf();
  if (r.width === 0) return null;
  const x = (ev.clientX - r.left) / r.width;
  const y = (ev.clientY - r.top) / r.height;
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}
function drawRegions(muscle, v, fill) {
  const cvs = el('overlay'); const r = rectOf();
  cvs.width = r.width; cvs.height = r.height;
  const ctx = cvs.getContext('2d');
  for (const reg of regionsOf(muscle)) {
    if (reg.view !== v) continue;
    ctx.beginPath();
    reg.poly.forEach(([px, py], i) => {
      const cx = px * r.width, cy = py * r.height;
      i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
    });
    ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = 'rgba(232,238,246,.5)'; ctx.lineWidth = 1; ctx.stroke();
  }
}
function clearOverlay() {
  const cvs = el('overlay'); const r = rectOf();
  cvs.width = r.width; cvs.height = r.height;
  cvs.getContext('2d').clearRect(0, 0, cvs.width, cvs.height);
}

// ---- ui sync ----
function setFB(cls, txt) { const f = el('fb'); f.className = 'fb ' + cls; f.textContent = txt; }
function flash(cls, txt) {
  const f = el('fbflash');
  if (!txt) { f.className = 'fbflash'; f.textContent = ''; return; }
  f.textContent = txt; f.className = 'fbflash show ' + cls;
}
function syncStats() {
  el('score').textContent = S.score.toLocaleString();
  if (S.mode === 'lives') el('lives').textContent = '♥'.repeat(Math.max(0, S.lives)) + '♡'.repeat(Math.max(0, 3 - S.lives));
  el('prog').textContent = `${S.pos}/${S.total}`;
  el('streak').textContent = S.streak;
  el('bar').style.width = (S.pos / S.total * 100) + '%';
  el('nCorrect').textContent = S.correct;
  el('nWrong').textContent = S.wrong;
  el('bestStreak').textContent = bestStreak;
}

function finish() {
  stopTimer();
  el('bar').style.width = '100%';
  const answered = S.correct + S.wrong || 1;
  const pct = Math.round(S.correct / answered * 100);
  let g = 'D'; if (pct >= 95) g = 'S'; else if (pct >= 85) g = 'A'; else if (pct >= 70) g = 'B'; else if (pct >= 55) g = 'C';
  el('grade').textContent = g;
  el('endPct').textContent = `${pct}%  ·  ${S.correct}/${S.total} correct  ·  ${S.score.toLocaleString()} pts`;
  let best = getHS(S.mode, S.tier), badge = '';
  if (S.score > best) { setHS(S.mode, S.tier, S.score); badge = ' · NEW BEST'; }
  el('endSub').textContent = `${TIER_INFO[S.tier].label} · ${S.mode === 'lives' ? 'Lives' : 'Timed'} complete${badge}`;
  const box = el('missedBox');
  const names = [...new Set(S.missed)].map((id) => MUSCLES[id].name);
  if (names.length === 0) {
    box.innerHTML = `<div class="mh">Missed muscles</div><div class="none">Perfect — every muscle identified.</div>`;
  } else {
    box.innerHTML = `<div class="mh">Review — ${names.length} missed</div>` +
      names.map((n) => `<div class="mi">${n}<span>review</span></div>`).join('');
  }
  el('end').classList.add('show');
}

// ---- buttons ----
el('skipBtn').onclick = skip;
el('quitBtn').onclick = toStart;
el('retryBtn').onclick = () => startGame(S.tier);
el('changeBtn').onclick = toStart;
function toStart() {
  stopTimer();
  el('end').classList.remove('show');
  el('game').style.display = 'none';
  buildStart();
  el('start').classList.add('show');
}

// keyboard: 1/2 switch views, S skips
document.addEventListener('keydown', (e) => {
  if (el('game').style.display === 'none') return;
  if (e.key.toLowerCase() === 's') { skip(); return; }
  if (e.key === '1' && !locked) setView('front');
  if (e.key === '2' && !locked) setView('back');
});

buildStart();
