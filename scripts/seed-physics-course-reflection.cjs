// Seed: Physics course-reflection lesson (course-reflection-synthesis)
// Cloned in structure from the AI Literacy reflection lesson, Physics content.
// SAFETY: aborts if the lesson already exists. Only .set() when absent.

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(
    require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json")
  ),
});

const db = admin.firestore();

const COURSE_ID = "physics";
const LESSON_ID = "course-reflection-synthesis";

const blocks = [
  // 0. section_header — Before We Begin / Then
  {
    type: "section_header",
    id: "ph-sh1",
    label: "Before We Begin",
    title: "Then",
  },
  // (image block intentionally OMITTED — a later pass adds one)
  // 2. objectives
  {
    type: "objectives",
    id: "obj-1",
    items: [
      "Reflect honestly on how your understanding of physics has changed",
      "Identify the most important things you learned and why they matter",
      "Articulate what you'll carry forward from this course",
    ],
  },
  // 3. text — intro
  {
    type: "text",
    id: "ph-t1",
    content:
      "This is the last lesson of the course. No new content. No new concepts to learn.\n\nThis is for you to stop, look back, and think about what actually happened here — because reflection is how learning becomes permanent.",
  },
  // 4. callout — Remember the very first lesson? (Scientific Process / measurement + graphs)
  {
    type: "callout",
    icon: "📏",
    style: "definition",
    content:
      "**Remember the very first unit? It was the Scientific Process** — measurement, units, significant figures, and building an argument from evidence (Claim, Evidence, Reasoning). We spent those first weeks fussing over how to read an instrument, why $3.0$ and $3.00$ aren't the same number, and how to turn a messy set of data points into a graph that actually means something. Some of you thought physics was going to be plugging numbers into formulas. Some of you thought it was all equations and no real-world. That was the start of the year. You're in a different place now — and the point of this lesson is to notice *how* you got here.",
  },
  // 5. callout — How to reflect well (course-agnostic, near-verbatim)
  {
    type: "callout",
    icon: "🧭",
    style: "tip",
    content:
      '**How to reflect well (not just write feelings):** Good reflection is specific. Don\'t say "I learned a lot about physics." Say "I used to think a moving object needed a constant push to keep moving, and now I understand that without a net force it just keeps going — that\'s Newton\'s 1st law." The difference between vague reflection and real reflection is one word: **specifically**. Every time you catch yourself being vague, ask yourself — *specifically what?*',
  },
  // 6. section_header — Part 1: Then and Now / What Shifted
  {
    type: "section_header",
    id: "ph-sh2",
    label: "Part 1: Then and Now",
    title: "What Shifted",
  },
  // 7. short_answer
  {
    type: "question",
    id: "ph-q1",
    questionType: "short_answer",
    content:
      "Think back to the very first weeks of this course. What did you think physics was? What did you think it could and couldn't explain? Be honest about your starting point.",
    prompt:
      "Think back to the very first weeks of this course. What did you think physics was? What did you think it could and couldn't explain? Be honest about your starting point.",
  },
  // 8. short_answer
  {
    type: "question",
    id: "ph-q2",
    questionType: "short_answer",
    content:
      "What is the single biggest thing that changed in how you think about the physical world? What specifically caused that shift — a lab, a demo, a problem that finally clicked?",
    prompt:
      "What is the single biggest thing that changed in how you think about the physical world? What specifically caused that shift — a lab, a demo, a problem that finally clicked?",
  },
  // 9. short_answer
  {
    type: "question",
    id: "ph-q3",
    questionType: "short_answer",
    content:
      "What is one thing you believed about how motion, forces, or energy worked at the start of this course that you now think was wrong or incomplete?",
    prompt:
      "What is one thing you believed about how motion, forces, or energy worked at the start of this course that you now think was wrong or incomplete?",
  },
  // 10. section_header — Part 2: What Stuck / The Whole Course
  {
    type: "section_header",
    id: "ph-sh3",
    label: "Part 2: What Stuck",
    title: "The Whole Course",
  },
  // 11. callout — the whole course in one sentence each
  {
    type: "callout",
    icon: "🗺️",
    style: "insight",
    content:
      "**The whole course in one sentence each:**\n\n- **Scientific Process:** Physics is built on careful measurement and evidence — a claim only counts if the data and reasoning back it up.\n- **Motion in 1D:** Position, velocity, and acceleration are different things, and a graph's slope and shape tell you which is which.\n- **Motion in 2D:** Vectors have direction, and projectile motion is just horizontal and vertical motion happening at the same time, independently.\n- **Forces & Newton's Laws:** A net force changes motion, and $F = ma$ ties force, mass, and acceleration together — no net force means no change.\n- **Momentum & Collisions:** Momentum $p = mv$ is conserved in a collision, and both objects feel equal and opposite forces.\n- **Energy:** Energy $\\left(KE = \\frac{1}{2}mv^2\\right)$ is conserved — it transforms between forms but never just disappears.\n- **Electrostatics:** Charge is real and physical — objects gain or lose electrons, and conductors and dielectrics behave very differently.\n- **Circuits:** Voltage, current, and resistance are related, and series vs. parallel wiring changes how a circuit behaves.\n- **Magnetism:** Moving charges make magnetic fields, and electricity and magnetism are two sides of the same thing.\n\nNone of these are finished. They're just the framework you have now.",
  },
  // 12. short_answer
  {
    type: "question",
    id: "ph-q4",
    questionType: "short_answer",
    content:
      "We covered a lot: measurement, motion, forces, momentum, energy, electrostatics, circuits, and magnetism. What was the most important thing you learned? Why that one?",
    prompt:
      "We covered a lot: measurement, motion, forces, momentum, energy, electrostatics, circuits, and magnetism. What was the most important thing you learned? Why that one?",
  },
  // 13. short_answer
  {
    type: "question",
    id: "ph-q5",
    questionType: "short_answer",
    content:
      "What's one concept from this course that you've already noticed in your real life — a car braking, a phone charging, a ball you threw — or that you've thought about outside of class?",
    prompt:
      "What's one concept from this course that you've already noticed in your real life — a car braking, a phone charging, a ball you threw — or that you've thought about outside of class?",
  },
  // 14. short_answer
  {
    type: "question",
    id: "ph-q6",
    questionType: "short_answer",
    content:
      "What is one question about the physical world that this course raised for you that you still don't have a good answer to? What would you need to learn or experiment with to start answering it?",
    prompt:
      "What is one question about the physical world that this course raised for you that you still don't have a good answer to? What would you need to learn or experiment with to start answering it?",
  },
  // 15. section_header — Part 3: Going Forward / Going Forward
  {
    type: "section_header",
    id: "ph-sh4",
    label: "Part 3: Going Forward",
    title: "Going Forward",
  },
  // 16. callout — what you're leaving with
  {
    type: "callout",
    icon: "🎓",
    style: "success",
    content:
      "**What you're leaving with that most people don't have:** You can look at a moving object and reason about the forces on it. You know that energy is conserved and can track where it goes. You can read a motion graph, draw a free-body diagram, and tell the difference between a measurement and a guess. You've wired a circuit and charged an electroscope with your own hands. That's not nothing. Most adults can't draw a free-body diagram or explain why a heavier object doesn't fall faster. Walk out of here confident that you actually understand how the physical world works.",
  },
  // 17. callout — the one thing Mr. McCarthy wants you to take
  {
    type: "callout",
    icon: "💬",
    style: "tip",
    content:
      "**The one thing I (Mr. McCarthy) want you to take with you:** Don't be the person who just memorizes a formula. Don't be the person who says \"I'm not a math person\" and stops thinking. Be the person who asks *why* — why does it fall, why does it stop, where did the energy go — and knows how to chase the answer with evidence. That's the whole game. The specific equations will fade if you don't use them. The habit of reasoning from evidence won't.",
  },
  // 18. callout — A Note
  {
    type: "callout",
    id: "ph-co-note",
    content:
      '**A Note:** You\'re leaving this class with something most people your age don\'t have — a real framework for understanding the physical world. Not just "physics is hard" or "physics is cool," but an actual ability to observe, measure, model, and explain what\'s happening around you. That\'s not nothing. That\'s genuinely rare.',
  },
  // 19. short_answer — one year from now / next science course
  {
    type: "question",
    id: "ph-q7",
    questionType: "short_answer",
    content:
      "In your next science course — or just one year from now — how do you think the way you reason about problems will be different because of this class? What will you carry into chemistry, biology, or whatever comes next?",
    prompt:
      "In your next science course — or just one year from now — how do you think the way you reason about problems will be different because of this class? What will you carry into chemistry, biology, or whatever comes next?",
  },
  // 20. short_answer — advice to next year's student (NO "Last one:" prefix)
  {
    type: "question",
    id: "ph-q8",
    questionType: "short_answer",
    content:
      "What advice would you give to a student who's about to start Physics next year? What should they know going in?",
    prompt:
      "What advice would you give to a student who's about to start Physics next year? What should they know going in?",
  },
  // 21. short_answer — THE COURSE-IMPROVEMENT QUESTION (exact text)
  {
    type: "question",
    id: "ph-q9",
    questionType: "short_answer",
    content:
      "One last reflection — and this one actually shapes the class. If you were in charge, what is **one thing you would change about this course** to make it better for next year's students? It could be a topic, a lab, the pace, the tools, or how something was taught. Be specific, and explain *why* that change would help. Honest, constructive answers genuinely influence how this course gets taught — so tell me the truth.",
    prompt:
      "One last reflection — and this one actually shapes the class. If you were in charge, what is **one thing you would change about this course** to make it better for next year's students? It could be a topic, a lab, the pace, the tools, or how something was taught. Be specific, and explain *why* that change would help. Honest, constructive answers genuinely influence how this course gets taught — so tell me the truth.",
  },
  // 22. sorting — Old Me vs. Now Me
  {
    type: "sorting",
    icon: "🔄",
    title: "Old Me vs. Now Me",
    instructions:
      "Below are statements about physics. Decide which ones a student might have said at the **start** of the course and which ones they should be able to say **now**.",
    leftLabel: "Start-of-Course Me",
    rightLabel: "End-of-Course Me",
    items: [
      { text: "Heavier objects fall faster than light ones.", correct: "left" },
      {
        text: "In free fall, all objects accelerate at the same rate regardless of mass.",
        correct: "right",
      },
      {
        text: "If something's moving, there must be a force pushing it.",
        correct: "left",
      },
      {
        text: "An object in motion stays in motion unless a net force acts on it (Newton's 1st law).",
        correct: "right",
      },
      {
        text: "Energy gets used up and just disappears once it's spent.",
        correct: "left",
      },
      {
        text: "Energy is conserved — it transforms between forms, never vanishes.",
        correct: "right",
      },
      {
        text: "In a crash, the bigger truck just hits harder and feels less.",
        correct: "left",
      },
      {
        text: "Momentum is conserved in a collision; both objects feel equal and opposite forces (Newton's 3rd law).",
        correct: "right",
      },
    ],
    id: "ph-sort1",
  },
  // 23. vocab_list — 6 terms (one swapped to "Model" in the physics sense)
  {
    type: "vocab_list",
    id: "ph-vocab1",
    terms: [
      {
        term: "Synthesis",
        definition:
          "Pulling separate pieces together into one bigger understanding. The opposite of memorizing formulas — it's connecting them.",
      },
      {
        term: "Metacognition",
        definition:
          "Thinking about your own thinking. Noticing what you believed, what changed, and how. The core move of real reflection.",
      },
      {
        term: "Model",
        definition:
          "A simplified picture of reality that you can reason with — a free-body diagram, a motion graph, an energy bar chart. Physics is the practice of building models good enough to predict what happens next.",
      },
      {
        term: "Framework",
        definition:
          "A way of organizing how you think about a topic. This course gave you one for the physical world — units, concepts, equations, questions — that you'll keep using long after the class ends.",
      },
      {
        term: "Transfer",
        definition:
          "Taking what you learned in one place (this class) and using it somewhere completely different (a chemistry lab, a car crash report, a conversation about energy). The real test of whether learning stuck.",
      },
      {
        term: "Lifelong learner",
        definition:
          "Someone who keeps updating what they know — because science, like most fields, will keep changing long after you leave any classroom.",
      },
    ],
  },
];

const lessonDoc = {
  id: LESSON_ID,
  title: "Where You Started, Where You Are: Course Reflection",
  unit: "Course Reflection",
  visible: false,
  order: 9999,
  blocks,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

(async () => {
  const ref = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc(LESSON_ID);

  const snap = await ref.get();
  if (snap.exists) {
    console.log(
      `ABORT: lesson exists (courses/${COURSE_ID}/lessons/${LESSON_ID}). No write performed.`
    );
    process.exit(0);
  }

  await ref.set(lessonDoc);
  console.log(
    `Seeded courses/${COURSE_ID}/lessons/${LESSON_ID} (${blocks.length} blocks, visible:false).`
  );
  process.exit(0);
})();
