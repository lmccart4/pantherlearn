// seed-standing-waves.js
// Physics — Waves Unit, Lesson 5 (order: 5)
// "Standing Waves & Resonance"
// Run: node scripts/seed-standing-waves.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── WARM UP ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎸",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Explain how standing waves form from constructive interference of reflected waves",
      "Identify nodes and antinodes in a standing wave pattern",
      "Describe the harmonic series for a string fixed at both ends and calculate harmonic wavelengths",
      "Define resonance and explain why certain frequencies cause dramatic amplitude amplification",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Why do some wine glasses shatter when an opera singer hits exactly the right note? And why does blowing across the top of an empty bottle make a musical tone?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "Pluck a guitar string. It vibrates and makes sound. The string is fixed at both ends — it can't move at the bridge or the nut. What do you think happens to the wave when it reaches the fixed end of the string? Does it stop? Bounce? Something else?",
    difficulty: "understand",
  },

  // ─── HOW STANDING WAVES FORM ───────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "↩️",
    title: "How Standing Waves Form",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "When you pluck a guitar string, you create a wave that travels to the fixed end and **reflects back**. Now you have two waves:\n- The **original wave** traveling forward\n- The **reflected wave** traveling backward\n\nThese two waves superpose (add together). At most frequencies, they create a jumbled, chaotic pattern.\n\nBut at **specific frequencies**, the waves line up just right: the reflected wave is perfectly in phase with new waves coming from the source. At these frequencies, the waves **reinforce each other** repeatedly — constructive interference — and the amplitude builds to a stable pattern.\n\nThe result is a **standing wave**: a pattern that appears to stand still even though the waves are constantly traveling and reflecting.\n\n**Why does it look stationary?**\nThe two waves (forward + reflected) of the same frequency and amplitude create regions that:\n- **Never move:** called **nodes** (zero displacement always)\n- **Oscillate maximally:** called **antinodes** (maximum displacement)\n\nThe overall pattern doesn't travel — it stands. Hence the name.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Standing waves = interference of reflected waves.** This is not a new kind of wave — it's a consequence of the wave behaviors you already know: reflection (from Lesson 4) + superposition (from Lesson 4). When the geometry is just right, the pattern locks into a stable standing wave.",
  },

  {
    id: uid(), type: "definition",
    term: "Standing Wave",
    definition: "A wave pattern that appears stationary, formed by the superposition of two identical waves traveling in opposite directions. Contains alternating nodes (no displacement) and antinodes (maximum displacement).",
  },

  {
    id: uid(), type: "definition",
    term: "Node",
    definition: "A point in a standing wave with zero displacement at all times. The two waves always cancel at this point (destructive interference). Fixed ends of a string are always nodes.",
  },

  {
    id: uid(), type: "definition",
    term: "Antinode",
    definition: "A point in a standing wave with maximum displacement — the point oscillates with the greatest amplitude. Located exactly halfway between adjacent nodes.",
  },

  {
    id: "q-node-antinode", type: "question",
    questionType: "multiple_choice",
    prompt: "In a standing wave on a guitar string, where are the nodes located?",
    difficulty: "remember",
    options: [
      "At the midpoint of the string, where vibration is greatest",
      "At the fixed ends of the string, and at other fixed points that don't move",
      "Only at the midpoint — strings always have one node",
      "Nodes move continuously along the string as the wave propagates",
    ],
    correctIndex: 1,
    explanation: "Nodes are points of zero displacement — the string literally doesn't move there. The fixed ends are always nodes (they can't move). Additional nodes appear at regular intervals depending on the harmonic. Antinodes are in between, oscillating with maximum amplitude.",
  },

  // ─── HARMONICS ─────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎵",
    title: "Harmonics",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Not just any frequency creates a standing wave. Only frequencies where the wave **fits perfectly** between the two fixed ends — where the ends are both nodes.\n\nFor a string of length L fixed at both ends:\n\n## 1st Harmonic (Fundamental)\n- One antinode, two nodes (at the ends)\n- Half a wavelength fits: **L = λ₁/2**, so **λ₁ = 2L**\n- Lowest possible frequency: **f₁ = v / 2L**\n- This is the fundamental frequency — the \"home base\" of the string\n\n## 2nd Harmonic\n- Two antinodes, three nodes\n- One full wavelength fits: **L = λ₂**, so **λ₂ = L**\n- Frequency: **f₂ = v/L = 2f₁** (exactly twice the fundamental)\n\n## 3rd Harmonic\n- Three antinodes, four nodes\n- 1.5 wavelengths fit: **L = 3λ₃/2**, so **λ₃ = 2L/3**\n- Frequency: **f₃ = 3v/2L = 3f₁** (three times the fundamental)\n\n## The Pattern\n- Allowed wavelengths: **λₙ = 2L/n** (n = 1, 2, 3, ...)\n- Allowed frequencies: **fₙ = n × f₁**\n- Harmonics are integer multiples of the fundamental frequency\n\n| Harmonic | n | Nodes | Antinodes | Wavelength | Frequency |\n|---|---|---|---|---|---|\n| 1st (Fundamental) | 1 | 2 | 1 | 2L | f₁ |\n| 2nd | 2 | 3 | 2 | L | 2f₁ |\n| 3rd | 3 | 4 | 3 | 2L/3 | 3f₁ |\n| 4th | 4 | 5 | 4 | L/2 | 4f₁ |\n| nth | n | n+1 | n | 2L/n | nf₁ |",
  },

  {
    id: uid(), type: "definition",
    term: "Harmonic",
    definition: "A standing wave pattern at a specific allowed frequency. The 1st harmonic (fundamental) has the lowest frequency; higher harmonics are integer multiples of the fundamental. fₙ = n × f₁.",
  },

  {
    id: uid(), type: "definition",
    term: "Fundamental Frequency",
    definition: "The lowest frequency at which a standing wave can form in a given medium/instrument — the 1st harmonic. f₁ = v/2L for a string fixed at both ends. All harmonics are multiples of f₁.",
  },

  {
    id: uid(), type: "calculator",
    title: "Fundamental Frequency of a String",
    description: "Calculate the fundamental frequency of a string fixed at both ends.\n\nf₁ = v / (2L)",
    formula: "v / (2 * L)",
    showFormula: true,
    inputs: [
      { name: "v", label: "Wave speed in string", unit: "m/s" },
      { name: "L", label: "Length of string", unit: "m" },
    ],
    output: { label: "Fundamental frequency (f₁)", unit: "Hz", decimals: 2 },
  },

  {
    id: "q-harmonics1", type: "question",
    questionType: "short_answer",
    prompt: "A guitar string is 0.65 m long. Waves travel through it at 400 m/s.\n\n(a) What is the fundamental frequency (1st harmonic)?\n(b) What is the frequency of the 2nd harmonic?\n(c) What is the frequency of the 3rd harmonic?\n(d) The string is tuned by tightening it (increasing wave speed). If wave speed increases to 500 m/s, what is the new fundamental frequency?\n\nUse the calculator for (a), then show your math for (b), (c), and (d).",
    difficulty: "apply",
  },

  {
    id: "q-harmonics2", type: "question",
    questionType: "multiple_choice",
    prompt: "A guitar player presses their finger at the midpoint of the string before plucking. This forces a node at the midpoint. What is the lowest harmonic that can now form?",
    difficulty: "analyze",
    options: [
      "1st harmonic — the fundamental always forms",
      "2nd harmonic — the midpoint node is consistent with the 2nd harmonic pattern",
      "3rd harmonic — you need three nodes minimum",
      "No harmonics can form with a forced midpoint node",
    ],
    correctIndex: 1,
    explanation: "The 2nd harmonic has three nodes: both ends plus the midpoint. Forcing a node at the midpoint is exactly what the 2nd harmonic requires — so the lowest possible harmonic is the 2nd, with frequency 2f₁. This is what guitarists do to play 'harmonics' — a bright, bell-like sound an octave higher than the open string.",
  },

  // ─── RESONANCE ─────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔔",
    title: "Resonance",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Every object has one or more **natural frequencies** — the frequencies at which it will naturally vibrate when disturbed.\n\nA tuning fork, a wine glass, a bridge, a building — each has specific natural frequencies.\n\n**Resonance** occurs when an external periodic force drives an object at (or near) its natural frequency. When this happens:\n- Each push adds to the previous vibration\n- Amplitude builds with every cycle\n- The amplitude can grow dramatically — far larger than from a single push\n\nIt's like pushing a child on a swing:\n- **Random pushes:** some help, some fight the motion — amplitude stays small\n- **Pushes at the natural frequency:** each push adds to the last — amplitude grows\n\n**The math: maximum energy transfer happens at natural frequency.**\n\n**Dramatic examples of resonance:**\n\n**Shattering a wine glass:**\nA wine glass has a specific natural frequency. When a singer produces that exact frequency at high amplitude, the glass vibrates resonantly. The amplitude builds each cycle until the glass can't withstand the stress and shatters.\n\n**Tacoma Narrows Bridge (1940):**\nThe Tacoma Narrows Bridge in Washington collapsed after wind created oscillations at the bridge's natural frequency. The bridge swung wider and wider — resonance — until it tore itself apart 4 months after opening. Engineers now design bridges to avoid resonance frequencies.\n\n**Organ pipes and bottles:**\nA column of air in a tube has natural frequencies based on length. Blowing across the top creates turbulence at many frequencies — only the natural frequency resonates and amplifies. Change the length (partially fill with water) → different natural frequency → different pitch.",
  },

  {
    id: uid(), type: "definition",
    term: "Natural Frequency",
    definition: "The frequency at which an object naturally vibrates when disturbed. Determined by the object's physical properties (mass, stiffness, size). Every object has one or more natural frequencies.",
  },

  {
    id: uid(), type: "definition",
    term: "Resonance",
    definition: "The dramatic increase in amplitude that occurs when an object is driven at (or near) its natural frequency. Each driving force cycle adds energy in sync with the object's motion, causing amplitude to build rapidly.",
  },

  {
    id: "q-resonance1", type: "question",
    questionType: "multiple_choice",
    prompt: "Why does a wine glass shatter at a specific frequency, even though louder sounds at other frequencies don't break it?",
    difficulty: "analyze",
    options: [
      "The specific frequency has higher amplitude than any other sound",
      "That frequency is too high for glass to handle, while lower frequencies are safe",
      "At the glass's natural frequency, resonance causes the amplitude to build each cycle until the stress exceeds the glass's breaking point",
      "Glass absorbs energy at its natural frequency, heating up and melting",
    ],
    correctIndex: 2,
    explanation: "Resonance. The sound's frequency matches the glass's natural frequency. Each sound wave arrives just in time to reinforce the previous vibration. The amplitude grows each cycle — the glass vibrates harder and harder until the material stress exceeds its limit and it fractures. A different frequency, even louder, doesn't sync up and so doesn't build amplitude the same way.",
  },

  {
    id: "q-resonance2", type: "question",
    questionType: "multiple_choice",
    prompt: "You want to fill a wine glass with water to change its pitch (natural frequency). As you add more water, the glass's natural frequency:",
    difficulty: "analyze",
    options: [
      "Increases — more water means more mass to vibrate, creating faster oscillations",
      "Decreases — more mass means slower natural vibration, lower frequency",
      "Stays the same — the glass wall material determines frequency, not water level",
      "Doubles each time you add water",
    ],
    correctIndex: 1,
    explanation: "Adding water increases the effective mass of the vibrating system. More mass → lower natural frequency (same principle as a heavier pendulum swinging slower). That's why a fuller glass produces a lower note. This is also how glass harmonica instruments work — different water levels in glasses produce different musical pitches.",
  },

  {
    id: "q-resonance3", type: "question",
    questionType: "short_answer",
    prompt: "The Tacoma Narrows Bridge (1940) collapsed due to resonance. Wind created oscillations at the bridge's natural frequency, causing amplitude to grow until the bridge tore apart.\n\n(a) Explain why matching the natural frequency caused larger oscillations than wind at other frequencies.\n(b) Modern bridges are designed with specific features to prevent resonance. What strategies might engineers use? (Think about what determines natural frequency — could you change those properties?)\n(c) Why would it be a bad idea to march in step across a suspension bridge? What should soldiers do instead?",
    difficulty: "evaluate",
  },

  // ─── MUSICAL INSTRUMENTS ───────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎻",
    title: "Music and Standing Waves",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Every musical instrument uses standing waves:\n\n**Stringed instruments (guitar, violin, piano):**\n- String fixed at both ends → standing wave pattern\n- Thicker strings → lower speed → lower fundamental frequency\n- Shorter string → higher fundamental frequency (guitarists press frets to shorten the string)\n- Higher tension → higher wave speed → higher frequency\n\n**Wind instruments (flute, trumpet, organ):**\n- Column of air in a tube resonates\n- Open pipe (flute): both ends are antinodes → same harmonic math as strings\n- Closed pipe (clarinet): one closed end is a node, one open end is an antinode → only odd harmonics\n- Change tube length → change natural frequency → change pitch\n\n**Percussion (drums, bells, xylophones):**\n- 2D standing wave patterns in membranes and bars\n- More complex than strings, but same principle — only certain frequencies fit the geometry\n\n**Why instruments sound different (timbre):**\nTwo instruments can play the same note (same fundamental frequency) but sound completely different. That's because they emphasize different harmonics (overtones). A guitar and a flute playing A440 both vibrate at 440 Hz — but the guitar has strong 2nd and 3rd harmonics that the flute doesn't, giving them different tone colors (timbre).",
  },

  // ─── CHECK YOUR UNDERSTANDING ──────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✅",
    title: "Check Your Understanding",
    subtitle: "~5 minutes",
  },

  {
    id: "q-check1", type: "question",
    questionType: "multiple_choice",
    prompt: "A standing wave on a 1.2 m string has 4 nodes (including both fixed ends). How many antinodes does it have, and what harmonic is this?",
    difficulty: "apply",
    options: [
      "3 antinodes, 3rd harmonic",
      "4 antinodes, 4th harmonic",
      "2 antinodes, 2nd harmonic",
      "3 antinodes, 4th harmonic",
    ],
    correctIndex: 0,
    explanation: "For the nth harmonic: nodes = n+1, antinodes = n. With 4 nodes: n = 3, so this is the 3rd harmonic with 3 antinodes. The wavelength is 2L/3 = 2(1.2)/3 = 0.8 m.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "A guitar is tuned by tightening the strings (which increases the wave speed in the string). What happens to the harmonics when the string is tightened?",
    difficulty: "analyze",
    options: [
      "All harmonic frequencies decrease — more tension means heavier string",
      "All harmonic frequencies increase — higher wave speed raises all harmonics proportionally",
      "Only the fundamental changes — harmonics are independent",
      "The wavelengths increase but frequencies stay the same",
    ],
    correctIndex: 1,
    explanation: "fₙ = n × v/(2L). If wave speed v increases (from tightening), then all harmonics fₙ increase proportionally. The fundamental goes up in pitch, and all the overtones (2nd, 3rd harmonics) go up proportionally. That's why tightening a string raises the pitch of the whole instrument.",
  },

  // ─── WRAP UP ───────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Key ideas from today:**\n\n- **Standing waves** form when reflected waves superpose at specific frequencies\n- **Nodes:** no displacement (always at fixed ends) | **Antinodes:** maximum displacement\n- **Harmonics:** fₙ = n × f₁. Only integer multiples of the fundamental fit the boundary conditions\n- **Fundamental (1st harmonic):** f₁ = v/(2L) for string fixed at both ends; λ₁ = 2L\n- **Resonance:** amplitude explodes when driving frequency = natural frequency. Powers music, breaks bridges, used in medicine.\n\n**The unit wraps up with a full assessment next class.** Review: wave anatomy, v = fλ, T = 1/f, sound properties, four wave interactions (reflection, refraction, diffraction, interference), and standing waves/resonance.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** The wine glass shatters because its natural frequency matches the singer's note exactly — resonance builds the amplitude until the glass can't handle the stress. The bottle hum: blowing across the opening creates turbulence that excites many frequencies. Only the bottle's natural frequency (determined by air column length inside) resonates and amplifies — all other frequencies die out. Partially fill the bottle with water to shorten the air column → higher natural frequency → higher pitch.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Go back to your warm-up about what happens to a wave at a fixed end. Now that you know — the wave reflects and travels back — explain why that makes standing waves possible. What would happen if the string just absorbed the wave at the end instead of reflecting it?",
    difficulty: "evaluate",
    linkedBlockId: "q-warmup",
  },

  // ─── VOCABULARY ────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📖",
    title: "Key Vocabulary",
    subtitle: "",
  },

  {
    id: uid(), type: "vocab_list",
    terms: [
      { term: "Standing Wave", definition: "A stationary wave pattern formed by superposition of two identical waves traveling in opposite directions. Has nodes and antinodes." },
      { term: "Node", definition: "Point in a standing wave with zero displacement at all times. Fixed ends are always nodes." },
      { term: "Antinode", definition: "Point in a standing wave with maximum displacement. Located midway between adjacent nodes." },
      { term: "Harmonic", definition: "A standing wave mode at a specific allowed frequency. fₙ = n × f₁. Higher harmonics = higher frequencies." },
      { term: "Fundamental Frequency", definition: "The lowest resonant frequency — 1st harmonic. f₁ = v/(2L) for string fixed at both ends." },
      { term: "Natural Frequency", definition: "The frequency at which an object naturally vibrates when disturbed. Determined by physical properties." },
      { term: "Resonance", definition: "Dramatic amplitude increase when a driving frequency matches the natural frequency. Energy adds up each cycle." },
      { term: "Timbre", definition: "The characteristic tone quality of an instrument — determined by the mix of harmonics (overtones) it produces." },
      { term: "Overtone", definition: "Any harmonic above the fundamental. A string's rich sound comes from vibrating at the fundamental plus multiple overtones simultaneously." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("standing-waves");

  const data = {
    title: "Standing Waves & Resonance",
    questionOfTheDay: "Why do some wine glasses shatter when an opera singer hits exactly the right note? And why does blowing across an empty bottle make a musical tone?",
    course: "Physics",
    unit: "Waves",
    order: 5,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/standing-waves`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
