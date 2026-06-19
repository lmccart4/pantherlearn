// Pure energy-accounting model: trace energy through staged efficiencies. No DOM.
// Efficiencies reflect a real fossil-fuel grid path (most loss at the boiler/turbine).
export const DEFAULT_STAGES = [
  { name: "Fuel → Heat (boiler)", efficiency: 0.90 },
  { name: "Heat → Motion (turbine)", efficiency: 0.45 },
  { name: "Motion → Electricity (generator)", efficiency: 0.98 },
  { name: "Transmission lines", efficiency: 0.93 },
  { name: "Into your home", efficiency: 1.0 },
];

export function traceFlow(inputMJ, stages = DEFAULT_STAGES) {
  const steps = [];
  let energy = inputMJ;
  let totalLoss = 0;
  for (const stage of stages) {
    const energyOut = energy * stage.efficiency;
    const loss = energy - energyOut;
    steps.push({ name: stage.name, energyIn: energy, energyOut, loss });
    totalLoss += loss;
    energy = energyOut;
  }
  return { steps, delivered: energy, totalLoss };
}

export function scoreAccounting(studentDeliveredMJ, inputMJ, stages = DEFAULT_STAGES, tolerance = 0.05) {
  const correctDelivered = traceFlow(inputMJ, stages).delivered;
  const err = Math.abs(studentDeliveredMJ - correctDelivered);
  const tol = tolerance * inputMJ;
  let score = 0;
  if (err <= tol) score = 5;
  else if (err <= 2 * tol) score = 3;
  return { score, maxScore: 5, correctDelivered, withinTolerance: err <= tol };
}
