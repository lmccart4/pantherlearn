import { MUSCLES, MUSCLE_IDS } from './content.js';
import {
  createGame, applyResult, judgeClick, roundPoints,
  regionsOf, primaryView, ROUND_MS
} from './logic.js';

const content = { MUSCLES, MUSCLE_IDS };
const rng = Math.random;
const VIEWS = [{ id: 'front', label: 'Anterior' }, { id: 'back', label: 'Posterior' }];
const el = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

let selMode = 'lives';
let S = null;
let view = 'front';
let bestStreak = 0;
let roundStart = 0;
let timerId = null;
let locked = false;
let playerName = '';
let playerPeriod = 0;

// leaderboard module loads lazily so a CDN/offline failure can't break the game
let LB;
async function getLB() {
  if (LB === undefined) { try { LB = await import('./leaderboard.js'); } catch (e) { LB = false; } }
  return LB || null;
}

// ---------------- identity + high score ----------------
function loadIdent() {
  playerName = localStorage.getItem('myoid_name') || '';
  playerPeriod = +localStorage.getItem('myoid_period') || 0;
}
function hsKey(mode) { return `myoid_hs_${mode}`; }
function getHS(mode) { const v = +localStorage.getItem(hsKey(mode)); return isFinite(v) ? v : 0; }
function setHS(mode, v) { try { localStorage.setItem(hsKey(mode), v); } catch (e) {} }

// ---------------- start screen ----------------
function buildStart() {
  loadIdent();
  el('pName').value = playerName;
  el('pPeriod').value = playerPeriod || '';
  el('identMsg').textContent = '';
  el('modeSeg').querySelectorAll('.seg').forEach((b) => b.classList.toggle('on', b.dataset.mode === selMode));
  const hs = getHS(selMode);
  el('startBest').textContent = hs ? hs.toLocaleString() : '—';
}
el('modeSeg').addEventListener('click', (e) => {
  const b = e.target.closest('[data-mode]'); if (!b) return;
  selMode = b.dataset.mode; buildStart();
});
el('startBtn').onclick = startGame;

// ---------------- game flow ----------------
function startGame() {
  playerName = el('pName').value.trim();
  playerPeriod = +el('pPeriod').value || 0;
  if (!playerName || !playerPeriod) {
    el('identMsg').textContent = 'Enter your name and pick a period before starting.';
    return;
  }
  try { localStorage.setItem('myoid_name', playerName); localStorage.setItem('myoid_period', playerPeriod); } catch (e) {}

  S = createGame({ mode: selMode, content, rng });
  bestStreak = 0; locked = false;
  view = primaryView(MUSCLES[S.current]);
  el('start').classList.remove('show');
  el('board').classList.remove('show');
  el('game').style.display = 'block';
  el('end').classList.remove('show');
  el('tierPill').textContent = selMode === 'lives' ? 'LIVES · 3 ♥' : 'TIMED · FULL SET';
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
  document.querySelectorAll('#tabs .tab').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
  clearOverlay();
}

