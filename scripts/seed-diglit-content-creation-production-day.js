// seed-diglit-content-creation-production-day.js
// Creates "Production Day — Create One Piece of Portfolio Content" (Dig Lit, Unit 5, Lesson 30)
// Run: node scripts/seed-diglit-content-creation-production-day.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Production Day — Create One Piece of Portfolio Content",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 30,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎬",
      title: "Warm Up — Production Brief",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Today is the day everything comes together.\n\nYou've built an audience profile. You've written hooks. You've learned visual hierarchy. You've created thumbnails and infographics. You've written captions and CTAs. You've planned a content calendar.\n\nNow you produce **one polished piece of content** that uses all of it.\n\nProfessional creators don't start creating without a brief. You'll write yours before you open any tools."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What separates \"student project\" quality from something you'd actually follow online?"
    },
    {
      id: "q-brief",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your production brief before starting. Answer all four:\n\n1. **What am I making?** (infographic, thumbnail + caption, short video script + storyboard, or social media post set)\n2. **Who is it for?** (your audience profile — be specific)\n3. **What's the hook?** (from Lesson 23 — which type and what it is)\n4. **What's the CTA?** (what do I want someone to do after seeing this?)",
      placeholder: "1. I'm making: ...\n2. It's for: ...\n3. Hook type + hook: ...\n4. CTA: ...",
      difficulty: "plan"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply audience analysis, hooks, visual hierarchy, and copywriting to create one polished piece",
        "Execute a full content production workflow from brief to final export",
        "Self-assess your work against the unit's design principles"
      ]
    },

    // ═══════════════════════════════════════════
    // PRODUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-production",
      type: "section_header",
      icon: "🛠️",
      title: "Production Time",
      subtitle: "~30 minutes"
    },
    {
      id: "b-production-intro",
      type: "text",
      content: "Open Canva (or CapCut if you're doing a video storyboard) and start creating.\n\nYou have everything you need:\n- ✅ Audience profile (Lesson 22) — Who is this for?\n- ✅ Hooks (Lesson 23) — What grabs them?\n- ✅ Visual hierarchy (Lesson 24) — Where does the eye go first?\n- ✅ Copy + CTA (Lesson 28) — What do you say and what do they do?\n- ✅ Content calendar (Lesson 29) — This piece fits here\n\n**If you hear yourself saying \"I don't know\" — stop and go back to your brief.** If the brief doesn't answer it, that's the problem to fix first."
    },
    {
      id: "callout-check-in",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Three questions to ask yourself mid-production:**\n1. Who is this for? (If you can't answer immediately, your audience isn't driving your decisions.)\n2. What's the first thing someone sees? (Apply the squint test.)\n3. What do I want them to do after seeing this? (Check your CTA is in there.)"
    },
    {
      id: "q-midway",
      type: "question",
      questionType: "short_answer",
      prompt: "Midway check-in (complete this when you're about halfway through):\n- What tool are you using and what are you making?\n- Apply the squint test right now — what do you see first? Is that what you want?\n- Is your hook clearly visible in the first thing someone would see?",
      placeholder: "Tool + what I'm making: ...\nSquint test result: ...\nHook visible? ...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // SELF ASSESSMENT
    // ═══════════════════════════════════════════
    {
      id: "section-assess",
      type: "section_header",
      icon: "📋",
      title: "Self-Assessment",
      subtitle: "~5 minutes"
    },
    {
      id: "b-assess-intro",
      type: "text",
      content: "Before you export and submit, evaluate your own work honestly. This isn't about being harsh — it's about catching problems before your teacher or audience does.\n\nRate each principle 1 (needs work), 2 (getting there), or 3 (strong):"
    },
    {
      id: "q-self-assess",
      type: "question",
      questionType: "short_answer",
      prompt: "Rate yourself on each principle:\n\n- Clear target audience (design decisions match who this is for): [1/2/3]\n- Strong hook (first thing they see grabs attention): [1/2/3]\n- Visual hierarchy (eye goes to the right thing first): [1/2/3]\n- Copy is concise + has a CTA: [1/2/3]\n- Would I actually post this? (honest answer): [Yes / Maybe / No]\n\nIf anything scored a 1, what would make it a 2?",
      placeholder: "Audience: ...\nHook: ...\nHierarchy: ...\nCopy/CTA: ...\nWould I post it: ...\nTo improve a 1: ...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up + Submit",
      subtitle: "~5 minutes"
    },
    {
      id: "b-export",
      type: "text",
      content: "**Export and submit:**\n- Canva: Download → PNG (for images) or MP4 (for video)\n- Submit to Google Classroom\n- Label it clearly: [Your name] — [Content type] — [Topic]\n\n**Tomorrow:** You'll present your work in a class showcase. Prepare to explain:\n- Who it's for\n- What your hook is\n- One design decision you made intentionally and why"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Looking at what you submitted — what's the one thing you're most proud of? And what's the one thing you'd change if you had another hour?",
      placeholder: "Most proud of: ...\nWould change: ...",
      difficulty: "reflect"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-production-day")
      .set(lesson);
    console.log('✅ Lesson "Production Day — Create One Piece of Portfolio Content" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-production-day");
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
