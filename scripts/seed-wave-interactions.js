// seed-wave-interactions.js
// Physics — Waves Unit, Lesson 4 (order: 4)
// "Wave Interactions"
// Run: node scripts/seed-wave-interactions.js

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
    icon: "🌀",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Describe reflection, refraction, and diffraction as wave behaviors at boundaries and obstacles",
      "Distinguish between constructive and destructive interference",
      "Apply the superposition principle to determine the resultant displacement of two overlapping waves",
      "Identify real-world applications of each wave interaction type",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** You've seen two people yelling at the same time — the room gets louder. But noise-canceling headphones can make two sounds cancel each other out completely. How is it possible for sound to create silence?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "What do you think happens when two waves collide? Do they bounce off each other like billiard balls, pass through each other, or something else entirely? Take a guess before we dive in.",
    difficulty: "remember",
  },

  // ─── REFLECTION ────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🪞",
    title: "Reflection",
    subtitle: "~6 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Reflection** occurs when a wave bounces off a boundary.\n\nThe angle of incidence equals the angle of reflection — the same rule you know from light bouncing off a mirror, but it applies to all waves.\n\n**Key features of reflection:**\n- The wave's speed, frequency, and wavelength are unchanged\n- The wave changes direction but not its properties\n- A wave hitting a fixed boundary reflects with its displacement inverted (a crest becomes a trough)\n- A wave hitting a free boundary reflects without inversion\n\n**Real-world examples:**\n- **Echo:** Sound reflects off a wall or mountain. You hear your voice back after a delay (time = 2 × distance / speed of sound)\n- **Sonar:** Ships send sound pulses toward the ocean floor. The reflection tells them the depth. Submarines use this to detect other vessels.\n- **Ultrasound imaging:** High-frequency sound pulses reflect off different tissues. The pattern of reflections creates a medical image.\n- **Seismic reflection:** Geologists bounce sound waves off underground rock layers to find oil deposits.\n- **Mirrors:** Light reflecting off smooth, flat surfaces.\n- **Radar:** Radio waves reflect off aircraft and return to the sender — time of return = distance",
  },

  {
    id: uid(), type: "definition",
    term: "Reflection",
    definition: "A wave bouncing back from a boundary. The angle of incidence equals the angle of reflection. The wave's speed, frequency, and wavelength are unchanged after reflecting.",
  },

  {
    id: "q-reflection", type: "question",
    questionType: "multiple_choice",
    prompt: "An echo occurs 1.2 seconds after a shout in a canyon. The speed of sound is 343 m/s. How far away is the canyon wall?",
    difficulty: "apply",
    options: [
      "411.6 m",
      "285.8 m",
      "205.8 m",
      "823.2 m",
    ],
    correctIndex: 2,
    explanation: "The sound travels TO the wall AND back — so total distance = v × t = 343 × 1.2 = 411.6 m. But that's the round trip. Distance to wall = 411.6 / 2 = 205.8 m. This is the same principle sonar and radar use.",
  },

  // ─── REFRACTION ────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🌊",
    title: "Refraction",
    subtitle: "~6 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Refraction** is the bending of a wave as it crosses from one medium into another.\n\nWhen a wave enters a new medium at an angle, one side of the wave front changes speed before the other — this causes the wave to bend toward or away from the boundary.\n\n**Rules:**\n- Wave enters a **slower** medium → bends **toward** the boundary (angle decreases)\n- Wave enters a **faster** medium → bends **away** from the boundary (angle increases)\n- Frequency stays the same; speed and wavelength change\n\n**Real-world examples:**\n- **Light through glass:** Light slows down in glass, bends toward the boundary → lenses, prisms, rainbows\n- **Ocean waves approaching shore:** Waves slow down in shallow water. Waves bend to approach shorelines nearly head-on, even if they started at an angle (that's why waves seem to always come straight in).\n- **Sound bending in the atmosphere:** Sound can bend toward or away from the ground depending on temperature gradients — this is why you can hear distant storms on humid nights.\n- **Mirage effect:** Light bends through layers of hot and cold air — creates the appearance of water on hot pavement\n- **Sonar bending in oceans:** Sound refracts through different temperature layers in the ocean, creating 'shadow zones' where submarines hide",
  },

  {
    id: uid(), type: "definition",
    term: "Refraction",
    definition: "The bending of a wave as it crosses from one medium into another with a different speed. The frequency remains constant; speed and wavelength change. Faster medium = wave bends away; slower medium = wave bends toward the boundary.",
  },

  {
    id: "q-refraction", type: "question",
    questionType: "multiple_choice",
    prompt: "Ocean waves traveling diagonally toward a beach slow down as the water gets shallower. The waves end up hitting the beach nearly straight-on, regardless of their original angle. This is an example of:",
    difficulty: "understand",
    options: [
      "Reflection — the beach bounces the waves back",
      "Diffraction — the waves bend around the beach",
      "Refraction — the waves bend as they enter shallower (slower) water",
      "Interference — the waves combine and form a new direction",
    ],
    correctIndex: 2,
    explanation: "Refraction. As waves enter shallower water, they slow down. The part of the wave that enters shallow water first slows down before the rest — this bends the whole wave toward the shore. The same principle explains why waves seem to come straight in regardless of original direction.",
  },

  // ─── DIFFRACTION ───────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🚪",
    title: "Diffraction",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Diffraction** is the bending of a wave around an obstacle or through an opening.\n\nAll waves diffract, but the effect is most noticeable when the obstacle or opening is **about the same size as the wavelength**.\n\n**When it's dramatic:** Opening ≈ wavelength → strong bending, waves spread out significantly\n**When it's minimal:** Opening >> wavelength → minimal bending (why light through a doorway barely bends — visible light's wavelength is ~500 nm, way smaller than the door)\n\n**Real-world examples:**\n- **Hearing around corners:** Sound has wavelengths of centimeters to meters — similar to door widths. Sound diffracts significantly, so you hear around walls and corners even when there's no direct path.\n- **WiFi through walls:** Radio waves have wavelengths of several centimeters — similar to gaps in walls and floors. They diffract through building structures well enough to cover your whole house.\n- **FM vs. AM radio around buildings:** AM radio (wavelength ~300 m) diffracts around buildings easily. FM radio (wavelength ~3 m) diffracts less — that's why FM reception fails in valleys and urban canyons more than AM.\n- **Sonar limitations:** Sonar with long wavelengths detects large objects but misses small ones. Bat echolocation uses very short wavelengths to detect tiny prey.",
  },

  {
    id: uid(), type: "definition",
    term: "Diffraction",
    definition: "The bending or spreading of a wave around an obstacle or through an opening. Most pronounced when the obstacle/opening size is comparable to the wavelength.",
  },

  {
    id: "q-diffraction", type: "question",
    questionType: "multiple_choice",
    prompt: "You can hear a conversation happening in the hallway around the corner from you, but you can't see the people talking. The best explanation is:",
    difficulty: "analyze",
    options: [
      "Sound travels faster than light around corners",
      "Sound diffracts around corners because its wavelength is comparable to hallway dimensions; light's wavelength is far too small to diffract around corners",
      "The walls reflect sound toward you but absorb light",
      "Sound is louder than light so it reaches farther",
    ],
    correctIndex: 1,
    explanation: "Diffraction depends on wavelength. Sound has wavelengths of centimeters to meters — comparable to hallway and door dimensions, so it diffracts strongly around corners. Light's wavelength is ~500 nm (nanometers), millions of times smaller than a hallway — essentially no diffraction around architectural features.",
  },

  // ─── SUPERPOSITION AND INTERFERENCE ───────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔀",
    title: "Superposition & Interference",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**The Superposition Principle:** When two or more waves overlap at the same point, the resultant displacement is the **sum** of the individual displacements.\n\nWaves pass through each other — after they interact, each wave continues on unchanged, as if the other was never there. But while they overlap, their effects add together.\n\n## Constructive Interference\nWhen two waves meet **in phase** (crests align with crests, troughs with troughs):\n- Displacements add up → **larger amplitude**\n- Waves reinforce each other\n- Result: brighter light, louder sound, taller water wave\n\n## Destructive Interference\nWhen two waves meet **out of phase** (crests align with troughs):\n- Displacements cancel → **smaller or zero amplitude**\n- Waves cancel each other\n- Result: dimmer light, quieter or silent sound, flatter water\n\n**Complete destructive interference** occurs when two waves with identical amplitudes meet perfectly out of phase (180° phase difference) — they cancel entirely to produce zero displacement.\n\n| Interference Type | Wave alignment | Result |\n|---|---|---|\n| Constructive | In phase (0°) | Amplitudes add — larger wave |\n| Partial constructive | Partially in phase | Intermediate amplitude |\n| Partial destructive | Partially out of phase | Reduced amplitude |\n| Destructive | Out of phase (180°) | Amplitudes cancel — flat line |",
  },

  {
    id: uid(), type: "definition",
    term: "Superposition Principle",
    definition: "When two or more waves overlap, the resultant displacement equals the algebraic sum of the individual displacements. Waves pass through each other unchanged after the overlap.",
  },

  {
    id: uid(), type: "definition",
    term: "Constructive Interference",
    definition: "When two waves overlap in phase (crest meets crest), their amplitudes add together, producing a wave with greater amplitude than either alone.",
  },

  {
    id: uid(), type: "definition",
    term: "Destructive Interference",
    definition: "When two waves overlap out of phase (crest meets trough), their amplitudes subtract, potentially canceling completely. Complete cancellation occurs when identical waves are perfectly out of phase (180°).",
  },

  {
    id: "q-superposition1", type: "question",
    questionType: "multiple_choice",
    prompt: "Two identical waves, each with amplitude 4 cm, meet at a point. At that moment, Wave A has a crest (+4 cm) and Wave B has a trough (−4 cm). The resultant displacement at that point is:",
    difficulty: "apply",
    options: [
      "+8 cm",
      "+4 cm",
      "0 cm",
      "−8 cm",
    ],
    correctIndex: 2,
    explanation: "Superposition: resultant = +4 cm + (−4 cm) = 0 cm. This is complete destructive interference — crest meets trough of equal amplitude, they cancel to zero. After this moment, both waves continue on unchanged.",
  },

  {
    id: "q-superposition2", type: "question",
    questionType: "multiple_choice",
    prompt: "Two waves interfere constructively to produce a resultant amplitude of 10 cm. After they pass through each other and separate, each wave has:",
    difficulty: "analyze",
    options: [
      "10 cm amplitude each — they split the energy",
      "5 cm amplitude each — they shared it equally",
      "Their original amplitudes, unchanged",
      "Zero amplitude — they used up their energy interfering",
    ],
    correctIndex: 2,
    explanation: "Waves pass through each other unchanged. The superposition is temporary — it only describes the resultant while they overlap. After separating, each wave continues with its original amplitude. Waves don't permanently affect each other.",
  },

  // ─── REAL-WORLD INTERFERENCE ───────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎧",
    title: "Interference in the Real World",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Interference isn't just a textbook concept — it powers real technology:\n\n**Noise-canceling headphones (destructive interference)**\nA microphone picks up ambient noise. The headphone's processor generates a sound wave that is perfectly out of phase with the noise. These two waves undergo destructive interference in your ear canal → silence. It's not blocking the sound — it's canceling it with math.\n\n**Concert speaker arrays (constructive interference)**\nProfessional concerts use multiple speakers positioned to create constructive interference at the audience. The speakers are timed and spaced so that sound waves arrive in phase at the listening area — amplifying the volume without adding more power.\n\n**Dead spots and hot spots in rooms**\nEver noticed some seats at a concert or gym where the sound is oddly quiet? Those are destructive interference zones — multiple sound reflections arrive out of phase. Other spots have extra-loud sound from constructive interference.\n\n**Thin film interference (light)**\nOil slicks and soap bubbles show rainbow colors. Light reflects off the top and bottom surfaces of the thin film. Depending on the film's thickness, different wavelengths undergo constructive interference (bright color) or destructive interference (dark). Different thicknesses produce different colors.\n\n**WiFi dead zones**\nWiFi signals reflect off walls and interfere — sometimes you get destructive interference in certain rooms, creating dead zones.",
  },

  {
    id: "q-noise-cancel", type: "question",
    questionType: "short_answer",
    prompt: "Noise-canceling headphones use destructive interference. Explain in detail how this works:\n(a) What does the microphone detect?\n(b) What wave does the headphone generate?\n(c) What happens when these two waves overlap in your ear canal?\n(d) Why doesn't the \"canceled\" sound travel back out of the headphone and make things worse?",
    difficulty: "evaluate",
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
    questionType: "sorting",
    leftLabel: "Constructive Interference",
    rightLabel: "Destructive Interference",
    items: [
      { text: "Two speakers produce louder sound together than either alone", correct: "left" },
      { text: "Noise-canceling headphones silence ambient noise", correct: "right" },
      { text: "A room has spots where sound is unusually quiet", correct: "right" },
      { text: "Concert speaker arrays maximize volume at the audience", correct: "left" },
      { text: "Two water waves produce a wave twice as tall", correct: "left" },
      { text: "Two light waves produce a dark fringe on a screen", correct: "right" },
    ],
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "Which wave behavior explains why you can hear a thunderstorm from 30 km away on a warm summer night, even though the storm is below the horizon?",
    difficulty: "analyze",
    options: [
      "Reflection — sound bounces off clouds back to Earth",
      "Diffraction — sound diffracts over the horizon",
      "Refraction — warm air at ground level and cool air above bends sound back toward Earth",
      "Interference — multiple thunder sounds constructively interfere",
    ],
    correctIndex: 2,
    explanation: "Refraction. On warm nights, cool air aloft makes sound travel faster at altitude. The wave front bends back toward Earth (toward the slower medium), allowing sound to travel along curved paths beyond the horizon. This same effect can make distant thunderstorms audible at night.",
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
    content: "**Four wave behaviors:**\n\n- **Reflection** — bounces off a boundary. Speed, frequency, wavelength unchanged. (Echoes, sonar, mirrors)\n- **Refraction** — bends when entering a new medium. Frequency unchanged; speed and wavelength change. (Lenses, ocean waves on shore, mirages)\n- **Diffraction** — bends around obstacles. Best when obstacle ≈ wavelength. (Hearing around corners, WiFi through walls)\n- **Interference** — when waves overlap, displacements add (superposition)\n  - Constructive: in phase → larger amplitude\n  - Destructive: out of phase → smaller or zero amplitude\n\n**Next class:** What happens when a wave is trapped between two fixed points and repeatedly reflects? → Standing waves and resonance.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** Two people yelling creates constructive interference — their sound waves reinforce each other. Noise-canceling headphones use destructive interference — the headphone generates a wave that is perfectly out of phase with the ambient noise. The two waves cancel in your ear canal. This requires a microphone, processor, and a speaker that continuously generates the exact anti-phase wave in real time.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Return to your warm-up guess about what happens when waves collide. Were you right? The answer — they pass through each other unchanged after overlapping — is called superposition. Does that match any intuition you had, or was it surprising?",
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
      { term: "Reflection", definition: "Wave bouncing off a boundary. Angle in = angle out. Speed, frequency, and wavelength unchanged." },
      { term: "Refraction", definition: "Wave bending as it enters a new medium (different speed). Frequency stays the same; speed and wavelength change." },
      { term: "Diffraction", definition: "Wave bending around obstacles or through openings. Most significant when obstacle size ≈ wavelength." },
      { term: "Superposition Principle", definition: "When waves overlap, resultant displacement = sum of individual displacements. Waves pass through each other unchanged after." },
      { term: "Constructive Interference", definition: "Waves overlap in phase → amplitudes add → larger amplitude." },
      { term: "Destructive Interference", definition: "Waves overlap out of phase → amplitudes subtract → reduced or zero amplitude." },
      { term: "In phase", definition: "Two waves are aligned so their crests and troughs coincide — leads to constructive interference." },
      { term: "Out of phase", definition: "Two waves are misaligned — crests of one meet troughs of the other — leads to destructive interference." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("wave-interactions");

  const data = {
    title: "Wave Interactions",
    questionOfTheDay: "You've seen two people yelling at the same time — the room gets louder. But noise-canceling headphones can make two sounds cancel each other out completely. How is it possible for sound to create silence?",
    course: "Physics",
    unit: "Waves",
    order: 4,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/wave-interactions`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
