// seed-data-literacy-2.js
// Lesson 2: "Getting Your Hands Dirty"
// Unit: Data Literacy | Course: Digital Literacy | Order: 13
// Run: node seed-data-literacy-2.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-2-getting-hands-dirty";

const lesson = {
  title: "Getting Your Hands Dirty",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 13,
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
      content: "By the end of this lesson, you will be able to:\n\n• Navigate a Google Sheets spreadsheet confidently\n• Use sorting and filtering to explore a dataset\n• Find patterns in data without any formulas"
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "You're a journalist. Your editor just dropped a dataset on your desk and said: 'There's a story in here — find it by end of day.' Where do you even start? What's the first thing you do when you open a spreadsheet full of data you've never seen before?",
      placeholder: "The first thing I'd do is... because..."
    },
    {
      id: "b2",
      type: "text",
      content: "A spreadsheet isn't a math tool. It's an X-ray machine for information.\n\nRight now it probably looks like a grid of cells with numbers. By the end of today, it'll look like a dataset full of stories waiting to be found — and you won't have typed a single formula to find them."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~25 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: First Investigation",
      subtitle: "~25 minutes",
      icon: "🔍"
    },
    {
      id: "b3",
      type: "text",
      content: "Quick orientation before you open the data:\n\n- **Rows** run horizontally (left to right). Each row is one song.\n- **Columns** run vertically (top to bottom). Each column is one piece of information — like Artist or Streams.\n- **Cells** are individual boxes where a row and column intersect. Cell E2 means column E, row 2.\n\nThat's it. That's the whole spatial layout. This is the same tool journalists, scientists, athletes, and businesses use every single day. And today you're using it too."
    },
    {
      id: "b4",
      type: "activity",
      title: "First Investigation: Top Streaming Songs",
      // Luke: share this Google Sheet with view-only or make-a-copy access for students
      instructions: "Open the Top Streaming Songs dataset: https://docs.google.com/spreadsheets/d/1ZfX1sFUG0s6CCsbvgSFXF9U9eXKz0fAc/edit?usp=sharing\n\nMake a copy (File → Make a copy) so you can edit it. Then work through the Explorer's Checklist below."
    },
    {
      id: "b5",
      type: "checklist",
      title: "Explorer's Checklist",
      items: [
        "Sort the Streams column from highest to lowest — who's on top?",
        "Sort by Year Released (oldest first) — what's the oldest song in the dataset?",
        "Filter to show only one genre (pick your favorite) — how many songs are in it? (Data → Create a filter, then click the dropdown arrow on the Genre column)",
        "Freeze the header row so column names stay visible as you scroll (View → Freeze → 1 row)",
        "Find the longest and shortest songs by sorting the Duration column",
        "Select the entire Streams column — look at the bottom-right corner of your screen. Sheets automatically shows you the SUM and AVERAGE without any formula."
      ]
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the most surprising thing you found just by sorting? Something you didn't expect — an artist you didn't think would be at the top, a year that surprised you, a duration that seemed way off.",
      placeholder: "I was surprised to see... because I expected..."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "When you filtered to just one genre, what pattern jumped out at you? What did you notice about the songs in that genre that you wouldn't have seen without filtering?",
      placeholder: "When I filtered to [genre], I noticed that..."
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "If your editor asked 'What's the headline?' based on what you've found so far — no formulas, just sorting and filtering — what would you say? Write it like an actual newspaper headline.",
      placeholder: "HEADLINE: ..."
    },
    {
      id: "b6",
      type: "callout",
      style: "insight",
      content: "**You just did data analysis.** No formulas, no code, no math degree. Just curiosity and sorting. Every data investigation starts exactly like this — someone opens a dataset, starts moving things around, and asks 'hm, what's that about?' That's you, right now."
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
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "What's one question about this dataset that you CAN'T answer just by sorting and filtering? What would you need to be able to do to answer it?",
      placeholder: "I can't figure out... because sorting doesn't let me... I think I would need to..."
    },
    {
      id: "b7",
      type: "text",
      content: "That question you just asked? That's exactly what we're learning next.\n\nNext class: how to make the spreadsheet do the math for you. You'll be able to answer questions that would take hours of manual counting in about 10 seconds."
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
