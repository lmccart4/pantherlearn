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

// Decide the outcome of a click at `point` while viewing `view`, hunting for `targetId`.
// Only muscles in tierIds that live on the current view are considered.
// Muscles are bilateral, so a polygon authored on one side of the (symmetric)
// figure also matches a click on the mirrored side across the centerline x=0.5.
function hitsMuscle(point, polygon) {
  const mirror = { x: 1 - point.x, y: point.y };
  return pointInPolygon(point, polygon) || pointInPolygon(mirror, polygon);
}

export function judgeClick(point, view, targetId, tierIds, content) {
  const target = content.MUSCLES[targetId];
  if (target && target.view === view && hitsMuscle(point, target.polygon)) {
    return { result: 'correct', hitId: targetId };
  }
  for (const id of tierIds) {
    if (id === targetId) continue;
    const m = content.MUSCLES[id];
    if (m && m.view === view && hitsMuscle(point, m.polygon)) {
      return { result: 'wrong', hitId: id };
    }
  }
  return { result: 'empty', hitId: null };
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
