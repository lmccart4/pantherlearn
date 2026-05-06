// seed-electrostatics-w34-synthesis-lab.js
// Electrostatics — Week 34, Tue 5/5 (84 min DOUBLE LAB, P1)
// "The Charge Detective" synthesis lab + Mastery Check intro.
// 2 stations × ~20 min, then mastery check.
// Run: node scripts/seed-electrostatics-w34-synthesis-lab.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/synthesis-lab/student";

const stationBlocks = (n, accentEmoji, title, tagline, materials, procedureSteps, imageFilename, imageAlt, captionText) => {
  const idPrefix = `w34cd-s${n}`;
  return [
    {
      id: `${idPrefix}-sec`,
      type: "section_header",
      icon: accentEmoji,
      title: `Station ${n} — ${title}`,
      subtitle: tagline
    },
    {
      id: `${idPrefix}-materials`,
      type: "callout",
      style: "insight",
      icon: "🧰",
      content: `**Materials:** ${materials}`
    },
    {
      id: `${idPrefix}-img`,
      type: "image",
      url: `${IMG}/${imageFilename}`,
      caption: captionText,
      alt: imageAlt
    },
    {
      id: `${idPrefix}-text-procedure`,
      type: "text",
      content: `**Procedure:**\n\n${procedureSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
    },
    {
      id: `${idPrefix}-q-prediction`,
      type: "question",
      questionType: "short_answer",
      prompt: "**Prediction** — *before* you run the experiment, predict what will happen and why.",
      placeholder: "I think ___ will happen because ___.",
      difficulty: "create"
    },
    {
      id: `${idPrefix}-q-observation`,
      type: "question",
      questionType: "short_answer",
      prompt: "**Observation** — what actually happened? Was your prediction right?",
      placeholder: "What I observed: ___. My prediction was/was not correct because ___.",
      difficulty: "remember"
    },
    {
      id: `${idPrefix}-q-mechanism`,
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Mechanism** — which one(s) explain what you observed at this station? (Pick the *primary* one.)",
      options: null, // filled in per station
      correctIndex: null,
      explanation: null,
      difficulty: "analyze"
    },
    {
      id: `${idPrefix}-q-explain`,
      type: "question",
      questionType: "short_answer",
      prompt: "**Atomic-model explanation** — use the atomic model to explain what happened. Track every electron — where did extra electrons come from, and where did they end up?",
      placeholder: "At the start: ___. Then ___ caused electrons to ___. The final state is ___ because ___.",
      difficulty: "create"
    }
  ];
};

const lesson = {
  title: "The Charge Detective — Electrostatics Synthesis Lab",
  questionOfTheDay: "Two mystery phenomena. Four mechanisms in your toolkit. Can you match them up?",
  course: "Physics",
  unit: "Electrostatics",
  order: 12,
  visible: false,
  gradesReleased: true,
  dueDate: "2026-05-05",
  blocks: [
    {
      id: "w34cd-sec-welcome",
      type: "section_header",
      icon: "🕵️",
      title: "Welcome, Charge Detectives",
      subtitle: "~5 min · double-period lab"
    },
    {
      id: "w34cd-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Two mystery phenomena. Four mechanisms in your toolkit. Can you match them up?"
    },
    {
      id: "w34cd-text-intro",
      type: "text",
      content: "You've spent two weeks building the atomic model — protons, neutrons, electrons, +ions, free electrons, conductors vs. dielectrics, and four mechanisms (friction, conduction, induction, polarization). Today is the lab where you put it all together.\n\n**The job:** Two lab stations are set up around the room. At each station, recreate the phenomenon, identify the mechanism, draw a charge diagram, and explain it using the atomic model. Rotate every ~20 minutes when Mr. McCarthy calls it.\n\n**The closer:** the last 30 minutes of the period is the **Electrostatics Mastery Check**. The lab IS the study guide — every station maps onto one of the mastery-check problem types. You earn the warm-up by doing the lab well."
    },
    {
      id: "w34cd-objectives",
      type: "objectives",
      title: "What You'll Demonstrate Today",
      items: [
        "How to identify which mechanism (friction, conduction, induction, polarization) is at work in any phenomenon",
        "How to draw multi-state charge diagrams that account for every electron",
        "How to explain conductor vs. dielectric behavior at the atomic level",
        "How to use known reference charges (rubbed PVC, rubbed fur) to determine the sign of an unknown object"
      ]
    },
    {
      id: "w34cd-callout-rules",
      type: "callout",
      style: "warning",
      icon: "⏱️",
      content: "**Rules of play:**\n\n1. **Rotate every ~20 min** on the whistle. Don't linger — even if you're stuck, the next station might unlock the idea.\n2. **Predict before you test.** Write your prediction on the whiteboard *before* you bring objects together.\n3. **Track every electron.** Your charge diagram must account for where every extra electron came from and where it ended up.\n4. **Name the mechanism.** Pick one — friction, conduction, induction, or polarization — and defend it in one sentence.\n5. **Reset between groups.** Touch metal pieces with your finger to ground them before walking away."
    },
    {
      id: "w34cd-callout-mechanisms",
      type: "callout",
      style: "insight",
      icon: "📘",
      content: "**Mechanism cheat sheet** (keep this in your peripheral vision):\n\n- **Friction** — Two objects rubbed together. Electrons move from one surface to the other. Both end up with **opposite signs**.\n- **Conduction** — Charged object touches a conductor. Charge transfers. Both end up with the **same sign**.\n- **Induction** — Charged object is brought *near* (no contact) + grounded briefly. Object ends up with the **opposite sign** of the inducer.\n- **Polarization** — Charged object is brought *near* (no contact, no ground). Charges shift inside but no net charge changes. Effect disappears when the inducer leaves."
    },

    // ============ STATION 1 — Tape Pair ============
    ...(() => {
      const blocks = stationBlocks(
        1, "📎",
        "Tape Pair",
        "Two pieces of identical tape. Pull them apart and watch them disagree.",
        "Roll of Scotch **Magic** Tape (matte/frosted) · smooth dry desk · rubbed PVC pipe (sign verifier)",
        [
          "Stick a strip of tape to the desk (**B**, bottom). Stick a second strip on top of B's back (**T**, top). Press flat.",
          "Peel the BT stack off the desk **as one unit**.",
          "Now **peel T off B**. Hold one in each hand.",
          "Bring the rubbed PVC near each tape — verify the signs."
        ],
        "station2-setup.jpg",
        "Three procedural panels showing two strips of Scotch tape: stacked on a desk, then peeled off as a unit, then separated.",
        "Three steps: stack on desk, peel off as a unit, then separate T from B. Test their reactions to each other and to a rubbed PVC."
      );
      const mc = blocks.find(b => b.id === "w34cd-s1-q-mechanism");
      mc.options = [
        "**Friction (contact electrification)** — pulling the adhesive surfaces apart transferred electrons between the two tapes, leaving them with opposite signs.",
        "**Induction** — the desk's charge induced opposite charges on T and B.",
        "**Conduction** — the desk donated charge to the BT stack equally.",
        "**Polarization** — the tapes are dipoles that re-orient when brought together."
      ];
      mc.correctIndex = 0;
      mc.explanation = "Peeling the adhesive interface transferred electrons between T and B. T (top) lost electrons → positive. B (bottom) gained electrons → negative. This is contact electrification (a form of friction-driven charging) — even though the two tapes started identical.";
      return blocks;
    })(),

    // ============ STATION 2 — Bending Water ============
    ...(() => {
      const blocks = stationBlocks(
        2, "💧",
        "Bending Water",
        "Charge a pipe (negative), then charge a person with the Van de Graaff (positive). Test both signs against the same water stream.",
        "Steady thin water stream from a faucet · catch basin · gray PVC pipe + fur (negative reference) · **Van de Graaff generator** (positive reference) · grounded discharge rod for reset",
        [
          "Get a steady, thin water stream (~2-3 mm wide).",
          "Rub PVC with fur. Slowly bring the pipe to ~5 cm from the stream — *do not touch*. Observe the direction the stream bends.",
          "Pull the pipe away. Stream returns to vertical.",
          "**Now charge a volunteer with the Van de Graaff:** with the VDG OFF, the volunteer puts one hand flat on the dome. Turn the VDG on for ~10 seconds (hair stands up = working). Turn it OFF, then have the volunteer step away **without** touching anything grounded.",
          "The charged volunteer slowly brings their **free arm** to ~5 cm from the stream — *do not touch*. Observe the direction the stream bends.",
          "Compare: PVC (negative) vs. VDG-charged person (positive). Did the stream bend the same way or opposite ways?",
          "**Reset:** volunteer touches the grounded discharge rod before doing anything else."
        ],
        "station3-setup.jpg",
        "A faucet releases a thin steady vertical water stream falling straight down into a basin. To the right, a hand holds a horizontal gray PVC pipe. A piece of fur sits on a counter beside the apparatus.",
        "Faucet, thin stream, PVC pipe held 5 cm away. After the PVC test, a Van de Graaff-charged volunteer brings their arm near the stream. Compare both directions of bend."
      );
      const mc = blocks.find(b => b.id === "w34cd-s2-q-mechanism");
      mc.options = [
        "**Conduction** — the pipe transferred electrons into the stream.",
        "**Induction** — the stream was grounded and gained an opposite charge.",
        "**Friction** — the stream's motion against the pipe rubbed electrons off.",
        "**Polarization (of a polar dielectric)** — water molecules reoriented their permanent dipoles to point their opposite-sign end at the pipe; the stream stays net-neutral but is pulled toward the pipe."
      ];
      mc.correctIndex = 3;
      mc.explanation = "Water is a *polar dielectric* — each H₂O molecule has a permanent dipole (O end is δ−, H end is δ+). When a charged object approaches, every molecule rotates so its opposite-sign end faces the object. The closer end's attraction is stronger than the farther end's repulsion (Coulomb's $1/r^2$), so the stream bends toward the charged object — regardless of the object's sign.";
      return blocks;
    })(),

    // ============ FINAL UPLOAD + TRANSITION ============
    {
      id: "w34cd-sec-evidence",
      type: "section_header",
      icon: "📷",
      title: "Submit Your Whiteboard",
      subtitle: "Before the mastery check"
    },
    {
      id: "w34cd-evidence-upload",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Your Whiteboard — Both Stations",
      instructions: "Photo of your group whiteboard showing **both charge diagrams** (one per station). Each diagram should account for every electron, label the mechanism (friction / conduction / induction / polarization), and show the final net charge of every object. Annotate clearly so Mr. McCarthy can read it.",
      reflectionPrompt: "**One sentence:** which station was hardest, and what specifically about the atomic model unlocked it for you?"
    },
    {
      id: "w34cd-callout-mastery",
      type: "callout",
      style: "warning",
      icon: "⏰",
      content: "**Last 30 minutes of the period:** flip to the **Electrostatics Mastery Check** lesson. Whiteboards only — no notes, no Internet. Closes the unit."
    },
    {
      id: "w34cd-callout-bridge",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "**Coming up Wednesday:** Magnetism kicks off. Same atomic model, but with a brand new force — and a twist that has nothing to do with charge transfer."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w34-synthesis-lab", lesson);
    console.log("✅ Lesson seeded: The Charge Detective — Synthesis Lab (Tue 5/5 double)");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);

    // MC distribution check
    const mcs = lesson.blocks.filter(b => b.type === "question" && b.questionType === "multiple_choice");
    const dist = [0, 0, 0, 0];
    mcs.forEach(q => { if (q.correctIndex != null) dist[q.correctIndex]++; });
    console.log(`   📊 MC distribution (${mcs.length} questions): A=${dist[0]} B=${dist[1]} C=${dist[2]} D=${dist[3]}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
