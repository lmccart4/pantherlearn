// seed-diglit-entrepreneurship-landing-page.js
// Creates "Your Online Presence — Landing Pages and Link-in-Bio" (Dig Lit, Unit 6, Lesson 37)
// Run: node scripts/seed-diglit-entrepreneurship-landing-page.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Your Online Presence — Landing Pages and Link-in-Bio",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 37,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔗",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Every successful creator and small business online eventually faces the same problem: \"I have followers on 3 different platforms. How do I connect them all to my products?\"\n\nThe answer: one link that goes everywhere.\n\nThat link points to a **landing page** or **link-in-bio** — a single destination that acts as your business's home base on the internet."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why do creators say 'link in bio' instead of just posting the link in their caption?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Instagram doesn't allow clickable links in post captions. Only one link is allowed in your bio. If you're a creator promoting 5 different things (your Etsy shop, your YouTube, your newsletter, your latest post, your free guide) — why is a link-in-bio page the solution?",
      placeholder: "The solution is a link-in-bio because...",
      difficulty: "understand"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why every online business needs a central hub beyond just social profiles",
        "Identify the 5 essential elements of an effective landing page",
        "Build a simple landing page for your business using Carrd.co or Google Sites"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "🏠",
      title: "Why You Need a Hub — and What Goes In It",
      subtitle: "~15 minutes"
    },
    {
      id: "b-why-hub",
      type: "text",
      content: "**The problem with social media as your only home:**\n- Platforms own your audience. If TikTok gets banned tomorrow, you lose everything.\n- You can't control the design, the experience, or what the algorithm shows next.\n- You can't track who visits, build an email list, or create a real storefront.\n\n**Your landing page is YOURS.**\nYou control it. It doesn't disappear when platforms change. It's where you send people from every platform — one URL, everything accessible.\n\n**5 elements every landing page needs (above the fold):**\n\n1. **Headline** — Your value proposition (from Lesson 34). Who you help + what they get. In one sentence.\n2. **Visual** — Your logo, a product mockup, or a photo that makes the page feel real\n3. **CTA Button** — ONE clear action. Not five options. *\"Shop Now\" / \"Subscribe\" / \"Book a Call\"*\n4. **Social proof** — Anything that makes you look credible: testimonials, follower count, \"featured in\"\n5. **Links** — Your content platforms, shop, email signup, and social profiles"
    },
    {
      id: "callout-above-fold",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Above the fold** = everything visible before the visitor scrolls. Research shows 80% of visitors never scroll past the fold. If your headline, CTA, and value proposition aren't visible immediately, most people leave without taking any action. Design for the fold first."
    },
    {
      id: "q-landing-elements",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A landing page's headline says: 'Welcome to My Store!' There's a menu with 8 navigation options. Below the fold is a product description paragraph. What's the primary problem with this landing page?",
      options: [
        "The headline is too short",
        "There are too many navigation options and no clear CTA — the visitor doesn't know what to do",
        "Product descriptions shouldn't be below the fold",
        "8 navigation options is the right amount for a business website"
      ],
      correctIndex: 1,
      explanation: "This page violates two landing page principles: the headline gives no value information (vs. a specific benefit statement), and 8 navigation options diffuse focus. Landing pages should have ONE CTA. The visitor's attention is split between 8 choices, so they make none. The 5-second test fails: you can't tell what the business does from the headline.",
      difficulty: "analyze"
    },
    {
      id: "q-five-second",
      type: "question",
      questionType: "short_answer",
      prompt: "The '5-second test': Show your landing page to a stranger for 5 seconds, then close it. They should be able to answer:\n1. What does this business do?\n2. Who is it for?\n3. What should I do next?\n\nIf they can't answer all three, what needs to change?",
      placeholder: "If they can't answer in 5 seconds, the problem is usually...",
      difficulty: "apply"
    },

    {
      id: "section-practice",
      type: "section_header",
      icon: "🏗️",
      title: "Build Your Landing Page",
      subtitle: "~15 minutes"
    },
    {
      id: "b-build-intro",
      type: "text",
      content: "You'll build your landing page using **Carrd.co** (free, no-code, looks professional) or **Google Sites** (fallback if Carrd is blocked).\n\n**Carrd.co:** Create a free account at carrd.co with your school email. The free tier allows 3 pages — more than enough.\n\n**Your landing page must include:**\n- Headline from your value proposition (Lesson 34)\n- Your brand colors and logo (Lesson 35)\n- At least 1 CTA button\n- Links to your social profiles (can be placeholders)\n- A brief 'About' section (2-3 sentences)\n\n**Milestones:** Headline done by min 5 → CTA by min 10 → links + about by min 15. Don't get lost customizing fonts before the structure is complete."
    },
    {
      id: "q-headline-check",
      type: "question",
      questionType: "short_answer",
      prompt: "What is your landing page headline? It should be your value proposition — who you help and what they get. Test it: can a stranger tell what your business does from this one sentence?",
      placeholder: "My headline: ...",
      difficulty: "create"
    },
    {
      id: "q-cta-choice",
      type: "question",
      questionType: "short_answer",
      prompt: "What is your ONE primary call-to-action button? (What do you want visitors to do?) And where does it link to?",
      placeholder: "Button text: ...\nLinks to: ...\nWhy this is the most important action: ...",
      difficulty: "create"
    },
    {
      id: "q-five-second-test",
      type: "question",
      questionType: "short_answer",
      prompt: "After building your page: swap Chromebooks with a partner. Partner looks at your landing page for 5 seconds, then closes the tab. They answer:\n1. What does this business do?\n2. Who is it for?\n3. What's the main thing you want me to do?\n\nDid they get all three? What needs to change?",
      placeholder: "Partner's answers: 1. ... 2. ... 3. ...\nWhat needs to change: ...",
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
      content: "Your landing page is the foundation of your online presence. Every platform sends traffic here. Every piece of content you make ultimately points back to this URL.\n\nA simple, clear landing page that passes the 5-second test is better than a complex, beautiful one that confuses visitors.\n\n**Up next:** Lesson 38 — Marketing on $0. You have a place to send people. Now: how do you get people there without spending money?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: What's the URL of your landing page? Does it pass the 5-second test? What's the one thing you'd still change?",
      placeholder: "URL: ...\nPasses 5-second test: yes/no\nI'd still change: ...",
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
        { term: "Landing page", definition: "A standalone web page designed to get a visitor to take one specific action — buy, subscribe, book, or click a link." },
        { term: "Above the fold", definition: "The part of a webpage visible without scrolling. The most important content must appear here because most visitors never scroll." },
        { term: "Link-in-bio", definition: "A single URL in a social media profile that links to a hub page aggregating multiple links, products, and social profiles." },
        { term: "Social proof", definition: "Evidence that other people trust your business — testimonials, follower counts, reviews, or press mentions." },
        { term: "CTA (Call to Action)", definition: "The one primary action you want a website visitor to take — typically a prominently displayed button." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("entrepreneurship-landing-page")
      .set(lesson);
    console.log('✅ Lesson "Landing Pages and Link-in-Bio" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-landing-page");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
