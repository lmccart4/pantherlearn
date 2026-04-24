// seed-electrostatics-w32-conductor-dielectric.js
// Electrostatics — Week 32, Lesson 7 (Friday 4/24, 42 min)
// Observe → Test (6 stations) → Classify → Diagram
// Aligned with Luke's "Discovery: Conductors vs Dielectrics" doc
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
  questionOfTheDay: "Why does a charged balloon stick harder to metal than to wood — when both are neutral?",
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
      content: "**Question of the Day:** Why does a charged balloon stick harder to metal than to wood — when both are neutral?"
    },
    {
      id: "w32cd-text-intro",
      type: "text",
      content: "You've seen different materials interact differently with a charged balloon — Tuesday's rotation stations, yesterday's polarization diagrams. Some responded strongly; some barely moved.\n\nBy the end of today you'll be able to **explain why these objects experience interactions of differing strengths** — at the level of the atoms inside them."
    },
    {
      id: "w32cd-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "The difference between conductors and dielectrics at the atomic level",
        "Which one polarizes more strongly (and why)",
        "How to draw charge diagrams that predict how strongly any neutral material will respond"
      ]
    },

    {
      id: "w32cd-sec-part1",
      type: "section_header",
      icon: "📺",
      title: "Part 1 — Observe: Metal Plate vs. Wooden Board",
      subtitle: "~5 min"
    },
    {
      id: "w32cd-text-part1",
      type: "text",
      content: "Watch the video linked below: a woman rubs a balloon with felt, then brings a **metal plate** and a **wooden board** close to it.\n\nBoth objects are neutral. Pay close attention to whether the metal plate and the wooden board interact with the balloon in the same way — or differently."
    },
    {
      id: "w32cd-link-video-part1",
      type: "external_link",
      icon: "📺",
      title: "Video — Balloon near a metal plate and a wooden board",
      url: "https://mediaplayer.pearsoncmg.com/assets/_frames.true/secs-experiment-video-30",
      description: "Watch how the charged balloon responds to each material. You'll come back to this video again in Part 4.",
      buttonLabel: "Play the video",
      openInNewTab: true
    },
    {
      id: "w32cd-q-part1-obs",
      type: "question",
      questionType: "short_answer",
      prompt: "What did you observe in the video? Does the metal plate interact any differently than the wooden board does? Be specific — which one moved more, swung faster, or pulled the balloon harder?",
      placeholder: "With the metal plate, the balloon ___. With the wooden board, the balloon ___. The ___ responded more strongly because ___.",
      difficulty: "analyze"
    },

    {
      id: "w32cd-sec-part2",
      type: "section_header",
      icon: "🧪",
      title: "Part 2 — Four Observational Experiments",
      subtitle: "~10 min"
    },
    {
      id: "w32cd-text-part2-setup",
      type: "text",
      content: "**Setup:** each pair uses a different charged probe.\n\n- **Pair A (Tubes):** the **gray PVC pipe rubbed with fur**.\n- **Pair B (Flats):** a **balloon rubbed with fur**.\n\nEach time you run an experiment, recharge your probe fresh before bringing it near. Don't touch the station object.\n\nRun all **four** experiments below. For each one, record what you observed — did the objects attract, repel, or do nothing? How strongly? The experiments are paired: same shape, different material — pay close attention to what changes when only the material changes."
    },
    {
      id: "w32cd-callout-exp-pair1",
      type: "callout",
      style: "insight",
      icon: "🧵",
      content: "**Pair A — Tubes (on the holder)**\n\n1. Place an **uncharged white PVC tube** on the holder. Rub the **gray PVC with fur** and bring the gray PVC close to the white PVC on the holder. Observe.\n2. Place an **uncharged tin-foil-coated PVC tube** on the holder. Rub the gray PVC with fur again and bring it close to the tin-foil-coated PVC. Observe."
    },
    {
      id: "w32cd-q-pair1",
      type: "question",
      questionType: "short_answer",
      prompt: "**Experiments 1 & 2 (Tubes):** Record your observations for each. What was the difference between how the **white PVC** and the **tin-foil-coated PVC** responded when the charged gray PVC was brought near?",
      placeholder: "White PVC on holder: ___.\nTin-foil-coated PVC on holder: ___.\nDifference: ___.",
      difficulty: "analyze"
    },
    {
      id: "w32cd-callout-exp-pair3",
      type: "callout",
      style: "insight",
      icon: "🟩",
      content: "**Pair B — Flat Pieces**\n\n3. Rub a **balloon with fur** and bring it close to an **uncharged plastic bag** held up by a partner. Observe.\n4. Rub the balloon with fur again and bring it close to an **uncharged piece of tin foil** (similar size), also held up by a partner. Observe."
    },
    {
      id: "w32cd-q-pair3",
      type: "question",
      questionType: "short_answer",
      prompt: "**Experiments 3 & 4 (Flats):** Record your observations for each. Which flat piece pulled toward the charged balloon more strongly — the plastic bag or the tin foil?",
      placeholder: "Plastic bag: ___.\nTin foil: ___.\nDifference: ___.",
      difficulty: "analyze"
    },
    {
      id: "w32cd-q-pattern",
      type: "question",
      questionType: "short_answer",
      prompt: "**Stand back and look across all four experiments.** What's the pattern? Which category of material — the metal ones or the non-metal ones — consistently interacted more strongly with whatever charged probe you used?",
      placeholder: "Across both pairs, the ___ materials responded more strongly. The pattern I see is ___.",
      difficulty: "analyze"
    },

    {
      id: "w32cd-sec-part3",
      type: "section_header",
      icon: "📖",
      title: "Part 3 — The Names for What You Just Saw",
      subtitle: "~8 min"
    },
    {
      id: "w32cd-text-part3-intro",
      type: "text",
      content: "You've now seen two clean comparisons where the metal object reacted more dramatically than the non-metal object. The scientific community long ago gave these two categories of materials their own names — and the difference comes down to **what's going on inside each material at the atomic level**."
    },
    {
      id: "w32cd-callout-defs",
      type: "callout",
      style: "insight",
      icon: "📖",
      content: "**Conductor** — a material whose electrons are *not bound* to atoms. Those **free electrons** can drift across the whole material. When a negatively charged object is brought close, the free electrons are repelled and pile up on the far side — producing strong polarization.\n\n**Dielectric** (also called an *insulator*) — a material where electrons are *confined to their atoms*. The electrons can shift slightly away from a negative object or toward a positive one, but they can't leave the atom they belong to. This tiny internal shift is called **polarization**, and the polarized atoms are called **electric dipoles**."
    },
    {
      id: "w32cd-img-cd-compare",
      type: "image",
      url: `${IMG}/w32-conductor-vs-dielectric.png`,
      caption: "A negatively charged rectangle brought close to two neutral rods. Top rod: a dielectric — atoms polarize slightly in place. Bottom rod: a conductor — free electrons migrate to the far side.",
      alt: "Two horizontal rods each near a negatively charged rectangle. Top rod labeled Dielectric shows atoms drawn as dumbbells with slight internal shifts. Bottom rod labeled Conductor shows free electrons concentrated on the far side, leaving positive ions on the near side"
    },
    {
      id: "w32cd-q-classify-foil",
      type: "question",
      questionType: "short_answer",
      prompt: "Based on the definitions above and your observations: **is tin foil a conductor or a dielectric?** Explain your answer using what you saw in the experiments.",
      placeholder: "Tin foil is a ___. I know because in the experiments, the tin-foil objects ___, which fits the definition of a ___ because ___.",
      difficulty: "analyze"
    },
    {
      id: "w32cd-q-classify-pvc",
      type: "question",
      questionType: "short_answer",
      prompt: "**Is the plastic PVC tube a conductor or a dielectric?** Explain your answer using what you saw in the experiments.",
      placeholder: "The PVC tube is a ___. I know because in the experiments, the bare PVC ___, which fits the definition of a ___ because ___.",
      difficulty: "analyze"
    },

    {
      id: "w32cd-sec-part4",
      type: "section_header",
      icon: "✏️",
      title: "Part 4 — Draw the Charge Diagrams",
      subtitle: "~10 min"
    },
    {
      id: "w32cd-link-video-part4",
      type: "external_link",
      icon: "📺",
      title: "Rewatch the video",
      url: "https://mediaplayer.pearsoncmg.com/assets/_frames.true/secs-experiment-video-30",
      description: "Pay close attention to the relative strength of attraction — the metal plate vs. the wooden board — so your diagrams match what you see.",
      buttonLabel: "Play the video",
      openInNewTab: true
    },
    {
      id: "w32cd-text-part4",
      type: "text",
      content: "Rewatch the video. A negatively charged balloon is somewhat attracted to a wooden board, and **more strongly** attracted to a metal plate. Now you're going to show why — with atomic-level charge diagrams.\n\nOn your whiteboard, draw **two diagrams side by side**:\n\n1. **Negatively charged balloon next to a metal plate (conductor).** Show where the free electrons end up inside the plate and where the positive ions are left behind. Show the charges on the balloon.\n2. **Negatively charged balloon next to a wooden board (dielectric).** Show how the atoms inside the wood polarize — with each atom's electron shifted slightly away from the balloon and its protons slightly toward the balloon. Show the charges on the balloon.\n\nLabel everything. Your two diagrams should make it obvious why the metal plate pulls the balloon harder."
    },
    {
      id: "w32cd-q-diagram-explain",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your two diagrams in words. Where did the negative charges end up in the metal plate? What happened to the atoms inside the wooden board? Why does your diagram show a **stronger** attraction for the metal plate than for the wood?",
      placeholder: "Metal plate: the free electrons ___, leaving ___. Wooden board: each atom ___. Stronger attraction for the metal because ___.",
      difficulty: "create"
    },
    {
      id: "w32cd-evidence-diagrams",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — Conductor & Dielectric Charge Diagrams",
      instructions: "Photo of both diagrams side by side: (1) balloon + metal plate (conductor), (2) balloon + wooden board (dielectric). Free electrons, protons, and polarized atoms should all be clearly labeled.",
      reflectionPrompt: "One sentence: which diagram has charge more *concentrated* near the balloon, and why does that matter for how strongly the balloon is attracted?"
    },

    {
      id: "w32cd-callout-bridge",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "**Next week:** we solve the Van de Graaff mystery for real. You'll use every piece of this week — atomic model, charge diagrams, polarization, conductors vs. dielectrics — to explain every part of that machine. Then we test your understanding on the unit assessment."
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
