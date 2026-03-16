// seed-data-literacy-3.js
// Lesson 3: "Let the Computer Do the Math"
// Unit: Data Literacy | Course: Digital Literacy | Order: 14
// Run: node seed-data-literacy-3.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-3-let-computer-do-math";

const lesson = {
  title: "Let the Computer Do the Math",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 14,
  blocks: [

    // ═══════════════════════════════════════════════════════
    // WARM UP (~10 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "b1",
      type: "objectives",
      content: "By the end of this lesson, you will be able to:\n\n• Write basic spreadsheet formulas (SUM, AVERAGE, COUNT, MIN, MAX)\n• Interpret formula results in plain language a non-expert could understand\n• Use formulas to answer investigation questions about the streaming dataset"
    },
    {
      id: "b2",
      type: "text",
      content: "**The Speed Test**\n\nHere's a column of streaming numbers (in millions). Try to add them up in your head or on paper — you have 60 seconds:\n\n847 | 1,203 | 456 | 2,891 | 633 | 1,547 | 289 | 3,102 | 978 | 1,765 | 412 | 2,234 | 567 | 1,890 | 345 | 2,678 | 801 | 1,456 | 623 | 2,045\n\nThat's 20 numbers. That's also a tiny dataset — most real datasets have thousands of rows."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "How did that feel? Did you finish? Now imagine that column had 10,000 rows. What does this tell you about why formulas exist?",
      placeholder: "It felt... and it tells me that formulas exist because..."
    },
    {
      id: "b3",
      type: "text",
      content: "Formulas are just instructions you give the spreadsheet. You're not doing math — you're telling the computer what math to do.\n\nThink of it like a recipe. You're not baking the bread yourself — you're handing the recipe to someone else and saying 'you do it.' The formula is the recipe. The spreadsheet is the one doing the work."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~25 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: Formulas Are Superpowers",
      subtitle: "~25 minutes",
      icon: "⚡"
    },
    {
      id: "b4",
      type: "text",
      content: "Every formula in Sheets starts with `=`. That tells Sheets: 'this is a command, not just text.' Then you type the function name and the range of cells you want to use.\n\n`=SUM(E2:E119)` means: add up everything in column E from row 2 to row 119.\n\nThe formula auto-updates if your data changes. Change one number, and every formula that references it recalculates instantly. That's the power."
    },
    {
      id: "b5",
      type: "definition",
      term: "SUM",
      definition: "Adds up all the values in a range of cells. Example: =SUM(E2:E119) adds every value in the Streams column. Use it when you need a total."
    },
    {
      id: "b6",
      type: "definition",
      term: "AVERAGE",
      definition: "Calculates the mean (average) of a range. Example: =AVERAGE(E2:E119) gives you the typical number of streams per song. Use it when you want to know what's normal or expected."
    },
    {
      id: "b7",
      type: "definition",
      term: "COUNT",
      definition: "Counts how many cells in a range contain numbers. Example: =COUNT(E2:E119) tells you how many songs have a streams value. Use it when you need to know how many rows of data you're working with."
    },
    {
      id: "b8",
      type: "definition",
      term: "MIN and MAX",
      definition: "MIN finds the smallest value in a range; MAX finds the largest. Example: =MIN(F2:F119) finds the shortest song duration. =MAX(F2:F119) finds the longest. Use these to find extremes and outliers."
    },
    {
      id: "b9",
      type: "activity",
      title: "Formula Challenge: Investigate the Streaming Data",
      instructions: "Open your copy of the Top Streaming Songs dataset. Find an empty cell — somewhere with no data, like a cell in column J or K — and type your formulas there. For each question below, write the formula you used AND answer the question in plain English."
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the total number of streams (in millions) across ALL songs in the dataset? Write the formula you used, then write the answer as a sentence a non-data person would understand.",
      placeholder: "Formula: =SUM(...)\nAnswer: The songs in this dataset have been streamed a combined total of..."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the average number of streams per song in the dataset? Write the formula, then translate the result into plain language. Don't just say '1,247' — say what that number means.",
      placeholder: "Formula: =AVERAGE(...)\nMeaning: The typical song in this dataset has been streamed about..."
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the longest song in the dataset? The shortest? Use MIN and MAX on the Duration column to find out. What's the difference in seconds between the longest and shortest?",
      placeholder: "Longest: ... seconds (=MAX(...))\nShortest: ... seconds (=MIN(...))\nDifference: ..."
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "Filter your dataset to show just Hip-Hop songs. Then use AVERAGE on the Streams column — but only for the visible (filtered) rows. Compare that to the overall average you found earlier. Which is higher? What might explain the difference?",
      placeholder: "Hip-Hop average streams: ...\nOverall average streams: ...\n[Genre] is higher because..."
    },
    {
      id: "b10",
      type: "callout",
      style: "warning",
      content: "**Critical rule: A number without context is meaningless.**\n\n'1,247' tells no story. '1,247 million average streams — meaning the typical song in this dataset has been streamed over a billion times' tells a story. Every time you get a formula result, your job is to translate it into a sentence a stranger could understand."
    },
    {
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your own investigation question about this dataset — one that can be answered with SUM, AVERAGE, COUNT, MIN, or MAX. Then answer it. Show the formula and write out what the answer means in plain language.",
      placeholder: "My question: ...\nFormula I used: ...\nAnswer: ..."
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP (~5 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "q7",
      type: "question",
      questionType: "short_answer",
      prompt: "Which of today's formulas (SUM, AVERAGE, COUNT, MIN, MAX) do you think you'll use most in your life outside this class? Think about a real situation — a job, a hobby, a decision you'd need to make — where that formula would actually be useful.",
      placeholder: "I think I'll use... the most because in real life I might need to..."
    },
    {
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "Last class, you wrote down a question about the dataset that you couldn't answer just by sorting and filtering. Look back at that question now. Can you answer it using today's formulas? If yes, answer it. If not, what else would you need?",
      placeholder: "My question from last class was... Now I can/can't answer it because..."
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
