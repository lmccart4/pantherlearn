// seed-dl-u6-week1-activities.js
// Digital Literacy — Unit 6 Week 1 (Apr 20–24) — Lessons 33–37 (Creator Economy → Revenue Models)
// Updates 5 lessons with screen-first hands-on activities, real template links, activity images.
// Preserves block IDs via safeLessonWrite for any existing student progress.
// Leaves visible: false. Sets gradesReleased: true for same-day grade visibility.
//
// Run: node scripts/seed-dl-u6-week1-activities.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const IMG_BASE = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy";

// Template IDs (created as shareable "anyone with link can view")
const TPL = {
  creatorAtlas:   "1GtQbPmiFwEUAO-gMLPsqngeta5rbvZlS4EGMpl1l6hs", // Slides
  nicheTree:      "1WmAVpeMRFlw-MyzMtdhk73UQ8y7HuAm8O2IJObWDI3c", // Slides
  speedDating:    "1ttNYIOV-MJUodlhg-ymCIs-d2uJoIp1-a9yf3Wd9fn4", // Sheets
  revenueAutopsy: "1uOv5_RrbbVpFwXb0CSWXbJQpNj0pWiVs2jgtvV0yn4M", // Sheets
};
const slidesCopy = id => `https://docs.google.com/presentation/d/${id}/copy`;
const sheetsCopy = id => `https://docs.google.com/spreadsheets/d/${id}/copy`;

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// ═══════════════════════════════════════════════════════════════
// Shared Canva instructions (no programmatic Canva template; student
// starts blank and builds to spec — same as Slides but in Canva).
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────
// L32 — Creator Economy → CLASS CREATOR ATLAS
// ───────────────────────────────────────────────────────────────

