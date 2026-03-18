// seed-diglit-algorithm-how-it-works.js
// Creates "How Recommendation Algorithms Actually Work" (Dig Lit, Algorithm Economy, Lesson 42)
// Run: node scripts/seed-diglit-algorithm-how-it-works.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "How Recommendation Algorithms Actually Work",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 42,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🤖",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "You've never explicitly told TikTok, YouTube, or Spotify what you like. But somehow, within a day or two of using them, your feed feels weirdly specific to you — like it knows you.\n\nThat's not magic. That's a recommendation algorithm. And it's not guessing — it's watching every single thing you do and making very accurate predictions about what you'll do next.\n\nToday you'll see exactly how it works."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** You've never told TikTok your interests. So how does it know what to show you within your first hour of using it?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about your main social media or streaming platform. List 3-4 things it recommends to you regularly. Now guess: what does the algorithm *think* you are? What identity has it built for you based on your behavior?",
      placeholder: "It recommends: ...\nThe algorithm thinks I am: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain how recommendation algorithms use engagement signals to predict behavior",
        "Identify the feedback loop that shapes what you see over time",
        "Analyze what signals your own behavior is sending to algorithms"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "⚙️",
      title: "The Signal Machine",
      subtitle: "~20 minutes"
    },
    {
      id: "b-what-is",
      type: "text",
      content: "A **recommendation algorithm** is a system that scores every piece of content in its library and predicts: *\"What is this specific user most likely to engage with next?\"*\n\nIt makes that prediction using **engagement signals** — behavioral data points you generate every time you use the platform."
    },
    {
      id: "b-signals",
      type: "text",
      content: "**What counts as a signal:**\n\n| Signal | What it tells the algorithm |\n|--------|-----------------------------|\n| Watch time / completion rate | How much you liked the content (most important on TikTok/YouTube) |\n| Re-watch | You really liked it |\n| Like | Mild positive signal |\n| Share | Strong positive signal — you thought others would want this |\n| Save / bookmark | You want to return to this |\n| Comment | High engagement — even negative comments count |\n| Skip / scroll past | Negative signal — not relevant |\n| Pause on | You were intrigued even if you didn't engage |\n| Who you follow | Long-term interest signal |\n| Time of day | Context signal — what you watch at midnight vs. 8am differs |\n\nThe algorithm doesn't just track what you clicked. It tracks how long you hovered, how fast you scrolled past, whether you came back. **Everything is a signal.**"
    },
    {
      id: "callout-completion",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Watch time is king.** On TikTok and YouTube, completion rate (what % of the video you watched) is the most powerful signal. A 15-second video you watched 3 times tells the algorithm you loved it — even if you never liked or commented. A 10-minute video you abandoned at 30 seconds tells the algorithm that video isn't for you."
    },
    {
      id: "q-signals",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're scrolling YouTube Shorts. You watch a cooking video all the way through, then immediately scroll past 3 gaming videos without pausing. What does the algorithm conclude?",
      options: [
        "You like both cooking and gaming equally",
        "You like cooking more than gaming — it will show you more cooking content",
        "You like gaming because you watched 3 gaming videos",
        "The algorithm can't determine preferences from this behavior"
      ],
      correctIndex: 1,
      explanation: "Completion rate signals strong preference. You finished the cooking video (positive signal). You scrolled past the gaming videos without pausing (negative signals). The algorithm concludes cooking is relevant to you; gaming is not. It will increase cooking recommendations and decrease gaming ones.",
      difficulty: "apply"
    },
    {
      id: "b-feedback-loop",
      type: "text",
      content: "**The Feedback Loop**\n\nHere's where it gets important:\n\n1. You engage with certain content\n2. The algorithm shows you more of that type of content\n3. You engage with that content too\n4. The algorithm gets more confident you like that type\n5. Your feed narrows further around that type\n6. Repeat\n\nOver time, your feed becomes a **very accurate mirror of your past behavior** — not a window onto the full world of content. And because the algorithm optimizes for engagement, it tends toward content that provokes strong reactions: entertaining, outrageous, emotionally intense.\n\nYou didn't choose this feed. You trained it — without realizing you were training it."
    },
    {
      id: "q-feedback-loop",
      type: "question",
      questionType: "short_answer",
      prompt: "A student watches a few videos about a controversial political topic because they find it interesting. Over the next week, their feed fills with more and more content about this topic — increasingly one-sided.\n\nExplain this using the feedback loop. What signals did the student send? What did the algorithm do with them? What's the result after a few weeks?",
      placeholder: "Signals sent: ...\nAlgorithm response: ...\nResult after weeks: ...",
      difficulty: "analyze"
    },
    {
      id: "b-cold-start",
      type: "text",
      content: "**The Cold Start Problem**\n\nWhen you're brand new to a platform, the algorithm has no data on you yet. This is called the \"cold start problem.\"\n\nPlatforms solve it by:\n- Asking you explicitly what you like (onboarding screens)\n- Grouping you with similar users: *\"Users who signed up from the same device/location/age group tend to like these things\"*\n- Showing you a diverse mix of content and watching what you engage with\n- Using signals from your phone's other data (location, other apps) if you gave permission\n\nTikTok is especially good at cold start — its algorithm figures out your interests within the first 20-30 videos, based purely on watch time. That's why it feels unnervingly accurate very fast."
    },
    {
      id: "q-cold-start",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You create a brand new TikTok account with no follows and no history. The app shows you 20 random videos. You watch 3 cooking videos all the way through and skip everything else. What happens next?",
      options: [
        "The algorithm shows you more random videos since it still doesn't know your interests",
        "The algorithm immediately starts showing you more cooking content and reduces other categories",
        "You need to follow at least 5 accounts before the algorithm personalizes your feed",
        "The algorithm shows cooking to everyone by default"
      ],
      correctIndex: 1,
      explanation: "Three full completions in a row is a strong enough signal for TikTok's algorithm to start personalizing. It doesn't wait for you to follow accounts or explicitly state interests — behavioral signals start shaping your feed from video 1. This is why TikTok feels personalized faster than other platforms.",
      difficulty: "understand"
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
      content: "Every scroll, pause, watch, and skip is data. The algorithm is never off — it's always learning, always refining its model of you.\n\nYou built your feed. You just didn't realize you were building it.\n\n**Up next:** Lesson 43 — Who profits from your scroll? The platforms showing you this content aren't doing it to help you. There's a business model behind all of it."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Based on what you learned today, what signals have YOU been sending your main platform? If the algorithm has been watching you for months — what does it think you are? Is that who you actually are?",
      placeholder: "Signals I've been sending: ...\nThe algorithm thinks I am: ...\nIs that accurate? ...",
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
        { term: "Recommendation algorithm", definition: "A system that predicts what content a specific user is most likely to engage with next, based on their behavioral history." },
        { term: "Engagement signal", definition: "Any behavioral data point the algorithm collects — watch time, likes, shares, scrolls, pauses — used to predict future preferences." },
        { term: "Completion rate", definition: "The percentage of a video a user watched — the most powerful engagement signal on short-form platforms like TikTok." },
        { term: "Feedback loop", definition: "The cycle where your past behavior shapes future recommendations, which shapes future behavior — causing feeds to narrow around specific content types." },
        { term: "Cold start problem", definition: "The challenge of personalizing recommendations for a brand new user who has no behavioral history on the platform." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("algorithm-how-it-works")
      .set(lesson);
    console.log('✅ Lesson "How Recommendation Algorithms Actually Work" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/algorithm-how-it-works");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
