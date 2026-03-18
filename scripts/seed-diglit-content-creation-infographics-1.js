// seed-diglit-content-creation-infographics-1.js
// Creates "Infographics — Turning Data Into a Story" (Dig Lit, Unit 5, Lesson 25)
// Run: node scripts/seed-diglit-content-creation-infographics-1.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Infographics — Turning Data Into a Story",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 25,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "📊",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Statistics are powerful — but most people don't read statistics. They glance at them, don't connect emotionally, and move on.\n\nInfographics change that. They take the same data and translate it into a visual story that people actually stop and read.\n\nWhy does a picture of data land harder than the data itself? Because your brain processes images **60,000 times faster** than text."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why does a well-designed infographic convince people more than a paragraph of statistics?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Have you ever shared or saved an infographic online? If yes — what made it worth sharing? If no — what kind of data or topic would actually make you share one?",
      placeholder: "My answer...",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain what makes an infographic effective vs. just a decorated chart",
        "Identify the 5 required components of a strong infographic",
        "Begin designing an infographic using data of your choice"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "The 5 Parts of Every Infographic",
      subtitle: "~15 minutes"
    },
    {
      id: "b-five-parts",
      type: "text",
      content: "Every strong infographic has these 5 components:\n\n**1. Headline**\nNot a vague title — a **specific claim**. This is the biggest difference between a weak and strong infographic.\n> ❌ *\"Phone Usage Statistics\"*\n> ✅ *\"65% of teens check their phone within 5 minutes of waking up\"*\n\nThe headline is the takeaway. If someone only reads one thing, this should be it.\n\n**2. Data**\nThe actual numbers. Must be **accurate and sourced**. A number without a source is just a guess.\n\n**3. Visuals**\nIcons, charts, and illustrations that **match the data** — not decorative clip art that's only loosely related. The visual should make the number hit harder, not distract from it.\n\n**4. Flow**\nThe viewer's eye should follow a clear path — usually top-to-bottom or left-to-right. Use spacing and hierarchy (from Lesson 24) to create this path.\n\n**5. Source**\nWhere the data came from. No source = no credibility. Always include it, even if it's small."
    },
    {
      id: "callout-decorated-chart",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Infographic vs. Decorated Chart:**\n- A decorated chart just adds colors and icons to a spreadsheet. The data is still hard to understand.\n- A real infographic **tells a story** — it has a specific argument (the headline), visuals that prove it, and a clear flow that makes the point unavoidable.\n\nThe question isn't \"does it look nice?\" — it's \"does it change how you think about the data?\""
    },
    {
      id: "q-headline",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which headline makes a stronger infographic?",
      options: [
        "\"Social Media Statistics 2025\"",
        "\"Americans Spend More Time on Social Media Each Day Than Eating, Drinking, and Exercising Combined\"",
        "\"Facts About Social Media\"",
        "\"Social Media: The Numbers\""
      ],
      correctIndex: 1,
      explanation: "Option B makes a specific, surprising claim that immediately gives the viewer something to think about. The others are vague titles that don't tell you anything — they describe the topic but don't make a point. The headline should be the takeaway, not just the topic.",
      difficulty: "evaluate"
    },
    {
      id: "q-visuals",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An infographic about teen sleep deprivation shows a chart of hours slept per age group, with a small icon of a moon next to each bar. What would make the visuals stronger?",
      options: [
        "Add more icons — at least one per data point",
        "Replace the moon icon with a bed icon to directly match the subject (sleep vs. night)",
        "Remove all icons and just use the chart",
        "Make the chart colorful by adding as many colors as possible"
      ],
      correctIndex: 1,
      explanation: "Good infographic visuals match the data specifically, not just the general theme. A moon suggests 'night' but a bed more directly represents 'sleep.' The goal is to make the visual reinforce the data — not just decorate it. And more icons aren't better — they create clutter.",
      difficulty: "apply"
    },
    {
      id: "q-flow",
      type: "question",
      questionType: "short_answer",
      prompt: "What does it mean for an infographic to have good 'flow'? How does a viewer know where to look next? Use what you learned in Lesson 24 (visual hierarchy) to explain.",
      placeholder: "Good flow means... Viewers know where to look next because...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // BUILD YOUR INFOGRAPHIC
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Start Your Infographic",
      subtitle: "~15 minutes"
    },
    {
      id: "b-build-intro",
      type: "text",
      content: "You're going to build an infographic using real data. Pick your data source:\n\n**Option A:** Use data from your spreadsheets project in Unit 4 (if you have it)\n\n**Option B:** Use one of these provided datasets:\n- Teen screen time statistics (average hours/day by activity)\n- School lunch participation rates (your school or national)\n- Sports participation by grade level\n- Social media platform popularity by age group\n\nYour teacher will share the data files or direct you to the right source.\n\n**This is a 2-day project.** Today: choose your data, write your headline, and set up your layout in Canva. Tomorrow (Lesson 26): finish, get peer feedback, and polish."
    },
    {
      id: "q-data-source",
      type: "question",
      questionType: "short_answer",
      prompt: "What data are you using for your infographic? Where did it come from? (This will become your source citation.)",
      placeholder: "Data topic: ...\nSource: ...",
      difficulty: "plan"
    },
    {
      id: "q-headline-draft",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your infographic headline — a specific claim, not a vague title. It should be one sentence that tells the reader the most important thing your data shows.",
      placeholder: "My headline: ...",
      difficulty: "create"
    },
    {
      id: "q-layout-plan",
      type: "question",
      questionType: "short_answer",
      prompt: "Plan your infographic layout before you open Canva:\n- What are your 3 most important data points?\n- What visual (chart, icon, illustration) will you use to show each one?\n- What order will the viewer see them in?",
      placeholder: "Data point 1: ... Visual: ...\nData point 2: ... Visual: ...\nData point 3: ... Visual: ...\nViewer sees them in order: ...",
      difficulty: "plan"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "An infographic isn't just a pretty chart — it's a **visual argument**. The headline makes the claim, the data proves it, and the visuals make it impossible to ignore.\n\n**Tomorrow (Lesson 26):** You'll get peer feedback and do final revisions. Come in with at least your layout and headline done in Canva."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: What's the difference between an infographic and a decorated chart? Give one specific example of what makes the infographic approach stronger.",
      placeholder: "An infographic is different because...\nFor example...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Vocabulary",
      subtitle: ""
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Infographic", definition: "A visual representation of data or information designed to communicate a specific point clearly and quickly." },
        { term: "Data visualization", definition: "The use of charts, graphs, and visuals to represent data in a way that's easier to understand than raw numbers." },
        { term: "Source citation", definition: "Credit given to the original data source — required in all infographics to establish credibility." },
        { term: "Visual flow", definition: "The path a viewer's eye follows through a design, guided by size, color, contrast, and spacing." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-infographics-1")
      .set(lesson);
    console.log('✅ Lesson "Infographics — Turning Data Into a Story" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-infographics-1");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log("   Visible: false");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
