// seed-ai-policy-sim.js
// Lesson 26 — AI Ethics & Society unit
// NEW BUILD — Students draft AI regulations for a fictional school/city.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "AI Policy Lab: You Make the Rules",
  course: "AI Literacy",
  unit: "AI Ethics and Society",
  order: 28,
  visible: false,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~5 minutes",
      icon: "🔥"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Draft concrete AI policies that address real issues (bias, privacy, transparency, accountability)",
        "Balance competing interests — innovation vs. safety, convenience vs. privacy, speed vs. fairness",
        "Evaluate tradeoffs that policymakers face when regulating AI",
        "Present and defend policy recommendations with evidence from the unit"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "You've explored AI bias in training data. You've argued ethics cases in the courtroom. You've analyzed how AI is changing careers.\n\nNow the question becomes: **What rules should exist?**\n\nGovernments, schools, and companies are all struggling with this right now. There are no settled answers. Today, you become the policymakers."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Should your school have an official AI policy? If so, what should it say? If not, why not?",
      placeholder: "I think... because..."
    },

    // ═══════════════════════════════════════════════════════
    // THE SIMULATION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-sim",
      type: "section_header",
      title: "AI Policy Simulation",
      subtitle: "~30 minutes",
      icon: "🏛️"
    },
    {
      id: "sim-intro",
      type: "text",
      content: "**Scenario:** You've been appointed to the AI Policy Board for **Panthersville** — a fictional city that's rapidly adopting AI across education, healthcare, policing, and business.\n\nThe mayor has asked your board to draft 3-5 AI policies that will govern how the city uses AI. Each policy must address a specific issue, explain what it requires, and justify why it's needed."
    },
    {
      id: "sim-issues",
      type: "callout",
      icon: "📋",
      style: "objective",
      content: "**Issues your policies MUST address (pick at least 3):**\n\n1. **AI in Schools** — Can students use AI on assignments? Can the school use AI for grading or discipline decisions?\n2. **AI in Hiring** — Can companies use AI to screen job applicants? What protections should applicants have?\n3. **AI in Healthcare** — Can hospitals use AI to diagnose patients or prioritize treatment? Who's responsible if it's wrong?\n4. **AI and Privacy** — Can businesses use AI to track customer behavior? What data can AI systems collect?\n5. **AI in Policing** — Can police use facial recognition or predictive policing? What oversight is needed?\n6. **AI Transparency** — Should people be told when they're interacting with AI? Should AI-generated content be labeled?"
    },
    {
      id: "sim-template",
      type: "callout",
      icon: "📝",
      style: "tip",
      content: "**Policy Template (use this structure for each policy):**\n\n**Policy Name:** [Clear, specific title]\n**Issue:** [Which problem does this address?]\n**The Rule:** [What does this policy require or prohibit? Be specific.]\n**Why It's Needed:** [What could go wrong without this policy? Use evidence from lessons.]\n**Tradeoff:** [What's the downside or cost of this policy? What does the city give up?]"
    },
    {
      id: "sim-chatbot",
      type: "chatbot",
      title: "Policy Advisor",
      icon: "🏛️",
      instructions: "Use this advisor to test your policy ideas, explore edge cases, or research how real governments are handling these issues.",
      systemPrompt: "You are a policy advisor helping high school students draft AI regulations for a fictional city called Panthersville. Help them think through policy ideas by:\n\n1. If they propose a policy, identify strengths and potential problems (loopholes, unintended consequences, enforcement challenges)\n2. If they ask about a topic, provide brief, real-world examples of how governments and institutions are currently handling it (EU AI Act, US executive orders, school AI policies, etc.)\n3. If they're stuck, suggest a specific issue to start with and a potential policy approach\n4. Always ask: 'What's the tradeoff?' — every policy has costs and benefits\n\nKeep responses concise (under 150 words). Be balanced — don't advocate for specific policies. Use accessible language. Reference real examples when possible (EU AI Act, NYC hiring law, school AI bans, etc.).",
      starterMessage: "I'm your policy advisor for Panthersville's AI Policy Board. You can run policy ideas by me, ask how real governments are handling AI regulation, or explore the tradeoffs of different approaches. What issue do you want to tackle first?",
      minMessages: 4
    },
    {
      id: "sim-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your FIRST policy using the template. Include: Policy Name, Issue, The Rule, Why It's Needed, and the Tradeoff.",
      placeholder: "Policy Name:\nIssue:\nThe Rule:\nWhy It's Needed:\nTradeoff:"
    },
    {
      id: "sim-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your SECOND policy using the same template.",
      placeholder: "Policy Name:\nIssue:\nThe Rule:\nWhy It's Needed:\nTradeoff:"
    },
    {
      id: "sim-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your THIRD policy using the same template.",
      placeholder: "Policy Name:\nIssue:\nThe Rule:\nWhy It's Needed:\nTradeoff:"
    },

    // ═══════════════════════════════════════════════════════
    // REFLECTION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-reflect",
      type: "section_header",
      title: "Reflection",
      subtitle: "~10 minutes",
      icon: "🪞"
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What's the hardest part about writing AI policy?",
      options: [
        "Coming up with rules — the problems are obvious",
        "Balancing competing interests — every rule has tradeoffs and unintended consequences",
        "Getting people to agree — everyone wants the same thing",
        "Enforcement — once you write a rule, it enforces itself"
      ],
      correctIndex: 1,
      explanation: "The hardest part of AI policy is navigating tradeoffs. Banning facial recognition protects privacy but makes it harder to find missing people. Requiring AI transparency helps consumers but might expose trade secrets. Every policy decision involves giving something up."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "Which policy was hardest to write? What tradeoff made you think the longest?",
      placeholder: "The hardest was... because the tradeoff between... and..."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "Do you think AI regulation should move fast (even if it's imperfect) or slow (to get it right)? Why?",
      placeholder: "I think regulation should... because..."
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
          term: "AI Regulation",
          definition: "Laws, rules, or guidelines that govern how AI can be developed, deployed, and used. Aims to balance innovation with protection from harm."
        },
        {
          term: "Algorithmic Transparency",
          definition: "The principle that people should understand when and how AI is being used to make decisions about them. Includes disclosure requirements and explainability."
        },
        {
          term: "Policy Tradeoff",
          definition: "The unavoidable cost or downside of a policy choice. Every regulation protects something at the expense of something else — safety vs. innovation, privacy vs. convenience."
        },
        {
          term: "EU AI Act",
          definition: "The European Union's comprehensive AI regulation (2024), which categorizes AI by risk level and sets different requirements for each. The first major AI law in the world."
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
  const lessonId = "ai-policy-lab";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
