// seed-diglit-content-creation-showcase.js
// Creates "Content Showcase + Unit Wrap-Up" (Dig Lit, Unit 5, Lesson 31)
// Run: node scripts/seed-diglit-content-creation-showcase.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Content Showcase + Unit Wrap-Up",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 31,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🏆",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "This unit started with one question: *Who is this for?*\n\nEvery lesson since then has been a layer on top of that answer — hooks, hierarchy, infographics, thumbnails, writing, planning.\n\nToday you get to see all of it in action: yours and your classmates'. This is a showcase — not just a share-out. You're explaining your design decisions to an audience."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Now that you know how content is designed on purpose — will you ever scroll the same way again?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "In one sentence: what's the most important thing you learned in this unit about how content is made?",
      placeholder: "The most important thing I learned: ...",
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
        "Present and explain the design decisions behind your content piece",
        "Give structured feedback using unit vocabulary (audience, hook, hierarchy, CTA)",
        "Reflect on your growth from basic tool use to intentional content creation"
      ]
    },

    // ═══════════════════════════════════════════
    // SHOWCASE
    // ═══════════════════════════════════════════
    {
      id: "section-showcase",
      type: "section_header",
      icon: "🎨",
      title: "Gallery Walk + Spotlight Presentations",
      subtitle: "~25 minutes"
    },
    {
      id: "b-gallery-walk",
      type: "text",
      content: "**Part 1 — Gallery Walk (12 minutes)**\n\nAll content pieces are displayed on Chromebooks around the room. You'll have 12 minutes to walk around and view at least 8 pieces.\n\nFor each piece you view, you'll leave feedback using the shared Google Form. Your feedback must use at least one unit vocabulary word: audience, hook, visual hierarchy, CTA, content pillar, caption, thumbnail.\n\n**Feedback format:** [Student name] — One thing that works (specific) + One suggestion (specific and actionable)"
    },
    {
      id: "q-gallery-feedback",
      type: "question",
      questionType: "short_answer",
      prompt: "Gallery Walk check-in: Describe one content piece you viewed that used a strong hook or visual hierarchy. What specifically made it effective? Use unit vocabulary in your answer.",
      placeholder: "The piece by [student/topic]: ...\nWhat made it effective: ...",
      difficulty: "evaluate"
    },
    {
      id: "b-spotlight",
      type: "text",
      content: "**Part 2 — Spotlight Presentations (13 minutes)**\n\n5-6 students will present their work to the class. Each presentation is exactly 2 minutes:\n\n1. Show the content piece on the projector\n2. Explain: **Who is it for?** (your audience)\n3. Explain: **What's the hook?** (first 3 seconds)\n4. Explain: **One design choice** you made intentionally and why\n\nAfter each presentation: class gives one **glow** (what works) and one **grow** (what to improve).\n\nFeedback must be specific — no \"it looks nice\" or \"good job.\""
    },
    {
      id: "q-spotlight-reflect",
      type: "question",
      questionType: "short_answer",
      prompt: "If you presented (or after watching the presentations): Which feedback — glow or grow — was most useful to you? Why? What would you change about your piece based on what you heard?",
      placeholder: "Most useful feedback: ...\nI would change: ...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // REFLECTION
    // ═══════════════════════════════════════════
    {
      id: "section-reflection",
      type: "section_header",
      icon: "📝",
      title: "Unit Reflection",
      subtitle: "~10 minutes"
    },
    {
      id: "b-reflection-intro",
      type: "text",
      content: "This is individual, written, and quiet. No talking. Take it seriously — this is your chance to capture what actually changed in how you think about content."
    },
    {
      id: "q-reflect-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Reflection 1: What's the biggest difference between how you created content at the start of the year vs. now? Be specific — what did you used to do, and what do you do differently now?",
      placeholder: "Before this unit, I would... Now I...",
      difficulty: "reflect"
    },
    {
      id: "q-reflect-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Reflection 2: Which principle from this unit — audience, hooks, visual hierarchy, or screen writing — changed how you think about content the most? Why that one?",
      placeholder: "The principle that changed my thinking most is... because...",
      difficulty: "reflect"
    },
    {
      id: "q-reflect-3",
      type: "question",
      questionType: "short_answer",
      prompt: "Reflection 3: Look at your content calendar from Lesson 29. Which piece on that calendar would you most want to actually create and post someday? What would you need to make it real?",
      placeholder: "I'd most want to make [post from calendar] because...\nTo make it real, I'd need...",
      difficulty: "reflect"
    },

    // ═══════════════════════════════════════════
    // BRIDGE TO NEXT UNIT
    // ═══════════════════════════════════════════
    {
      id: "section-bridge",
      type: "section_header",
      icon: "🚀",
      title: "What's Next",
      subtitle: "~5 minutes"
    },
    {
      id: "b-bridge",
      type: "text",
      content: "You now know how to create content that grabs attention and speaks to a specific audience. You understand hooks, hierarchy, writing, and planning.\n\n**Next unit: Digital Entrepreneurship.**\n\nPeople your age are building real businesses online — not someday, right now. In the next unit, you'll learn how creators and entrepreneurs turn content into income, build a brand, and pitch an actual business idea.\n\nEverything you just built in this unit? That's the foundation."
    },
    {
      id: "callout-bridge",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**For the curious:** Look up MrBeast, Emma Chamberlain, or any teen creator you know. How old were they when they started? What did their first content look like vs. their content now? What changed — and when did it click?"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-showcase")
      .set(lesson);
    console.log('✅ Lesson "Content Showcase + Unit Wrap-Up" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-showcase");
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
