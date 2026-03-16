// seed-prompt-workshop-lesson.js
// Lesson 19 — Prompt Engineering & Applied AI unit
// Wraps the existing Prompt Workshop activity with lesson context.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "The Prompt Workshop",
  course: "AI Literacy",
  unit: "Prompt Engineering and Applied AI",
  order: 21,
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
        "Apply specific prompt engineering techniques: formatting, audience targeting, role-setting, and constraints",
        "Iterate on prompts based on AI output — diagnose why a prompt failed and fix it",
        "Recognize that prompt quality directly determines output quality",
        "Build a mental toolkit of prompting strategies for different situations"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "Last lesson you saw *why* prompts matter — because every word shifts the probability of what AI generates next.\n\nToday you learn *how* to write better prompts. Not by guessing — by applying specific techniques that consistently produce better results.\n\nYou'll work through a series of challenges where you have to get AI to produce a specific output. Each challenge teaches a different prompting skill."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of a time you asked AI for something and the result wasn't what you wanted. What went wrong?",
      placeholder: "I asked for... but got... I think it happened because..."
    },

    // ═══════════════════════════════════════════════════════
    // TECHNIQUES
    // ═══════════════════════════════════════════════════════
    {
      id: "section-techniques",
      type: "section_header",
      title: "Prompt Engineering Toolkit",
      subtitle: "~10 minutes",
      icon: "🧰"
    },
    {
      id: "tech-intro",
      type: "text",
      content: "Before you start the challenges, here are the core techniques you'll practice today. Think of these as tools in a toolkit — different situations call for different tools."
    },
    {
      id: "tech-format",
      type: "callout",
      icon: "📋",
      style: "insight",
      content: "**1. Format & Specificity**\n\nTell the AI exactly what format you want: a numbered list, a table, bullet points, a specific word count, a paragraph structure.\n\n- Weak: \"Tell me about dolphins\"\n- Strong: \"List exactly 5 fun facts about dolphins, numbered 1-5, each in one sentence\""
    },
    {
      id: "tech-audience",
      type: "callout",
      icon: "👥",
      style: "insight",
      content: "**2. Audience Targeting**\n\nSpecify who the output is for. AI adjusts vocabulary, complexity, and tone based on audience.\n\n- Weak: \"Explain photosynthesis\"\n- Strong: \"Explain photosynthesis to a 5-year-old using no scientific jargon\""
    },
    {
      id: "tech-role",
      type: "callout",
      icon: "🎭",
      style: "insight",
      content: "**3. Role-Setting**\n\nTell AI to act as a specific character or expert. This shifts tone, vocabulary, and perspective.\n\n- Weak: \"Give me study tips\"\n- Strong: \"You are a pirate captain. Give me 5 tips for studying for a math test, staying fully in character\""
    },
    {
      id: "tech-constraints",
      type: "callout",
      icon: "🚫",
      style: "insight",
      content: "**4. Constraints**\n\nTell AI what it CAN'T do. Constraints force creative output.\n\n- Weak: \"Write about exercise\"\n- Strong: \"Explain why exercise is important WITHOUT using the words: health, body, weight, muscles, or fitness\""
    },
    {
      id: "tech-combine",
      type: "callout",
      icon: "🔗",
      style: "tip",
      content: "**Pro move: Combine techniques.** The best prompts use 2-3 techniques together.\n\n\"You are a sports announcer (role). Explain the water cycle (topic) to a 3rd grader (audience) using exactly 4 sentences (format) without using the word 'rain' (constraint).\""
    },

    // ═══════════════════════════════════════════════════════
    // ACTIVITY
    // ═══════════════════════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "Prompt Workshop Challenges",
      subtitle: "~25 minutes",
      icon: "🧪"
    },
    {
      id: "activity-intro",
      type: "text",
      content: "Time to put these techniques into practice. The Prompt Workshop gives you a series of challenges — each one has a specific target output. Your job is to write a prompt that gets the AI to produce it.\n\nAn automated judge evaluates your result: **Perfect**, **Partial**, or **Fail**. You can retry as many times as you want."
    },
    {
      id: "activity-block",
      type: "activity",
      title: "Launch Prompt Workshop",
      icon: "✍️",
      instructions: "1. Open the Prompt Workshop (your teacher will share the link)\n2. Work through the challenges in order — they get harder\n3. **Stage 1:** Format & clarity challenges\n4. **Stage 2:** Role & constraint challenges\n5. **Stage 3:** Advanced combinations\n6. For each challenge, try to get a **Perfect** score before moving on\n7. If you get stuck, re-read the technique cards above\n\n**Track your scores — we'll compare at the end!**"
    },
    {
      id: "activity-tip",
      type: "callout",
      icon: "💡",
      style: "tip",
      content: "**If you're stuck:** Ask yourself which technique the challenge is testing. Is it about format? Audience? Role? Constraints? Identifying the technique narrows down your approach."
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
      questionType: "short_answer",
      prompt: "Which challenge was hardest? What technique did you need to use, and what was tricky about it?",
      placeholder: "The hardest challenge was... because..."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which prompt engineering technique had the biggest impact on output quality?",
      options: [
        "Format & Specificity — telling AI exactly what structure you want",
        "Audience Targeting — specifying who the output is for",
        "Role-Setting — giving AI a character or persona",
        "Constraints — telling AI what NOT to do"
      ],
      correctIndex: 0,
      explanation: "While all techniques matter, format and specificity tend to have the biggest impact because they give AI the clearest target. A vague prompt produces vague output; a specific prompt produces specific output. The other techniques refine tone and style."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "Write a prompt for this scenario using at least 2 techniques from today: You want AI to help you study for a history test on the American Revolution.",
      placeholder: "My prompt would be..."
    },
    {
      id: "bridge",
      type: "callout",
      icon: "➡️",
      style: "insight",
      content: "**Next lesson:** You've practiced prompting in a structured environment. Now it's time for the real test — **Prompt Duel**, where you'll compete head-to-head using everything you've learned."
    },

    // ═══════════════════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════════════════
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
          term: "Prompt Engineering",
          definition: "The skill of writing instructions for AI that consistently produce high-quality, targeted output. Involves techniques like formatting, audience targeting, role-setting, and constraints."
        },
        {
          term: "Role Prompting",
          definition: "Instructing AI to adopt a specific persona or expertise level. Changes tone, vocabulary, and perspective of the output."
        },
        {
          term: "Constraint",
          definition: "A limitation placed on AI output — what it can't do, can't say, or must avoid. Forces creative solutions and prevents generic responses."
        },
        {
          term: "Iteration",
          definition: "The process of refining a prompt based on the AI's output. Write → evaluate → adjust → repeat until the output matches your intent."
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
  const lessonId = "prompt-workshop";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
