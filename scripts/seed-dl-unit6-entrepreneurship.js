// seed-dl-unit6-entrepreneurship.js
// Digital Literacy — Unit 6: Digital Entrepreneurship (Lessons 32-41)
// Run: node scripts/seed-dl-unit6-entrepreneurship.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ═══════════════════════════════════════════════════════════════
// LESSON 32: The Creator Economy
// ═══════════════════════════════════════════════════════════════

const lesson32 = {
  title: "The Creator Economy — How People Your Age Make Money Online",
  questionOfTheDay: "If you couldn't get a traditional job but had a laptop and Wi-Fi — how would you make money?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 31,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "💰",
      title: "The Creator Economy",
      subtitle: "How People Your Age Make Money Online",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify at least 4 ways people earn money online beyond 'being famous'",
        "Distinguish between active income and passive income in digital businesses",
        "Evaluate which online business models match different skills and interests",
      ],
    },
    {
      id: uid(), type: "text",
      content: "There are way more ways to make money online than being a famous influencer. Here are the main models:\n\n| Model | Example | Active or Passive? |\n|---|---|---|\n| **Freelancing** | Graphic design on Fiverr, tutoring | Active |\n| **Content creation** | YouTube ad revenue, brand deals | Both |\n| **Digital products** | Selling templates, presets, ebooks | Passive |\n| **E-commerce** | Etsy shop, print-on-demand merch | Both |\n| **Services** | Social media management, web design | Active |\n| **Courses/coaching** | Teaching a skill online | Both |\n| **Affiliate marketing** | Recommending products for commission | Passive |\n| **Apps/tools** | Building something people pay to use | Passive |\n\nKey insight: **You don't need millions of followers.** The \"1,000 true fans\" concept — if 1,000 people pay you $100/year, that's $100K. Most successful online businesses are small and niche, not viral.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "A student sells Notion templates online for $12 each and makes $600/month. What type of online business model is this?",
      options: [
        "Freelancing — they're doing work for individual clients",
        "Digital products — they created it once and sell copies",
        "Affiliate marketing — they're recommending someone else's product",
        "Content creation — they're making YouTube videos about Notion",
      ],
      correctIndex: 1,
      explanation: "Selling templates is a digital product business. You create the product once, and every sale is a copy of the same thing. This is why digital products are considered passive income — the work is upfront, and the selling continues without additional work per sale.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🎯",
      title: "Business Model Match",
      subtitle: "Match skills to the right model",
    },
    {
      id: uid(), type: "activity",
      icon: "🎯",
      title: "Business Model Match",
      instructions: "Match each person to their best business model and justify why:\n\n1. **Maya** — Great at drawing anime-style characters\n2. **Jordan** — Knows everything about sneakers\n3. **Sam** — Amazing at explaining math concepts simply\n4. **Alex** — Always finding the best deals and products online\n5. **Riley** — Incredible at organizing and making aesthetic study planners\n6. **Morgan** — Loves cooking and always improvising recipes\n7. **Taylor** — Knows how to build basic websites\n8. **Jamie** — Has strong opinions about gaming and loves debating\n\nThere's no single right answer — but some fits are better than others.",
    },
    {
      id: "q-match", type: "question",
      questionType: "short_answer",
      prompt: "Pick 3 of the 8 people and explain which business model you'd recommend for each. Why is it a good fit?",
    },

    {
      id: uid(), type: "section_header",
      icon: "💡",
      title: "Your First Idea",
      subtitle: "Brainstorm your business concept",
    },
    {
      id: "q-skills", type: "question",
      questionType: "short_answer",
      prompt: "Self-assessment: (1) List 3 skills you have, (2) List 2-3 topics you know a lot about, (3) Which business model(s) interest you most? (4) Combine one skill + one topic + one model — what could that business look like?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 33: Finding Your Niche
// ═══════════════════════════════════════════════════════════════

const lesson33 = {
  title: "Finding Your Niche — The Riches Are in the Niches",
  questionOfTheDay: "Why does 'fitness tips for busy college students' work better as a business than just 'fitness tips'?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 32,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🎯",
      title: "Finding Your Niche",
      subtitle: "The Riches Are in the Niches",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define 'niche' and explain why specificity beats breadth in digital business",
        "Evaluate niche ideas using the 3-circle framework (passion + skill + demand)",
        "Narrow their business concept to a specific, viable niche",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**The 3-circle framework:**\n\n1. **What you're passionate about** — You'll quit if you hate it. Pick something you'd do for free.\n2. **What you're good at (or willing to learn)** — Skills you have or can develop.\n3. **What people actually want** — This is the one most people skip. Your passion project needs an audience.\n\nThe sweet spot is where all three overlap.\n\n**How to test demand (without spending money):**\n- Search YouTube/TikTok for your topic. Do videos get views?\n- Search Reddit/forums. Are people asking questions about it?\n- Google Trends — is interest growing, flat, or dying?\n- Look at competitors. Competition = demand. No competition often = no demand.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "You search your niche idea on YouTube and find zero videos about it. What does this most likely mean?",
      options: [
        "You found a goldmine — no competition!",
        "There's probably no demand for this topic",
        "YouTube hasn't discovered this niche yet",
        "You should start a podcast instead",
      ],
      correctIndex: 1,
      explanation: "While it's tempting to think 'no competition = opportunity,' it usually means nobody is searching for or interested in that topic. Competition is actually a good sign — it means there's an audience. The goal isn't zero competition, it's finding an underserved angle within a proven niche.",
    },

    {
      id: uid(), type: "section_header",
      icon: "📝",
      title: "Niche It Down",
      subtitle: "From broad to specific",
    },
    {
      id: "q-venn", type: "question",
      questionType: "short_answer",
      prompt: "Fill out your 3-circle Venn diagram: List 5 things you're passionate about, 5 things you're skilled at, and 5 things people spend money on or search for. Where do they overlap?",
    },
    {
      id: uid(), type: "text",
      content: "**Niche formula:** [Specific thing] for [specific audience] who [specific situation]\n\nExamples:\n- \"Study tip videos for high school athletes who don't have time to study\"\n- \"Custom phone wallpapers for anime fans\"\n- \"Budget meal prep guides for teens who cook for themselves\"",
    },
    {
      id: "q-niche", type: "question",
      questionType: "short_answer",
      prompt: "Write 3 versions of your niche statement using the formula: [Specific thing] for [specific audience] who [specific situation]. Then pick your best one and explain why.",
    },
    {
      id: "q-demand", type: "question",
      questionType: "short_answer",
      prompt: "Do a quick demand check: search your niche on YouTube, TikTok, or Google. What did you find? Is there evidence that people want this content?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 34: Value Proposition
// ═══════════════════════════════════════════════════════════════

const lesson34 = {
  title: "Value Proposition — Why Would Anyone Care?",
  questionOfTheDay: "People don't buy products — they buy solutions to their problems. What problem does your business solve?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 33,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "💎",
      title: "Value Proposition",
      subtitle: "Why Would Anyone Care?",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define value proposition and explain why it matters more than the product itself",
        "Write a clear value proposition using the 'I help [audience] do [outcome] by [method]' framework",
        "Differentiate between features and benefits",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Value proposition = the answer to \"Why should I care?\"**\n\nFramework: **\"I help [specific audience] [achieve specific outcome] by [your unique method/product].\"**\n\nExamples:\n- Canva: \"We help non-designers create professional graphics by providing drag-and-drop templates.\"\n- A student's tutoring business: \"I help freshmen pass biology by making study guides that actually make sense.\"\n\n**Features vs. Benefits:**\n| Feature | Benefit |\n|---|---|\n| 100+ templates | Never start from a blank page |\n| Free shipping | No surprise costs at checkout |\n| 24/7 support | Get help whenever you're stuck |\n\nPeople buy **benefits.** Features are proof that the benefits are real.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "\"Our headphones have 40mm drivers and Bluetooth 5.3\" is a ___. \"Never miss a word of your favorite song, even on the subway\" is a ___.",
      options: [
        "Benefit, then a feature",
        "Feature, then a benefit",
        "Both are features",
        "Both are benefits",
      ],
      correctIndex: 1,
      explanation: "\"40mm drivers and Bluetooth 5.3\" describes what the product IS (features — technical specs). \"Never miss a word of your favorite song\" describes what it DOES FOR YOU (benefit — the experience). Customers connect with benefits; features are the proof behind them.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🔄",
      title: "Feature → Benefit Translator",
      subtitle: "Practice converting features to benefits",
    },
    {
      id: uid(), type: "activity",
      icon: "🔄",
      title: "Feature → Benefit Translator",
      instructions: "Rewrite each feature as a customer-facing benefit:\n\n1. \"Waterproof to 30 meters\"\n2. \"AI-powered recommendations\"\n3. \"Ships in 2 business days\"\n4. \"No account required\"\n5. \"Built-in grammar checker\"\n6. \"500GB cloud storage\"\n\nRemember: benefits answer \"What does this do FOR ME?\"",
    },
    {
      id: "q-translate", type: "question",
      questionType: "short_answer",
      prompt: "Pick 3 of the 6 features and write your benefit translations. Which one was hardest to translate? Why?",
    },

    {
      id: uid(), type: "section_header",
      icon: "📝",
      title: "Your Value Proposition",
      subtitle: "Write yours using the framework",
    },
    {
      id: "q-value", type: "question",
      questionType: "short_answer",
      prompt: "For your niche business, write: (1) Your value proposition statement ('I help [audience] [outcome] by [method]'), (2) 3 features of your product/service, (3) 3 benefits (one per feature), and (4) Your one-liner elevator pitch (one sentence max).",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 35: Branding 101
// ═══════════════════════════════════════════════════════════════

const lesson35 = {
  title: "Branding 101 — Name, Logo, Colors, Vibe",
  questionOfTheDay: "Why do you trust some brands you've never bought from, just based on how they look?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 34,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🎨",
      title: "Branding 101",
      subtitle: "Name, Logo, Colors, Vibe",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify the core elements of a brand identity (name, logo, color palette, voice)",
        "Analyze how branding decisions communicate values and attract specific audiences",
        "Create a brand identity kit for their business concept",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**4 pillars of brand identity:**\n\n1. **Name** — Short, memorable, easy to spell. Test: can someone Google it after hearing it once?\n\n2. **Logo** — Simple beats complex. Think Nike swoosh, Apple, Twitter bird. If it doesn't work in black and white at 20px, it's too complicated.\n\n3. **Color palette** — 2-3 colors max. Colors carry meaning:\n   - Blue = trust, professional\n   - Red = energy, urgency\n   - Green = growth, health\n   - Black = luxury, sophistication\n   - Yellow = optimism, youth\n\n4. **Brand voice** — How you \"sound\" in writing. Funny? Serious? Casual? Motivational? Your voice should match your audience.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "A new wellness brand targeting young professionals uses neon green, Comic Sans font, and lots of exclamation marks. What's wrong?",
      options: [
        "Nothing — neon green is an attention-grabbing color choice",
        "The branding doesn't match the audience — young professionals expect clean, calm, trustworthy design",
        "Comic Sans is fine for any business",
        "They need more colors to stand out",
      ],
      correctIndex: 1,
      explanation: "Brand identity must match the audience's expectations. Young professionals associate wellness with calm, clean, and premium — not loud, playful, and chaotic. The branding signals 'fun kids brand,' not 'wellness for professionals.' Every design choice should reinforce who the brand is FOR.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🎨",
      title: "Build Your Brand Kit",
      subtitle: "15 minutes in Canva",
    },
    {
      id: uid(), type: "activity",
      icon: "🎨",
      title: "Brand Identity Kit in Canva",
      instructions: "Create a single-page brand identity board in Canva:\n\n1. **Business name** (with 1-sentence reasoning for the name)\n2. **Logo** (simple — even text-based is fine)\n3. **Color palette** (3 colors with hex codes — use Canva's palette generator)\n4. **Brand voice** (3 adjectives that describe how the brand \"talks\")\n5. **One sample social media post** in your brand's visual style\n\n**Time check:** 5 min on name/logo, 5 min on colors/voice, 5 min on sample post.",
    },
    {
      id: "q-brand", type: "question",
      questionType: "short_answer",
      prompt: "Share your brand kit: (1) Business name and why you chose it, (2) Your 3 brand colors and what they communicate, (3) Your 3 brand voice adjectives.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 36: Revenue Models
// ═══════════════════════════════════════════════════════════════

const lesson36 = {
  title: "Revenue Models — How Does the Money Actually Work?",
  questionOfTheDay: "If a creator has 10,000 followers but makes $0, and another has 500 followers but makes $3,000/month — what's the difference?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 35,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "💵",
      title: "Revenue Models",
      subtitle: "How Does the Money Actually Work?",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify and explain 5 common digital revenue models",
        "Calculate basic revenue projections using realistic assumptions",
        "Select a revenue model for their business concept and justify the choice",
      ],
    },
    {
      id: uid(), type: "text",
      content: "Every \"free\" product has a revenue model. Nothing is actually free.\n\n**5 revenue models for digital businesses:**\n\n1. **Per-sale (one-time)** — Customer pays once. Templates, art prints, ebooks.\n   Revenue = price × number of sales\n\n2. **Subscription (recurring)** — Customer pays monthly/yearly. Memberships, exclusive content.\n   Revenue = monthly price × subscribers\n\n3. **Ad-supported** — Content is free, advertisers pay you. YouTube, blogs, podcasts.\n   Revenue = views × CPM ($3-5 per 1,000 views for most niches)\n\n4. **Freemium** — Basic free, premium costs money. Apps, tools, courses.\n   Revenue depends on conversion rate (usually 2-5% of free users upgrade)\n\n5. **Service/freelance** — Client pays for your time/skill. Design, tutoring, social media management.\n   Revenue = rate × hours (or per-project pricing)",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "A YouTuber with 50,000 views/month earns about $___/month from ads (at $4 CPM).",
      options: [
        "$20",
        "$200",
        "$2,000",
        "$20,000",
      ],
      correctIndex: 1,
      explanation: "CPM = cost per 1,000 views. At $4 CPM: 50,000 views ÷ 1,000 = 50. 50 × $4 = $200/month. This is why most YouTubers don't rely on ads alone — they combine it with sponsorships, merchandise, or digital products.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🧮",
      title: "Revenue Plan",
      subtitle: "Calculate your business projections",
    },
    {
      id: uid(), type: "activity",
      icon: "🧮",
      title: "Revenue Projections in Google Sheets",
      instructions: "In Google Sheets, build a revenue projection for your business:\n\n1. **Pick a revenue model** for your business concept\n2. **Set realistic assumptions** (price, volume, conversion rate)\n3. **Calculate projected monthly revenue**\n4. **Calculate projected yearly revenue**\n5. **Write 2 sentences:** \"I chose [model] because [reason]. My business would need [X] to make $[Y]/month.\"\n\nRemember: plan for realistic small-scale success, not going viral.",
    },
    {
      id: "q-revenue", type: "question",
      questionType: "short_answer",
      prompt: "What revenue model did you pick? Show your math: price × volume (or equivalent) = projected monthly revenue. Is this realistic for month 1? Month 12?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 37: Your Online Presence — Landing Pages
// ═══════════════════════════════════════════════════════════════

const lesson37 = {
  title: "Your Online Presence — Landing Pages and Link-in-Bio",
  questionOfTheDay: "Why do creators say 'link in bio' instead of just posting the link in their caption?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 36,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🌐",
      title: "Your Online Presence",
      subtitle: "Landing Pages and Link-in-Bio",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why every online business needs a central hub (not just social media)",
        "Identify the essential elements of an effective landing page",
        "Build a simple landing page for their business concept",
      ],
    },
    {
      id: uid(), type: "text",
      content: "Social media platforms **own your audience.** If Instagram shuts down tomorrow, you lose everything. A landing page is YOURS.\n\n**Landing page essentials (above the fold):**\n1. **Headline** — What you do + who it's for (your value proposition)\n2. **Visual** — Logo, product image, or hero photo\n3. **CTA button** — ONE clear action: \"Shop Now,\" \"Subscribe,\" \"Book a Call\"\n4. **Social proof** — Testimonials, follower count, \"as seen in\"\n5. **Links** — Your content, shop, social profiles\n\nThe test: **Can someone tell what your business does in 5 seconds?** If not, your headline needs work.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "What's the MOST important element on a landing page?",
      options: [
        "A beautiful background image",
        "Links to all your social media accounts",
        "A clear headline that explains what you do and who it's for",
        "An animated logo",
      ],
      correctIndex: 2,
      explanation: "The headline is the first thing visitors read. If it doesn't immediately tell them what you do and who it's for, they leave. Everything else — images, links, animations — supports the headline, but the headline does the heavy lifting.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🛠️",
      title: "Build Your Landing Page",
      subtitle: "Using Carrd, Google Sites, or similar",
    },
    {
      id: uid(), type: "activity",
      icon: "🛠️",
      title: "Build Your Landing Page",
      instructions: "Using Carrd.co (free), Google Sites, or a similar tool, build a landing page for your business:\n\n**Required elements:**\n- Headline from your value proposition (Lesson 34)\n- Brand colors and logo (Lesson 35)\n- At least one CTA button\n- Links to social profiles (can be placeholders)\n- Brief \"about\" section\n\nThis is a first draft — focus on getting the structure right. You'll polish it later.\n\n**Partner check when done:** Swap Chromebooks. \"Can I tell what this business does in 5 seconds?\"",
    },
    {
      id: "q-landing", type: "question",
      questionType: "short_answer",
      prompt: "Share your landing page URL (or describe it if the tool doesn't generate a link). Did your partner pass the 5-second test? What feedback did they give?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 38: Marketing on $0
// ═══════════════════════════════════════════════════════════════

const lesson38 = {
  title: "Marketing on $0 — Social Media Strategy for Small Businesses",
  questionOfTheDay: "How do small businesses with zero budget compete against companies that spend millions on ads?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 37,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "📢",
      title: "Marketing on $0",
      subtitle: "Social Media Strategy for Small Businesses",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify 4 organic (free) marketing strategies for digital businesses",
        "Analyze why some small business social media accounts grow and others don't",
        "Create a 1-week marketing plan using a $0 budget",
      ],
    },
    {
      id: uid(), type: "text",
      content: "A local bakery's Instagram (2,000 followers) gets 15% engagement. McDonald's (5 million followers) gets 0.5%. **Who's actually better at marketing?** The bakery — by a mile.\n\n**4 free marketing strategies that actually work:**\n\n1. **Content marketing** — Give value before you ask for anything. Teach, entertain, or solve a problem. People follow because your content helps them, then buy because they trust you.\n\n2. **Community engagement** — Comment on other creators' posts. Reply to every DM. Be in the conversations your audience is already having.\n\n3. **Collaborations** — Find someone with a similar audience and team up. You get their audience, they get yours.\n\n4. **User-generated content (UGC)** — Get your customers to create content FOR you. Reviews, unboxings, testimonials.\n\n**The 80/20 rule:** 80% of your posts give value (teach, entertain, inspire). 20% promote your product.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "According to the 80/20 rule for social media, what percentage of your posts should directly promote your product?",
      options: [
        "80% — that's the whole point of the account",
        "50% — balance promotion with content",
        "20% — most posts should give value, not sell",
        "0% — never promote anything",
      ],
      correctIndex: 2,
      explanation: "Only 20% of your posts should directly sell or promote. The other 80% should provide value — teaching, entertaining, or inspiring your audience. If every post is 'buy my product,' people unfollow. If most posts help them, they trust you enough to buy when you do promote.",
    },

    {
      id: uid(), type: "section_header",
      icon: "📅",
      title: "Your Marketing Plan",
      subtitle: "7 days of free marketing",
    },
    {
      id: uid(), type: "activity",
      icon: "📅",
      title: "1-Week Marketing Plan",
      instructions: "Plan 7 days of social media activity for your business:\n\n| Day | Post Type | Strategy | Content Idea | Platform |\n|---|---|---|---|---|\n| Mon | Value post | Content marketing | Tutorial: \"3 ways to...\" | Instagram |\n| Tue | Engagement | Community | Comment on 10 related posts | TikTok |\n| ... | ... | ... | ... | ... |\n\n**Requirements:**\n- At least 5 posts\n- Max 1 sales/promo post (80/20 rule!)\n- At least 2 different strategies used\n- One sentence explaining each choice",
    },
    {
      id: "q-marketing", type: "question",
      questionType: "short_answer",
      prompt: "Share your 7-day marketing plan. For your sales/promo post, explain what you're promoting and what CTA you'd use.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 39: The Pitch — Building a Business Pitch Deck
// ═══════════════════════════════════════════════════════════════

const lesson39 = {
  title: "The Pitch — Building a Business Pitch Deck",
  questionOfTheDay: "Why do investors say they fund people, not ideas — and what does that mean for your pitch?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 38,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "📊",
      title: "The Pitch",
      subtitle: "Building a Business Pitch Deck",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify the key components of a business pitch",
        "Organize their business concept into a structured presentation",
        "Begin building a pitch deck that tells a compelling story",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Pitch deck structure (7 slides):**\n\n| Slide | Content | Time |\n|---|---|---|\n| 1. Title | Business name, logo, your name, one-liner | 5 sec |\n| 2. The Problem | What problem does your audience have? Make them FEEL it. | 30 sec |\n| 3. The Solution | Your product/service. How it solves the problem. | 30 sec |\n| 4. The Audience | Who is this for? Be specific. | 20 sec |\n| 5. The Business Model | How you make money. Revenue projections. | 30 sec |\n| 6. The Marketing Plan | How people find you. | 20 sec |\n| 7. The Ask | What do you need? | 10 sec |\n\n**Total pitch time: ~3 minutes.** That's all you get.\n\n**Design rules:**\n- Max 5 words per line. YOU are the presentation, not the slides.\n- One idea per slide.\n- Use your brand colors consistently.\n- No walls of text. Ever.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "What should pitch deck slides primarily contain?",
      options: [
        "Full paragraphs explaining every detail of the business",
        "Minimal text and visuals — the presenter fills in the details verbally",
        "Just images with no text",
        "As much information as possible so the audience can read along",
      ],
      correctIndex: 1,
      explanation: "Pitch decks are visual aids, not documents. The slides support what you're saying — they don't replace you. If someone can understand your entire pitch just by reading the slides, you've put too much text on them. Keep it visual, keep it minimal.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🛠️",
      title: "Build Your Deck",
      subtitle: "20 minutes — get all 7 slides drafted",
    },
    {
      id: uid(), type: "activity",
      icon: "🛠️",
      title: "Draft Your 7-Slide Pitch Deck",
      instructions: "Using Google Slides or Canva Presentations, create all 7 slides using the work you've done this unit:\n\n- Value proposition (Lesson 34)\n- Brand identity (Lesson 35)\n- Revenue model (Lesson 36)\n- Landing page (Lesson 37)\n- Marketing plan (Lesson 38)\n\n**Content first, design second.** Get the right words on each slide, THEN make it look good.\n\n**Time check:** You have 20 minutes. Tomorrow is polish + practice.",
    },
    {
      id: "q-progress", type: "question",
      questionType: "short_answer",
      prompt: "How many of your 7 slides have content on them? Which slide was hardest to fill? What do you still need to finish tomorrow?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 40: Pitch Practice + Polish
// ═══════════════════════════════════════════════════════════════

const lesson40 = {
  title: "Pitch Practice + Polish",
  questionOfTheDay: "What's the difference between reading your slides and actually pitching your business?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 39,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🎤",
      title: "Pitch Practice + Polish",
      subtitle: "Rehearse, get feedback, refine",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Deliver a 3-minute business pitch with confidence and clarity",
        "Give actionable feedback on presentation delivery",
        "Finalize pitch deck design and prepare for Pitch Day",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Presentation killers to avoid:**\n- Reading directly from slides\n- Talking to the screen instead of the audience\n- Saying \"um\" every 3 seconds\n- Going over time (3 minutes = 3 minutes)\n- Apologizing for your own idea (\"This might be dumb, but...\")\n\n**Rule: if you don't believe in your business, nobody else will. Own it.**",
    },

    {
      id: uid(), type: "section_header",
      icon: "🔄",
      title: "Practice Rounds",
      subtitle: "Small group + partner practice",
    },
    {
      id: uid(), type: "activity",
      icon: "🎤",
      title: "Practice Rounds",
      instructions: "**Round 1 — Small group (15 min):** Groups of 3-4. Each person pitches (3 min max, timed). Group gives feedback:\n- Clarity: Could you understand the business in 30 seconds?\n- Confidence: Did they seem like they believed in it?\n- Slides: Visual aids, not walls of text?\n- Hook: Did the opening grab your attention?\n- One specific thing to improve\n\n**Polish time (15 min):** Revise your deck and practice delivery based on feedback.\n\n**Round 2 — Partner (5 min):** Find someone NOT from your earlier group. Deliver once more. Thumbs up/down: \"Would you invest?\"",
    },
    {
      id: "q-feedback", type: "question",
      questionType: "short_answer",
      prompt: "What was the most useful feedback you received during practice? How did you change your pitch based on it?",
    },
    {
      id: uid(), type: "callout",
      icon: "📅", style: "highlight",
      content: "**Tomorrow: Pitch Day!**\n- 3 minutes per pitch, strict timer\n- Class votes on: Most Likely to Succeed, Best Brand, Best Pitch Delivery, Most Creative\n- Bring your A-game",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 41: Pitch Day + Unit Wrap-Up
// ═══════════════════════════════════════════════════════════════

const lesson41 = {
  title: "Pitch Day + Unit Wrap-Up",
  questionOfTheDay: "If you actually launched this business tomorrow — what would be your very first step?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 40,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🏆",
      title: "Pitch Day",
      subtitle: "Present your business to the class",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Deliver a polished business pitch to the class",
        "Evaluate peer pitches using specific criteria",
        "Reflect on what they learned about entrepreneurship",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Pitch Day format:**\n- 3 minutes per pitch, strict timer\n- Present your deck to the class\n- Class evaluates each pitch on a Google Form:\n  - Clarity of business concept (1-5)\n  - Pitch delivery quality (1-5)\n  - Would you be a customer? (Yes/No)\n  - One word to describe the brand\n\n**Awards (voted by class):**\n- Most Likely to Succeed — best overall concept\n- Best Brand — strongest visual identity\n- Best Pitch — most confident, clear delivery\n- Most Creative — most unique idea\n- People's Choice — highest \"would you be a customer?\" votes",
    },
    {
      id: "q-evaluate", type: "question",
      questionType: "short_answer",
      prompt: "Pick the pitch that impressed you the most (not your own). What made it stand out? Be specific about what they did well.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🪞",
      title: "Unit Reflection",
      subtitle: "What you learned about entrepreneurship",
    },
    {
      id: "q-reflect1", type: "question",
      questionType: "short_answer",
      prompt: "What surprised you most about how online businesses actually work?",
    },
    {
      id: "q-reflect2", type: "question",
      questionType: "short_answer",
      prompt: "If you were going to actually pursue one business idea from this unit (yours or someone else's), which one and why?",
    },
    {
      id: "q-reflect3", type: "question",
      questionType: "short_answer",
      prompt: "What skill from this unit (niching down, branding, pitching, marketing, revenue planning) do you think will be most useful in your future, even if you never start a business?",
    },
    {
      id: uid(), type: "callout",
      icon: "🚀", style: "highlight",
      content: "**Next unit: Portfolio Capstone.** You've created content and pitched a business. Now you'll put it ALL together into a personal portfolio website — built from scratch with HTML and CSS. Everything you've built this year goes into one place you can share with anyone.",
    },
  ],
};


// ═══════════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════════

const lessons = [
  { slug: "creator-economy", data: lesson32 },
  { slug: "finding-your-niche", data: lesson33 },
  { slug: "value-proposition", data: lesson34 },
  { slug: "branding-101", data: lesson35 },
  { slug: "revenue-models", data: lesson36 },
  { slug: "landing-pages", data: lesson37 },
  { slug: "marketing-on-zero", data: lesson38 },
  { slug: "pitch-deck", data: lesson39 },
  { slug: "pitch-practice", data: lesson40 },
  { slug: "pitch-day", data: lesson41 },
];

async function main() {
  console.log("🚀 Seeding Digital Literacy Unit 6: Digital Entrepreneurship (Lessons 32-41)...\n");

  for (const { slug, data } of lessons) {
    const ref = db.collection("courses").doc(COURSE_ID).collection("lessons").doc(slug);
    await ref.set({ ...data, updatedAt: new Date() });
    console.log(`✅ ${data.title}`);
    console.log(`   courses/${COURSE_ID}/lessons/${slug} — ${data.blocks.length} blocks`);
  }

  console.log(`\n🎉 Done! ${lessons.length} lessons seeded for Unit 6: Digital Entrepreneurship.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