const creatorEconomyUpdate = {
  title: "The Creator Economy — How People Your Age Make Money Online",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 33,
  visible: false,
  gradesReleased: true,
  blocks: [
    { id: uid(), type: "section_header", icon: "👋", title: "Warm Up" },
    { id: uid(), type: "text", content: "Somewhere right now, a 17-year-old is making $2,000/month selling Notion templates they made on a Chromebook. Another is making $500/month on Etsy selling digital wallpapers. Another is running a 5,000-follower TikTok about fantasy book recs and just signed her first brand deal.\n\n**None of them are 'influencers.' They're all running real online businesses.**\n\nThis unit: you'll build one too." },
    { id: uid(), type: "callout", style: "highlight", content: "**Question of the Day:** If you couldn't get a traditional job but had a laptop and Wi-Fi — how would you make money?" },
    { id: uid(), type: "question", questionType: "short_answer", prompt: "Have you ever bought something from an independent creator online? (Etsy shop, someone's link-in-bio, a TikTok creator's shop, a YouTuber's merch, a classmate's commission.) What did you buy and why?" },
    { id: uid(), type: "objectives", title: "Learning Objectives", items: [
      "Identify at least 4 ways people earn money online beyond 'being famous'",
      "Distinguish between active income and passive income in digital businesses",
      "Research and analyze a real young online creator's business model",
    ]},

    { id: uid(), type: "section_header", icon: "💸", title: "8 Ways to Make Money Online" },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-creator-economy-ecosystem.jpg`, caption: "The creator economy isn't just one thing — it's a whole ecosystem of ways to earn." },
    { id: uid(), type: "text", content: "**Active income** = you work → you get paid. Stop working, stop earning.\n**Passive income** = you do the work once → it keeps paying you.\n\n| Model | Example | Active or Passive |\n|---|---|---|\n| **Freelancing** | Graphic design on Fiverr, tutoring | Active |\n| **Content creation** | YouTube ad revenue, brand deals | Both |\n| **Digital products** | Selling templates, presets, ebooks | Passive |\n| **E-commerce** | Etsy shop, print-on-demand merch | Both |\n| **Services** | Social media management, web design | Active |\n| **Courses/coaching** | Teaching a skill online | Both |\n| **Affiliate marketing** | Recommending products for commission | Passive |\n| **Apps/tools** | Building something people pay to use | Passive |" },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-creator-active-passive-income.jpg`, caption: "Active income trades your time for money. Passive income keeps earning after the work is done." },
    { id: uid(), type: "callout", style: "info", content: "**The 1,000 True Fans idea:** You don't need millions of followers. If 1,000 people pay you $100/year, that's $100,000/year. Most successful online businesses are small and niche, not viral." },
    { id: uid(), type: "question", questionType: "multiple_choice",
      prompt: "A student creates a pack of 50 Canva resume templates and sells them for $15 each on Etsy. She spends 2 days building them in January. By June, she's made $450 without doing any more work. What type of income is this?",
      options: [
        "Passive income — she created it once and it keeps earning without additional work",
        "Active income — she did the work to create the templates",
        "Neither — it's not a real business model",
        "Both equally",
      ],
      correctIndex: 0,
      explanation: "Passive income: the work is up-front, and earnings continue without additional labor per sale. This is why digital products are so attractive — you build once, and every new sale is a copy.",
      difficulty: "easy",
    },

    // ═══ NEW ACTIVITY: Class Creator Atlas ═══
    { id: uid(), type: "section_header", icon: "🗺️", title: "Class Creator Atlas", subtitle: "Research a real young creator — one slide each" },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-u6-creator-atlas-activity.jpg`, caption: "Every student researches one creator; the class ends up with a full atlas of the creator economy." },
    { id: uid(), type: "activity", icon: "🗺️", title: "Build the Atlas (20 min)",
      instructions: "**Goal:** By the end of class, our shared deck has ONE slide per student = a map of ~20 real young creators we can study.\n\n**Steps:**\n\n1. **Claim your creator** (3 min). Find a real online creator who looks like they're under 30 and is making money independently. Rules: real person (not a big company), active within the last 6 months, makes money online (you can tell how).\n\n2. **Research** (10 min) — dig into their profile, about page, recent posts, and any interviews or link-in-bio.\n\n3. **Fill your slide** (7 min):\n   - Creator name + platform handle\n   - Their niche (one sentence)\n   - Business model (pick from the 8 — freelancing, digital products, e-commerce, content/ads, services, courses, affiliates, apps)\n   - How they make money (be specific — \"$X product,\" \"brand deals,\" \"Patreon tiers,\" etc.)\n   - Estimated monthly earnings + your source\n   - Link to their main profile\n\n**Pick your tool — both work:**",
    },
    { id: "link-atlas-slides", type: "external_link", icon: "📊",
      title: "Option A: Google Slides (shared class deck)",
      description: "Make a copy → claim a slide → add your creator. This is the shared class atlas.",
      url: slidesCopy(TPL.creatorAtlas),
      buttonLabel: "Open Slides Template"
    },
    { id: "link-atlas-canva", type: "external_link", icon: "🎨",
      title: "Option B: Canva Presentation",
      description: "Open Canva → Create a design → \"Presentation\" → build your 1 slide using the same fields. Share the link when done.",
      url: "https://www.canva.com/create/presentations/",
      buttonLabel: "Open Canva"
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Paste the link to your slide (or your Canva share link). Then answer: Which business model is your creator using, and what surprised you most about how they actually earn money?",
    },

    // ═══ Apply to your own business (kept from original) ═══
    { id: uid(), type: "section_header", icon: "🧰", title: "Your Skills + Interests Inventory" },
    { id: uid(), type: "text", content: "Before you can build a business, you need to know your starting material — what you're good at, what you know a lot about, and what you'd actually enjoy working on. This inventory is the foundation for the rest of the unit." },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "List 3 skills you have — things you can DO. These can be technical (editing, coding, drawing) or soft (organizing, explaining, leading).",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "List 2-3 topics you know A LOT about — things you could talk about for an hour without running out of things to say.",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "First business idea: Combine one skill + one knowledge area + one business model. Write 2-3 sentences on what that business could look like.",
    },

    { id: uid(), type: "section_header", icon: "🎯", title: "Wrap Up" },
    { id: uid(), type: "text", content: "You don't need to be famous, rich, or a tech genius to build an online business. You need: a skill, a topic you understand, and a model for how the money flows. That's it. This week, we're going to take your first idea and make it real." },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Exit Ticket: Which of the 8 business models most interests you for your own potential business — and why? Name one creator from our class atlas who's doing that model.",
    },
    { id: uid(), type: "section_header", icon: "📚", title: "Key Vocabulary" },
    { id: uid(), type: "vocab_list", items: [
      { term: "Active income", definition: "Income you earn by actively working — stop working, stop earning." },
      { term: "Passive income", definition: "Income that continues to earn after the initial work is done." },
      { term: "Creator economy", definition: "The broader ecosystem of independent creators who earn money online through content, products, or services." },
      { term: "Niche", definition: "A specific, focused segment of an audience — the opposite of trying to reach everyone." },
      { term: "Business model", definition: "The method by which a business earns revenue — the 'how do we make money' answer." },
    ]},
  ],
};

// ───────────────────────────────────────────────────────────────
// L33 — Finding Your Niche → THE NICHE TREE
// ───────────────────────────────────────────────────────────────

const nicheUpdate = {
  title: "Finding Your Niche — The Riches Are in the Niches",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 34,
  visible: false,
  gradesReleased: true,
  blocks: [
    { id: uid(), type: "section_header", icon: "👋", title: "Warm Up" },
    { id: uid(), type: "text", content: "\"Cooking videos\" — there are 50 million of them on YouTube. You'd compete with every cooking channel ever made.\n\n\"5-ingredient weeknight dinners for high school students who only have a microwave\" — now you have maybe 50 competitors, and a clearly defined audience. Go ahead and win them." },
    { id: uid(), type: "callout", style: "highlight", content: "**Question of the Day:** Why does \"fitness tips for busy college students\" work better as a business than just \"fitness tips\"?" },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Rate these 3 business ideas from most broad (1) to most specific (3) — then explain which would be easiest to build an audience for and why:\n\nA. \"Gaming tips\"\nB. \"Tips for Fortnite players on a controller\"\nC. \"Gaming content\"",
    },
    { id: uid(), type: "objectives", title: "Learning Objectives", items: [
      "Define 'niche' and explain why specificity beats breadth in digital business",
      "Use the 3-circle framework (passion + skill + demand) to evaluate niche ideas",
      "Build a personal niche tree narrowing a broad topic to a specific, viable business",
    ]},

    { id: uid(), type: "section_header", icon: "🎯", title: "The 3-Circle Framework" },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-entrepreneurship-niche-three-circles.jpg`, caption: "The best niches live where passion, skill, and demand overlap." },
    { id: uid(), type: "text", content: "The best niches sit at the intersection of three things:\n\n**Circle 1: What you're passionate about** — You'll quit if you hate it. Pick something you'd do for free.\n**Circle 2: What you're good at (or willing to learn)** — Skills you have or can develop.\n**Circle 3: What people actually want** — This is the one most people skip. Your passion project still needs an audience.\n\nThe sweet spot is where ALL THREE overlap. Missing circle 1? You'll burn out. Missing 2? You can't deliver. Missing 3? Nobody's buying." },
    { id: uid(), type: "callout", style: "info", content: "**How to test demand (free):**\n- Search YouTube/TikTok for your topic. Do videos get views?\n- Search Reddit/forums — are people asking questions about it?\n- Google Trends — interest growing, flat, or dying?\n- Look at competitors. Competition = demand. NO competition often = no demand." },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-entrepreneurship-niche-funnel.jpg`, caption: "Going broad means competing with millions. Going specific means winning a smaller, reachable audience." },
    { id: uid(), type: "question", questionType: "multiple_choice",
      prompt: "A student is passionate about video games and is skilled at video editing. She wants to start a gaming YouTube channel. She searches YouTube and sees that gaming content already has millions of channels. What does this tell her?",
      options: [
        "She should give up — too much competition",
        "There's clear demand for this content — now she needs a more specific angle to stand out",
        "She should pick a completely different topic with no competitors",
        "The algorithm is against her",
      ],
      correctIndex: 1,
      explanation: "Competition = demand. Millions of channels means millions of viewers. She doesn't need a new planet — she needs a specific angle (e.g., \"5-minute Valorant tips for new players who keep dying first\") that carves out a slice of the existing audience.",
      difficulty: "easy",
    },
    { id: uid(), type: "question", questionType: "multiple_choice",
      prompt: "Which niche statement best follows the formula '[specific thing] for [specific audience] who [specific situation]'?",
      options: [
        "\"Fitness content for everyone\"",
        "\"Home workouts for busy people\"",
        "\"Fitness tips and motivation\"",
        "\"10-minute bedroom workouts for high school students who don't have gym access\"",
      ],
      correctIndex: 3,
      explanation: "The winner names the thing (10-minute bedroom workouts), the audience (high school students), and the situation (no gym access). The others are too broad — they could describe thousands of channels.",
      difficulty: "easy",
    },

    // ═══ NEW ACTIVITY: The Niche Tree ═══
    { id: uid(), type: "section_header", icon: "🌳", title: "Build Your Niche Tree", subtitle: "From broad to specific, in 4 branches" },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-u6-niche-tree-activity.jpg`, caption: "A niche tree: the trunk is broad. Each branch narrows further. The leaves are where real businesses live." },
    { id: uid(), type: "activity", icon: "🌳", title: "Your Niche Tree (15 min)",
      instructions: "**Goal:** Start with a broad topic you care about and narrow it to a specific, viable niche in 4 steps.\n\n**Steps:**\n\n1. **Trunk** — Your broad topic (one word or phrase). Examples: Fitness. Gaming. Music. Fashion. Cooking.\n2. **Branch 1** — Narrow by sub-topic. \"Fitness\" → \"home fitness.\"\n3. **Branch 2** — Narrow by audience. \"Home fitness\" → \"home fitness for teens.\"\n4. **Leaf** — Narrow by situation or outcome. \"Home fitness for teens\" → \"10-minute bedroom workouts for teens who don't have gym access.\"\n\n**Then — demand check.** Search your leaf on YouTube or TikTok. Screenshot or note: are people making this content? Are videos getting views? If yes, you've found a real niche.\n\n**Pick your tool — both work:**",
    },
    { id: "link-niche-slides", type: "external_link", icon: "📊",
      title: "Option A: Google Slides (template with trunk / branches / leaf layout)",
      description: "File → Make a copy. Fill in your tree and the demand screenshot.",
      url: slidesCopy(TPL.nicheTree),
      buttonLabel: "Open Slides Template"
    },
    { id: "link-niche-canva", type: "external_link", icon: "🎨",
      title: "Option B: Canva (whiteboard or presentation)",
      description: "Open Canva → choose Whiteboard or Presentation → build the 4-level tree with text boxes or shapes.",
      url: "https://www.canva.com/create/whiteboards/",
      buttonLabel: "Open Canva"
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Paste your Slides/Canva link. Then write your final niche statement in this format: [specific thing] for [specific audience] who [specific situation].",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Demand check: What did your search turn up? Paste or describe 1-2 examples showing this niche has a real audience (channel names, follower counts, recent post views — anything that proves demand).",
    },

    { id: uid(), type: "section_header", icon: "🎯", title: "Wrap Up" },
    { id: uid(), type: "text", content: "Your niche statement is the foundation of everything you'll build in this unit. Every lesson from here out — your value proposition, your brand, your revenue model — assumes you know exactly WHO you're serving and WHAT they need. If your niche is fuzzy, everything else will be fuzzy too." },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Exit Ticket: What's your final niche statement for this unit? What's one piece of demand evidence you found that convinces you this niche has real potential?",
    },
    { id: uid(), type: "section_header", icon: "📚", title: "Key Vocabulary" },
    { id: uid(), type: "vocab_list", items: [
      { term: "Niche", definition: "A specific, focused segment of an audience with shared needs or interests." },
      { term: "3-Circle Framework", definition: "The overlap of passion, skill, and demand — the ideal location for a business." },
      { term: "Demand validation", definition: "Checking that real people actually want your product before you build it." },
      { term: "Target audience", definition: "The specific group of people your business serves — not everyone, a specific someone." },
    ]},
  ],
};

