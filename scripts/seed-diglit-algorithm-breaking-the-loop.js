// seed-diglit-algorithm-breaking-the-loop.js
// Creates "Breaking the Loop — How to Reclaim Your Feed" (Dig Lit, Algorithm Economy, Lesson 49)
// Run: node scripts/seed-diglit-algorithm-breaking-the-loop.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Breaking the Loop — How to Reclaim Your Feed",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 49,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔓",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "The last seven lessons have been about what algorithms do *to* you.\n\nNow: what can you do about it?\n\nThe honest answer is: you can't fully escape algorithmic systems. They're built into the infrastructure of the internet. But you have more agency than you might think — if you understand how the systems work.\n\nSmall, intentional behavioral changes send different signals to the algorithm. Deliberately seeking out different sources breaks the filter bubble. Choosing platforms with different incentive structures changes what you're exposed to.\n\nAlgorithmic literacy isn't just about understanding the system — it's about acting differently because of that understanding."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If your feed perfectly reflects your past behavior — and your past behavior isn't fully who you want to be — how do you change what the algorithm thinks you are?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about your main platform's feed. Is there anything it over-recommends that you're a little tired of? Is there anything it under-recommends that you'd actually like to see more? Why do you think that pattern formed?",
      placeholder: "Over-recommends: ...\nUnder-recommends: ...\nWhy: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify specific behavioral strategies that alter algorithmic recommendations",
        "Evaluate the tradeoffs of different approaches to managing your information environment",
        "Create a personal plan for more intentional platform use"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "🛠️",
      title: "Tools and Strategies",
      subtitle: "~20 minutes"
    },
    {
      id: "b-signal-strategies",
      type: "text",
      content: "**Strategy 1: Intentional signal sending**\n\nThe algorithm learns from what you do, not what you say you want. To change your recommendations:\n\n- **Watch content you actually want to see — fully.** Completion rate is the strongest signal on TikTok and YouTube. Watching something through says \"more of this.\"\n- **Skip or scroll past quickly** what you don't want more of — even if the algorithm has already shown it to you.\n- **Like and save deliberately.** Only like things you genuinely want more of. Don't like something just because it's good — ask: do I want my feed full of this?\n- **Use \"Not interested\" / \"See less of this\"** features. They're not decorative. They directly suppress content types from your feed.\n- **Search for content you want.** Search signals intent. If you search for science journalism, the algorithm learns that's something you seek out.\n\n**Key insight:** You trained your current feed. You can re-train it. It takes 2-3 weeks of consistent different behavior."
    },
    {
      id: "b-environment",
      type: "text",
      content: "**Strategy 2: Change your information environment**\n\nDon't just manage the algorithm — build a better information environment alongside it:\n\n- **Follow sources outside your usual perspective.** Deliberately follow journalists, analysts, or communities with different viewpoints. You don't have to agree — you have to know what other people think.\n- **Use RSS readers (Feedly, etc.)** to subscribe to sources directly — bypassing algorithmic filtering entirely. You choose what's there; nothing is ranked by engagement.\n- **Read lateral news** — instead of reading one source's coverage of a story, search for how *multiple* different outlets covered the same event. Compare.\n- **Subscribe to newsletters** from writers whose thinking challenges yours. No algorithm involved — just a direct line from writer to your inbox.\n\n**The goal:** Supplement the algorithm's feed with sources you *chose*, not sources the algorithm chose for you."
    },
    {
      id: "b-platform",
      type: "text",
      content: "**Strategy 3: Choose platforms by their incentive structure**\n\nNot all platforms are equally problematic. Understanding what a platform optimizes for helps you choose where you spend time:\n\n| Platform | Optimizes for | Implication |\n|----------|--------------|-------------|\n| TikTok | Watch time / completion rate | Strong filter bubble, very good at finding niche interests |\n| Twitter/X | Outrage engagement | Algorithmically amplifies conflict |\n| YouTube | Watch time | Rabbit hole risk, especially for news/politics |\n| Reddit (subscribed) | Community-voted posts | You choose your communities; less algorithmic |\n| Newsletters/RSS | Reader subscription | No algorithm — direct editorial-to-reader |\n| Wikipedia | Accuracy | No engagement optimization at all |\n\nPlatforms optimized for **engagement** have misaligned incentives. Platforms where you **manually choose** your sources give you more control."
    },
    {
      id: "callout-digital-fast",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The reset:** If your algorithm is deeply entrenched, a \"feed reset\" can help. Delete the app and reinstall (clears history on some platforms). Log out and use the app without an account for a week. Or simply create a fresh account. Starting fresh loses your history — which is exactly the point."
    },
    {
      id: "q-strategies",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You want to diversify the news perspectives in your social media feed. You start following 10 new accounts representing different political viewpoints. After two weeks, your feed is showing you more posts from those accounts — but the algorithm is *also* showing you more outrage content from across the political spectrum, because you're engaging with political content more. What happened?",
      options: [
        "The strategy worked perfectly — you're now seeing more viewpoints",
        "The strategy partially worked — you're seeing more perspectives, but your increased political engagement triggered more outrage-optimized content overall",
        "The strategy failed — following new accounts never changes the algorithm",
        "You should have deleted the app instead"
      ],
      correctIndex: 1,
      explanation: "This is the tradeoff. Engaging with more political content — even diverse political content — signals to the algorithm that you want *political* content. And political content tends to be outrage-optimized. Diversifying by topic (not just perspective) often works better. The algorithm responds to what category of content you engage with, not just which specific viewpoint.",
      difficulty: "analyze"
    },
    {
      id: "q-personal-plan",
      type: "question",
      questionType: "short_answer",
      prompt: "Based on what you've learned in this unit, design a personal \"algorithm management plan\" for yourself:\n\n1. One behavioral change you'll make on your main platform\n2. One new information source you'll add that's NOT algorithm-driven\n3. One type of content you'll actively stop engaging with\n4. One platform you might use less (and why)\n\nBe specific — name the platform, the content type, the source.",
      placeholder: "Behavior change: ...\nNew source: ...\nStop engaging with: ...\nUse less: ...",
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
      content: "You can't opt out of algorithmic systems entirely. But you're not powerless.\n\nAlgorithmic literacy means using these systems intentionally — knowing what signals you're sending, what choices you're making, and what information environment you're constructing for yourself.\n\nThe people who understand how recommendation systems work can navigate them. The people who don't are navigated by them.\n\n**Up next:** Lesson 50 — Platform Power. You've seen how algorithms work and how to manage them. But who controls the algorithms? What power do platform companies have — and what limits (if any) exist on that power?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: What's one thing you'll actually do differently on a platform this week based on what you learned today? Why that specific thing?",
      placeholder: "What I'll do: ...\nWhy: ...",
      difficulty: "apply"
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
        { term: "Intentional signal sending", definition: "Deliberately choosing which content to engage with — and which to skip — in order to retrain algorithmic recommendations toward what you actually want." },
        { term: "RSS feed", definition: "A subscription format that delivers content from websites directly to a reader without algorithmic filtering — you choose exactly what sources appear." },
        { term: "Lateral reading", definition: "The practice of verifying a source or story by checking what multiple other sources say about it, rather than reading deeply within a single source." },
        { term: "Feed reset", definition: "Clearing your algorithmic history (by deleting/reinstalling an app or creating a new account) to start fresh without the accumulated bias of past behavior." },
        { term: "Incentive structure", definition: "What a platform is designed to maximize — engagement, watch time, outrage, subscriptions — which determines what type of content it promotes." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("algorithm-breaking-the-loop")
      .set(lesson);
    console.log('✅ Lesson "Breaking the Loop" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/algorithm-breaking-the-loop");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
