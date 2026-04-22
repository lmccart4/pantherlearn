// seed-diglit-entrepreneurship-value-prop.js
// Creates "Value Proposition — Why Would Anyone Care?" (Dig Lit, Unit 6, Lesson 34)
// Run: node scripts/seed-diglit-entrepreneurship-value-prop.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Value Proposition — Why Would Anyone Care?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 35,
  visible: false,
  dueDate: "2026-04-22",
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🤔",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-hero-image",
      type: "image",
      url: "https://firebasestorage.googleapis.com/v0/b/pantherlearn-d6f7c.firebasestorage.app/o/lesson-images%2Fdigital-literacy%2Fdl-value-prop-features-vs-benefits.jpg?alt=media",
      caption: "Same laptop. Two very different ads.",
      alt: "Two laptop advertisements side by side for the same silver laptop. The left panel labeled FEATURES lists tech specs: 16GB RAM, 1TB SSD, 14-inch OLED Display, 12-core CPU, 18-hour battery, Aluminum chassis. The right panel labeled BENEFITS shows a young woman writing in a sunny cafe with the laptop, with handwritten text overlays reading 'Write your novel anywhere,' 'All-day battery,' 'Feels made for you.' A caption across the bottom reads SAME LAPTOP. DIFFERENT STORY."
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Look at the two ads above. Same laptop. Same specs. Two completely different pitches.\n\n**Left ad (Features):** what the laptop *is* — the specs, the hardware, the numbers.\n\n**Right ad (Benefits):** what the laptop *does for you* — the life you can live with it.\n\nWhich one makes you actually want to buy it?"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** People don't buy products — they buy solutions to their problems. What problem does your business solve?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of the last thing you bought (or wanted to buy). Did you buy it because of what it IS (features) or what it DOES FOR YOU (benefits)? Give a specific example.",
      placeholder: "I bought/wanted [thing]. I chose it because...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define value proposition and explain why it matters more than the product itself",
        "Distinguish between features and benefits",
        "Write a clear value proposition using the 'I help [audience] do [outcome] by [method]' framework"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "💎",
      title: "Features vs. Benefits — and the Value Prop Framework",
      subtitle: "~15 minutes"
    },
    {
      id: "b-features-benefits",
      type: "text",
      content: "**Features** describe what a product IS.\n**Benefits** describe what it DOES FOR THE CUSTOMER.\n\nPeople buy benefits. Features are just proof that the benefits are real.\n\n| Feature | Benefit |\n|---------|----------|\n| 100+ design templates | Never stare at a blank page again |\n| Free 2-day shipping | No surprise costs at checkout |\n| 24/7 live support | Get unstuck whenever you need help |\n| Waterproof to 30m | Take it swimming, surfing, in the rain — without worrying |\n| AI-powered recommendations | Find exactly what you want without searching for it |\n\nEvery feature should connect to a benefit. If you can't answer *\"so what does this mean for the customer?\"* — you haven't found the benefit yet."
    },
    {
      id: "b-value-prop",
      type: "text",
      content: "**The Value Proposition**\n\nA value proposition is the answer to: *\"Why should I care about your business?\"*\n\nUse this framework:\n**\"I help [specific audience] [achieve specific outcome] by [your unique method/product].\"**\n\nReal examples:\n- *Canva:* \"We help non-designers create professional graphics by providing drag-and-drop templates.\"\n- *Student tutoring business:* \"I help freshmen pass biology by making study guides that actually make sense.\"\n- *A local Etsy shop:* \"I help cat owners show their personality by making custom hand-drawn pet portraits.\"\n\nNotice: all three tell you WHO it's for, WHAT they get, and HOW — in one sentence."
    },
    {
      id: "q-feature-translate",
      type: "question",
      questionType: "short_answer",
      prompt: "**Feature → Benefit Translator.** Rewrite each feature as a benefit:\n\n1. Feature: \"500+ workout videos in the app\"\n   Benefit: ...\n\n2. Feature: \"Templates are fully customizable\"\n   Benefit: ...\n\n3. Feature: \"Lessons are 10 minutes long\"\n   Benefit: ...",
      placeholder: "1. Benefit: ...\n2. Benefit: ...\n3. Benefit: ...",
      difficulty: "apply"
    },
    {
      id: "q-value-prop-analyze",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which is the strongest value proposition?",
      options: [
        "\"We sell high-quality fitness equipment at competitive prices.\"",
        "\"Our equipment uses advanced polymer-composite materials and comes with a 5-year warranty.\"",
        "\"We help busy parents get a full-body workout in 20 minutes — no gym membership, no commute.\"",
        "\"Fitness equipment for everyone.\""
      ],
      correctIndex: 2,
      explanation: "Option C uses the framework: it identifies WHO (busy parents), WHAT they get (full-body workout in 20 minutes), and HOW (no gym, no commute). Option A is generic. Option B is all features, no benefits. Option D is so broad it says nothing.",
      difficulty: "evaluate"
    },

    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Build Your Value Proposition",
      subtitle: "~15 minutes"
    },
    {
      id: "q-features",
      type: "question",
      questionType: "short_answer",
      prompt: "List 3 features of YOUR business concept (from your niche in *Finding Your Niche — The Riches Are in the Niches*). What does it include, offer, or do?",
      placeholder: "Feature 1: ...\nFeature 2: ...\nFeature 3: ...",
      difficulty: "create"
    },
    {
      id: "q-benefits",
      type: "question",
      questionType: "short_answer",
      prompt: "Translate each feature into a benefit. For each one, ask: 'So what does this mean FOR MY CUSTOMER?'",
      placeholder: "Feature 1 benefit: ...\nFeature 2 benefit: ...\nFeature 3 benefit: ...",
      difficulty: "create"
    },
    {
      id: "q-value-prop-write",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your value proposition using the framework:\n**\"I help [specific audience] [achieve specific outcome] by [your method/product].\"**\n\nThen write your one-liner elevator pitch: if you had 10 seconds, what do you say?",
      placeholder: "Value proposition: I help...\nOne-liner: ...",
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
      content: "Your value proposition is the most important sentence in your business. It shows up on your landing page, your pitch deck, your social media bio, and your elevator pitch.\n\nIf someone reads your value proposition and immediately understands who it's for and why it matters — it's working.\n\n**Up next:** *Branding 101 — Name, Logo, Colors, Vibe*. You know what your business does. Now it needs a name, a look, and a personality."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Read your value proposition out loud (to yourself or a partner). Does it answer all three questions?\n- WHO is it for?\n- WHAT outcome do they get?\n- HOW does your business deliver it?\n\nIf any are unclear, revise it now.",
      placeholder: "My value proposition: ...\nRevised (if needed): ...",
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
        { term: "Value proposition", definition: "A clear statement explaining what your business does, who it's for, and what outcome the customer gets — answers 'why should I care?'" },
        { term: "Features", definition: "The attributes or characteristics of a product — what it IS." },
        { term: "Benefits", definition: "What a feature means for the customer — what they GET or how it improves their life." },
        { term: "Elevator pitch", definition: "A one-sentence summary of your business you could deliver in the time it takes to ride an elevator — typically 10-30 seconds." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("entrepreneurship-value-prop")
      .set(lesson);
    console.log('✅ Lesson "Value Proposition" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-value-prop");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
