// seed-data-literacy-7.js
// Lesson 7: "The Investigation Begins"
// Unit: Data Literacy | Course: Digital Literacy | Order: 18
// Run: node seed-data-literacy-7.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-7-investigation-begins";

const lesson = {
  title: "The Investigation Begins",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 18,
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
      content: "By the end of this lesson, you will be able to:\n\n• Select a dataset and form a strong, specific research question\n• Plan an investigation strategy using the skills you've built so far\n• Begin exploring your chosen dataset and adjust your question based on what you find"
    },
    {
      id: "b2",
      type: "text",
      content: "For the last six classes, you've been building skills — sorting, formulas, cleaning, charts, conditional logic. Every one of those tools was practice for this moment.\n\nNow it's time to use ALL of them. You're going to investigate a real dataset and uncover a story that nobody has told yet. This is the real thing."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What makes a good investigation question? Think about journalism — what separates an interesting question that leads to a real story from a boring question that just produces a list of facts?",
      placeholder: "A good investigation question is one that... It's different from a bad one because..."
    },
    {
      id: "b3",
      type: "callout",
      style: "insight",
      content: "**What makes a strong data question?**\n\nToo vague: *'What's in this dataset?'*\nToo obvious: *'Who has the most points in NBA history?'* (just Google it)\nJust right: *'Do players with higher assists averages also tend to have higher shooting percentages, or are they different skills entirely?'*\n\nA strong question is SPECIFIC enough to answer with evidence, INTERESTING enough that someone would want to read the answer, and actually ANSWERABLE with the data you have."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~25 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: Choose Your Investigation",
      subtitle: "~25 minutes",
      icon: "🔍"
    },
    {
      id: "b4",
      type: "text",
      content: "**THE PROJECT**\n\nOver the next three classes, you will:\n1. Choose a real dataset\n2. Form a research question\n3. Clean and analyze the data\n4. Create visualizations that tell the story\n5. Present your findings as a one-page data story\n\nThis is everything you've learned, applied to something YOU choose. Your teacher becomes a consultant. You're the investigator."
    },
    {
      id: "b5",
      type: "text",
      content: "**YOUR DATASET OPTIONS**\n\nEach dataset is a Google Sheet — make a copy to edit it. Pick the one that genuinely interests you. Curiosity produces better investigations.\n\n---\n\n**Option 1: Daily Weather 2024**\n366 days of weather data — high/low temps, precipitation, humidity, wind speed, UV index, and daily conditions for a full year. Good questions: seasonal patterns, extreme weather days, connections between humidity and temperature, or whether UV index correlates with temperature.\n📊 https://docs.google.com/spreadsheets/d/1zadAOLG94Ds-tbso1cUqOB1DnGBka2of/edit?usp=sharing\n\n---\n\n**Option 2: Video Game Sales**\n150 games with platform, genre, publisher, regional sales (NA, EU, JP, other), Metacritic score, and ESRB rating. Good questions: what separates high-selling from low-selling games, platform wars, whether critic scores predict sales, or genre trends over time.\n🎮 https://docs.google.com/spreadsheets/d/1pkEYnYUOFSMb1AkjPhOSuitNS5SALnTI/edit?usp=sharing\n\n---\n\n**Option 3: School Cafeteria Sales**\n2,000+ rows of daily lunch item sales for a full semester — every menu item, every school day, with quantities sold and prices. Good questions: which items dominate, day-of-week patterns, revenue distribution, or whether item popularity changes over the semester.\n🥗 https://docs.google.com/spreadsheets/d/1Wqli7teqGeGqJQ1a1yNq7485PiBB1OS_/edit?usp=sharing\n\n---\n\n**Option 4: NBA Player Stats**\n100 players with full stat lines — points, rebounds, assists, shooting percentages, minutes played, and position. Good questions: what makes a player valuable, how stats differ by position, efficiency vs. volume, or which stats are most connected.\n🏀 https://docs.google.com/spreadsheets/d/1OtFvkWHiDARSvqR0PuHHqN_wnJHZWhp_/edit?usp=sharing\n\n---\n\n**Option 5: Student Screen Time Survey**\n200 students reporting daily screen time, favorite platforms, gaming hours, sleep hours, GPA, extracurriculars, and self-reported mood. Good questions: does screen time connect to sleep, do platform choices relate to GPA, or which activities go together.\n📱 https://docs.google.com/spreadsheets/d/1tG10DweJdwqpq7enUQ5HXOFEr43hK8nE/edit?usp=sharing"
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "Which dataset did you choose, and why? What is it about this dataset that you're genuinely curious about?",
      placeholder: "I chose [dataset] because... I'm curious about whether..."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "Write THREE possible research questions about your dataset. Make each one specific and answerable with the data — not 'what's interesting in this data?' but an actual question with a specific angle.",
      placeholder: "Question 1: ...\nQuestion 2: ...\nQuestion 3: ..."
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "Which of your three questions is the strongest? Why? Think about: Is it specific enough? Is it genuinely interesting — would someone want to know the answer? Can the columns in your dataset actually answer it?",
      placeholder: "The strongest question is #___ because... I might need to adjust it by..."
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "What columns in your dataset will you need to answer your question? What formulas or techniques from this unit do you think you'll use? Make your best prediction.",
      placeholder: "I'll need columns: ...\nI'll probably use: COUNTIF / SUMIF / IF statements / charts / ..."
    },
    {
      id: "div1",
      type: "divider"
    },
    {
      id: "b6",
      type: "activity",
      title: "First Pass Exploration",
      instructions: "Open your chosen dataset and make a copy. Then work through the checklist below. The goal is to get familiar with what's in the data before you commit to your final research question."
    },
    {
      id: "b7",
      type: "checklist",
      title: "First Pass Exploration Checklist",
      items: [
        "Sort and filter to get a feel for the data — what's actually in here? How many rows? How many columns?",
        "Scan for messiness — does anything look wrong? Extra spaces, typos, blank rows, inconsistent formatting?",
        "Run SUM, AVERAGE, and COUNT on your most important numeric column — what are the basic facts of this dataset?",
        "Sort by your most interesting column (highest to lowest) — who or what is at the top? Does anything surprise you?",
        "Check whether your research question still makes sense given what you're actually seeing in the data"
      ]
    },
    {
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "Based on your first look at the actual data, does your research question still make sense? Did you discover anything that makes you want to refine it or go in a different direction? Explain.",
      placeholder: "After exploring, my question still makes sense / needs adjustment because... I now want to ask..."
    },
    {
      id: "b8",
      type: "callout",
      style: "insight",
      content: "**Real investigators adjust their questions as they learn more.** When a journalist starts researching a story, they don't always end up writing the story they planned. The data leads them somewhere better. Changing your question isn't failure — it's called good research."
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
      prompt: "Write your FINAL research question for this project. It should be specific, interesting, and answerable with the data you have. This is your north star for the next two classes.",
      placeholder: "My final research question: ..."
    },
    {
      id: "b9",
      type: "text",
      content: "Tomorrow: you dig in. Clean your data, crunch the numbers, and start building the evidence for your story. Come ready to work — tomorrow's class is mostly hands-on."
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
