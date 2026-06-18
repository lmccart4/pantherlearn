// Pure grid-simulation model. No DOM, no globals. Unit-tested via grid-model.test.mjs.

export const SOURCE_TYPES = {
  gas:     { label: "Natural Gas",     capacityMW: 400,  dispatchable: true,  weatherDependent: false, storage: false, costPerUnit: 3, carbon: "high",   floodVulnerable: true  },
  nuclear: { label: "Nuclear",         capacityMW: 1000, dispatchable: true,  weatherDependent: false, storage: false, costPerUnit: 6, carbon: "none",   floodVulnerable: false },
  solar:   { label: "Solar Farm",      capacityMW: 200,  dispatchable: false, weatherDependent: true,  storage: false, costPerUnit: 2, carbon: "none",   floodVulnerable: false },
  wind:    { label: "Wind Farm",       capacityMW: 300,  dispatchable: false, weatherDependent: true,  storage: false, costPerUnit: 2, carbon: "none",   floodVulnerable: false },
  battery: { label: "Battery Storage", capacityMW: 150,  dispatchable: true,  weatherDependent: false, storage: true,  costPerUnit: 4, carbon: "none",   floodVulnerable: false },
};

// Daily demand curve in MW. Simple two-hump pattern, evening peak. Base 600, peak ~1500.
export function computeDemand(hour, opts = {}) {
  const base = opts.base ?? 600;
  const peak = opts.peak ?? 900; // added on top of base
  // morning bump ~7-9, evening peak ~18-21
  const morning = Math.exp(-Math.pow(hour - 8, 2) / 8) * 0.6;
  const evening = Math.exp(-Math.pow(hour - 19, 2) / 6) * 1.0;
  return Math.round(base + peak * Math.max(morning, evening));
}

// Supply available at a given hour (excludes battery dispatch, handled in simulateDay).
export function computeSupply(sources, hour, conditions) {
  const outages = new Set(conditions.outages || []);
  let mw = 0;
  for (const s of sources) {
    if (outages.has(s.id)) continue;
    const t = SOURCE_TYPES[s.type];
    if (!t || t.storage) continue; // storage contributes via simulateDay, not base supply
    let factor = 1;
    if (t.weatherDependent) {
      if (s.type === "solar") {
        // daylight window ~6-18
        const day = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
        factor = day * (conditions.sunlight ?? 1);
      } else if (s.type === "wind") {
        factor = conditions.wind ?? 0;
      }
    }
    mw += t.capacityMW * s.units * factor;
  }
  return Math.round(mw);
}

// Simulate a full day (24 hours) and compute reliability metrics.
export function simulateDay(sources, conditions) {
  const batteryMW = sources
    .filter((s) => SOURCE_TYPES[s.type]?.storage)
    .reduce((sum, s) => sum + SOURCE_TYPES[s.type].capacityMW * s.units, 0);
  const hours = [];
  let unservedMWh = 0;
  const blackoutHours = [];
  for (let h = 0; h < 24; h++) {
    const demand = computeDemand(h);
    const baseSupply = computeSupply(sources, h, conditions);
    let deficit = Math.max(0, demand - baseSupply);
    const fromBattery = Math.min(deficit, batteryMW);
    deficit -= fromBattery;
    const served = demand - deficit;
    if (deficit > 0) {
      blackoutHours.push(h);
      unservedMWh += deficit; // 1-hour blocks → MWh == MW here
    }
    hours.push({ hour: h, demand, supply: baseSupply + fromBattery, served, deficit });
  }
  const reliability = (24 - blackoutHours.length) / 24;
  return { hours, reliability, blackoutHours, totalUnservedMWh: Math.round(unservedMWh) };
}

// Apply storm conditions: knocks out flood-vulnerable sources and reduces renewables.
export function applyStorm(sources, severity) {
  const floodThreshold = 0.6; // above this severity, flood-vulnerable sites go offline
  const outages = severity >= floodThreshold
    ? sources.filter((s) => SOURCE_TYPES[s.type]?.floodVulnerable).map((s) => s.id)
    : [];
  return {
    sunlight: Math.max(0, 1 - severity),        // storm clouds cut solar
    wind: Math.max(0, Math.min(1, severity * 0.4)), // some wind, but turbines cut out at extremes
    outages,
    storm: { severity },
  };
}

// Score a design against criteria.
export function scoreDesign(sources, criteria = {}) {
  const reliabilityTarget = criteria.reliabilityTarget ?? 0.95;
  const costBudget = criteria.costBudget ?? 30;
  const stormSeverity = criteria.stormSeverity ?? 0.9;

  const calm = simulateDay(sources, { sunlight: 1, wind: 0.5, outages: [] });
  const storm = simulateDay(sources, applyStorm(sources, stormSeverity));
  const cost = sources.reduce((sum, s) => sum + (SOURCE_TYPES[s.type]?.costPerUnit || 0) * s.units, 0);

  const meetsReliability = calm.reliability >= reliabilityTarget;
  const stormOk = storm.reliability >= reliabilityTarget - 0.15;
  const withinBudget = cost <= costBudget;
  const lowCarbon = !sources.some((s) => SOURCE_TYPES[s.type]?.carbon === "high");

  let score = 0;
  const breakdown = [];
  if (meetsReliability) { score += 2; breakdown.push("calm-reliability:+2"); } else { breakdown.push("calm-reliability:0"); }
  if (stormOk) { score += 2; breakdown.push("storm-reliability:+2"); } else { breakdown.push("storm-reliability:0"); }
  if (withinBudget) { score += 1; breakdown.push("budget:+1"); } else { breakdown.push("budget:0"); }

  return {
    score, maxScore: 5,
    calmReliability: calm.reliability, stormReliability: storm.reliability,
    cost, withinBudget, meetsReliability, lowCarbon, breakdown,
  };
}
