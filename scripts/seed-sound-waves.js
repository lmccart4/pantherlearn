// seed-sound-waves.js
// Physics — Waves Unit, Lesson 3 (order: 3)
// "Sound Waves"
// Run: node scripts/seed-sound-waves.js

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
    icon: "🔊",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Identify sound as a longitudinal mechanical wave requiring a medium",
      "Connect frequency to pitch and amplitude to volume",
      "Compare the speed of sound in different media and explain why it varies",
      "Describe the Doppler effect qualitatively and identify real-world examples",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Why does your voice sound different when you hear a recording of yourself vs. how you normally hear it? And why do ambulances sound higher-pitched as they approach than when they're driving away?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "When you speak, your vocal cords vibrate. That somehow makes sound waves that travel through air to someone else's ears. How do you think vibrating vocal cords actually create a wave in the air? What's physically happening to the air molecules between you and the listener?",
    difficulty: "understand",
  },

  // ─── SOUND IS A LONGITUDINAL WAVE ──────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎙️",
    title: "Sound: A Longitudinal Wave",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Sound is a longitudinal mechanical wave.**\n\nBreak that down:\n- **Longitudinal:** Air molecules vibrate parallel to the direction the sound travels (compressions and rarefactions — same as the slinky from last class)\n- **Mechanical:** Requires a medium. No air, no sound. Space is silent.\n\n**How a speaker makes sound:**\n1. The speaker cone moves forward → pushes air molecules together → creates a **compression** (high pressure)\n2. The cone moves back → air molecules spread out → creates a **rarefaction** (low pressure)\n3. This compression-rarefaction pattern travels outward as a longitudinal wave\n4. When it reaches your eardrum, the pressure variations make your eardrum vibrate at the same frequency\n5. Your brain interprets those vibrations as sound\n\n**Sound cannot travel through a vacuum.** There are no molecules to compress. The moon is geologically active — but you'd hear nothing standing on its surface. Explosions in space (like in the movies) would be completely silent.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Connection to circuits:** In a circuit, current is the flow of electrons — but no individual electron travels the full length of the wire. They nudge each other along, passing energy like a chain. Sound is the same: no air molecule travels from the speaker to your ear. Each molecule nudges its neighbor, passing the disturbance. Energy moves; matter doesn't.",
  },

  {
    id: "q-sound-type", type: "question",
    questionType: "multiple_choice",
    prompt: "Astronauts on a spacewalk cannot hear each other speak (without radios) because:",
    difficulty: "understand",
    options: [
      "Sound waves travel too slowly in space",
      "Sound is a transverse wave and space blocks transverse waves",
      "Sound requires a medium — there is no matter in space to carry the compressions",
      "The astronauts' helmets block the frequency range of speech",
    ],
    correctIndex: 2,
    explanation: "Sound is a mechanical wave — it requires a medium to travel through. Space is a near-perfect vacuum. With no air molecules to compress and expand, there's nothing to carry the sound wave. No medium = no sound.",
  },

  // ─── PITCH AND VOLUME ──────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎵",
    title: "Pitch and Volume",
    subtitle: "~6 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Your perception of sound has two main qualities: **pitch** and **volume**. Both map directly to wave properties.\n\n## Pitch = Frequency\n- **High pitch** (soprano, piccolo, dog whistle) = **high frequency**\n- **Low pitch** (bass guitar, tuba, earthquake) = **low frequency**\n- Pitch is how high or low a sound seems to you\n- Controlled by the source's vibration rate\n\n## Volume = Amplitude\n- **Loud sound** = **high amplitude** (large pressure variations)\n- **Quiet sound** = **low amplitude** (small pressure variations)\n- Volume is measured in decibels (dB) — a logarithmic scale\n- Amplitude is related to energy — louder sounds carry more energy\n\n| Sound | Frequency | Decibels |\n|---|---|---|\n| Threshold of hearing | 1,000 Hz | 0 dB |\n| Whisper | ~1,000 Hz | ~30 dB |\n| Normal conversation | ~1,000 Hz | ~60 dB |\n| Busy traffic | ~1,000 Hz | ~80 dB |\n| Rock concert | ~1,000 Hz | ~110 dB |\n| Jet engine | ~1,000 Hz | ~130 dB (pain threshold) |\n| Space shuttle launch | — | ~180 dB |\n\n**Human hearing range:** 20 Hz to 20,000 Hz (20 kHz)\n- Below 20 Hz: **infrasound** (earthquakes, whale calls, elephant communication)\n- Above 20,000 Hz: **ultrasound** (bat echolocation, dog whistles, medical imaging)",
  },

  {
    id: uid(), type: "definition",
    term: "Pitch",
    definition: "The perceived highness or lowness of a sound. Determined by frequency. High frequency = high pitch. Low frequency = low pitch.",
  },

  {
    id: uid(), type: "definition",
    term: "Volume (Loudness)",
    definition: "The perceived loudness of a sound. Determined by amplitude. Larger amplitude = more energy = louder sound. Measured in decibels (dB).",
  },

  {
    id: uid(), type: "definition",
    term: "Infrasound",
    definition: "Sound with frequency below 20 Hz — below human hearing range. Used by elephants and whales for long-distance communication. Also produced by earthquakes and severe weather.",
  },

  {
    id: uid(), type: "definition",
    term: "Ultrasound",
    definition: "Sound with frequency above 20,000 Hz — above human hearing range. Used in medical imaging, bat echolocation, sonar, and industrial testing.",
  },

  {
    id: "q-pitch-volume", type: "question",
    questionType: "multiple_choice",
    prompt: "A musician plays a note softly and then the same note loudly. What changes in the sound wave?",
    difficulty: "understand",
    options: [
      "Frequency increases, wavelength decreases",
      "Amplitude increases, frequency stays the same",
      "Wave speed increases, period decreases",
      "Wavelength increases, frequency increases",
    ],
    correctIndex: 1,
    explanation: "Playing louder increases amplitude (more energy in each wave), but the same note means the same pitch = same frequency. Speed of sound in air doesn't change. Amplitude is what changes between soft and loud.",
  },

  // ─── SPEED OF SOUND ────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🚀",
    title: "Speed of Sound in Different Media",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "The speed of sound depends entirely on the **medium** — specifically, how elastic (springy) it is and how dense it is.\n\n**Rule of thumb: Sound travels faster through denser, stiffer materials.**\n\n| Medium | Speed of Sound |\n|---|---|\n| Air (20°C) | 343 m/s |\n| Air (0°C) | 331 m/s |\n| Water | ~1,500 m/s |\n| Human tissue | ~1,540 m/s |\n| Glass | ~5,200 m/s |\n| Steel | ~5,960 m/s |\n| Diamond | ~12,000 m/s |\n\nWhy is sound faster in steel than air?\n- Steel molecules are packed tightly together — a compression in one molecule immediately pushes the next\n- Air molecules are far apart — the compression has to travel farther before nudging the next molecule\n- **Denser and stiffer medium = faster sound**\n\nWhy does sound speed change with temperature in air?\n- Warmer air = molecules moving faster = they collide and pass compressions more quickly\n- Every 1°C increase in temperature increases sound speed by about 0.6 m/s\n- On a hot day (35°C), sound travels ~355 m/s; on a cold day (0°C), ~331 m/s",
  },

  {
    id: uid(), type: "calculator",
    title: "Wave Speed in Different Media",
    description: "Given a frequency and wave speed, find the wavelength of sound.\n\nλ = v / f",
    formula: "v / f",
    showFormula: true,
    inputs: [
      { name: "v", label: "Speed of sound in medium", unit: "m/s" },
      { name: "f", label: "Frequency", unit: "Hz" },
    ],
    output: { label: "Wavelength (λ)", unit: "m", decimals: 4 },
  },

  {
    id: "q-speed-practice", type: "question",
    questionType: "short_answer",
    prompt: "Use the calculator to find the wavelength of a 500 Hz sound wave in:\n\n1. Air (343 m/s)\n2. Water (1,500 m/s)\n3. Steel (5,960 m/s)\n\nWhat pattern do you notice? What stays the same, and what changes as the medium changes?",
    difficulty: "apply",
  },

  // ─── DOPPLER EFFECT ────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🚑",
    title: "The Doppler Effect",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "You've heard it before: an ambulance siren sounds higher-pitched as it approaches and lower-pitched as it drives away. This is the **Doppler effect** — and it's one of the coolest wave phenomena in physics.\n\n**Why it happens:**\n\nWhen a sound source is stationary, its waves spread out evenly in all directions.\n\nWhen a source **moves toward you:**\n- The source \"catches up\" to the waves in front of it\n- The waves in front get compressed → shorter wavelength → **higher frequency → higher pitch**\n\nWhen a source **moves away from you:**\n- The source moves away from the waves behind it\n- The waves behind get stretched → longer wavelength → **lower frequency → lower pitch**\n\n**The key:** The source's actual frequency doesn't change. Your perception of frequency changes based on relative motion.\n\n| Situation | Wavelength you perceive | Frequency you hear | Pitch |\n|---|---|---|---|\n| Source approaching | Shorter | Higher | Higher |\n| Source stationary | Normal | Normal | Normal |\n| Source moving away | Longer | Lower | Lower |",
  },

  {
    id: uid(), type: "definition",
    term: "Doppler Effect",
    definition: "The apparent change in frequency (and therefore pitch) of a wave due to relative motion between the source and the observer. Source approaching = higher perceived frequency. Source receding = lower perceived frequency.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Real-world Doppler applications:**\n- **Weather radar:** Doppler radar detects whether rain is moving toward or away from the station — used for tornado detection\n- **Medical:** Doppler ultrasound measures blood flow direction and speed\n- **Police speed guns:** Measure how much a radar wave's frequency shifts when bouncing off your car\n- **Astronomy:** The 'redshift' of galaxies — light from distant galaxies is Doppler-shifted to lower frequencies (red) because they're moving away from us. This is how we know the universe is expanding.",
  },

  {
    id: "q-doppler1", type: "question",
    questionType: "multiple_choice",
    prompt: "A train whistle produces a 400 Hz tone. As the train approaches you at high speed, what do you hear?",
    difficulty: "understand",
    options: [
      "400 Hz — the source frequency doesn't change",
      "A frequency higher than 400 Hz",
      "A frequency lower than 400 Hz",
      "No sound until the train reaches you",
    ],
    correctIndex: 1,
    explanation: "When the source moves toward you, the waves are compressed in front of the train → shorter wavelength → higher frequency than 400 Hz. After the train passes and moves away, you hear lower than 400 Hz. The actual whistle is always 400 Hz; the perceived pitch changes.",
  },

  {
    id: "q-doppler2", type: "question",
    questionType: "multiple_choice",
    prompt: "A police radar gun measures the speed of a car by:",
    difficulty: "analyze",
    options: [
      "Timing how long the radar beam takes to reach the car",
      "Measuring the amplitude of the reflected radar wave",
      "Detecting the Doppler shift in frequency of the reflected radar wave",
      "Counting how many radar pulses bounce back per second",
    ],
    correctIndex: 2,
    explanation: "Speed guns use the Doppler effect. A radar beam (electromagnetic wave) hits the car and bounces back. If the car is moving toward the gun, the reflected frequency is higher than sent. The frequency shift is mathematically proportional to the car's speed — no guesswork needed.",
  },

  // ─── THE RECORDING PUZZLE ──────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎤",
    title: "Why Your Voice Sounds Different in Recordings",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "When you speak, you hear your voice two ways:\n1. **Through the air** — sound waves travel from your mouth → air → ear canal\n2. **Through your bones** — vibrations travel through your skull directly to your cochlea (inner ear)\n\nBone conduction transmits lower frequencies better than higher ones. So you hear a deeper, richer version of your voice than everyone else hears.\n\nA recording captures only the **air-conducted sound** — the same thing everyone else hears. That's why your voice sounds higher and thinner in recordings. The recording is actually more accurate — you've just been used to hearing the bone-conducted version your whole life.",
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
    prompt: "A sound wave has frequency 1,000 Hz in air. It moves into water (speed = 1,500 m/s). What is the frequency of the wave in water?",
    difficulty: "apply",
    options: [
      "More than 1,000 Hz — faster medium = higher frequency",
      "Less than 1,000 Hz — water absorbs some frequency",
      "Exactly 1,000 Hz — frequency is set by the source and doesn't change",
      "0 Hz — sound cannot travel through water",
    ],
    correctIndex: 2,
    explanation: "Frequency is determined by the source — the speaker or vibrating object that created the wave. When a wave enters a new medium, its speed and wavelength change, but frequency stays the same. 1,000 Hz in air = 1,000 Hz in water.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "short_answer",
    prompt: "A bat uses echolocation at 50,000 Hz (well above human hearing). The speed of sound in air is 343 m/s.\n\n(a) What is the wavelength of the bat's sound?\n(b) Why do bats use such high frequencies for echolocation? (Hint: think about what the wavelength means for detecting small objects like moths.)\n(c) Could a human use a 100 Hz sound for echolocation? Explain using wavelength.",
    difficulty: "analyze",
  },

  {
    id: "q-check3", type: "question",
    questionType: "short_answer",
    prompt: "A star moves away from Earth at high speed. Astronomers measure that its light waves arrive at a lower frequency than expected (called redshift). Use the Doppler effect to explain why a moving star would produce a frequency shift in light. Does redshift tell us the star is moving toward us or away from us? How do you know?",
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
    content: "**Key ideas from today:**\n\n- Sound is a **longitudinal mechanical wave** — it needs a medium\n- **Pitch = frequency** | **Volume = amplitude**\n- Human hearing: 20 Hz–20,000 Hz | Below = infrasound | Above = ultrasound\n- Sound travels faster through denser, stiffer media: air < water < steel\n- **Doppler effect:** relative motion between source and observer changes perceived frequency (approaching = higher, receding = lower)\n- Your voice sounds different in recordings because you normally hear bone-conducted sound\n\n**Next class:** Wave interactions — what happens when waves hit boundaries, enter new media, or collide with each other.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** Your recorded voice sounds different because recordings only capture air-conducted sound — bone conduction gives you extra bass frequencies that nobody else hears. The ambulance Doppler effect: as it approaches, waves in front are compressed (shorter wavelength → higher frequency → higher pitch). As it recedes, waves stretch out (longer wavelength → lower frequency → lower pitch). The siren's actual frequency never changes — your perceived frequency does.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Return to your warm-up answer about how vocal cords create sound waves. Now that you know sound is a longitudinal wave of compressions and rarefactions — revise or expand your answer. How do your vocal cords actually produce those compressions?",
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
      { term: "Sound wave", definition: "A longitudinal mechanical wave — compressions and rarefactions that require a medium to travel." },
      { term: "Pitch", definition: "Perceived highness or lowness of sound. Determined by frequency." },
      { term: "Volume (Loudness)", definition: "Perceived loudness of sound. Determined by amplitude. Measured in decibels (dB)." },
      { term: "Decibel (dB)", definition: "Unit of sound intensity/loudness. Logarithmic scale — 0 dB = threshold of hearing, 130 dB = pain threshold." },
      { term: "Infrasound", definition: "Sound below 20 Hz — below human hearing. Produced by earthquakes, elephants, and large weather systems." },
      { term: "Ultrasound", definition: "Sound above 20,000 Hz — above human hearing. Used in medical imaging, sonar, and bat echolocation." },
      { term: "Doppler Effect", definition: "Apparent change in frequency due to relative motion between source and observer. Approaching = higher pitch, receding = lower pitch." },
      { term: "Redshift", definition: "Doppler effect applied to light — light from receding objects is shifted to lower frequencies (toward red). Evidence the universe is expanding." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("sound-waves");

  const data = {
    title: "Sound Waves",
    questionOfTheDay: "Why does your voice sound different when you hear a recording of yourself vs. how you normally hear it? And why do ambulances sound higher-pitched as they approach than when they're driving away?",
    course: "Physics",
    unit: "Waves",
    order: 3,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/sound-waves`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
