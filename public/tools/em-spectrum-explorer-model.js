// Pure EM-spectrum placement model. No DOM, no globals. Testable in Node.

export const BANDS = [
  {
    id: "radio",
    label: { en: "Radio", es: "Radio" },
    freq: { en: "10⁴ – 10⁸ Hz", es: "10⁴ – 10⁸ Hz" },
    wave: { en: "> 1 m", es: "> 1 m" },
    minHz: 1e4,
    maxHz: 1e8,
    color: "#38bdf8",
  },
  {
    id: "microwave",
    label: { en: "Microwave", es: "Microondas" },
    freq: { en: "10⁸ – 10¹² Hz", es: "10⁸ – 10¹² Hz" },
    wave: { en: "1 mm – 1 m", es: "1 mm – 1 m" },
    minHz: 1e8,
    maxHz: 1e12,
    color: "#34d399",
  },
  {
    id: "infrared",
    label: { en: "Infrared", es: "Infrarrojo" },
    freq: { en: "10¹² – 4.3×10¹⁴ Hz", es: "10¹² – 4.3×10¹⁴ Hz" },
    wave: { en: "700 nm – 1 mm", es: "700 nm – 1 mm" },
    minHz: 1e12,
    maxHz: 4.3e14,
    color: "#fbbf24",
  },
  {
    id: "visible",
    label: { en: "Visible", es: "Visible" },
    freq: { en: "4.3×10¹⁴ – 7.5×10¹⁴ Hz", es: "4.3×10¹⁴ – 7.5×10¹⁴ Hz" },
    wave: { en: "400 – 700 nm", es: "400 – 700 nm" },
    minHz: 4.3e14,
    maxHz: 7.5e14,
    color: "#f87171",
  },
  {
    id: "ultraviolet",
    label: { en: "Ultraviolet", es: "Ultravioleta" },
    freq: { en: "7.5×10¹⁴ – 3×10¹⁶ Hz", es: "7.5×10¹⁴ – 3×10¹⁶ Hz" },
    wave: { en: "10 – 400 nm", es: "10 – 400 nm" },
    minHz: 7.5e14,
    maxHz: 3e16,
    color: "#a78bfa",
  },
  {
    id: "xray",
    label: { en: "X-ray", es: "Rayos X" },
    freq: { en: "3×10¹⁶ – 3×10¹⁹ Hz", es: "3×10¹⁶ – 3×10¹⁹ Hz" },
    wave: { en: "0.01 – 10 nm", es: "0.01 – 10 nm" },
    minHz: 3e16,
    maxHz: 3e19,
    color: "#f472b6",
  },
  {
    id: "gamma",
    label: { en: "Gamma", es: "Gamma" },
    freq: { en: "> 3×10¹⁹ Hz", es: "> 3×10¹⁹ Hz" },
    wave: { en: "< 0.01 nm", es: "< 0.01 nm" },
    minHz: 3e19,
    maxHz: 1e22,
    color: "#fb7185",
  },
];

export const INTERACTIONS = [
  {
    id: "reflection",
    label: { en: "Reflection", es: "Reflexión" },
    desc: { en: "Bounces off matter", es: "Rebota en la materia" },
  },
  {
    id: "absorption",
    label: { en: "Absorption", es: "Absorción" },
    desc: { en: "Energy transfers to matter", es: "La energía se transfiere a la materia" },
  },
  {
    id: "ionization",
    label: { en: "Ionization", es: "Ionización" },
    desc: { en: "Removes electrons from atoms", es: "Elimina electrones de los átomos" },
  },
  {
    id: "transmission",
    label: { en: "Transmission", es: "Transmisión" },
    desc: { en: "Passes through matter", es: "Atraviesa la materia" },
  },
];

