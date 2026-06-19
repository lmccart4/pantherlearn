// Pure signal-tower placement model. No DOM, no globals. Testable in Node.

export const TOWER_TYPES = {
  low4G: {
    id: "low4G",
    label: { en: "4G Macro Tower (700 MHz)", es: "Torre 4G Macro (700 MHz)" },
    short: { en: "4G Macro", es: "4G Macro" },
    cost: 4,
    rangeCells: 3.5,
    bandwidth: 2,
    penetration: 0.8,
    color: "#34d399",
  },
  sub6: {
    id: "sub6",
    label: { en: "5G Sub-6 Tower (3.5 GHz)", es: "Torre 5G Sub-6 (3,5 GHz)" },
    short: { en: "5G Sub-6", es: "5G Sub-6" },
    cost: 6,
    rangeCells: 2.5,
    bandwidth: 5,
    penetration: 0.5,
    color: "#38bdf8",
  },
  mmWave: {
    id: "mmWave",
    label: { en: "5G mmWave Small Cell (28 GHz)", es: "Celda Pequeña 5G mmWave (28 GHz)" },
    short: { en: "mmWave", es: "mmWave" },
    cost: 8,
    rangeCells: 1.5,
    bandwidth: 10,
    penetration: 0.2,
    color: "#a78bfa",
  },
  wifi: {
    id: "wifi",
    label: { en: "Indoor WiFi Router (2.4/5 GHz)", es: "Router WiFi Interior (2,4/5 GHz)" },
    short: { en: "WiFi", es: "WiFi" },
    cost: 1,
    rangeCells: 1.2,
    bandwidth: 4,
    penetration: 0.9,
    color: "#fbbf24",
  },
};

export const MAPS = {
  standard: {
    id: "standard",
    name: { en: "Perth Amboy — Mixed Districts", es: "Perth Amboy — Distritos Mixtos" },
    budget: 25,
    rows: 10,
    cols: 12,
    cells: [
      "WWWWWWWWWWWW",
      "WPPPRBBBBRWW",
      "WPPPRBBBBRWW",
      "WRRRRRRRRRRW",
      "WBBRBBRBBRBW",
      "WBBRBBRBBRBW",
      "WRRRRRRRRRRW",
      "WBBRBBRBBRBW",
      "WBBRBBRBBRBW",
      "WWWWWWWWWWWW",
    ],
  },
  city: {
    id: "city",
    name: { en: "Downtown Perth Amboy — Dense City", es: "Centro de Perth Amboy — Ciudad Densa" },
    budget: 20,
    rows: 10,
    cols: 12,
    cells: [
      "WWWWWWWWWWWW",
      "WBBBRBBBBBWW",
      "WBBBRBBBBBWW",
      "WRRRRRRRRRRW",
      "WBBBRBBRBBBW",
      "WBBBRBBRBBBW",
      "WRRRRRRRRRRW",
      "WBBBRBBRBBBW",
      "WBBBRBBRBBBW",
      "WWWWWWWWWWWW",
    ],
  },
};

const COVERAGE_THRESHOLD = 0.35;

export function getCell(map, r, c) {
  if (r < 0 || c < 0 || r >= map.rows || c >= map.cols) return "W";
  return map.cells[r][c] || "W";
}

export function isBuildable(map, r, c) {
  const cell = getCell(map, r, c);
  return cell === "R" || cell === "P";
}

export function listCoverableCells(map) {
  const cells = [];
  for (let r = 0; r < map.rows; r++) {
    for (let c = 0; c < map.cols; c++) {
      const type = getCell(map, r, c);
      if (type === "B" || type === "R") cells.push({ r, c, type });
    }
  }
  return cells;
}

export function emptyState() {
  return {
    placedTowers: [],
    rationale: "",
    submitted: false,
    nextId: 1,
  };
}

export function placeTower(state, map, typeId, r, c) {
  const type = TOWER_TYPES[typeId];
  if (!type) return { ok: false, reason: "unknown-type" };
  if (!isBuildable(map, r, c)) return { ok: false, reason: "not-buildable" };
  const costSoFar = state.placedTowers.reduce((s, t) => s + TOWER_TYPES[t.type].cost, 0);
  if (costSoFar + type.cost > map.budget) return { ok: false, reason: "over-budget" };
  const newState = {
    ...state,
    placedTowers: [...state.placedTowers, { id: state.nextId, type: typeId, r, c }],
    nextId: state.nextId + 1,
  };
  return { ok: true, state: newState };
}

