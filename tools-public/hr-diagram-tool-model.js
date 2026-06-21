// Pure H-R diagram model. No DOM, no globals. Testable in Node.
// Students place real stars on a temperature-vs-luminosity diagram and classify regions.

export const ZONES = [
  {
    id: "main-sequence",
    label: { en: "Main Sequence", es: "Secuencia Principal" },
    color: "#38bdf8",
  },
  {
    id: "giant",
    label: { en: "Giants", es: "Gigantes" },
    color: "#fbbf24",
  },
  {
    id: "white-dwarf",
    label: { en: "White Dwarfs", es: "Enanas Blancas" },
    color: "#a78bfa",
  },
];

// Real star data suitable for an 11th-grade H-R diagram activity.
// Luminosities are relative to the Sun; temperatures are surface temperatures in kelvin.
export const STAR_DATA = [
  {
    id: "sirius",
    name: { en: "Sirius", es: "Sirio" },
    tempK: 9940,
    luminosity: 25.4,
    color: { en: "blue-white", es: "blanco azulado" },
    zone: "main-sequence",
  },
  {
    id: "vega",
    name: { en: "Vega", es: "Vega" },
    tempK: 9602,
    luminosity: 40.1,
    color: { en: "blue-white", es: "blanco azulado" },
    zone: "main-sequence",
  },
  {
    id: "rigel",
    name: { en: "Rigel", es: "Rigel" },
    tempK: 12100,
    luminosity: 120000,
    color: { en: "blue", es: "azul" },
    zone: "giant",
  },
  {
    id: "betelgeuse",
    name: { en: "Betelgeuse", es: "Betelgeuse" },
    tempK: 3500,
    luminosity: 126000,
    color: { en: "red", es: "rojo" },
    zone: "giant",
  },
  {
    id: "aldebaran",
    name: { en: "Aldebaran", es: "Aldebarán" },
    tempK: 3910,
    luminosity: 518,
    color: { en: "orange-red", es: "rojo anaranjado" },
    zone: "giant",
  },
  {
    id: "arcturus",
    name: { en: "Arcturus", es: "Arturo" },
    tempK: 4286,
    luminosity: 170,
    color: { en: "orange", es: "naranja" },
    zone: "giant",
  },
  {
    id: "proxima",
    name: { en: "Proxima Centauri", es: "Próxima Centauri" },
    tempK: 3042,
    luminosity: 0.0017,
    color: { en: "red", es: "rojo" },
    zone: "main-sequence",
  },
  {
    id: "barnard",
    name: { en: "Barnard's Star", es: "Estrella de Barnard" },
    tempK: 3134,
    luminosity: 0.0035,
    color: { en: "red", es: "rojo" },
    zone: "main-sequence",
  },
  {
    id: "sun",
    name: { en: "Sun", es: "Sol" },
    tempK: 5778,
    luminosity: 1.0,
    color: { en: "yellow", es: "amarillo" },
    zone: "main-sequence",
  },
  {
    id: "sirius-b",
    name: { en: "Sirius B", es: "Sirio B" },
    tempK: 25000,
    luminosity: 0.026,
    color: { en: "white", es: "blanco" },
    zone: "white-dwarf",
  },
];

export const QUESTIONS = [
  {
    id: "q1",
    prompt: {
      en: "Which stars are the hottest and most luminous?",
      es: "¿Qué estrellas son las más calientes y más luminosas?",
    },
    options: [
      { en: "Red dwarfs", es: "Enanas rojas" },
      { en: "Blue main-sequence stars", es: "Estrellas azules de la secuencia principal" },
      { en: "White dwarfs", es: "Enanas blancas" },
      { en: "Red giants", es: "Gigantes rojas" },
    ],
    correctIndex: 1,
  },
  {
    id: "q2",
    prompt: {
      en: "Compared with the Sun, a massive blue star on the main sequence has a __ lifetime.",
      es: "Comparada con el Sol, una estrella azul masiva en la secuencia principal tiene una vida __.",
    },
    options: [
      { en: "longer", es: "más larga" },
      { en: "similar", es: "similar" },
      { en: "shorter", es: "más corta" },
      { en: "uncertain", es: "incierta" },
    ],
    correctIndex: 2,
  },
];

export const DIAGRAM = {
  width: 600,
  height: 400,
  minTempK: 2500,
  maxTempK: 30000,
  minLum: 0.0001,
  maxLum: 200000,
};

function log10(x) {
  return Math.log(x) / Math.LN10;
}

export function tempToX(tempK, width = DIAGRAM.width) {
  const t = Math.max(DIAGRAM.minTempK, Math.min(DIAGRAM.maxTempK, tempK));
  const min = log10(DIAGRAM.minTempK);
  const max = log10(DIAGRAM.maxTempK);
  const frac = (log10(t) - min) / (max - min);
  // Hot stars on the left, cool stars on the right.
  return width * (1 - frac);
}

export function lumToY(lum, height = DIAGRAM.height) {
  const l = Math.max(DIAGRAM.minLum, Math.min(DIAGRAM.maxLum, lum));
  const min = log10(DIAGRAM.minLum);
  const max = log10(DIAGRAM.maxLum);
  const frac = (log10(l) - min) / (max - min);
  return height * (1 - frac);
}

// Determine which diagram region a coordinate belongs to.
// Giants = upper band (luminous); white dwarfs = lower left (hot + dim);
// everything else falls to the main sequence band.
export function zoneFromPosition(x, y, width = DIAGRAM.width, height = DIAGRAM.height) {
  const relX = x / width;
  const relY = y / height;
  if (relY < 0.38) return "giant";
  if (relX < 0.3 && relY > 0.65) return "white-dwarf";
  return "main-sequence";
}

// Pedagogical classification used to sanity-check the data set.
export function classifyZone(tempK, luminosity) {
  if (luminosity >= 100 || (luminosity >= 50 && tempK <= 5000)) return "giant";
  if (tempK >= 8000 && luminosity <= 0.1) return "white-dwarf";
  return "main-sequence";
}

export function emptyState() {
  return {
    placements: {}, // starId -> zoneId
    answers: {}, // questionId -> optionIndex
    submitted: false,
  };
}

export function isComplete(state) {
  const allPlaced = STAR_DATA.every((s) => state.placements[s.id]);
  const allAnswered = QUESTIONS.every(
    (q) => typeof state.answers[q.id] === "number"
  );
  return allPlaced && allAnswered;
}

export function scoreState(state) {
  let score = 0;
  let starsCorrect = 0;
  for (const s of STAR_DATA) {
    if (state.placements[s.id] === s.zone) {
      starsCorrect++;
      score += 3 / STAR_DATA.length;
    }
  }
  let questionsCorrect = 0;
  for (const q of QUESTIONS) {
    if (state.answers[q.id] === q.correctIndex) {
      questionsCorrect++;
      score += 1;
    }
  }
  score = Math.round(score * 100) / 100;
  return {
    score,
    maxScore: 5,
    starsCorrect,
    totalStars: STAR_DATA.length,
    questionsCorrect,
    totalQuestions: QUESTIONS.length,
  };
}
