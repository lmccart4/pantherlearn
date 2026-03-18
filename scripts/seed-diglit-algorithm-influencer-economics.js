// seed-diglit-algorithm-influencer-economics.js
// Creates "Influencer Economics — The Business Behind the Feed" (Dig Lit, Algorithm Economy, Lesson 47)
// Run: node scripts/seed-diglit-algorithm-influencer-economics.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Influencer Economics — The Business Behind the Feed",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 47,
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
      content: "There's a creator on TikTok with 2 million followers. They post 3 times a week. Their content looks casual — filmed on a phone, edited in 20 minutes.\n\nHow much do you think they make per year?\n\nMost people underestimate by a factor of 10.\n\nInfluencer marketing is now a $21 billion industry — bigger than traditional print advertising. The economics are real, the income is substantial, and the system is more structured than it looks."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If a brand pays a creator to promote their product, who's responsible for making sure followers know it's an ad — the brand, the creator, or the platform?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Name a creator you follow who you've seen promote a product or brand. Did you realize it was a paid promotion? Did it affect whether you trusted them?",
      placeholder: "Creator: ...\nPromotion I saw: ...\nDid I know it was paid? ...\nEffect on trust: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain the main revenue streams available to content creators",
        "Identify how follower count relates to (and doesn't determine) earning potential",
        "Analyze the disclosure requirements around paid promotions and why they matter"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "📊",
      title: "The Creator Business Model",
      subtitle: "~20 minutes"
    },
    {
      id: "b-revenue",
      type: "text",
      content: "**How creators actually make money — the full picture:**\n\n**1. Brand deals / Sponsored content**\nA brand pays the creator to feature their product in content. Rates range from $100 (small creators) to $500,000+ per post (mega-influencers). This is the #1 income source for most creators.\n\n**2. Platform ad revenue**\nYouTube shares ad revenue with creators (~$3-5 per 1,000 views on average). TikTok's Creator Fund pays far less (~$0.02-0.04 per 1,000 views — often not worth it). Instagram and TikTok's newer programs pay more but are invite-only.\n\n**3. Affiliate marketing**\nCreator gets a unique link or code. When followers buy using it, the creator earns a % commission (usually 5-20%). Low barrier to entry — anyone can join Amazon Associates, etc.\n\n**4. Merchandise (merch)**\nCreators sell branded products — clothes, accessories, books. Profit margins are thin (20-40%) but devoted audiences buy.\n\n**5. Subscriptions / Memberships**\nPatreon, YouTube Memberships, Substack — fans pay monthly for exclusive content. Predictable income; requires maintaining a dedicated fan base.\n\n**6. Digital products**\nCourses, presets, templates, ebooks. High margin (close to 100% profit after creation cost). Becoming the dominant income stream for \"creator business\" types."
    },
    {
      id: "callout-nano",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The micro-influencer advantage:** Creators with 10,000-50,000 followers (\"micro-influencers\") often earn *more per follower* than mega-influencers with millions. Why? Their audiences are more engaged and niche — a fitness creator with 20,000 dedicated followers is more valuable to a gym equipment brand than a general-interest creator with 2 million casual viewers. Brands have learned that engagement rate > follower count."
    },
    {
      id: "q-rate-card",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two creators both get offered a brand deal paying $5,000 for one post. Creator A has 500,000 followers and a 1% engagement rate. Creator B has 50,000 followers and a 12% engagement rate. Which deal is better value for the brand?",
      options: [
        "Creator A — more followers means more people see the post",
        "Creator B — higher engagement means more actual interactions and likely more conversions",
        "They're equal — both will reach the same number of people",
        "Creator A — brands always prefer reach over engagement"
      ],
      correctIndex: 1,
      explanation: "Creator B has 6,000 engaged interactions per post (50k × 12%). Creator A has only 5,000 (500k × 1%). But more importantly, Creator B's audience actually cares — they comment, share, click links. Engagement rate has become the primary metric brands use to evaluate creator value. Follower counts can be inflated; engaged actions cannot.",
      difficulty: "apply"
    },
    {
      id: "b-disclosure",
      type: "text",
      content: "**The FTC and disclosure rules**\n\nThe Federal Trade Commission (FTC) requires creators to clearly disclose when content is paid. The rules:\n\n- If you're paid in money, free product, or any other benefit to promote something, you must disclose it\n- The disclosure must be **clear and conspicuous** — not buried in hashtags, not in tiny text at the end\n- \"#ad\" or \"Paid partnership\" labels work. \"#collab\" or \"#spon\" are considered ambiguous and don't meet the standard\n- This applies to posts, stories, videos, live streams — all formats\n\n**Why this matters:** When a creator doesn't disclose, followers make purchasing decisions based on what they believe is genuine personal recommendation — when it's actually advertising. This is a form of deception.\n\n**Reality check:** Enforcement is inconsistent. Many creators don't disclose. Many brands don't require it. But that doesn't make it ethical or legal."
    },
    {
      id: "q-disclosure",
      type: "question",
      questionType: "short_answer",
      prompt: "A creator receives $2,000 worth of free clothing from a brand. They post about the clothes, calling them their \"new favorite brand ever\" with no disclosure. Is this a problem? Who is harmed, and how?",
      placeholder: "Is it a problem? ...\nWho is harmed: ...\nHow: ...",
      difficulty: "evaluate"
    },
    {
      id: "q-creator-math",
      type: "question",
      questionType: "short_answer",
      prompt: "A creator has:\n- 200,000 YouTube subscribers (averages 50,000 views per video, 2 videos/week)\n- YouTube AdSense at $4 CPM\n- One $3,000 brand deal per month\n- An affiliate link earning 10% on $2,000/month in sales\n\nEstimate their monthly revenue from each source. What's their approximate total? Is this what you expected?",
      placeholder: "YouTube AdSense: ...\nBrand deal: ...\nAffiliate: ...\nTotal: ...\nExpected? ...",
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
      content: "The influencer economy is real, structured, and increasingly professionalized. Creators aren't just making content — they're running small businesses with multiple revenue streams, audience analytics, brand negotiation, and legal obligations.\n\nFor consumers, this means nearly everything you see from a creator exists within an economic context. The \"genuine recommendation\" might be a paid deal. The \"honest review\" might be a gifted product. Knowing this doesn't mean you can't enjoy creator content — it means you consume it with your eyes open.\n\n**Up next:** Lesson 48 — Algorithmic Discrimination. The algorithm doesn't just affect what you see. It can determine what opportunities you get — jobs, housing, loans. And it can discriminate."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: After this lesson, will you look at sponsored content differently? What will you pay attention to that you didn't before?",
      placeholder: "Yes/no and why: ...\nWhat I'll notice now: ...",
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
        { term: "Brand deal", definition: "A paid agreement where a creator promotes a brand's product or service in their content — the primary income source for most professional influencers." },
        { term: "CPM (Cost Per Mille)", definition: "The rate an advertiser pays per 1,000 views — how platform ad revenue is calculated for creators." },
        { term: "Engagement rate", definition: "The percentage of an audience that actively interacts with content (likes, comments, shares) — more valuable to brands than raw follower count." },
        { term: "Micro-influencer", definition: "A creator with 10,000–50,000 followers — often more valuable to niche brands than mega-influencers because of higher engagement rates and audience trust." },
        { term: "FTC disclosure", definition: "The legal requirement that creators clearly inform audiences when content is paid or sponsored — required in the US, often ignored in practice." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("algorithm-influencer-economics")
      .set(lesson);
    console.log('✅ Lesson "Influencer Economics" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/algorithm-influencer-economics");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
