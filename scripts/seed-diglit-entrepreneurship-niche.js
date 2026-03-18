// seed-diglit-entrepreneurship-niche.js
// Creates "Finding Your Niche — The Riches Are in the Niches" (Dig Lit, Unit 6, Lesson 33)
// Run: node scripts/seed-diglit-entrepreneurship-niche.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Finding Your Niche — The Riches Are in the Niches",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 33,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎯",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "\"Cooking videos\" — there are 50 million of them on YouTube. You'd compete with every cooking channel on the planet.\n\n\"One-pot vegan meals for college dorms under $5\" — there are maybe a few hundred videos like this. You'd be easy to find, easy to remember, and exactly what your audience is searching for.\n\nSame general topic. Completely different competitive landscape.\n\nThis is what niching down does."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why does \"fitness tips for busy college students\" work better as a business than just \"fitness tips\"?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Rate these 3 business ideas from most broad (1) to most specific (3) — then explain which you think would be easiest to succeed with and why:\n\nA. \"Fashion content\"\nB. \"Thrift store outfit ideas for high school students\"\nC. \"Budget fashion tips\"",
      placeholder: "Order (most broad to most specific): ...\nEasiest to succeed: ... because ...",
      difficulty: "analyze"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define 'niche' and explain why specificity beats breadth in digital business",
        "Use the 3-circle framework (passion + skill + demand) to find your niche",
        "Write a specific niche statement using the [thing] for [audience] formula"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "🔍",
      title: "The 3-Circle Framework",
      subtitle: "~15 minutes"
    },
    {
      id: "b-three-circles",
      type: "text",
      content: "The best niches sit at the intersection of three things:\n\n**Circle 1: What you're passionate about**\nYou'll quit if you hate it. Pick something you'd do for free or talk about without being paid. This is what keeps you going when it's hard.\n\n**Circle 2: What you're good at (or willing to learn)**\nSkills you already have, or skills you're committed to developing. You don't need to be an expert — you just need to be ahead of your specific audience.\n\n**Circle 3: What people actually want**\nThis is the one most people skip — and it's why most passion projects fail. Your passion project needs an audience. People need to be searching for it, spending money on it, or actively struggling with the problem it solves.\n\n**The sweet spot: where all three overlap.**"
    },
    {
      id: "callout-demand",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**How to test demand (free):**\n- Search YouTube/TikTok for your topic. Do videos get views?\n- Search Reddit. Are people asking questions about it?\n- Google Trends — is interest growing, flat, or declining?\n- Look for competitors. Competition = proof of demand. No competition often means no demand, not opportunity."
    },
    {
      id: "q-framework-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student is passionate about video games and is skilled at video editing. She wants to start a YouTube channel about video game OSTs (original soundtracks). Before committing, she does a demand check. She finds 3 big channels with 500K+ subscribers covering this topic. What should she conclude?",
      options: [
        "The market is too crowded — she should pick a different niche",
        "There's clear demand for this content — now she needs a more specific angle to stand out",
        "She should copy one of the big channels exactly",
        "Video game OST content is only for hardcore gamers — the audience is too small"
      ],
      correctIndex: 1,
      explanation: "Competitors are proof of demand. 3 channels with 500K+ subscribers means a real audience exists. The next question is specificity: instead of 'video game OSTs,' she could do 'the best video game OSTs for studying' or 'how composers build emotion in indie games.' Narrowing creates a distinct lane.",
      difficulty: "apply"
    },
    {
      id: "q-niche-formula",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which niche statement best follows the '[specific thing] for [specific audience] who [specific situation]' formula?",
      options: [
        "\"I make content about fitness\"",
        "\"Workout routines for teens\"",
        "\"10-minute bedroom workouts for high school students who don't have gym access\"",
        "\"Fitness content for anyone who wants to get in shape\""
      ],
      correctIndex: 2,
      explanation: "Option C names the specific thing (10-minute bedroom workouts), the specific audience (high school students), and the specific situation (no gym access). This is a real person with a real problem searching for a real solution. Options A, B, and D are all too broad — they describe a category, not a niche.",
      difficulty: "evaluate"
    },

    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Find Your Niche",
      subtitle: "~15 minutes"
    },
    {
      id: "b-practice-intro",
      type: "text",
      content: "Using the skills and interests inventory from Lesson 32, you'll map your overlaps and narrow down to a specific niche.\n\nThen you'll test it — a real demand check before you commit."
    },
    {
      id: "q-overlap",
      type: "question",
      questionType: "short_answer",
      prompt: "Using your skills list and knowledge areas from Lesson 32, find the overlap. Where does passion + skill + potential demand intersect?\n\nList 2-3 potential niche ideas — raw, unfiltered. Don't judge them yet.",
      placeholder: "Potential niche 1: ...\nPotential niche 2: ...\nPotential niche 3: ...",
      difficulty: "create"
    },
    {
      id: "q-niche-statement",
      type: "question",
      questionType: "short_answer",
      prompt: "Take your best niche idea and write 3 versions of the niche statement using the formula:\n**\"[Specific thing] for [specific audience] who [specific situation]\"**\n\nThen pick the one that feels most right.",
      placeholder: "Version 1: ...\nVersion 2: ...\nVersion 3: ...\n\nMy pick: ... because ...",
      difficulty: "create"
    },
    {
      id: "q-demand-check",
      type: "question",
      questionType: "short_answer",
      prompt: "Do a quick demand check for your niche:\n- Search YouTube or TikTok for your topic. What do you find? Approximate view counts?\n- Does it seem like people are searching for this?\n\nReport back: Is there demand? Too much competition? Too little?",
      placeholder: "What I found: ...\nMy conclusion: ...",
      difficulty: "apply"
    },

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
      content: "Your niche statement is the foundation of everything you'll build in this unit. Every lesson from here — your brand, your revenue model, your marketing plan, your pitch — starts from this.\n\nIf the niche feels off, now is the time to adjust. It gets harder to change later.\n\n**Up next:** Lesson 34 — Value Proposition. You have a niche. Now you need to answer: why would anyone care?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: What is your final niche statement for this unit? And what demand evidence convinced you this niche has an audience?",
      placeholder: "Niche: ...\nDemand evidence: ...",
      difficulty: "evaluate"
    },

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
        { term: "Niche", definition: "A specific, focused segment of a market. In digital business, a niche is a specialized topic + specific audience combination." },
        { term: "Niching down", definition: "The process of narrowing a broad topic into a specific, targeted focus — making it easier to find your audience and stand out from competitors." },
        { term: "Market demand", definition: "The existence of an audience actively searching for, spending money on, or struggling with the problem your business solves." },
        { term: "Competitive landscape", definition: "The other businesses, creators, or products in your niche — used to identify opportunities and differentiate your offer." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("entrepreneurship-niche")
      .set(lesson);
    console.log('✅ Lesson "Finding Your Niche" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-niche");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
