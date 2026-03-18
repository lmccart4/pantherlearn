// seed-diglit-algorithm-filter-bubbles.js
// Creates "Filter Bubbles & Rabbit Holes: Seeing Your Own Bias" (Dig Lit, Algorithm Economy, Lesson 44)
// Run: node scripts/seed-diglit-algorithm-filter-bubbles.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Filter Bubbles & Rabbit Holes: Seeing Your Own Bias",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 44,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🫧",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Two people search the same thing on Google. They get different results.\n\nTwo people open the same social media app at the same time. They see completely different feeds.\n\nThis isn't random — it's by design. The internet you experience is not the same internet your parents, your classmates, or someone in another city experiences.\n\nYou're living in a personalized version of reality. And you can't see the edges of it."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If the algorithm only shows you content matching your existing views — how would you ever know you were missing something?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of a topic where your social media feed has a clear \"side.\" Is that the only side? Have you seen strong arguments for the other perspective on that same platform?",
      placeholder: "Topic: ...\nWhat my feed shows: ...\nHave I seen the other side? ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define filter bubble and explain how algorithms create them",
        "Distinguish between filter bubbles, echo chambers, and rabbit holes",
        "Analyze the real-world effects of living in an information filter bubble"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "🔍",
      title: "Three Things That Narrow Your World",
      subtitle: "~20 minutes"
    },
    {
      id: "b-filter-bubble",
      type: "text",
      content: "**The Filter Bubble** (Eli Pariser, 2011)\n\nA filter bubble is the personalized information universe created by algorithms — where content that matches your past behavior and viewpoints is amplified, and content that challenges them is filtered out.\n\nIt's not just social media:\n- Google personalizes search results based on your location, search history, and browsing behavior\n- News apps show you more of what you've clicked before\n- YouTube's homepage is built from your watch history\n\nThe result: two people researching the same political candidate can see completely different \"facts\" — because their algorithms have learned to show them very different sources.\n\n**Key insight:** A filter bubble doesn't feel like a bubble. It feels like the whole world."
    },
    {
      id: "b-echo-chamber",
      type: "text",
      content: "**The Echo Chamber**\n\nA filter bubble is created by algorithms. An echo chamber is created by *people* — when a social group only includes people with similar views, reinforcing those views until they feel like universal truth.\n\nOnline, these interact: the algorithm shows you content from your echo chamber, and your echo chamber gets reinforced by the algorithm. They amplify each other.\n\n**The danger:** In an echo chamber, extreme positions start to feel moderate. Everyone you follow agrees. Anyone who disagrees gets blocked or ridiculed. The range of \"acceptable\" opinions narrows.\n\nThis affects people across the political spectrum. It's not a left or right problem — it's a human psychology problem that algorithms exploit."
    },
    {
      id: "b-rabbit-hole",
      type: "text",
      content: "**The Rabbit Hole**\n\nA rabbit hole happens when the algorithm's recommendation logic leads you incrementally toward increasingly extreme content — because more extreme content generates more engagement (stronger emotions = longer watch time).\n\nDocumented example from YouTube research:\n- Start: mainstream political commentary\n- Week 2: more partisan commentary\n- Week 4: fringe political content\n- Week 8: conspiracy theories\n\nEach step felt like a small move. But the cumulative drift was enormous.\n\nThe algorithm doesn't care about the content's accuracy or extremism. It cares that you kept watching. And extreme content keeps people watching."
    },
    {
      id: "callout-research",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**MIT study (2018):** False information spreads 6x faster than true information on Twitter. Why? Because false or emotionally provocative content triggers stronger reactions — surprise, outrage, moral indignation — which drives more shares.\n\nThe algorithm doesn't fact-check. It amplifies engagement. And misinformation is often more engaging than accurate information."
    },
    {
      id: "q-bubble-identify",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student notices that every political news article recommended to her takes the same perspective. When she tries to find articles with the opposite viewpoint, they're hard to find on her feed. This is an example of:",
      options: [
        "A rabbit hole",
        "A filter bubble",
        "An echo chamber",
        "Algorithmic discrimination"
      ],
      correctIndex: 1,
      explanation: "This is a filter bubble — the algorithm has personalized her feed to reflect her past engagement, filtering out viewpoints that don't match her history. An echo chamber would involve the social network (who she follows). A rabbit hole involves gradual drift toward more extreme content. A filter bubble is specifically the algorithm-created information environment.",
      difficulty: "understand"
    },
    {
      id: "q-real-effects",
      type: "question",
      questionType: "short_answer",
      prompt: "Filter bubbles have real consequences beyond just 'seeing content you like.' List 2-3 specific ways living in a personalized information filter could affect:\n- How you understand a news event\n- How you see people who disagree with you\n- What you believe is 'normal' or 'most people's view'",
      placeholder: "News events: ...\nPeople who disagree: ...\nWhat seems 'normal': ...",
      difficulty: "analyze"
    },
    {
      id: "q-test-bubble",
      type: "question",
      questionType: "short_answer",
      prompt: "**Test Your Own Bubble:** Pick one topic you have opinions about. Search for it on your usual platform. Then think:\n- What perspectives show up?\n- What perspectives are absent?\n- If someone who strongly disagreed with you searched the same thing, what do you think they'd see?\n\nThis is your filter bubble.",
      placeholder: "Topic: ...\nPerspectives that show up: ...\nPerspectives missing: ...\nWhat they'd see: ...",
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
      content: "Filter bubbles, echo chambers, and rabbit holes are all related — but different. They all have the same effect: narrowing your information world until it feels complete, when it isn't.\n\nThe antidote isn't quitting social media. It's:\n- Actively seeking out perspectives that don't match your feed\n- Following sources that challenge you, not just validate you\n- Recognizing that your feed is *a* version of reality, not *the* version\n\n**Up next:** Lesson 45 — How TikTok's algorithm specifically works, and why it's both the most advanced and the most debated recommendation system ever built."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: In your own words, what's the difference between a filter bubble and an echo chamber? Give a specific real-world example of each.",
      placeholder: "Filter bubble: ...\nExample: ...\nEcho chamber: ...\nExample: ...",
      difficulty: "analyze"
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
        { term: "Filter bubble", definition: "The personalized information universe created by algorithms — where content matching your past behavior is shown and content challenging your views is filtered out." },
        { term: "Echo chamber", definition: "A social environment (online or offline) where a group of people with similar views constantly reinforce each other's beliefs, reducing exposure to different perspectives." },
        { term: "Rabbit hole", definition: "The gradual process of being led by recommendation algorithms toward increasingly extreme or niche content, each step feeling like a small move from the last." },
        { term: "Confirmation bias", definition: "The human tendency to favor information that confirms existing beliefs — algorithms exploit this by feeding you content that validates what you already think." },
        { term: "Information environment", definition: "The total set of news, opinions, and information someone is exposed to — increasingly shaped by algorithms rather than individual choice." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("algorithm-filter-bubbles")
      .set(lesson);
    console.log('✅ Lesson "Filter Bubbles & Rabbit Holes" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/algorithm-filter-bubbles");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
