// seed-electrostatics-w33-mastery-check.js
// Electrostatics — Week 33, Fri 5/1 (42 min, P1)
// Mastery check / formative assessment closing the unit before magnetism
// Run: node scripts/seed-electrostatics-w33-mastery-check.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Electrostatics Mastery Check",
  questionOfTheDay: "Can you take a real-world electrostatic phenomenon you've never seen before and explain it from scratch with a charge diagram?",
  course: "Physics",
  unit: "Electrostatics",
  order: 10,
  visible: false,
  dueDate: "2026-05-01",
  gradesReleased: true,
  blocks: [
    {
      id: "w33mc-sec-welcome",
      type: "section_header",
      icon: "🎯",
      title: "Today: Show What You Know",
      subtitle: "~2 min"
    },
    {
      id: "w33mc-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Can you take a real-world electrostatic phenomenon you've never seen before and explain it from scratch — with a charge diagram?"
    },
    {
      id: "w33mc-text-intro",
      type: "text",
      content: "This is the close-out of the electrostatics unit. No new content today — instead, you'll work through a mixed batch of problems that pull from everything we've done since week 30:\n\n- The atomic model and where charge actually lives\n- Charge diagrams (atoms, +ions, −ions)\n- Polarization\n- Conductors vs. dielectrics\n- The three charging mechanisms (friction, conduction, induction)\n\nWork through it on your own first. We'll regroup at the end to compare diagrams. Next week we move on to magnetism."
    },
    {
      id: "w33mc-objectives",
      type: "objectives",
      title: "What You're Showing Today",
      items: [
        "Reading and drawing accurate multi-state charge diagrams",
        "Predicting whether two systems will attract, repel, or do nothing — and defending it",
        "Naming the charging mechanism behind a phenomenon you've never seen before",
        "Distinguishing conductor behavior from dielectric behavior"
      ]
    },

    {
      id: "w33mc-sec-block1",
      type: "section_header",
      icon: "📐",
      title: "Block 1 — Predict the Interaction",
      subtitle: "~10 min"
    },
    {
      id: "w33mc-q-b1-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A balloon with an excess of −ions is brought close to (but not touching) a neutral wooden block. What happens?",
      options: [
        "The balloon and block weakly attract because the wood polarizes (atoms shift slightly), making the near side of the wood weakly positive.",
        "Nothing — both must be charged for any interaction.",
        "The balloon and block repel because both have free electrons.",
        "The block becomes negatively charged by induction without any further step."
      ],
      correctIndex: 0,
      explanation: "Wood is a dielectric. Its atoms polarize slightly: each atom's electron shifts away from the negative balloon, leaving the near side weakly positive. Weak attraction. No charge transfer because dielectrics don't have free electrons.",
      difficulty: "apply"
    },
    {
      id: "w33mc-q-b1-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A neutral piece of tin foil dangles from a string. A negatively charged PVC pipe is brought close *but does not touch*. The foil swings toward the pipe. Why does the foil's attraction to the pipe feel **stronger** than the wood block's did?",
      options: [
        "Tin foil is heavier than wood.",
        "Tin foil is magnetic.",
        "The string carries some of the charge.",
        "Tin foil is a conductor — its electrons move freely all the way across the foil, leaving the near side strongly +. The wood is a dielectric, where electrons only shift within each atom, producing weaker polarization."
      ],
      correctIndex: 3,
      explanation: "Conductors polarize more strongly than dielectrics because their free electrons can travel the full width of the object. More charge separation → stronger attraction. This was the punchline of last Friday's lesson.",
      difficulty: "analyze"
    },
    {
      id: "w33mc-q-b1-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two balloons are *both* rubbed with fur, then hung side by side from strings. What do they do?",
      options: [
        "Hang straight down — both are neutral.",
        "Attract each other.",
        "Repel each other — both gained electrons from the fur, so both are negative, and like charges repel.",
        "One attracts and one repels, randomly."
      ],
      correctIndex: 2,
      explanation: "Both balloons gained electrons from the fur (fur is high on the triboelectric series, rubber is low). Both are negative. Same sign → repel.",
      difficulty: "apply"
    },

    {
      id: "w33mc-sec-block2",
      type: "section_header",
      icon: "🔬",
      title: "Block 2 — Diagram a Phenomenon",
      subtitle: "~12 min"
    },
    {
      id: "w33mc-text-b2-setup",
      type: "text",
      content: "**The phenomenon:** A teacher rubs a balloon with rabbit fur. She holds the balloon *near* (not touching) a small piece of crumpled aluminum foil sitting on her desk. The foil **jumps up** off the desk and sticks to the balloon. After a second or two, it falls off and gets repelled away — and won't go near the balloon again.\n\nThis happens in two distinct stages. Your job is to explain both."
    },
    {
      id: "w33mc-q-b2-stage1",
      type: "question",
      questionType: "short_answer",
      prompt: "**Stage 1 — Why does the neutral foil jump up to the balloon?** Use polarization and the fact that aluminum is a conductor in your explanation.",
      placeholder: "The balloon is ___ charged from rubbing on fur. When it's brought near the foil, the foil's free electrons ___, leaving the near side of the foil with a net ___ charge. This near-side ___ charge is attracted to the balloon's ___ charge, and because the near side is closer than the far side, the net force on the foil is ___.",
      difficulty: "create"
    },
    {
      id: "w33mc-q-b2-stage2",
      type: "question",
      questionType: "short_answer",
      prompt: "**Stage 2 — Why does the foil fall off and then get repelled?** What changed between when it jumped up and when it got repelled?",
      placeholder: "Once the foil touched the balloon, ___ moved from ___ to ___ by charging by ___. Now the foil and balloon both have ___ charge, so they ___.",
      difficulty: "create"
    },
    {
      id: "w33mc-evidence-b2-diagram",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — Aluminum Foil & Balloon (Two-Stage Charge Diagram)",
      instructions: "Photo of your two-state charge diagram for the foil-and-balloon phenomenon. State 1: balloon brought near neutral foil — show the polarization. State 2: after contact — show where the electrons ended up. Label everything (atoms, +ions, −ions, free electrons, direction of any motion).",
      reflectionPrompt: "One sentence: which charging mechanism caused the foil to *eventually* repel from the balloon — friction, conduction, or induction?"
    },

    {
      id: "w33mc-sec-block3",
      type: "section_header",
      icon: "🧠",
      title: "Block 3 — Identify the Mechanism",
      subtitle: "~10 min"
    },
    {
      id: "w33mc-q-b3-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A van de Graaff generator is running. A student stands on a plastic stool (an insulator), touches the generator's metal dome, and her hair stands up. **Which mechanism charged the student?**",
      options: [
        "Induction — the dome never touched her.",
        "Conduction — direct contact between the metal dome (charged) and her hand transferred charge into her body. Her hair strands now share that charge and repel each other.",
        "Friction — the stool rubbed her feet.",
        "Magnetism."
      ],
      correctIndex: 1,
      explanation: "Hand on dome = direct contact = conduction. Charge spreads onto her body. Each strand of hair now has the same sign of charge, and like charges repel — so each strand pushes away from every other strand. The plastic stool only matters because it stops the charge from leaking to ground; it isn't the charging mechanism.",
      difficulty: "apply"
    },
    {
      id: "w33mc-q-b3-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You pull a strip of plastic packing tape off a roll fast. The tape now sticks to your hand, to the wall, to anything nearby. **Which mechanism charged the tape?**",
      options: [
        "Induction.",
        "Friction — pulling the tape's sticky side away from the roll's surface separates two materials that were in tight contact, transferring electrons between them and leaving each end with a net charge.",
        "Conduction.",
        "Gravity."
      ],
      correctIndex: 1,
      explanation: "The sticky-to-backing contact is essentially a friction-style separation: two materials in tight contact, electrons get redistributed, then they're physically pulled apart. The tape ends up charged. (This is so reliable that physicists actually use 'sticky tape' as a charging tool in undergrad labs.)",
      difficulty: "apply"
    },
    {
      id: "w33mc-q-b3-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A truck driving down the highway slowly accumulates a static charge from air friction. At a gas station the driver, before pulling out the pump nozzle, **touches a grounded metal post** to discharge first. **Which mechanism is this?**",
      options: [
        "Charging by induction.",
        "Charging by friction.",
        "Polarization without charging.",
        "Discharging by conduction — direct contact with a grounded conductor lets the truck's extra charge flow through the driver into the ground."
      ],
      correctIndex: 3,
      explanation: "The truck and the grounded post are both conductors connected by the driver's hand. Direct contact = conduction. The extra charge flows away to ground — exactly the same physics as Step 3 of the induction procedure (grounding via your finger), used here to *discharge* rather than to charge.",
      difficulty: "apply"
    },

    {
      id: "w33mc-sec-block4",
      type: "section_header",
      icon: "✏️",
      title: "Block 4 — Open Response",
      subtitle: "~6 min"
    },
    {
      id: "w33mc-q-b4-explain",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick **one** electrostatic phenomenon from your everyday life that we haven't explicitly studied (e.g. dryer-sheet sock-clinging, plastic wrap sticking to itself, dust collecting on a TV screen, hair standing up after a hat). Name it, classify the charging mechanism, and write a 3–5 sentence explanation using charge-diagram vocabulary (atoms, ions, free electrons, polarization, etc.).",
      placeholder: "The phenomenon I'm explaining is ___. The charging mechanism is ___ because ___. At the atomic level, what's happening is ___.",
      difficulty: "create"
    },

    {
      id: "w33mc-sec-evidence",
      type: "section_header",
      icon: "📷",
      title: "Wrap-Up",
      subtitle: "~2 min"
    },
    {
      id: "w33mc-callout-bridge",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "**Next week:** we leave electrostatics behind and start magnetism. The pattern you've seen in this unit — invisible forces explained by what's happening to invisible particles inside matter — is going to repeat. Same playbook, different particles in motion."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w33-mastery-check", lesson);
    console.log("✅ Lesson seeded: Electrostatics Mastery Check (Fri 5/1)");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
