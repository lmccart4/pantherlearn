// seed-diglit-entrepreneurship-pitch-practice.js
// Creates "Pitch Practice + Polish" (Dig Lit, Unit 6, Lesson 40)
// Run: node scripts/seed-diglit-entrepreneurship-pitch-practice.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Pitch Practice + Polish",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 40,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎯",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "**Presentation killers — things that will tank your pitch:**\n\n- Reading directly from your slides word-for-word\n- Talking to the screen instead of your audience\n- Starting with \"Um, so, like...\"\n- Going over time\n- Apologizing for your own idea: *\"This might sound dumb but...\"* or *\"I'm not sure if this is good...\"*\n\nIf you don't believe in your business, nobody else will.\n\nYou've done the work. You have the niche, the brand, the revenue plan. Now you deliver it with confidence."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What's the difference between reading your slides and actually pitching your business?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "In your own words: why does reading slides feel boring to an audience? What's the difference in what the audience experiences when a presenter reads vs. when a presenter speaks?",
      placeholder: "Reading slides feels boring because...\nThe difference is...",
      difficulty: "understand"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Deliver a 3-minute pitch with confidence — not reading from slides",
        "Give actionable feedback on presentation delivery (not just content)",
        "Revise pitch deck and delivery based on peer feedback"
      ]
    },

    {
      id: "section-practice1",
      type: "section_header",
      icon: "🔄",
      title: "Practice Round 1 — Small Groups",
      subtitle: "~15 minutes"
    },
    {
      id: "b-round1-intro",
      type: "text",
      content: "Groups of 3-4 (assigned — not your choice). Each person pitches their business. Timer: **3 minutes, strictly enforced.**\n\nAfter each pitch, group gives feedback using the 5-category form:\n\n| Category | Question |\n|----------|----------|\n| **Clarity** | Could you understand the business in 30 seconds? |\n| **Confidence** | Did they seem like they believed in it? |\n| **Slides** | Were slides visual (not walls of text)? |\n| **Hook** | Did the opening (Problem slide) grab your attention? |\n| **One thing to improve** | Specific and actionable — not 'speak louder' |"
    },
    {
      id: "q-round1-feedback",
      type: "question",
      questionType: "short_answer",
      prompt: "After your first practice pitch, record the feedback your group gave you:\n\n- Clarity: ...\n- Confidence: ...\n- Slides: ...\n- Hook: ...\n- One thing to improve: ...\n\nWhich piece of feedback stings the most? Which is most useful?",
      placeholder: "Clarity: ...\nConfidence: ...\nSlides: ...\nHook: ...\nImprove: ...\nMost useful: ...",
      difficulty: "evaluate"
    },

    {
      id: "section-polish",
      type: "section_header",
      icon: "✨",
      title: "Polish Time",
      subtitle: "~15 minutes"
    },
    {
      id: "b-polish-intro",
      type: "text",
      content: "Use the next 15 minutes to:\n\n1. **Fix your weakest slide** — especially if it has too much text or a weak Problem slide\n2. **Cut text ruthlessly** — if you're reading it off the slide, it needs to go\n3. **Time yourself** — run through the whole pitch out loud. Hit 3 minutes or less.\n4. **Practice your opening** — the first 15 seconds set the tone. Nail that part specifically.\n\nTeacher will circulate. If you're called over for 1-on-1 coaching, that's priority time — use it."
    },
    {
      id: "q-revision-log",
      type: "question",
      questionType: "short_answer",
      prompt: "What did you change during polish time? Be specific about at least 2 revisions you made — to the slides, your delivery, or your opening.",
      placeholder: "Revision 1: ...\nRevision 2: ...",
      difficulty: "reflect"
    },

    {
      id: "section-practice2",
      type: "section_header",
      icon: "🤝",
      title: "Practice Round 2 — Partner",
      subtitle: "~5 minutes"
    },
    {
      id: "b-round2",
      type: "text",
      content: "Find someone who wasn't in your Practice Round 1 group. Deliver your pitch one more time.\n\nPartner gives a single verdict: **\"I'd invest\" / \"I'd follow\" / \"Not yet.\"** — and one sentence explaining why.\n\nYou have 2 minutes each. Go."
    },
    {
      id: "q-round2-verdict",
      type: "question",
      questionType: "short_answer",
      prompt: "What was your partner's verdict? What did they say in their one-sentence explanation? Do you agree with their assessment?",
      placeholder: "Verdict: ...\nExplanation: ...\nDo I agree? ...",
      difficulty: "evaluate"
    },

    {
      id: "section-logistics",
      type: "section_header",
      icon: "📋",
      title: "Pitch Day Logistics",
      subtitle: "~5 minutes"
    },
    {
      id: "b-logistics",
      type: "text",
      content: "**Pitch Day is next class.**\n\n**Format:**\n- 3 minutes per pitch — strict timer. At 3:00, you stop.\n- Connect to projector or screenshare. Know how to do this before tomorrow.\n- Class votes after each pitch on: clarity, delivery, and \"would you be a customer?\"\n\n**Award categories:**\n- Most Likely to Succeed\n- Best Brand\n- Best Pitch Delivery\n- Most Creative Idea\n- People's Choice (highest \"would you be a customer?\" %)\n\n**Tonight:** Run through your pitch one more time at home. Out loud. With a timer. Not in your head — out loud."
    },
    {
      id: "q-prep",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the one thing you're most nervous about for Pitch Day? What's one specific thing you can practice tonight to feel more prepared?",
      placeholder: "Most nervous about: ...\nI'll practice: ...",
      difficulty: "reflect"
    },

    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~2 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "You're ready. The preparation is done — the pitch just needs delivery now.\n\nRemember: every presenter gets nervous. The difference between good and bad presenting isn't the absence of nerves — it's starting anyway.\n\n**Pitch Day tomorrow. Own it.**"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("entrepreneurship-pitch-practice")
      .set(lesson);
    console.log('✅ Lesson "Pitch Practice + Polish" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-pitch-practice");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
