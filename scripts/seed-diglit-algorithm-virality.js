// seed-diglit-algorithm-virality.js
// Creates "Virality by Design: How Content Goes Viral" (Dig Lit, Algorithm Economy, Lesson 46)
// Run: node scripts/seed-diglit-algorithm-virality.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Virality by Design: How Content Goes Viral",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 46,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔥",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "You've seen content go viral and thought: *\"Why did THAT get millions of views?\"*\n\nSometimes it seems random. Sometimes it seems unfair. Sometimes the best content gets ignored and mediocre content blows up.\n\nBut virality isn't random. It follows patterns. And those patterns have been studied, analyzed, and increasingly engineered — by researchers, marketers, and the platforms themselves."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Think of the last thing you shared online — a post, a video, a meme. Why did you share it? What made it worth passing on?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "List 3 pieces of content you've seen go viral recently (videos, posts, memes, news stories). For each one: what emotion did it trigger? Why do you think people shared it?",
      placeholder: "1. [Content]: Emotion: ... Why shared: ...\n2. [Content]: Emotion: ... Why shared: ...\n3. [Content]: Emotion: ... Why shared: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify the emotional triggers that drive content sharing",
        "Explain why outrage and negative emotions spread faster than positive ones",
        "Analyze a piece of viral content and identify its virality mechanics"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "📡",
      title: "The Science of Sharing",
      subtitle: "~20 minutes"
    },
    {
      id: "b-emotion",
      type: "text",
      content: "**Emotion drives sharing.** Wharton professor Jonah Berger studied thousands of viral articles and found a clear pattern: content that triggers **high-arousal emotions** spreads. Content that triggers low-arousal emotions does not.\n\n**High-arousal emotions (spread):**\n- Awe / amazement\n- Anger / outrage\n- Anxiety / fear\n- Humor / laughter\n- Surprise / shock\n\n**Low-arousal emotions (don't spread):**\n- Sadness\n- Contentment\n- Calm\n- Satisfaction\n\nThe key isn't positive vs. negative — it's *activating* vs. *calming*. Something that makes you laugh shares as well as something that makes you angry."
    },
    {
      id: "callout-outrage",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Why outrage spreads so fast:** Anger is high-arousal AND it carries a social signal — *\"this is wrong, and others should know about it.\"* Sharing outrage is a form of moral signaling: you're telling your network who you are and what you stand against.\n\nPlatforms that maximize engagement therefore often inadvertently maximize outrage — because outrage is the most shareable emotion. This is one reason why political content tends to become more extreme online."
    },
    {
      id: "b-mechanics",
      type: "text",
      content: "**Platform mechanics that amplify virality:**\n\n- **Shares** — The most direct amplification tool. One share can expose content to hundreds of new people.\n- **Duets and Stitches (TikTok)** — Letting others respond to your content extends the conversation and creates new entry points for discovery.\n- **Trending sounds** — Audio that already has millions of associations gets boosted when new videos use it.\n- **Comments that disagree** — Controversial content generates more debate comments. Comments boost algorithmic distribution. Result: controversial content gets pushed further.\n\n**The dark pattern:** The most engaging content is often the most divisive — not the most accurate, most helpful, or most important."
    },
    {
      id: "q-emotion-id",
      type: "question",
      questionType: "short_answer",
      prompt: "Analyze one piece of viral content from your warm-up:\n\n- What was the content?\n- What high-arousal emotion did it trigger?\n- What social signal did sharing it send? (What did sharing it say about the sharer?)\n- Was the content accurate/true? Does that matter for virality?",
      placeholder: "Content: ...\nEmotion: ...\nSocial signal of sharing: ...\nAccurate? Does accuracy matter for virality? ...",
      difficulty: "analyze"
    },
    {
      id: "b-design",
      type: "text",
      content: "**Engineered virality**\n\nVirality used to happen accidentally. Now it's increasingly engineered.\n\nMarketing teams study:\n- What emotions their content triggers\n- Which headlines get more clicks (A/B testing thousands of variations)\n- What time of day different emotions peak\n- Which sharing behaviors their audience has\n\nPolitical campaigns, news organizations, and brands all use these techniques. Some news sites have A/B tested thousands of headline variations to find the one that triggers the most clicks — not the most accurate representation of the story.\n\nResult: you often see the most optimized-for-engagement version of a story, not the most accurate or complete version."
    },
    {
      id: "q-design",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A news website A/B tests two headlines for the same story:\n\nVersion A: \"New Study Shows Some Benefits to Moderate Coffee Consumption\"\nVersion B: \"Scientists Confirm: Coffee Drinkers Live Longer\"\n\nVersion B gets 4x more clicks. The study actually found modest associations in some populations, not a universal effect. The site runs Version B. What's the problem?",
      options: [
        "Version B is longer and harder to read",
        "Version B triggers more sharing through a stronger claim, but misrepresents the actual science — optimizing for clicks over accuracy",
        "The study should not have been published at all",
        "Version A would have been better because it's more cautious"
      ],
      correctIndex: 1,
      explanation: "Version B is optimized for virality (strong claim, definitive language, emotional appeal to coffee drinkers) but misrepresents what the study actually found. This is how misinformation spreads through legitimate-looking news outlets — not by fabricating stories, but by systematically distorting headlines toward the most engaging framing.",
      difficulty: "evaluate"
    },
    {
      id: "q-apply",
      type: "question",
      questionType: "short_answer",
      prompt: "You're a creator trying to get a video about climate science to go viral. Based on what you learned, what emotional angle would you use? What would you NOT do? How do you balance virality with accuracy?",
      placeholder: "Emotional angle I'd use: ...\nI'd avoid: ...\nBalance: ...",
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
      content: "Virality is driven by emotion, amplified by platform mechanics, and increasingly engineered by professionals who understand exactly what triggers sharing.\n\nThis doesn't mean everything viral is manipulative — plenty of genuine, important content goes viral for real reasons. But knowing the mechanics helps you ask: *\"Why am I sharing this? Is it because it's true and important — or because it triggered an emotion that made me want to react?\"*\n\n**Up next:** Lesson 47 — Influencer Economics. You've seen how content spreads. Now: how do the people who make it actually make money?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Next time you're about to share something, what questions should you ask yourself before hitting share? Write 3 specific questions based on what you learned today.",
      placeholder: "Question 1: ...\nQuestion 2: ...\nQuestion 3: ...",
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
        { term: "Virality", definition: "The rapid spread of content through social sharing — driven by emotional activation, not just quality or importance." },
        { term: "High-arousal emotion", definition: "An emotion that activates and energizes — awe, anger, anxiety, humor, surprise. These drive sharing. Low-arousal emotions (calm, sadness) do not." },
        { term: "A/B testing", definition: "Showing two different versions of content to different groups to see which performs better — widely used to optimize headlines and posts for maximum clicks." },
        { term: "Moral outrage", definition: "Anger triggered by perceived violations of moral norms — one of the most shareable emotions online because sharing it signals group membership and values." },
        { term: "Engineered virality", definition: "The deliberate application of virality research and platform mechanics to maximize content spread — used by marketers, campaigns, and news organizations." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("algorithm-virality")
      .set(lesson);
    console.log('✅ Lesson "Virality by Design" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/algorithm-virality");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
