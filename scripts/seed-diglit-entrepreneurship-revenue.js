// seed-diglit-entrepreneurship-revenue.js
// Creates "Revenue Models — How Does the Money Actually Work?" (Dig Lit, Unit 6, Lesson 36)
// Run: node scripts/seed-diglit-entrepreneurship-revenue.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Revenue Models — How Does the Money Actually Work?",
  questionOfTheDay: "If a creator has 10,000 followers but makes $0, and another has 500 followers but makes $3,000/month — what's the difference?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 36,
  visible: false,
  dueDate: "2026-04-23",
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "📈",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Two creators. Same topic. Same content quality.\n\n**Creator A** has 50,000 followers and makes $0/month.\n**Creator B** has 800 followers and makes $2,400/month.\n\nHow? Creator A posts and hopes for ad revenue. Creator B sells a $30 digital product and has 80 regular customers.\n\nFollower count doesn't determine income. Revenue model does."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If a creator has 10,000 followers but makes $0, and another has 500 followers but makes $3,000/month — what's the difference?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "How do these platforms make money?\n- Instagram\n- Spotify\n- Fortnite (the game is free)\n- Google Search\n\nTake your best guess for each.",
      placeholder: "Instagram: ...\nSpotify: ...\nFortnite: ...\nGoogle: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify and explain 5 common digital revenue models",
        "Calculate basic revenue projections using realistic assumptions",
        "Select a revenue model for your business concept and justify the choice"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "💵",
      title: "5 Revenue Models for Digital Businesses",
      subtitle: "~15 minutes"
    },
    {
      id: "b-models",
      type: "text",
      content: "**1. Per-Sale (One-Time)**\nCustomer pays once, gets the product. Templates, art prints, ebooks, presets.\n> Revenue = price × number of sales\n> *$15 template × 40 sales/month = $600/month*\n\n**2. Subscription (Recurring)**\nCustomer pays monthly or yearly for ongoing access. Membership sites, exclusive content, newsletter.\n> Revenue = monthly price × subscribers\n> *$8/month × 200 subscribers = $1,600/month*\n\n**3. Ad-Supported**\nContent is free — advertisers pay you based on views. YouTube, podcasts, blogs.\n> Revenue = views × CPM ÷ 1,000\n> YouTube CPM is roughly $3-5 for most niches. 100,000 views × $4 CPM = $400/month.\n\n**4. Freemium**\nBasic version free, premium features paid. Apps, tools, courses.\n> About 2-5% of free users typically upgrade.\n> 1,000 free users × 3% conversion × $10/month = $300/month\n\n**5. Service / Freelance**\nClients pay for your time and skill. Design, tutoring, social media management.\n> Revenue = rate × hours (or flat project price)\n> $40/hour × 10 hours/week = $400/week"
    },
    {
      id: "callout-math",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The math reality check:** Most online businesses start small. $300-600/month in the first year is a realistic, solid goal for a first venture. That's not nothing — that's a phone bill, a car payment, or a savings habit. The goal isn't to replace a salary in year one. The goal is to build something that scales."
    },
    {
      id: "q-model-calc",
      type: "question",
      questionType: "short_answer",
      prompt: "Calculate the monthly revenue for each scenario:\n\n1. An artist sells custom pet portrait commissions for $35 each. She gets 8 orders per month.\n2. A student's study tips newsletter charges $5/month. She has 400 free subscribers; 3% convert to paid.\n3. A gaming YouTube channel gets 80,000 views/month. Assume $4 CPM.",
      placeholder: "1. $35 × 8 = ...\n2. 400 × 3% = ... subscribers × $5 = ...\n3. 80,000 ÷ 1,000 × $4 = ...",
      difficulty: "apply"
    },
    {
      id: "q-model-match",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student wants to build a business teaching others how to use Canva for small businesses. She has 200 hours to invest in building it. Which revenue model would give her the MOST passive income long-term?",
      options: [
        "Service/freelance — charge $50/hour for 1-on-1 Canva coaching sessions",
        "Per-sale — create a comprehensive Canva course and sell it for $29",
        "Ad-supported — post free YouTube tutorials and earn CPM",
        "Subscription — $8/month for access to her Canva tips newsletter"
      ],
      correctIndex: 1,
      explanation: "A $29 course (per-sale) is built once and can be sold forever — classic passive income. Freelancing requires her time for every dollar (active). Ad-supported requires massive scale (100K+ views) to earn meaningfully. The subscription model works but requires constantly generating new content. A course is the most leverage for 200 hours of investment.",
      difficulty: "evaluate"
    },

    {
      id: "section-practice",
      type: "section_header",
      icon: "📊",
      title: "Build Your Revenue Plan",
      subtitle: "~15 minutes"
    },
    {
      id: "b-practice-intro",
      type: "text",
      content: "Open the **Revenue Autopsy Workbook** (button below). Go to **File → Make a copy** — work in your own copy, not the template.\n\nThe workbook has two parts:\n\n- **Part A — Autopsy:** dissect five real creators' revenue models. Calculate what they make; identify which model they're using.\n- **Part B — Your Plan:** build a simple revenue projection for your own business.\n\nThis is an estimate, not a prediction. The point is to think through *how* money flows through your business and whether the model is realistic."
    },
    {
      id: "link-autopsy-sheet",
      type: "external_link",
      icon: "📊",
      title: "Revenue Autopsy — Student Workbook",
      url: "https://docs.google.com/spreadsheets/d/1uOv5_RrbbVpFwXb0CSWXbJQpNj0pWiVs2jgtvV0yn4M/edit",
      description: "Make your own copy: File → Make a copy. Part A dissects five real creators; Part B is where you build your own revenue plan.",
      buttonLabel: "Open the workbook",
      openInNewTab: true
    },
    {
      id: "q-revenue-model",
      type: "question",
      questionType: "short_answer",
      prompt: "Which revenue model will your business use? Why is it the best fit for your specific niche and business concept?",
      placeholder: "My model: ...\nWhy it fits: ...",
      difficulty: "evaluate"
    },
    {
      id: "q-revenue-calc",
      type: "question",
      questionType: "short_answer",
      prompt: "Set your assumptions and calculate:\n\n- Price per sale / per subscription / per hour: $...\n- Volume per month (sales / subscribers / hours): ...\n- Monthly revenue = price × volume = $...\n- Yearly revenue = monthly × 12 = $...\n\nThen complete: \"My business would need [volume] to make $[amount]/month.\"",
      placeholder: "Price: $...\nVolume: ...\nMonthly: $...\nYearly: $...\nStatement: My business would need...",
      difficulty: "apply"
    },
    {
      id: "q-reality-check",
      type: "question",
      questionType: "short_answer",
      prompt: "Reality check: Is your projected volume realistic for someone just starting? What would you need to achieve it — followers, customers, hours, marketing? What's the minimum you'd need to earn $100/month?",
      placeholder: "Is it realistic? ...\nTo achieve it I'd need: ...\nMinimum for $100/month: ...",
      difficulty: "evaluate"
    },
    {
      id: "evidence-workbook",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Your Completed Workbook",
      instructions: "Share your completed Revenue Autopsy workbook (File → Share → Copy link → paste below) OR upload a screenshot of both Part A and Part B filled out.",
      reflectionPrompt: "In one sentence: which of the five creators earns the most passively, and what makes that model 'passive'?"
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
      content: "Every digital business needs a revenue model — a clear answer to \"how do I get paid?\"\n\nNo model is inherently better. The right model depends on your niche, your time, your skills, and whether you want active or passive income.\n\n**Coming up:** Lesson 37 — Your Online Presence. You have a business concept, a brand, and a revenue model. Now you need somewhere to send people."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: What surprised you most about revenue math for digital businesses? Did any of the numbers (CPM rates, conversion rates, project prices) change how you think about building an online business?",
      placeholder: "What surprised me: ...",
      difficulty: "reflect"
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
        { term: "Revenue model", definition: "The mechanism by which a business earns money — how money flows from customer to creator." },
        { term: "Per-sale (one-time)", definition: "Revenue model where the customer pays once and receives the product. Templates, ebooks, art prints, digital downloads." },
        { term: "Subscription", definition: "Revenue model where customers pay a recurring fee (monthly/yearly) for ongoing access to content, tools, or community." },
        { term: "Ad-supported", definition: "Revenue model where content is free to the viewer and advertisers pay the creator based on views or clicks. YouTube, podcasts, blogs." },
        { term: "Freemium", definition: "Revenue model where a basic version is free and premium features are paid. Typically 2–5% of free users upgrade." },
        { term: "CPM", definition: "Cost per mille (cost per thousand views) — the amount advertisers pay per 1,000 views. YouTube CPM is roughly $3–5 for most niches." },
        { term: "Conversion rate", definition: "The percentage of people who take a desired action (upgrade from free to paid, make a purchase) — typically 2–5% for freemium models." },
        { term: "Recurring revenue", definition: "Income that comes in regularly (monthly/yearly subscriptions) rather than one-time purchases — more predictable and scalable." },
        { term: "Passive income", definition: "Revenue that keeps coming in without requiring your active time for each dollar — a course built once and sold forever is passive." },
        { term: "Active income", definition: "Revenue that requires your time for every dollar earned — freelancing and hourly services are active. Capped by hours in the day." },
        { term: "Scalable", definition: "A business model that can grow revenue without a proportional increase in work — digital products are highly scalable; hourly services are not." }
      ]
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "digital-literacy", "entrepreneurship-revenue", lesson);
    console.log('✅ Lesson "Revenue Models" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-revenue");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
