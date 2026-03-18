// seed-electromagnetism.js
// Creates "Electromagnetism — Current Creates Magnetism" lesson (Magnetism Unit, Lesson 3)
// Run: node scripts/seed-electromagnetism.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Electromagnetism — Current Creates Magnetism",
  course: "Physics",
  unit: "Magnetism",
  order: 3,
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
      content: "Last class you explored permanent magnets — poles, field lines, domains. Everything seemed like its own separate topic. But in 1820, a Danish scientist named **Hans Christian Oersted** accidentally discovered something that changed physics forever.\n\nHe was giving a lecture on electric circuits when he noticed that a nearby compass needle **moved** every time he turned the current on. Electricity was creating a magnetic field. Two things everyone thought were completely separate turned out to be deeply connected."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** In the circuits unit, you learned that current is charges moving through a wire. But here's the twist: moving charges don't just carry energy — they also create a magnetic field. How is electricity secretly magnetism?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Oersted noticed a compass needle deflected when he turned on a nearby electric circuit. Using what you learned about magnetic fields last class, what does the compass movement tell you about what the current-carrying wire is doing?",
      placeholder: "What must be happening near the wire...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain how electric current creates a magnetic field (Oersted's discovery)",
        "Use the right-hand rule to determine the direction of a magnetic field around a current-carrying wire",
        "Describe how a solenoid (coil of wire) creates a stronger, bar-magnet-like field",
        "Explain how electromagnets work and what makes them stronger"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "Current Creates a Magnetic Field",
      subtitle: "~15 minutes"
    },
    {
      id: "b-current-field",
      type: "text",
      content: "Here's the big idea: **every current-carrying wire is surrounded by a magnetic field**.\n\nWhen charges move through a wire, they create circular magnetic field lines that wrap around the wire like invisible rings. The field is strongest close to the wire and gets weaker with distance — just like how electric fields weaken with distance from a charge.\n\nThis isn't just a theory — it's measurable. Put a compass near a wire carrying current, and the compass needle will deflect. Turn the current off, and it goes back to pointing north."
    },
    {
      id: "b-right-hand",
      type: "text",
      content: "**The Right-Hand Rule** tells you which direction the magnetic field circles around the wire:\n\n1. Point your **right thumb** in the direction of the **current** (conventional current = positive to negative)\n2. **Curl your fingers** around the wire\n3. Your fingers show the **direction of the magnetic field**\n\nTry it right now with your right hand! Point your thumb up (imagine current going up). Your fingers curl counterclockwise when viewed from above. That's the field direction.\n\n**Important:** This only works with your RIGHT hand. Using your left hand gives the wrong answer."
    },
    {
      id: "q-rhr-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A wire carries current flowing to the RIGHT. You apply the right-hand rule. Which way does the magnetic field circle around the wire?",
      options: [
        "Clockwise when viewed from the right end",
        "Counterclockwise when viewed from the right end",
        "The field points straight up from the wire",
        "The field points in the same direction as the current"
      ],
      correctIndex: 0,
      explanation: "Point your right thumb to the right (direction of current). Your fingers curl so that when you look at the wire from the right end, the field goes clockwise. The field forms circles perpendicular to the wire, not along it.",
      difficulty: "apply"
    },
    {
      id: "q-rhr-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A compass is placed directly above a horizontal wire. When current flows through the wire to the east, the compass needle deflects to point north-west. Using the right-hand rule, explain why the compass deflected in that direction.",
      placeholder: "Apply the right-hand rule to explain...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // SOLENOIDS & ELECTROMAGNETS
    // ═══════════════════════════════════════════
    {
      id: "section-solenoid",
      type: "section_header",
      icon: "🔩",
      title: "Solenoids & Electromagnets",
      subtitle: "~15 minutes"
    },
    {
      id: "b-solenoid",
      type: "text",
      content: "A single wire creates a weak circular field. But what if you **coil the wire** into a helix? The circular fields from each loop of wire **add together** inside the coil, creating a strong, uniform field that looks exactly like a bar magnet's field.\n\nThis coil of wire is called a **solenoid**. A solenoid has:\n- A clear **north pole** at one end and a **south pole** at the other\n- A **strong, uniform field inside** the coil\n- A field pattern identical to a bar magnet\n\nThe key difference from a permanent magnet: **you can turn it on and off by controlling the current**."
    },
    {
      id: "callout-electromagnet",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Solenoid + Iron Core = Electromagnet**\n\nAdd an iron core (like a nail) inside a solenoid and the magnetic field gets **much** stronger. The iron's magnetic domains align with the solenoid's field, amplifying it. This is an **electromagnet** — the same principle behind junkyard cranes, MRI machines, and magnetic locks."
    },
    {
      id: "b-stronger",
      type: "text",
      content: "**Three ways to make an electromagnet stronger:**\n\n1. **Increase the current** — more moving charges = stronger field\n2. **Add more coils (turns of wire)** — more loops = more fields adding together\n3. **Add an iron core** — the iron's domains align and amplify the field\n\nThis is where your proportional reasoning skills come in: **double the current → double the field strength. Double the number of coils → double the field strength.** The relationship is directly proportional."
    },
    {
      id: "q-electromagnet-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You have an electromagnet with 100 coils of wire and 2 amps of current. You want to make it stronger without changing the power supply. What should you do?",
      options: [
        "Use thicker wire to carry more current",
        "Add more coils of wire around the core",
        "Replace the iron core with a wooden core",
        "Reverse the direction of the current"
      ],
      correctIndex: 1,
      explanation: "Adding more coils increases the number of magnetic field loops that add together inside the solenoid. More coils = stronger field. Reversing the current would flip the poles but not change the strength. A wooden core would make it weaker (wood doesn't amplify the field like iron).",
      difficulty: "apply"
    },
    {
      id: "q-electromagnet-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is the biggest advantage of an electromagnet over a permanent magnet?",
      options: [
        "Electromagnets are always stronger than permanent magnets",
        "Electromagnets can be turned on/off and their strength can be adjusted",
        "Electromagnets don't have poles, so they attract everything",
        "Electromagnets work without electricity"
      ],
      correctIndex: 1,
      explanation: "The biggest advantage is controllability. Electromagnets can be turned on and off by controlling the current, and their strength can be adjusted by changing the current or number of coils. A junkyard crane needs to pick up cars AND release them — only an electromagnet can do both.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // REAL-WORLD APPLICATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-realworld",
      type: "section_header",
      icon: "🌎",
      title: "Electromagnets in the Real World",
      subtitle: "~5 minutes"
    },
    {
      id: "b-applications",
      type: "text",
      content: "Electromagnets are everywhere in modern technology:\n\n- **Junkyard cranes** — giant electromagnets pick up cars, then release them by cutting the current\n- **MRI machines** — supercooled electromagnets create incredibly strong fields to image your body\n- **Maglev trains** — electromagnets create a magnetic cushion that levitates the train above the track\n- **Doorbells** — an electromagnet pulls a metal clapper that strikes a bell when you press the button\n- **Magnetic locks** — electromagnets hold doors closed; cutting power unlocks them (important for fire safety!)\n- **Speakers** — an electromagnet vibrates a cone to create sound waves (connecting circuits to waves!)\n- **Hard drives** — electromagnets write data by magnetizing tiny domains on a spinning disk"
    },
    {
      id: "q-application",
      type: "question",
      questionType: "short_answer",
      prompt: "A junkyard crane uses a giant electromagnet to move cars around. Explain why a permanent magnet would NOT work for this job, even if it were just as strong.",
      placeholder: "Why must it be an electromagnet...",
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
      content: "Today you discovered one of physics' most important connections:\n\n- **Moving charges (current) create a magnetic field** — discovered by Oersted in 1820\n- The **right-hand rule** determines the field direction around a wire\n- A **solenoid** (coiled wire) creates a bar-magnet-like field that can be turned on/off\n- An **electromagnet** (solenoid + iron core) amplifies the field — more current and more coils = stronger\n- Electromagnets power **MRI machines, speakers, maglev trains, locks, and more**\n\n**Coming up next:** If current creates a magnetic field... can a magnetic field create current? (Spoiler: yes. And that's how every power plant on Earth works.)"
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** How is electricity secretly magnetism?\n\nAnswer: Every time charges move (current flows), they create a magnetic field around them. Electricity and magnetism aren't separate forces — they're two aspects of the same force: **electromagnetism**. This is why a compass deflects near a wire carrying current, and why coiling a wire creates a magnet you can switch on and off."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Explain the difference between a permanent magnet and an electromagnet. Include at least one advantage of each.",
      placeholder: "Compare permanent magnets and electromagnets...",
      difficulty: "analyze"
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
        { term: "Oersted's discovery", definition: "The 1820 observation that electric current creates a magnetic field — the first evidence linking electricity and magnetism." },
        { term: "Right-hand rule", definition: "Point your right thumb in the direction of current; your curled fingers show the direction of the magnetic field around the wire." },
        { term: "Solenoid", definition: "A coil of wire that produces a strong, uniform magnetic field inside when current flows through it. Has north and south poles like a bar magnet." },
        { term: "Electromagnet", definition: "A solenoid with an iron core inside. Creates a strong, controllable magnetic field that can be turned on and off." },
        { term: "Electromagnetism", definition: "The unified force combining electricity and magnetism. Moving charges create magnetic fields; changing magnetic fields create electric fields." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("electromagnetism")
      .set(lesson);
    console.log('✅ Lesson "Electromagnetism" seeded successfully!');
    console.log("   Path: courses/physics/lessons/electromagnetism");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log("   Visible: false (publish via Lesson Editor when ready)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
