// seed-data-literacy-1.js
// Lesson 1: "Data Is Everywhere"
// Unit: Data Literacy | Course: Digital Literacy | Order: 12
// Run: node seed-data-literacy-1.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-1-data-is-everywhere";

const lesson = {
  title: "Data Is Everywhere",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 12,
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
      title: "Lesson Objectives",
      items: [
        "Identify data in your everyday life",
        "Evaluate whether a data visualization is trustworthy or misleading",
        "Explain what data literacy means and why it matters"
      ]
    },
    {
      id: "b2",
      type: "text",
      content: "**Two Truths and a Lie — Data Edition**\n\nHere are three statistics about things you probably care about. Two of them are based in real data. One is completely made up — but it sounds real.\n\n**Statement A:** The global video gaming industry now earns more revenue annually than the film industry and music industry combined.\n\n**Statement B:** Students who listen to music while studying score an average of 12% higher on standardized tests than those who study in silence.\n\n**Statement C:** By 2023, the five most-streamed songs on Spotify had each been streamed more than 3 billion times."
    },
    {
      id: "q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the three statistics is the LIE?",
      options: [
        "Statement A — Gaming earns more than film and music combined",
        "Statement B — Music while studying boosts test scores by 12%",
        "Statement C — Five songs have passed 3 billion streams each"
      ],
      correctIndex: 1,
      explanation: "Statement B is fabricated. While some studies suggest background music can help some learners with certain tasks, no credible research supports a 12% standardized test score boost. Statements A and C are both based on real data — gaming revenue has exceeded film and music combined, and multiple songs have crossed 3 billion Spotify streams."
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "What made you pick your answer? What made the other statements feel true — or suspicious?",
      placeholder: "Think about which one felt 'too good to be true' or which ones you've heard before..."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "How many times do you think you interact with data in a single day? List as many examples as you can think of — not just school stuff. Think about your phone, your social media feed, your morning routine.",
      placeholder: "I interact with data when I check my notifications, when Netflix recommends shows, when..."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~25 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: The Investigation Begins",
      subtitle: "~25 minutes",
      icon: "🔍"
    },
    {
      id: "b3",
      type: "text",
      content: "Data isn't just numbers in a spreadsheet. It's every list, every chart, every stat on social media, every recommendation algorithm deciding what you see next. When Spotify creates your Wrapped, that's data. When schools post attendance rates, that's data. When your favorite athlete posts their stats, that's data.\n\nFor the next 10 classes, you're becoming **data detectives**. You'll learn to find stories hidden in numbers, spot when someone's trying to trick you with a chart, and eventually tell your own data-driven stories. It starts today — not with a spreadsheet, but with your eyes."
    },
    {
      id: "b4",
      type: "activity",
      title: "Good Charts vs. Chart Crimes",
      instructions: "You're about to evaluate 5 data visualizations. Each one is described in detail below (we use descriptions instead of images so you can focus on the data and design, not just how it looks). For each one, read carefully, answer the multiple choice question, and explain your thinking."
    },
    {
      id: "b5",
      type: "text",
      content: "**Chart 1: Phone Screen Time by Age Group**\n\nA bar chart comparing average daily phone screen time for teens (5.2 hours) vs. adults (4.8 hours). The chart has a professional design with clean colors and a source citation at the bottom. But look closely at the y-axis — it starts at 4 hours, not 0. The difference between the two bars looks enormous, like teens use their phones twice as much as adults."
    },
    {
      id: "q4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Chart 1 — Is this visualization trustworthy, misleading, or unclear?",
      options: [
        "Trustworthy — it cites its source and uses clean design",
        "Misleading — the y-axis doesn't start at zero, making a small difference look huge",
        "Unclear — there isn't enough information to tell",
        "Trustworthy — the data about teens using phones more is probably accurate"
      ],
      correctIndex: 1,
      explanation: "This is a classic chart crime: the truncated y-axis. By starting at 4 hours instead of 0, the visual difference between 5.2 and 4.8 hours looks enormous — even though it's actually just 0.4 hours (24 minutes) difference. A clean design and source citation don't make a misleading scale honest."
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "In your own words, why does starting the y-axis at 4 instead of 0 make the chart misleading? Who might want to make this chart look this way, and why?",
      placeholder: "Think about who benefits from making the teen-adult difference look bigger than it is..."
    },
    {
      id: "b6",
      type: "text",
      content: "**Chart 2: How Students Spend Their Free Time**\n\nA pie chart with 5 slices: Gaming (28%), Social Media (31%), Sports (22%), Reading (19%), and Hanging Out (18%). The slices look great — colorful, labeled, professional. But here's the problem: if you add up all the percentages, you get **118%**. No note anywhere explains why the numbers don't add up to 100%."
    },
    {
      id: "q6",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Chart 2 — Is this visualization trustworthy, misleading, or unclear?",
      options: [
        "Trustworthy — the categories make sense and the chart looks professional",
        "Misleading — pie charts should always add to exactly 100%",
        "Misleading — without explaining that students could pick multiple activities, the percentages are meaningless",
        "Unclear — we'd need to know the sample size before deciding"
      ],
      correctIndex: 2,
      explanation: "The percentages add up to 118% because students were allowed to select multiple activities. A pie chart implies parts of a whole — but if students could pick more than one thing, slices overlap, and the 'whole' isn't 100%. Without a note explaining this, viewers assume the chart is just wrong, or worse, they believe the misleading percentages without questioning them."
    },
    {
      id: "q7",
      type: "question",
      questionType: "short_answer",
      prompt: "Imagine you're redesigning Chart 2 so it's honest and readable. What would you change — the chart type, the labels, the explanation? Describe your redesign.",
      placeholder: "Instead of a pie chart, I would use... because..."
    },
    {
      id: "b7",
      type: "text",
      content: "**Chart 3: Global Average Temperature, 1900–2023**\n\nA clean, well-labeled line graph showing how the global average temperature has changed over 123 years. The x-axis runs from 1900 to 2023. The y-axis shows temperature in degrees Celsius with clearly labeled increments. The title reads 'Global Average Temperature Anomaly.' Source: NASA. The line shows a noticeable upward trend — flat through mid-century, then a steady, clear climb from the 1980s onward."
    },
    {
      id: "q8",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Chart 3 — Is this visualization trustworthy, misleading, or unclear?",
      options: [
        "Trustworthy — clear labels, honest scale, credible source, and the data supports the trend shown",
        "Misleading — the upward trend is exaggerated to make climate change seem worse than it is",
        "Unclear — we can't trust NASA without seeing their methodology",
        "Misleading — temperature data from 1900 isn't reliable enough to chart"
      ],
      correctIndex: 0,
      explanation: "This is a well-made chart. It has labeled axes, a clear title, an honest scale starting from a meaningful baseline, and a credible, citable source (NASA). The upward trend shown matches what multiple independent scientific organizations have verified. Good charts don't have to be complicated — they just have to be honest."
    },
    {
      id: "q9",
      type: "question",
      questionType: "short_answer",
      prompt: "Chart 3 shows the same story as many other climate charts — but some people still don't trust it. What would it take for you personally to trust a chart about a controversial topic like climate change? What questions would you ask?",
      placeholder: "I would want to know who funded the research, whether other scientists have checked the data..."
    },
    {
      id: "b8",
      type: "text",
      content: "**Chart 4: Survey Results**\n\nA 3D exploding pie chart — picture a pie chart where the slices are pulled apart and tilted in 3D perspective. There are 10 slices in rainbow colors: hot pink, neon green, electric blue, and so on. None of the slices are labeled with numbers. The title just says 'Survey Results.' No source is listed. No note explains what the survey asked or who answered it. The 3D perspective makes some slices look bigger or smaller than they actually are."
    },
    {
      id: "q10",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Chart 4 — Is this visualization trustworthy, misleading, or unclear?",
      options: [
        "Trustworthy — colorful charts are more engaging and reach more audiences",
        "Unclear — without knowing what question was asked, we can't evaluate it",
        "Misleading — the 3D effect distorts the data and there's no source or context",
        "Both B and C — it's both unclear AND misleading at the same time"
      ],
      correctIndex: 3,
      explanation: "Both B and C are correct. The chart is unclear because we have no idea what was surveyed or who responded. And it's misleading because 3D pie charts distort angles — slices at the front of the 3D perspective look bigger than they are. This is a chart crime trifecta: no context, no source, and a design that actively distorts the data."
    },
    {
      id: "q11",
      type: "question",
      questionType: "short_answer",
      prompt: "List every single thing wrong with Chart 4 that you can identify. Then describe the simplest possible fix — what would you need to add or change to make this chart usable?",
      placeholder: "Things wrong: no labels, 3D distortion, no source... To fix it, I would..."
    },
    {
      id: "b9",
      type: "text",
      content: "**Chart 5: Instagram Infographic — 'The Secret to Success'**\n\nA sleek Instagram infographic with bold typography and a clean aesthetic. It says: **'90% of successful people wake up before 6 AM.'** Below that, in smaller text: 'Start your morning routine today.' The design is professional — it looks like something a major wellness brand would post. No source is listed. No definition of 'successful.' No sample size. No methodology. Just the stat, huge and confident."
    },
    {
      id: "q12",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Chart 5 — Is this visualization trustworthy, misleading, or unclear?",
      options: [
        "Trustworthy — it's well-designed and the claim seems reasonable",
        "Misleading — 90% is an exaggerated number designed to get shares",
        "Unclear and misleading — no source, no definition of 'successful,' no sample size means the stat is meaningless",
        "Unclear — we'd need to see the original study to evaluate it"
      ],
      correctIndex: 2,
      explanation: "This is a textbook example of a misleading stat dressed up in a credible package. 'Successful' is never defined — does it mean wealthy? Happy? Famous? Without a definition, a source, or a sample size, the 90% figure is impossible to verify or falsify. The professional design is part of the trick — it makes the stat feel more credible than it is."
    },
    {
      id: "q13",
      type: "question",
      questionType: "short_answer",
      prompt: "You've probably seen infographics like Chart 5 all over social media. Why do you think people share them even when they have no source? What makes them feel believable?",
      placeholder: "I think people share them because they confirm what people already believe, or because..."
    },
    {
      id: "b10",
      type: "callout",
      style: "insight",
      content: "**Rule #1 of Data Literacy:** Always ask — who made this, why did they make it, and what are they trying to make me believe?\n\nEvery chart is an argument. The person who made it chose what to include, what to leave out, where to start the axis, and what colors to use. Understanding data literacy means understanding that none of those choices are neutral."
    },
    {
      id: "b11",
      type: "definition",
      term: "Data Literacy",
      definition: "The ability to read, understand, create, and communicate data. It means being able to look at numbers, charts, and statistics and figure out what they really mean — and what they might be hiding. A data-literate person asks questions, checks sources, and thinks critically before believing what a chart shows."
    },
    {
      id: "q14",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about a chart, statistic, or infographic you've seen recently — on social media, in the news, at school, or anywhere else. Describe it. Do you trust it? Why or why not?",
      placeholder: "I saw a post that said... I trust/don't trust it because..."
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
      id: "q15",
      type: "question",
      questionType: "short_answer",
      prompt: "After today's class, what's one thing you'll look at differently the next time you see a chart or statistic online? Be specific.",
      placeholder: "From now on, when I see a chart, I'll always check whether..."
    },
    {
      id: "b12",
      type: "callout",
      style: "highlight",
      content: "**Next time:** You get your hands on a real dataset for the first time. 118 songs, 8 columns, and stories hidden inside. The investigation begins."
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
