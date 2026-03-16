// seed-prompt-duel-lesson.js
// Lesson 20 — Prompt Engineering & Applied AI unit
// Wraps the existing Prompt Duel competitive activity.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Prompt Duel",
  course: "AI Literacy",
  unit: "Prompt Engineering and Applied AI",
  order: 22,
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
        "Apply prompt engineering techniques under pressure in a competitive setting",
        "Navigate creative constraints — achieve a target output while avoiding banned words or concepts",
        "Demonstrate that prompt skill varies and improves with practice",
        "Reflect on strategies that work under time pressure vs. deliberate practice"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "You've learned the theory of token prediction. You've practiced techniques in the Prompt Workshop. Now it's game time.\n\n**Prompt Duel** is a competitive prompting challenge. You'll face 6 rounds of increasing difficulty. Each round gives you a target output and a set of constraints (banned words, required tone, specific format). Your job: write a prompt that hits the target without breaking the rules."
    },
    {
      id: "wu-hype",
      type: "callout",
      icon: "⚔️",
      style: "scenario",
      content: "**The stakes:** Your score goes on the leaderboard. Best score in the class earns bragging rights.\n\nThis isn't about memorizing techniques — it's about applying them creatively under pressure. The best prompt engineers aren't the ones who know the most rules. They're the ones who can think around constraints."
    },

    // ═══════════════════════════════════════════════════════
    // ACTIVITY
    // ═══════════════════════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "Prompt Duel",
      subtitle: "~30 minutes",
      icon: "⚔️"
    },
    {
      id: "activity-levels",
      type: "callout",
      icon: "📊",
      style: "objective",
      content: "**6 Rounds — Escalating Difficulty:**\n\n🟢 **Round 1 (Easy):** Describe a scene while avoiding obvious words\n🟡 **Round 2 (Medium):** Hit a target with tighter constraints\n🟠 **Round 3 (Hard):** Multiple constraints at once\n🔴 **Round 4 (Expert):** Creative workarounds required\n🟣 **Round 5 (Legendary):** Extreme constraints + style matching\n⚫ **Round 6 (Boss):** Tone control — deliver content with a specific emotional quality"
    },
    {
      id: "activity-block",
      type: "activity",
      title: "Launch Prompt Duel",
      icon: "🎮",
      instructions: "1. Open Prompt Duel (your teacher will share the link, or go to **prompt-duel-paps.web.app**)\n2. Sign in with your school account\n3. Work through all 6 rounds\n4. For each round: read the target, note the banned words/constraints, write your prompt\n5. Your prompt is scored on how closely AI's response matches the target\n6. You can retry rounds to improve your score\n\n**Strategy tip:** Before writing, identify which technique(s) from the Prompt Workshop will help. Format? Role? Constraints? Combining?"
    },
    {
      id: "activity-tips",
      type: "callout",
      icon: "💡",
      style: "tip",
      content: "**Strategies for tough rounds:**\n\n- **Banned words?** Use synonyms, metaphors, or describe the concept without naming it\n- **Tone matching?** Set a role (\"Speak like a...\") or describe the emotional quality (\"in a warm, reassuring tone\")\n- **Multiple constraints?** Address them one at a time in your prompt — don't try to handle everything in one sentence\n- **Stuck?** Re-read the target output carefully. What's the core thing it's asking for? Start there."
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
      prompt: "What was your final score? Which round was hardest and what strategy did you use to get through it?",
      placeholder: "My score was... The hardest round was... I used..."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What's the most important skill for prompt engineering under constraints?",
      options: [
        "Typing speed — getting prompts out faster",
        "Memorizing banned word lists",
        "Creative problem-solving — finding indirect ways to achieve the target",
        "Using the longest possible prompt to cover all bases"
      ],
      correctIndex: 2,
      explanation: "Prompt engineering under constraints is fundamentally a creative problem-solving skill. The best prompters find indirect, creative ways to guide AI toward a target — using synonyms, metaphors, role-setting, and clever framing to work around limitations."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "How is prompt engineering similar to other skills you use in school (writing essays, solving math problems, giving presentations)?",
      placeholder: "Prompt engineering is similar to... because..."
    },
    {
      id: "unit-bridge",
      type: "callout",
      icon: "➡️",
      style: "insight",
      content: "**Unit bridge:** You now understand how AI generates text (token prediction), how to control it (prompt engineering), and how to apply those skills under pressure (prompt duel).\n\nNext up: **Build a Chatbot** — where you'll apply everything you've learned to create an actual AI-powered chatbot from scratch, progressing from simple rules to real language models."
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
          term: "Indirect Prompting",
          definition: "Describing what you want without using the most obvious words. A key skill when working around banned words or content filters."
        },
        {
          term: "Tone Matching",
          definition: "Crafting a prompt that produces output with a specific emotional quality — warm, formal, humorous, urgent, etc. Often achieved through role-setting or explicit tone instructions."
        },
        {
          term: "Prompt Iteration",
          definition: "Refining a prompt through multiple attempts based on evaluating each output. Each version gets closer to the target."
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
  const lessonId = "prompt-duel";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