// ───────────────────────────────────────────────────────────────
// L34 — Value Proposition → SPEED DATING (in-person)
// ───────────────────────────────────────────────────────────────

const valuePropUpdate = {
  title: "Value Proposition — Why Would Anyone Care?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 35,
  visible: false,
  gradesReleased: true,
  blocks: [
    { id: uid(), type: "section_header", icon: "👋", title: "Warm Up" },
    { id: uid(), type: "image", url: `${IMG_BASE}/digital-literacy-features-vs-benefits.jpg`, caption: "Features describe what a product IS. Benefits describe what it does FOR YOU." },
    { id: uid(), type: "text", content: "Look at these two descriptions of the same laptop:\n\n**Description A (Features):** *16GB RAM, M3 chip, 14-inch Retina display, 18-hour battery*\n**Description B (Benefits):** *Edit a full movie without lag, work all day without a charger, color-accurate for your designs.*\n\nWhich one would make you actually buy the laptop?" },
    { id: uid(), type: "callout", style: "highlight", content: "**Question of the Day:** People don't buy products — they buy solutions to their problems. What problem does YOUR business solve?" },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Think of the last thing you bought (or wanted to buy). Did you buy it because of what it IS (its features) or what it would DO for you (its benefits)? Be specific.",
    },
    { id: uid(), type: "objectives", title: "Learning Objectives", items: [
      "Define value proposition and explain why it matters more than the product itself",
      "Differentiate between features and benefits",
      "Write a clear value proposition and refine it through live peer feedback",
    ]},

    { id: uid(), type: "section_header", icon: "💎", title: "Features vs. Benefits — and the Value Prop Framework" },
    { id: uid(), type: "text", content: "**Features** describe what a product IS. **Benefits** describe what it DOES FOR THE CUSTOMER.\n\n| Feature | Benefit |\n|---|---|\n| 100+ templates | Never start from a blank page |\n| Free shipping | No surprise costs at checkout |\n| 24/7 support | Get help whenever you're stuck |\n\n**People buy benefits. Features are proof the benefits are real.**" },
    { id: uid(), type: "text", content: "**The Value Proposition Framework:**\n\n> **\"I help [specific audience] [achieve specific outcome] by [your unique method/product].\"**\n\nExamples:\n- Canva: \"We help non-designers create professional graphics by providing drag-and-drop templates.\"\n- A student tutor: \"I help freshmen pass biology by making study guides that actually make sense.\"" },
    { id: uid(), type: "image", url: `${IMG_BASE}/digital-literacy-value-prop-framework.jpg`, caption: "The value proposition formula: WHO you help + WHAT you help them do + HOW you do it." },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "**Feature → Benefit Translator.** Pick 3 of these features and rewrite each as a customer-facing benefit (what does this do FOR ME?):\n\n1. \"Waterproof to 30 meters\"\n2. \"AI-powered recommendations\"\n3. \"Ships in 2 business days\"\n4. \"No account required\"\n5. \"500GB cloud storage\"\n6. \"Built-in grammar checker\"",
    },
    { id: uid(), type: "question", questionType: "multiple_choice",
      prompt: "Which is the strongest value proposition?",
      options: [
        "\"We sell workout programs.\"",
        "\"Our app has over 500 workouts, a calorie tracker, and video demos.\"",
        "\"We help busy parents get a full-body workout in 20 minutes — no gym membership, no commute.\"",
        "\"Get fit fast!\"",
      ],
      correctIndex: 2,
      explanation: "Only this option names WHO (busy parents), WHAT (full-body workout), and HOW (20 minutes, no gym). The others are features, or vague, or don't specify the audience.",
      difficulty: "medium",
    },

    { id: uid(), type: "section_header", icon: "📝", title: "Build Your Value Proposition" },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "List 3 features of YOUR business concept (from your niche in Lesson 33). What does it include? What's in it?",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Translate each feature into a benefit. For each one, ask: 'So what does this mean FOR MY CUSTOMER?'",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Write your value proposition using the framework: **\"I help [specific audience] [achieve specific outcome] by [method/product].\"** — call this your v1.",
    },

    // ═══ NEW ACTIVITY: Speed Dating ═══
    { id: uid(), type: "section_header", icon: "🎤", title: "Pitch Speed Dating", subtitle: "Say it out loud. 4 rounds. Rotate." },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-u6-speed-dating-activity.jpg`, caption: "Your value prop only works if it works when you actually say it out loud. Four rounds. Revise between each." },
    { id: uid(), type: "activity", icon: "🎤", title: "Speed Dating Your Value Prop (15 min)",
      instructions: "**Goal:** Pressure-test your value proposition by saying it out loud to 4 different people and revising between each round.\n\n**Setup:** Everyone grabs a partner. You'll rotate 4 times.\n\n**Each round = 3 minutes total:**\n- 60 sec — Person A pitches. (Stick to the framework: \"I help [who] [do what] by [how].\")\n- 30 sec — Partner fills in their scorecard: what LANDED, what DIDN'T land, \"would you buy?\" (1-5).\n- 60 sec — Switch: Person B pitches while A scores.\n- 30 sec — Revise your pitch for round 2.\n\n**Between rounds:** Edit your value prop. Keep what worked, cut what didn't.\n\n**After round 4:** Write your v4 — your refined pitch after hearing 4 rounds of feedback.\n\n**Rules:**\n- Don't read from your phone/laptop — this is a spoken pitch.\n- Partners: be honest. A generous-but-false \"4\" helps no one.",
    },
    { id: "link-speed-scorecard", type: "external_link", icon: "📋",
      title: "Speed Dating Scorecard (Google Sheets)",
      description: "Make a copy. Log what landed, what didn't, and the would-you-buy score for each of 4 rounds.",
      url: sheetsCopy(TPL.speedDating),
      buttonLabel: "Open Scorecard Template"
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Paste your v1 (the one you walked into speed dating with) AND your v4 (after 4 rounds of feedback). What specifically changed, and why?",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "What's the one pattern you heard across multiple partners? (e.g., \"everyone got confused when I said ___\" or \"the line about ___ always landed.\") What does that tell you about how to pitch your business?",
    },

    { id: uid(), type: "section_header", icon: "🎯", title: "Wrap Up" },
    { id: uid(), type: "text", content: "Your value proposition is the most important sentence in your business. It shows up on your website, in your ads, on your social bio, in every conversation. The pitch you say OUT LOUD to real people is usually clearer than the one you wrote at your desk — that's why today mattered." },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Exit Ticket: Read your v4 value proposition out loud to yourself one more time. Does it answer: who, what, how? If not, fix it right now and paste the final version.",
    },
    { id: uid(), type: "section_header", icon: "📚", title: "Key Vocabulary" },
    { id: uid(), type: "vocab_list", items: [
      { term: "Value proposition", definition: "A clear statement of who you help, what you help them do, and how." },
      { term: "Feature", definition: "What a product IS — the technical specs, contents, or attributes." },
      { term: "Benefit", definition: "What a product DOES FOR YOU — the outcome the customer actually cares about." },
      { term: "Elevator pitch", definition: "A short spoken summary of your business — ~30 seconds, delivered from memory." },
    ]},
  ],
};

// ───────────────────────────────────────────────────────────────
// L35 — Branding 101 → CANVA BRAND KIT
// ───────────────────────────────────────────────────────────────

const brandingUpdate = {
  title: "Branding 101 — Name, Logo, Colors, Vibe",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 36,
  visible: false,
  gradesReleased: true,
  blocks: [
    { id: uid(), type: "section_header", icon: "👋", title: "Warm Up" },
    { id: uid(), type: "text", content: "You've never bought from a particular brand before. You've never heard a review. But you look at their Instagram and think — *this feels legit, I'd buy from them.*\n\nThat feeling isn't random. It's the result of a hundred design decisions: colors, fonts, photos, tone, spacing. That's branding." },
    { id: uid(), type: "callout", style: "highlight", content: "**Question of the Day:** Why do you trust some brands you've never bought from, just based on how they look?" },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Think of a brand whose visual identity you really like — any brand. What colors, fonts, and vibe do they use? Why do you think it works?",
    },
    { id: uid(), type: "objectives", title: "Learning Objectives", items: [
      "Identify the 4 pillars of brand identity (name, logo, colors, voice)",
      "Analyze how branding decisions communicate values and attract specific audiences",
      "Build a shareable brand identity kit for their business in Canva",
    ]},

    { id: uid(), type: "section_header", icon: "🎨", title: "The 4 Pillars of Brand Identity" },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-entrepreneurship-branding-mood-board.jpg`, caption: "A strong brand identity kit includes your name, logo, colors, typography, and voice — all working together." },
    { id: uid(), type: "text", content: "**1. Name** — Short, memorable, easy to spell and search. Ask: can someone Google it after hearing it once?\n\n**2. Logo** — Simple beats complex. If it doesn't work in black and white at 20px, it's too complicated.\n\n**3. Color palette** — 2-3 colors max. Colors carry meaning:\n  - Blue = trust, professional\n  - Red = energy, urgency\n  - Green = growth, health\n  - Black = luxury, sophistication\n  - Yellow = optimism, youth\n\n**4. Brand voice** — How you \"sound\" in writing. Funny? Serious? Casual? Motivational? Your voice should match your audience." },
    { id: uid(), type: "callout", style: "info", content: "**Consistency = trust.** The reason you recognize brands instantly is because they never deviate. Every post, every ad, every email — same colors, same fonts, same voice. Pick your rules and stick to them." },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-entrepreneurship-branding-consistency.jpg`, caption: "Consistency builds trust. When your colors, fonts, and tone stay the same across every touchpoint, you look legit." },
    { id: uid(), type: "question", questionType: "multiple_choice",
      prompt: "A student is launching a tutoring service for anxious high school students who struggle with math. Which color palette best matches the audience?",
      options: [
        "Soft blue and light green — communicates calm, trust, and supportive growth",
        "Neon pink and black — attention-grabbing, edgy",
        "Bright red and gold — conveys urgency and prestige",
        "Pure black and silver — signals luxury and exclusivity",
      ],
      correctIndex: 0,
      explanation: "Audience FIRST. Anxious students need calming, trustworthy vibes. Soft blue and green communicate exactly that. Neon pink/black screams 'edgy club' — the opposite of what this audience needs.",
      difficulty: "medium",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Read these two social media captions for the same fitness app. Which brand voice do you think matches which audience?\n\n**A:** \"Crush today. Zero excuses. Your body is your weapon.\"\n**B:** \"Today you showed up, and that's enough. One step, then another. We're proud of you.\"",
    },

    // ═══ NEW ACTIVITY: Canva Brand Kit ═══
    { id: uid(), type: "section_header", icon: "🎨", title: "Build Your Brand Identity Kit", subtitle: "Canva or Slides — 20 minutes" },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-u6-brand-kit-activity.jpg`, caption: "Your brand kit: logo, 3 colors, 2 fonts, and one sample post — on a single page you can actually share." },
    { id: uid(), type: "activity", icon: "🎨", title: "Your Brand Kit (20 min)",
      instructions: "**Goal:** One shareable page that IS your brand. If someone lost your whole business tomorrow and only had this page, they could rebuild the look.\n\n**Required elements:**\n\n1. **Business name** (with a 1-sentence reason why)\n2. **Logo** — can be text-based, typographic, or a simple icon\n3. **Color palette** — 3 colors with hex codes\n4. **Typography** — 1 heading font + 1 body font (demonstrate each with a sample)\n5. **Brand voice** — 3 adjectives describing how your brand \"talks\"\n6. **One sample social media post** using everything above\n\n**Tool check — Canva is built for this, but Slides works just as well:**",
    },
    { id: "link-brand-canva", type: "external_link", icon: "🎨",
      title: "Option A: Canva Brand Kit (recommended — built for this)",
      description: "Open Canva → Create a design → \"Presentation\" or \"Brand Kit.\" Canva's palette generator, logo maker, and font picker do most of the work.",
      url: "https://www.canva.com/create/logos/",
      buttonLabel: "Open Canva"
    },
    { id: "link-brand-slides", type: "external_link", icon: "📊",
      title: "Option B: Google Slides (single-page brand board)",
      description: "File → New → Presentation. Build a single slide with your name, logo, color swatches, fonts, and sample post.",
      url: "https://docs.google.com/presentation/create",
      buttonLabel: "Open Google Slides"
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Paste the link to your Canva design or Slides deck. (Make sure it's set to \"anyone with the link can view.\")",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Business name — what did you pick and why? (Is it short? Searchable? Does it hint at what you do?)",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Your 3 brand colors (with hex codes) — what do you want each one to communicate to your audience?",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Your brand voice in 3 adjectives. Then write ONE sample caption in that voice for your sample post.",
    },

    { id: uid(), type: "section_header", icon: "🎯", title: "Wrap Up" },
    { id: uid(), type: "text", content: "Your brand kit is a reference document you'll use for everything you build: your social posts, your website, your emails, your packaging. Keep the link saved — you'll be pointing back to it every week." },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Exit Ticket: Look at your brand page. Would your target audience trust this brand based on how it looks? What would you change if you had another hour?",
    },
    { id: uid(), type: "section_header", icon: "📚", title: "Key Vocabulary" },
    { id: uid(), type: "vocab_list", items: [
      { term: "Brand identity", definition: "The visual and verbal expression of a brand — name, logo, colors, typography, voice." },
      { term: "Color palette", definition: "The specific set of colors a brand uses consistently across everything." },
      { term: "Brand voice", definition: "The consistent way a brand sounds in writing and speech — tone, vocabulary, personality." },
      { term: "Brand consistency", definition: "Using the same visual and verbal identity across every touchpoint." },
    ]},
  ],
};

