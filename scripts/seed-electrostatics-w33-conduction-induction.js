// seed-electrostatics-w33-conduction-induction.js
// Electrostatics — Week 33, Mon 4/27 (42 min, P1)
// Charge diagram practice → Charging by conduction → Charging by induction
// Sources: Week 32 Slides (Tasks 1-2, 14), Discovery: Conduction PDF, Conductors & Dielectrics PDF
// Run: node scripts/seed-electrostatics-w33-conduction-induction.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "/images/physics/electrostatics";

const lesson = {
  title: "Charging by Conduction and Induction",
  questionOfTheDay: "How can you give an object a permanent charge without ever touching it with the charged thing?",
  course: "Physics",
  unit: "Electrostatics",
  order: 8,
  visible: false,
  dueDate: "2026-04-27",
  blocks: [
    {
      id: "w33ci-sec-welcome",
      type: "section_header",
      icon: "⚡",
      title: "Today: Two Ways to Charge an Object",
      subtitle: "~2 min"
    },
    {
      id: "w33ci-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** How can you give an object a permanent charge *without ever touching it* with the charged thing?"
    },
    {
      id: "w33ci-text-intro",
      type: "text",
      content: "Last week you figured out *why* things become charged (electron transfer) and *why* charged things attract neutral things (polarization). Today you'll use those ideas to read and draw charge diagrams for two specific ways an object can end up charged:\n\n- **Charging by conduction** — direct contact: charge moves from one object to another when they touch.\n- **Charging by induction** — *no contact* between the charged object and the object you're charging."
    },
    {
      id: "w33ci-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "How to read a charge diagram and what it tells you about a system",
        "What happens to electrons inside a conductor during charging by conduction",
        "How an object can end up with a *permanent* charge of the opposite sign without ever touching the charged object",
        "How to draw multi-state charge diagrams that track every electron"
      ]
    },

    {
      id: "w33ci-sec-warmup",
      type: "section_header",
      icon: "🧠",
      title: "Warm-Up — Reading Charge Diagrams",
      subtitle: "~6 min"
    },
    {
      id: "w33ci-text-warmup",
      type: "text",
      content: "Before we add anything new, let's check that the charge diagram language from last week is solid. The diagrams below show two systems that started neutral and were charged by rubbing against each other.\n\nRecall the key:\n- Oval with a **+** and a **−** = **atom** (neutral, balanced)\n- Oval with only a **+** = **+ion** (lost an electron)\n- Oval with only a **−** = **−ion** (gained an electron)"
    },
    {
      id: "w33ci-img-system-a",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/charge-diagram-system-a.png",
      caption: "System A — count the atoms, +ions, and −ions.",
      alt: "Charge diagram labeled System A in a red box. Five oval shapes inside: two atoms (each containing a green plus and a red minus), one +ion (single green plus), and two −ions (each oval containing a red minus and green plus arranged differently)."
    },
    {
      id: "w33ci-img-system-b",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/charge-diagram-system-b.png",
      caption: "System B — count the atoms, +ions, and −ions.",
      alt: "Charge diagram labeled System B in an orange box. Five oval shapes inside: a mix of atoms, +ions, and −ions in different configurations than System A."
    },
    {
      id: "w33ci-q-warmup-read",
      type: "question",
      questionType: "short_answer",
      prompt: "**List everything you know to be true about these two systems.** What is the net charge on each? Did one give electrons to the other, or did they exchange? How do you know?",
      placeholder: "System A's net charge is ___ because ___. System B's net charge is ___ because ___. Across the two systems, electrons moved from ___ to ___.",
      difficulty: "analyze"
    },
    {
      id: "w33ci-q-warmup-mass",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Three students made claims about the **mass** of the two systems before and after charging. Which is correct?",
      options: [
        "System A's mass increased and System B's mass decreased.",
        "System A's mass decreased and System B's mass increased.",
        "The mass of both systems doubled because charging adds new particles.",
        "Both systems' mass is essentially unchanged — the electrons that moved are far too small to matter at the macroscopic scale."
      ],
      correctIndex: 3,
      explanation: "Charging only moves electrons that already existed. An electron's mass ($9.109 \\times 10^{-31}$ kg) is about 1/1836 the mass of a proton, so even billions of transferred electrons don't show up on a normal scale.",
      difficulty: "apply"
    },

    {
      id: "w33ci-sec-conduction",
      type: "section_header",
      icon: "🤝",
      title: "Part 1 — Charging by Conduction",
      subtitle: "~12 min"
    },
    {
      id: "w33ci-text-conduction-intro",
      type: "text",
      content: "**The setup:** rub a gray PVC pipe with fur. The pipe now has extra electrons (it's negatively charged). Now bring the charged pipe over and **rub it directly against the metal ball on top of an electroscope**.\n\nDirect contact between two conductors-or-near-conductors. Watch what happens to the leaves at the bottom."
    },
    {
      id: "w33ci-callout-demo-conduction",
      type: "callout",
      style: "insight",
      icon: "👀",
      content: "**Class demo:** Mr. McCarthy will run the experiment up front. After he rubs the gray pipe against the metal ball and pulls it away, **the leaves stay spread apart**. They don't fall back together when the pipe leaves. The electroscope is now charged, and it stays that way."
    },
    {
      id: "w33ci-q-conduction-leaves",
      type: "question",
      questionType: "multiple_choice",
      prompt: "After the charged pipe is rubbed against the metal ball and removed, the leaves stay spread apart. **Why?**",
      options: [
        "The leaves are pushing apart because they have the same kind of charge as each other and are repelling.",
        "The leaves are pulling toward the glass walls of the electroscope.",
        "The leaves got heavier when the pipe touched them and gravity is pulling them sideways.",
        "Air pressure inside the electroscope is forcing them apart."
      ],
      correctIndex: 0,
      explanation: "Like charges repel. When the negatively charged pipe touches the metal ball, some of the extra electrons move from the pipe onto the conductor. Those extra electrons spread out across the entire conductor — including down to both leaves. Both leaves end up negatively charged, and they push each other apart.",
      difficulty: "analyze"
    },
    {
      id: "w33ci-text-conduction-diagram",
      type: "text",
      content: "**Whiteboard task — draw the charge diagram for charging by conduction.**\n\nDraw **three states**, side by side, of just the electroscope (the metal ball, the metal stem, and the two leaves):\n\n1. **Before** — the electroscope is neutral. Equal numbers of + and − everywhere.\n2. **During contact** — the negatively charged pipe is touching the metal ball. Show electrons transferring from the pipe onto the metal ball.\n3. **After** — the pipe has been removed. Where do the extra electrons end up? Why are the leaves now spread?\n\nUse the charge bank from the Discovery PDF: just drag in the +s and −s you need. Don't forget that conductors have **free electrons** that move on their own."
    },
    {
      id: "w33ci-q-conduction-explain",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your three-state diagram in words. **Where exactly did the extra electrons end up after the pipe was removed, and why is that location different from where they started?**",
      placeholder: "State 1 (before): the electroscope had ___. State 2 (contact): electrons moved from ___ to ___. State 3 (after): the extra electrons ended up ___ because ___ in a conductor.",
      difficulty: "create"
    },
    {
      id: "w33ci-callout-conduction-defn",
      type: "callout",
      style: "insight",
      icon: "📘",
      content: "**Charging by conduction** = transferring charge by direct contact. Charge moves from the charged object to the neutral conductor. Both objects end up with the **same sign of charge** at the end."
    },

    {
      id: "w33ci-sec-induction",
      type: "section_header",
      icon: "🪄",
      title: "Part 2 — Charging by Induction",
      subtitle: "~16 min"
    },
    {
      id: "w33ci-text-induction-setup",
      type: "text",
      content: "Now for the strange one. Same charged gray pipe. Same neutral electroscope. But this time, **the pipe never touches the electroscope**.\n\nWatch carefully — there are four steps, and the order matters.\n\n1. Rub the gray pipe with fur (it becomes negatively charged).\n2. Bring the pipe **close to** the metal ball — but **don't touch**. Watch the leaves.\n3. While the pipe is still held close, **briefly tap the metal ball with your finger**. Watch the leaves.\n4. Pull your finger away. Then pull the pipe away. Watch the leaves *now*."
    },
    {
      id: "w33ci-q-induction-step2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Step 2** — the negatively charged pipe is held close to the metal ball, no contact. The leaves spread apart. What is happening inside the conductor?",
      options: [
        "Electrons in the pipe jump across the air gap onto the ball.",
        "Free electrons in the conductor are repelled by the pipe and move down to the leaves, leaving the metal ball with a deficit of electrons.",
        "The leaves heat up and rise from convection.",
        "Atoms in the metal break apart."
      ],
      correctIndex: 1,
      explanation: "The pipe's negative charge repels the conductor's free electrons. They flow down through the metal stem to the leaves. The top (ball) is left with extra +ions, and the bottom (leaves) has extra electrons — both leaves negative, so they repel each other. This is **polarization** of a conductor.",
      difficulty: "analyze"
    },
    {
      id: "w33ci-q-induction-step3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Step 3** — pipe is still close, you briefly tap the metal ball with your finger. The leaves close (fall back together). Why?",
      options: [
        "Touching the ball cancels the pipe's charge.",
        "Your finger pushes the leaves shut mechanically.",
        "Your finger is also a conductor and is connected (through your body) to the giant reservoir of charge that is the Earth. Electrons from the leaves flow up through your finger into the ground, leaving the leaves with no extra charge.",
        "The pipe stops being charged when you touch the ball."
      ],
      correctIndex: 2,
      explanation: "This is called **grounding**. Your body provides a path from the conductor to the Earth. The extra electrons that had piled up in the leaves can now flow away through you. The leaves lose their negative charge and fall back together. The metal ball still has a deficit of electrons — but the pipe is still nearby holding that situation in place.",
      difficulty: "analyze"
    },
    {
      id: "w33ci-q-induction-step4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Step 4** — finger is removed *first*, then the pipe is removed. The leaves spread apart again, and they stay spread. What is the **net charge** of the electroscope now?",
      options: [
        "Positive — opposite sign of the pipe.",
        "Neutral — touching with your finger discharged it.",
        "Negative — same sign as the pipe.",
        "It depends on how long the pipe was nearby."
      ],
      correctIndex: 0,
      explanation: "When you grounded with your finger, electrons left the electroscope (they fled the negative pipe). When you removed your finger, those electrons couldn't come back. When you removed the pipe, the +ions that were stuck near the ball were free to spread out across the whole conductor — leaving the entire electroscope with a net **positive** charge. You charged it to the *opposite* sign of the pipe, without ever touching it with the pipe.",
      difficulty: "analyze"
    },
    {
      id: "w33ci-text-induction-diagram",
      type: "text",
      content: "**Whiteboard task — draw the charge diagram for charging by induction.**\n\nDraw **four states**, side by side:\n\n1. **Before** — neutral electroscope, no pipe.\n2. **Pipe close, no touch** — show how the free electrons rearranged. Where did they go? Where are the +ions left over?\n3. **Finger touching the ball, pipe still close** — show electrons leaving through your finger to ground.\n4. **Finger gone, pipe gone** — show the final distribution. The electroscope's net charge should be the *opposite* of the pipe's.\n\nLabel each state and the direction every electron moved between states."
    },
    {
      id: "w33ci-q-induction-create",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your four-state diagram in words. **How did the electroscope end up with the opposite charge of the pipe — even though the pipe never touched it?**",
      placeholder: "In State 2, the pipe ___ the free electrons, which moved to ___. In State 3, my finger let those electrons ___. In State 4, with the finger and pipe gone, the +ions ___, leaving the whole electroscope with a net ___ charge.",
      difficulty: "create"
    },
    {
      id: "w33ci-callout-induction-defn",
      type: "callout",
      style: "insight",
      icon: "📘",
      content: "**Charging by induction** = charging an object by polarizing it with a nearby charged object, then grounding it briefly so some of the displaced electrons can leave (or arrive). The charged object is **never touched** to the object being charged. The result: the object ends up with the **opposite** sign of the charged object that polarized it."
    },

    {
      id: "w33ci-sec-synthesis",
      type: "section_header",
      icon: "🔮",
      title: "Part 3 — Predicting a Phenomenon",
      subtitle: "~5 min"
    },
    {
      id: "w33ci-text-synthesis",
      type: "text",
      content: "Two **metal spheres** (both conductors). Sphere A is neutral. Sphere B has a **net positive charge** (4 extra +ions, 0 extra electrons). The spheres are brought together until they touch. They are held in contact for a moment. Then they are pulled apart again."
    },
    {
      id: "w33ci-q-synthesis-predict",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**After the spheres are pulled apart, what are their charges?**",
      options: [
        "Sphere A: neutral. Sphere B: +4 (no change — they only touched briefly).",
        "Sphere A: +2. Sphere B: +2 (the extra positive charge spreads out evenly across both spheres while they're touching, then half stays on each when they separate).",
        "Sphere A: −2. Sphere B: +2 (they trade charges).",
        "Sphere A: +4. Sphere B: 0 (all the charge jumps from B to A on contact)."
      ],
      correctIndex: 1,
      explanation: "While the two conductors are touching, they act as one larger conductor. The 4 extra +ions worth of charge spreads out as far as it can — across both spheres. When they're pulled apart, each takes half: +2 each. (The electrons did the moving — 2 free electrons from sphere A flowed onto sphere B, leaving each sphere with a +2 net charge.) This is charging by **conduction**.",
      difficulty: "apply"
    },
    {
      id: "w33ci-q-synthesis-diagram",
      type: "question",
      questionType: "short_answer",
      prompt: "Draw the three-state charge diagram on your whiteboard (State 1: before contact. State 2: in contact. State 3: pulled apart). Then describe in words: **which way did electrons actually move when the spheres touched, and why did they move that way?**",
      placeholder: "Electrons moved from sphere ___ to sphere ___ because ___. After separation, sphere A has ___ and sphere B has ___.",
      difficulty: "create"
    },

    {
      id: "w33ci-sec-evidence",
      type: "section_header",
      icon: "📷",
      title: "Submit Your Work",
      subtitle: "~1 min"
    },
    {
      id: "w33ci-evidence-diagrams",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — All Three Diagrams",
      instructions: "Photo of your whiteboard showing all three sets of diagrams: (1) the three-state conduction diagram from Part 1, (2) the four-state induction diagram from Part 2, (3) the three-state two-spheres diagram from Part 3. Free electrons, +ions, atoms, and electron-flow arrows should all be clearly drawn and labeled.",
      reflectionPrompt: "One sentence: in your own words, what's the *one critical step* in induction that conduction doesn't have — the step that lets the object end up with the opposite charge?"
    },

    {
      id: "w33ci-callout-bridge",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "**Coming up Thursday:** we'll use these same diagrams to explain *charging by friction* (rubbing) at the level of the atomic model — and start tying it to the bigger pattern: every electrostatic phenomenon you've seen this unit comes down to one of three mechanisms (friction, conduction, induction)."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w33-conduction-induction", lesson);
    console.log("✅ Lesson seeded: Charging by Conduction and Induction (Mon 4/27)");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
