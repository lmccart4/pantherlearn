// seed-electrostatics-w32-conductor-dielectric.js
// Electrostatics — Week 32, Lesson 7 (Friday 4/24, 42 min)
// Predict → test → formalize: conductor vs dielectric via rotating-stand experiment
// Models W32 Tasks 12-13
// Run: node scripts/seed-electrostatics-w32-conductor-dielectric.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "/images/physics/electrostatics";

const lesson = {
  title: "Conductors vs. Dielectrics — The Great Divide",
  questionOfTheDay: "Why does a charged balloon stick harder to a metal spoon than to a wooden ruler?",
  course: "Physics",
  unit: "Electrostatics",
  order: 7,
  visible: false,
  dueDate: "2026-04-24",
  blocks: [
    {
      id: "w32cd-sec-welcome",
      type: "section_header",
      icon: "🪵",
      title: "Today: The Great Material Divide",
      subtitle: "~2 min"
    },
    {
      id: "w32cd-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why does a charged balloon stick harder to a metal spoon than to a wooden ruler?"
    },
    {
      id: "w32cd-text-intro",
      type: "text",
      content: "You noticed it on Tuesday — the metal-coated PVC, the tin-foil cup, the metal whiteboard all responded more dramatically than their wood and plastic counterparts. Yesterday you learned **polarization**. Today we tie those two facts together.\n\nThe scientific community long ago divided all neutral materials into two categories. Today you learn their names, what's different inside them, and you run the experiment that *proves* the division."
    },
    {
      id: "w32cd-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "The difference between conductors and dielectrics at the atomic level",
        "Which one polarizes more (and why)",
        "How to use charge diagrams to predict how strongly a material will respond"
      ]
    },

    {
      id: "w32cd-sec-task1",
      type: "section_header",
      icon: "🧠",
      title: "Task 1 — Two Kinds of Neutral Material",
      subtitle: "~4 min"
    },
    {
      id: "w32cd-img-cd-compare",
      type: "image",
      url: `${IMG}/w32-conductor-vs-dielectric.png`,
      caption: "Two neutral systems. Both have zero net charge. But what's inside is very different.",
      alt: "Two charge diagrams side by side. Left labeled Dielectric PVC shows only gray atoms scattered throughout. Right labeled Conductor Metal shows a mix of red positive ions, gray atoms, and small scattered blue free electrons drifting between them"
    },
    {
      id: "w32cd-callout-defs",
      type: "callout",
      style: "insight",
      icon: "📖",
      content: "**Dielectric** (e.g., PVC, wood, rubber): made of **only atoms**. Electrons are locked to their atoms. Also called *insulators*.\n\n**Conductor** (e.g., metal): made of **+ions, atoms, and free electrons**. Those free electrons can drift around the whole object — they aren't stuck to one atom."
    },

    {
      id: "w32cd-sec-task2",
      type: "section_header",
      icon: "🔮",
      title: "Task 2 — Predict Which Polarizes More",
      subtitle: "~7 min"
    },
    {
      id: "w32cd-text-predict",
      type: "text",
      content: "Say we bring a positively charged rod near a neutral dielectric and a neutral conductor. **In which one can the negative charges move more easily?** Why should that matter for how strongly each material gets attracted to the rod?"
    },
    {
      id: "w32cd-q-predict",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Based on what's inside each material, which one should polarize **more dramatically** when a charged rod is brought nearby?",
      options: [
        "The dielectric, because its atoms are locked in place.",
        "The conductor, because free electrons can drift across the whole object toward the charged rod.",
        "They should polarize the same, since both are neutral.",
        "The dielectric, because metal reflects charge."
      ],
      correctIndex: 1,
      explanation: "In the conductor, the free electrons can travel across the entire object and pile up on the side nearest the charged rod. In a dielectric, the best each atom can do is a tiny internal shift — so the effect is much smaller.",
      difficulty: "analyze"
    },
    {
      id: "w32cd-q-defend",
      type: "question",
      questionType: "short_answer",
      prompt: "Defend your prediction in two sentences. Use the words *free electrons*, *polarization*, and *attraction*.",
      placeholder: "The ___ should polarize more because...",
      difficulty: "analyze"
    },

    {
      id: "w32cd-sec-task3",
      type: "section_header",
      icon: "🧪",
      title: "Task 3 — The Rotating-Stand Experiment",
      subtitle: "~15 min"
    },
    {
      id: "w32cd-img-rotating",
      type: "image",
      url: `${IMG}/w32-rotating-stand-pvc.png`,
      caption: "Rotating stand with a PVC tube balanced on top. A charged gray PVC brought nearby will make the tube rotate if it's attracted.",
      alt: "A pointed stand supporting a horizontal PVC tube that can spin freely. A second PVC tube is held by fur nearby. The free tube begins to rotate toward the held one"
    },
    {
      id: "w32cd-text-experiment",
      type: "text",
      content: "**Procedure:**\n\n1. Balance the **white PVC pipe** (dielectric) on the rotating stand.\n2. Rub the gray PVC pipe with fur to charge it. Bring it close — *but don't touch*.\n3. Watch carefully. How fast does the white PVC rotate? How far does it swing?\n4. Now swap in the **metal-coated PVC** (conductor) and repeat step 2.\n5. Compare the two responses.\n\n**Safety tip:** keep your hands off the balanced pipe during the test. Body heat and moisture throw off the result."
    },
    {
      id: "w32cd-q-obs",
      type: "question",
      questionType: "short_answer",
      prompt: "Record your observations. Which pipe responded more strongly? Be specific — faster rotation? Larger swing? Smaller gap needed before you saw motion?",
      placeholder: "White PVC (dielectric): The tube rotated ___ and swung about ___.\nMetal-coated PVC (conductor): The tube rotated ___ and swung about ___.\nThe ___ responded more strongly.",
      difficulty: "recall"
    },
    {
      id: "w32cd-evidence-exp",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — Observations + Prediction Check",
      instructions: "Photo of your observation chart *and* a sentence stating whether the experiment **supported** or **disproved** your Task 2 prediction.",
      reflectionPrompt: "Did anything surprise you — maybe one material was much more dramatic than you expected?"
    },

    {
      id: "w32cd-sec-task4",
      type: "section_header",
      icon: "🧩",
      title: "Task 4 — Formalize the Rule",
      subtitle: "~7 min"
    },
    {
      id: "w32cd-q-rule",
      type: "question",
      questionType: "short_answer",
      prompt: "In your own words, write the rule that connects **material type** to **polarization strength** to **attraction strength**. Use *conductor*, *dielectric*, *free electrons*, and *polarization*.",
      placeholder: "Conductors have ___, which means they can ___ more than dielectrics. More polarization means...",
      difficulty: "create"
    },
    {
      id: "w32cd-q-predict-new",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You bring a charged balloon near a neutral aluminum can and a neutral cardboard box at the same distance. Which object does the balloon attract to more strongly?",
      options: [
        "The cardboard box, because it's lighter.",
        "They attract equally — both are neutral.",
        "Neither, because neutral objects don't interact with charge.",
        "The aluminum can, because aluminum is a conductor and polarizes more."
      ],
      correctIndex: 3,
      explanation: "Aluminum is a conductor with free electrons that can pile up on the near side, producing strong polarization. Cardboard is a dielectric — its atoms can only polarize a tiny bit. The charged balloon feels a larger attractive pull from the can.",
      difficulty: "analyze"
    },

    {
      id: "w32cd-sec-exit",
      type: "section_header",
      icon: "🚪",
      title: "Exit Check",
      subtitle: "~5 min"
    },
    {
      id: "w32cd-q-exit1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of these is the best definition of a **conductor**?",
      options: [
        "A material that generates heat when electricity passes through it.",
        "A material with more protons than electrons.",
        "A material with free electrons that can drift across the whole object.",
        "A material that blocks electric charge."
      ],
      correctIndex: 2,
      explanation: "A conductor is defined by having free (mobile) electrons. That mobility is what allows it to polarize strongly and to carry current later on when we study circuits.",
      difficulty: "recall"
    },
    {
      id: "w32cd-q-exit2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A charged balloon is brought near a neutral dielectric. What happens?",
      options: [
        "Nothing — the dielectric is neutral.",
        "The dielectric polarizes slightly: electrons inside each atom shift, causing a weak attraction.",
        "Free electrons flow across the dielectric toward the balloon.",
        "The dielectric becomes negatively charged permanently."
      ],
      correctIndex: 1,
      explanation: "Dielectrics have no free electrons, so the only available motion is a tiny shift *within* each atom. That's enough for a small polarization and a weak attraction — but much weaker than what you'd see with a conductor.",
      difficulty: "analyze"
    },
    {
      id: "w32cd-callout-bridge",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "**Next week:** we solve the Van de Graaff mystery for real. You'll use everything from this week — atomic model, charge diagrams, conductors, dielectrics, polarization — to explain every piece of that machine. Then we test your understanding on the unit assessment."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w32-conductor-dielectric", lesson);
    console.log("✅ Lesson 7 seeded: Conductor vs. Dielectric");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
