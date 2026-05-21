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

// Muscles are bilateral: a polygon authored on one side of the symmetric figure
// also matches a click (or its proximity) on the mirrored side across x=0.5.
function insideMuscle(point, polygon) {
  return pointInPolygon(point, polygon) ||
         pointInPolygon({ x: 1 - point.x, y: point.y }, polygon);
}
function distToMuscle(point, polygon) {
  return Math.min(distPointToPolygon(point, polygon),
                  distPointToPolygon({ x: 1 - point.x, y: point.y }, polygon));
}

// Decide the outcome of a click at `point` while viewing `view`, hunting for `targetId`.
// A muscle can only be answered on the view it lives on; clicks on the other view
// are exploration (empty). On the target's view:
//   - inside the correct target (even if other targets overlap there) -> correct
//   - inside only a wrong target                                       -> wrong
//   - mis-click (inside no target) -> snap to the NEAREST target:
//       nearest is the target                                          -> correct
//       nearest is wrong but the correct target overlaps it (layering) -> correct
//       otherwise                                                      -> wrong
export function judgeClick(point, view, targetId, tierIds, content) {
  const target = content.MUSCLES[targetId];
  if (!target || target.view !== view) return { result: 'empty', hitId: null };

  const viewIds = tierIds.filter(
    (id) => content.MUSCLES[id] && content.MUSCLES[id].view === view
  );

  const hitIds = viewIds.filter((id) => insideMuscle(point, content.MUSCLES[id].polygon));
  if (hitIds.includes(targetId)) return { result: 'correct', hitId: targetId };
  if (hitIds.length) return { result: 'wrong', hitId: hitIds[0] };

  let nearest = null, best = Infinity;
  for (const id of viewIds) {
    const d = distToMuscle(point, content.MUSCLES[id].polygon);
    if (d < best) { best = d; nearest = id; }
  }
  if (!nearest) return { result: 'empty', hitId: null };
  if (nearest === targetId) return { result: 'correct', hitId: targetId };
  if (polygonsOverlap(target.polygon, content.MUSCLES[nearest].polygon)) {
    return { result: 'correct', hitId: targetId };
  }
  return { result: 'wrong', hitId: nearest };
}

export function createGame({ mode, tier, content, rng, duration = 60 }) {
  const deck = buildDeck(tier, content, rng);
  const timed = mode === 'timed';
  return {
    mode,
    tier,
    deck,
    pos: 0,
    current: timed ? drawRandom(deck, rng) : deck[0],
    lives: timed ? null : 3,
    score: 0,
    missed: [],
    total: deck.length,
    duration: timed ? duration : null,
    status: 'playing'
  };
}

function drawRandom(deck, rng) {
  return deck[Math.floor(rng() * deck.length)];
}

export function applyResult(state, result, rng) {
  if (result === 'empty') return state;
  const s = { ...state, missed: state.missed.slice() };

  if (result === 'correct') {
    s.score += 1;
  } else if (result === 'wrong') {
    s.missed.push(s.current);
    if (s.mode === 'lives') s.lives -= 1;
  }

  if (s.mode === 'lives' && s.lives <= 0) {
    s.status = 'over';
    return s;
  }

  if (s.mode === 'lives') {
    s.pos += 1;
    if (s.pos >= s.deck.length) {
      s.status = 'over';
    } else {
      s.current = s.deck[s.pos];
    }
  } else {
    s.pos += 1;
    s.current = drawRandom(s.deck, rng);
  }
  return s;
}

export function isTimeUp(state, elapsedMs) {
  if (state.mode !== 'timed') return false;
  return elapsedMs >= state.duration * 1000;
}
