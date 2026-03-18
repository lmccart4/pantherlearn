// seed-diglit-content-creation-hook.js
// Creates "The Hook — Grabbing Attention in 3 Seconds" (Dig Lit, Unit 5, Lesson 23)
// Run: node scripts/seed-diglit-content-creation-hook.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "The Hook — Grabbing Attention in 3 Seconds",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 23,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎣",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "The average person scrolls through **300 feet of content** every day — roughly the height of the Statue of Liberty. They make a keep/scroll decision in about **3 seconds**.\n\nThat means your first 3 seconds decide everything. Not your best moment. Not your title. The very first thing someone sees."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** You have 3 seconds before someone scrolls past your content. What do you do?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of the last video or post that made you stop scrolling. What was it? What made you stop?",
      placeholder: "Describe what stopped your scroll and why...",
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
        "Explain why the first 3 seconds of any content determine success or failure",
        "Identify the 5 main hook types used in professional content",
        "Write 3 different hooks for the same topic using different techniques"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "The 5 Hook Types",
      subtitle: "~15 minutes"
    },
    {
      id: "b-hook-intro",
      type: "text",
      content: "A **hook** is the first element of your content — the thing that stops the scroll and pulls someone in. The best creators don't hope their content gets seen. They engineer the hook to make it impossible to ignore.\n\nThere are five proven hook types:"
    },
    {
      id: "b-hook-types",
      type: "text",
      content: "**1. Bold Claim**\nMake a statement that's surprising, counterintuitive, or provocative.\n> *\"Nobody talks about this...\"* / *\"This changed everything I thought I knew about sleep.\"*\n\n**2. The Question**\nAsk something your audience is already wondering.\n> *\"Have you ever wondered why you can't remember your dreams?\"*\n\n**3. Visual Shock**\nAn unexpected image, dramatic color contrast, or fast motion that breaks the visual pattern of the feed.\n> The first frame shows something surprising before a word is said.\n\n**4. Conflict or Tension**\nStart in the middle of something going wrong. The brain is hardwired to want resolution.\n> *\"I tried this workout every day for 30 days and it went completely wrong.\"*\n\n**5. Pattern Interrupt**\nDo something unexpected that breaks the rhythm of typical content in that space.\n> Silence when others are loud. Text-only when others use faces. Unusual framing.\n\nThe hook isn't just words. It's **visual + audio + text** working together in the first 3 seconds."
    },
    {
      id: "callout-insight",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The 3-second rule:** If your first 3 seconds could be removed without losing anything important, your hook isn't doing its job. The hook should create a question in the viewer's mind that ONLY gets answered by continuing to watch."
    },
    {
      id: "q-identify-hook",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A video opens with someone looking directly at the camera saying: \"I stayed up for 72 hours straight and here's what happened to my brain.\" Which hook type is this?",
      options: [
        "The Question",
        "Bold Claim",
        "Visual Shock",
        "Conflict or Tension"
      ],
      correctIndex: 3,
      explanation: "This is Conflict or Tension — it starts with a premise that implies something went wrong or extreme, making the viewer want to find out the outcome. 'What happened to my brain' creates tension that demands resolution.",
      difficulty: "understand"
    },
    {
      id: "q-identify-hook-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A YouTube thumbnail shows a giant red 'X' over a photo of fast food, with the title: \"The Breakfast You Should NEVER Eat (Most People Do This Every Day).\" Which hook type does this use?",
      options: [
        "Pattern Interrupt",
        "Bold Claim",
        "The Question",
        "Visual Shock"
      ],
      correctIndex: 1,
      explanation: "This is a Bold Claim — it makes a strong, provocative statement ('NEVER eat') that challenges common behavior ('Most people do this every day'). The goal is to make the viewer feel like they might be making a mistake they don't know about.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // BUILD YOUR HOOKS
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Write Your Hooks",
      subtitle: "~15 minutes"
    },
    {
      id: "b-practice-intro",
      type: "text",
      content: "Using the audience profile you built in Lesson 22, you're going to write **3 different hooks** for your topic — each using a different technique.\n\nRemember: you're writing for your specific audience on your specific platform. A hook that works on TikTok might feel wrong on YouTube. Stay in your audience's world."
    },
    {
      id: "q-hook-text",
      type: "question",
      questionType: "short_answer",
      prompt: "Write a TEXT HOOK for your topic — a headline or opening line (one sentence max). Label which hook type you're using.",
      placeholder: "Hook type: [bold claim / question / conflict / pattern interrupt]\nHook: ...",
      difficulty: "create"
    },
    {
      id: "q-hook-visual",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe a VISUAL HOOK for your topic — what's the very first image or visual the viewer sees? Why would it stop the scroll for YOUR specific audience?",
      placeholder: "Visual: ...\nWhy it works for my audience: ...",
      difficulty: "create"
    },
    {
      id: "q-hook-video",
      type: "question",
      questionType: "short_answer",
      prompt: "Write a VIDEO HOOK — the exact script for the first 5 seconds of a video. Include what you say AND any key visual or audio direction.",
      placeholder: "First 5 seconds:\n[Visual]: ...\n[Audio/Speech]: ...",
      difficulty: "create"
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
      content: "The hook is the most important part of any piece of content. Everything else can be great — but if the first 3 seconds don't work, no one sees any of it.\n\nYou now have 3 hooks in your toolkit. Save them — you'll choose the best one when you produce your final content piece.\n\n**Up next:** Once you stop someone's scroll, you need your content to look like it was made on purpose. Lesson 24 is about visual hierarchy — how to design content that guides the eye exactly where you want it."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Which of your 3 hooks do you think is strongest? Why? What would make someone from your target audience stop scrolling for it?",
      placeholder: "My strongest hook is the [text/visual/video] hook because...",
      difficulty: "evaluate"
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
        { term: "Hook", definition: "The opening element of a piece of content designed to grab attention and prevent the viewer from scrolling away in the first 3 seconds." },
        { term: "Bold claim", definition: "A hook technique using a surprising or counterintuitive statement that makes the viewer want to know more." },
        { term: "Pattern interrupt", definition: "A hook technique that breaks the expected visual or audio pattern of a platform to stand out from other content." },
        { term: "Scroll-stop moment", definition: "The specific element — visual, text, or audio — that makes a viewer pause their scrolling to engage with content." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-hook")
      .set(lesson);
    console.log('✅ Lesson "The Hook — Grabbing Attention in 3 Seconds" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-hook");
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
