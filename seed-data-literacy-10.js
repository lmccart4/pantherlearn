// seed-data-literacy-10.js
// Lesson 10: "The Debrief"
// Unit: Data Literacy | Course: Digital Literacy | Order: 21
// Run: node seed-data-literacy-10.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-10-the-debrief";

const lesson = {
  title: "The Debrief",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 21,
  blocks: [

    // ═══════════════════════════════════════════════════════
    // WARM UP (~5 minutes — keep short to maximize presentation time)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~5 minutes",
      icon: "🔥"
    },
    {
      id: "b1",
      type: "objectives",
      content: "By the end of this lesson, you will be able to:\n\n• Present your data story clearly and confidently to an audience\n• Give specific, constructive feedback on peer data communication\n• Reflect on what you've learned across the entire Data Literacy unit"
    },
    {
      id: "b2",
      type: "text",
      content: "Today you share your work. You're not presenting a spreadsheet — you're telling a story backed by evidence.\n\nYou've done the investigation. You've found something real. Now make the room care about it."
    },
    {
      id: "b3",
      type: "callout",
      style: "info",
      content: "**Audience expectations while others present:**\n\nListen actively. When someone shares their data story, you're looking for:\n1. Is their research question clear?\n2. Does the data actually support their conclusion — or are they overstating it?\n3. What's the most interesting finding they uncovered?\n\nYou'll write feedback for at least 2–3 classmates. Make it specific and genuinely useful — not 'good job' but 'your headline was strong because...' or 'I wanted to know more about...'"
    },

    // ═══════════════════════════════════════════════════════
    // MAIN: PRESENTATIONS & PEER FEEDBACK (~25 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: Presentations & Peer Feedback",
      subtitle: "~25 minutes",
      icon: "🎤"
    },
    {
      id: "b4",
      type: "activity",
      // Luke: Choose format based on class size.
      // Option A: 2-minute presentations + 1 minute peer feedback each (works for 8-12 students)
      // Option B: Gallery walk — students post their one-pager and walk around giving written feedback
      //           If gallery walk, create a simple Google Form with fields: Presenter name, Strongest part, Surprising finding, One improvement
      title: "Presentations / Gallery Walk",
      instructions: "Share your data story with the class. You have about 2 minutes. Cover:\n1. Your research question — what were you investigating?\n2. Your most important finding — the headline stat or comparison\n3. Your 'So What?' — why does this matter?\n\nThen take questions or feedback from classmates."
    },
    {
      id: "b5",
      type: "text",
      content: "As you watch or walk through presentations, write feedback for at least 2–3 classmates below. Good feedback is specific — it names exactly what worked and exactly what could be stronger."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "PEER FEEDBACK #1 — Classmate's name and their headline: What was the strongest part of their data story? Name something specific.",
      placeholder: "Name + Headline: ...\nStrongest part: ..."
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "PEER FEEDBACK #1 — Was there anything surprising in their findings, or something you wanted to know more about? Be specific.",
      placeholder: "I was surprised by... / I wanted to know more about..."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "PEER FEEDBACK #1 — One thing that could make their data story even more convincing. Be constructive and specific.",
      placeholder: "One thing that would strengthen it: ..."
    },
    {
      id: "div1",
      type: "divider"
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "PEER FEEDBACK #2 — Classmate's name and their headline: What was the strongest part of their data story? Name something specific.",
      placeholder: "Name + Headline: ...\nStrongest part: ..."
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "PEER FEEDBACK #2 — Was there anything surprising in their findings, or something you wanted to know more about? Be specific.",
      placeholder: "I was surprised by... / I wanted to know more about..."
    },
    {
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "PEER FEEDBACK #2 — One thing that could make their data story even more convincing. Be constructive and specific.",
      placeholder: "One thing that would strengthen it: ..."
    },
    {
      id: "div2",
      type: "divider"
    },
    {
      id: "q7",
      type: "question",
      questionType: "short_answer",
      prompt: "PEER FEEDBACK #3 — Classmate's name and their headline: What was the strongest part of their data story? Name something specific.",
      placeholder: "Name + Headline: ...\nStrongest part: ..."
    },
    {
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "PEER FEEDBACK #3 — Was there anything surprising in their findings, or something you wanted to know more about? Be specific.",
      placeholder: "I was surprised by... / I wanted to know more about..."
    },
    {
      id: "q9",
      type: "question",
      questionType: "short_answer",
      prompt: "PEER FEEDBACK #3 — One thing that could make their data story even more convincing. Be constructive and specific.",
      placeholder: "One thing that would strengthen it: ..."
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP (~10 minutes — longer than usual, this is the unit capstone)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up: Unit Reflection",
      subtitle: "~10 minutes",
      icon: "🪞"
    },
    {
      id: "b6",
      type: "text",
      content: "Ten classes ago, you thought data literacy was probably about spreadsheets and math. Let's see how far you've actually come."
    },
    {
      id: "q10",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the most important thing you learned in this unit that has NOTHING to do with Google Sheets — no formulas, no features, no buttons? What's the bigger idea?",
      placeholder: "The most important thing I learned, beyond the tools, is..."
    },
    {
      id: "q11",
      type: "question",
      questionType: "short_answer",
      prompt: "Has this unit changed the way you look at charts, statistics, or data you see in everyday life? Give a specific example — something you saw recently (on social media, in the news, at school) that you looked at differently because of this unit.",
      placeholder: "I recently saw... and this time I noticed... because of what I learned about..."
    },
    {
      id: "q12",
      type: "question",
      questionType: "short_answer",
      prompt: "A friend tells you: 'I'm not a math person, so data literacy probably isn't for me.' What would you say to them? Use something you actually experienced this unit as evidence.",
      placeholder: "I'd tell them... because in this unit I wasn't really doing 'math' — I was..."
    },
    {
      id: "q13",
      type: "question",
      questionType: "short_answer",
      prompt: "What specific skill from this unit do you actually think you'll use in the next year — in another class, a job, a personal project, or everyday life? Describe the exact situation where you'd use it.",
      placeholder: "I think I'll actually use [skill] when... because..."
    },
    {
      id: "q14",
      type: "question",
      questionType: "ranking",
      prompt: "Rank these data literacy skills from 1 (most confident) to 6 (need more practice). Be honest with yourself — this helps you know what to keep building.",
      items: [
        "Sorting and filtering to explore a dataset",
        "Writing formulas (SUM, AVERAGE, COUNT, MIN, MAX)",
        "Cleaning messy data (TRIM, Find & Replace, Remove Duplicates)",
        "Creating charts and choosing the right chart type",
        "Using IF, COUNTIF, and conditional logic",
        "Telling a clear story with data (headlines, 'So What?', design)"
      ]
    },
    {
      id: "b7",
      type: "callout",
      style: "highlight",
      content: "**You walked in knowing how to scroll through Instagram.**\n\nYou're walking out knowing how to question every chart, clean any dataset, find stories hidden in numbers, and tell those stories in a way that makes people care.\n\nThat's data literacy. And it's one of the most valuable skills you can have — in any career, in any subject, in any situation where you need to understand the world instead of just accepting what someone else tells you it looks like."
    },
    {
      id: "q15",
      type: "question",
      questionType: "short_answer",
      prompt: "What's one question you WISH you could investigate with data that we didn't get to in this unit? Describe the dataset you'd want, the question you'd ask, and what you think you might find.",
      placeholder: "I wish I could investigate... using a dataset that includes... I think I'd find that..."
    }

  ]
};

async function seed() {
  await db.collection('courses').doc('digital-literacy').collection('lessons').doc(lessonId).set(lesson);
  console.log(`✅ Seeded: "${lesson.title}" → courses/digital-literacy/lessons/${lessonId}`);
  console.log(`   ${lesson.blocks.length} blocks | order: ${lesson.order}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error seeding lesson:', err);
  process.exit(1);
});
