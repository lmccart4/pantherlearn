// seed-magnetism-faraday-induction.js
// Creates "Faraday's Law — Electromagnetic Induction" (Magnetism Unit, Lesson 5)
// Run: node scripts/seed-magnetism-faraday-induction.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Faraday's Law — Electromagnetic Induction",
  course: "Physics",
  unit: "Magnetism",
  questionOfTheDay: "Every time you charge your phone wirelessly, electricity is being created with no wires, no batteries, and no direct connection. A changing magnetic field somehow produces a current in your phone. How?",
  order: 5,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "⚡",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "So far in this unit you've built a model of magnetism going one direction:\n\n**Current → Magnetic Field** (Oersted, Ampere — Lesson 3)\n\nA wire carrying current creates a magnetic field around it. Move a current-carrying wire into a magnetic field and you get a force (Lesson 4).\n\nBut in 1831, Michael Faraday asked the reverse question: if electricity creates magnetism, can magnetism create electricity?\n\nThe answer changed civilization. Every generator, every power plant, every transformer on every telephone pole — all of it runs on what Faraday discovered."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "📱",
      content: "**Question of the Day:** Every time you charge your phone wirelessly, electricity is being created with no wires, no batteries, and no direct connection. A changing magnetic field somehow produces a current in your phone. How?"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "State Faraday's Law: a changing magnetic flux induces a voltage (EMF)",
        "Identify the factors that increase the magnitude of induced EMF",
        "Explain how generators convert mechanical motion into electrical current using induction",
        "Connect electromagnetic induction to real-world devices: generators, transformers, wireless charging"
      ]
    },

    // ═══════════════════════════════════════════
    // THE DISCOVERY
    // ═══════════════════════════════════════════
    {
      id: "section-discovery",
      type: "section_header",
      icon: "🔬",
      title: "The Faraday Discovery",
      subtitle: "~5 minutes"
    },
    {
      id: "b-faraday-discovery",
      type: "text",
      content: "**Faraday's original experiment (1831):**\n\nFaraday wrapped two separate coils of wire around an iron ring. He connected one coil to a battery (the primary coil) and connected the other to a galvanometer — a device that detects tiny currents.\n\nHere's what he observed:\n- When he **switched the battery ON**: the galvanometer briefly jumped, then returned to zero\n- While the battery stayed on at constant current: nothing — zero reading\n- When he **switched the battery OFF**: the galvanometer jumped again in the opposite direction, then returned to zero\n\nSteady current → no effect. **Changing** current → brief induced current in the other coil.\n\nFaraday's conclusion: **it's not the magnetic field itself that induces current — it's the CHANGE in the magnetic field.**"
    },
    {
      id: "callout-key-insight",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The critical distinction:** A magnet sitting still inside a coil does nothing. A magnet *moving* into or out of a coil induces current. It's not magnetism that makes electricity — it's *changing* magnetism. This is why a generator spins continuously: constant rotation = continuously changing magnetic field = continuous current."
    },
    {
      id: "q-warmup-check",
      type: "question",
      questionType: "short_answer",
      prompt: "Before the next section: A student holds a magnet still inside a coil of wire connected to a galvanometer. The galvanometer reads zero. The student then quickly pulls the magnet out. What does the galvanometer do, and why? Use Faraday's key insight in your answer.",
      placeholder: "The galvanometer: ...\nWhy: ...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // MAGNETIC FLUX
    // ═══════════════════════════════════════════
    {
      id: "section-flux",
      type: "section_header",
      icon: "🌀",
      title: "Magnetic Flux",
      subtitle: "~5 minutes"
    },
    {
      id: "b-flux",
      type: "text",
      content: "**Magnetic flux (Φ)** is the measure of how much magnetic field passes through a loop of wire.\n\nThink of it as: how many field lines are threading through the loop?\n\nFlux changes when:\n- The **magnetic field strength (B)** increases or decreases\n- The **area of the loop** changes (compress or expand the coil)\n- The **angle** between the field and the loop changes (rotating a coil in a field — this is how generators work)\n\n**Faraday's Law (qualitative):** The induced EMF is proportional to **how fast the magnetic flux is changing**.\n\n**The faster the change, the higher the voltage.** Spin a generator faster → more EMF → more electricity generated."
    },
    {
      id: "b-what-increases-emf",
      type: "text",
      content: "**What increases induced EMF?**\n\n| Factor | Effect on induced EMF |\n|--------|----------------------|\n| Move magnet faster | More EMF — faster change in flux |\n| Use a stronger magnet | More EMF — stronger field = more flux change per second |\n| More coils of wire | More EMF — each loop contributes; N coils multiplies the effect |\n| Larger coil area | More EMF — more field lines threading through |\n\n**Why coils matter:** A single loop of wire induces a small voltage. Wrap 1000 loops around an iron core and the same changing field induces 1000× more voltage. This is the transformer — voltage stepped up or down by changing the number of coils."
    },
    {
      id: "q-emf-factors",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student has a coil of wire connected to a galvanometer. They test two scenarios:\n\n- Scenario A: slowly push a weak magnet into a 10-turn coil\n- Scenario B: quickly push a strong magnet into a 200-turn coil\n\nWhich scenario produces a larger deflection on the galvanometer?",
      options: [
        "Scenario A — fewer coils means less resistance to the magnetic field",
        "Scenario B — faster speed, stronger magnet, and more coils all increase induced EMF",
        "They produce the same deflection — the magnet strength cancels with the number of coils",
        "Neither — moving a magnet into a coil doesn't produce any current"
      ],
      correctIndex: 1,
      explanation: "Scenario B wins on all three factors: faster movement (faster flux change), stronger magnet (more flux per second), and 200 coils vs 10 (each coil adds to the total EMF). In Faraday's Law, the induced EMF = N × (rate of flux change), so more coils directly multiplies the output. This is why power transformers use thousands of coil turns.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // GENERATORS
    // ═══════════════════════════════════════════
    {
      id: "section-generators",
      type: "section_header",
      icon: "🏭",
      title: "Generators — Induction at Scale",
      subtitle: "~10 minutes"
    },
    {
      id: "b-generators",
      type: "text",
      content: "**How a generator works**\n\nA generator is simply a coil of wire rotating inside a magnetic field.\n\nAs the coil rotates:\n- Sometimes the coil is perpendicular to the field → maximum flux threading through → flux is momentarily NOT changing → EMF = 0\n- As the coil rotates past this point → flux begins changing rapidly → EMF spikes\n- The continuously rotating coil produces continuously changing flux → continuous alternating current (AC)\n\nThe output is a sine wave — the voltage oscillates positive and negative as the coil rotates. This is where **AC electricity** comes from. Every wall outlet in the US delivers 60 Hz AC — meaning the coil in some distant generator rotated 60 times per second when that electricity was made.\n\n**Key chain:**\n1. Mechanical energy (turbine spinning) → rotating coil in magnetic field\n2. Rotating coil → changing flux (Faraday)\n3. Changing flux → induced EMF → current flows\n4. Current travels through transmission lines to your house\n\nSteam from burning coal, nuclear reactions, or wind turns the turbine. The generator converts that motion to electricity. Faraday's Law is the conversion mechanism."
    },
    {
      id: "callout-phet",
      type: "callout",
      style: "insight",
      icon: "🔬",
      content: "**PhET Simulation — Faraday's Electromagnetic Lab**\n\nOpen the PhET sim and try the **Generator** tab:\n- Drag the faucet handle to spin the turbine\n- Watch the coil rotate in the magnetic field\n- Observe the voltage output — it oscillates as the coil angle changes\n- Spin it faster and watch what happens to the voltage\n\nThis is exactly how every power plant on Earth generates electricity."
    },
    {
      id: "q-generator",
      type: "question",
      questionType: "short_answer",
      prompt: "A wind turbine and a coal power plant both generate electricity. Mechanically, they work almost identically — both spin a turbine that rotates a coil in a magnetic field.\n\nUsing what you know about Faraday's Law, explain:\n1. What determines how much electricity each generates?\n2. Why does a wind turbine produce less electricity than a coal plant of similar size?",
      placeholder: "What determines electricity output: ...\nWhy wind < coal (same size): ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // APPLICATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-applications",
      type: "section_header",
      icon: "📱",
      title: "Induction in the Real World",
      subtitle: "~5 minutes"
    },
    {
      id: "b-applications",
      type: "text",
      content: "**Every one of these runs on Faraday's Law:**\n\n**Transformers** — Two coils of wire wrapped around the same iron core. AC current in the primary coil creates a changing magnetic field. That changing field induces a voltage in the secondary coil. The ratio of coil turns determines the ratio of voltages. Power plants generate at high voltage (more efficient to transmit), transformers step it down to 120V before it enters your home. No moving parts — pure electromagnetic induction.\n\n**Wireless charging (Qi standard)** — The charging pad contains a coil carrying rapidly alternating current → changing magnetic field → the coil inside your phone has current induced in it → charges the battery. Range is ~1 cm because the changing field falls off fast with distance.\n\n**Guitar pickups** — Magnets beneath each string create a field. When the metal string vibrates, it changes the flux through the coil wound around the pickup → induces a tiny alternating current that mirrors the string's vibration → amplified to drive a speaker.\n\n**Microphones** — A diaphragm moves a coil inside a magnet in response to sound waves. Moving coil = changing flux = induced current that represents the sound waveform.\n\n**Credit card magnetic stripe readers** — Swiping a card moves the magnetic stripe through a small coil → changing flux → induced current that reads the encoded data."
    },
    {
      id: "q-wireless-charging",
      type: "question",
      questionType: "short_answer",
      prompt: "**Back to the Question of the Day:** Your phone charges wirelessly through 1 cm of plastic.\n\nTrace the complete chain using Faraday's Law:\n1. What's happening in the charging pad?\n2. How does that create a changing magnetic flux?\n3. How does that flux change produce current in your phone?\n4. Why does the charger need to be plugged into AC power (not DC)?\n\nUse these terms: alternating current, changing flux, electromagnetic induction, coil.",
      placeholder: "In the charging pad: ...\nHow it creates changing flux: ...\nHow current is induced in the phone: ...\nWhy AC (not DC): ...",
      difficulty: "analyze"
    },
    {
      id: "q-transformer",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A transformer has 100 turns on the primary coil connected to 120V AC. The secondary coil has 1000 turns. What voltage does the secondary coil produce?",
      options: [
        "12V — more coils means higher resistance, so voltage drops",
        "120V — transformers don't change voltage",
        "1200V — the voltage scales with the ratio of coil turns",
        "0V — transformers only work with DC current"
      ],
      correctIndex: 2,
      explanation: "Transformer voltage ratio = secondary turns / primary turns. Here: 1000/100 = 10. So 120V × 10 = 1200V. This is a step-up transformer. Power lines transmit at hundreds of thousands of volts (high voltage = lower current = less energy lost to resistance). Transformers at substations step this down in stages to the 120V at your wall outlet. Crucially: transformers ONLY work with AC — they need continuously changing magnetic flux. DC produces a steady field and no induction.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "Faraday's Law completes the electricity-magnetism connection:\n\n- **Oersted (Lesson 3):** Current → Magnetic Field\n- **Faraday (this lesson):** Changing Magnetic Field → Current\n\nElectricity and magnetism are two aspects of the same phenomenon — electromagnetism. Change one and you affect the other.\n\nThis isn't just a physics curiosity. Electromagnetic induction is the mechanism behind:\n- Every watt of electricity generated on Earth\n- Every transformer in every power grid\n- Every wireless charger, speaker, microphone, and guitar pickup\n\n**Up next:** Lesson 6 — Lenz's Law. Faraday told us the magnitude of induced EMF. Lenz figured out the direction — and it's determined by conservation of energy."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A hydroelectric dam spins turbines using falling water. A coal plant spins turbines using steam. A nuclear plant spins turbines using steam from nuclear heat. A wind turbine spins using wind.\n\nFrom an electromagnetic perspective, what do all four have in common? And from Faraday's Law, what would you need to double to double the electricity output?",
      placeholder: "What all four have in common: ...\nWhat to double to double output: ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Vocabulary",
      subtitle: ""
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Electromagnetic induction", definition: "The process by which a changing magnetic field produces an electric current in a conductor — the basis of generators, transformers, and wireless charging." },
        { term: "Faraday's Law", definition: "The principle that a changing magnetic flux through a loop of wire induces an EMF (voltage) in that loop — the greater the rate of change, the greater the induced voltage." },
        { term: "Magnetic flux (Φ)", definition: "A measure of how many magnetic field lines pass through a given area — changes in flux are what induce current, not the field itself." },
        { term: "Generator", definition: "A device that converts mechanical motion (rotation) into electrical energy by spinning a coil inside a magnetic field — inducing AC current via Faraday's Law." },
        { term: "Transformer", definition: "A device that uses electromagnetic induction to step AC voltage up or down — two coils wound around an iron core, with the voltage ratio determined by the coil turn ratio." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("magnetism-faraday-induction")
      .set(lesson);
    console.log('✅ Lesson "Faraday\'s Law — Electromagnetic Induction" seeded!');
    console.log("   Path: courses/physics/lessons/magnetism-faraday-induction");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order, "(unit order: 5 of 8)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
