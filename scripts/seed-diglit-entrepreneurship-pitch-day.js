// seed-diglit-entrepreneurship-pitch-day.js
// Creates "Pitch Day + Unit Wrap-Up" (Dig Lit, Unit 6, Lesson 41)
// Run: node scripts/seed-diglit-entrepreneurship-pitch-day.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Pitch Day + Unit Wrap-Up",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 41,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🚀",
      title: "Today: Pitch Day",
      subtitle: "~2 minutes"
    },
    {
      id: "b-intro",
      type: "text",
      content: "This is it. Six lessons of work — niche, value proposition, brand, revenue model, landing page, marketing plan — all delivered in 3 minutes.\n\nYou've practiced. You know your business. You know your audience. You know your pitch.\n\nWhen it's your turn: connect to the projector, take a breath, and go."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you actually launched this business tomorrow — what would be your very first step?"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Deliver a polished 3-minute business pitch to the class",
        "Evaluate peer pitches using specific, structured criteria",
        "Reflect on what you learned about entrepreneurship and your own capabilities"
      ]
    },

    {
      id: "section-pitches",
      type: "section_header",
      icon: "🎤",
      title: "The Pitches",
      subtitle: "~30 minutes"
    },
    {
      id: "b-pitch-format",
      type: "text",
      content: "**Format:**\n- 3 minutes per pitch — at 3:00, you stop. No exceptions. This is a real skill.\n- Present to the class using the projector or screen share\n- After each pitch: 30 seconds for class to complete the voting form\n\n**Voting form scores each pitch on:**\n- Clarity of the business concept (1-5)\n- Quality of pitch delivery — confidence, eye contact, not reading slides (1-5)\n- Would you be a customer? (Yes / No)\n- One word to describe the brand"
    },
    {
      id: "q-audience-scoring",
      type: "question",
      questionType: "short_answer",
      prompt: "As you watch pitches, note your top 2 across these categories:\n\n- Most convincing Problem slide (made you feel the problem):\n- Clearest value proposition (you immediately understood what they do):\n- Best brand (the visual identity felt cohesive and professional):",
      placeholder: "Best Problem slide: ...\nClearest value prop: ...\nBest brand: ...",
      difficulty: "evaluate"
    },

    {
      id: "section-reflection",
      type: "section_header",
      icon: "📝",
      title: "Unit Reflection",
      subtitle: "~10 minutes"
    },
    {
      id: "b-reflection-intro",
      type: "text",
      content: "Individual, written, quiet. This is your chance to capture what this unit actually changed — not what you're supposed to say, but what you actually think."
    },
    {
      id: "q-reflect-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Reflection 1: What surprised you most about how online businesses actually work? Was there anything you assumed was true that turned out to be wrong?",
      placeholder: "What surprised me: ...",
      difficulty: "reflect"
    },
    {
      id: "q-reflect-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Reflection 2: If you were going to actually pursue a digital business — yours from this unit or someone else's you heard today — which one and why? What would your first three steps be?",
      placeholder: "Business I'd pursue: ...\nFirst 3 steps: 1. ... 2. ... 3. ...",
      difficulty: "reflect"
    },
    {
      id: "q-reflect-3",
      type: "question",
      questionType: "short_answer",
      prompt: "Reflection 3: Which skill from this unit — niching down, branding, pitching, marketing strategy, or revenue planning — do you think will be most useful to you in the future? Why that one, even if you never start a business?",
      placeholder: "Most useful skill: ... because...",
      difficulty: "reflect"
    },
    {
      id: "q-reflect-4",
      type: "question",
      questionType: "short_answer",
      prompt: "Reflection 4: What's one thing you'd do differently if you could redo your pitch? Not the business idea — the delivery or the slides.",
      placeholder: "I'd change: ...",
      difficulty: "reflect"
    },

    {
      id: "section-bridge",
      type: "section_header",
      icon: "🌟",
      title: "What's Next",
      subtitle: "~5 minutes"
    },
    {
      id: "b-bridge",
      type: "text",
      content: "You can create content. You can build a brand. You can pitch an idea.\n\n**Next unit: The Algorithm Economy.**\n\nYou've been creating content and thinking like a creator. Now we're going to flip it: how do the platforms decide what you see? Who controls your feed? What are algorithms actually doing to your attention, your beliefs, and your opportunities?\n\nYou've learned how to use these systems. Time to understand how they use you."
    },
    {
      id: "callout-bridge",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Optional challenge:** Take the first step on your business idea tonight. Not a big step — just the first one. Create the Carrd page. Post one piece of content. Register the account name. The business you pitched today could be real if you just start."
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("entrepreneurship-pitch-day")
      .set(lesson);
    console.log('✅ Lesson "Pitch Day + Unit Wrap-Up" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-pitch-day");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
