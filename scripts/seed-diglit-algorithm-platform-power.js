// seed-diglit-algorithm-platform-power.js
// Creates "Platform Power: Who Controls the Algorithm?" (Dig Lit, Algorithm Economy, Lesson 50)
// Run: node scripts/seed-diglit-algorithm-platform-power.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Platform Power: Who Controls the Algorithm?",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 50,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🏛️",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Five companies — Meta, Google, Apple, Amazon, and Microsoft — control most of what you see, hear, and read online.\n\nMeta controls Instagram, Facebook, WhatsApp, and Threads. Google controls Search, YouTube, Gmail, Chrome, and Android. Apple controls the App Store — the gateway to almost every app on an iPhone.\n\nThese companies make editorial decisions every day: what content gets amplified, what gets suppressed, whose accounts get suspended, what speech is allowed. But they're private companies, not governments. Their decisions aren't subject to First Amendment constraints.\n\nWho should have the power to make these decisions? Who currently does? And who, if anyone, should be able to check that power?"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Should a private company like Meta or Google be able to decide what content gets amplified or suppressed on the internet — without explaining why?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "If you woke up tomorrow and all your social media accounts had been deleted with no explanation — what would you lose? What recourse would you have? What does that tell you about the power these platforms have?",
      placeholder: "What I'd lose: ...\nRecourse I'd have: ...\nWhat this reveals: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Describe the scope of power that platform companies hold over information flow",
        "Explain the main regulatory approaches to platform power being debated globally",
        "Evaluate the tradeoffs between platform freedom and platform accountability"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "⚡",
      title: "The Scale of Platform Power",
      subtitle: "~20 minutes"
    },
    {
      id: "b-scale",
      type: "text",
      content: "**What platform power actually looks like:**\n\n- **Content moderation at scale:** Meta's content moderation team reviews millions of posts per day. Their decisions about what violates \"community standards\" affect what 3 billion people see.\n\n- **Algorithmic amplification:** A platform's choice of what to amplify can decide which movements gain momentum, which political candidates get organic reach, which news stories become national conversations.\n\n- **Deplatforming:** When Twitter (now X) banned former President Trump after January 6, 2021, one private company's decision removed the sitting president of the United States from the most-used political communication platform. Whether you support that decision or oppose it, the power it represented was extraordinary.\n\n- **App Store gatekeeping:** Apple and Google control the app stores through which 99% of mobile software is distributed. In 2021, both removed Parler (a social media platform) from their stores, effectively taking it offline — one decision by two companies ended a platform.\n\n- **Search visibility:** Google's algorithm changes can make or break businesses. A search ranking update in 2011 (\"Panda\") destroyed traffic for thousands of websites overnight. No appeal process, no explanation."
    },
    {
      id: "b-arguments",
      type: "text",
      content: "**The regulatory debate — four positions:**\n\n**Position 1: Leave platforms alone (libertarian/tech industry view)**\nPlatforms are private companies. They have the right to set their own rules, just as a newspaper decides what to publish. Government regulation of content decisions is censorship. Competition will solve problems — if users don't like one platform's moderation, they'll go elsewhere.\n\n**Position 2: Regulate like utilities (progressive view)**\nPlatforms have become essential infrastructure — like electricity or phone service. Once a service reaches a certain scale, it should be subject to non-discrimination requirements. You can't deny someone electricity because you disagree with their politics; you shouldn't be able to deny them internet infrastructure either.\n\n**Position 3: Break them up (antitrust view)**\nThe problem isn't how platforms moderate — it's their monopoly power. Meta bought Instagram and WhatsApp specifically to eliminate competitors. Restoring competition through antitrust enforcement would give users real alternatives.\n\n**Position 4: Transparency requirements (centrist view)**\nPlatforms don't need to be broken up or regulated as utilities — but they should be required to explain their decisions. Algorithmic transparency: publish how the algorithm works. Appeals processes: users should have the right to challenge removal decisions. Audits: independent researchers should have access to study platform effects."
    },
    {
      id: "callout-section230",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Section 230:** A 1996 US law that says platforms are not legally responsible for content posted by their users. It's why YouTube isn't sued when someone posts a defamatory video — only the poster is liable. This law enabled the modern internet (without it, platforms couldn't let users post anything). It's also been criticized for enabling platforms to host harmful content without consequence. Both Republicans and Democrats want to change it — for completely different reasons. It's one of the most contested laws in tech policy."
    },
    {
      id: "q-position",
      type: "question",
      questionType: "short_answer",
      prompt: "Of the four regulatory positions described, which do you find most compelling — and why? What's the strongest argument against the position you chose?\n\n(You don't have to agree with the position. Pick the one with the best argument.)",
      placeholder: "Position I find most compelling: ...\nWhy: ...\nStrongest counter-argument: ...",
      difficulty: "evaluate"
    },
    {
      id: "q-global",
      type: "question",
      questionType: "multiple_choice",
      prompt: "The European Union passed the Digital Services Act (DSA), which requires large platforms to: publish how their algorithm works, give users an option for a non-personalized feed, and submit to independent audits. The US has passed no equivalent law. What's the likely effect?",
      options: [
        "European users get more transparency and control; US users get the same platform experience as before",
        "Platforms will build one global version for all users with full transparency",
        "Platforms will exit the EU market rather than comply",
        "The DSA will have no effect because platforms can ignore EU law"
      ],
      correctIndex: 0,
      explanation: "The DSA applies to users in the EU — so European users get mandated algorithmic transparency, chronological feed options, and audit protections. US users get whatever Meta and Google choose to provide, with no equivalent legal requirement. This 'regulatory arbitrage' is common: companies follow the rules where they must and keep existing practices where they don't have to change.",
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
      content: "Platform power is one of the defining political and economic questions of the next decade. Companies with 3 billion users, trillion-dollar valuations, and control over information infrastructure are making decisions that affect democracies, elections, public health, and individual lives — with limited external accountability.\n\nThe outcome of these debates — regulation, antitrust, transparency requirements, or the status quo — will shape the internet you live on for decades.\n\nYou'll vote on these questions eventually. Some of you might work on these problems. Understanding the stakes — and the real tradeoffs — is part of what it means to be a digitally literate citizen.\n\n**Up next:** Lesson 51 — Your Algorithm Audit. The final project for this unit. You'll apply everything you've learned to analyze your own digital information environment."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Do you think the level of power that platform companies have over information is a problem that needs to be solved — or is it acceptable as-is? Defend your answer in 3-4 sentences.",
      placeholder: "My position: ...\nDefense: ...",
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
        { term: "Content moderation", definition: "The process of reviewing and removing (or amplifying) user-generated content based on platform policies — done at scale by a combination of human reviewers and AI." },
        { term: "Deplatforming", definition: "The removal of a person, organization, or piece of content from a platform — a decision made by the platform that can significantly limit someone's ability to communicate publicly." },
        { term: "Section 230", definition: "A 1996 US law that protects platforms from legal liability for content posted by their users — the legal foundation that enabled user-generated content platforms to exist." },
        { term: "Digital Services Act (DSA)", definition: "A 2022 European Union law requiring large platforms to publish algorithmic information, offer non-personalized feeds, and submit to independent audits." },
        { term: "Algorithmic transparency", definition: "The practice of publicly disclosing how a recommendation algorithm works — what signals it uses, what it optimizes for, and how content moderation decisions are made." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("algorithm-platform-power")
      .set(lesson);
    console.log('✅ Lesson "Platform Power" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/algorithm-platform-power");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
