// Seed: Digital Literacy — Course Reflection (cloned in structure from the AI Literacy reflection lesson)
// Course: digital-literacy   Lesson: course-reflection-synthesis
// SAFETY: aborts without writing if the lesson already exists. Never clobbers.
//
// DO NOT modify block IDs of an existing lesson. This script only .set()s a brand-new doc.

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(
    require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json")
  ),
});

const db = admin.firestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "course-reflection-synthesis";

const blocks = [
  // 0. section_header — Before We Begin / Then
  {
    type: "section_header",
    id: "dl-sh-warmup",
    label: "Before We Begin",
    title: "Then",
  },

  // 1. image — OMITTED intentionally (no image; avoids broken URLs — a later pass adds one)

  // 2. objectives (3 items)
  {
    type: "objectives",
    id: "obj-1",
    items: [
      "Reflect honestly on how your understanding of the digital world has changed",
      "Identify the most important things you learned and why they matter",
      "Articulate what you'll carry forward from this course",
    ],
  },

  // 3. text — last lesson intro
  {
    type: "text",
    id: "dl-txt1",
    content:
      "This is the last lesson of the course. No new content. No new concepts to learn.\n\nThis is for you to stop, look back, and think about what actually happened here — because reflection is how learning becomes permanent.",
  },

  // 4. callout — "Remember the very first lesson?" — anchors on WeVideo / "AI Is Everywhere"
  {
    type: "callout",
    icon: "🎬",
    style: "definition",
    content:
      "**Remember the very first thing you did? You opened WeVideo and started telling a story.** The course kicked off with *AI Is Everywhere* — you weren't writing essays about technology, you were *making* something with it: a video, edited and produced by you. Some of you had never touched a real editor before. Some of you thought you already knew it all. Either way, that first project set the tone for the whole year — you weren't here to consume the digital world, you were here to **build** in it. That was the start. You're in a different place now — and the point of this lesson is to notice *how* you got here.",
  },

  // 5. callout — "How to reflect well" — reused nearly verbatim (course-agnostic)
  {
    type: "callout",
    icon: "🧭",
    style: "tip",
    content:
      "**How to reflect well (not just write feelings):** Good reflection is specific. Don't say \"I learned a lot about technology.\" Say \"I used to think going viral was random luck, and now I think it's engineered — platforms reward certain patterns on purpose.\" The difference between vague reflection and real reflection is one word: **specifically**. Every time you catch yourself being vague, ask yourself — *specifically what?*",
  },

  // 6. section_header — Part 1: Then and Now / What Shifted
  {
    type: "section_header",
    id: "dl-sh-part1",
    label: "Part 1: Then and Now",
    title: "What Shifted",
  },

  // 7. short_answer
  {
    type: "question",
    id: "dl-q1",
    questionType: "short_answer",
    content:
      "Think back to the very first week of this course. What did you think \"digital literacy\" was going to be about? What did you think you already knew about being online, making content, or how the internet works?",
    prompt:
      "Think back to the very first week of this course. What did you think \"digital literacy\" was going to be about? What did you think you already knew about being online, making content, or how the internet works?",
  },

  // 8. short_answer
  {
    type: "question",
    id: "dl-q2",
    questionType: "short_answer",
    content:
      "What is the single biggest thing that changed in how you think about the digital world — your data, algorithms, content, or your own online presence? What specifically caused that shift?",
    prompt:
      "What is the single biggest thing that changed in how you think about the digital world — your data, algorithms, content, or your own online presence? What specifically caused that shift?",
  },

  // 9. short_answer
  {
    type: "question",
    id: "dl-q3",
    questionType: "short_answer",
    content:
      "What is one thing you believed at the start of this course — about privacy, viral content, charts and data, or making things online — that you now think was wrong or incomplete?",
    prompt:
      "What is one thing you believed at the start of this course — about privacy, viral content, charts and data, or making things online — that you now think was wrong or incomplete?",
  },

  // 10. section_header — Part 2: What Stuck / The Whole Course
  {
    type: "section_header",
    id: "dl-sh-part2",
    label: "Part 2: What Stuck",
    title: "The Whole Course",
  },

  // 11. callout — unit summary (one sentence each)
  {
    type: "callout",
    icon: "🗺️",
    style: "insight",
    content:
      "**The whole course in one sentence each:**\n\n- **AI Is Everywhere (WeVideo):** You don't just watch media — you can produce it, and the tools to tell a real story are already in your hands.\n- **Prompt Engineering:** How you ask shapes what you get — clear, specific instructions beat vague ones every time.\n- **Gaming & Esports:** There's a real industry, economy, and skillset behind play — not just a pastime.\n- **Data Literacy:** Numbers and charts can mislead through scale, axis, and framing — read them like a skeptic.\n- **Digital Footprint:** What you post is permanent, searchable, and monetized — your online self is a record, not a moment.\n- **The Algorithm Economy:** Recommendation feeds optimize for *attention*, not truth or quality — and that shapes what you see.\n- **Digital Entrepreneurship:** Value comes from solving a real problem for a real audience — niche, brand, and offer all matter.\n- **Creative Sprints (Infographic → Photo Essay → Short-Form Video → PSA):** You can design, shoot, edit, and persuade — across four very different formats.\n- **Portfolio Capstone:** A body of work tells a story about you that a single post never could.\n\nNone of these are finished. They're just the framework you have now.",
  },

  // 12. short_answer
  {
    type: "question",
    id: "dl-q4",
    questionType: "short_answer",
    content:
      "We covered a lot: video, prompting, gaming, data, your footprint, algorithms, entrepreneurship, and four creative sprints. What was the most important thing you learned? Why that one?",
    prompt:
      "We covered a lot: video, prompting, gaming, data, your footprint, algorithms, entrepreneurship, and four creative sprints. What was the most important thing you learned? Why that one?",
  },

  // 13. short_answer
  {
    type: "question",
    id: "dl-q5",
    questionType: "short_answer",
    content:
      "What's one lesson or skill from this course that you've already used in your real life — or that you've thought about outside of school (scrolling a feed, posting something, checking a chart, making a video)?",
    prompt:
      "What's one lesson or skill from this course that you've already used in your real life — or that you've thought about outside of school (scrolling a feed, posting something, checking a chart, making a video)?",
  },

  // 14. short_answer
  {
    type: "question",
    id: "dl-q6",
    questionType: "short_answer",
    content:
      "What is one question about the digital world that this course raised for you that you still don't have a good answer to? What would you need to learn or experience to start answering it?",
    prompt:
      "What is one question about the digital world that this course raised for you that you still don't have a good answer to? What would you need to learn or experience to start answering it?",
  },

  // 15. section_header — Part 3: Going Forward / Going Forward
  {
    type: "section_header",
    id: "dl-sh-part3",
    label: "Part 3: Going Forward",
    title: "Going Forward",
  },

  // 16. callout — what you're leaving with
  {
    type: "callout",
    icon: "🎓",
    style: "success",
    content:
      "**What you're leaving with that most people don't have:** You can spot a misleading chart. You know your feed is engineered to hold your attention, not to tell you the truth. You understand that your digital footprint is permanent and worth money to someone. And you can actually *make* things — a video, an infographic, a photo essay, a PSA — not just consume them. That's not nothing. Most adults scrolling next to you on the bus have none of that. Walk out of here knowing you can both read the digital world *and* build in it.",
  },

  // 17. callout — Mr. McCarthy's one thing
  {
    type: "callout",
    icon: "💬",
    style: "tip",
    content:
      "**The one thing I (Mr. McCarthy) want you to take with you:** Don't be the person the algorithm farms. Don't be the person who believes every chart and every viral post. Be the person who asks *who made this, and what do they want from me?* — and who knows enough to build something better. That's the whole game. The apps, the trends, the platforms are going to change faster than any textbook. Good questions don't go out of date.",
  },

  // 18. callout — A Note
  {
    type: "callout",
    id: "dl-co-note",
    content:
      "**A Note:** You're leaving this class with something most people your age don't have — a real framework for living and creating online. Not just \"the internet is fun\" or \"the internet is dangerous,\" but an actual ability to analyze a feed, question a chart, protect your footprint, and produce real work. That's not nothing. That's genuinely rare.",
  },

  // 19. short_answer — one-year-forward prediction
  {
    type: "question",
    id: "dl-q7",
    questionType: "short_answer",
    content:
      "In one year, how do you think the apps, feeds, and tools you use every day will have changed? What will be different about how you spend time online, how you make things, or what you share?",
    prompt:
      "In one year, how do you think the apps, feeds, and tools you use every day will have changed? What will be different about how you spend time online, how you make things, or what you share?",
  },

  // 20. short_answer — advice to next year's student (no "Last one:" prefix)
  {
    type: "question",
    id: "dl-q8",
    questionType: "short_answer",
    content:
      "What advice would you give to a student who's about to start this course next year? What should they know going in?",
    prompt:
      "What advice would you give to a student who's about to start this course next year? What should they know going in?",
  },

  // 21. short_answer — THE course-improvement question (exact text), placed LAST before sorting
  {
    type: "question",
    id: "dl-q9",
    questionType: "short_answer",
    content:
      "One last reflection — and this one actually shapes the class. If you were in charge, what is **one thing you would change about this course** to make it better for next year's students? It could be a topic, an activity, the pace, the tools, or how something was taught. Be specific, and explain *why* that change would help. Honest, constructive answers genuinely influence how this course gets taught — so tell me the truth.",
    prompt:
      "One last reflection — and this one actually shapes the class. If you were in charge, what is **one thing you would change about this course** to make it better for next year's students? It could be a topic, an activity, the pace, the tools, or how something was taught. Be specific, and explain *why* that change would help. Honest, constructive answers genuinely influence how this course gets taught — so tell me the truth.",
  },

  // 22. sorting — Old Me vs. Now Me (4 left / 4 right)
  {
    type: "sorting",
    icon: "🔄",
    title: "Old Me vs. Now Me",
    instructions:
      "Below are statements about the digital world. Based on what this course covered, decide which ones a student might have said at the **start** of the course and which ones they should be able to say **now**.",
    leftLabel: "Start-of-Course Me",
    rightLabel: "End-of-Course Me",
    items: [
      {
        text: "Whatever's trending is trending because it's the best, right?",
        correct: "left",
      },
      {
        text: "Algorithms optimize for attention and engagement — not quality. Trending means *sticky*, not *good*.",
        correct: "right",
      },
      {
        text: "My data online is basically private — it's just my stuff.",
        correct: "left",
      },
      {
        text: "My digital footprint is permanent, searchable, and monetized — somebody is making money from it.",
        correct: "right",
      },
      {
        text: "A chart is just data — a chart can't really lie.",
        correct: "left",
      },
      {
        text: "Charts mislead through axis, scale, and framing choices — read every chart like a skeptic.",
        correct: "right",
      },
      {
        text: "Going viral is just luck — it either happens or it doesn't.",
        correct: "left",
      },
      {
        text: "Virality is engineered — hooks, format, and timing are designed to game the feed.",
        correct: "right",
      },
    ],
    id: "dl-sort1",
  },

  // 23. vocab_list — 6 terms (course-agnostic, lightly adapted)
  {
    type: "vocab_list",
    id: "dl-vocab1",
    terms: [
      {
        term: "Synthesis",
        definition:
          "Pulling separate pieces together into one bigger understanding. The opposite of memorizing facts — it's connecting them.",
      },
      {
        term: "Metacognition",
        definition:
          "Thinking about your own thinking. Noticing what you believed, what changed, and how. The core move of real reflection.",
      },
      {
        term: "Growth",
        definition:
          "Not just 'learning more facts' but actually changing how you look at something. The moments when you catch yourself thinking differently than you used to.",
      },
      {
        term: "Framework",
        definition:
          "A way of organizing how you think about a topic. This course gave you one for the digital world — units, skills, vocabulary, questions — that you'll keep using long after the class ends.",
      },
      {
        term: "Transfer",
        definition:
          "Taking what you learned in one place (this class) and using it somewhere completely different (a job, a feed, a family conversation). The real test of whether learning stuck.",
      },
      {
        term: "Lifelong learner",
        definition:
          "Someone who keeps updating what they know — because the digital world, like most fields now, will keep changing long after you leave any classroom.",
      },
    ],
  },
];

async function main() {
  const ref = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc(LESSON_ID);

  const snap = await ref.get();
  if (snap.exists) {
    console.log("ABORT: lesson exists");
    process.exit(0);
    return;
  }

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

  await ref.set(lessonDoc);
  console.log(
    `Seeded ${COURSE_ID}/${LESSON_ID} — ${blocks.length} blocks (visible:false, no dueDate).`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