export const TECHNOLOGIES = [
  {
    id: "fm-radio",
    name: { en: "FM radio", es: "Radio FM" },
    correctBand: "radio",
    correctInteraction: "transmission",
    hint: { en: "Long wavelengths reach car and home receivers through walls and air.", es: "Las ondas largas llegan a receptores de autos y hogares a través de paredes y aire." },
  },
  {
    id: "wifi",
    name: { en: "WiFi router", es: "Router WiFi" },
    correctBand: "microwave",
    correctInteraction: "transmission",
    hint: { en: "2.4/5 GHz signals travel through walls to connect devices.", es: "Señales de 2.4/5 GHz atraviesan paredes para conectar dispositivos." },
  },
  {
    id: "5g",
    name: { en: "5G cell service", es: "Servicio celular 5G" },
    correctBand: "microwave",
    correctInteraction: "absorption",
    hint: { en: "High-frequency bands are absorbed by rain, leaves, and buildings.", es: "Las bandas de alta frecuencia son absorbidas por lluvia, hojas y edificios." },
  },
  {
    id: "microwave-oven",
    name: { en: "Microwave oven", es: "Horno de microondas" },
    correctBand: "microwave",
    correctInteraction: "absorption",
    hint: { en: "~2.45 GHz is absorbed by water and fat molecules, heating food.", es: "~2.45 GHz es absorbida por moléculas de agua y grasa, calentando la comida." },
  },
  {
    id: "visible-light",
    name: { en: "Visible light", es: "Luz visible" },
    correctBand: "visible",
    correctInteraction: "reflection",
    hint: { en: "We see objects because visible light reflects off them.", es: "Vemos objetos porque la luz visible se refleja en ellos." },
  },
  {
    id: "uv",
    name: { en: "UV sunlight", es: "Luz UV solar" },
    correctBand: "ultraviolet",
    correctInteraction: "absorption",
    hint: { en: "Skin absorbs UV, producing warmth and sunburn.", es: "La piel absorbe UV, produciendo calor y quemaduras solares." },
  },
  {
    id: "xray",
    name: { en: "Medical X-ray", es: "Rayos X médicos" },
    correctBand: "xray",
    correctInteraction: "ionization",
    hint: { en: "High-energy photons can knock electrons out of atoms.", es: "Fotones de alta energía pueden arrancar electrones de los átomos." },
  },
];

const GLOBAL_MIN_HZ = 1e4;
const GLOBAL_MAX_HZ = 1e22;
const LOG_RANGE = Math.log10(GLOBAL_MAX_HZ) - Math.log10(GLOBAL_MIN_HZ);

export function bandPosition(band) {
  const left = (Math.log10(band.minHz) - Math.log10(GLOBAL_MIN_HZ)) / LOG_RANGE;
  const width = (Math.log10(band.maxHz) - Math.log10(band.minHz)) / LOG_RANGE;
  return { left: Math.max(0, left * 100), width: Math.max(0.5, width * 100) };
}

export function emptyState() {
  const state = { techs: {} };
  for (const t of TECHNOLOGIES) {
    state.techs[t.id] = { bandId: null, interactionId: null };
  }
  return state;
}

export function isComplete(state) {
  return TECHNOLOGIES.every((t) => {
    const s = state.techs[t.id];
    return s && s.bandId && s.interactionId;
  });
}

export function scoreState(state) {
  let raw = 0;
  const perTech = [];
  for (const t of TECHNOLOGIES) {
    const s = state.techs[t.id] || {};
    const bandOk = s.bandId === t.correctBand;
    const interactionOk = s.interactionId === t.correctInteraction;
    if (bandOk) raw += 0.5;
    if (interactionOk) raw += 0.5;
    perTech.push({
      id: t.id,
      bandOk,
      interactionOk,
      selectedBand: s.bandId,
      selectedInteraction: s.interactionId,
    });
  }
  const maxRaw = TECHNOLOGIES.length; // 7
  const score = Math.round((raw / maxRaw) * 5 * 100) / 100;
  return { score, maxScore: 5, raw, maxRaw, perTech };
}