function renderQuestion() {
  locked = false;
  const m = MUSCLES[S.current];
  el('target').textContent = m.name;
  setFB('', ''); flash('', '');
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
  const r = judgeClick(p, view, S.current, MUSCLE_IDS, content);
  if (r.result === 'empty') return;
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
    drawRegions(m, view, 'rgba(52,211,153,.34)');
    flash('good', '✓ Correct');
    setFB('good', `✓ ${m.name}  +${pts}`);
    S = applyResult(S, 'correct', pts);
  } else {
    if (!regionsOf(m).some((r) => r.view === view)) setView(primaryView(m));
    if (result === 'wrong' && hit && hit.hitId && MUSCLES[hit.hitId]) {
      drawRegions(MUSCLES[hit.hitId], view, 'rgba(251,113,133,.30)');
    }
    drawRegions(m, view, 'rgba(34,211,238,.30)');
    flash('bad', skipped ? '↷ Skipped' : result === 'timeout' ? '⏱ Time' : '✗ Miss');
    setFB('cy', `${skipped ? 'Skipped' : 'This is the'} ${m.name}`);
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
  el('endScore').textContent = S.score.toLocaleString();
  el('endPct').textContent = `${pct}%  ·  ${S.correct}/${S.total} correct`;
  let best = getHS(S.mode), badge = '';
  if (S.score > best) { setHS(S.mode, S.score); badge = ' · NEW BEST'; }
  el('endSub').textContent = `${S.mode === 'lives' ? 'Lives' : 'Timed'} complete${badge}`;
  const names = [...new Set(S.missed)].map((id) => MUSCLES[id].name);
  el('missedBox').innerHTML = names.length
    ? `<div class="mh">Review — ${names.length} missed</div>` + names.map((n) => `<div class="mi">${esc(n)}<span>review</span></div>`).join('')
    : `<div class="mh">Missed muscles</div><div class="none">Perfect — every muscle identified.</div>`;
  el('rankLine').textContent = 'Saving to leaderboard…';
  el('end').classList.add('show');
  submitAndRank(pct);
}

async function submitAndRank(pct) {
  const lb = await getLB();
  if (!lb) { el('rankLine').textContent = 'Leaderboard offline — local best saved.'; return; }
  try {
    await lb.submitScore({ name: playerName, period: playerPeriod, score: S.score, pct, mode: S.mode, correct: S.correct, total: S.total });
    const top = await lb.topScores(null, 100);
    const higher = top.filter((r) => (r.score | 0) > S.score).length;
    el('rankLine').textContent = `Saved · #${higher + 1} all-time`;
  } catch (e) {
    el('rankLine').textContent = 'Could not reach leaderboard (offline?).';
  }
}

// ---- leaderboard screen ----
function openBoard() {
  stopTimer();
  el('start').classList.remove('show');
  el('end').classList.remove('show');
  el('game').style.display = 'none';
  el('board').classList.add('show');
  renderBoard();
}
async function renderBoard() {
  const period = el('boardScope').value ? +el('boardScope').value : null;
  const list = el('boardList');
  list.innerHTML = `<div class="lb-empty">Loading…</div>`;
  const lb = await getLB();
  if (!lb) { list.innerHTML = `<div class="lb-empty">Leaderboard unavailable (offline).</div>`; return; }
  let rows;
  try { rows = await lb.topScores(period, 15); }
  catch (e) { list.innerHTML = `<div class="lb-empty">Could not load scores.</div>`; return; }
  const head = `<div class="lb-head"><span>#</span><span>Name</span><span>%</span><span class="sc">Score</span></div>`;
  if (!rows.length) { list.innerHTML = head + `<div class="lb-empty">No scores yet — be the first.</div>`; return; }
  list.innerHTML = head + rows.map((r, i) =>
    `<div class="lb-row ${i === 0 ? 'top1' : ''}">
       <span class="rk">${i + 1}</span>
       <span class="nm">${esc(r.name)} <span class="pd">P${r.period | 0}</span></span>
       <span class="pd">${r.pct | 0}%</span>
       <span class="sc">${(r.score | 0).toLocaleString()}</span>
     </div>`).join('');
}
el('boardScope').addEventListener('change', renderBoard);

// ---- buttons ----
el('viewBoard').onclick = openBoard;
el('boardBtn').onclick = openBoard;
el('boardClose').onclick = toStart;
el('skipBtn').onclick = skip;
el('quitBtn').onclick = toStart;
el('retryBtn').onclick = startGame;
el('changeBtn').onclick = toStart;
function toStart() {
  stopTimer();
  el('end').classList.remove('show');
  el('board').classList.remove('show');
  el('game').style.display = 'none';
  buildStart();
  el('start').classList.add('show');
}

document.addEventListener('keydown', (e) => {
  if (el('game').style.display === 'none') return;
  if (e.key.toLowerCase() === 's') { skip(); return; }
  if (e.key === '1' && !locked) setView('front');
  if (e.key === '2' && !locked) setView('back');
});

buildStart();
