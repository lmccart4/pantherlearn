// seed-diglit-algorithm-tiktok.js
// Lesson 45 — How TikTok Decides What You See (and What You Don't)
// Run: node scripts/seed-diglit-algorithm-tiktok.js

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

const lesson = {
  title: "How TikTok Decides What You See (and What You Don't)",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 45,
  visible: false,
  gradesReleased: true,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎵",
      title: "Warm Up",
      subtitle: "~5 minutes",
    },
    {
      id: "b-warmup",
      type: "text",
      content:
        "TikTok's For You Page is considered the most powerful recommendation algorithm ever deployed to a mass consumer audience.\n\nInstagram took years to learn your interests. YouTube needed your search and watch history. Facebook needed your social graph.\n\nTikTok figures you out in 20-30 videos. From zero.\n\nThis isn't magic. It's an engineering achievement — and understanding it tells you a lot about how algorithms are evolving across every platform.",
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content:
        "**Question of the Day:** TikTok doesn't require you to follow anyone to give you a personalized feed. How does it figure out what you want before it knows anything about you?",
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt:
        "Have you ever had the experience of TikTok (or another algorithm) showing you something so specific to your interests or mood that it felt almost unsettling? Describe it.",
      placeholder: "What happened: ...\nWhy it felt strange: ...",
      difficulty: "remember",
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify the specific signals TikTok's For You Page algorithm weighs most heavily",
        "Explain why watch time dominates other signals on TikTok",
        "Analyze TikTok's algorithm as a model for how recommendation systems are evolving",
      ],
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "⚡",
      title: "Inside the For You Page",
      subtitle: "~20 minutes",
    },
    {
      id: "b-signals",
      type: "text",
      content:
        "TikTok published a partial description of how its recommendation system works. The signals, ranked by weight:\n\n**Tier 1 (most important):**\n- **Video completion rate** — Did you watch to the end? Did you re-watch?\n- **Replays** — How many times did you replay the video?\n- **Shares** — Did you send it to someone? (Strongest positive signal)\n\n**Tier 2 (important):**\n- **Likes** — Moderate positive signal\n- **Comments** — High engagement, even negative ones count\n- **Profile visits** — Did you tap through to see more from this creator?\n\n**Tier 3 (contextual):**\n- **Caption and hashtags** — What the creator says the video is about\n- **Audio track** — Sounds/songs associated with content types and communities\n- **Device type and language** — Regional and language signals\n- **Account settings** — Your stated preferences (less weight than behavioral data)\n\n**What TikTok claims NOT to use:** Follower count of the creator. A video from a creator with 0 followers gets the same initial test distribution as a creator with 10M followers.",
    },
    {
      id: "callout-test-distribution",
      type: "callout",
      style: "insight",
      icon: "💡",
      content:
        "**The test distribution system:** When a new video is posted, TikTok doesn't immediately show it to millions. It shows it to a small test group of ~100-500 people. If that group engages well (high completion rate, shares), it gets shown to a larger group. If that group engages, it expands further. This is why videos \"blow up\" — they passed progressively larger tests. A video with 10 views isn't dead — it just failed its first test.",
    },
    {
      id: "q-weight",
      type: "question",
      questionType: "multiple_choice",
      prompt:
        "A TikTok video gets: 10,000 likes, 200 comments, 50 shares, and a 45% completion rate (average viewer watches less than half). Another video gets: 500 likes, 30 comments, 15 shares, and a 95% completion rate. Which video is TikTok's algorithm more likely to promote further?",
      options: [
        "The first video — it has 20x more likes and comments",
        "The second video — its completion rate signals that viewers find it genuinely engaging",
        "They'd be treated equally since total engagement is similar",
        "TikTok would promote the first because it has more social proof",
      ],
      correctIndex: 1,
      explanation:
        "Completion rate is TikTok's most powerful signal. A 95% completion rate tells the algorithm that people found the content so compelling they watched nearly all of it. 10,000 likes on a video most people abandoned at 45% is a weaker signal. The algorithm is optimizing for 'will people watch the whole thing?' — that's what keeps them on the platform.",
      difficulty: "apply",
    },
    {
      id: "b-no-follower",
      type: "text",
      content:
        "**Why TikTok doesn't need you to follow anyone**\n\nOther platforms are follower-graph-based: you follow people → you see their content. This means new users need to follow accounts before they get a personalized feed — and popular accounts have structural advantages.\n\nTikTok broke this model. Its FYP is *interest-graph-based*: it infers your interests from pure behavior, then finds content that matches those interests — regardless of who made it.\n\nThis has two major effects:\n\n1. **Any creator can go viral immediately** — even with 0 followers, if the content is genuinely engaging\n2. **Users don't need to actively curate** — the algorithm does it automatically from behavior\n\nThis is why TikTok feels instantly personalized and why unknown creators can get millions of views overnight.",
    },
    {
      id: "b-shadow",
      type: "text",
      content:
        "**What TikTok doesn't show you**\n\nTikTok has also acknowledged using a practice called *\"not recommended\"* — suppressing certain content from For You Pages without removing it entirely. Reported categories have included:\n- Content from accounts with low follower counts (disputed)\n- Content flagged as potentially sensitive in specific regions\n- Content from users the system determines might be bullied (at one point, TikTok suppressed content from users it identified as disabled, LGBTQ+, or overweight to \"protect\" them — this was exposed and walked back)\n\nThe opacity of what gets suppressed — and why — is one of the major criticisms of algorithmic recommendation systems.",
    },
    {
      id: "q-opacity",
      type: "question",
      questionType: "short_answer",
      prompt:
        "TikTok's algorithm suppressed content from LGBTQ+ creators in certain regions — sometimes without telling creators their content was being limited. \n\nWho do you think should have the right to decide what content gets suppressed on a platform? The platform? The government? Users themselves? Explain your reasoning.",
      placeholder: "I think [who] should decide because...",
      difficulty: "evaluate",
    },

    {
      id: "section-lab",
      type: "section_header",
      icon: "📡",
      title: "Test Distribution Lab",
      subtitle: "~15 minutes",
    },
    {
      id: "b-lab-intro",
      type: "text",
      content:
        "Now it's your turn. You're a creator with 0 followers. Design 5 videos across 5 rounds, pull the 4 levers you control (hook, length, audio, hashtags), and see which ones pass each wave of TikTok's test-distribution cascade.\n\n**Your goal:** get at least one video all the way to wave 5 — viral.\n\nWatch what happens when you change one lever at a time. The diagnostic after each round will show you which lever helped and which one hurt.",
    },
    {
      id: "embed-test-distribution",
      type: "embed",
      scored: true,
      weight: 5,
      url: "https://pantherlearn-d6f7c.web.app/tools/test-distribution-lab.html",
      title: "Test Distribution Lab",
      height: 720,
    },

    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~5 minutes",
    },
    {
      id: "b-summary",
      type: "text",
      content:
        "TikTok's algorithm is the most accurate interest-inference system ever deployed at consumer scale — and it works by watching behavior, not preferences.\n\nIt's also opaque. Users don't know exactly why they see what they see. Creators don't know exactly why their content gets promoted or suppressed. And regulators are still figuring out how to evaluate algorithms they can't see inside.\n\n**Up next:** Lesson 46 — Virality by Design. You've seen how the algorithm distributes content. Now: what makes content spread? Virality isn't luck — it follows patterns.",
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt:
        "Exit Ticket: Based on what you learned, what's one concrete action you could take to intentionally change what your TikTok (or other) algorithm shows you? Why would that specific action work, based on how the algorithm actually works?",
      placeholder: "Action: ...\nWhy it works: ...",
      difficulty: "apply",
    },

    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Vocabulary",
      subtitle: "",
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "For You Page (FYP)", definition: "TikTok's main discovery feed — a personalized stream of content curated by the algorithm based entirely on behavioral signals, not who you follow." },
        { term: "Interest graph", definition: "A map of what a user is interested in, inferred from behavior — used by TikTok's algorithm instead of the follower-based social graph used by older platforms." },
        { term: "Follower graph", definition: "The network of who follows whom — the basis for content distribution on older platforms like Instagram and Twitter." },
        { term: "Test distribution", definition: "TikTok's system of showing new videos to progressively larger groups based on engagement performance — what makes videos 'blow up.'" },
        { term: "Content suppression", definition: "The practice of limiting a piece of content's distribution on a platform without removing it entirely — a contested and opaque aspect of platform moderation." },
      ],
    },
  ],
};

(async () => {
  try {
    const result = await safeLessonWrite(db, "digital-literacy", "algorithm-tiktok", lesson);
    console.log("✅ Lesson seeded:", result);
    console.log("   Path: courses/digital-literacy/lessons/algorithm-tiktok");
    console.log("   Blocks:", lesson.blocks.length);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