export function removeTower(state, towerId) {
  return {
    ...state,
    placedTowers: state.placedTowers.filter((t) => t.id !== towerId),
  };
}

function distance(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.c - b.c) ** 2);
}

export function computeCoverage(map, placedTowers) {
  const coverable = listCoverableCells(map);
  const signal = new Map();
  for (const cell of coverable) {
    signal.set(`${cell.r},${cell.c}`, 0);
  }

  for (const tower of placedTowers) {
    const type = TOWER_TYPES[tower.type];
    const center = { r: tower.r, c: tower.c };
    for (const cell of coverable) {
      const d = distance(center, cell);
      if (d > type.rangeCells) continue;
      const base = 1 - d / type.rangeCells;
      const penetration = cell.type === "B" ? type.penetration : 1.0;
      const value = Math.max(0, base * penetration);
      const key = `${cell.r},${cell.c}`;
      signal.set(key, Math.max(signal.get(key) || 0, value));
    }
  }

  let buildingCovered = 0;
  let buildingTotal = 0;
  let roadCovered = 0;
  let roadTotal = 0;
  for (const cell of coverable) {
    const key = `${cell.r},${cell.c}`;
    const covered = (signal.get(key) || 0) >= COVERAGE_THRESHOLD;
    if (cell.type === "B") {
      buildingTotal++;
      if (covered) buildingCovered++;
    } else if (cell.type === "R") {
      roadTotal++;
      if (covered) roadCovered++;
    }
  }

  const buildingPct = buildingTotal ? buildingCovered / buildingTotal : 0;
  const roadPct = roadTotal ? roadCovered / roadTotal : 0;
  const combinedPct = coverable.length ? (buildingCovered + roadCovered) / coverable.length : 0;

  return {
    buildingCovered,
    buildingTotal,
    buildingPct,
    roadCovered,
    roadTotal,
    roadPct,
    totalCovered: buildingCovered + roadCovered,
    totalCoverable: coverable.length,
    combinedPct,
    signal,
  };
}

export function computeCost(map, placedTowers) {
  return placedTowers.reduce((s, t) => s + (TOWER_TYPES[t.type]?.cost || 0), 0);
}

export function emptyRationale(rationale) {
  return (!rationale || rationale.trim().length === 0);
}

export function scoreDesign(state, map) {
  const coverage = computeCoverage(map, state.placedTowers);
  const cost = computeCost(map, state.placedTowers);
  const withinBudget = cost <= map.budget;

  // Coverage: up to 2 points
  let coverageScore = 0;
  if (coverage.combinedPct >= 0.90) coverageScore = 2;
  else if (coverage.combinedPct >= 0.75) coverageScore = 1.5;
  else if (coverage.combinedPct >= 0.60) coverageScore = 1.0;
  else if (coverage.combinedPct >= 0.40) coverageScore = 0.5;

  // Budget: 1 point
  const budgetScore = withinBudget ? 1 : 0;

  // Strategy: up to 1.5 points
  const typeCounts = {};
  for (const t of state.placedTowers) typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
  const uniqueTypes = Object.keys(typeCounts).length;
  const hasIndoor = typeCounts.wifi && typeCounts.wifi >= 1;
  const hasHighCap = typeCounts.mmWave || typeCounts.sub6;
  let strategyScore = 0;
  if (uniqueTypes >= 2) strategyScore += 0.5;
  if (hasIndoor) strategyScore += 0.5;
  if (hasHighCap) strategyScore += 0.5;

  // Rationale: 0.5 point
  const rationaleScore = (!emptyRationale(state.rationale) && state.rationale.trim().length >= 20) ? 0.5 : 0;

  const score = Math.min(5, coverageScore + budgetScore + strategyScore + rationaleScore);

  return {
    score: Math.round(score * 100) / 100,
    maxScore: 5,
    coverageScore,
    budgetScore,
    strategyScore,
    rationaleScore,
    cost,
    budget: map.budget,
    withinBudget,
    coverage,
    typeCounts,
    breakdown: [
      `coverage:${coverage.combinedPct.toFixed(2)}:${coverageScore}`,
      `budget:${cost}<=${map.budget}:${budgetScore}`,
      `strategy:types=${uniqueTypes}:indoor=${hasIndoor}:highCap=${hasHighCap}:${strategyScore}`,
      `rationale:${rationaleScore}`,
    ],
  };
}
