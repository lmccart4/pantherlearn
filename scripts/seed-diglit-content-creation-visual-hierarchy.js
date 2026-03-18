// seed-diglit-content-creation-visual-hierarchy.js
// Creates "Visual Hierarchy — Designing Content That Guides the Eye" (Dig Lit, Unit 5, Lesson 24)
// Run: node scripts/seed-diglit-content-creation-visual-hierarchy.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Visual Hierarchy — Designing Content That Guides the Eye",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 24,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "👁️",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Have you ever looked at a poster or website and had no idea what it was actually about — because everything was fighting for your attention at the same time?\n\nThat's a **visual hierarchy failure**. The designer put everything at the same volume, and your eye had nowhere to start.\n\nGood design is a conversation between the designer and the viewer's eyes. The designer decides what you see first, second, and third — without saying a word."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** When you look at a poster or a website, what do your eyes look at first — and why?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of a design you've seen recently — a poster, app screen, social media post, or website. What was the first thing you noticed? Do you think that's what the designer intended?",
      placeholder: "Describe the design and what your eye went to first...",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define visual hierarchy and explain why it matters in content design",
        "Apply the 4 key levers: size, color, contrast, and spacing",
        "Use the squint test to evaluate a design's hierarchy",
        "Redesign a cluttered layout using visual hierarchy principles"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📐",
      title: "The 4 Levers of Visual Hierarchy",
      subtitle: "~15 minutes"
    },
    {
      id: "b-hierarchy-intro",
      type: "text",
      content: "**Visual hierarchy** is the arrangement of design elements in order of importance. It tells the viewer's eye where to look first, second, and third — without them even noticing you're doing it.\n\nProfessional designers use 4 main levers:"
    },
    {
      id: "b-four-levers",
      type: "text",
      content: "**1. Size**\nBigger = more important. This is universal and instinctive. Headlines should be bigger than subheadings. Subheadings should be bigger than body text.\n> *If everything is the same size, nothing stands out.*\n\n**2. Color**\nBright or contrasting colors draw the eye first. Use them sparingly — if everything is bright, nothing is.\n> *One pop of color in a neutral design will always get attention first.*\n\n**3. Contrast**\nHigh contrast (light on dark, or dark on light) creates visual focal points. Low contrast recedes into the background.\n> *The highest contrast element on the page is always what your eye finds first.*\n\n**4. Spacing**\nWhite space (empty space) isn't wasted — it's a signal. Elements with more space around them feel more important. Crowded elements feel less important.\n> *The most important thing on the page should breathe. Give it room.*"
    },
    {
      id: "callout-squint",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The Squint Test:** Squint your eyes until the design blurs. Whatever you can still see and read is what stands out most — that's your current hierarchy. If it's the wrong thing, your hierarchy needs fixing.\n\nThis is a real technique used by professional designers."
    },
    {
      id: "q-lever-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A flyer for a school event has the event name in size 12 font and the date in size 36 font. What does this communicate to the viewer?",
      options: [
        "The event name is more important than the date",
        "The date is more important than the event name",
        "Both pieces of information are equally important",
        "The flyer has no visual hierarchy"
      ],
      correctIndex: 1,
      explanation: "Size communicates importance. The bigger element (size 36 date) will catch the viewer's eye first, making it feel like the most important piece of information — even if the designer didn't intend that. A well-designed flyer would have the event name largest, then the date.",
      difficulty: "understand"
    },
    {
      id: "q-lever-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're designing an Instagram post. It has a gray background with gray text and one small bright red button. Where will the viewer's eye go first?",
      options: [
        "The text, because it has the most information",
        "The background, because it takes up the most space",
        "The red button, because it has the highest contrast against the gray",
        "It depends on the viewer's preferences"
      ],
      correctIndex: 2,
      explanation: "Color contrast always wins. A single high-contrast element (bright red against gray) will pull the eye immediately, regardless of the size of other elements. This is why call-to-action buttons are often bright colors — designers are intentionally using contrast to create hierarchy.",
      difficulty: "apply"
    },
    {
      id: "q-squint",
      type: "question",
      questionType: "short_answer",
      prompt: "You squint at your design and the first thing you see is a decorative border — not your headline. What does this tell you, and what lever would you use to fix it?",
      placeholder: "This tells me... I would fix it by...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // REDESIGN CHALLENGE
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Redesign Challenge",
      subtitle: "~15 minutes"
    },
    {
      id: "b-redesign-intro",
      type: "text",
      content: "For this activity, you'll redesign a piece of content with broken hierarchy. Your teacher will share a \"bad\" flyer in Canva — same content, but everything is the same size, same color, cluttered spacing.\n\nYour job: redesign it using the 4 levers so the hierarchy is clear.\n\n**Requirements:**\n- Headline clearly dominates (biggest or highest contrast element)\n- One accent color used intentionally — not everywhere\n- Adequate white space around the most important elements\n- Information in a logical reading order (most important → least important)"
    },
    {
      id: "q-redesign-plan",
      type: "question",
      questionType: "short_answer",
      prompt: "Before you open Canva, write your redesign plan. Answer:\n1. What is the most important piece of information on this flyer?\n2. Which lever will you use to make it stand out? (size, color, contrast, or spacing — pick one primary)\n3. What will you do to the least important information?",
      placeholder: "Most important: ...\nI'll use [lever] to make it stand out by...\nLeast important info will be...",
      difficulty: "plan"
    },
    {
      id: "q-redesign-reflect",
      type: "question",
      questionType: "short_answer",
      prompt: "After redesigning: Apply the squint test to your new version. What do you see first? Does your redesign hierarchy match your intention?",
      placeholder: "When I squint, I see... This [does/does not] match my intention because...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
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
      content: "Visual hierarchy is what separates intentional design from accidental design.\n\nYou now know the 4 levers: **size, color, contrast, and spacing**. And you have a tool to test your designs — the squint test.\n\nEvery piece of content you make from now on should have a clear answer to: *Where does the eye go first? Is that what I want?*\n\n**Up next:** Lesson 25 — Infographics. You'll take data and turn it into a visual story using everything you just learned about hierarchy."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Pick one social media post you've seen recently (a brand, creator, or friend). Apply the squint test mentally — what do you see first? Was that intentional? What lever did the designer use to make it stand out?",
      placeholder: "Post: ...\nFirst thing I see: ...\nLever used: ...\nIntentional? ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
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
        { term: "Visual hierarchy", definition: "The arrangement of design elements in order of importance, guiding the viewer's eye in a specific sequence." },
        { term: "Contrast", definition: "The difference between design elements (light vs. dark, large vs. small) that creates visual focal points." },
        { term: "White space", definition: "Empty space in a design that makes important elements stand out and gives the eye room to rest." },
        { term: "Squint test", definition: "A design evaluation technique: squint at your design until it blurs — whatever you can still see is what stands out most in your hierarchy." },
        { term: "Focal point", definition: "The element in a design that draws the eye first, created intentionally through size, color, contrast, or spacing." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-visual-hierarchy")
      .set(lesson);
    console.log('✅ Lesson "Visual Hierarchy — Designing Content That Guides the Eye" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-visual-hierarchy");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log("   Visible: false");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
