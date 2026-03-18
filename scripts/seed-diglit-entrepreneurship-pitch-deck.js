// seed-diglit-entrepreneurship-pitch-deck.js
// Creates "The Pitch — Building a Business Pitch Deck" (Dig Lit, Unit 6, Lesson 39)
// Run: node scripts/seed-diglit-entrepreneurship-pitch-deck.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "The Pitch — Building a Business Pitch Deck",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 39,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎤",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Investors on Shark Tank say they fund *people*, not ideas. They've heard thousands of business ideas — most of them are fine. What they're really evaluating is: does this person believe in this? Can they execute? Do they understand the business?\n\nYour pitch isn't just presenting slides. It's convincing someone that you know what you're talking about — and that this is worth their attention.\n\nYou have 3 minutes. That's it."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why do investors say they fund people, not ideas — and what does that mean for your pitch?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "If you had 3 minutes to convince someone to invest in or support your business — what are the most important things they need to know? List the top 4.",
      placeholder: "1. ...\n2. ...\n3. ...\n4. ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify the 7-slide structure of a business pitch deck",
        "Apply design principles from Unit 5 to pitch deck slides",
        "Draft all 7 slides using your unit work as source material"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "📊",
      title: "The 7-Slide Pitch Structure",
      subtitle: "~15 minutes"
    },
    {
      id: "b-pitch-structure",
      type: "text",
      content: "Every effective pitch — from Shark Tank to actual startup funding — covers these 7 things:\n\n| Slide | What It Covers | Time |\n|-------|---------------|------|\n| **1. Title** | Business name, logo, your name, one-liner value proposition | 5 sec |\n| **2. The Problem** | What problem does your audience have? Make them FEEL it. | 30 sec |\n| **3. The Solution** | Your product/service. How it solves the problem. | 30 sec |\n| **4. The Audience** | Who is this for? Be specific — your niche statement. | 20 sec |\n| **5. The Business Model** | How you make money. Revenue model + projections. | 30 sec |\n| **6. The Marketing Plan** | How people find you. Key strategies. | 20 sec |\n| **7. The Ask** | What you want from this audience. For this project: \"Follow us\" or \"Check out our page\" | 10 sec |\n\nTotal: ~3 minutes."
    },
    {
      id: "b-slide-design",
      type: "text",
      content: "**Pitch deck design rules:**\n\n- **Max 5 words per bullet.** Your slides are visual aids — YOU are the presentation. The audience should be listening to you, not reading a paragraph.\n- **One idea per slide.** If you have 3 things to say, use 3 slides.\n- **Your brand colors and logo on every slide.** Consistency signals professionalism.\n- **No walls of text. Ever.** If you're reading the slide word-for-word, the slide has too much text.\n- **Big visuals > small text.** A photo, icon, or bold number tells a story faster than a sentence."
    },
    {
      id: "callout-problem-slide",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The Problem slide is the most important.** If your audience doesn't feel the problem, they won't care about the solution. Make it real and specific.\n\nWeak: *'Many students struggle with math.'*\nStrong: *'Every Sunday night, 40% of high school freshmen stare at their math homework for an hour and don't start — not because they're lazy, but because they don't know where to begin.'*\n\nThe second version makes the audience nod. That's your goal."
    },
    {
      id: "q-problem-slide",
      type: "question",
      questionType: "short_answer",
      prompt: "Write the content for your Problem slide. Make it specific and vivid — describe the moment your target audience feels the problem most acutely. Max 3 bullet points or a short paragraph.",
      placeholder: "The problem my audience faces: ...\n(Make them feel it)",
      difficulty: "create"
    },
    {
      id: "q-slide-design",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student's slide 5 (Business Model) says: 'I will make money by selling digital study guide templates through Etsy. Each template costs $8. I expect to sell approximately 20-30 units per month based on similar products in the marketplace, which would generate $160-$240 in monthly revenue. I will reinvest 20% into advertising.' How should this be redesigned?",
      options: [
        "This is exactly right — more detail is better for a pitch",
        "Cut it to the essential numbers: Price ($8) + Volume (~25/month) + Revenue (~$200/month). Speak the explanation.",
        "Remove all numbers and just describe the model in words",
        "Add more text explaining how Etsy works"
      ],
      correctIndex: 1,
      explanation: "The slide should show: '$8 per template | ~25 sales/month | ~$200/month' — three bold numbers that the audience can absorb instantly. The explanation of how and why comes from the presenter's voice, not the slide. Slides are signposts, not scripts.",
      difficulty: "apply"
    },

    {
      id: "section-practice",
      type: "section_header",
      icon: "🏗️",
      title: "Build Your Pitch Deck",
      subtitle: "~20 minutes"
    },
    {
      id: "b-build-intro",
      type: "text",
      content: "Open Google Slides or Canva Presentations. Build all 7 slides today.\n\n**Your source material is everything you've built this unit:**\n- Niche statement + audience profile → Slides 2, 4\n- Value proposition → Slides 1, 3\n- Brand identity kit → All slides (colors, logo, fonts)\n- Revenue plan → Slide 5\n- Marketing plan → Slide 6\n- Landing page URL → Slide 7\n\n**Today's goal: content on all 7 slides.** Tomorrow you'll polish design and practice delivery."
    },
    {
      id: "q-slide-checklist",
      type: "question",
      questionType: "short_answer",
      prompt: "Work through all 7 slides. After completing each one, check it off:\n\n☐ Slide 1: Title (name, logo, one-liner)\n☐ Slide 2: The Problem (specific + vivid)\n☐ Slide 3: The Solution (clear + connected to the problem)\n☐ Slide 4: The Audience (niche statement + who they are)\n☐ Slide 5: Revenue Model (model + numbers)\n☐ Slide 6: Marketing Plan (top 2 strategies)\n☐ Slide 7: The Ask (what you want the audience to do)\n\nHow many slides have content on them right now?",
      placeholder: "Slides completed: ...\nAny I'm stuck on: ...",
      difficulty: "create"
    },
    {
      id: "q-design-check",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at one of your slides and apply the 5-word rule: does any bullet point have more than 5 words? If yes — cut it down. What did you have to cut, and what did you say instead?",
      placeholder: "Original text: ...\nCut to: ...",
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
      content: "Your pitch deck is the culmination of this entire unit. Every lesson — niche, value prop, branding, revenue, marketing — becomes one slide.\n\nThe structure isn't arbitrary. It tells a story: there's a problem → here's the solution → here's who it's for → here's how it makes money → here's how people find it → here's what you should do.\n\n**Up next:** Lesson 40 — Pitch Practice + Polish. You'll rehearse your pitch with classmates, get feedback, and refine before Pitch Day."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Which slide do you feel LEAST confident about right now? What specifically makes it feel incomplete or weak?",
      placeholder: "Weakest slide: Slide [#] because...\nTo fix it: ...",
      difficulty: "evaluate"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("entrepreneurship-pitch-deck")
      .set(lesson);
    console.log('✅ Lesson "The Pitch — Building a Pitch Deck" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-pitch-deck");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
