// seed-waves-intro.js
// Physics — Waves Unit, Lesson 1 (order: 1)
// "Introduction to Waves"
// Run: node scripts/seed-waves-intro.js

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
    icon: "🌊",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Define a wave and explain what it transfers (energy, not matter)",
      "Distinguish between transverse and longitudinal waves with examples",
      "Identify the medium for different wave types",
      "Label wave anatomy: crest, trough, amplitude, wavelength, frequency, and period",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** When a sound wave travels from a speaker to your ear, does the air travel with it? How does the energy actually get to you?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "You've seen ocean waves, heard sound waves, and felt earthquake tremors. What do you think all waves have in common? What do you think a wave actually IS? Take your best guess before we dig in.",
    difficulty: "remember",
  },

  // ─── WHAT IS A WAVE ────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📡",
    title: "What Is a Wave?",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "A **wave** is a disturbance that transfers **energy** from one place to another through a medium — without transferring matter.\n\nThis is the key idea: **energy moves, matter doesn't.**\n\nWhen a wave passes through water, the water molecules bob up and down — but they don't travel with the wave. A boat floating on water bobs in place; the wave passes through it.\n\nWhen a sound wave moves through air, air molecules compress and expand — but the air itself doesn't fly across the room from the speaker to your ear.\n\n**The wave is the disturbance. The medium is what carries it.**",
  },

  {
    id: uid(), type: "definition",
    term: "Wave",
    definition: "A disturbance that transfers energy through a medium (or through space) without transferring matter. The medium oscillates but does not travel with the wave.",
  },

  {
    id: uid(), type: "definition",
    term: "Medium",
    definition: "The material through which a wave travels. Examples: air (sound waves), water (ocean waves), Earth's crust (seismic waves). Some waves (light, radio) can travel through a vacuum — no medium needed.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Energy without matter — think about it this way.** You're at a football game. The crowd does a wave. Each person stands up and sits down in place. Nobody moves around the stadium — but the wave travels all the way around. Energy transferred, matter stayed put. That's every wave in physics.",
  },

  {
    id: "q-energy-matter", type: "question",
    questionType: "multiple_choice",
    prompt: "A pebble is dropped into a pond and creates ripples. What travels outward from the pebble?",
    difficulty: "understand",
    options: [
      "Water molecules move outward, carrying energy",
      "Energy moves outward; water molecules mostly bob up and down in place",
      "Both water and energy travel outward together",
      "Neither — the energy stays at the point of impact",
    ],
    correctIndex: 1,
    explanation: "The wave carries energy outward — that's what makes a floating leaf bob when the ripple reaches it. But the water itself doesn't travel outward; it oscillates up and down locally. Waves transfer energy, not matter.",
  },

  // ─── TYPES OF WAVES ────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "↔️",
    title: "Types of Waves",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Waves are classified by **how the medium moves relative to the direction the wave travels**.\n\n## Transverse Waves\nThe medium moves **perpendicular** (at right angles) to the direction of wave travel.\n\n- Shake a rope up and down → the wave travels horizontally → the rope moves vertically = transverse\n- **Examples:** waves on a string, light, ocean surface waves, seismic S-waves\n\n## Longitudinal Waves\nThe medium moves **parallel** (in the same direction) to the direction of wave travel.\n\n- Push and pull a slinky along its length → compressions and rarefactions travel along the slinky = longitudinal\n- **Examples:** sound waves, seismic P-waves (these travel through Earth's interior)\n\n| Feature | Transverse | Longitudinal |\n|---|---|---|\n| Medium motion | Perpendicular to wave | Parallel to wave |\n| Visual pattern | Crests and troughs | Compressions and rarefactions |\n| Can travel in vacuum? | Yes (light) | No (sound needs a medium) |\n| Examples | Light, water waves, strings | Sound, P-waves, ultrasound |",
  },

  {
    id: uid(), type: "definition",
    term: "Transverse Wave",
    definition: "A wave in which the medium's particles vibrate perpendicular (at right angles) to the direction of wave travel. Example: a wave on a rope — the rope moves up/down while the wave travels sideways.",
  },

  {
    id: uid(), type: "definition",
    term: "Longitudinal Wave",
    definition: "A wave in which the medium's particles vibrate parallel to (in the same direction as) the wave's travel. Contains compressions (high density) and rarefactions (low density). Example: sound.",
  },

  {
    id: uid(), type: "definition",
    term: "Compression",
    definition: "A region in a longitudinal wave where particles are pushed close together — high pressure, high density. Like the squeezed section of a slinky.",
  },

  {
    id: uid(), type: "definition",
    term: "Rarefaction",
    definition: "A region in a longitudinal wave where particles are spread apart — low pressure, low density. Like the stretched section of a slinky between compressions.",
  },

  {
    id: "q-wave-type", type: "question",
    questionType: "sorting",
    leftLabel: "Transverse",
    rightLabel: "Longitudinal",
    items: [
      { text: "Ocean surface wave", correct: "left" },
      { text: "Sound from a speaker", correct: "right" },
      { text: "Light from the sun", correct: "left" },
      { text: "P-wave traveling through Earth's core", correct: "right" },
      { text: "Guitar string vibrating", correct: "left" },
      { text: "Ultrasound imaging wave", correct: "right" },
      { text: "S-wave from an earthquake", correct: "left" },
      { text: "Slinky pushed and pulled along its length", correct: "right" },
    ],
  },

  // ─── WAVE ANATOMY ──────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "Wave Anatomy",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Every transverse wave can be described with these measurements:\n\n## Crest & Trough\n- **Crest:** The highest point of the wave (maximum positive displacement)\n- **Trough:** The lowest point of the wave (maximum negative displacement)\n\n## Amplitude (A)\n- The maximum displacement of the medium from its equilibrium (rest) position\n- Measured from equilibrium to crest (or equilibrium to trough)\n- **Amplitude is related to energy.** A bigger amplitude = more energy in the wave\n- Units: meters (m) for mechanical waves\n\n## Wavelength (λ)\n- The distance of one complete wave cycle — measured from crest to crest, trough to trough, or any point to the next identical point\n- Symbol: λ (lambda, Greek letter)\n- Units: meters (m)\n\n## Frequency (f)\n- The number of complete wave cycles that pass a point per second\n- Symbol: f\n- Units: **hertz (Hz)** — 1 Hz = 1 cycle per second\n- Higher frequency = more waves per second = higher pitched sound, higher energy\n\n## Period (T)\n- The time it takes for one complete wave cycle\n- Symbol: T\n- Units: seconds (s)\n- Period and frequency are **reciprocals**: T = 1/f and f = 1/T",
  },

  {
    id: uid(), type: "definition",
    term: "Crest",
    definition: "The highest point of a transverse wave — maximum positive displacement from equilibrium.",
  },

  {
    id: uid(), type: "definition",
    term: "Trough",
    definition: "The lowest point of a transverse wave — maximum negative displacement from equilibrium.",
  },

  {
    id: uid(), type: "definition",
    term: "Amplitude (A)",
    definition: "The maximum displacement of a wave from its equilibrium position. Measured from equilibrium to crest (or trough). Larger amplitude = more energy. Unit: meters (m).",
  },

  {
    id: uid(), type: "definition",
    term: "Wavelength (λ)",
    definition: "The distance of one complete wave cycle — crest to crest, or any point to the next identical point. Symbol: λ (lambda). Unit: meters (m).",
  },

  {
    id: uid(), type: "definition",
    term: "Frequency (f)",
    definition: "The number of complete wave cycles per second. Unit: hertz (Hz). 1 Hz = 1 cycle/second. Higher frequency = more cycles per second.",
  },

  {
    id: uid(), type: "definition",
    term: "Period (T)",
    definition: "The time for one complete wave cycle to pass a point. T = 1/f. Unit: seconds (s). Period and frequency are reciprocals.",
  },

  {
    id: "q-anatomy1", type: "question",
    questionType: "multiple_choice",
    prompt: "A student observes that 20 waves pass a fixed point in 4 seconds. What is the frequency of the wave?",
    difficulty: "apply",
    options: [
      "80 Hz",
      "0.2 Hz",
      "5 Hz",
      "4 Hz",
    ],
    correctIndex: 2,
    explanation: "Frequency = cycles per second = 20 waves ÷ 4 seconds = 5 Hz. Five complete waves pass every second.",
  },

  {
    id: "q-anatomy2", type: "question",
    questionType: "multiple_choice",
    prompt: "Two waves have the same frequency. Wave A has twice the amplitude of Wave B. Which is true?",
    difficulty: "understand",
    options: [
      "Wave A has twice the wavelength",
      "Wave A travels twice as fast",
      "Wave A carries more energy",
      "Wave A has a shorter period",
    ],
    correctIndex: 2,
    explanation: "Amplitude is related to energy — double the amplitude means more energy in the wave. Frequency and amplitude are independent. Two waves with the same frequency can have very different amplitudes (and therefore different energies).",
  },

  // ─── WAVE EXAMPLES IN THE REAL WORLD ──────────────────

  {
    id: uid(), type: "section_header",
    icon: "🌍",
    title: "Waves in the Real World",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Waves are everywhere. Here are some you encounter daily:\n\n| Wave Type | Category | Medium | Everyday Example |\n|---|---|---|---|\n| Sound | Longitudinal | Air, water, solid | Music, speech, ultrasound |\n| Light | Transverse | No medium (vacuum ok) | Sunlight, screens, lasers |\n| Radio / WiFi | Transverse | No medium | Phone signals, internet |\n| Seismic P-wave | Longitudinal | Earth's interior | Earthquake primary waves |\n| Seismic S-wave | Transverse | Earth's crust/mantle | Earthquake secondary waves |\n| Ocean waves | Transverse (mostly) | Water | Surfing, tsunamis |\n| Ultrasound | Longitudinal | Tissue/fluid | Medical imaging, sonar |\n\n**Why do P-waves travel faster than S-waves?** P-waves are longitudinal — they compress and expand the medium directly, which is faster. S-waves shake the medium sideways — slower but more destructive. Geologists use this time difference to locate earthquake epicenters.",
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
    prompt: "A wave has a period of 0.025 seconds. What is its frequency?",
    difficulty: "apply",
    options: [
      "25 Hz",
      "400 Hz",
      "40 Hz",
      "0.025 Hz",
    ],
    correctIndex: 2,
    explanation: "f = 1/T = 1/0.025 = 40 Hz. Period and frequency are reciprocals — a wave with a very short period has a high frequency.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "An earthquake produces two types of seismic waves. Scientists detect the P-wave before the S-wave at a monitoring station. What explains this?",
    difficulty: "analyze",
    options: [
      "P-waves have higher amplitude and more energy",
      "S-waves need a medium, but P-waves don't",
      "P-waves are longitudinal and travel faster through rock than transverse S-waves",
      "P-waves are produced first by the earthquake",
    ],
    correctIndex: 2,
    explanation: "P-waves (primary waves) are longitudinal — they compress and expand rock, which is faster than S-waves (secondary waves) that shake rock sideways. Both are produced simultaneously; the speed difference creates the time gap at the detector.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "short_answer",
    prompt: "A sound wave is a longitudinal wave in air. Sketch or describe (in words) what the air molecules look like as the sound wave passes through. Label: (a) a compression, (b) a rarefaction, (c) the wavelength. Where is the crest equivalent for a sound wave?",
    difficulty: "analyze",
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
    content: "**Big ideas from today:**\n\n- A wave transfers **energy**, not matter\n- The **medium** carries the wave — matter oscillates, doesn't travel\n- **Transverse:** medium moves perpendicular to wave travel (light, strings, water)\n- **Longitudinal:** medium moves parallel to wave travel (sound, P-waves)\n- **Amplitude** → energy | **Wavelength (λ)** → size of one cycle | **Frequency (f)** → cycles per second | **Period (T)** = 1/f\n\n**Next class:** We put numbers to waves — wave speed equation (v = fλ) and period-frequency math.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** When sound travels from a speaker, the air molecules don't travel across the room — they compress and expand in place, passing the disturbance along like a chain reaction. The compressions and rarefactions move from speaker to your ear, carrying energy. Your eardrum detects the pressure variations and your brain interprets them as sound. Energy transferred; air stayed put.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your original guess about what waves are and what they transfer. How close were you? What's the most surprising thing you learned today?",
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
      { term: "Wave", definition: "A disturbance that transfers energy through a medium without transferring matter." },
      { term: "Medium", definition: "The material through which a wave travels. Air, water, rock, rope." },
      { term: "Transverse wave", definition: "Medium vibrates perpendicular to wave travel. Examples: light, water waves, strings." },
      { term: "Longitudinal wave", definition: "Medium vibrates parallel to wave travel. Examples: sound, P-waves." },
      { term: "Compression", definition: "Region of high pressure/density in a longitudinal wave — particles pushed together." },
      { term: "Rarefaction", definition: "Region of low pressure/density in a longitudinal wave — particles spread apart." },
      { term: "Crest", definition: "Highest point of a transverse wave." },
      { term: "Trough", definition: "Lowest point of a transverse wave." },
      { term: "Amplitude (A)", definition: "Maximum displacement from equilibrium. Related to energy. Larger amplitude = more energy." },
      { term: "Wavelength (λ)", definition: "Distance of one complete wave cycle, crest to crest. Unit: meters." },
      { term: "Frequency (f)", definition: "Cycles per second. Unit: hertz (Hz). Higher frequency = more cycles per second." },
      { term: "Period (T)", definition: "Time for one complete cycle. T = 1/f. Unit: seconds." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("waves-intro");

  const data = {
    title: "Introduction to Waves",
    questionOfTheDay: "When a sound wave travels from a speaker to your ear, does the air travel with it? How does the energy actually get to you?",
    course: "Physics",
    unit: "Waves",
    order: 1,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/waves-intro`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
