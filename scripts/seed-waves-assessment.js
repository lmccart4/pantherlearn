// seed-waves-assessment.js
// Physics — Waves Unit, Lesson 6 (order: 6)
// "Waves Unit Assessment"
// Run: node scripts/seed-waves-assessment.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── HEADER ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📝",
    title: "Waves Unit Assessment",
    subtitle: "Take your time. Show all work on calculation questions.",
  },

  {
    id: "objectives", type: "objectives",
    title: "Assessment Coverage",
    items: [
      "Section 1 — Vocabulary & Wave Concepts (~30%): definitions, wave types, anatomy",
      "Section 2 — Wave Speed Math (~25%): v = fλ, T = 1/f, proportional reasoning",
      "Section 3 — Sound & Wave Interactions (~25%): Doppler effect, interference, media",
      "Section 4 — Standing Waves & Resonance (~20%): nodes, harmonics, resonance",
      "Bonus — Open ended explain/design question (+5%)",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Instructions:** Answer every question. For multiple choice questions, select the best answer. For short answer questions, show all work and explain your reasoning. Partial credit is available on calculation questions if you show your work.",
  },

  // ─── SECTION 1: VOCABULARY & WAVE CONCEPTS ─────────────

  {
    id: uid(), type: "section_header",
    icon: "📚",
    title: "Section 1 — Vocabulary & Wave Concepts",
    subtitle: "Questions 1–6",
  },

  {
    id: "q1", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q1.** A wave is best described as:",
    difficulty: "remember",
    options: [
      "The movement of matter from one place to another",
      "A disturbance that transfers energy through a medium without transferring matter",
      "A back-and-forth motion that produces heat",
      "The compression of air molecules in a single direction",
    ],
    correctIndex: 1,
    explanation: "A wave transfers energy, not matter. The medium oscillates in place — it doesn't travel with the wave.",
  },

  {
    id: "q2", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q2.** Which of the following is an example of a LONGITUDINAL wave?",
    difficulty: "remember",
    options: [
      "A wave on a guitar string",
      "Light from the sun",
      "Sound traveling through air",
      "A wave on the surface of the ocean",
    ],
    correctIndex: 2,
    explanation: "Sound is a longitudinal wave — air molecules compress and expand parallel to the direction of wave travel. The others are transverse waves (medium vibrates perpendicular to wave travel).",
  },

  {
    id: "q3", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q3.** A wave has crests separated by 0.8 m, and 5 complete waves pass a point every second. What are the wavelength and frequency of this wave?",
    difficulty: "remember",
    options: [
      "λ = 5 m, f = 0.8 Hz",
      "λ = 0.8 m, f = 5 Hz",
      "λ = 0.8 m, f = 0.2 Hz",
      "λ = 4 m, f = 5 Hz",
    ],
    correctIndex: 1,
    explanation: "Wavelength = distance from crest to crest = 0.8 m. Frequency = cycles per second = 5 Hz. These are direct definitions.",
  },

  {
    id: "q4", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q4.** Which wave property is most directly related to the amount of energy a wave carries?",
    difficulty: "understand",
    options: [
      "Wavelength",
      "Frequency",
      "Amplitude",
      "Wave speed",
    ],
    correctIndex: 2,
    explanation: "Amplitude is directly related to energy. A larger amplitude means the medium is displaced more — more energy per wave. Louder sounds and brighter light both have larger amplitudes.",
  },

  {
    id: "q5", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q5.** The period of a wave is 0.04 seconds. What is its frequency?",
    difficulty: "apply",
    options: [
      "4 Hz",
      "0.04 Hz",
      "25 Hz",
      "250 Hz",
    ],
    correctIndex: 2,
    explanation: "f = 1/T = 1/0.04 = 25 Hz. Period and frequency are always reciprocals.",
  },

  {
    id: "q6", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q6.** An ocean wave has its highest points at equal intervals. These highest points are called _____, and the lowest points are called _____.",
    difficulty: "remember",
    options: [
      "compressions and rarefactions",
      "antinodes and nodes",
      "crests and troughs",
      "amplitudes and wavelengths",
    ],
    correctIndex: 2,
    explanation: "Crests are the highest points of a transverse wave; troughs are the lowest. Compressions and rarefactions describe longitudinal waves. Nodes and antinodes describe standing waves.",
  },

  // ─── SECTION 2: WAVE SPEED MATH ────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧮",
    title: "Section 2 — Wave Speed Math",
    subtitle: "Questions 7–11 | Show all work for full credit",
  },

  {
    id: "q7", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q7.** A wave has a frequency of 200 Hz and travels at 340 m/s. What is its wavelength?",
    difficulty: "apply",
    options: [
      "68,000 m",
      "1.7 m",
      "0.588 m",
      "5.88 m",
    ],
    correctIndex: 1,
    explanation: "λ = v/f = 340/200 = 1.7 m. The wave equation rearranged: if you know speed and frequency, divide to get wavelength.",
  },

  {
    id: "q8", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q8.** A sound wave has wavelength 2 m and period 0.006 s. What is the wave speed?",
    difficulty: "apply",
    options: [
      "333 m/s",
      "120 m/s",
      "0.003 m/s",
      "12,000 m/s",
    ],
    correctIndex: 0,
    explanation: "f = 1/T = 1/0.006 ≈ 166.7 Hz. v = fλ = 166.7 × 2 ≈ 333 m/s. Alternatively: v = λ/T = 2/0.006 = 333 m/s. (This is close to the speed of sound in air at 0°C.)",
  },

  {
    id: "q9", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q9.** Two sound waves travel through the same room at 343 m/s. Wave X has frequency 100 Hz. Wave Y has frequency 500 Hz. The wavelength of Wave Y compared to Wave X is:",
    difficulty: "apply",
    options: [
      "5 times longer",
      "5 times shorter",
      "The same — same medium, same wavelength",
      "25 times shorter (inverse square)",
    ],
    correctIndex: 1,
    explanation: "Same speed, 5× the frequency → 1/5 the wavelength (f and λ inversely proportional at constant v). λ_X = 343/100 = 3.43 m. λ_Y = 343/500 = 0.686 m. Ratio: 3.43/0.686 = 5.",
  },

  {
    id: "q10", type: "question",
    questionType: "short_answer",
    prompt: "**Q10.** A submarine's sonar sends a ping at 2,000 Hz. The speed of sound in seawater is 1,500 m/s.\n\n(a) Calculate the wavelength of the sonar wave.\n(b) The sonar pulse hits the ocean floor and returns 3 seconds later. How deep is the ocean at that location?\n(c) If the frequency were increased to 8,000 Hz (same speed), what would happen to the wavelength? Calculate the new wavelength.\n\nShow all work.",
    difficulty: "apply",
  },

  {
    id: "q11", type: "question",
    questionType: "short_answer",
    prompt: "**Q11. Proportional reasoning.** A wave in a medium has speed 400 m/s, frequency 80 Hz, and wavelength 5 m.\n\n(a) The frequency is doubled. What is the new wavelength (same medium, same speed)? Show proportional reasoning.\n(b) The wave enters a new medium where it travels at 600 m/s. The frequency is still 80 Hz. What is the new wavelength?\n(c) In which case — doubling frequency or moving to the faster medium — was the wavelength larger?",
    difficulty: "analyze",
  },

  // ─── SECTION 3: SOUND & WAVE INTERACTIONS ──────────────

  {
    id: uid(), type: "section_header",
    icon: "🔊",
    title: "Section 3 — Sound & Wave Interactions",
    subtitle: "Questions 12–16",
  },

  {
    id: "q12", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q12.** A racing car approaches a spectator at high speed. The spectator hears the engine at a higher pitch than the driver hears it. This is because:",
    difficulty: "understand",
    options: [
      "The car's engine runs faster when the car is moving",
      "The Doppler effect compresses the sound waves in front of the moving car, increasing frequency",
      "Higher speed increases the wave speed of sound in air",
      "Sound loses amplitude as it travels, making it seem higher pitched",
    ],
    correctIndex: 1,
    explanation: "Doppler effect. The car moving toward the spectator compresses sound waves in that direction — shorter wavelength → higher frequency → higher pitch. The actual engine frequency is unchanged.",
  },

  {
    id: "q13", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q13.** Sound travels faster in steel than in air because:",
    difficulty: "understand",
    options: [
      "Steel is hotter, and temperature increases sound speed",
      "Steel molecules are tightly packed, so compressions are passed along more quickly",
      "Sound in steel has a higher frequency than in air",
      "Steel is denser, which always means slower wave speed",
    ],
    correctIndex: 1,
    explanation: "Denser, stiffer media transmit sound faster because molecules are closer together — compressions pass neighbor to neighbor more quickly. Steel's tightly bonded atoms are extremely efficient at passing vibrations.",
  },

  {
    id: "q14", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q14.** Two identical waves with amplitude 6 cm meet at a point. At that instant, both have a crest at that point. The resultant displacement is:",
    difficulty: "apply",
    options: [
      "0 cm — destructive interference",
      "6 cm — they average out",
      "12 cm — constructive interference",
      "3 cm — waves halve each other",
    ],
    correctIndex: 2,
    explanation: "Superposition: resultant = 6 + 6 = 12 cm. Both waves have crests at the same point = in phase = constructive interference. Displacements add.",
  },

  {
    id: "q15", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q15.** You can hear a conversation happening around the corner in a hallway, but you cannot see the people talking. This difference between sound and light is best explained by:",
    difficulty: "analyze",
    options: [
      "Sound travels faster than light and wraps around corners first",
      "Sound is a longitudinal wave, which bends around corners; light is transverse and cannot",
      "Diffraction — sound's wavelength is comparable to hallway dimensions, light's wavelength is far too small to diffract around architectural features",
      "Reflection — sound bounces off floors and ceilings to reach your ears",
    ],
    correctIndex: 2,
    explanation: "Diffraction is most significant when wavelength ≈ obstacle size. Sound has wavelengths of centimeters to meters — comparable to doorways and hallways. Light's wavelength (~500 nm) is millions of times smaller than a hallway — effectively no diffraction occurs. The distinction is wavelength, not wave type.",
  },

  {
    id: "q16", type: "question",
    questionType: "short_answer",
    prompt: "**Q16.** Noise-canceling headphones work by using destructive interference.\n\n(a) Explain step by step how noise-canceling headphones eliminate ambient sound. Include the words: microphone, wave, out of phase, destructive interference, amplitude.\n(b) What type of wave interaction makes this possible?\n(c) After the waves cancel in your ear, are the original sound wave and the headphone-generated wave destroyed? What happens to them?",
    difficulty: "evaluate",
  },

  // ─── SECTION 4: STANDING WAVES & RESONANCE ─────────────

  {
    id: uid(), type: "section_header",
    icon: "🎵",
    title: "Section 4 — Standing Waves & Resonance",
    subtitle: "Questions 17–20",
  },

  {
    id: "q17", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q17.** In a standing wave on a string, nodes are located where:",
    difficulty: "remember",
    options: [
      "The string vibrates with maximum amplitude",
      "The string has zero displacement at all times",
      "Constructive interference always occurs",
      "The wave speed is highest",
    ],
    correctIndex: 1,
    explanation: "Nodes are points of zero displacement — the string (or medium) doesn't move at these points. Destructive interference is always complete at nodes. Antinodes have maximum amplitude.",
  },

  {
    id: "q18", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q18.** A guitar string is 0.8 m long and has waves traveling through it at 320 m/s. What is the frequency of the 3rd harmonic?",
    difficulty: "apply",
    options: [
      "200 Hz",
      "400 Hz",
      "600 Hz",
      "800 Hz",
    ],
    correctIndex: 2,
    explanation: "f₁ = v/2L = 320/(2 × 0.8) = 320/1.6 = 200 Hz. f₃ = 3 × f₁ = 3 × 200 = 600 Hz. The nth harmonic has frequency n × f₁.",
  },

  {
    id: "q19", type: "question",
    questionType: "multiple_choice",
    prompt: "**Q19.** The Tacoma Narrows Bridge collapsed because wind created oscillations at the bridge's natural frequency. This is an example of:",
    difficulty: "understand",
    options: [
      "Constructive interference — wind waves added to bridge waves",
      "Resonance — the driving force matched the natural frequency, causing amplitude to grow",
      "Diffraction — wind waves bent around the bridge supports",
      "Refraction — wind speed changed as it passed through the bridge structure",
    ],
    correctIndex: 1,
    explanation: "Resonance. When a driving force is applied at an object's natural frequency, each push adds in sync with the previous oscillation. Amplitude grows each cycle. The Tacoma Narrows bridge swung wider and wider until it tore itself apart.",
  },

  {
    id: "q20", type: "question",
    questionType: "short_answer",
    prompt: "**Q20.** A violin string is 0.32 m long. Waves travel through it at 256 m/s.\n\n(a) Calculate the fundamental frequency (1st harmonic).\n(b) What is the wavelength of the 2nd harmonic? Draw the 2nd harmonic standing wave pattern and label all nodes and antinodes.\n(c) If the violinist tightens the string (increasing wave speed to 320 m/s), what is the new fundamental frequency? How many Hz did it increase?\n(d) Explain why tightening a string raises its pitch in terms of harmonics and wave speed.\n\nShow all work.",
    difficulty: "apply",
  },

  // ─── BONUS ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⭐",
    title: "Bonus Question (+5%)",
    subtitle: "Optional — answer for extra credit",
  },

  {
    id: "q-bonus", type: "question",
    questionType: "short_answer",
    prompt: "**Bonus.** Design a thought experiment (or describe a real-world situation) that demonstrates at least THREE of the following wave behaviors: reflection, refraction, diffraction, constructive interference, destructive interference, resonance.\n\nFor each behavior:\n1. Describe clearly what is happening physically\n2. Identify which wave property or principle causes that behavior\n3. Explain how you could observe or measure it\n\nYour scenario can be real or hypothetical. Be specific.",
    difficulty: "create",
  },

  // ─── WRAP UP ───────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✅",
    title: "Assessment Complete",
    subtitle: "",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Waves Unit — What You've Covered:**\n\n- Waves transfer energy, not matter\n- Transverse vs. longitudinal waves — medium motion direction\n- Wave anatomy: crest, trough, amplitude, wavelength, frequency, period\n- **v = fλ** and **T = 1/f** — the two core equations\n- Sound as a longitudinal wave — pitch = frequency, volume = amplitude\n- Doppler effect — relative motion changes perceived frequency\n- Four wave interactions: reflection, refraction, diffraction, interference\n- Superposition principle — displacements add algebraically\n- Constructive vs. destructive interference\n- Standing waves — nodes, antinodes, harmonics\n- Resonance — natural frequency + matching drive = amplitude explosion\n\nGreat work this unit.",
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("waves-assessment");

  const data = {
    title: "Waves Unit Assessment",
    questionOfTheDay: "Waves Unit Assessment — take your time and show your work.",
    course: "Physics",
    unit: "Waves",
    order: 6,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/waves-assessment`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
