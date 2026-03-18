// seed-diglit-entrepreneurship-creator-economy.js
// Creates "The Creator Economy — How People Your Age Make Money Online" (Dig Lit, Unit 6, Lesson 32)
// Run: node scripts/seed-diglit-entrepreneurship-creator-economy.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "The Creator Economy — How People Your Age Make Money Online",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 32,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "💰",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Somewhere right now, a 17-year-old is making $2,000/month selling Notion templates they made in an afternoon. Another kid your age runs an Etsy shop shipping custom prints to 12 countries. Someone else tutors students on Zoom for $40/hour and sets their own schedule.\n\nNone of them are famous. None of them have millions of followers. They just found a problem, built something useful, and put it online.\n\nThe barrier to starting an online business has never been lower. The question is: do you know how?"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you couldn't get a traditional job but had a laptop and Wi-Fi — how would you make money?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Have you ever bought something from an independent creator online? (Etsy, someone's link in bio, a creator's merch, a digital download?) If yes — what was it? If no — would you? What would make you buy from an individual vs. a big store?",
      placeholder: "My answer...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify at least 4 ways people earn money online beyond 'being famous'",
        "Distinguish between active income and passive income in digital businesses",
        "Match business models to different skills and interests"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "8 Ways to Make Money Online",
      subtitle: "~15 minutes"
    },
    {
      id: "b-models",
      type: "text",
      content: "**Active income** = you work → you get paid. Stop working, stop earning.\n**Passive income** = you build once → money keeps coming in.\n\nMost successful online businesses combine both.\n\n| Model | What It Is | Example | Active or Passive? |\n|-------|-----------|---------|-------------------|\n| **Freelancing** | Sell your skill to clients | Graphic design on Fiverr, tutoring | Active |\n| **Content creation** | Build an audience → sell ads/brand deals | YouTube, TikTok | Both |\n| **Digital products** | Create once, sell forever | Templates, presets, ebooks | Passive |\n| **E-commerce** | Sell physical products online | Etsy shop, print-on-demand merch | Both |\n| **Services** | Do work for businesses | Social media management, web design | Active |\n| **Courses/coaching** | Teach what you know | Online course, 1-on-1 coaching | Both |\n| **Affiliate marketing** | Earn commission recommending products | Review channel with promo links | Passive |\n| **Apps/tools** | Build something people pay to use | A study app, a game | Passive |"
    },
    {
      id: "callout-1000fans",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The 1,000 True Fans idea:** You don't need millions of followers. If 1,000 people pay you $100/year for something valuable, that's $100,000/year. Most successful online businesses are small and niche — not viral. The goal isn't fame. The goal is finding the right audience for something specific."
    },
    {
      id: "q-active-passive",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student creates a pack of 50 Canva resume templates and sells them for $15 each on Etsy. She spends 2 days building them in January. By June, she's made $450 without doing any more work. What type of income is this?",
      options: [
        "Active income — she did the work to create the templates",
        "Passive income — she created it once and it keeps earning without additional work",
        "Neither — it's not a real business model",
        "Both equally"
      ],
      correctIndex: 1,
      explanation: "This is passive income. She put in the upfront work (2 days in January) but the product keeps selling without her having to do more work each time. Digital products are one of the best passive income models because there's no inventory, no shipping, and no limit on how many times you can sell the same file.",
      difficulty: "understand"
    },
    {
      id: "q-model-match",
      type: "question",
      questionType: "short_answer",
      prompt: "**Business Model Match:** For each person below, suggest the best business model(s) from the table and explain why:\n\n1. Maya is great at drawing anime-style characters and has been doing it for 3 years.\n2. Jordan knows everything about sneakers — can spot fakes, knows every release date, follows all the drops.\n3. Alex is a strong student who explains math really clearly to confused classmates.",
      placeholder: "Maya: ... because ...\nJordan: ... because ...\nAlex: ... because ...",
      difficulty: "apply"
    },

    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Your Skills + Interests Inventory",
      subtitle: "~15 minutes"
    },
    {
      id: "b-practice-intro",
      type: "text",
      content: "Before you can build a business, you need to know your starting material — what you're good at and what you care about. This isn't about what you think sounds impressive. It's about what's actually true.\n\nBe honest. \"I'm really good at knowing which clothes look good together\" is a skill. \"I watch 6 hours of gaming content a day\" is knowledge. Both can be businesses."
    },
    {
      id: "q-skills",
      type: "question",
      questionType: "short_answer",
      prompt: "List 3 skills you have — things you can DO. These can be technical (editing, coding, drawing) or interpersonal (explaining things, organizing, motivating people). Be specific.",
      placeholder: "Skill 1: ...\nSkill 2: ...\nSkill 3: ...",
      difficulty: "create"
    },
    {
      id: "q-knowledge",
      type: "question",
      questionType: "short_answer",
      prompt: "List 2-3 topics you know A LOT about — things you could talk about for an hour without running out of material.",
      placeholder: "Topic 1: ...\nTopic 2: ...\nTopic 3 (optional): ...",
      difficulty: "create"
    },
    {
      id: "q-first-idea",
      type: "question",
      questionType: "short_answer",
      prompt: "First business idea: Combine one skill + one knowledge area + one business model. Write 2-3 sentences describing what your business could look like. This is brainstorming — it doesn't have to be perfect.",
      placeholder: "My idea: ...",
      difficulty: "create"
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
      content: "You don't need to be famous, rich, or a tech genius to build an online business. You need:\n- Something valuable to offer\n- A specific audience who wants it\n- A model for how money flows\n\nYou now know 8 models. Next lesson: you'll find your niche — the specific corner of the internet where your business belongs.\n\n**Note:** We're talking about businesses that create real value, not get-rich-quick schemes, crypto gambles, or MLMs. If a \"business opportunity\" sounds too good to be true, it always is."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Which of the 8 business models most interests you for your own potential business? Why does it fit your skills and interests better than the others?",
      placeholder: "The model that interests me most is [model] because...",
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
        { term: "Creator economy", definition: "The ecosystem of independent content creators, influencers, and online entrepreneurs who build and monetize audiences and digital products." },
        { term: "Active income", definition: "Income that requires ongoing work — you stop working, you stop earning." },
        { term: "Passive income", definition: "Income that continues after the initial work is done — a product you built once keeps selling." },
        { term: "Digital product", definition: "A product delivered electronically that can be sold unlimited times with no additional production cost — templates, ebooks, presets, courses." },
        { term: "Affiliate marketing", definition: "Earning a commission by recommending someone else's product — you get paid when someone buys through your unique link." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("entrepreneurship-creator-economy")
      .set(lesson);
    console.log('✅ Lesson "The Creator Economy" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-creator-economy");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
