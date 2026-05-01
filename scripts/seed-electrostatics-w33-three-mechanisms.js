// seed-electrostatics-w33-three-mechanisms.js
// Electrostatics — Week 33, Thu 5/1 (42 min, P1)
// Charging by friction (atomic-scale) → unifying friction + conduction + induction
// Run: node scripts/seed-electrostatics-w33-three-mechanisms.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Three Ways to Charge an Object — Friction, Conduction, Induction",
  questionOfTheDay: "Every electrostatic phenomenon you've seen this unit is one of three things. Which three?",
  course: "Physics",
  unit: "Electrostatics",
  order: 9,
  visible: false,
  dueDate: "2026-04-30",
  blocks: [
    {
      id: "w33tm-sec-welcome",
      type: "section_header",
      icon: "🧩",
      title: "Today: One Pattern Behind Everything",
      subtitle: "~2 min"
    },
    {
      id: "w33tm-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Every electrostatic phenomenon you've seen this unit is one of *three* things. Which three?"
    },
    {
      id: "w33tm-text-intro",
      type: "text",
      content: "On Monday you charged an object two ways: by **conduction** (touching it with something charged) and by **induction** (using a nearby charged object plus a brief grounding step).\n\nThere's a third way you've actually been using since Day 1 of this unit — every time you rubbed a balloon on fur, every time you rubbed a PVC pipe to charge it. That's **charging by friction**, and today you'll explain *why* rubbing two materials together transfers electrons in the first place — at the atomic level.\n\nBy the end of class, you'll have one diagram that organizes every charging phenomenon in this unit."
    },
    {
      id: "w33tm-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "Why rubbing two specific materials together moves electrons one direction and not the other",
        "What the triboelectric series is and how to read it",
        "How to identify whether a given phenomenon is friction, conduction, or induction",
        "How to draw a charge diagram for any of the three mechanisms"
      ]
    },

    {
      id: "w33tm-sec-friction",
      type: "section_header",
      icon: "✋",
      title: "Part 1 — Why Rubbing Charges Things",
      subtitle: "~12 min"
    },
    {
      id: "w33tm-text-friction-question",
      type: "text",
      content: "Here's the question we've been ignoring all unit: when you rub a balloon with fur, electrons move from the fur to the balloon. **Why that direction and not the other way around?**\n\nWhy don't electrons go from the balloon onto the fur instead? What is it about these two materials that decides who gives up electrons and who takes them?"
    },
    {
      id: "w33tm-q-friction-predict",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Best prediction: what determines which material *gives up* electrons and which one *takes* them when you rub two things together?",
      options: [
        "Whichever material is bigger gives up electrons.",
        "It's random — sometimes one direction, sometimes the other.",
        "How tightly each material holds onto its electrons. The material that holds them more loosely gives them up to the material that holds them more tightly.",
        "Whichever material is rubbed harder."
      ],
      correctIndex: 2,
      explanation: "Different materials hold their outermost electrons with different strengths — a property called **electron affinity**. When two materials make close contact (which is what rubbing maximizes), electrons hop from the one that holds them loosely to the one that holds them tightly. The pull is always there; rubbing just creates more contact area for it to act over.",
      difficulty: "analyze"
    },
    {
      id: "w33tm-callout-tribo",
      type: "callout",
      style: "insight",
      icon: "📊",
      content: "**The Triboelectric Series** — a ranking of materials by how tightly they hold electrons.\n\n**Top (loses electrons easily, becomes +):**\n- Human skin\n- Rabbit fur\n- Glass\n- Human hair\n- Wool\n- Silk\n- Aluminum\n- Paper\n- Cotton\n- Wood\n- Amber\n- Hard rubber\n- Polyester\n- PVC plastic\n- Teflon\n\n**Bottom (holds electrons tightly, becomes −):**\n\nThe **further apart** two materials are on this list, the more strongly they exchange electrons when rubbed."
    },
    {
      id: "w33tm-q-tribo-balloon",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Use the triboelectric series. When you rub a **rubber balloon with rabbit fur**, which way do electrons move and what does each end up as?",
      options: [
        "Electrons move from the fur to the balloon. The fur becomes positively charged; the balloon becomes negatively charged.",
        "Electrons move from the balloon to the fur. The balloon becomes positively charged; the fur becomes negatively charged.",
        "Electrons move both directions equally. Both stay neutral.",
        "Protons move from the balloon to the fur."
      ],
      correctIndex: 0,
      explanation: "Rabbit fur is high on the list (loses electrons easily); rubber is low (holds electrons tightly). Electrons hop from fur → balloon. Fur loses electrons → +ions. Balloon gains electrons → −ions. This matches what you observed in the rubbing-balloons lab two weeks ago.",
      difficulty: "apply"
    },
    {
      id: "w33tm-q-tribo-pvc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Now use the series for **PVC pipe rubbed with fur**. What ends up where?",
      options: [
        "PVC becomes positive; fur becomes negative.",
        "Both end up positive.",
        "Both end up negative.",
        "PVC becomes negative; fur becomes positive."
      ],
      correctIndex: 3,
      explanation: "Same logic — fur is much higher in the series than PVC, so electrons go from fur to PVC. PVC ends up negatively charged. (This is exactly why all your gray-PVC-with-fur experiments produced a negatively charged probe.)",
      difficulty: "apply"
    },
    {
      id: "w33tm-text-friction-diagram",
      type: "text",
      content: "**Whiteboard task — draw the charge diagram for charging by friction.**\n\nPick **one** of the rubbing experiments you've done this unit (balloon + fur, PVC + fur, or balloon + plastic bag). Draw a **two-state** charge diagram:\n\n1. **Before rubbing** — both objects neutral. Just atoms.\n2. **After rubbing** — show which atoms became +ions, which became −ions, and why your choice matches the triboelectric series."
    },

    {
      id: "w33tm-sec-compare",
      type: "section_header",
      icon: "🗂️",
      title: "Part 2 — The Big Picture: All Three Mechanisms",
      subtitle: "~12 min"
    },
    {
      id: "w33tm-text-compare-intro",
      type: "text",
      content: "You now have all three. Take a step back and look at what's the same and what's different.\n\n| Mechanism | Contact? | Result on the target object |\n|---|---|---|\n| **Friction** | Yes — sustained contact + rubbing | Same sign as the *other* material would be opposite |\n| **Conduction** | Yes — direct contact | Same sign as the charged object |\n| **Induction** | **No** — never touched by the charged object | **Opposite** sign from the charged object |\n\nThe physics underneath all three is the same: electrons move from where they're held loosely to where they're held tightly, or from where they're crowded to where there's room. The mechanisms differ only in *how* you set up the conditions."
    },
    {
      id: "w33tm-q-compare-conduction-vs-induction",
      type: "question",
      questionType: "short_answer",
      prompt: "**The single biggest difference** between charging by conduction and charging by induction: what is it, in your own words? Which step makes induction produce the *opposite* sign on the target instead of the same sign?",
      placeholder: "In conduction, the charged object ___, so electrons ___. In induction, the charged object ___ instead, and the critical extra step is ___, which is what causes the target to end up ___ sign.",
      difficulty: "analyze"
    },

    {
      id: "w33tm-sec-classify",
      type: "section_header",
      icon: "🔍",
      title: "Part 3 — Classify Each Phenomenon",
      subtitle: "~12 min"
    },
    {
      id: "w33tm-text-classify-intro",
      type: "text",
      content: "Here are six phenomena. For each one, decide whether it's an example of **friction**, **conduction**, or **induction** — and be ready to defend it."
    },
    {
      id: "w33tm-q-classify-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Phenomenon 1.** You walk across a wool carpet on a dry winter day, then touch a metal doorknob and feel a shock. The shock itself (electrons jumping from your finger to the knob) is an example of:",
      options: [
        "Charging by friction.",
        "Charging by conduction.",
        "Charging by induction.",
        "None of the three — this is something else."
      ],
      correctIndex: 1,
      explanation: "The **walking** part charged you by friction (your shoes on the carpet). But the **shock** itself — when your charged finger contacts the neutral knob — is direct contact between a charged and a neutral conductor. That's charging by **conduction**.",
      difficulty: "apply"
    },
    {
      id: "w33tm-q-classify-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Phenomenon 2.** Your charged balloon (rubbed with fur) hangs from a string. You bring a neutral metal sphere close to the balloon — without touching it. The sphere feels a pull toward the balloon. Why?",
      options: [
        "The balloon charged the sphere by friction.",
        "The balloon polarized the sphere — free electrons in the sphere shifted, leaving the near side oppositely charged. This is induction-style polarization, but no permanent charging happened (no grounding step).",
        "The balloon charged the sphere by conduction.",
        "The sphere magnetized the balloon."
      ],
      correctIndex: 1,
      explanation: "The sphere is polarized by the balloon's electric field — free electrons rearrange to make the near side opposite-charged, producing attraction. This is *the same setup* as Step 2 of charging by induction, but without a grounding step the sphere stays overall neutral. It's polarization without permanent charge transfer.",
      difficulty: "apply"
    },
    {
      id: "w33tm-q-classify-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Phenomenon 3.** You take off a polyester sweater on a dry day and your hair stands up briefly. Which mechanism made your hair charged?",
      options: [
        "Friction — rubbing of the sweater fibers against your hair transferred electrons.",
        "Conduction — the sweater touched your hair so charge spread.",
        "Induction — the sweater is far away from your hair when it stands up.",
        "Gravity reversed."
      ],
      correctIndex: 0,
      explanation: "Two materials in sustained contact + relative motion = friction. Polyester is far from human hair on the triboelectric series, so each strand of hair ends up with the same sign of charge — and same-sign charges repel, which makes your hair stand away from the other strands.",
      difficulty: "apply"
    },
    {
      id: "w33tm-q-classify-4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Phenomenon 4.** You charge an electroscope using the four-step procedure from Monday: (1) charge a pipe, (2) hold it near the ball, (3) tap the ball with your finger, (4) remove finger then pipe. The electroscope is now charged opposite to the pipe.",
      options: [
        "Friction.",
        "Conduction.",
        "Induction.",
        "Magnetism."
      ],
      correctIndex: 2,
      explanation: "The pipe never touches the electroscope. The grounding step (your finger) lets electrons leave the conductor while the pipe is holding them in position. When everything is removed, the electroscope keeps the *opposite* sign. Textbook induction.",
      difficulty: "apply"
    },
    {
      id: "w33tm-q-classify-5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Phenomenon 5.** You touch a positively charged metal sphere to a neutral metal sphere. After they're separated, both have a positive charge.",
      options: [
        "Conduction — direct contact between two conductors lets the extra charge spread out across both, then split when they separate.",
        "Induction — the second sphere never got close enough to touch.",
        "Friction — the spheres rubbed slightly when they touched.",
        "Both stayed neutral; this couldn't happen."
      ],
      correctIndex: 0,
      explanation: "Direct contact between two conductors. While in contact they act as one big conductor and the extra positive charge distributes across both. When pulled apart, each takes its share. Conduction — same as the two-spheres synthesis problem from Monday.",
      difficulty: "apply"
    },
    {
      id: "w33tm-q-classify-6",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Phenomenon 6.** A storm cloud builds up a strong negative charge on its underside. The ground beneath it (a conductor for these purposes) develops a strong **positive** charge — even though the cloud never touches the ground. Eventually, lightning bridges the gap.",
      options: [
        "Friction — wind rubbed the ground.",
        "Conduction — the cloud touched the ground.",
        "Magnetism — clouds attract iron in the soil.",
        "Induction — the cloud's negative charge repelled free electrons in the ground downward, leaving the surface positive. The cloud and the ground were never in contact until the lightning strike itself."
      ],
      correctIndex: 3,
      explanation: "The same physics as your finger-on-the-electroscope, scaled up massively. The cloud's huge negative charge induces an opposite charge on the ground beneath it. The lightning bolt is then the *conduction* event that finally connects them and lets the charges equalize.",
      difficulty: "apply"
    },

    {
      id: "w33tm-sec-evidence",
      type: "section_header",
      icon: "📷",
      title: "Submit Your Work",
      subtitle: "~3 min"
    },
    {
      id: "w33tm-evidence-summary",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — Friction Diagram + Summary Table",
      instructions: "Photo of your whiteboard showing: (1) the two-state friction charge diagram from Part 1, and (2) a summary table or summary diagram of all three mechanisms (friction / conduction / induction) — showing for each one whether contact is required and what sign the target object ends up with.",
      reflectionPrompt: "One sentence: of the three mechanisms, which one would you bet most non-physicists confuse with each other, and why?"
    },

    {
      id: "w33tm-callout-bridge",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "**Tomorrow:** mastery check. You'll see a mixed batch of phenomena — like the six above but harder — and you'll have to draw the charge diagram and name the mechanism for each one with no scaffolding. Bring everything you've learned this unit. Then we move on to magnetism next week."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w33-three-mechanisms", lesson);
    console.log("✅ Lesson seeded: Three Mechanisms (Thu 4/30)");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
