// seed-diglit-algorithm-attention-economy.js
// Creates "The Attention Economy — Who Profits From Your Scroll" (Dig Lit, Algorithm Economy, Lesson 43)
// Run: node scripts/seed-diglit-algorithm-attention-economy.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "The Attention Economy — Who Profits From Your Scroll",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 43,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "💸",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Instagram is free. TikTok is free. YouTube is free. Google is free.\n\nBut these companies are worth hundreds of billions of dollars.\n\nFree products that make billions of dollars. That doesn't add up — unless \"free\" isn't really free. Unless you're paying with something else.\n\nYou are. You're paying with your attention. And your attention is worth a lot of money to the right buyers."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If Instagram is completely free, how does Meta make $117 billion a year?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Before this lesson: how do you think social media companies make money? What's your best guess for how a \"free\" app becomes worth billions?",
      placeholder: "My guess: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain the attention economy business model — how attention is converted to revenue",
        "Identify why platforms are designed to maximize time-on-platform, not user wellbeing",
        "Analyze the conflict between platform incentives and user interests"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "📺",
      title: "Your Attention Is the Product",
      subtitle: "~20 minutes"
    },
    {
      id: "b-model",
      type: "text",
      content: "**How the business model works:**\n\n1. Platform is free → users give their time and attention\n2. Platform sells access to that attention to advertisers\n3. More time on platform = more ads shown = more revenue\n4. **Goal:** maximize time-on-platform above everything else\n\nMeta (Instagram/Facebook) makes ~97% of its revenue from advertising. Google makes ~80%. TikTok's primary revenue model is also advertising.\n\nThe product being sold isn't the app. **The product being sold is you** — specifically, your attention, your behavior data, and your demographics — packaged and sold to thousands of advertisers."
    },
    {
      id: "callout-tv",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**This isn't new.** In 1973, media critic Dallas Smythe coined the term \"audience commodity\" — the idea that TV networks don't sell shows to viewers, they sell viewers to advertisers. The show is bait. Your attention is the product.\n\nSocial media just made this model infinitely more precise. Instead of selling \"adults 18-49,\" they sell \"adults 18-49 who expressed interest in fitness, live in the Northeast, and recently searched for running shoes.\""
    },
    {
      id: "q-model",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Snapchat introduces a new feature: a counter showing exactly how many total hours you've spent on Snapchat this month. Which of the following is most likely to happen to the feature?",
      options: [
        "Snapchat would promote it — they want users to feel good about the app",
        "Snapchat would quietly remove it — it might reduce time-on-platform, which reduces ad revenue",
        "The feature would increase usage since users like tracking their screen time",
        "Regulators would require Snapchat to add this feature"
      ],
      correctIndex: 1,
      explanation: "This actually happened. Apple's Screen Time feature (which shows app usage) was controversial with social media companies. Features that make users aware of time spent tend to reduce usage — which directly reduces ad revenue. Platforms are not incentivized to help you use them less.",
      difficulty: "apply"
    },
    {
      id: "b-slot-machine",
      type: "text",
      content: "**Why scrolling feels addictive: The Variable Reward Schedule**\n\nPsychologist B.F. Skinner discovered that the most addictive reward schedule isn't consistent rewards — it's *unpredictable* ones. Slot machines pay out randomly. That unpredictability is what makes them hard to stop.\n\nYour social media feed works the same way:\n- Most posts are fine\n- Occasionally you find something incredible — a hilarious video, a post from someone you love, news that shocks you\n- You never know when the next great thing is coming\n- So you keep scrolling\n\nThis isn't accidental. Engineers who design social media feeds have studied behavioral psychology extensively. The infinite scroll was patented. The pull-to-refresh gesture was designed to feel like a slot machine lever.\n\n**Former Google design ethicist Tristan Harris said:** *\"A handful of people working at a handful of tech companies steer the thoughts of two billion people every day.\"*"
    },
    {
      id: "q-variable-reward",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe a moment when you (or someone you know) kept scrolling or checking a phone even when they didn't really want to. Using what you now know about variable reward schedules, explain why that happens.",
      placeholder: "The situation: ...\nWhy it happens (variable reward): ...",
      difficulty: "apply"
    },
    {
      id: "b-conflict",
      type: "text",
      content: "**The fundamental conflict:**\n\n| What's good for you | What's good for the platform |\n|---------------------|------------------------------|\n| Feeling satisfied and putting the phone down | You staying on longer to see more ads |\n| Seeing content that's accurate | Seeing content that provokes reaction (engagement) |\n| Connecting meaningfully with people | Passively consuming content (more ad inventory) |\n| Being aware of how long you've been on | Not noticing time passing |\n| Sleeping | Another 20 minutes of scrolling |\n\nPlatforms aren't evil — they're running a business. But the business model creates incentives that are **structurally opposed to your wellbeing**.\n\nKnowing this doesn't mean you have to quit social media. It means you use it with your eyes open."
    },
    {
      id: "q-conflict",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Instagram's internal research (leaked in 2021) found that Instagram makes body image issues worse for teenage girls — and they knew this for years. Why would a company keep a feature they know is harmful to their users?",
      options: [
        "Instagram didn't believe their own research",
        "The feature drove engagement and time-on-platform, which generates revenue — and the business incentive outweighed the harm",
        "Removing the feature would be technically impossible",
        "No one at Instagram knew about the research"
      ],
      correctIndex: 1,
      explanation: "This is the documented reality. Instagram's own researchers showed the harm — and the company continued the feature because engagement and time-on-platform generate revenue. This is the structural conflict: when user wellbeing reduces engagement metrics, the business model incentivizes prioritizing engagement over wellbeing.",
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
      content: "Social media platforms are not entertainment companies. They're advertising companies that use entertainment to sell your attention.\n\nThis isn't a conspiracy theory — it's in their SEC filings, their investor reports, and their own leaked internal research.\n\nKnowing this changes how you use these platforms. You can still enjoy them — but informed consumption is very different from unconscious consumption.\n\n**Up next:** Lesson 44 — Filter Bubbles and Rabbit Holes. The algorithm doesn't just optimize for time-on-platform. It also shapes what you believe — and what you don't know you're missing."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Does knowing that your attention is being sold change how you think about using social media? Why or why not? Be honest — not the answer you think you should give.",
      placeholder: "My honest answer: ...",
      difficulty: "evaluate"
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
        { term: "Attention economy", definition: "An economic model where human attention is treated as a scarce commodity — collected by platforms and sold to advertisers." },
        { term: "Time-on-platform", definition: "The total time a user spends on an app or website — the primary metric social media companies optimize for, since it directly correlates to ad revenue." },
        { term: "Variable reward schedule", definition: "A reinforcement pattern where rewards (entertaining content) come unpredictably — proven to be the most psychologically compelling and habit-forming reward structure." },
        { term: "Audience commodity", definition: "The concept that users of free media are themselves the product — their attention is packaged and sold to advertisers." },
        { term: "Infinite scroll", definition: "A design pattern that removes natural stopping points from a feed, intentionally making it harder to stop using an app." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("algorithm-attention-economy")
      .set(lesson);
    console.log('✅ Lesson "The Attention Economy" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/algorithm-attention-economy");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
