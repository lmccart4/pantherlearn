// seed-data-literacy-8.js
// Lesson 8: "Building Your Case"
// Unit: Data Literacy | Course: Digital Literacy | Order: 19
// Run: node seed-data-literacy-8.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-8-building-your-case";

const lesson = {
  title: "Building Your Case",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 19,
  blocks: [

    // ═══════════════════════════════════════════════════════
    // WARM UP (~5 minutes — shorter to maximize work time)
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
      content: "By the end of this lesson, you will be able to:\n\n• Clean your dataset and prepare it for analysis\n• Use formulas and conditional logic to find genuine insights\n• Create at least one chart that directly supports your research question"
    },
    {
      id: "b2",
      type: "text",
      content: "Today is the engine room of your investigation. You have about 30 minutes of focused work time. Less talking, more doing.\n\nBy the end of class, you need three things:\n1. **Clean data** — no blanks, no typos, no formatting issues breaking your formulas\n2. **At least two formula-based insights** — real numbers that tell part of your story\n3. **At least one chart** — a visualization that makes your main finding visible\n\nCheck where you are right now."
    },
    {
      id: "b3",
      type: "checklist",
      title: "Where Are You? (Check what's done)",
      items: [
        "Dataset selected and copied to my own Google Sheet",
        "Research question finalized (from last class)",
        "Data cleaned — blanks removed, formatting fixed, duplicates handled",
        "At least 3 formulas used (SUM, AVERAGE, COUNTIF, SUMIF, or IF)",
        "At least 1 chart created with a title and labeled axes",
        "At least 1 surprising or interesting insight discovered",
        "Chart has a clear title, labeled axes, and source citation"
      ]
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~30 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: Deep Work Session",
      subtitle: "~30 minutes — protected work time",
      icon: "⚙️"
    },
    {
      id: "b4",
      type: "activity",
      title: "Deep Work Session",
      instructions: "This is your protected work time. Use it. Your teacher will circulate and consult — ask for help when you're stuck, but try for at least 3 minutes before asking. Every minute you spend investigating is a minute your story gets stronger."
    },
    {
      id: "b5",
      type: "text",
      content: "**Stuck? Try these nudges:**\n\n• Start by sorting your key column from highest to lowest. What's at the top? What's at the bottom? Why?\n\n• Run COUNTIF across your main categories. Are they evenly distributed, or is one category dominating?\n\n• Apply conditional formatting (color scale) to your most important numeric column. Where are the hot spots?\n\n• If your chart doesn't look interesting, you might be charting the wrong column. Try a different comparison.\n\n• Use SUMIF to compare totals across categories — that's often where the story hides. Not how many, but how much.\n\n• If your analysis is confirming exactly what you expected to find, dig one level deeper. The most interesting stories are in the surprises, not the obvious patterns."
    },
    {
      id: "b6",
      type: "callout",
      style: "warning",
      content: "**If everything you're finding is obvious, you haven't dug deep enough yet.** 'Pop has a lot of streams' is not a finding — everyone knows that. 'Despite having 40% fewer songs than Pop, Electronic tracks average 18% MORE streams per song' — that's a finding."
    },
    {
      id: "div1",
      type: "divider"
    },
    {
      id: "b7",
      type: "text",
      content: "**MIDPOINT CHECK** — Pause your work and answer these four questions. This is not optional. Taking 5 minutes to reflect will make the next 15 minutes more productive."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the most interesting thing your data has revealed so far? Describe a specific number, pattern, or comparison — not a vague observation.",
      placeholder: "The most interesting thing I found is... specifically, I saw that..."
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "What formula or technique was most useful today? Walk me through what you did with it and why it worked.",
      placeholder: "The most useful was... I used it to... and it showed me that..."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "What's ONE thing about your data that would surprise someone who hasn't looked at it? Something that challenged an assumption or revealed something unexpected.",
      placeholder: "Most people would assume... but the data actually shows..."
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "Is your data telling the story you expected, or did it take you somewhere different? Explain what changed — or what stayed the same and why that's interesting.",
      placeholder: "I expected to find... but the data actually... / The data confirmed what I expected, and that's interesting because..."
    },
    {
      id: "div2",
      type: "divider"
    },
    {
      id: "b8",
      type: "activity",
      title: "Build Your Evidence: Second and Third Charts",
      instructions: "Create at least one more chart (ideally two) that supports your research question. Each chart should reveal a different angle of the same story.\n\nAsk yourself before building each chart: 'What am I trying to show? What comparison does this chart make visible?' If you can't answer that in one sentence, pick a different chart.\n\nYour chart should make your reader FEEL something — surprise, curiosity, concern. If it's flat and boring, the data isn't the problem. The comparison you're making is the problem. Try a different angle."
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your entire story in one sentence: 'My data shows that ______.' This is your thesis. Everything in your data story next class needs to support this sentence.",
      placeholder: "My data shows that..."
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
      prompt: "What's the ONE specific thing you still need to finish before next class? Not a vague 'finish the project' — name the exact task. How long do you realistically think it will take?",
      placeholder: "The one thing I still need to do: ...\nI think it will take about ___  minutes because..."
    },
    {
      id: "b9",
      type: "text",
      content: "Next class: you turn your findings into a story. Start thinking about your HEADLINE — not 'My Data Project,' but something a newspaper would actually run.\n\nThe best headlines are surprising AND specific. 'Pizza Outsells Every Other Cafeteria Item Combined' beats 'Cafeteria Sales Analysis' every time."
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
