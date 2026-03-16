// seed-wave-speed.js
// Physics — Waves Unit, Lesson 2 (order: 2)
// "Wave Speed & Math"
// Run: node scripts/seed-wave-speed.js

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
    icon: "⚡",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Apply the wave speed equation: v = fλ",
      "Apply the period-frequency relationship: T = 1/f",
      "Solve for any variable in both equations (algebraic rearrangement)",
      "Use proportional reasoning to predict how changing frequency or wavelength affects wave speed",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** A guitar string vibrating at 440 Hz produces the note A. The speed of sound in air is 343 m/s. How long is that sound wave? And what would change if you played the same note underwater, where sound travels at 1,500 m/s?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "You know that v = d/t from kinematics. A wave travels through space — it has a speed, a distance (wavelength), and a time (period). Before I show you the equation, try to write the wave speed formula yourself using v, λ, and T. Does it look like anything familiar?",
    difficulty: "understand",
  },

  // ─── DERIVING WAVE SPEED ───────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "Deriving Wave Speed",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "You already know **v = d / t** from kinematics.\n\nFor a wave, think about it this way:\n- In one period (T seconds), the wave travels exactly **one wavelength (λ)**\n- Speed = distance / time\n- So: **v = λ / T**\n\nBut T = 1/f, so:\n\n**v = λ / (1/f) = λ × f**\n\n## v = fλ\n\nWhere:\n- **v** = wave speed (m/s)\n- **f** = frequency (Hz = cycles/s)\n- **λ** = wavelength (m)\n\n**How to think about it:** frequency is \"how many waves per second\" and wavelength is \"how long each wave is.\" Multiply them: waves per second × meters per wave = meters per second. The units work out perfectly.\n\nAlso useful:\n\n## T = 1/f\n\nPeriod and frequency are always reciprocals. If f = 5 Hz, then T = 0.2 s. If T = 0.01 s, then f = 100 Hz.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Connection to prior units:** This is the same algebraic structure as Ohm's Law (V = IR) and Coulomb's Law. You solved for every variable in those equations — you'll do the same here. If you know any two of {v, f, λ}, you can find the third.\n\n- Solve for wavelength: **λ = v / f**\n- Solve for frequency: **f = v / λ**\n- Solve for speed: **v = fλ**",
  },

  {
    id: uid(), type: "definition",
    term: "Wave Speed (v)",
    definition: "The speed at which a wave travels through a medium. v = fλ. Unit: m/s. Wave speed depends on the medium — not on frequency or amplitude.",
  },

  {
    id: uid(), type: "callout",
    icon: "⚠️", style: "warning",
    content: "**Common misconception:** Changing the frequency of a wave in the SAME medium does NOT change its speed. If you pluck a guitar string harder (higher amplitude) or faster (higher frequency), the sound waves still travel through air at 343 m/s. What changes is the wavelength — shorter wavelength, higher frequency, same speed.\n\nSpeed is a property of the medium, not of the wave's source.",
  },

  // ─── WORKED EXAMPLES ───────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✏️",
    title: "Worked Examples",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Example 1: Find wavelength**\n\nA radio station broadcasts at 100 MHz (100 × 10⁶ Hz). Radio waves travel at the speed of light: 3 × 10⁸ m/s. What is the wavelength?\n\nv = fλ → λ = v/f\nλ = (3 × 10⁸ m/s) / (100 × 10⁶ Hz)\nλ = **3 m**\n\nThat's about the length of a car — your radio antenna needs to be sized to match!\n\n---\n\n**Example 2: Find frequency**\n\nOcean waves are 12 m apart (wavelength) and travel at 6 m/s. What is the frequency?\n\nf = v/λ = 6 / 12 = **0.5 Hz**\n\nPeriod: T = 1/f = 1/0.5 = **2 seconds** per wave\n\n---\n\n**Example 3: Find period**\n\nA sound wave has a frequency of 440 Hz (the musical note A). What is the period?\n\nT = 1/f = 1/440 = **0.00227 s = 2.27 ms**\n\nThe wave completes one full cycle in about 2 thousandths of a second.",
  },

  // ─── CALCULATORS ───────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧮",
    title: "Wave Calculators",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "calculator",
    title: "Wave Speed Calculator",
    description: "Calculate wave speed from frequency and wavelength.\n\nv = f × λ",
    formula: "f * lambda",
    showFormula: true,
    inputs: [
      { name: "f", label: "Frequency (f)", unit: "Hz" },
      { name: "lambda", label: "Wavelength (λ)", unit: "m" },
    ],
    output: { label: "Wave Speed", unit: "m/s", decimals: 3 },
  },

  {
    id: uid(), type: "calculator",
    title: "Period ↔ Frequency Calculator",
    description: "Period and frequency are reciprocals. Enter one, get the other.\n\nT = 1/f",
    formula: "1 / f",
    showFormula: true,
    inputs: [
      { name: "f", label: "Frequency (f)", unit: "Hz" },
    ],
    output: { label: "Period (T)", unit: "s", decimals: 6 },
  },

  {
    id: "q-calc-practice", type: "question",
    questionType: "short_answer",
    prompt: "Use the calculators to solve each problem. Show your setup (which equation, which values) before plugging in:\n\n1. A sound wave has frequency 256 Hz. Speed of sound = 343 m/s. Find the wavelength.\n2. A water wave has wavelength 3 m and period 2 s. Find the speed.\n3. The highest note a human can hear is about 20,000 Hz. Speed of sound = 343 m/s. Find the wavelength.\n4. A bat uses echolocation at 50,000 Hz. Speed of sound = 343 m/s. Find the wavelength and period.",
    difficulty: "apply",
  },

  // ─── PROPORTIONAL REASONING ────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📊",
    title: "Proportional Reasoning",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "You've used proportional reasoning with Coulomb's Law and Ohm's Law. Same skill here.\n\n**Key rule: In the SAME medium, wave speed is constant.**\n\nSo if v = fλ and v is fixed:\n- **f and λ are inversely proportional**\n- Double the frequency → wavelength halves (speed stays the same)\n- Halve the frequency → wavelength doubles\n\n| Change | Frequency | Wavelength | Speed |\n|---|---|---|---|\n| Double frequency | 2f | λ/2 | Same |\n| Halve frequency | f/2 | 2λ | Same |\n| Double wavelength | f/2 | 2λ | Same |\n| Move to faster medium | Same | Doubles | Doubles |\n\n**When the medium changes, speed changes — and wavelength adjusts while frequency stays the same.** (Frequency is determined by the source, not the medium.)",
  },

  {
    id: "q-prop1", type: "question",
    questionType: "multiple_choice",
    prompt: "Sound travels at 343 m/s in air and 1,500 m/s in water. A sound source produces waves at 500 Hz. When the sound enters water, its wavelength:",
    difficulty: "apply",
    options: [
      "Stays the same — frequency and medium are independent",
      "Decreases — water slows the wave down",
      "Increases — higher speed spreads the waves farther apart",
      "Frequency and wavelength both increase",
    ],
    correctIndex: 2,
    explanation: "Frequency stays fixed at 500 Hz (set by the source). Speed increases to 1,500 m/s in water. λ = v/f = 1500/500 = 3 m in water, vs. 343/500 = 0.686 m in air. Higher speed → longer wavelength at same frequency.",
  },

  {
    id: "q-prop2", type: "question",
    questionType: "multiple_choice",
    prompt: "Two sound waves travel through the same room at 343 m/s. Wave A has frequency 200 Hz. Wave B has frequency 800 Hz. The wavelength of Wave B compared to Wave A is:",
    difficulty: "apply",
    options: [
      "4 times longer",
      "4 times shorter",
      "Same length — same medium",
      "2 times shorter",
    ],
    correctIndex: 1,
    explanation: "Same speed, 4× the frequency → 1/4 the wavelength. λ_A = 343/200 = 1.715 m. λ_B = 343/800 = 0.429 m. Ratio: 0.429/1.715 ≈ 1/4. Frequency and wavelength are inversely proportional at constant speed.",
  },

  {
    id: "q-prop3", type: "question",
    questionType: "multiple_choice",
    prompt: "A guitar player switches from the lowest string (82 Hz) to the highest string (330 Hz) while playing the same guitar. The sound waves travel through the same air. What changes?",
    difficulty: "analyze",
    options: [
      "Speed increases, wavelength stays the same",
      "Frequency increases, wavelength decreases, speed stays the same",
      "Frequency and speed both increase, wavelength stays the same",
      "Wavelength increases to compensate for higher frequency",
    ],
    correctIndex: 1,
    explanation: "The medium (air) doesn't change, so speed stays at 343 m/s. Higher frequency → shorter wavelength. v = fλ → λ = v/f. At 82 Hz: λ ≈ 4.2 m. At 330 Hz: λ ≈ 1.04 m. Four times the frequency means one-fourth the wavelength.",
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
    prompt: "A wave has a frequency of 25 Hz and a wavelength of 4 m. Its period is:",
    difficulty: "apply",
    options: [
      "100 s",
      "0.04 s",
      "6.25 s",
      "0.25 s",
    ],
    correctIndex: 1,
    explanation: "T = 1/f = 1/25 = 0.04 s. Quick check: v = fλ = 25 × 4 = 100 m/s. In 0.04 s, the wave travels 100 × 0.04 = 4 m — exactly one wavelength. That confirms the period is 0.04 s.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "short_answer",
    prompt: "Back to the Question of the Day: A guitar plays A (440 Hz) in air (v = 343 m/s).\n\n(a) Calculate the wavelength of this sound wave.\n(b) In water, sound travels at 1,500 m/s. What is the wavelength of the same 440 Hz note underwater?\n(c) What stayed the same when the wave moved from air to water? What changed?\n\nShow all work.",
    difficulty: "apply",
  },

  {
    id: "q-check3", type: "question",
    questionType: "short_answer",
    prompt: "A student says: 'If I double the frequency of a wave, the wave travels twice as fast.' Is this student correct? Use the wave speed equation to explain why or why not, and describe what actually happens to the wave when frequency doubles (in the same medium).",
    difficulty: "evaluate",
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
    content: "**Key equations:**\n\n- **v = fλ** — wave speed = frequency × wavelength\n- **T = 1/f** — period and frequency are reciprocals\n- **λ = v/f** and **f = v/λ** — rearranged forms\n\n**Key ideas:**\n- Wave speed depends on the **medium**, not the frequency or amplitude\n- In the same medium: frequency and wavelength are inversely proportional (one goes up, the other goes down)\n- When waves enter a new medium: **speed changes, wavelength changes, frequency stays the same**\n\n**Next class:** Sound waves — longitudinal waves, why speed varies in different media, pitch, volume, Doppler effect.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** The 440 Hz A note: λ = v/f = 343/440 ≈ 0.78 m in air. Underwater at 1,500 m/s: λ = 1500/440 ≈ 3.41 m — about 4× longer. The frequency stays 440 Hz (the source still vibrates 440 times per second), but each wave is now much larger because the medium carries it faster.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Return to your warm-up derivation. Did you get to v = fλ? How did your approach compare to deriving it from v = λ/T → v = fλ?",
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
      { term: "Wave Speed (v)", definition: "How fast a wave travels through a medium. v = fλ. Unit: m/s. Depends on medium, not frequency." },
      { term: "Wave speed equation", definition: "v = fλ. Wave speed equals frequency times wavelength. Rearranges to λ = v/f and f = v/λ." },
      { term: "Period (T)", definition: "Time for one complete wave cycle. T = 1/f. Unit: seconds." },
      { term: "Frequency (f)", definition: "Cycles per second. f = 1/T. Unit: Hz. Set by the source, unchanged when wave enters new medium." },
      { term: "Wavelength (λ)", definition: "Length of one complete wave cycle. λ = v/f. Changes when wave enters new medium. Unit: meters." },
      { term: "Inversely proportional", definition: "When one quantity increases, the other decreases proportionally. In same medium: frequency and wavelength are inversely proportional (v = fλ, v fixed)." },
      { term: "Hertz (Hz)", definition: "Unit of frequency. 1 Hz = 1 cycle per second. Named after Heinrich Hertz who discovered radio waves." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("wave-speed");

  const data = {
    title: "Wave Speed & Math",
    questionOfTheDay: "A guitar string vibrating at 440 Hz produces the note A. The speed of sound in air is 343 m/s. How long is that sound wave? And what would change if you played the same note underwater, where sound travels at 1,500 m/s?",
    course: "Physics",
    unit: "Waves",
    order: 2,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/wave-speed`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
