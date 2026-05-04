// seed-electrostatics-w34-applying-atomic-model.js
// Electrostatics — Week 34, Mon 5/4 (42 min, P1)
// Task 14 leveled phenomenon-explanation challenge.
// Source: Week 32 Slides, last 5 slides ("Applying the Atomic Model" — Levels 1 → Final).
// Run: node scripts/seed-electrostatics-w34-applying-atomic-model.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Applying the Atomic Model — The Levels Challenge",
  questionOfTheDay: "Can you use the atomic model to explain *every* electroscope phenomenon I throw at you?",
  course: "Physics",
  unit: "Electrostatics",
  order: 11,
  visible: false,
  gradesReleased: true,
  dueDate: "2026-05-04",
  blocks: [
    {
      id: "w34am-sec-welcome",
      type: "section_header",
      icon: "🧗",
      title: "Today: Five Levels. One Atomic Model.",
      subtitle: "~3 min"
    },
    {
      id: "w34am-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Can you use the atomic model to explain *every* electroscope phenomenon I throw at you?"
    },
    {
      id: "w34am-text-intro",
      type: "text",
      content: "You've spent the last two weeks building the atomic model: protons, neutrons, electrons, +ions, free electrons, conductors vs. dielectrics. Today is **Task 14** — the boss fight.\n\nFive levels. Each level shows you a phenomenon to recreate with the electroscope and a gray PVC pipe (or balloon). Your job: **recreate it, then explain it** using the atomic model + a charge diagram. When your explanation is solid, show Mr. McCarthy. If it's right, you advance. If not, refine and try again."
    },
    {
      id: "w34am-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "How to predict and explain electroscope behavior using only the atomic model",
        "When charge moves by conduction vs. induction vs. polarization",
        "Why grounding (touching with a finger) flips the final outcome",
        "How to draw multi-state charge diagrams that account for every electron"
      ]
    },
    {
      id: "w34am-callout-materials",
      type: "callout",
      style: "insight",
      icon: "🧰",
      content: "**Materials at your station:** electroscope, gray PVC pipe, fur, latex balloon, group whiteboard + markers. *Final Level requires someone to hold the electroscope a foot off the desk — coordinate with your group.*"
    },
    {
      id: "w34am-img-electroscope-ref",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/electroscope-labeled.jpg",
      caption: "Your electroscope, labeled. The metal ball + stem + leaves are one connected conductor. The glass envelope and rubber stopper are dielectric — they isolate the conductor from everything else.",
      alt: "Educational diagram of a labeled electroscope: a pear-shaped clear glass envelope with a black rubber stopper at the top, a vertical brass rod through the stopper, a polished metal sphere on top of the rod, and two thin gold metal leaves hanging straight down from the bottom of the rod inside the glass. Callouts label the metal ball, metal stem, rubber stopper, glass envelope, and the two thin metal leaves."
    },

    {
      id: "w34am-sec-grounding",
      type: "section_header",
      icon: "⚡",
      title: "Demo — What is Grounding?",
      subtitle: "~6 min · Van de Graaff up front"
    },
    {
      id: "w34am-text-grounding-intro",
      type: "text",
      content: "Before we open Level 1, you need a word for what's about to happen on Levels 2 and Final: **grounding**.\n\nThe Earth is enormous. Compared to a person, an electroscope, or a Van de Graaff dome, the Earth has a *practically infinite* supply of free electrons — and an equally infinite capacity to absorb them. Anytime a charged object is connected to the Earth by a path that conducts, electrons will flow either *into* or *out of* the object until it's neutral. That flow is **grounding**."
    },
    {
      id: "w34am-text-grounding-demo",
      type: "text",
      content: "**Watch up front.** Mr. McCarthy will run the Van de Graaff generator and try the same thing two ways:\n\n1. **Standing on the floor**, a volunteer touches the charged dome. *(Watch for hair, watch for sparks.)*\n2. **Standing on a milk crate** (a dielectric — see fact #4 from our reference card), a volunteer touches the charged dome.\n\nBoth times the dome was charged the same way. The only difference: whether the volunteer's body had a path to the Earth."
    },
    {
      id: "w34am-img-vdg-grounding",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/grounding-vdg-floor-vs-crate.jpg",
      caption: "Same dome, same touch — but the floor (Panel A) gives electrons a path to Earth, and the milk crate (Panel B, a dielectric) breaks that path. With nowhere to go, charge piles up on the volunteer.",
      alt: "Two side-by-side panels. Panel A 'On the floor': a student touches a Van de Graaff dome while standing on the floor; their hair lies flat; a curved blue arrow with electron labels (e−) traces a path from their hand on the dome down through their body to the floor, with a label 'electrons flow to Earth'. Panel B 'On a crate': the same student touches the same dome while standing on a black milk crate labeled 'milk crate · dielectric'; their hair sticks straight out in all directions; minus signs are scattered across their body; a dashed red X is drawn across the crate; label reads 'no path to ground · charge builds up'."
    },
    {
      id: "w34am-q-grounding-floor",
      type: "question",
      questionType: "short_answer",
      prompt: "**Standing on the floor** — what did you observe? Did the volunteer's hair stand up? Why or why not? Use the atomic model.",
      placeholder: "Standing on the floor, the volunteer's hair ___ because the extra electrons from the dome ___ through their body and into the floor, which connects to ___. The volunteer never built up a net charge because ___.",
      difficulty: "analyze"
    },
    {
      id: "w34am-q-grounding-crate",
      type: "question",
      questionType: "short_answer",
      prompt: "**Standing on the crate** — what did you observe? Why did the crate change the result? Reference what crates are made of.",
      placeholder: "Standing on the crate, the volunteer's hair ___ because the crate is a ___, which means ___. With no path to the Earth, the extra electrons ___ on the volunteer, so their hair strands ___ each other.",
      difficulty: "analyze"
    },
    {
      id: "w34am-q-grounding-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why do the **crates matter** for the Van de Graaff demo?",
      options: [
        "Crates are taller, so the volunteer is closer to the ceiling and farther from the dome.",
        "Crates are conductors that make the charge flow faster onto the volunteer.",
        "Crates physically protect the volunteer from getting shocked by the generator.",
        "Crates are made of dielectric (plastic) — there are no free electrons inside, so charge can't flow through them. The volunteer is electrically isolated from the Earth, so charge builds up on them instead of draining away."
      ],
      correctIndex: 3,
      explanation: "Crates are dielectric. From fact #4 on the reference card: dielectrics can't hold free electrons — every electron stays bound to its atom. So no current can flow through the crate. With the path to ground broken, electrons piling up on the volunteer have nowhere to go. They spread out across the volunteer (including each individual hair), and like charges repel — hair strands push away from each other.",
      difficulty: "analyze"
    },
    {
      id: "w34am-callout-grounding-defn",
      type: "callout",
      style: "insight",
      icon: "📘",
      content: "**Grounding** = providing a conducting path from a charged object to the Earth, so electrons can flow into or out of the object until it returns to neutral. **Your finger touching the metal ball of an electroscope grounds it through your body**, exactly the same way the floor grounded the volunteer at the Van de Graaff. The crate broke the path; your shoes-on-the-classroom-floor do *not* break it well enough — your body is grounded right now."
    },

    {
      id: "w34am-sec-reference",
      type: "section_header",
      icon: "📘",
      title: "Reference — Things We Already Know",
      subtitle: "Use these for every level"
    },
    {
      id: "w34am-text-reference",
      type: "text",
      content: "Every explanation today must be grounded in these five facts. If your charge diagram contradicts one of these, it's wrong.\n\n1. **Protons (+) and neutrons (0) make up the nucleus.** Electrons (−) live in the cloud outside the nucleus.\n2. **In solids, nuclei only vibrate.** Electrons can be passed from solid to solid because they're less massive and live on the outside.\n3. **Rubbing a gray PVC pipe with fur** results in **−ions on the pipe** and **+ions on the fur**.\n4. **Neutral dielectrics** are made only of atoms. Dielectrics *cannot* hold free electrons — every electron stays bound to its atom.\n5. **Neutral conductors** are made of atoms *and* +ions. Conductors *can* hold **free electrons** that move around the whole object."
    },

    {
      id: "w34am-sec-l1",
      type: "section_header",
      icon: "1️⃣",
      title: "Level 1 — Conduction (No Grounding)",
      subtitle: "~6 min"
    },
    {
      id: "w34am-text-l1-recreate",
      type: "text",
      content: "**How to recreate the phenomenon:**\n\n1. Rub a **gray PVC pipe** with fur.\n2. Rub the **metal ball** on top of the electroscope with the gray pipe.\n3. Pull the pipe away. Observe the leaves.\n\nRepeat until you can reliably make the leaves do their thing."
    },
    {
      id: "w34am-img-l1-setup",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/task14-level1-setup.jpg?v=2",
      caption: "Level 1 setup. Rub the gray PVC pipe with fur, then rub it directly against the metal ball. *What will the leaves do?*",
      alt: "Educational illustration showing a hand holding a gray PVC pipe rubbing directly against the metal ball on top of an electroscope. The leaves area inside the glass envelope is obscured by a translucent gray cloud with a question mark, labeled 'leaves · what will they do?' A piece of fur lies on the desk."
    },
    {
      id: "w34am-q-l1-observe",
      type: "question",
      questionType: "short_answer",
      prompt: "**What did the leaves do** when the charged pipe was rubbed against the metal ball and then removed? Did the leaves stay that way, or did they reset?",
      placeholder: "When the pipe was rubbed against the ball, the leaves ___. After the pipe was removed, the leaves ___.",
      difficulty: "remember"
    },
    {
      id: "w34am-q-l1-explain",
      type: "question",
      questionType: "short_answer",
      prompt: "**Explain Level 1 using the atomic model.** Where did extra electrons come from, where did they end up, and why are the leaves doing what they're doing? Reference free electrons and the conductor explicitly.",
      placeholder: "The PVC pipe was rubbed with fur, so the pipe has ___. When the pipe touched the metal ball, electrons moved from ___ to ___. Because the electroscope is a conductor, the extra electrons spread out across ___, including the leaves. The leaves are spread because ___.",
      difficulty: "create"
    },
    {
      id: "w34am-q-l1-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is the **net charge** of the electroscope at the end of Level 1?",
      options: [
        "Negative — same sign as the pipe.",
        "Positive — opposite sign of the pipe.",
        "Neutral — touching it discharged it.",
        "It depends on how long you rub."
      ],
      correctIndex: 0,
      explanation: "Charging by conduction transfers some of the pipe's extra electrons directly onto the conductor. The electroscope ends with the **same sign** as the pipe (negative).",
      difficulty: "apply"
    },

    {
      id: "w34am-sec-l2",
      type: "section_header",
      icon: "2️⃣",
      title: "Level 2 — Conduction, Then Ground",
      subtitle: "~6 min"
    },
    {
      id: "w34am-text-l2-recreate",
      type: "text",
      content: "**How to recreate the phenomenon:**\n\n1. Rub a **gray PVC pipe** with fur.\n2. Rub the **metal ball** on the electroscope with the gray pipe.\n3. **Then, touch your finger to the metal ball.** Observe the leaves through every step."
    },
    {
      id: "w34am-img-l2-setup",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/task14-level2-setup.jpg?v=2",
      caption: "Level 2 setup. Same as Level 1, then touch the metal ball with your finger. *What do the leaves do at each step?*",
      alt: "Two-panel educational illustration. Panel A: hand rubs gray PVC pipe against the metal ball of an electroscope. Panel B: same electroscope, finger reaches from above to touch the metal ball; PVC set aside. Leaves area is obscured by a gray cloud with a question mark in both panels."
    },
    {
      id: "w34am-q-l2-observe",
      type: "question",
      questionType: "short_answer",
      prompt: "**Describe what the leaves did** at each step: (a) after rubbing the pipe on the ball, (b) the moment you touched the ball with your finger.",
      placeholder: "After rubbing the pipe on the ball, the leaves ___. The moment my finger touched the ball, the leaves ___.",
      difficulty: "remember"
    },
    {
      id: "w34am-q-l2-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why did your finger change what the leaves were doing?",
      options: [
        "Your finger pushed the leaves shut mechanically through the glass.",
        "Your body is a conductor connected to the Earth — the extra electrons on the electroscope flowed up through your finger to ground.",
        "Your finger neutralized the pipe.",
        "Your finger added new positive charge to the system."
      ],
      correctIndex: 1,
      explanation: "Your body is a path to ground. The extra electrons that conduction left on the electroscope flow up through you and away into the Earth. With the extra electrons gone, the electroscope returns to neutral and the leaves fall back together.",
      difficulty: "analyze"
    },
    {
      id: "w34am-q-l2-explain",
      type: "question",
      questionType: "short_answer",
      prompt: "**Explain Level 2 using the atomic model.** What was the electroscope's net charge after step 2? After step 3? Where did the extra electrons go?",
      placeholder: "After step 2 (rubbing), the electroscope had a net ___ charge because ___. After step 3 (finger touch), the electroscope was ___ because the extra electrons ___.",
      difficulty: "create"
    },

    {
      id: "w34am-sec-l3",
      type: "section_header",
      icon: "3️⃣",
      title: "Level 3 — No-Touch Approach",
      subtitle: "~7 min"
    },
    {
      id: "w34am-text-l3-recreate",
      type: "text",
      content: "**How to recreate the phenomenon — observe with your eyes AND your ears:**\n\n1. Rub a **gray PVC pipe** with fur.\n2. Bring the pipe **very close** to the metal ball — but **do not let them touch**.\n3. **Listen.** Once you hear something, bring the pipe back away from the electroscope.\n4. Repeat several times."
    },
    {
      id: "w34am-img-l3-setup",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/task14-level3-setup.jpg?v=2",
      caption: "Level 3 setup. Hold the rubbed pipe ~1–2 cm from the metal ball — never touching. Listen. *What do the leaves do? What's that sound?*",
      alt: "Educational illustration showing a hand holding a gray PVC pipe horizontally near but not touching the metal ball of an electroscope, with a 1-2 cm air gap labeled and an ear icon labeled 'listen'. The leaves area is obscured by a gray cloud with a question mark. Fur sits on the desk."
    },
    {
      id: "w34am-q-l3-observe",
      type: "question",
      questionType: "short_answer",
      prompt: "**What did you see and what did you hear?** Did the leaves move while the pipe approached? What about when the pipe pulled away? What was the sound?",
      placeholder: "As the pipe approached (no contact), the leaves ___. I heard ___. After the pipe pulled away, the leaves ___.",
      difficulty: "remember"
    },
    {
      id: "w34am-q-l3-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "While the charged pipe is held close to the metal ball (no contact), the leaves spread apart. Why?",
      options: [
        "Electrons jumped from the pipe across the air gap onto the ball.",
        "The atoms inside the conductor heated up.",
        "Free electrons in the conductor were repelled by the pipe and moved down to the leaves, leaving the metal ball with extra +ions.",
        "The pipe pulled the leaves apart through the glass."
      ],
      correctIndex: 2,
      explanation: "The pipe's negative charge repels the conductor's free electrons. They flow down through the stem to the leaves. Both leaves end up with extra electrons (negative) and repel each other. This is **polarization** of a conductor — no charge has been transferred.",
      difficulty: "analyze"
    },
    {
      id: "w34am-q-l3-sound",
      type: "question",
      questionType: "short_answer",
      prompt: "**What was the sound you heard?** Use the atomic model to explain it. (Hint: the air between the pipe and the ball isn't a perfect insulator.)",
      placeholder: "The sound was caused by ___ jumping across the air gap from ___ to ___. This happens because the difference in charge between the pipe and ___ got large enough to ___.",
      difficulty: "create"
    },

    {
      id: "w34am-sec-l4",
      type: "section_header",
      icon: "4️⃣",
      title: "Level 4 — Reset & Approach",
      subtitle: "~8 min"
    },
    {
      id: "w34am-callout-l4-reset",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Before you start Level 4: touch the metal ball with your finger.** This grounds the electroscope so you start from neutral. If you don't reset, leftover charge from earlier levels will mess up your observations."
    },
    {
      id: "w34am-text-l4-recreate",
      type: "text",
      content: "**How to recreate the phenomenon:**\n\n1. (Reset done — finger touched the ball.)\n2. Rub a **gray PVC pipe** with fur.\n3. Bring the pipe **toward the top of the electroscope** — slowly — until you **observe something**.\n4. **Do not let the pipe touch.** Hold it close.\n5. Now **move the pipe away** from the electroscope. **Observe a second change.**"
    },
    {
      id: "w34am-img-l4-setup",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/task14-level4-setup.jpg?v=2",
      caption: "Level 4 setup. Reset first (finger tap), then approach with the rubbed pipe — ~2–3 cm away — without ever touching. *Two changes will happen — which, when, why?*",
      alt: "Two-panel educational illustration. Panel A: finger touches the metal ball of an electroscope, labeled 'reset before starting'. Panel B: hand holds a gray PVC pipe horizontally near the metal ball with a 2-3 cm gap labeled and 'do not touch' note. The leaves area is obscured by a gray cloud with a question mark in both panels. Fur on desk."
    },
    {
      id: "w34am-q-l4-observe",
      type: "question",
      questionType: "short_answer",
      prompt: "**Describe both changes.** What did the leaves do as the pipe approached (no contact)? What did the leaves do when the pipe was pulled away?",
      placeholder: "As the pipe approached, the leaves ___. As the pipe was pulled away, the leaves ___.",
      difficulty: "remember"
    },
    {
      id: "w34am-q-l4-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is the **net charge** of the electroscope after the pipe is fully removed in Level 4?",
      options: [
        "Negative — same sign as the pipe.",
        "Positive — opposite sign of the pipe.",
        "It keeps changing back and forth forever.",
        "Neutral — exactly the same as it started."
      ],
      correctIndex: 3,
      explanation: "The pipe never touched the electroscope, and you never grounded it while the pipe was nearby. Free electrons just shifted around inside the conductor (polarization). When the pipe leaves, the electrons spread back out evenly — the electroscope is neutral again.",
      difficulty: "analyze"
    },
    {
      id: "w34am-q-l4-explain",
      type: "question",
      questionType: "short_answer",
      prompt: "**Explain Level 4 using the atomic model.** Why did the leaves spread when the pipe was close? Why did they collapse again when the pipe was removed? Why is the *final* state neutral even though the leaves spread in the middle?",
      placeholder: "When the pipe was close, the free electrons in the conductor ___, leaving the ball ___ and the leaves ___. When the pipe was removed, the free electrons ___ because ___. The final state is neutral because ___.",
      difficulty: "create"
    },

    {
      id: "w34am-sec-final",
      type: "section_header",
      icon: "🏁",
      title: "Final Level — The Balloon Boss",
      subtitle: "~8 min"
    },
    {
      id: "w34am-callout-final-reset",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Before you start: touch the metal ball with your finger** to reset the electroscope to neutral. Then read the full procedure carefully — the order of every step matters."
    },
    {
      id: "w34am-text-final-recreate",
      type: "text",
      content: "**How to recreate the phenomenon — this one takes some agility, so don't get frustrated if it takes several tries:**\n\n1. (Reset done — electroscope is neutral.)\n2. Rub a **balloon** with fur.\n3. Bring the balloon close to the **bottom** of the electroscope. *This requires someone to hold the glass part of the electroscope about a foot or so above the desk.*\n4. While the balloon is nearby, **quickly tap the metal ball at the top with your hand.**\n5. Move the balloon away from the electroscope. **Observe.**"
    },
    {
      id: "w34am-img-final-setup",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/electrostatics/final-level-setup.jpg?v=3",
      caption: "Final Level geometry. One person holds the glass envelope ~1 ft above the desk, a second holds the rubbed balloon close to the bottom, and a third taps the metal ball at the top while the balloon is still near. *What do the leaves do at each step?*",
      alt: "Educational illustration of the Final Level setup. An electroscope is held in mid-air about a foot above a wooden desk by a hand gripping the glass envelope from the side. Below, a second hand holds a plain red latex balloon close to the bottom of the glass envelope. A third hand reaches down from above to tap the metal ball at the top. The leaves area inside the glass is obscured by a gray cloud with a question mark."
    },
    {
      id: "w34am-q-final-observe",
      type: "question",
      questionType: "short_answer",
      prompt: "**Describe what the leaves did at each step:** (a) when the balloon came near the bottom, (b) when you tapped the ball, (c) when the balloon was removed.",
      placeholder: "(a) When the balloon came near the bottom, the leaves ___. (b) When I tapped the ball, the leaves ___. (c) When the balloon was removed, the leaves ___.",
      difficulty: "remember"
    },
    {
      id: "w34am-q-final-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is the **net charge** of the electroscope after the balloon is removed?",
      options: [
        "Negative — same sign as the balloon.",
        "Positive — opposite sign of the balloon.",
        "Neutral — same as it started.",
        "Half negative on top, half positive on bottom."
      ],
      correctIndex: 1,
      explanation: "The balloon is **negative** (rubber gets electrons from fur). When held near the bottom, it repels free electrons in the conductor *upward* — toward the metal ball, which became negative. Tapping the ball with your hand grounded those extra electrons away. When the balloon was removed, the electroscope was left missing electrons — net **positive**, opposite the balloon. This is charging by **induction**.",
      difficulty: "analyze"
    },
    {
      id: "w34am-q-final-explain",
      type: "question",
      questionType: "short_answer",
      prompt: "**Explain the Final Level using the atomic model.** Track every electron: where did the free electrons move when the balloon came near? Where did they go when you tapped the ball? Why is the final electroscope charge the *opposite* of the balloon?",
      placeholder: "Step 3 (balloon at bottom): the balloon repelled free electrons in the conductor ___, so the metal ball had extra ___ and the bottom had ___. Step 4 (tap the ball): the extra electrons at the top flowed ___. Step 5 (balloon away): with no extra electrons in the conductor, the +ions ___, so the electroscope's net charge is ___.",
      difficulty: "create"
    },
    {
      id: "w34am-q-final-mechanism",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which charging mechanism did the Final Level demonstrate?",
      options: [
        "Charging by induction (charged object never touches the thing being charged; grounding is what locks in the charge).",
        "Charging by friction (rubbing).",
        "Charging by conduction (direct contact between the charged object and the thing being charged).",
        "No charging happened — it was just polarization."
      ],
      correctIndex: 0,
      explanation: "The balloon never touched the electroscope. The grounding step (your hand tapping the ball) is what allowed electrons to leave permanently, locking in a net charge of the *opposite* sign. That's textbook **induction**.",
      difficulty: "analyze"
    },

    {
      id: "w34am-sec-evidence",
      type: "section_header",
      icon: "📷",
      title: "Submit Your Work",
      subtitle: "~2 min"
    },
    {
      id: "w34am-evidence-diagrams",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — All 5 Levels",
      instructions: "Photo of your group whiteboard showing a charge diagram for each level (1, 2, 3, 4, Final). Each diagram should show the relevant states (before / during / after) with free electrons, +ions, atoms, and electron-flow arrows clearly labeled. Annotate which mechanism each level demonstrated: conduction, polarization-only, or induction.",
      reflectionPrompt: "One sentence: which level was the hardest to explain, and what specifically about the atomic model helped you crack it?"
    },

    {
      id: "w34am-callout-bridge",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "**Coming up:** Magnetism. The atomic model you just used to explain every electroscope phenomenon? It's about to come back, because magnetism also lives at the atomic level — but with a twist."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w34-applying-atomic-model", lesson);
    console.log("✅ Lesson seeded: Applying the Atomic Model — The Levels Challenge (Mon 5/4)");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
