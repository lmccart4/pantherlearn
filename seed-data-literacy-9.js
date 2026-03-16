// seed-data-literacy-9.js
// Lesson 9: "Tell the Story"
// Unit: Data Literacy | Course: Digital Literacy | Order: 20
// Run: node seed-data-literacy-9.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "data-literacy-9-tell-the-story";

const lesson = {
  title: "Tell the Story",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 20,
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
      content: "By the end of this lesson, you will be able to:\n\n• Transform your data analysis into a clear, compelling one-page data story\n• Write findings in plain language that a non-expert can understand\n• Design a visual layout that makes your main point obvious within 5 seconds"
    },
    {
      id: "b2",
      type: "text",
      content: "You've done the investigation. You've found the evidence. Now you have to TELL the story — and make someone who has never seen your spreadsheet understand why it matters.\n\nThat's the hardest part. Not the formulas. Not the charts. The storytelling."
    },
    {
      id: "b3",
      type: "text",
      content: "**What a strong data story looks like:**\n\nImagine a single page. At the top, a bold headline: *'Pizza Outsells Every Other Lunch Item Combined.'* Below the headline, one clean bar chart — cafeteria sales by item, sorted from highest to lowest. Next to the chart, three stats in large text: '42% of all revenue = pizza,' 'Friday pizza sales are 18% higher than any other day,' 'Veggie Wrap sales have dropped 35% since October.' At the bottom, two sentences: why this matters (the cafeteria could save money by focusing ordering around peak items) and a data source citation. Clean design. Lots of white space. Readable in under 10 seconds.\n\nThat's the target."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the difference between a spreadsheet and a story? What do you need to ADD to raw data to make it actually mean something to a reader?",
      placeholder: "A spreadsheet just shows... but a story adds... You need to include..."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~25 minutes)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main: Build Your Data Story",
      subtitle: "~25 minutes",
      icon: "✍️"
    },
    {
      id: "b4",
      type: "text",
      content: "**YOUR DELIVERABLE**\n\nCreate a one-page data story in Canva, Google Slides (one slide only), or Google Docs. This is your final capstone for the unit. Use your Canva skills from earlier this semester — this is exactly the kind of design challenge Canva was made for."
    },
    {
      id: "b5",
      type: "checklist",
      title: "Data Story Requirements",
      items: [
        "A compelling HEADLINE — something a newspaper would actually print (NOT 'My Data Project' or 'Data Analysis')",
        "Your research question clearly stated — what were you investigating?",
        "At least one chart or visualization exported from Google Sheets (screenshot it and drop it in)",
        "2–3 key findings written in plain language — not formula outputs, but actual sentences a stranger could understand",
        "A 'So What?' section — why does this matter? Who should care about what you found?",
        "Data source cited — what dataset did you use, and where is it from?"
      ]
    },
    {
      id: "b6",
      type: "activity",
      title: "Craft Your Story",
      instructions: "Protected work time. Build your one-page data story. Use the writing tips below to guide your choices. Your teacher will circulate — flag them down if you need feedback on your headline or 'So What?' section."
    },
    {
      id: "b7",
      type: "text",
      content: "**Writing Tips**\n\n**Lead with the surprise.** What's the most interesting thing you found? Put it in your headline and your first sentence. Don't warm up slowly — hook the reader immediately.\n\n**Write for someone who has never seen your data.** No formula names. No 'I used COUNTIF.' No 'the average was 42.7.' Write: 'The average student spends nearly 43 minutes per day on...' — round numbers, real context, plain English.\n\n**Your chart should make the point by itself.** If your chart needs a full paragraph of explanation to understand, redesign it or choose a different comparison. A good chart explains itself.\n\n**The 'So What?' is the most important sentence.** Data without meaning is just numbers. 'Screen time averages 6 hours' means nothing. 'Students who average over 6 hours of screen time report significantly worse sleep and mood' — that means something.\n\n**Less is more.** White space is your friend. An uncrowded page looks professional. A stuffed page looks desperate. If your one-pager feels cramped, cut something."
    },
    {
      id: "b8",
      type: "callout",
      style: "insight",
      content: "**Remember your Canva skills from earlier this year.** Font hierarchy (headline bigger than body), color contrast, alignment, white space — all of it applies here. Visual design isn't decoration. It's the reason people pay attention to your data instead of scrolling past it."
    },
    {
      id: "div1",
      type: "divider"
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "What's your headline? Write it here. Remember: specific, surprising, and something a newspaper would actually print.",
      placeholder: "HEADLINE: ..."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your 'So What?' section here — the 2-3 sentences that explain why your findings matter and who should care about them. Read it out loud to yourself. Would a total stranger understand why this matters?",
      placeholder: "My findings matter because... The people who should care most about this are... because..."
    },
    {
      id: "b9",
      type: "callout",
      style: "insight",
      content: "**You've come full circle.** In Lesson 1, you sat in judgment of other people's data visualizations — what made them honest, what made them misleading. Now YOU are the person making the chart. YOU are choosing what to highlight, what to label, how to present the story. Apply everything you learned about what makes data communication trustworthy. Make it accurate. Make it clear. Make it honest."
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "What was the hardest part of turning your analysis into a story? What surprised you about the communication side of data work?",
      placeholder: "The hardest part was... I was surprised that..."
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
      prompt: "If you had 10 more minutes, what's the ONE thing you would improve about your data story? Be specific — not 'make it better' but 'I would rewrite the headline to...' or 'I would add a second chart showing...'",
      placeholder: "With 10 more minutes, I would..."
    },
    {
      id: "b10",
      type: "text",
      content: "Tomorrow: you present. Your job is simple — make your classmates care about what you found. You have about 2 minutes. Lead with your headline. Show your best chart. Explain the 'So What?' Leave them with one number they won't forget."
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
