// seed-diglit-content-creation-calendar.js
// Creates "Content Planning — Building a Content Calendar" (Dig Lit, Unit 5, Lesson 29)
// Run: node scripts/seed-diglit-content-creation-calendar.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Content Planning — Building a Content Calendar",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 29,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "📅",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "The most common reason people quit creating content is not running out of ideas — it's running out of *organized* ideas at the moment they need them.\n\nThe solution every professional creator uses is a **content calendar**: a planned schedule of what to post, when, and on which platform.\n\nCreators who post 3-5 times per week grow 2-3x faster than those who post randomly. But more importantly — they don't burn out, because they're not inventing new ideas every single day."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why do successful creators post on a schedule instead of whenever they feel like it?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Have you ever tried to post consistently — on any platform — and given up? What made it hard to keep going?",
      placeholder: "My experience with consistency: ...",
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
        "Explain why consistent posting matters more than viral moments",
        "Define content pillars and use them to generate a week of content ideas",
        "Build a 1-week content calendar with varied content types"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "Content Pillars + The Calendar System",
      subtitle: "~15 minutes"
    },
    {
      id: "b-pillars",
      type: "text",
      content: "**Content pillars** are 3-5 recurring categories that all your content falls into. They solve the \"what do I post today?\" problem.\n\nEvery piece of content maps to a pillar. You cycle through them. You never run out.\n\n**Examples:**\n\n*Fitness creator pillars:*\n- Workouts (the how)\n- Nutrition tips (the fuel)\n- Mindset/motivation (the why)\n- Behind-the-scenes (the person)\n\n*Gaming creator pillars:*\n- Gameplay highlights (entertainment)\n- Strategy breakdowns (education)\n- Game reviews (opinion)\n- Gaming culture/memes (community)\n\n*School club pillars:*\n- Upcoming events (inform)\n- Member spotlights (community)\n- Tips and resources (value)\n- Fun facts (engagement)"
    },
    {
      id: "callout-pillars",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Why pillars work:** They keep your content varied (so your audience doesn't get bored seeing the same type every day) while keeping it focused (so new followers immediately understand what your account is about). A creator with 4 clear pillars can generate months of content ideas in one planning session."
    },
    {
      id: "b-calendar",
      type: "text",
      content: "**The Content Calendar**\n\nA content calendar maps out:\n- Which day you're posting\n- Which platform it goes on\n- Which pillar it comes from\n- What type of content it is (video, image, carousel, story, text)\n- A brief description of the specific idea\n\nIt doesn't have to be complex. A Google Sheet with 5 columns is enough.\n\n| Day | Platform | Pillar | Type | Description |\n|-----|----------|--------|------|-------------|\n| Monday | Instagram | Education | Infographic | 3 sleep facts for students |\n| Tuesday | TikTok | Entertainment | Short video | Day in my life — school edition |\n| Wednesday | Instagram | Community | Story | Q&A: what's your favorite class? |\n| Thursday | YouTube | Education | Long video | How to study for finals: my system |\n| Friday | All | Personality | Post | Friday check-in — what happened this week |"
    },
    {
      id: "q-pillars-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A food creator posts: Monday — a recipe video, Tuesday — a restaurant review, Wednesday — a cooking mistake (funny), Thursday — a recipe video, Friday — a recipe video. What's the main problem with their content strategy?",
      options: [
        "They're posting too frequently",
        "Three out of five posts are the same type — no pillar variety",
        "They should only post on one platform",
        "Restaurant reviews don't belong on a food account"
      ],
      correctIndex: 1,
      explanation: "Three recipe videos in one week means the account is heavy on one pillar and light on others. The audience sees the same thing repeatedly and engagement drops. A balanced pillar strategy would mix in education, entertainment, community, and personality — not just recipes three times a week.",
      difficulty: "analyze"
    },
    {
      id: "q-calendar-advantage",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which is the biggest advantage of planning content a week in advance instead of deciding what to post day-of?",
      options: [
        "The algorithm rewards posts made in advance",
        "You can ensure variety across pillars and avoid creative blocks when you're busy",
        "Pre-planned content always gets more engagement",
        "It's required by most platform terms of service"
      ],
      correctIndex: 1,
      explanation: "Planning ahead lets you see your week as a whole — making sure you hit different pillars, different formats, and different platforms. Day-of posting means you create under pressure, which usually produces the easiest/laziest content. Algorithms don't actually know or care when you decided what to post.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // BUILD YOUR CALENDAR
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Build Your 1-Week Calendar",
      subtitle: "~15 minutes"
    },
    {
      id: "b-build-intro",
      type: "text",
      content: "Using your audience profile topic, you'll define your pillars and build a 1-week content calendar.\n\n**Requirements:**\n- At least 5 posts across the week\n- At least 2 different platforms\n- At least 3 different pillars represented\n- Mix of content types (at least 3 different: image, video, text/story, carousel)\n\nUse Google Sheets or the provided template. Your teacher will share the link."
    },
    {
      id: "q-define-pillars",
      type: "question",
      questionType: "short_answer",
      prompt: "Define 3-4 content pillars for your topic. For each pillar, give it a name and one example post idea.\n\nPillar 1: [name] — Example: ...\nPillar 2: [name] — Example: ...\nPillar 3: [name] — Example: ...\nPillar 4 (optional): [name] — Example: ...",
      placeholder: "Pillar 1: ...\nPillar 2: ...\nPillar 3: ...",
      difficulty: "create"
    },
    {
      id: "q-build-calendar",
      type: "question",
      questionType: "short_answer",
      prompt: "Fill out your 1-week content calendar. For each post, include: Day | Platform | Pillar | Type | Brief description\n\n(5 posts minimum)",
      placeholder: "Monday: ...\nTuesday: ...\nWednesday: ...\nThursday: ...\nFriday: ...\n[Saturday/Sunday optional]: ...",
      difficulty: "create"
    },
    {
      id: "q-hardest-day",
      type: "question",
      questionType: "short_answer",
      prompt: "Reflection: Which day on your calendar would be the hardest to actually create? Why? What skill, tool, or resource would you need to make it happen?",
      placeholder: "The hardest day is [day] because...\nTo make it happen, I'd need...",
      difficulty: "reflect"
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
      content: "Consistency beats virality. One viral post doesn't build an audience — showing up predictably does.\n\nYour content calendar is a tool for that consistency. It forces you to think in advance, balance your pillars, and see the week as a whole instead of one post at a time.\n\n**Up next:** Lesson 30 — Production Day. You'll choose one piece from your content calendar and actually produce it. Everything from this unit — audience, hook, hierarchy, writing — goes into it."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Why do content pillars prevent burnout? What's the difference between a creator with clear pillars and one without them, when it's 9 PM and they still haven't posted today?",
      placeholder: "Pillars prevent burnout because...\nA creator with pillars vs. without: ...",
      difficulty: "apply"
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
        { term: "Content pillars", definition: "3-5 recurring categories that define what a creator posts about — used to ensure variety and prevent creative burnout." },
        { term: "Content calendar", definition: "A schedule mapping out what content to post, when, on which platform, and from which pillar." },
        { term: "Posting cadence", definition: "How frequently a creator posts — their regular schedule. Consistent cadence builds audience expectations and algorithm favor." },
        { term: "Content mix", definition: "The variety of content types (video, image, text, story, carousel) across a posting schedule — prevents audience fatigue." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-calendar")
      .set(lesson);
    console.log('✅ Lesson "Content Planning — Building a Content Calendar" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-calendar");
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
