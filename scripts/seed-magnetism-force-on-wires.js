// seed-magnetism-force-on-wires.js
// Creates "Magnetic Force on Current-Carrying Wires" lesson (Magnetism Unit, Lesson 4)
// Run: node scripts/seed-magnetism-force-on-wires.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Magnetic Force on Current-Carrying Wires",
  course: "Physics",
  unit: "Magnetism",
  questionOfTheDay: "Your phone speaker produces sound by vibrating a cone. Inside the speaker is a coil of wire and a permanent magnet. How does electricity flowing through a wire create a physical back-and-forth motion that moves air and makes sound?",
  order: 4,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔊",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Two classes ago you learned that **moving charges** experience a force in a magnetic field (F = qvB). A current-carrying wire is full of moving charges — electrons drifting through the metal.\n\nSo here's the logical next step: if moving charges feel a magnetic force, and a wire is full of moving charges... **the wire itself should feel a force.**\n\nThis connection — between the force on individual charges and the force on the wire carrying them — turns out to be one of the most useful facts in all of engineering."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "🔊",
      content: "**Question of the Day:** Your phone speaker produces sound by vibrating a cone. Inside the speaker is a coil of wire and a permanent magnet. How does electricity flowing through a wire create a physical back-and-forth motion that moves air and makes sound?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Last class you learned that individual charges moving through a magnetic field experience F = qvB. Based on that, predict: if many charges are all moving together in the same direction (a current), what would you expect to happen to the wire?",
      placeholder: "If individual charges feel a force, then the wire..."
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why a current-carrying wire experiences a force in a magnetic field",
        "Use F = BIL to calculate the force on a current-carrying wire",
        "Use the right-hand rule to determine the direction of the force on a wire",
        "Explain how two parallel wires interact when carrying current",
        "Apply this principle to speakers, railguns, and electric motors"
      ]
    },

    // ═══════════════════════════════════════════
    // THE EQUATION
    // ═══════════════════════════════════════════
    {
      id: "section-equation",
      type: "section_header",
      icon: "📚",
      title: "The Equation: F = BIL",
      subtitle: "~12 minutes"
    },
    {
      id: "b-equation",
      type: "text",
      content: "The magnetic force on a current-carrying wire is:\n\n**F = BIL**\n\n| Variable | Meaning | Unit |\n|----------|---------|------|\n| F | Magnetic force on the wire | Newtons (N) |\n| B | Magnetic field strength | Tesla (T) |\n| I | Current in the wire | Amperes (A) |\n| L | Length of wire inside the field | Meters (m) |\n\nThis equation makes intuitive sense:\n- **Stronger field (B)** → bigger force (more magnetic influence per charge)\n- **More current (I)** → more charges moving → bigger force\n- **Longer wire (L)** → more charges in the field at once → bigger force\n\nAll direct proportions — same proportional reasoning you've been using all year."
    },
    {
      id: "callout-connection",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Connection to F = qvB:** Where does F = BIL come from? Current I = charge/time, and the charges move at drift speed v through length L. When you multiply it all out, the qv terms in F = qvB become IL. Same underlying physics — just expressed for a whole wire instead of one particle."
    },
    {
      id: "q-calc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 0.30 m wire carries a current of 5.0 A through a magnetic field of 0.80 T. What is the magnetic force on the wire?",
      options: [
        "0.12 N",
        "1.2 N",
        "4.0 N",
        "12 N"
      ],
      correctIndex: 1,
      explanation: "F = BIL = (0.80 T)(5.0 A)(0.30 m) = 1.2 N. Units check: T × A × m = (kg/(A·s²)) × A × m = kg·m/s² = N. ✓"
    },
    {
      id: "q-calc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A wire in a magnetic field of 0.50 T experiences a force of 3.0 N. If the wire is 0.60 m long, what current is flowing through it?",
      options: [
        "0.90 A",
        "2.5 A",
        "10 A",
        "25 A"
      ],
      correctIndex: 2,
      explanation: "Rearrange F = BIL → I = F/(BL) = 3.0 / (0.50 × 0.60) = 3.0 / 0.30 = 10 A. Always rearrange for the unknown before plugging in numbers."
    },
    {
      id: "q-proportional",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A wire experiences a force F in a magnetic field. If the current is tripled and the wire length is doubled (same field), what is the new force?",
      options: [
        "2F",
        "3F",
        "5F",
        "6F"
      ],
      correctIndex: 3,
      explanation: "F = BIL. If I triples and L doubles, the new force = B(3I)(2L) = 6BIL = 6F. Multiplying both factors independently then together: 3 × 2 = 6. This is proportional reasoning with two variables changing simultaneously."
    },

    // ═══════════════════════════════════════════
    // DIRECTION
    // ═══════════════════════════════════════════
    {
      id: "section-direction",
      type: "section_header",
      icon: "✋",
      title: "Which Way Does It Push? Right-Hand Rule for Wire Force",
      subtitle: "~8 minutes"
    },
    {
      id: "b-direction",
      type: "text",
      content: "Same right-hand rule as last class — just now applied to the wire:\n\n1. Point your **fingers** in the direction of the **current** (conventional current = positive to negative)\n2. **Curl** your fingers toward the **magnetic field** direction\n3. Your **thumb** points in the direction of the **force on the wire**\n\nOr alternatively:\n1. Point your **four fingers** in the direction of current\n2. Point them toward the magnetic field direction (fingers bend that way)\n3. Thumb → force direction\n\n**The force is always perpendicular to both the current and the field.** If the current runs parallel to the field, there's no force — just like F = 0 when velocity is parallel to B."
    },
    {
      id: "q-direction-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A horizontal wire carries current flowing to the RIGHT. The magnetic field points UPWARD. Using the right-hand rule, the force on the wire is directed:",
      options: [
        "To the right (same as current)",
        "Upward (same as field)",
        "Out of the page toward you",
        "Into the page away from you"
      ],
      correctIndex: 2,
      explanation: "Right-hand rule: fingers point right (current), curl upward (toward field direction), thumb points OUT OF THE PAGE. The force on the wire is directed out of the page — perpendicular to both the current and field directions."
    },
    {
      id: "q-direction-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A wire carries current flowing DOWNWARD through a magnetic field pointing OUT OF THE PAGE toward you. Use the right-hand rule to determine the force direction, and explain your steps.",
      placeholder: "Step 1: I point my fingers... Step 2: I curl toward... Step 3: My thumb points..."
    },

    // ═══════════════════════════════════════════
    // TWO PARALLEL WIRES
    // ═══════════════════════════════════════════
    {
      id: "section-parallel",
      type: "section_header",
      icon: "⚡",
      title: "Two Wires Talking to Each Other",
      subtitle: "~8 minutes"
    },
    {
      id: "b-parallel",
      type: "text",
      content: "Here's something wild: two parallel current-carrying wires exert forces on each other — even without touching.\n\nWire 1 carries a current → creates a magnetic field (Oersted's discovery, Lesson 3). Wire 2 sits inside that field and carries its own current → feels a force (F = BIL, today's lesson).\n\n**The result:**\n- **Currents in the SAME direction → wires attract each other**\n- **Currents in OPPOSITE directions → wires repel each other**\n\nThis isn't just a textbook curiosity — it's how the **Ampere** is defined. One ampere is defined as the current in two parallel wires 1 meter apart that produces a force of 2 × 10⁻⁷ N per meter of length. The definition of the basic unit of current in all of physics comes from this force between wires."
    },
    {
      id: "q-parallel-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two parallel wires both carry current flowing to the RIGHT. What force do they exert on each other?",
      options: [
        "They repel — like currents repel like charges",
        "They attract — same-direction currents attract",
        "No force — they're parallel so they don't interact",
        "They repel or attract depending on the distance"
      ],
      correctIndex: 1,
      explanation: "Parallel wires carrying current in the same direction attract each other. Wire 1 creates a magnetic field; Wire 2 (in that field) experiences F = BIL directed toward Wire 1. This seems counterintuitive compared to charges (like charges repel), but it's correct for currents."
    },

    // ═══════════════════════════════════════════
    // REAL-WORLD APPLICATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-realworld",
      type: "section_header",
      icon: "🌎",
      title: "F = BIL in the Real World",
      subtitle: "~8 minutes"
    },
    {
      id: "b-speakers",
      type: "text",
      content: "**Speakers — Making Sound from F = BIL**\n\nInside every speaker — from your earbuds to a concert PA system — is:\n- A circular **voice coil** (wire coil) attached to the speaker cone\n- A **permanent magnet** surrounding the coil\n\nWhen audio current flows through the coil, F = BIL creates a force on the wire. As the current alternates (AC audio signal), the force alternates direction — the coil (and cone) vibrates back and forth.\n\nThat vibration pushes air molecules → **sound waves** → your ears.\n\nThe frequency of the current matches the frequency of the sound. 440 Hz current = 440 vibrations per second = the musical note A. Higher current = bigger force = louder sound. This is how electricity becomes music."
    },
    {
      id: "callout-railgun",
      type: "callout",
      style: "scenario",
      icon: "🚀",
      content: "**Railgun:** The US Navy developed electromagnetic railguns that fire projectiles using F = BIL instead of gunpowder. Two parallel conducting rails carry enormous current in opposite directions. A conducting projectile bridges the gap, completing the circuit. The force on the current-carrying projectile (F = BIL with a massive I) accelerates it to over 2,000 m/s (Mach 6) — about 10× the speed of a rifle bullet. No explosives needed. Pure electromagnetism."
    },
    {
      id: "b-motors",
      type: "text",
      content: "**Electric Motors — F = BIL Creates Rotation**\n\nAn electric motor is essentially the lesson you're learning right now, arranged to produce continuous rotation:\n\n- A **coil of wire** (armature) sits between the poles of a permanent magnet\n- Current flows through the coil → F = BIL pushes each side of the coil in opposite directions (opposite current directions on each side)\n- Opposite forces on opposite sides of the coil create a **torque** that spins the coil\n- A device called a **commutator** reverses the current direction every half turn, keeping the torque always in the same rotational direction\n\nEvery electric motor — in your phone's vibration motor, your car's power windows, an electric vehicle's drivetrain, a jet engine's starter, an industrial pump — runs on this principle."
    },
    {
      id: "q-speaker",
      type: "question",
      questionType: "short_answer",
      prompt: "Return to the Question of the Day: Explain how a speaker converts electricity into sound using F = BIL. Your answer should mention the voice coil, the permanent magnet, the direction of force, and why the cone vibrates.",
      placeholder: "Inside the speaker, a coil of wire... F = BIL creates... As the current alternates..."
    },
    {
      id: "q-motor-connection",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An electric vehicle motor produces more torque (turning force) when more current flows through it. This is directly explained by:",
      options: [
        "Ohm's Law — more current means more voltage",
        "F = BIL — more current means more force on the wires in the motor",
        "Faraday's Law — more current means more induction",
        "The right-hand rule — higher current changes the force direction"
      ],
      correctIndex: 1,
      explanation: "F = BIL directly explains it. B (the permanent magnet's field) is fixed, L (wire length) is fixed, so F is directly proportional to I. Double the current → double the force → double the torque. This is why EVs have maximum torque at zero RPM — they can deliver full current (and full force) instantly."
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
      content: "Today you connected the force on moving charges to the force on wires:\n\n- **F = BIL** — magnetic force on a current-carrying wire depends on field strength, current, and wire length\n- All three are direct proportions — same proportional reasoning you've used all year\n- **Right-hand rule** — fingers in current direction, curl toward field, thumb = force direction\n- **Parallel wires** — same-direction currents attract, opposite-direction currents repel\n- **Speakers** — alternating current creates alternating force → cone vibrates → sound\n- **Motors** — forces on opposite sides of a coil create rotation\n- **Railguns** — massive current = massive force = extreme projectile speed\n\n**Next class:** You know that current creates fields. And you know that magnets exert forces on current. So: what happens when you change the magnetic field through a coil? (The answer powers every electrical generator on Earth.)"
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "🔊",
      content: "**Return to the Question of the Day:** How does a speaker turn electricity into sound?\n\nAnswer: The voice coil (a wire coil attached to the speaker cone) sits inside the field of a permanent magnet. Audio current flows through the coil. F = BIL creates a force on the coil — proportional to the current. When AC audio current alternates direction, the force alternates, the coil vibrates back and forth, and the cone (attached to the coil) pushes air molecules in and out. Those pressure waves reach your ears as sound. The frequency of the current = frequency of the sound. More current = louder sound."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A wire 0.25 m long carries 8.0 A of current in a 0.60 T magnetic field. (a) Calculate the force on the wire. (b) If the current is doubled and the wire length is halved, what is the new force? Show your proportional reasoning.",
      placeholder: "(a) F = ... (b) New force = ... because..."
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
        { term: "F = BIL", definition: "The equation for magnetic force on a current-carrying wire. Force = magnetic field × current × length of wire in the field. All three variables are in direct proportion." },
        { term: "Voice coil", definition: "The wire coil inside a speaker, attached to the cone. Current through the coil in the permanent magnet's field creates F = BIL, vibrating the cone to produce sound." },
        { term: "Torque", definition: "A rotational force — a force that causes something to spin. An electric motor produces torque when F = BIL acts on opposite sides of a wire coil in a magnetic field." },
        { term: "Commutator", definition: "A device in a DC motor that reverses current direction every half rotation, ensuring the torque always pushes the coil in the same rotational direction." },
        { term: "Railgun", definition: "An electromagnetic weapon that accelerates a conducting projectile using F = BIL from enormous current flowing through parallel rails. No gunpowder — pure electromagnetic force." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("magnetism-force-on-wires")
      .set(lesson);
    console.log('✅ Lesson "Magnetic Force on Current-Carrying Wires" seeded successfully!');
    console.log("   Path: courses/physics/lessons/magnetism-force-on-wires");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order, "(unit order: 4 of 8)");
    console.log("   Visible: false — publish via Lesson Editor when ready");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
