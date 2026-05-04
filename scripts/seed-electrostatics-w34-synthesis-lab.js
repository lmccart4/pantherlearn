// seed-electrostatics-w34-synthesis-lab.js
// Electrostatics — Week 34, Tue 5/5 (84 min DOUBLE LAB, P1)
// "The Charge Detective" synthesis lab + Mastery Check intro.
// 5 stations × 10 min, then mastery check.
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
  questionOfTheDay: "Five mystery phenomena. Five mechanisms in your toolkit. Can you match them up?",
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
      content: "**Question of the Day:** Five mystery phenomena. Five mechanisms in your toolkit. Can you match them up?"
    },
    {
      id: "w34cd-text-intro",
      type: "text",
      content: "You've spent two weeks building the atomic model — protons, neutrons, electrons, +ions, free electrons, conductors vs. dielectrics, and four mechanisms (friction, conduction, induction, polarization). Today is the lab where you put it all together.\n\n**The job:** Five lab stations are set up around the room. At each station, recreate the phenomenon, identify the mechanism, draw a charge diagram, and explain it using the atomic model. Rotate every 10 minutes when Mr. McCarthy calls it.\n\n**The closer:** the last 30 minutes of the period is the **Electrostatics Mastery Check**. The lab IS the study guide — every station maps onto one of the mastery-check problem types. You earn the warm-up by doing the lab well."
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
      content: "**Rules of play:**\n\n1. **Rotate every 10 min** on the whistle. Don't linger — even if you're stuck, the next station might unlock the idea.\n2. **Predict before you test.** Write your prediction on the whiteboard *before* you bring objects together.\n3. **Track every electron.** Your charge diagram must account for where every extra electron came from and where it ended up.\n4. **Name the mechanism.** Pick one — friction, conduction, induction, or polarization — and defend it in one sentence.\n5. **Reset between groups.** Touch metal pieces with your finger to ground them before walking away."
    },
    {
      id: "w34cd-callout-mechanisms",
      type: "callout",
      style: "insight",
      icon: "📘",
      content: "**Mechanism cheat sheet** (keep this in your peripheral vision):\n\n- **Friction** — Two objects rubbed together. Electrons move from one surface to the other. Both end up with **opposite signs**.\n- **Conduction** — Charged object touches a conductor. Charge transfers. Both end up with the **same sign**.\n- **Induction** — Charged object is brought *near* (no contact) + grounded briefly. Object ends up with the **opposite sign** of the inducer.\n- **Polarization** — Charged object is brought *near* (no contact, no ground). Charges shift inside but no net charge changes. Effect disappears when the inducer leaves."
    },

    // ============ STATION 1 — Mystery Sphere ============
    ...(() => {
      const blocks = stationBlocks(
        1, "🪀",
        "Mystery Sphere",
        "One is charged, one is neutral. Figure out which is which — and the sign.",
        "2 foil-wrapped Styrofoam spheres on cotton thread (~10 cm apart) · gray PVC pipe · piece of fur",
        [
          "Rub the **PVC pipe** with the fur for ~10 seconds.",
          "Slowly bring the **PVC** near Sphere A — *no contact*. Observe.",
          "Move the PVC to Sphere B. Observe.",
          "Set the PVC down. Pick up the **fur**. Bring it near each sphere. Observe.",
          "Decide: which sphere is charged, and what sign?"
        ],
        "station1-setup.jpg",
        "Two foil-wrapped Styrofoam spheres labeled A and B hang from cotton threads off a wooden support rod, ten centimeters apart. A hand holds a gray PVC pipe. A piece of fur sits on the lab table.",
        "Two foil-wrapped spheres on threads. One is charged, one is neutral — figure out which is which."
      );
      // Patch the MC question for this station
      const mc = blocks.find(b => b.id === "w34cd-s1-q-mechanism");
      mc.options = [
        "**Induction** — the spheres ended up oppositely charged through grounding.",
        "**Polarization (only) for one sphere; pre-existing charge for the other** — the charged sphere reacts in a sign-specific way to PVC and fur, while the neutral sphere is just polarized and attracted to both.",
        "**Friction** — the act of bringing the PVC near rubbed electrons onto the spheres.",
        "**Conduction** — charge transferred from PVC into the spheres on contact."
      ];
      mc.correctIndex = 1;
      mc.explanation = "The two spheres reveal themselves by their *opposite* reactions to oppositely-signed reference objects. The truly charged sphere repels one (same sign) and attracts the other (opposite sign). The neutral sphere is *attracted to both* — that's polarization, not charging.";
      return blocks;
    })(),

    // ============ STATION 2 — Tape Pair ============
    ...(() => {
      const blocks = stationBlocks(
        2, "📎",
        "Tape Pair",
        "Two pieces of identical tape. Pull them apart and watch them disagree.",
        "Roll of Scotch **Magic** Tape (matte/frosted) · smooth dry desk · rubbed PVC pipe (sign verifier)",
        [
          "Stick a strip of tape to the desk (**B**, bottom). Stick a second strip on top of B's back (**T**, top). Press flat.",
          "Peel the BT stack off the desk **as one unit**.",
          "Now **peel T off B**. Hold one in each hand.",
          "Bring T near B. Then T near another T (from a second stack). Then B near another B.",
          "Bring the rubbed PVC near each tape — verify the signs."
        ],
        "station2-setup.jpg",
        "Three procedural panels showing two strips of Scotch tape: stacked on a desk, then peeled off as a unit, then separated.",
        "Three steps: stack on desk, peel off as a unit, then separate T from B. Test their reactions to each other and to a rubbed PVC."
      );
      const mc = blocks.find(b => b.id === "w34cd-s2-q-mechanism");
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

    // ============ STATION 3 — Bending Water ============
    ...(() => {
      const blocks = stationBlocks(
        3, "💧",
        "Bending Water",
        "Charge a pipe, hold it near a thin water stream, and watch physics break gravity's grip.",
        "Steady thin water stream from a faucet · catch basin · gray PVC pipe + fur · *(optional: glass rod + silk for second sign)*",
        [
          "Get a steady, thin water stream (~2-3 mm wide).",
          "Rub PVC with fur. Slowly bring the pipe to ~5 cm from the stream — *do not touch*. Observe.",
          "Pull the pipe away. Stream returns. Note the direction the stream bent.",
          "Repeat with the **fur itself** — or with a rubbed glass rod, if you have one. Compare the two cases."
        ],
        "station3-setup.jpg",
        "A faucet releases a thin steady vertical water stream falling straight down into a basin. To the right, a hand holds a horizontal gray PVC pipe. A piece of fur sits on a counter beside the apparatus.",
        "Faucet, thin stream, PVC pipe held 5 cm away. Try the rubbed pipe first, then the rubbed fur. Watch the stream closely."
      );
      const mc = blocks.find(b => b.id === "w34cd-s3-q-mechanism");
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

    // ============ STATION 4 — Aluminum Can ============
    ...(() => {
      const blocks = stationBlocks(
        4, "🥫",
        "Aluminum Can",
        "A charged balloon nearby. Watch what the can does without ever being touched.",
        "Empty dry aluminum soda can · smooth level desk · inflated latex balloon · piece of fur (or wool, or clean dry hair)",
        [
          "Place the can on its side. Confirm it doesn't roll on its own.",
          "Rub the balloon vigorously on fur for ~10 seconds.",
          "Hold the balloon ~10 cm from the can — *no contact*.",
          "Slowly walk the balloon away from the can along the desk. Observe.",
          "Move the balloon to the **opposite side** of the can. What happens?"
        ],
        "station4-setup.jpg",
        "An empty aluminum soda can lies on its side on a wooden desk. A hand holds a red latex balloon nearby. A piece of fur lies on the desk.",
        "Can on its side. Balloon ~10 cm away. The balloon never touches the can. Watch closely."
      );
      const mc = blocks.find(b => b.id === "w34cd-s4-q-mechanism");
      mc.options = [
        "**Conduction** — charge jumped from balloon to can across the gap.",
        "**Friction** — the can rolling on the desk picked up charge.",
        "**Polarization (of a conductor)** — the balloon repelled free electrons inside the can to the far side, leaving the near side positive. Net charge of can is still zero, but it experiences a net attractive force.",
        "**Induction** — grounding through the desk gave the can a permanent opposite charge."
      ];
      mc.correctIndex = 2;
      mc.explanation = "Aluminum is a conductor with free electrons. The negative balloon repels those free electrons to the far side of the can. The near side has +ions (electrons fled), the far side has extra electrons. Net charge is still zero — the can isn't *charged*, just *polarized*. The closer +ions feel a stronger attraction than the farther electrons feel repulsion (Coulomb's $1/r^2$), so the can rolls toward the balloon.";
      return blocks;
    })(),

    // ============ STATION 5 — Two-Step Chain ============
    ...(() => {
      const blocks = stationBlocks(
        5, "🔗",
        "Two-Step Chain",
        "Charge A passes through B passes through C. Predict C's sign before you test.",
        "Gray PVC pipe + fur (Object **A**) · electroscope (Object **B**) · foil-wrapped Styrofoam ball on thread (Object **C**) · second rubbed PVC pipe (verifier)",
        [
          "Rub **A** (PVC) with fur. Touch A directly to the metal ball of the **electroscope (B)**. Pull A away.",
          "Bring **C** (foil ball) close to B's metal ball — *no contact*.",
          "While C is near B, briefly **touch C with your finger**. Then remove the finger.",
          "Pull C away from B.",
          "**Predict** C's sign. Then test with the verifier PVC."
        ],
        "station5-setup.jpg",
        "Three procedural panels showing the chain. Panel 1: a hand holds a PVC pipe touching the metal ball of an electroscope. Panel 2: the same electroscope with a foil ball hanging close (not touching) the ball, and a finger touching the foil ball. Panel 3: the foil ball alone, with a second PVC pipe approaching as a verifier.",
        "Three steps: A touches B, then C is brought near B with a finger tap, then C is pulled away and tested with a verifier PVC."
      );
      const mc = blocks.find(b => b.id === "w34cd-s5-q-mechanism");
      mc.options = [
        "**Two stages: A → B by conduction (same sign), then B → C by induction (opposite sign).** The grounding step on C is what flips the sign.",
        "**Conduction throughout** — A → B → C all by direct contact, all the same sign.",
        "**Friction throughout** — every step rubs charge between objects.",
        "**Polarization only** — none of the objects gained a permanent charge."
      ];
      mc.correctIndex = 0;
      mc.explanation = "Step 1 is **conduction**: A (negative) touches B (electroscope), some electrons transfer, both end up negative. Step 2 is **induction**: C (neutral foil ball) is polarized by B without contact — free electrons in C flee to the far side (away from B). Touching C with your finger grounds the far side, draining electrons to Earth. Removing the finger and then C leaves C with a net deficit of electrons → C is **positive**, opposite of B.";
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
      title: "Upload Your Whiteboard — All 5 Stations",
      instructions: "Photo of your group whiteboard showing **all five charge diagrams** (one per station). Each diagram should account for every electron, label the mechanism (friction / conduction / induction / polarization), and show the final net charge of every object. Annotate clearly so Mr. McCarthy can read it.",
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
