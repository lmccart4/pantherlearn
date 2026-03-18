// seed-diglit-content-creation-audience.js
// Creates "Who's Watching? — Understanding Your Audience" (Dig Lit, Unit 5, Lesson 22)
// Run: node scripts/seed-diglit-content-creation-audience.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Who's Watching? — Understanding Your Audience",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 22,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "👀",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Imagine seeing two ads for the exact same product — one is loud, colorful, and uses slang; the other is calm, professional, and uses statistics. Same product. Completely different content.\n\nWhy? Because they're talking to **different people**.\n\nBefore a professional creator posts anything, they ask one question first: *Who is this for?*"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you posted the exact same video on TikTok, LinkedIn, and a school website — would it work on all three? Why or why not?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of a brand or creator you follow. Who do you think their content is designed for? How can you tell?",
      placeholder: "Describe their audience and how the content shows it...",
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
        "Identify how different audiences change how content should be designed",
        "Analyze real-world content and identify its target audience",
        "Create an audience profile for your own content project"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "🎯",
      title: "Audience Is Everything",
      subtitle: "~20 minutes"
    },
    {
      id: "b-audience-text",
      type: "text",
      content: "**Audience = everything.** The same message delivered to the wrong audience falls completely flat.\n\nBefore creating anything, professional content creators ask four questions:\n\n1. **Who am I talking to?** — age, interests, platform they use\n2. **What do they care about?** — their problems, desires, what's trending for them\n3. **Where will they see this?** — TikTok vs. email vs. a poster in a hallway\n4. **What do I want them to do?** — follow, buy, learn something, share\n\nEvery design decision — your colors, your words, your length, your tone — flows from these four answers."
    },
    {
      id: "callout-example",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Real example:** A Nike Instagram post for teenagers uses action footage, minimal text, and hype music. A Nike email to investors uses charts, formal language, and earnings data. Same company. Completely different audience → completely different content."
    },
    {
      id: "q-audience-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student is making a video about healthy eating. Version A is 60 seconds on TikTok with fast cuts, trending audio, and tips for staying energized during sports. Version B is a 10-minute YouTube video with recipes and grocery hauls. What's the most likely difference between the two audiences?",
      options: [
        "Version A has a younger, casual audience; Version B has an audience that wants more depth",
        "Version A is for adults; Version B is for teenagers",
        "There is no real difference — the audience is the same, just different platforms",
        "Version B is more popular because it's longer"
      ],
      correctIndex: 0,
      explanation: "The format reveals the audience. Short TikToks with trending audio target younger, casual viewers who want quick, entertaining content. Longer YouTube videos attract viewers actively seeking detailed information. Same topic, different audience = completely different content.",
      difficulty: "understand"
    },
    {
      id: "b-audience-detective",
      type: "text",
      content: "**Audience Detective Framework**\n\nWhen you look at any piece of content, you can reverse-engineer its audience by asking:\n\n- **Age and interests:** Does the language feel young/casual or formal/professional? What topics or references does it use?\n- **Platform:** Where is this designed to live? (A 9:16 vertical video vs. a wide banner ad tells you a lot.)\n- **Goal:** Is it trying to sell, inform, entertain, or persuade?\n- **Design clues:** Colors, fonts, image style — what do these signal about who this is for?\n\nThese clues are always there. You just have to know how to read them."
    },
    {
      id: "q-audience-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at the description below and identify the target audience:\n\n*Content: A vertical video, 30 seconds, fast cuts, bright colors, upbeat trending audio, text overlay that says \"POV: You finally understand algebra 🧠\" — posted on TikTok.*\n\nWho is the target audience? What design choices prove it?",
      placeholder: "Describe the audience and list at least 2 specific design clues...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // BUILD YOUR PROFILE
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Build Your Audience Profile",
      subtitle: "~10 minutes"
    },
    {
      id: "b-profile-intro",
      type: "text",
      content: "You're going to create an **audience profile** for a topic you care about. This profile will guide everything you create for the rest of this unit — your hooks, your visuals, your captions, your calendar.\n\nBe specific. \"Everyone\" is not an audience. \"13-to-16-year-olds who play basketball and watch NBA highlights on YouTube\" is an audience."
    },
    {
      id: "q-profile-topic",
      type: "question",
      questionType: "short_answer",
      prompt: "What topic do you want to create content about? (Pick something you actually know or care about — sports, gaming, music, cooking, fashion, fitness, a hobby, etc.)",
      placeholder: "My topic is...",
      difficulty: "create"
    },
    {
      id: "q-profile-audience",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your target audience specifically:\n- Age range:\n- What they care about:\n- Platform they'd find your content on:\n- What you want them to do after seeing your content:",
      placeholder: "Fill in each part of the audience profile...",
      difficulty: "create"
    },
    {
      id: "q-profile-decisions",
      type: "question",
      questionType: "short_answer",
      prompt: "Based on your audience, list 3 design decisions you'd make. Think about tone, visual style, length, platform, and format. Example: \"I'd use casual language because my audience is 14-year-olds\" or \"I'd keep it under 60 seconds because TikTok rewards short content.\"",
      placeholder: "Decision 1: ...\nDecision 2: ...\nDecision 3: ...",
      difficulty: "apply"
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
      content: "Every piece of great content starts with one question: **Who is this for?**\n\nYour audience profile answers that question before you make a single design choice. You'll use it every lesson this unit.\n\n**Up next:** You have 3 seconds before someone scrolls past your content. In Lesson 23, you'll learn how to use those 3 seconds."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Pick one social media account you follow. Who is their target audience and how do you know? Give 2 specific examples from their content.",
      placeholder: "Account: ...\nAudience: ...\nEvidence 1: ...\nEvidence 2: ...",
      difficulty: "analyze"
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
        { term: "Target audience", definition: "The specific group of people a piece of content is designed for — defined by age, interests, platform, and goals." },
        { term: "Audience profile", definition: "A detailed description of your target audience used to guide all content decisions." },
        { term: "Call to action (CTA)", definition: "The thing you want your audience to do after seeing your content — follow, share, click, buy, comment." },
        { term: "Platform", definition: "The specific app or site where content is posted (TikTok, YouTube, Instagram, etc.) — each has its own audience expectations and format norms." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-audience")
      .set(lesson);
    console.log('✅ Lesson "Who\'s Watching? — Understanding Your Audience" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-audience");
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
