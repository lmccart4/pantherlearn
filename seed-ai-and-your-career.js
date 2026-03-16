// seed-ai-and-your-career.js
// Lesson 25 — AI Ethics & Society unit
// NEW BUILD — AI's impact on jobs, careers, and students' futures.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "AI and Your Career",
  course: "AI Literacy",
  unit: "AI Ethics and Society",
  order: 27,
  visible: false,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify which types of tasks AI is likely to automate vs. which require human skills",
        "Analyze how specific careers are being transformed (not just eliminated) by AI",
        "Evaluate the difference between AI hype ('all jobs will disappear') and reality",
        "Develop a personal strategy for building AI-resilient skills"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "Remember the Demystifying AI article? It claimed that \"doctors, lawyers, teachers — they should all start looking for new careers.\"\n\nYou identified that as a misconception. But it raised a real question: **What IS AI actually doing to jobs and careers?**\n\nThe answer is more nuanced than \"AI will take your job\" or \"AI will never replace humans.\" Today we dig into what's really happening."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What career are you most interested in right now? (It's OK if you're not sure — just pick one that sounds appealing.)",
      placeholder: "I'm interested in..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 1 — TASKS, NOT JOBS
    // ═══════════════════════════════════════════════════════
    {
      id: "section-tasks",
      type: "section_header",
      title: "Part 1: AI Automates Tasks, Not Jobs",
      subtitle: "~10 minutes",
      icon: "📊"
    },
    {
      id: "tasks-intro",
      type: "text",
      content: "The most important reframing: **AI doesn't replace jobs. It replaces tasks within jobs.**\n\nEvery job is made up of dozens of individual tasks. Some of those tasks are routine and predictable — AI can handle those. Others require judgment, empathy, creativity, or physical dexterity — AI can't.\n\nThe question isn't \"Will AI take this job?\" It's \"Which tasks in this job will AI change?\""
    },
    {
      id: "tasks-example",
      type: "callout",
      icon: "👩‍⚕️",
      style: "scenario",
      content: "**Example: Doctor**\n\n**Tasks AI CAN do:**\n- Analyze medical images for patterns (X-rays, MRIs)\n- Search through research papers for relevant treatments\n- Draft initial patient summaries from intake forms\n- Flag potential drug interactions\n\n**Tasks AI CAN'T do:**\n- Build trust with a scared patient\n- Make judgment calls when the data is ambiguous\n- Explain a diagnosis with empathy and cultural sensitivity\n- Take ethical responsibility for treatment decisions\n\n**Result:** AI doesn't replace doctors. It changes what doctors spend their time on — less paperwork, more patient care."
    },
    {
      id: "tasks-sort",
      type: "sorting",
      title: "AI Can Handle It vs. Needs a Human",
      icon: "🔍",
      instructions: "Sort each task: can AI handle it well, or does it need a human?",
      leftLabel: "AI Can Handle ✓",
      rightLabel: "Needs a Human 👤",
      items: [
        { text: "Scheduling appointments based on availability", correct: "left" },
        { text: "Convincing an upset customer to stay loyal to a brand", correct: "right" },
        { text: "Translating a document from English to Spanish", correct: "left" },
        { text: "Deciding whether to expel a student for a complex behavioral situation", correct: "right" },
        { text: "Detecting fraud patterns in thousands of transactions", correct: "left" },
        { text: "Mentoring a new employee through their first week", correct: "right" },
        { text: "Generating a first draft of a quarterly report from data", correct: "left" },
        { text: "Negotiating a peace deal between two countries", correct: "right" }
      ]
    },

    // ═══════════════════════════════════════════════════════
    // PART 2 — CAREER EXPLORER
    // ═══════════════════════════════════════════════════════
    {
      id: "section-explorer",
      type: "section_header",
      title: "Part 2: Explore Your Career",
      subtitle: "~15 minutes",
      icon: "🔎"
    },
    {
      id: "explorer-intro",
      type: "text",
      content: "Now apply this thinking to a career YOU'RE interested in. Use the chatbot below to explore how AI is changing that field."
    },
    {
      id: "career-chatbot",
      type: "chatbot",
      title: "Career AI Advisor",
      icon: "💼",
      instructions: "Tell the chatbot a career you're interested in. It'll break down which tasks AI can handle, which still need humans, what new opportunities AI creates, and what skills you should build.",
      systemPrompt: "You are a career advisor helping a high school student understand how AI is changing a specific career field. When the student names a career, respond with a structured analysis:\n\n1. **Tasks AI is already doing** in this field (be specific, cite real tools or companies when possible)\n2. **Tasks that still need humans** (emphasize judgment, empathy, creativity, physical skills, ethics)\n3. **New jobs/roles AI is creating** in this field (prompt engineers, AI trainers, AI auditors, etc.)\n4. **Skills to build now** that will be valuable regardless of AI advancement\n\nBe honest and balanced — don't sugarcoat or catastrophize. Acknowledge uncertainty where it exists. Use concrete examples, not vague generalities. Keep responses concise (under 200 words per section). If the student asks follow-up questions, go deeper on that specific area. Avoid jargon — explain technical concepts simply.",
      starterMessage: "Hey! Tell me a career you're interested in — or even just a field (healthcare, tech, education, creative, business, trades, etc.) — and I'll break down how AI is actually changing it. No hype, no doom — just what's really happening.",
      minMessages: 4
    },
    {
      id: "explorer-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What career did you explore? What surprised you most about how AI is changing it?",
      placeholder: "I explored... and was surprised that..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 3 — AI-PROOF SKILLS
    // ═══════════════════════════════════════════════════════
    {
      id: "section-skills",
      type: "section_header",
      title: "Part 3: Building AI-Resilient Skills",
      subtitle: "~10 minutes",
      icon: "💪"
    },
    {
      id: "skills-text",
      type: "text",
      content: "Regardless of what career you pursue, some skills will remain valuable no matter how advanced AI gets. These are the things AI fundamentally can't replicate because they require being human."
    },
    {
      id: "skills-callout",
      type: "callout",
      icon: "🛡️",
      style: "insight",
      content: "**The AI-Resilient Skill Set:**\n\n- **Critical thinking** — Evaluating information, spotting flaws, making judgment calls with incomplete data\n- **Communication** — Persuading, teaching, inspiring, de-escalating — all require reading humans\n- **Creativity with purpose** — Not just generating ideas (AI does that) but knowing which ideas matter and why\n- **Ethical reasoning** — Making decisions that account for fairness, consequences, and values\n- **Adaptability** — Learning new tools and workflows as technology changes\n- **AI literacy** — Understanding what AI can and can't do, using it effectively, auditing its output\n\nNotice: you've been building ALL of these skills this semester."
    },
    {
      id: "skills-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Which of the AI-resilient skills do you think is your strongest? Which do you most need to develop?",
      placeholder: "My strongest is... I need to develop..."
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "wrapup-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which statement is most accurate about AI and careers?",
      options: [
        "AI will replace most human jobs within the next 5 years",
        "AI won't affect careers at all — it's just a tool",
        "AI is automating specific tasks within jobs, transforming roles rather than eliminating them entirely",
        "Only tech jobs will be affected by AI"
      ],
      correctIndex: 2,
      explanation: "AI automates tasks, not entire jobs. Most careers will be transformed — some tasks become AI-assisted, new roles emerge, and human skills become more valuable for the remaining work. Complete job replacement is rare; task transformation is everywhere."
    },
    {
      id: "wrapup-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "Complete this sentence: \"The most important thing I can do to prepare for an AI-influenced job market is...\"",
      placeholder: "The most important thing I can do is..."
    },

    {
      id: "section-vocab",
      type: "section_header",
      title: "Vocabulary",
      subtitle: "",
      icon: "📖"
    },
    {
      id: "vocab1",
      type: "vocab_list",
      terms: [
        {
          term: "Task Automation",
          definition: "AI handling specific tasks within a job (data entry, scheduling, pattern detection) while humans handle the rest. The job changes shape but doesn't disappear."
        },
        {
          term: "Augmentation",
          definition: "AI making humans more capable rather than replacing them. Example: a doctor using AI to analyze scans faster, then making the final diagnosis themselves."
        },
        {
          term: "AI-Resilient Skills",
          definition: "Human capabilities that remain valuable regardless of AI advancement: critical thinking, communication, ethical reasoning, creativity with purpose, and adaptability."
        }
      ]
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "Period 4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "Period 5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "Period 7" },
    { courseId: "fUw67wFhAtobWFhjwvZ5", label: "Period 9" },
  ];
  const lessonId = "ai-and-your-career";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
