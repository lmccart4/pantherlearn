// seed-diglit-algorithm-audit.js
// Creates "Your Algorithm Audit — Final Project & Unit Wrap-Up" (Dig Lit, Algorithm Economy, Lesson 51)
// Run: node scripts/seed-diglit-algorithm-audit.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Your Algorithm Audit — Final Project & Unit Wrap-Up",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 51,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔍",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "You've spent 10 lessons learning how algorithmic systems work — how they're built, what they optimize for, how they affect your beliefs and opportunities, and how to navigate them more intentionally.\n\nNow you're going to apply that knowledge to yourself.\n\nA real algorithm audit involves examining a system, documenting how it operates, identifying harms, and recommending changes. Today you'll do that — but the system you're auditing is your own algorithmic environment: the feeds, recommendations, and content ecosystems you actually live in.\n\nThis is both an academic exercise and genuinely useful. Researchers, regulators, and journalists do this kind of work for a living."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you had to explain your social media algorithm to a parent or a judge — what would you tell them about what it shows you, why it shows it, and who benefits?"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply unit concepts to analyze your own algorithmic information environment",
        "Document evidence of algorithmic patterns, filter bubbles, and commercial interests in your own feeds",
        "Synthesize findings into an audit report with analysis and recommendations"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "📋",
      title: "The Algorithm Audit",
      subtitle: "~25 minutes"
    },
    {
      id: "b-instructions",
      type: "text",
      content: "**How to conduct your audit**\n\nYou'll examine one platform (your choice) across five dimensions. For each dimension, you'll record observations and answer analysis questions.\n\n**Choose your platform:** TikTok, Instagram, YouTube, Twitter/X, Snapchat, or Reddit. Use whichever one you actually use most — your real account, not a fresh one.\n\n**Spend 10-15 minutes scrolling normally** before answering the questions below. Act as you usually would, then reflect on what you saw."
    },
    {
      id: "q-dimension-1",
      type: "question",
      questionType: "short_answer",
      prompt: "**Dimension 1: Content Pattern Analysis**\n\nScroll through your feed for 5 minutes. Log what you see:\n- What are the 3 most common content TYPES? (comedy, news, beauty, gaming, sports, politics, etc.)\n- What are the 3 most common TOPICS or themes?\n- What EMOTIONS does the content trigger most often? (amusement, outrage, awe, anxiety, etc.)\n- Is the content mostly from people you follow, or is it recommended from accounts you don't follow?",
      placeholder: "Content types: ...\nTopics/themes: ...\nEmotions triggered: ...\nFollowing vs. recommended: ...",
      difficulty: "analyze"
    },
    {
      id: "q-dimension-2",
      type: "question",
      questionType: "short_answer",
      prompt: "**Dimension 2: Filter Bubble Check**\n\n- Pick ONE topic that appears in your feed (news, political, social, etc.). How many different PERSPECTIVES on that topic do you see? Describe them.\n- Is there a clear \"side\" your feed takes on this topic?\n- Have you seen any content that strongly challenges your existing views on this topic?\n- What would someone with the opposite view on this topic probably see in their feed?",
      placeholder: "Topic: ...\nPerspectives visible: ...\nClear side? ...\nChallenging content? ...\nOpposite view feed: ...",
      difficulty: "evaluate"
    },
    {
      id: "q-dimension-3",
      type: "question",
      questionType: "short_answer",
      prompt: "**Dimension 3: Commercial Interest Mapping**\n\nScroll for 3 minutes and count:\n- How many ADS did you see? (paid promotions, labeled ads)\n- How many SPONSORED CREATOR POSTS did you see? (influencer deals, gifted products — labeled or unlabeled)\n- What products or brands appeared most?\n- Based on what you know about yourself, why do you think YOU specifically were shown these particular products?\n\nEstimate: what % of content you saw was commercially motivated (ads + sponsored posts)?",
      placeholder: "Ads seen: ...\nSponsored posts: ...\nBrands/products: ...\nWhy me specifically: ...\nEstimated commercial %: ...",
      difficulty: "analyze"
    },
    {
      id: "q-dimension-4",
      type: "question",
      questionType: "short_answer",
      prompt: "**Dimension 4: Signals You've Been Sending**\n\nBased on what your feed shows you, reverse-engineer what the algorithm thinks about you:\n- What does your feed suggest are your TOP 3 interests?\n- What EMOTIONS does your engagement history suggest you respond to?\n- What IDENTITY does the algorithm seem to have built for you? (Age group, politics, lifestyle, income level, etc.)\n- Is this who you actually are? Where is it wrong?",
      placeholder: "Algorithm's top 3 interests for me: ...\nEmotions I apparently respond to: ...\nIdentity the algorithm built: ...\nIs it accurate? Where is it wrong: ...",
      difficulty: "evaluate"
    },
    {
      id: "q-dimension-5",
      type: "question",
      questionType: "short_answer",
      prompt: "**Dimension 5: Harm and Benefit Assessment**\n\n- What's the most USEFUL thing your current algorithm environment provides you?\n- What's the most HARMFUL or problematic thing it does?\n- Who BENEFITS most from your current feed being the way it is? (You? Advertisers? The platform? Specific communities?)\n- If you could change ONE thing about how this platform's algorithm works for you, what would it be?",
      placeholder: "Most useful: ...\nMost harmful/problematic: ...\nWho benefits most: ...\nOne change: ...",
      difficulty: "evaluate"
    },
    {
      id: "q-recommendations",
      type: "question",
      questionType: "short_answer",
      prompt: "**Audit Report: Summary and Recommendations**\n\nBased on your five-dimension audit, write a short summary:\n\n1. **What the algorithm is doing** (2-3 sentences describing the pattern)\n2. **Who it serves** (platform? advertisers? you?)\n3. **One thing you'll change about how you use this platform**\n4. **One thing you think the PLATFORM should change** (if you were writing them a recommendation)\n\nThis is your Algorithm Audit Report.",
      placeholder: "What the algorithm is doing: ...\nWho it serves: ...\nMy behavioral change: ...\nRecommendation to platform: ...",
      difficulty: "create"
    },

    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Unit Wrap-Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-unit-summary",
      type: "text",
      content: "**The Algorithm Economy — What You Learned**\n\nYou started this unit with a basic question: why does my feed show me what it shows me?\n\nYou ended it understanding that your feed is not random, not accidental, and not neutral. It is the product of:\n- Engineering decisions made by teams at tech companies\n- A business model that treats your attention as a commodity\n- Behavioral data you generated without knowing you were generating it\n- Feedback loops that narrow and reinforce over time\n- Commercial interests that are often misaligned with your wellbeing\n- And — in consequential domains — systems that can discriminate\n\n**But you also learned this:** You're not powerless. You can retrain your algorithm. You can build a better information environment. You can recognize manipulation when you see it. You can ask who benefits when content makes you angry or anxious.\n\nAlgorithmic literacy is not about quitting the internet. It's about using it with your eyes open.\n\nThe person who understands the system is harder to manipulate by it. That's you, now."
    },
    {
      id: "q-final-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "Final Reflection: What's the most important thing you're taking away from this unit? Not the most interesting fact — the thing that will actually change how you behave online. Why that thing?",
      placeholder: "Most important takeaway: ...\nWhy this will change my behavior: ...",
      difficulty: "reflect"
    },

    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Unit Vocabulary Review",
      subtitle: "All key terms from The Algorithm Economy"
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Algorithm audit", definition: "A systematic examination of an algorithmic system — documenting what it does, who it affects, and what harms or biases it produces." },
        { term: "Attention economy", definition: "An economic model where human attention is a scarce commodity, collected by platforms and sold to advertisers." },
        { term: "Filter bubble", definition: "The personalized information universe created by algorithms, where content matching your past behavior is amplified and challenging content is filtered out." },
        { term: "Algorithmic bias", definition: "Systematic and unfair discrimination produced by an algorithm, typically resulting from biased training data or flawed design." },
        { term: "Platform power", definition: "The extraordinary influence that technology platform companies exert over information flow, public discourse, and individual opportunity at global scale." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("algorithm-audit")
      .set(lesson);
    console.log('✅ Lesson "Your Algorithm Audit" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/algorithm-audit");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
