// seed-magnetism-force-on-charges.js
// Creates "Magnetic Force on Moving Charges" lesson (Magnetism Unit, Lesson 2)
// Run: node scripts/seed-magnetism-force-on-charges.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Magnetic Force on Moving Charges",
  course: "Physics",
  unit: "Magnetism",
  questionOfTheDay: "The aurora borealis (northern lights) happens when charged particles from the Sun slam into Earth's atmosphere near the poles. Why only near the poles? What does Earth's magnetic field have to do with it?",
  order: 2,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🌌",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Last class you learned that magnets exert forces on **other magnets** and on **magnetic materials** like iron. But here's a question: a magnet can also deflect a beam of electrons. Electrons aren't iron — they're not magnetic materials at all.\n\nSo why does a magnet affect them?"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "🌌",
      content: "**Question of the Day:** The aurora borealis (northern lights) happens when charged particles from the Sun slam into Earth's atmosphere near the poles. Why only near the poles? What does Earth's magnetic field have to do with it?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about what you know about charges and fields. Why might a moving charge behave differently in a magnetic field than a stationary charge? Take a guess — there's no wrong answer here.",
      placeholder: "I think a moving charge might..."
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why only MOVING charges experience a magnetic force (stationary charges do not)",
        "Use F = qvB to calculate the magnetic force on a moving charge",
        "Apply the right-hand rule to determine the direction of the magnetic force",
        "Describe how the magnetic force causes circular motion in charged particles",
        "Explain real-world applications: aurora, particle accelerators, mass spectrometers"
      ]
    },

    // ═══════════════════════════════════════════
    // THE BIG IDEA
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "Motion Is the Key",
      subtitle: "~10 minutes"
    },
    {
      id: "b-motion-key",
      type: "text",
      content: "Here's the rule that connects everything in this unit:\n\n**A magnetic field only exerts a force on charges that are MOVING.**\n\nA charge sitting still in a magnetic field? Nothing happens. No force, no movement, nothing. But the instant that charge starts moving — boom — the magnetic field pushes on it.\n\nThis is fundamentally different from electric fields, which push on ANY charge, moving or not.\n\nThe force depends on three things:\n1. The **charge** of the particle (q) — bigger charge = bigger force\n2. The **speed** of the particle (v) — moving faster = bigger force\n3. The **strength** of the magnetic field (B) — stronger field = bigger force"
    },
    {
      id: "callout-stationary",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Critical distinction:** A stationary charge creates an electric field but NO magnetic field. A moving charge creates BOTH an electric field AND a magnetic field. This is why current-carrying wires (moving charges) create magnetic fields — and why they also feel forces when placed in external magnetic fields."
    },
    {
      id: "q-moving-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A proton is sitting still inside a strong magnetic field. What force does the magnetic field exert on it?",
      options: [
        "A large force, because protons are positively charged",
        "A small force in the direction of the field",
        "Zero force — magnetic fields only affect moving charges",
        "A repulsive force pushing it away from the magnet"
      ],
      correctIndex: 2,
      explanation: "Magnetic fields only exert forces on MOVING charges. A stationary proton, no matter how charged, experiences zero magnetic force. If you wanted to use a magnetic field to push that proton, you'd first need to get it moving."
    },

    // ═══════════════════════════════════════════
    // THE EQUATION
    // ═══════════════════════════════════════════
    {
      id: "section-equation",
      type: "section_header",
      icon: "🧮",
      title: "The Equation: F = qvB",
      subtitle: "~10 minutes"
    },
    {
      id: "b-equation",
      type: "text",
      content: "The magnetic force on a moving charge is:\n\n**F = qvB**\n\n| Variable | Meaning | Unit |\n|----------|---------|------|\n| F | Magnetic force | Newtons (N) |\n| q | Charge of the particle | Coulombs (C) |\n| v | Speed of the particle | m/s |\n| B | Magnetic field strength | Tesla (T) |\n\n**Important caveat:** This equation gives you the maximum force — when the velocity is perpendicular to the magnetic field. If the particle moves parallel to the field, the force is zero. The force is greatest when velocity ⊥ field.\n\nFor our algebra-based class, we'll always work with the perpendicular case (maximum force)."
    },
    {
      id: "callout-tesla",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**How strong is a Tesla?** Earth's magnetic field is about 0.00005 T (50 microtesla) — very weak. A fridge magnet is about 0.001 T. An MRI machine uses 1.5 to 3 T. The strongest continuous magnets ever built reach about 45 T. Nikola Tesla — the scientist, not the car — has one of the coolest units in physics named after him."
    },
    {
      id: "q-calc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An electron (charge = 1.6 × 10⁻¹⁹ C) moves at 2.0 × 10⁶ m/s through a magnetic field of 0.50 T. What is the magnetic force on the electron?",
      options: [
        "1.6 × 10⁻¹³ N",
        "3.2 × 10⁻¹³ N",
        "1.6 × 10⁻¹⁹ N",
        "6.4 × 10⁻²⁰ N"
      ],
      correctIndex: 0,
      explanation: "F = qvB = (1.6 × 10⁻¹⁹ C)(2.0 × 10⁶ m/s)(0.50 T) = 1.6 × 10⁻¹³ N. Notice the units: C × m/s × T = N (the Tesla is defined so this works out). This is a tiny force — but for a particle as light as an electron, it's enormous relative to its mass."
    },
    {
      id: "q-calc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A proton moves through a magnetic field and experiences a force of 4.8 × 10⁻¹⁵ N. The magnetic field strength is 0.30 T and the proton's charge is 1.6 × 10⁻¹⁹ C. What is the proton's speed?",
      options: [
        "1.0 × 10⁵ m/s",
        "1.0 × 10⁴ m/s",
        "2.3 × 10⁻³⁴ m/s",
        "1.0 × 10⁶ m/s"
      ],
      correctIndex: 0,
      explanation: "Rearrange F = qvB → v = F/(qB) = (4.8 × 10⁻¹⁵) / (1.6 × 10⁻¹⁹ × 0.30) = (4.8 × 10⁻¹⁵) / (4.8 × 10⁻²⁰) = 1.0 × 10⁵ m/s. Same algebra skills as every other equation in this course — just new variable names."
    },
    {
      id: "q-proportional",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A particle moving at speed v experiences magnetic force F. If the particle's speed doubles to 2v (same field, same charge), the new force is:",
      options: [
        "F/2 — inversely proportional",
        "F — speed doesn't matter",
        "2F — directly proportional",
        "4F — squared relationship"
      ],
      correctIndex: 2,
      explanation: "F = qvB. Since q and B are constant, F is directly proportional to v. Double v → double F. This is the same direct proportion you used throughout the year — same tool, new context."
    },

    // ═══════════════════════════════════════════
    // DIRECTION: RIGHT-HAND RULE FOR FORCE
    // ═══════════════════════════════════════════
    {
      id: "section-rhr",
      type: "section_header",
      icon: "✋",
      title: "Which Way Does It Push? Right-Hand Rule for Force",
      subtitle: "~10 minutes"
    },
    {
      id: "b-rhr-force",
      type: "text",
      content: "F = qvB tells you the magnitude of the force. But which direction does it push?\n\nThe magnetic force is always **perpendicular to both the velocity and the field** — it pushes the particle sideways, not forward or backward.\n\n**Right-Hand Rule for Force** (this is different from the field direction rule!):\n\n1. Point your **fingers** in the direction of the **velocity** (the way the charge is moving)\n2. **Curl** your fingers toward the **magnetic field** direction\n3. Your **thumb** points in the direction of the force on a **positive** charge\n\n**For a negative charge:** Do the same thing with your right hand, then **flip** the direction. (Or just use your left hand.)\n\nTry it: fingers point right (velocity), curl upward toward field pointing up — your thumb points OUT OF THE PAGE. That's the force direction on a positive charge."
    },
    {
      id: "callout-perpendicular",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Why perpendicular?** The magnetic force never does work on a charged particle — it only changes the direction of motion, never the speed. This is because the force is always perpendicular to the velocity. Work = F × d × cos(θ), and if θ = 90°, then cos(90°) = 0. No work done. That's why a magnetic field can deflect particles into circular paths without speeding them up or slowing them down."
    },
    {
      id: "q-rhr-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A positive charge moves to the RIGHT in a magnetic field pointing OUT OF THE PAGE toward you. Using the right-hand rule for force, which direction is the force on the charge?",
      options: [
        "To the right (same as velocity)",
        "Out of the page (same as field)",
        "Downward",
        "Upward"
      ],
      correctIndex: 3,
      explanation: "Right-hand rule: point fingers to the right (velocity), curl them toward out-of-page (field direction) — your thumb points UPWARD. Force is upward on the positive charge. Notice the force is perpendicular to both the velocity (rightward) and the field (out of page)."
    },
    {
      id: "q-rhr-2",
      type: "question",
      questionType: "short_answer",
      prompt: "An electron (negative charge) moves to the RIGHT in a magnetic field pointing OUT OF THE PAGE. Using the right-hand rule for force: (1) What direction would the force be on a positive charge? (2) What direction is it actually for the electron (negative charge)?",
      placeholder: "For a positive charge the force would be... For the electron it is..."
    },

    // ═══════════════════════════════════════════
    // CIRCULAR MOTION
    // ═══════════════════════════════════════════
    {
      id: "section-circular",
      type: "section_header",
      icon: "🔄",
      title: "Circular Motion: What Happens When You Deflect a Particle",
      subtitle: "~8 minutes"
    },
    {
      id: "b-circular",
      type: "text",
      content: "Here's what's remarkable: if a charged particle moves through a uniform magnetic field, the magnetic force continuously pushes it sideways — perpendicular to its velocity. What shape does a particle trace when a force always pushes perpendicular to its motion?\n\n**A circle.**\n\nThis is exactly what happens:\n- The magnetic force acts as the **centripetal force** that keeps the particle curving\n- The particle maintains constant **speed** (because the force does no work)\n- But the **direction** changes continuously → circular path\n\nThis is the principle behind **cyclotrons** (early particle accelerators) and **mass spectrometers** (devices that identify chemicals by how much their particles curve)."
    },
    {
      id: "callout-practical",
      type: "callout",
      style: "scenario",
      icon: "🏥",
      content: "**Mass Spectrometer:** A hospital lab injects a sample into a chamber with a known magnetic field. Heavier ions curve less (larger radius), lighter ions curve more. By measuring the radius of curvature, the machine can identify exactly what molecules are in the sample — used for drug testing, disease diagnosis, and detecting environmental toxins. The formula F = qvB is the physics that makes this possible."
    },
    {
      id: "q-circular",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A proton moves through a uniform magnetic field and follows a circular path. What happens to its speed as it travels around the circle?",
      options: [
        "It speeds up — the force is in the direction of motion",
        "It slows down — the field takes energy from the particle",
        "It stays constant — the force is always perpendicular to the motion",
        "It oscillates — speeding up on one side, slowing on the other"
      ],
      correctIndex: 2,
      explanation: "The magnetic force is always perpendicular to the velocity. A perpendicular force changes direction, not speed. No work is done (W = Fd·cos90° = 0), so kinetic energy is constant, which means speed is constant. Only the direction changes — creating circular motion."
    },

    // ═══════════════════════════════════════════
    // REAL-WORLD: AURORA BOREALIS
    // ═══════════════════════════════════════════
    {
      id: "section-aurora",
      type: "section_header",
      icon: "🌌",
      title: "Real World: The Aurora Borealis Explained",
      subtitle: "~7 minutes"
    },
    {
      id: "b-aurora",
      type: "text",
      content: "The Sun constantly shoots charged particles (mostly electrons and protons) into space — this is called the **solar wind**. These particles travel at hundreds of kilometers per second.\n\nWhen they reach Earth, here's what happens:\n\n1. Earth's magnetic field points roughly from south to north (from the perspective of the particles approaching)\n2. Moving charges in a magnetic field experience F = qvB — they get deflected\n3. The deflection causes the particles to spiral along magnetic field lines\n4. Earth's field lines converge at the poles → particles are funneled toward the poles\n5. When they hit the atmosphere at the poles, they collide with gas molecules and make them glow → **aurora**\n\nThis is why auroras only appear near the poles: Earth's magnetic field acts as a shield that deflects most solar wind away from the equator and funnels it to the poles.\n\n**Mars has no significant magnetic field** — solar wind hits the entire atmosphere directly, which is why Mars slowly lost its atmosphere over billions of years."
    },
    {
      id: "q-aurora",
      type: "question",
      questionType: "short_answer",
      prompt: "Return to the Question of the Day: Using F = qvB and what you know about magnetic fields, explain why the northern lights appear near the poles and not at the equator.",
      placeholder: "The solar wind consists of charged particles... Earth's magnetic field... near the poles..."
    },

    // ═══════════════════════════════════════════
    // PARTICLE ACCELERATORS
    // ═══════════════════════════════════════════
    {
      id: "section-accelerators",
      type: "section_header",
      icon: "⚛️",
      title: "Particle Accelerators: Smashing Atoms to Learn About the Universe",
      subtitle: "~5 minutes"
    },
    {
      id: "b-accelerators",
      type: "text",
      content: "The Large Hadron Collider (LHC) at CERN is a 27-kilometer circular tunnel where protons travel at 99.999999% the speed of light before colliding. The physics that makes this possible? **F = qvB.**\n\nSuperconductive electromagnets create powerful magnetic fields that continuously deflect proton beams into circular paths. The larger the accelerator ring, the smaller the deflection needed per meter, and the higher the speed the particles can reach before collision.\n\nWhen particles collide, they release enormous energy that briefly creates exotic particles — some of which have only existed since the Big Bang. This is how physicists discovered the Higgs boson in 2012, confirming a theory that explained why matter has mass.\n\n**The formula F = qvB — which you just learned — is the same formula that guides protons around a 27-kilometer tunnel to answer the deepest questions in physics.**"
    },
    {
      id: "q-lhc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "The LHC uses magnetic fields to keep protons moving in a circular path. If the engineers increased the strength of the magnetic field, what would happen to the radius of the proton's circular path (at the same speed)?",
      options: [
        "Radius increases — stronger field means a wider circle",
        "Radius decreases — stronger field creates a tighter curve",
        "Radius stays the same — only the speed matters",
        "The proton would stop moving"
      ],
      correctIndex: 1,
      explanation: "A stronger magnetic field means a larger force on the proton (F = qvB). A larger centripetal force pulls the proton into a tighter circle — smaller radius. This is why more powerful magnets allow particle accelerators to be more compact. The LHC uses superconducting magnets at 8.33 T to keep its 27 km ring a manageable size."
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
      content: "Today you learned how magnetic fields interact with moving charges:\n\n- **Only moving charges** feel a magnetic force — stationary charges feel nothing\n- **F = qvB** — force depends on charge, speed, and field strength (all direct proportions)\n- **Right-hand rule for force** — force is always perpendicular to both velocity and field\n- **Circular motion** — a perpendicular force keeps the speed constant but curves the path\n- **Aurora borealis** — Earth's field deflects solar wind to the poles, where it illuminates the atmosphere\n- **Particle accelerators** — F = qvB guides billion-dollar experiments that probe the foundations of the universe\n\n**Next class:** What happens when the charge isn't just passing through — what if it's actually flowing through a wire? A current-carrying wire in a magnetic field experiences a force too. That force is what makes electric motors spin."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "🌌",
      content: "**Return to the Question of the Day:** Why do auroras only appear near the poles?\n\nAnswer: Solar wind particles (moving charges) enter Earth's magnetic field and experience F = qvB. The force deflects them into spiral paths that follow Earth's magnetic field lines. Those field lines converge at the poles, so the particles are funneled toward the poles where they collide with the atmosphere and glow. The equator is shielded because the magnetic field lines run parallel to the incoming particles there — no perpendicular component means no deflecting force."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: An alpha particle (charge = 3.2 × 10⁻¹⁹ C) moves at 5.0 × 10⁵ m/s through a 0.40 T magnetic field. (a) Calculate the magnetic force. (b) Explain why the particle will follow a circular path.",
      placeholder: "(a) F = ... (b) The particle follows a circle because..."
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
        { term: "Magnetic force on a charge", definition: "The force F = qvB experienced by a moving charged particle in a magnetic field. Only acts on moving charges; zero for stationary charges." },
        { term: "Tesla (T)", definition: "The SI unit of magnetic field strength. Earth's field ≈ 0.00005 T; MRI machines use 1.5–3 T." },
        { term: "Right-hand rule for force", definition: "Point fingers in the direction of velocity, curl toward the field — thumb points in the direction of force on a positive charge." },
        { term: "Cyclotron motion", definition: "The circular path followed by a charged particle moving perpendicular to a uniform magnetic field. Speed stays constant; direction changes continuously." },
        { term: "Solar wind", definition: "A stream of charged particles (mainly electrons and protons) emitted by the Sun. Earth's magnetic field deflects most solar wind away, funneling it to the poles where it creates auroras." },
        { term: "Mass spectrometer", definition: "A device that uses F = qvB to bend the paths of charged particles. Heavier particles curve less, lighter ones curve more — used to identify substances." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("magnetism-force-on-charges")
      .set(lesson);
    console.log('✅ Lesson "Magnetic Force on Moving Charges" seeded successfully!');
    console.log("   Path: courses/physics/lessons/magnetism-force-on-charges");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order, "(unit order: 2 of 8)");
    console.log("   Visible: false — publish via Lesson Editor when ready");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
