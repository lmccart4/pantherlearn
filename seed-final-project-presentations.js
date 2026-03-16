// seed-final-project-presentations.js
// Lesson 28 — Final Project Presentations + Semester Reflection
// Peer review, presentations, and course wrap-up.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Presentations & Semester Reflection",
  course: "AI Literacy",
  unit: "Final Project",
  order: 30,
  visible: false,
  blocks: [
    {
      id: "section-present",
      type: "section_header",
      title: "Presentations",
      subtitle: "~30 minutes",
      icon: "🎤"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Present your final project to the class with clarity and confidence",
        "Provide constructive feedback to classmates' projects",
        "Reflect on what you learned this semester and how your understanding of AI has changed"
      ]
    },
    {
      id: "present-intro",
      type: "text",
      content: "Time to share what you've built. Each presenter gets **3-5 minutes** to share their project, followed by **1-2 minutes of questions** from the class.\n\nAs an audience member, your job is to listen actively and provide useful feedback."
    },
    {
      id: "present-guidelines",
      type: "callout",
      icon: "📋",
      style: "objective",
      content: "**Presentation Guidelines:**\n\n**Track A (Research):** Summarize your thesis, share 1-2 key findings, explain why it matters.\n**Track B (Design):** Show your product concept, explain how AI is used, discuss the ethical considerations.\n**Track C (Debate):** Deliver your argument, present your evidence, address the counterargument.\n**Track D (Creative):** Show your piece, then share the key insights from your reflection.\n\nAll tracks: **Connect at least one point to something specific you learned this semester.**"
    },
    {
      id: "feedback-template",
      type: "callout",
      icon: "💬",
      style: "tip",
      content: "**Peer Feedback Framework:**\n\nAs you watch each presentation, think about:\n\n1. **Strength** — What was the strongest part of this project?\n2. **AI Connection** — Did they demonstrate real understanding of how AI works (not just what it does)?\n3. **Question** — What's one thing you'd want to know more about?"
    },

    // ═══════════════════════════════════════════════════════
    // PEER FEEDBACK
    // ═══════════════════════════════════════════════════════
    {
      id: "section-feedback",
      type: "section_header",
      title: "Peer Feedback",
      subtitle: "~5 minutes",
      icon: "📝"
    },
    {
      id: "feedback-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick ONE classmate's presentation that stood out to you. What made it strong? What AI concept did they demonstrate well?",
      placeholder: "The presentation by... stood out because..."
    },

    // ═══════════════════════════════════════════════════════
    // SEMESTER REFLECTION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-reflect",
      type: "section_header",
      title: "Semester Reflection",
      subtitle: "~15 minutes",
      icon: "🪞"
    },
    {
      id: "reflect-intro",
      type: "text",
      content: "Before we wrap up, let's take stock of how far you've come. At the start of this course, most of you had never thought about how AI actually works. Now you've built chatbots, engineered prompts, debated ethics cases, and created with AI as a partner.\n\nThat's not nothing."
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Think back to the FIRST day of this course. What did you think AI was? How has your understanding changed?",
      placeholder: "At the start, I thought AI was... Now I understand that..."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the single most important thing you learned this semester about AI? Why does it matter?",
      placeholder: "The most important thing I learned is... It matters because..."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "What's one misconception about AI that you could now confidently correct if a friend or family member repeated it?",
      placeholder: "If someone said '...' I would explain that..."
    },
    {
      id: "reflect-q4",
      type: "question",
      questionType: "short_answer",
      prompt: "How will you use what you learned about AI going forward — in school, in your career, or in daily life?",
      placeholder: "Going forward, I plan to..."
    },
    {
      id: "reflect-q5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which statement best describes your relationship with AI after this course?",
      options: [
        "I'm excited about AI and trust it completely",
        "I'm scared of AI and think it should be banned",
        "I understand AI's capabilities and limitations and can use it critically and effectively",
        "I don't think AI matters much to my life"
      ],
      correctIndex: 2,
      explanation: "The goal of this course was never to make you love or fear AI — it was to make you literate. Understanding what AI can do, where it fails, how to use it well, and when to question it is the foundation for navigating a world where AI is everywhere."
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Course Complete",
      subtitle: "",
      icon: "🎓"
    },
    {
      id: "wrapup-text",
      type: "text",
      content: "You started this course learning that AI predicts the next word. You end it understanding how that simple mechanism connects to creativity, bias, careers, ethics, and policy.\n\nAI literacy isn't a one-time thing — the technology will keep changing. But the critical thinking skills you built here? Those are permanent.\n\nYou now know how to:\n- Understand how AI generates output\n- Engineer prompts that get useful results\n- Identify bias and limitations in AI systems\n- Create with AI without surrendering your own voice\n- Think critically about AI's role in society\n- Make informed decisions about when to trust AI and when to question it"
    },
    {
      id: "final-callout",
      type: "callout",
      icon: "✅",
      style: "success",
      content: "**You are AI literate.** That puts you ahead of most adults in the world right now. Use it well."
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
  const lessonId = "final-project-presentations";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
