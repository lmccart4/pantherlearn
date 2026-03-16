// seed-data-literacy-5.js
// Lesson 5: "Chart Crimes"
// Unit: Data Literacy | Course: Digital Literacy | Order: 16
// Run: node seed-data-literacy-5.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-5-chart-crimes";

const lesson = {
  title: "Chart Crimes",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 16,
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
      content: "By the end of this lesson, you will be able to:\n\n• Create bar charts, line charts, and pie charts in Google Sheets\n• Choose the right chart type for different data questions\n• Identify what makes a chart misleading versus trustworthy"
    },
    {
      id: "b2",
      type: "text",
      content: "**Spot the Manipulation**\n\nHere are two line charts showing the exact same streaming revenue data. Both use the same title, the same data points, and the same time period (January–June).\n\n**Chart A:** The y-axis starts at $8,000,000. The line climbs from $8.2M in January to $8.9M in June. The jump looks dramatic — like revenue nearly doubled.\n\n**Chart B:** The y-axis starts at $0. The same line runs from $8.2M to $8.9M. The jump is visible but modest — a 9% increase that looks like what it actually is.\n\nSame data. Same six months. Same $700,000 increase."
    },
    {
      id: "q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which chart makes it look like streaming revenue is exploding?",
      options: [
        "Chart A — the y-axis starting at $8M makes the growth look enormous",
        "Chart B — starting at zero makes the line shoot up dramatically",
        "Both look the same — the data is the same so the charts are identical",
        "Neither shows growth — revenue went down from June to July"
      ],
      correctIndex: 0,
      explanation: "Chart A commits the truncated y-axis crime. By starting at $8 million instead of zero, a 9% increase ($700,000) looks like a near-doubling. Chart B, with an honest zero baseline, shows the same increase as what it actually is: real but modest growth. The data is identical. The story is completely different."
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "They show the exact same numbers. How is it possible that they tell completely different stories? Who might use Chart A instead of Chart B, and why?",
      placeholder: "They tell different stories because... Someone who would use Chart A might be..."
    },
    {
      id: "b3",
      type: "text",
      content: "A chart is an argument. The person who makes it gets to choose what story the data tells — which axis to start at, which colors to use, what to label, what to leave out. Today you learn to make charts yourself. And to make HONEST ones."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~25 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: Chart Laboratory",
      subtitle: "~25 minutes",
      icon: "📊"
    },
    {
      id: "b4",
      type: "text",
      content: "**Quick Chart Type Guide — Which one do you use?**\n\n**Bar chart** — Comparing categories side by side. *'Which genre has the most songs?'* Use this when you want to show how different groups compare.\n\n**Line chart** — Change over time. *'How have streams trended year by year?'* Use this when time is on the x-axis and you're showing a trend.\n\n**Pie chart** — Parts of a whole. *'What percentage of songs are each genre?'* Use this ONLY when you have 5 or fewer categories and they add up to 100%. (Warning: pie charts are overused and often terrible.)\n\n**Scatter plot** — Relationship between two numbers. *'Is there a connection between BPM and Danceability Score?'* Use this when you want to see if two columns are correlated."
    },
    {
      id: "b5",
      type: "definition",
      term: "Data Visualization",
      definition: "A visual representation of data — like a chart, graph, or map — designed to make patterns, trends, and comparisons easier to understand at a glance. A good visualization reveals something true. A bad one hides or distorts it."
    },
    {
      id: "b6",
      type: "text",
      content: "**Task 1: Build a Bar Chart**\n\nUsing your clean Top Streaming Songs dataset, create a bar chart comparing total streams by genre.\n\nHow to do it:\n1. You'll need the total streams for each genre. You can either use SUMIF (which you'll learn next class) or filter genre by genre and write down each total — your choice.\n2. Create a small table somewhere in your sheet with Genre in one column and Total Streams in another (6 rows, one per genre).\n3. Select that table → Insert → Chart → Change chart type to Bar Chart.\n4. Label your axes and add a title that's a full sentence, not just 'Streams by Genre.'"
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the headline for your bar chart? Write it the way a newspaper would — a complete sentence that tells the story, not just a label. Example: 'Pop Accounts for Nearly Half of All Streams Despite Having Fewer Songs Than Hip-Hop'",
      placeholder: "HEADLINE: ..."
    },
    {
      id: "b7",
      type: "text",
      content: "**Task 2: Build a Line Chart**\n\nCreate a line chart showing the number of songs released per year in the dataset.\n\nHow to do it:\n1. Create a small table with Year in one column and Song Count in another.\n2. To count songs per year: filter to each year and use COUNT, OR manually count the songs for each year from the data.\n3. Select your year/count table → Insert → Chart → Line Chart.\n4. Label both axes. Does the trend go up, down, or stay roughly flat?"
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "What story does your line chart tell? Describe the trend — is it going up, down, or bumpy? Is there anything surprising about when songs were released?",
      placeholder: "My line chart shows that... I was surprised by..."
    },
    {
      id: "b8",
      type: "text",
      content: "**Task 3: Build a Pie Chart (and critique it)**\n\nCreate a pie chart showing the percentage of songs in each genre.\n\nHow to do it:\n1. Use your Genre/Count table from Task 2, but with song count per genre instead of year.\n2. Select that table → Insert → Chart → Pie Chart.\n3. Now step back and look at it critically."
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "Was the pie chart actually useful here? With 6 genres, could you easily compare the slices just by looking? When would a pie chart be the WRONG choice — and when would it actually be the right one?",
      placeholder: "The pie chart was/wasn't useful because... A pie chart is wrong when... It works best when..."
    },
    {
      id: "b9",
      type: "callout",
      style: "insight",
      content: "**The Pie Chart Rule:** If your pie chart has more than 5 slices, or any slice is under 5% of the total, switch to a bar chart. Humans are surprisingly bad at comparing angles and areas. We're much better at comparing heights (bars). Pie charts look impressive. Bar charts communicate better."
    },
    {
      id: "div1",
      type: "divider"
    },
    {
      id: "b10",
      type: "text",
      content: "**The Chart Crime Lab**\n\nHere's a chart described in all its terrible glory:\n\nImagine a 3D exploding pie chart — a pie chart where the slices are physically separated and tilted at a 3D perspective angle. There are 10 slices. The colors are: hot pink, neon green, electric blue, orange, purple, yellow, teal, red, brown, and white. No numbers appear anywhere on the chart. No percentages on the slices. No legend explaining what each color means. The title says 'Q3 Survey Results.' There is no source. The background is a photo of an office. The 3D perspective makes the bottom slices look much larger than the top ones even if they're the same size."
    },
    {
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "List everything wrong with this chart. Then redesign it — describe what you would do differently to make it actually communicate the data. Be specific.",
      placeholder: "Things wrong:\n1. ...\n2. ...\n\nMy redesign would: ..."
    },
    {
      id: "b11",
      type: "callout",
      style: "warning",
      content: "**The 5-Second Rule:** A good chart should be understood in 5 seconds. Title tells you the topic. Axes tell you what's being measured. Bars or lines tell you the comparison or trend. If a viewer has to study your chart for 30 seconds to figure out what it means, it needs to be redesigned — no matter how cool it looks."
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
      prompt: "In our first class, you evaluated other people's data visualizations and spotted their problems. Now that you've made your own charts from scratch, what do you understand about chart design that you didn't understand before? What's harder than it looks?",
      placeholder: "Before making charts myself, I thought... Now I understand that..."
    },
    {
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the single most important rule you'll follow every time you make a chart from now on? State it as a rule you could teach to someone else.",
      placeholder: "My Rule #1 for charts: ..."
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