// ───────────────────────────────────────────────────────────────
// L36 — Revenue Models → REVENUE AUTOPSY (Sheets)
// ───────────────────────────────────────────────────────────────

const revenueUpdate = {
  title: "Revenue Models — How Does the Money Actually Work?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 37,
  visible: false,
  gradesReleased: true,
  blocks: [
    { id: uid(), type: "section_header", icon: "👋", title: "Warm Up" },
    { id: uid(), type: "text", content: "Two creators. Same topic. Same content quality.\n\n**Creator A** has 50,000 followers and makes $0.\n**Creator B** has 800 followers and makes $2,400/month.\n\nWhat's the difference? It's not about size — it's about how they get paid." },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-revenue-followers-vs-income.jpg`, caption: "50,000 followers making $0 versus 800 followers making $2,400/month. Followers aren't revenue." },
    { id: uid(), type: "callout", style: "highlight", content: "**Question of the Day:** If a creator has 10,000 followers but makes $0, and another has 500 followers but makes $3,000/month — what's the difference?" },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "How do these platforms make money?\n- Instagram\n- Spotify\n- Fortnite (the game is free)\n- Google (Search is free)\n\nIf the product is free, someone else is paying — who, and for what?",
    },
    { id: uid(), type: "objectives", title: "Learning Objectives", items: [
      "Identify and explain 5 common digital revenue models",
      "Calculate realistic revenue projections using basic assumptions",
      "Audit 6 fictional businesses to see how hidden fees change real take-home pay",
      "Select a revenue model for their own business and justify it with math",
    ]},

    { id: uid(), type: "section_header", icon: "💵", title: "5 Revenue Models for Digital Businesses" },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-revenue-models-four-types.jpg`, caption: "Every digital business needs a clear revenue model — how exactly does money flow in?" },
    { id: uid(), type: "text", content: "**1. Per-Sale (One-Time)** — Customer pays once, gets the product. Templates, art prints, ebooks.\n   Revenue = price × number of sales\n\n**2. Subscription (Recurring)** — Customer pays monthly/yearly for ongoing access.\n   Revenue = monthly price × subscribers\n\n**3. Ad-supported** — Content is free, advertisers pay you. YouTube, blogs, podcasts.\n   Revenue = views × CPM (~$3-5 per 1,000 views for most niches)\n\n**4. Freemium** — Basic free, premium costs money. Apps, tools, courses.\n   Revenue depends on conversion rate (usually 2-5% of free users upgrade)\n\n**5. Service/Freelance** — Client pays for your time/skill. Design, tutoring, social media management.\n   Revenue = rate × hours (or per-project pricing)" },
    { id: uid(), type: "callout", style: "info", content: "**The math reality check:** Most online businesses start small. $300-600/month in the first year is a real result. Your job isn't to project going viral — it's to find numbers that work even when growth is slow." },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Calculate the monthly revenue for each scenario:\n\n1. An artist sells custom pet portrait commissions for $45 each, and gets 8 orders a month.\n2. A YouTuber gets 50,000 views/month at $4 CPM (cost per 1,000 views).\n3. A Notion template creator has 40 active subscribers paying $5/month.",
    },
    { id: uid(), type: "question", questionType: "multiple_choice",
      prompt: "A student wants to build a business teaching others how to use Canva for small businesses. She has strong teaching skills and can create detailed materials. Which revenue model is likely BEST for her?",
      options: [
        "Ad-supported — start a YouTube channel and wait for ad revenue",
        "Per-sale — create a comprehensive Canva course and sell it for $29",
        "Freemium — give away everything free hoping a few users upgrade",
        "Subscription — charge $50/month regardless of student level",
      ],
      correctIndex: 1,
      explanation: "She has a concrete, teachable skill — perfect for a one-time digital product. Ad revenue requires huge view counts; freemium is tricky when you're small; $50/month is steep without ongoing value. A one-time $29 course meets the audience where they are and earns per sale.",
      difficulty: "medium",
    },

    // ═══ NEW ACTIVITY: Revenue Autopsy ═══
    { id: uid(), type: "section_header", icon: "🔍", title: "Revenue Autopsy", subtitle: "6 fake businesses. Reveal the hidden fees. Then plan yours." },
    { id: uid(), type: "image", url: `${IMG_BASE}/dl-u6-revenue-autopsy-activity.jpg`, caption: "Revenue Autopsy: each tab is a fake business. Compute take-home. Flip the hidden-fees column. Learn what eats your margins." },
    { id: uid(), type: "activity", icon: "🔍", title: "Revenue Autopsy (20 min)",
      instructions: "**Goal:** Learn what platforms, fees, and refunds actually take from your revenue BEFORE you bet your own business on a model.\n\n**Part 1 — Audit the 6 Businesses (12 min):**\n\nThe template has 6 tabs — each one is a fake digital business (Etsy candle seller, fitness TikToker, Notion subscription, Fiverr designer, YouTube gaming channel, Canva course). For each tab:\n1. Calculate the **gross revenue** using the formula shown (price × volume, or views × CPM, etc.)\n2. Record your number in the visible column.\n3. Reveal the hidden columns (platform fee %, refund rate %). Calculate **net take-home**.\n4. Note what % of gross disappeared. You'll be surprised.\n\n**Part 2 — Your Business (8 min):**\n\nGo to the final tab. Build 3 scenarios for YOUR business:\n- **Realistic Month 1** (tiny — you just started)\n- **Expected 6 months in** (you've got traction)\n- **Stretch goal — 1 year in** (still honest, not viral)\n\nWrite one sentence: *\"I chose [model] because [reason]. My business would need [X customers/sales/views] to make $[Y]/month take-home.\"*\n\n**Rule:** Plan for realistic small-scale success, not going viral.",
    },
    { id: "link-revenue-autopsy", type: "external_link", icon: "📊",
      title: "Revenue Autopsy Workbook (Google Sheets)",
      description: "6 business tabs + 1 tab for your own projections. Make a copy and fill it in.",
      url: sheetsCopy(TPL.revenueAutopsy),
      buttonLabel: "Open Workbook Template"
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Paste the link to your completed autopsy workbook. Which of the 6 fake businesses had the BIGGEST gap between gross and take-home revenue — and what ate the margin?",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Your business — which revenue model did you pick, and why is it the right fit for your niche (from Lesson 33)?",
    },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Show your math for month 1, month 6, and month 12. Are these realistic? What would have to be true for them to happen?",
    },

    { id: uid(), type: "section_header", icon: "🎯", title: "Wrap Up" },
    { id: uid(), type: "text", content: "Every digital business needs a revenue model — a clear answer to \"how do I get paid?\" No model = no business. But the autopsy you just did shows why gross revenue isn't the full picture — platform fees and refunds can eat 20-40% of what customers pay you." },
    { id: uid(), type: "question", questionType: "short_answer",
      prompt: "Exit Ticket: What surprised you most about revenue math for digital businesses? Did any of the 6 autopsies change how you think about your own model?",
    },
    { id: uid(), type: "section_header", icon: "📚", title: "Key Vocabulary" },
    { id: uid(), type: "vocab_list", items: [
      { term: "Revenue model", definition: "The method by which a business earns income — per-sale, subscription, ads, freemium, or services." },
      { term: "CPM", definition: "Cost per 1,000 impressions/views — the standard unit for ad-based revenue." },
      { term: "Conversion rate", definition: "The percentage of free users who upgrade to paid (usually 2-5% for freemium)." },
      { term: "Platform fee", definition: "The cut a platform takes from your revenue (Etsy ~6.5%, Patreon 5-12%, App Store 15-30%)." },
      { term: "Gross vs. net revenue", definition: "Gross is what customers pay. Net is what you keep after fees, refunds, and costs." },
    ]},
  ],
};

// ═══════════════════════════════════════════════════════════════
// SEED
// ═══════════════════════════════════════════════════════════════

const lessons = [
  { slug: "entrepreneurship-creator-economy", data: creatorEconomyUpdate },
  { slug: "entrepreneurship-niche",           data: nicheUpdate },
  { slug: "entrepreneurship-value-prop",      data: valuePropUpdate },
  { slug: "entrepreneurship-branding",        data: brandingUpdate },
  { slug: "entrepreneurship-revenue",         data: revenueUpdate },
];

async function main() {
  console.log("🚀 Seeding DL Unit 6 Week 1 — hands-on activity updates...\n");
  for (const { slug, data } of lessons) {
    const res = await safeLessonWrite(db, COURSE_ID, slug, { ...data, updatedAt: new Date() });
    console.log(`✅ ${slug}  (${res.action}, preserved ${res.preserved} block IDs)`);
    console.log(`   ${data.blocks.length} blocks  |  visible=${data.visible}  |  gradesReleased=${data.gradesReleased}`);
  }
  console.log("\n🎉 Done.");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
