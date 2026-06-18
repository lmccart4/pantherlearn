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
