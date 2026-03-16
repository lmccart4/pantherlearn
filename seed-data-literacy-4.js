// seed-data-literacy-4.js
// Lesson 4: "Cleaning the Crime Scene"
// Unit: Data Literacy | Course: Digital Literacy | Order: 15
// Run: node seed-data-literacy-4.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-4-cleaning-crime-scene";

const lesson = {
  title: "Cleaning the Crime Scene",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 15,
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
      content: "By the end of this lesson, you will be able to:\n\n• Identify common types of messy data and explain why they cause problems\n• Use tools like TRIM, Find & Replace, and Remove Duplicates to clean a dataset\n• Explain why data cleaning matters for accurate analysis"
    },
    {
      id: "b2",
      type: "text",
      content: "**The Scene of the Crime**\n\nA local news station just received a leaked dataset about streaming music revenue. It could be the story of the year — but when they opened the file, it was a disaster.\n\nExtra spaces in artist names so searches fail. Genres spelled three different ways: 'Pop,' 'Popp,' and 'pop.' Blank rows in the middle of the data that break every formula. Duplicate entries inflating the numbers. Streams stored as text instead of numbers so they won't calculate.\n\nThe story is in there. But the data is evidence, and right now the evidence is contaminated. Before anyone can analyze anything, someone has to clean it.\n\nThat someone is you."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Why do you think real-world data ends up this messy? Think about who actually enters the data and what could go wrong — at school, at a company, in the real world.",
      placeholder: "Data gets messy because... For example, if multiple people are entering data..."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~25 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: Crime Scene Cleanup",
      subtitle: "~25 minutes",
      icon: "🧹"
    },
    {
      id: "b3",
      type: "text",
      content: "Data scientists spend up to **80% of their time** just cleaning data before they can analyze anything. Not 10%. Not 30%. Eighty percent.\n\nThis isn't the boring part of the job — it's the most important part. If your data is dirty, your analysis is wrong. And the scary thing is: you might not even know it. The formulas will run. The chart will look professional. And the story it tells will be a lie."
    },
    {
      id: "b4",
      type: "activity",
      title: "Crime Scene Cleanup: The Messy Dataset",
      // Luke: share this Google Sheet with make-a-copy access for students
      instructions: "Open the messy version of the streaming dataset: https://docs.google.com/spreadsheets/d/1GMmHOyGGrO2tgB_9TPgRIe2Eozjqw1is/edit?usp=sharing\n\nMake a copy (File → Make a copy). Before touching anything, scroll through the entire dataset and look for problems. Then answer the question below."
    },
    {
      id: "b5",
      type: "text",
      content: "**What to look for as you scroll:**\n\n- Extra spaces before or after text in cells (hard to see at first — look carefully)\n- Inconsistent capitalization in the Genre column\n- Typos in genre names\n- Completely blank rows between data rows\n- Duplicate rows (same song listed twice)\n- Numbers in the Streams column that look like numbers but have a tiny apostrophe or space hidden inside\n- Dates in the 'Date Added' column written completely differently: '1/5/24' vs. 'January 5, 2024' vs. '2024-01-05'"
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "List at least 4 specific problems you found in the messy dataset. Be specific — not just 'there are typos' but 'the genre Hip-Hop is also spelled Hip Hop and hip-hop.'",
      placeholder: "Problem 1: ...\nProblem 2: ...\nProblem 3: ...\nProblem 4: ..."
    },
    {
      id: "b6",
      type: "text",
      content: "Now work through these cleaning steps in order. Take your time — rushing data cleaning creates new problems."
    },
    {
      id: "b7",
      type: "checklist",
      title: "Data Cleaning Checklist",
      items: [
        "Delete blank rows — Sort the entire sheet by the Song Title column. Blank rows will sink to the bottom. Select and delete them. (Or: use Edit → Find & Replace to find empty cells.)",
        "Fix extra spaces with TRIM — In an empty column (like column J), type =TRIM(A2) and drag it down. This removes leading and trailing spaces. Once it looks clean, copy the whole column, paste as Values Only (Edit → Paste special → Values only), then delete column A and rename your cleaned column.",
        "Fix Genre typos with Find & Replace — Press Ctrl+H (or Cmd+H on Mac). Search for 'Popp' → replace with 'Pop'. Do the same for: 'RnB' → 'R&B', 'Rokc' → 'Rock', 'Hip Hop' → 'Hip-Hop', 'Latim' → 'Latin', 'Electronica' → 'Electronic'.",
        "Remove duplicate rows — Go to Data → Data cleanup → Remove duplicates. Select all columns when prompted. Google Sheets will tell you how many duplicates it removed.",
        "Fix numbers stored as text — If any Streams values have a green triangle in the corner or won't calculate, use =VALUE(TRIM(E2)) in a helper column to convert them to real numbers."
      ]
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "How many rows did you have before cleaning? How many after? What happened to the missing rows — where did they go?",
      placeholder: "Before: ___ rows. After: ___ rows. The missing rows were..."
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "Which type of mess was the hardest to spot just by looking at the data? Why is that type of error especially dangerous — what could go wrong if a data analyst missed it?",
      placeholder: "The hardest to spot was... because... If someone missed it, their analysis would..."
    },
    {
      id: "b8",
      type: "callout",
      style: "warning",
      content: "**The most dangerous dirty data is the kind that looks clean.**\n\nA number with a hidden space won't show any visible error — it just silently fails in your SUM formula. A genre name with a capital P in the wrong place won't trigger an error — it'll just create a phantom 'Pop' category with 0 songs. You won't know anything is wrong until you compare your results to the truth."
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "Try this: run =AVERAGE(E2:E80) on the Streams column BEFORE you clean the numbers-stored-as-text issue. Write down the result. Then clean those cells and run the formula again. Did you get a different answer? Why or why not?",
      placeholder: "Before cleaning: average = ...\nAfter cleaning: average = ...\nThe difference (or lack of difference) happened because..."
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
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "Imagine you're hiring someone to work with data. You have two candidates: one is amazing at making beautiful charts, and one is amazing at cleaning messy data. Who do you hire? Defend your answer — there's no wrong response here, but you need a real argument.",
      placeholder: "I'd hire the person who is good at... because in practice..."
    },
    {
      id: "b9",
      type: "text",
      content: "Next class: you make charts — the part everyone thinks is the fun part. But now you know the secret: a chart is only as honest as the data behind it. A gorgeous chart built on dirty data is just a beautiful lie."
    },
    {
      id: "vocab1",
      type: "vocab_list",
      terms: [
        { term: "TRIM", definition: "A spreadsheet function that removes extra spaces from the beginning and end of a text value. =TRIM(A2) cleans whatever is in cell A2." },
        { term: "Find & Replace", definition: "A tool (Ctrl+H) that searches for a specific string of text and replaces every instance with a new value. Essential for fixing typos across an entire dataset at once." },
        { term: "Remove Duplicates", definition: "A Sheets feature (Data → Data cleanup → Remove duplicates) that finds and deletes rows that are identical across all selected columns." },
        { term: "Data Cleaning", definition: "The process of detecting and fixing errors, inconsistencies, and missing values in a dataset before analysis. Often the most time-consuming part of data work." },
        { term: "Helper Column", definition: "A temporary extra column used to apply a formula (like TRIM or VALUE) to a messy column. Once the clean version is ready, you paste it as values and delete the helper column." }
      ]
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
