// seed-diglit-entrepreneurship-marketing.js
// Creates "Marketing on $0 — Social Media Strategy for Small Businesses" (Dig Lit, Unit 6, Lesson 38)
// Run: node scripts/seed-diglit-entrepreneurship-marketing.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Marketing on $0 — Social Media Strategy for Small Businesses",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 38,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "📣",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "McDonald's has 5 million Instagram followers. A local bakery near your school has 2,000.\n\nBut McDonald's gets 0.5% engagement on their posts. The bakery gets 15%.\n\nWho's better at social media marketing? The bakery — by a massive margin. They have fewer followers, but those followers are real, engaged people who actually come in and buy things.\n\nSmall businesses don't compete on budget. They compete on **authenticity and community**. And you can win that game with $0."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** How do small businesses with zero budget compete against companies that spend millions on ads?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of a small business, creator, or local brand you follow or support online. What made you start following them? Was it an ad, or something else?",
      placeholder: "I started following [name] because...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify 4 organic (free) marketing strategies for digital businesses",
        "Apply the 80/20 rule to avoid being 'salesy' on social media",
        "Create a 1-week marketing plan for your business using $0 budget"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "4 Free Marketing Strategies That Actually Work",
      subtitle: "~15 minutes"
    },
    {
      id: "b-strategies",
      type: "text",
      content: "**1. Content Marketing**\nGive value before you ask for anything. Teach, entertain, or solve a problem. People follow because your content helps them — then they buy because they trust you.\n> Post tutorials, tips, behind-the-scenes, or entertainment related to your niche. Attract the right people.\n\n**2. Community Engagement**\nComment on other creators' posts in your niche. Reply to every DM. Be present in the conversations your audience is already having. Don't spam — genuinely participate. Visibility builds without posting anything.\n\n**3. Collaborations**\nFind creators with a similar (non-competing) audience and team up. Guest posts, shout-outs, joint content. Their audience discovers you; your audience discovers them. Both win.\n\n**4. User-Generated Content (UGC)**\nGet your customers to make content FOR you. Reviews, unboxings, photos using your product. Real people saying real things is more convincing than anything you create yourself."
    },
    {
      id: "callout-8020",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The 80/20 Rule:** 80% of your posts should give value — teach, entertain, inspire, connect. Only 20% should directly promote your product or service.\n\nIf every post is \"BUY MY PRODUCT,\" people unfollow. If 80% of your posts help your audience and 20% ask them to buy, they trust you — and they buy when you ask.\n\nThis is why following accounts that constantly push ads feels bad, and following accounts that genuinely help you feels good."
    },
    {
      id: "q-strategy-id",
      type: "question",
      questionType: "short_answer",
      prompt: "Categorize each post as: content marketing, community engagement, collaboration, or UGC — AND value post or sales post:\n\n1. A candle maker reposts a customer photo of her candles with the caption 'love seeing these in your homes 🕯️'\n2. A fitness creator comments '100% agree, hydration makes such a difference' on a wellness influencer's post\n3. A student tutoring business posts '3 tricks for remembering history dates (that actually work)'\n4. An Etsy seller posts 'New spring collection is LIVE — link in bio 🌸'",
      placeholder: "1. Strategy: ... | Type: ...\n2. Strategy: ... | Type: ...\n3. Strategy: ... | Type: ...\n4. Strategy: ... | Type: ...",
      difficulty: "apply"
    },
    {
      id: "q-what-not",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student decides to buy 500 Instagram followers for $15 to make their new business account look more established. What's the main problem with this strategy?",
      options: [
        "It's too expensive for a small business",
        "Bought followers are fake accounts that don't engage — this tanks your engagement rate and signals to the algorithm that your content isn't worth showing",
        "Instagram will immediately delete the account",
        "It works short-term but becomes expensive at scale"
      ],
      correctIndex: 1,
      explanation: "Fake followers destroy your engagement rate. If you have 500 followers but only 3 people like each post, the algorithm reads that as 0.6% engagement — terrible. The algorithm then shows your content to FEWER real people. You're actually worse off than starting with 0. Platforms actively suppress accounts with suspicious follower patterns.",
      difficulty: "analyze"
    },

    {
      id: "section-practice",
      type: "section_header",
      icon: "📅",
      title: "Your 1-Week Marketing Plan",
      subtitle: "~15 minutes"
    },
    {
      id: "b-plan-intro",
      type: "text",
      content: "Build a 1-week social media marketing plan for your business. Use the Google Doc template or build your own.\n\n**Requirements:**\n- At least 5 posts across the week\n- Max 1 promotional/sales post\n- At least 2 different free strategies used\n- At least 1 community engagement day (not a post — commenting on others)\n- Brief explanation of WHY each post serves your audience"
    },
    {
      id: "q-marketing-plan",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your 1-week marketing plan. For each day, include: Day | Post type | Strategy | Content idea | Platform | Why this serves your audience\n\nMinimum 5 entries, max 1 sales post.",
      placeholder: "Monday: [post type] | [strategy] | [idea] | [platform] | Because...\nTuesday: ...\nWednesday: ...\nThursday: ...\nFriday: ...",
      difficulty: "create"
    },
    {
      id: "q-80-20-check",
      type: "question",
      questionType: "short_answer",
      prompt: "Check your plan against the 80/20 rule. How many of your 5+ posts are value posts? How many are sales/promo posts? Does it pass the 80/20 test?",
      placeholder: "Value posts: ... out of ...\nSales posts: ... out of ...\nPasses 80/20? ...",
      difficulty: "evaluate"
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
      content: "The businesses that win on social media without a budget don't win through tricks or hacks. They win by being genuinely useful to their audience, consistently.\n\nYour marketing plan is the last major building block before your pitch. You now have: a niche, a value proposition, a brand, a revenue model, a landing page, and a marketing strategy.\n\n**Up next:** Lesson 39 — The Pitch. All of this comes together into a 3-minute business presentation."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: What's the single most important thing you learned about marketing today? How does the 80/20 rule change how you'll think about social media — both as a creator and as a consumer?",
      placeholder: "Most important thing: ...\nThe 80/20 rule changes how I think about social media because...",
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
        { term: "Organic marketing", definition: "Marketing that doesn't require paid advertising — growing an audience through content, community, and relationships." },
        { term: "Engagement rate", definition: "The percentage of followers who interact with a post (likes + comments + shares ÷ followers). High engagement = real, active audience." },
        { term: "User-generated content (UGC)", definition: "Content created by customers or fans about a brand — reviews, unboxings, photos — that serves as authentic word-of-mouth marketing." },
        { term: "The 80/20 rule", definition: "In social media marketing: 80% of posts provide value to the audience; 20% directly promote the business." },
        { term: "Algorithm", definition: "The software system platforms use to decide which content to show which users — rewards high engagement, penalizes fake followers and low interaction." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("entrepreneurship-marketing")
      .set(lesson);
    console.log('✅ Lesson "Marketing on $0" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-marketing");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
