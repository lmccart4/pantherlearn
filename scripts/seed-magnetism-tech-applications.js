// seed-magnetism-tech-applications.js
// Creates "Magnetism in Medicine & Technology" lesson (Magnetism Unit, Lesson 7 — Capstone)
// Run: node scripts/seed-magnetism-tech-applications.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Magnetism in Medicine & Technology",
  course: "Physics",
  unit: "Magnetism",
  questionOfTheDay: "An MRI machine can see inside your body without cutting you open and without using radiation. A maglev train floats above its tracks with no wheels. Wireless charging sends power through the air. What do all of these have in common?",
  order: 7,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🏥",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "This is your capstone lesson for the Magnetism unit. You've built the toolkit:\n\n- Magnetic fields and poles (Lesson 1)\n- Force on moving charges — F = qvB (Lesson 2)\n- Current creates magnetic fields — right-hand rule (Lesson 3)\n- Force on current-carrying wires — F = BIL (Lesson 4)\n- Electromagnetic induction — Faraday's Law (Lesson 5)\n- Lenz's Law — induced current opposes change (Lesson 6)\n\nToday you apply all of it to real technology that exists right now — in hospitals, in transit systems, in the device you're holding."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "🏥",
      content: "**Question of the Day:** An MRI machine can see inside your body without cutting you open and without using radiation. A maglev train floats above its tracks with no wheels. Wireless charging sends power through the air. What do all of these have in common?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Before we dive in: from the list of principles you've learned in this unit, which ones do you think are involved in an MRI machine? Which are involved in a wireless phone charger? Take your best guess.",
      placeholder: "MRI probably uses... Wireless charging probably uses..."
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain how an MRI machine uses superconducting electromagnets and electromagnetic induction",
        "Describe how wireless charging works using Faraday's Law",
        "Explain how maglev trains use magnetic repulsion (or Meissner effect) for levitation",
        "Identify the magnetism principles behind hard drives, speakers, and electric vehicles",
        "Connect each technology to specific laws and equations from this unit"
      ]
    },

    // ═══════════════════════════════════════════
    // MRI
    // ═══════════════════════════════════════════
    {
      id: "section-mri",
      type: "section_header",
      icon: "🏥",
      title: "MRI: Seeing Inside the Body Without Radiation",
      subtitle: "~12 minutes"
    },
    {
      id: "b-mri",
      type: "text",
      content: "**Magnetic Resonance Imaging (MRI)** is one of the most important diagnostic tools in medicine — and it runs almost entirely on the physics from this unit.\n\n**How it works (simplified):**\n\n**Step 1 — The superconducting magnet creates a massive field.**\nAn MRI machine contains a solenoid (from Lesson 3) cooled to -269°C using liquid helium. At this temperature, the wire becomes **superconducting** — its resistance drops to exactly zero. Current flows forever with no energy loss, creating an extremely strong, stable magnetic field of 1.5 to 3 Tesla (60,000× Earth's field).\n\n**Step 2 — The strong field aligns protons in your body.**\nYour body is mostly water (H₂O). Hydrogen nuclei (protons) are tiny magnets. In the MRI's strong field, they align like compass needles.\n\n**Step 3 — Radio frequency pulses knock them out of alignment.**\nThe machine sends radio waves tuned to the exact frequency that protons absorb. This \"tips\" the protons out of alignment with the field.\n\n**Step 4 — Protons snap back and emit a signal.**\nWhen the radio pulse stops, the protons snap back into alignment. As they do, they release energy as a radio signal. Different tissues (fat, muscle, tumor) have different proton densities and release signals at slightly different rates.\n\n**Step 5 — Induction detects the signals.**\nCoils of wire surrounding the patient (pick-up coils) detect the tiny changing magnetic fields from the relaxing protons — electromagnetic induction, Faraday's Law. The induced signals are sent to a computer that reconstructs a 3D image.\n\n**Principles involved:** solenoids, electromagnets, magnetic domains, electromagnetic induction, Faraday's Law. No radiation. No cutting. No contact with the tissue being imaged."
    },
    {
      id: "callout-superconduct",
      type: "callout",
      style: "insight",
      icon: "❄️",
      content: "**Superconductivity:** At extremely low temperatures, some materials lose all electrical resistance. Current flows with zero energy loss — forever, once started. MRI machines start a current flowing and then seal the circuit. The same current keeps circulating for years, maintaining the magnetic field without any power input. Room-temperature superconductors (which would revolutionize everything from power grids to computers) remain one of the biggest unsolved problems in materials science."
    },
    {
      id: "q-mri-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An MRI machine's pickup coils detect signals from the patient's body using electromagnetic induction. What is the 'changing magnetic field' that induces current in those pickup coils?",
      options: [
        "The main superconducting magnet being turned on and off",
        "The tiny magnetic signals from protons relaxing back into alignment with the main field",
        "The patient's heartbeat creating vibrations",
        "Radio waves emitted by the machine"
      ],
      correctIndex: 1,
      explanation: "As protons in the body relax back into alignment with the MRI's main field, they release tiny, rapidly changing magnetic signals. These changing fields pass through the pickup coils and induce small currents (Faraday's Law). The signals from different tissues differ slightly, allowing the computer to distinguish fat from muscle from tumor. The pickup coils are essentially very sensitive antennas running on Faraday's Law."
    },
    {
      id: "q-mri-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why does an MRI machine need a magnetic field 60,000 times stronger than Earth's?",
      options: [
        "To increase the speed of radio waves inside the machine",
        "To align enough protons to produce a detectable signal — weak fields align too few protons",
        "To prevent external magnetic fields from interfering with the scan",
        "To heat the body tissue to the correct temperature for imaging"
      ],
      correctIndex: 1,
      explanation: "For a detectable signal, a large fraction of the body's protons need to be aligned with the field. Earth's field (0.00005 T) is too weak — only a tiny fraction of protons would align. The 1.5–3 T MRI field aligns enough protons that when they snap back into alignment, the combined signal is strong enough for the pickup coils to detect and for a computer to reconstruct a useful image."
    },

    // ═══════════════════════════════════════════
    // WIRELESS CHARGING
    // ═══════════════════════════════════════════
    {
      id: "section-wireless",
      type: "section_header",
      icon: "📱",
      title: "Wireless Charging: Faraday's Law in Your Pocket",
      subtitle: "~8 minutes"
    },
    {
      id: "b-wireless",
      type: "text",
      content: "Every time you drop your phone on a wireless charging pad, you're using Michael Faraday's 1831 discovery to move energy through an air gap with no electrical contact.\n\n**How wireless charging works:**\n\n1. **The charging pad** contains a coil of wire carrying high-frequency AC current (typically 100–200 kHz — over 100,000 direction changes per second)\n2. This rapidly alternating current creates a **rapidly changing magnetic field** above the pad\n3. **Inside your phone** is a second coil of wire — the receiver coil\n4. The changing field from the pad passes through the receiver coil → **Faraday's Law** induces a voltage (changing field → induced current)\n5. The induced current charges the battery (after some conversion circuitry)\n\n**Why the gap works:** Magnetic fields pass through air (and through most materials, including phone cases). As long as the receiver coil is close enough to be within the changing field, induction works.\n\n**Efficiency:** Wireless charging is about 80–85% efficient vs. ~95% for wired. The 15–20% loss is why your phone gets slightly warm on a wireless charger — that energy is eddy current losses in the phone's components and inefficiencies in the coil coupling."
    },
    {
      id: "q-wireless-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Wireless charging uses a rapidly alternating current (100+ kHz) rather than DC current. Why is AC necessary?",
      options: [
        "DC current is too dangerous to use in a charging pad",
        "AC current alternates direction, creating a continuously CHANGING magnetic field — induction requires a changing field (Faraday's Law)",
        "AC current is more efficient than DC for all electronic devices",
        "DC current would magnetize the phone permanently"
      ],
      correctIndex: 1,
      explanation: "Faraday's Law requires a CHANGING magnetic field to induce current. DC current creates a constant magnetic field — no change, no induction. Alternating current continuously changes direction, creating a continuously changing field that induces current in the receiver coil. This is why the charging pad uses AC, and why it needs to change direction over 100,000 times per second to deliver meaningful power."
    },
    {
      id: "q-wireless-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Your friend puts their phone on a wireless charger and notices it charges slower with a thick phone case. Explain why using Faraday's Law. (Hint: the case increases the distance between the two coils.)",
      placeholder: "Greater distance between the coils means... Faraday's Law says... so..."
    },

    // ═══════════════════════════════════════════
    // MAGLEV TRAINS
    // ═══════════════════════════════════════════
    {
      id: "section-maglev",
      type: "section_header",
      icon: "🚄",
      title: "Maglev Trains: Floating on Magnetism",
      subtitle: "~8 minutes"
    },
    {
      id: "b-maglev",
      type: "text",
      content: "Magnetic levitation (maglev) trains float above their tracks using magnetic repulsion — no wheels, no friction, no contact with the track. The current world speed record for a commercial-style train is 603 km/h (375 mph), set by a Japanese maglev in 2015.\n\n**Two main types:**\n\n**Type 1 — Electromagnetic Suspension (EMS):** Used by Germany's Transrapid and Chinese maglev trains.\n- Electromagnets on the train are attracted to iron rails on the track\n- The train is pulled UP toward the rail (attraction, not repulsion)\n- Computer systems rapidly adjust current thousands of times per second to maintain the gap at exactly 10 mm\n- Principle: electromagnets (Lesson 3) + F = BIL + real-time feedback control\n\n**Type 2 — Electrodynamic Suspension (EDS):** Used by Japan's SCMaglev.\n- Superconducting electromagnets on the train are extremely powerful\n- As the train moves over conducting coils in the track, **Lenz's Law** induces currents in the track coils\n- Those currents create magnetic fields that repel the train's magnets — the train floats on a cushion of Lenz's Law\n- Only works at speed (above ~150 km/h) — wheels required for low-speed station stops\n- Principle: superconducting electromagnets + Faraday's Law + Lenz's Law\n\n**Propulsion:** Both types use linear induction motors — essentially an electric motor unrolled into a flat strip. Changing magnetic fields in the track create forces that push the train forward."
    },
    {
      id: "q-maglev-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Japan's SCMaglev train uses Lenz's Law for levitation. As the train speeds up and floats higher, the levitation force gets stronger. Why?",
      options: [
        "Faster speed means more kinetic energy, which converts to magnetic energy",
        "Faster speed means the train's magnets move faster through the track coils — larger flux change rate — stronger induced currents — stronger opposing force",
        "At higher speed, the train weighs less due to aerodynamic lift",
        "The superconducting magnets automatically increase field strength at higher speeds"
      ],
      correctIndex: 1,
      explanation: "Faraday's Law: faster change in flux → stronger induced voltage → stronger induced current. The train's superconducting magnets move faster through the track coils → larger flux change rate → larger induced current in track coils → larger Lenz's Law opposing force → stronger levitation. The faster the train goes, the better it floats. This is the same proportionality you learned with generators: faster spin → more induced voltage."
    },
    {
      id: "q-maglev-2",
      type: "question",
      questionType: "short_answer",
      prompt: "The EDS maglev (Japan's SCMaglev) needs wheels to move at low speeds in stations, but floats magnetically at speeds above ~150 km/h. Using Faraday's and Lenz's Laws, explain why this speed threshold exists.",
      placeholder: "At low speeds, the flux change rate is... so the induced current is... and the levitation force is... At high speeds..."
    },

    // ═══════════════════════════════════════════
    // CAPSTONE ACTIVITY: MATCH THE TECHNOLOGY
    // ═══════════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      icon: "🧠",
      title: "Capstone Activity: Match the Technology",
      subtitle: "~10 minutes"
    },
    {
      id: "b-activity-intro",
      type: "text",
      content: "Below are descriptions of 6 real technologies. For each one, identify which principle(s) from this unit explain how it works. Some technologies use multiple principles.\n\n**Principles from this unit:**\n- **A:** Magnetic poles attract/repel (Lesson 1)\n- **B:** Magnetic domains (Lesson 1)\n- **C:** F = qvB — force on moving charges (Lesson 2)\n- **D:** Current creates magnetic field — right-hand rule (Lesson 3)\n- **E:** Electromagnets (Lesson 3)\n- **F:** F = BIL — force on current-carrying wire (Lesson 4)\n- **G:** Faraday's Law — changing field induces current (Lesson 5)\n- **H:** Lenz's Law — induced current opposes change (Lesson 6)"
    },
    {
      id: "q-match-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Electric guitar pickup: A steel string vibrates above a permanent magnet wrapped with a wire coil. The vibrating string disturbs the field, inducing a tiny electrical signal that gets amplified into sound. Which principle(s) from the list above explain this?",
      placeholder: "The guitar pickup uses principle(s)... because..."
    },
    {
      id: "q-match-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Hard drive: Data is stored as tiny magnetized regions on a spinning magnetic disk. A read head detects the regions by sensing the changing magnetic field as each region passes beneath it. Which principle(s) from the list above explain the READ function?",
      placeholder: "Reading from a hard drive uses principle(s)... because..."
    },
    {
      id: "q-match-3",
      type: "question",
      questionType: "short_answer",
      prompt: "Regenerative braking (EV): When you brake in a Tesla, the motor runs as a generator, slowing the car and recharging the battery. Which principle(s) from the list above explain why the car slows down during regenerative braking?",
      placeholder: "Regenerative braking uses principle(s)... because..."
    },
    {
      id: "q-match-4",
      type: "question",
      questionType: "short_answer",
      prompt: "Hall Pass RFID: When you tap your school ID on a reader, the reader sends out a changing magnetic field that induces current in a tiny coil in your ID card, powering its chip — no battery needed. Which principle(s) explain this?",
      placeholder: "The RFID card uses principle(s)... because..."
    },

    // ═══════════════════════════════════════════
    // THE UNIFIED PICTURE
    // ═══════════════════════════════════════════
    {
      id: "section-unified",
      type: "section_header",
      icon: "⚛️",
      title: "The Unified Picture: One Force, Many Faces",
      subtitle: "~5 minutes"
    },
    {
      id: "b-unified",
      type: "text",
      content: "Here's what's remarkable: everything you learned in this unit — poles, domains, forces on charges, forces on wires, induction, Lenz's Law — is **one force**.\n\nIn 1864, James Clerk Maxwell unified electricity and magnetism into a single theory called **electromagnetism**. He showed that:\n- Electric fields and magnetic fields are two aspects of the same underlying field\n- A changing electric field creates a magnetic field\n- A changing magnetic field creates an electric field\n- Light itself is an electromagnetic wave\n\nMaxwell's four equations (you'll see them in college physics) describe all of electromagnetism in four elegant lines. They predicted the existence of radio waves before anyone had detected them. They explained the speed of light. They formed the foundation for Einstein's special relativity.\n\nAll of that is connected to the magnet sticking to your refrigerator."
    },
    {
      id: "callout-maxwell",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Richard Feynman** (Nobel Prize-winning physicist) was once asked to explain magnetism to a non-scientist. He gave a 7-minute answer that ended with: 'I can't explain that attraction in terms of anything else that's familiar to you. For some reason, that's the end of the line.' Magnetism is strange. The deeper you look, the weirder it gets. But every tool you've learned this unit is accurate, tested, and used by engineers around the world every day."
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
      content: "Today you saw electromagnetism at work in the world around you:\n\n- **MRI:** Superconducting solenoids + Faraday's Law → non-invasive medical imaging\n- **Wireless charging:** Faraday's Law across an air gap → cable-free power transfer\n- **Maglev trains:** Lenz's Law at speed → frictionless levitation at 600 km/h\n- **Hard drives:** Magnetic domains + Faraday's Law → storing and reading data\n- **Electric guitars:** Faraday's Law + vibrating strings → music\n- **Regenerative braking:** Same motor as generator → energy recovery\n- **RFID/NFC:** Wireless induction → contactless cards and payments\n\n**The same handful of equations** — F = qvB, F = BIL, Faraday's Law, Lenz's Law — describe all of it.\n\n**Unit assessment is next class.** Review your vocabulary, your equations, and the right-hand rules."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "🏥",
      content: "**Return to the Question of the Day:** What do MRI machines, maglev trains, and wireless charging have in common?\n\nAnswer: All three are powered by **electromagnetic induction** — Faraday's Law. MRI uses induction to detect signals from protons in the body. Wireless charging uses induction to transfer energy across an air gap. Maglev (EDS type) uses induction + Lenz's Law to create levitation force. They all convert a changing magnetic field into something useful — medical images, electrical energy, or a lifting force."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Choose ONE technology from today's lesson (MRI, wireless charging, maglev, hard drive, electric guitar, regenerative braking, RFID). Write a 3-4 sentence explanation of how it works that uses at least THREE specific physics principles from this unit by name.",
      placeholder: "I chose [technology]. It works because... The principle of [A] means... [B] also explains..."
    },

    // ═══════════════════════════════════════════
    // UNIT REVIEW
    // ═══════════════════════════════════════════
    {
      id: "section-review",
      type: "section_header",
      icon: "📖",
      title: "Unit Review: Key Equations & Concepts",
      subtitle: "Assessment prep"
    },
    {
      id: "b-review",
      type: "text",
      content: "**Equations to know:**\n\n| Equation | What it describes |\n|----------|------------------|\n| F = qvB | Force on a moving charge in a magnetic field |\n| F = BIL | Force on a current-carrying wire in a magnetic field |\n| Faraday's Law (qualitative) | Changing magnetic flux → induced voltage; more coils or faster change = more voltage |\n| Lenz's Law | Induced current opposes the change in flux that caused it |\n\n**Right-hand rules:**\n- **Field around a wire:** Thumb in current direction → fingers show field circulation\n- **Force on a charge or wire:** Fingers in velocity/current direction, curl toward field → thumb shows force\n\n**Key vocabulary:** magnetic field, magnetic domain, solenoid, electromagnet, electromagnetic induction, magnetic flux, eddy currents, Lenz's Law, superconductivity"
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "MRI (Magnetic Resonance Imaging)", definition: "Medical imaging using superconducting electromagnets (1.5–3 T) to align protons, radio pulses to disturb them, and Faraday's Law to detect their return signals. No radiation involved." },
        { term: "Wireless charging (Qi)", definition: "Energy transfer from a charging pad to a device using Faraday's Law across an air gap. An AC coil in the pad creates a changing field; the phone's coil converts it to current via induction." },
        { term: "Maglev (magnetic levitation)", definition: "Train technology that levitates above the track using magnetic repulsion. EDS maglev uses Lenz's Law — Faraday-induced currents in track coils repel the train's superconducting magnets." },
        { term: "Regenerative braking", definition: "EV braking method where the motor runs as a generator, converting kinetic energy back to electrical energy stored in the battery. Uses Faraday's Law (motion → changing field → current)." },
        { term: "RFID/NFC", definition: "Radio-frequency identification: the reader creates a changing magnetic field that induces current in a coil in the card/tag (Faraday's Law), powering its chip wirelessly — no battery needed." },
        { term: "Superconductor", definition: "A material that loses all electrical resistance below a critical temperature. Current flows forever with no energy loss. Used in MRI magnets and EDS maglev trains." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("magnetism-tech-applications")
      .set(lesson);
    console.log('✅ Lesson "Magnetism in Medicine & Technology" seeded successfully!');
    console.log("   Path: courses/physics/lessons/magnetism-tech-applications");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order, "(unit order: 7 of 8)");
    console.log("   Visible: false — publish via Lesson Editor when ready");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
