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
export function judgeClick(point, view, targetId, tierIds, content) {
  const target = content.MUSCLES[targetId];
  if (target && target.view === view && pointInPolygon(point, target.polygon)) {
    return { result: 'correct', hitId: targetId };
  }
  for (const id of tierIds) {
    if (id === targetId) continue;
    const m = content.MUSCLES[id];
    if (m && m.view === view && pointInPolygon(point, m.polygon)) {
      return { result: 'wrong', hitId: id };
    }
  }
  return { result: 'empty', hitId: null };
}
