// Pure model of electromagnetic induction in a rotating coil. No DOM.
// EMF ∝ N·ω·B (Faraday); current here is in relative units (K scales to readable numbers).
const K = 0.02;

export function inducedPeak(rpm, coils, field = 1) {
  const omega = (rpm * 2 * Math.PI) / 60; // rad/s
  return K * coils * omega * field;
}

export function currentAt(angleDeg, rpm, coils, field = 1) {
  return inducedPeak(rpm, coils, field) * Math.cos((angleDeg * Math.PI) / 180);
}

export function waveform(rpm, coils, field = 1, samples = 24) {
  const out = [];
  for (let i = 0; i < samples; i++) {
    const angle = (360 / samples) * i;
    out.push({ angle, current: currentAt(angle, rpm, coils, field) });
  }
  return out;
}
