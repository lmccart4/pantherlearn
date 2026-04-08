// seed-magnets-and-fields.js
// Creates "Magnets & Magnetic Fields" lesson (Magnetism Unit, Lesson 1)
// Run: node scripts/seed-magnets-and-fields.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Magnets & Magnetic Fields",
  course: "Physics",
  unit: "Magnetism",
  order: 1,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🧲",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "You've been playing with magnets since you were a kid — sticking them to the fridge, feeling them snap together, or watching them push each other away. But have you ever stopped to think about **why** magnets do what they do?\n\nIn the electrostatics unit, you learned about invisible **electric fields** around charges. Today you'll discover that magnets have their own invisible fields — and they follow surprisingly similar rules."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** You've stuck magnets to your fridge your whole life. But magnets don't stick to everything — and they can push things away too. What's actually happening?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "List everything you already know about magnets. What do they stick to? What don't they stick to? What happens when you put two magnets near each other?",
      placeholder: "Write everything you know about how magnets behave...",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Describe the properties of magnets (poles, attraction, repulsion)",
        "Map magnetic field lines around a bar magnet and between pairs of magnets",
        "Explain what a magnetic field is and compare it to an electric field",
        "Identify magnetic vs non-magnetic materials using domain theory"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "Magnetic Poles & Fields",
      subtitle: "~25 minutes"
    },
    {
      id: "b-poles-text",
      type: "text",
      content: "Every magnet has two **poles** — a **north pole** and a **south pole**. This is non-negotiable: you cannot have a magnet with only one pole. If you break a magnet in half, you get two smaller magnets, each with their own north and south. Scientists call this \"no magnetic monopoles.\"\n\nThe rules for magnetic poles are simple:\n- **Opposite poles attract** (north pulls toward south)\n- **Like poles repel** (north pushes away from north, south pushes away from south)\n\nSound familiar? It should — this is exactly how electric charges work. Positive attracts negative, like repels like. The difference: electric charges can exist alone (a single proton), but magnetic poles **always** come in pairs."
    },
    {
      id: "q-poles-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You break a bar magnet in half. What do you get?",
      options: [
        "One piece with only north and one piece with only south",
        "Two smaller magnets, each with their own north and south poles",
        "Two pieces of non-magnetic metal",
        "One magnetic piece and one non-magnetic piece"
      ],
      correctIndex: 1,
      explanation: "You cannot isolate a single magnetic pole. Breaking a magnet in half creates two complete magnets, each with its own north and south pole. This is fundamentally different from electric charges, which CAN exist alone.",
      difficulty: "understand"
    },
    {
      id: "b-field-lines",
      type: "text",
      content: "A **magnetic field** is the invisible region around a magnet where magnetic forces act. We visualize it with **magnetic field lines**:\n\n- Field lines exit from the **north pole** and curve around to enter the **south pole**\n- Inside the magnet, the lines continue from south to north — forming **closed loops**\n- Lines never cross\n- Where lines are closer together, the field is **stronger**\n\nIf you sprinkle iron filings on a piece of paper placed over a bar magnet, they align along these field lines and you can literally **see** the field pattern."
    },
    {
      id: "callout-compare",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Electric fields vs Magnetic fields:**\n- Electric field lines start on positive charges and end on negative charges (they're open-ended)\n- Magnetic field lines form **closed loops** — they never start or stop\n- Both fields get weaker with distance\n- Both fields exert forces without contact (field forces)"
    },
    {
      id: "q-field-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How are magnetic field lines different from electric field lines?",
      options: [
        "Magnetic field lines are straight; electric field lines are curved",
        "Magnetic field lines form closed loops; electric field lines start and end on charges",
        "Magnetic field lines only exist inside magnets; electric fields exist everywhere",
        "There is no difference — they follow the same rules"
      ],
      correctIndex: 1,
      explanation: "Electric field lines begin on positive charges and end on negative charges. Magnetic field lines form closed loops — they exit the north pole, curve through space, enter the south pole, and continue through the magnet back to the north. They never start or stop.",
      difficulty: "understand"
    },
    {
      id: "b-domains",
      type: "text",
      content: "**Why are some materials magnetic and others aren't?**\n\nInside materials like iron, nickel, and cobalt, atoms act like tiny magnets. In most materials, these atomic magnets point in random directions and cancel out — no net magnetism. But in **ferromagnetic** materials, atoms in small regions called **magnetic domains** naturally align in the same direction.\n\n- In an **unmagnetized** piece of iron, the domains point in random directions → they cancel out\n- In a **magnetized** piece, most domains align in the same direction → strong net magnetic field\n- You can magnetize iron by stroking it with a magnet (aligns the domains) or with an electric current (next lesson!)\n- Heating or dropping a magnet can scramble the domains and **demagnetize** it\n\nThis is why magnets stick to iron and steel but NOT to aluminum, copper, wood, or plastic — those materials don't have alignable magnetic domains."
    },
    {
      id: "q-domains",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A magnet sticks to a steel refrigerator door but not to an aluminum water bottle. Which best explains why?",
      options: [
        "Steel is heavier than aluminum, so it attracts magnets more",
        "Steel contains iron, which has magnetic domains that can align with the magnet's field; aluminum does not",
        "Aluminum has a special coating that blocks magnetic fields",
        "Steel is a conductor and aluminum is an insulator"
      ],
      correctIndex: 1,
      explanation: "Steel contains iron, a ferromagnetic material with magnetic domains. When a magnet is brought near, these domains align with the external field, creating attraction. Aluminum atoms don't form alignable domains, so there's no significant magnetic attraction.",
      difficulty: "understand"
    },
    {
      id: "q-demagnetize",
      type: "question",
      questionType: "short_answer",
      prompt: "Your friend accidentally drops their strong refrigerator magnet on the floor repeatedly, and it seems to get weaker over time. Using what you know about magnetic domains, explain why the magnet is losing its strength.",
      placeholder: "Explain using the concept of magnetic domains...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // EARTH'S MAGNETIC FIELD
    // ═══════════════════════════════════════════
    {
      id: "section-earth",
      type: "section_header",
      icon: "🌍",
      title: "Earth as a Giant Magnet",
      subtitle: "~5 minutes"
    },
    {
      id: "b-earth",
      type: "text",
      content: "Earth itself is a giant magnet. Its magnetic field is generated by the motion of molten iron in the outer core — essentially, moving charge creating a magnetic field (you'll learn more about this connection next lesson).\n\n**Fun fact:** A compass needle is just a tiny bar magnet that aligns with Earth's field. The north-seeking end of the compass points toward Earth's geographic North Pole. But here's the mind-bender: since opposite poles attract, Earth's **magnetic** south pole is actually near the geographic North Pole!\n\nEarth's magnetic field also protects us from the solar wind — a stream of charged particles from the Sun. Without our magnetic field, the solar wind would strip away our atmosphere (this is likely what happened to Mars)."
    },
    {
      id: "q-earth",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A compass needle's north end points toward Earth's geographic North Pole. What does this tell us about the magnetic pole located near the geographic North Pole?",
      options: [
        "It must be a magnetic north pole, since north attracts north",
        "It must be a magnetic south pole, since opposite poles attract",
        "It's not a magnetic pole at all — compasses respond to gravity",
        "It alternates between north and south depending on the season"
      ],
      correctIndex: 1,
      explanation: "Since the north end of a compass needle is attracted toward the geographic North Pole, and opposite poles attract, Earth's magnetic pole near the geographic North Pole must actually be a magnetic SOUTH pole. Confusing but correct!",
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
      content: "Today you learned the fundamentals of magnetism:\n\n- Every magnet has a **north and south pole** — you can't have one without the other\n- **Opposite poles attract, like poles repel** (just like electric charges)\n- **Magnetic field lines** form closed loops from north to south and back through the magnet\n- **Magnetic domains** explain why some materials are magnetic — their atomic magnets can align\n- **Earth is a giant magnet** whose field protects us and guides compasses\n\n**Coming up next:** You'll discover one of the most mind-blowing connections in physics — electric current creates a magnetic field. Electricity and magnetism aren't separate phenomena. They're two sides of the same coin."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** What's actually happening when a magnet sticks to the fridge?\n\nAnswer: The magnet's field reaches into the steel door and aligns the magnetic domains in the steel, creating a temporary attraction. The fridge door becomes a weak temporary magnet with its south pole facing the magnet's north pole (or vice versa). That alignment creates the attractive force you feel as \"sticking.\""
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: In one paragraph, explain one key similarity AND one key difference between electric fields and magnetic fields. Use specific vocabulary from both units.",
      placeholder: "Compare electric and magnetic fields...",
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
        { term: "Magnetic field (B)", definition: "An invisible field surrounding a magnet or moving charge that exerts force on other magnets and moving charges." },
        { term: "Magnetic pole", definition: "The north or south end of a magnet. Poles always come in pairs — no magnetic monopoles exist." },
        { term: "Magnetic field lines", definition: "Lines mapping the direction and strength of a magnetic field. They exit the north pole, enter the south pole, and form closed loops." },
        { term: "Magnetic domain", definition: "A microscopic region in a ferromagnetic material where atomic magnetic moments are all aligned in the same direction." },
        { term: "Ferromagnetic", definition: "Materials (iron, nickel, cobalt) whose magnetic domains can be aligned, making them magnetic. Most other materials are non-magnetic." }
      ]
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, "physics", "magnets-and-fields", lesson);
    console.log('✅ Lesson "Magnets & Magnetic Fields" seeded successfully!');
    console.log("   Path: courses/physics/lessons/magnets-and-fields");
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
