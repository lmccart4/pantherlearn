// seed-data-literacy-6.js
// Lesson 6: "Teaching the Spreadsheet to Think"
// Unit: Data Literacy | Course: Digital Literacy | Order: 17
// Run: node seed-data-literacy-6.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-6-teaching-spreadsheet-to-think";

const lesson = {
  title: "Teaching the Spreadsheet to Think",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 17,
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
      content: "By the end of this lesson, you will be able to:\n\n• Write IF statements to make the spreadsheet categorize data automatically\n• Use COUNTIF and SUMIF to answer conditional questions about the dataset\n• Apply conditional formatting to reveal visual patterns in data"
    },
    {
      id: "b2",
      type: "text",
      content: "Your principal stops you in the hall and asks: 'How many songs in our dataset have over 1,000 million streams?'\n\nYou have 118 rows. Are you going to scroll through and count by hand? Circle every matching row? That would take 10 minutes and you'd probably miscount.\n\nOr — you could type one formula and have the answer in 3 seconds.\n\nThat's conditional logic. You're not doing the counting. You're giving the spreadsheet a rule, and letting it count for you."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Imagine you have a giant pile of papers and need to pull out only the ones from a specific person, written before 2020, that are marked 'urgent.' What step-by-step instructions would you give a robot to sort that pile for you? Be as specific as you can.",
      placeholder: "Step 1: Look at the 'From' field. If it says [name], keep it — otherwise, set it aside. Step 2: ..."
    },
    {
      id: "b3",
      type: "text",
      content: "That's exactly what conditional logic is — giving the spreadsheet IF/THEN rules.\n\n*'IF this condition is true, THEN do this. OTHERWISE, do something else.'*\n\nSpreadsheets follow rules perfectly, every single time, across every row. You write the rule once, and it checks all 118 rows in milliseconds."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~25 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: Teaching the Spreadsheet Your Rules",
      subtitle: "~25 minutes",
      icon: "🧠"
    },
    {
      id: "b4",
      type: "definition",
      term: "Conditional Logic",
      definition: "Rules that tell a computer to make decisions based on conditions. The basic structure: IF [condition is true] THEN [do this] ELSE [do something else]. Every app on your phone runs on millions of these decisions per second."
    },
    {
      id: "b5",
      type: "text",
      content: "**The IF Function**\n\n`=IF(E2>1000, \"Viral\", \"Not Viral\")`\n\nBreak it down:\n- **E2>1000** — This is the TEST. Is the number in E2 greater than 1000?\n- **\"Viral\"** — This is what appears if the test is TRUE.\n- **\"Not Viral\"** — This is what appears if the test is FALSE.\n\nType this in an empty column next to row 2, then drag the formula down all 118 rows. Every song gets automatically labeled. 118 decisions, zero effort."
    },
    {
      id: "b6",
      type: "activity",
      title: "IF Statement Playground",
      instructions: "Open your clean Top Streaming Songs dataset. Find an empty column (like column I or J) and start building IF statements. Work through the questions below."
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "In column I, write an IF statement that labels every song as 'Viral' (over 1,000M streams), 'Popular' (500–1,000M streams), or 'Underground' (under 500M streams). You'll need to nest two IF statements inside each other. Write out the complete formula you used.",
      placeholder: "Formula: =IF(E2>1000, \"Viral\", IF(E2>500, \"Popular\", \"Underground\"))\n(Try it, then adjust if needed)"
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "After applying your Viral/Popular/Underground formula to all rows, how many songs fall into each category? What does the distribution tell you about what it takes to be a 'viral' song?",
      placeholder: "Viral: ___ songs\nPopular: ___ songs\nUnderground: ___ songs\n\nThis tells me that..."
    },
    {
      id: "div1",
      type: "divider"
    },
    {
      id: "b7",
      type: "text",
      content: "IF statements work one cell at a time. But what if you want to count ALL the Pop songs at once, or add up ALL the streams from Latin artists?\n\nThat's where COUNTIF and SUMIF come in. They let you ask conditional questions across the entire dataset in a single formula."
    },
    {
      id: "b8",
      type: "definition",
      term: "COUNTIF",
      definition: "Counts how many cells in a range meet a specific condition. Structure: =COUNTIF(range, condition). Example: =COUNTIF(C2:C119, \"Pop\") counts how many rows in the Genre column contain 'Pop'. Use this when you want to know HOW MANY."
    },
    {
      id: "b9",
      type: "definition",
      term: "SUMIF",
      definition: "Adds up values in one column only for rows where another column meets a condition. Structure: =SUMIF(condition_range, condition, sum_range). Example: =SUMIF(C2:C119, \"Pop\", E2:E119) adds up streams ONLY for Pop songs. Use this when you want a TOTAL for a specific group."
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "Use COUNTIF to find how many songs are in each genre. Create a small table somewhere in your sheet with all 6 genres. Write out one of your COUNTIF formulas as an example, then list the results.",
      placeholder: "Example formula: =COUNTIF(C2:C119, \"Hip-Hop\")\n\nPop: ___\nHip-Hop: ___\nR&B: ___\nLatin: ___\nRock: ___\nElectronic: ___"
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "Use SUMIF to find the total streams for each genre. Which genre has the most TOTAL streams? Is that the same genre that has the most songs, or different? What does that tell you?",
      placeholder: "Genre with most total streams: ...\nGenre with most songs: ...\nThey are the same / different, which means..."
    },
    {
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "Calculate the AVERAGE streams per song for each genre manually: take each genre's total streams (from SUMIF) and divide by its song count (from COUNTIF). Which genre has the highest average streams per song? Why do you think that might be?",
      placeholder: "Highest average: [genre] with roughly ___ million streams per song\nI think this is because..."
    },
    {
      id: "div2",
      type: "divider"
    },
    {
      id: "b10",
      type: "text",
      content: "**One More Trick: Conditional Formatting**\n\nInstead of writing a formula, you can make the spreadsheet VISUALLY highlight patterns automatically. Red cells for low values, green for high values — and the patterns pop out immediately without reading a single number.\n\nHow to do it:\n1. Select your Streams column (E2:E119)\n2. Format → Conditional formatting\n3. Choose 'Color scale' at the bottom\n4. The default red-yellow-green scale works great — green for high, red for low\n5. Click Done"
    },
    {
      id: "b11",
      type: "activity",
      title: "Apply Conditional Formatting",
      instructions: "Apply a color scale to the Streams column. Then do the same to the Danceability Score column. Take a moment to just look at the colors without reading numbers."
    },
    {
      id: "q7",
      type: "question",
      questionType: "short_answer",
      prompt: "What pattern do you see in the colored Streams column that you couldn't easily see before? Does the Danceability Score column show any pattern you notice when the color scale is applied?",
      placeholder: "In the Streams column, I can now see that... In the Danceability column, I notice..."
    },
    {
      id: "b12",
      type: "callout",
      style: "insight",
      content: "**This is the foundation of all programming.** Every app you use — Instagram, Spotify, YouTube — runs on IF/THEN decisions. Millions of them per second. You just wrote your first programmatic rules. COUNTIF and SUMIF work on the exact same logic as database queries that run the world's largest companies. You're not just learning spreadsheets — you're thinking computationally."
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
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "You've gone from sorting data, to writing formulas, to teaching the spreadsheet to make decisions for you. In your own words, why is that a significant jump? What's different about conditional logic compared to just doing math?",
      placeholder: "The difference is... It matters because..."
    },
    {
      id: "q9",
      type: "question",
      questionType: "short_answer",
      prompt: "Name one real-world situation — outside of school and outside of music data — where COUNTIF would be genuinely useful. Be specific about what you're counting and why it matters.",
      placeholder: "COUNTIF would be useful for... because someone would need to know..."
    },
    {
      id: "vocab1",
      type: "vocab_list",
      terms: [
        { term: "IF Statement", definition: "A formula that makes a decision based on a condition: =IF(test, value_if_true, value_if_false). The spreadsheet checks the test for every row and returns the appropriate result." },
        { term: "Nested IF", definition: "An IF statement inside another IF statement, allowing for three or more possible outcomes. Example: =IF(A>1000, \"High\", IF(A>500, \"Medium\", \"Low\"))." },
        { term: "COUNTIF", definition: "Counts cells in a range that meet a specific condition. =COUNTIF(range, \"condition\"). Returns a number." },
        { term: "SUMIF", definition: "Adds up values in a sum_range only for rows where a condition_range meets a condition. =SUMIF(condition_range, \"condition\", sum_range)." },
        { term: "Conditional Formatting", definition: "A Sheets feature that automatically changes a cell's color or style based on its value. Color scales, highlight rules, and data bars are common types." },
        { term: "Conditional Logic", definition: "Decision-making based on conditions: IF this is true, THEN do this; OTHERWISE do something else. The foundation of all programming and data automation." }
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
