// Ray-casting point-in-polygon. point {x,y}, polygon [[x,y],...] in 0..1 space.
export function pointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersects =
      (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

// Fisher–Yates using injected rng() in [0,1). Returns a NEW array.
export function shuffle(array, rng) {
  const out = array.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildDeck(tier, content, rng) {
  const ids = content.TIERS[tier] || [];
  return shuffle(ids, rng);
}

// ---- geometry helpers for click judging ----
function distPointToSegment(p, a, b) {
  const vx = b[0] - a[0], vy = b[1] - a[1];
  const len2 = vx * vx + vy * vy;
  let t = len2 ? ((p.x - a[0]) * vx + (p.y - a[1]) * vy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const dx = a[0] + t * vx - p.x, dy = a[1] + t * vy - p.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function distPointToPolygon(p, polygon) {
  if (pointInPolygon(p, polygon)) return 0;
  let best = Infinity;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    best = Math.min(best, distPointToSegment(p, polygon[j], polygon[i]));
  }
  return best;
}

function segmentsIntersect(p1, p2, p3, p4) {
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const d1 = cross(p3, p4, p1), d2 = cross(p3, p4, p2);
  const d3 = cross(p1, p2, p3), d4 = cross(p1, p2, p4);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
         ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

// Do two polygons overlap (share interior or cross edges)?
export function polygonsOverlap(a, b) {
  for (const v of a) if (pointInPolygon({ x: v[0], y: v[1] }, b)) return true;
  for (const v of b) if (pointInPolygon({ x: v[0], y: v[1] }, a)) return true;
  for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
    for (let k = 0, l = b.length - 1; k < b.length; l = k++) {
      if (segmentsIntersect(a[j], a[i], b[l], b[k])) return true;
    }
  }
  return false;
}

// A muscle holds one or more regions, each tagged with the view it lives on:
//   { view: 'front'|'back', poly: [[x,y]...] }
// A muscle may have regions across BOTH views (e.g. deltoids show front and back)
// and multiple regions per view (e.g. left + right when the figure isn't mirror-
// perfect). Accepts three input shapes for backward compatibility:
//   regions: [{view, poly}]   (canonical)
//   regions: [[ [x,y]... ]]   (array-of-polygons, all on muscle.view)
//   polygon: [ [x,y]... ]     (single polygon on muscle.view)
export function regionsOf(muscle) {
  if (!muscle) return [];
  if (Array.isArray(muscle.regions)) {
    return muscle.regions.map((r) =>
      Array.isArray(r) ? { view: muscle.view, poly: r } : { view: r.view ?? muscle.view, poly: r.poly }
    );
  }
  if (muscle.polygon) return [{ view: muscle.view, poly: muscle.polygon }];
  return [];
}

function regionsOnView(muscle, view) {
  return regionsOf(muscle).filter((r) => r.view === view);
}

// Muscles are bilateral: a region authored on one side of the symmetric figure
// also matches a click (or its proximity) on the mirrored side across x=0.5.
// (Harmless/redundant when both sides are drawn explicitly as separate regions.)
function insideMuscle(point, muscle, view) {
  const mirror = { x: 1 - point.x, y: point.y };
  return regionsOnView(muscle, view).some(
    (r) => pointInPolygon(point, r.poly) || pointInPolygon(mirror, r.poly)
  );
}
function distToMuscle(point, muscle, view) {
  const mirror = { x: 1 - point.x, y: point.y };
  let best = Infinity;
  for (const r of regionsOnView(muscle, view)) {
    best = Math.min(best, distPointToPolygon(point, r.poly), distPointToPolygon(mirror, r.poly));
  }
  return best;
}

// The view a card should open on for a muscle (its first region's view).
export function primaryView(muscle) {
  const r = regionsOf(muscle);
  return r.length ? r[0].view : ((muscle && muscle.view) || 'front');
}

// Decide the outcome of a click at `point` while viewing `view`, hunting for `targetId`.
// A muscle can only be answered on a view where it HAS a region; clicks on a view
// with no target region are exploration (empty). On a view where the target lives:
//   - inside the correct target (even if other targets overlap there) -> correct
//   - inside only a wrong target                                       -> wrong
//   - mis-click (inside no target) -> snap to the NEAREST target on this view:
//       nearest is the target                                          -> correct
//       nearest is wrong but a target region overlaps it (layering)    -> correct
//       otherwise                                                      -> wrong
export function judgeClick(point, view, targetId, tierIds, content) {
  const target = content.MUSCLES[targetId];
  const targetHere = target ? regionsOnView(target, view) : [];
  if (targetHere.length === 0) return { result: 'empty', hitId: null };

  const hitIds = tierIds.filter(
    (id) => content.MUSCLES[id] && insideMuscle(point, content.MUSCLES[id], view)
  );
  if (hitIds.includes(targetId)) return { result: 'correct', hitId: targetId };
  if (hitIds.length) return { result: 'wrong', hitId: hitIds[0] };

  let nearest = null, best = Infinity;
  for (const id of tierIds) {
    const m = content.MUSCLES[id];
    if (!m) continue;
    const d = distToMuscle(point, m, view);
    if (d < best) { best = d; nearest = id; }
  }
  if (!nearest) return { result: 'empty', hitId: null };
  if (nearest === targetId) return { result: 'correct', hitId: targetId };
  const nearestRegions = regionsOnView(content.MUSCLES[nearest], view);
  const layered = targetHere.some((tr) => nearestRegions.some((nr) => polygonsOverlap(tr.poly, nr.poly)));
  if (layered) {
    return { result: 'correct', hitId: targetId };
  }
  return { result: 'wrong', hitId: nearest };
}

// Per-round countdown length (Kahoot-style).
export const ROUND_MS = 15000;
export const MAX_POINTS = 1000;

// Speed score for a CORRECT answer: full points when instant, easing down to a
// half-credit floor at the buzzer (true Kahoot curve). 1000 -> 500 across the
// round. Wrong / timeout answers score 0 (handled by the caller).
export function roundPoints(timeUsedMs, limitMs = ROUND_MS) {
  const frac = Math.max(0, Math.min(1, timeUsedMs / limitMs));
  return Math.round(MAX_POINTS * (1 - frac / 2));
}

// Both modes play the full shuffled deck, one round per muscle. Lives mode grants
// 3 lives (wrong/timeout costs one); Timed mode has no lives and runs the whole
// set. Per-round timing/scoring is driven by the controller via roundPoints().
export function createGame({ mode, tier, content, rng }) {
  const deck = buildDeck(tier, content, rng);
  return {
    mode,
    tier,
    deck,
    pos: 0,
    current: deck[0],
    lives: mode === 'lives' ? 3 : null,
    score: 0,
    streak: 0,
    correct: 0,
    wrong: 0,
    missed: [],
    total: deck.length,
    roundMs: ROUND_MS,
    status: 'playing'
  };
}

// result: 'correct' | 'wrong' | 'timeout' | 'empty'. `points` applies to 'correct'.
export function applyResult(state, result, points = 0) {
  if (result === 'empty') return state;
  const s = { ...state, missed: state.missed.slice() };

  if (result === 'correct') {
    s.score += points;
    s.streak += 1;
    s.correct += 1;
  } else { // 'wrong' or 'timeout'
    s.streak = 0;
    s.wrong += 1;
    s.missed.push(s.current);
    if (s.mode === 'lives') s.lives -= 1;
  }

  if (s.mode === 'lives' && s.lives <= 0) {
    s.status = 'over';
    return s;
  }

  s.pos += 1;
  if (s.pos >= s.deck.length) s.status = 'over';
  else s.current = s.deck[s.pos];
  return s;
}
