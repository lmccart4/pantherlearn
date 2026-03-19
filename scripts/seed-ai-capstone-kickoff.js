// seed-ai-capstone-kickoff.js
// Seeds the AI Literacy Capstone Kickoff lesson to all 4 sections.
// After seeding: set `order` and `visible: true` in the LessonEditor when ready to publish.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Capstone Project Kickoff: Choose Your Track",
  course: "AI Literacy",
  unit: "Semester Capstone",
  questionOfTheDay: "You've spent a whole semester studying AI — now what do YOU want to say about it?",
  order: 41,
  visible: false,
  dueDate: null,
  blocks: [

    // ── WELCOME ──────────────────────────────────────────────────────────────
    {
      id: "section-welcome",
      type: "section_header",
      title: "Welcome to the Capstone",
      subtitle: "~5 min",
      icon: "🚀"
    },
    {
      id: "objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Understand the capstone project structure, timeline, and expectations",
        "Explore all four capstone tracks and identify which fits your strengths",
        "Write a capstone proposal that includes your track, topic, and plan"
      ]
    },
    {
      id: "text-welcome-intro",
      type: "text",
      content: "This is it — the big one.\n\nFor the next **5 weeks** (April 7 → May 9), you're going to build something real. Not a worksheet. Not a quiz. A project that shows what you actually think about AI.\n\nYou've spent an entire semester learning about how AI works, how it creates, how it deceives, and how it shapes society. Now it's your turn to **make something** with that knowledge."
    },
    {
      id: "callout-timeline",
      type: "callout",
      style: "info",
      icon: "📅",
      content: "**Capstone Timeline**\n\n- **Week 7 (this week):** Choose your track + submit your proposal\n- **Week 8:** Deep work + peer review\n- **Week 9:** Revise based on feedback + polish\n- **Week 10:** Presentations begin (half the class)\n- **Week 11:** Remaining presentations + self-reflection\n\nYour final project is worth **100 points**. Presentations are scored separately (15 points)."
    },
    {
      id: "callout-no-wrong-track",
      type: "callout",
      style: "tip",
      icon: "💡",
      content: "**There is no wrong track.** Every option is designed so you can earn full credit regardless of your skill set. Pick the one that sounds most interesting to YOU — not the one you think is \"easiest.\""
    },

    // ── THE FOUR TRACKS ──────────────────────────────────────────────────────
    {
      id: "section-tracks",
      type: "section_header",
      title: "The Four Tracks",
      subtitle: "~10 min — read carefully",
      icon: "🛤️"
    },
    {
      id: "text-track-overview",
      type: "text",
      content: "Every student picks **one track**. Each track produces a different kind of final product, but they're all graded on the same 100-point scale. Read through all four before deciding."
    },
    {
      id: "callout-track-research",
      type: "callout",
      style: "info",
      icon: "📝",
      content: "**Track 1: Research Paper**\n\n**What you'll create:** A 3–5 page thesis-driven research paper on an AI topic of your choice.\n\n**What's expected:**\n- A clear, specific thesis (not just \"AI is important\")\n- 4+ credible sources with proper citations\n- Analysis that goes beyond describing what AI does — explain why it matters\n- Organized intro → body → conclusion structure\n\n**This track is for you if:** You like writing, you have strong opinions, or you want to dive deep into one AI issue. If you enjoy building an argument with evidence, this is your track."
    },
    {
      id: "callout-track-design",
      type: "callout",
      style: "info",
      icon: "🎨",
      content: "**Track 2: Design Prototype**\n\n**What you'll create:** An AI-powered solution to a real problem — delivered as a wireframe, mockup, or working demo.\n\n**What's expected:**\n- A clear problem statement (who has this problem? why does it matter?)\n- User research (interviews, surveys, or observations — at least 2 sources)\n- A prototype detailed enough to show how someone would actually use it\n- A written reflection on your design choices and ethical considerations\n\n**This track is for you if:** You like solving problems, building things, or thinking about how technology should work. You don't need to know how to code — wireframes and mockups count."
    },
    {
      id: "callout-track-debate",
      type: "callout",
      style: "info",
      icon: "⚖️",
      content: "**Track 3: Formal Debate**\n\n**What you'll create:** A full debate preparation packet + a live debate performance in class.\n\n**What's expected:**\n- A 2+ page research brief covering BOTH sides of your issue\n- A written opening statement (2–3 min)\n- Rebuttal notes organized by likely opponent arguments\n- A closing statement + source list\n- Live performance: opening, rebuttals, and closing\n\n**This track is for you if:** You like arguing (in a good way), you're comfortable speaking in front of people, or you want to tackle a controversial AI topic head-on. You'll be paired with an opponent."
    },
    {
      id: "callout-track-creative",
      type: "callout",
      style: "info",
      icon: "🎬",
      content: "**Track 4: Creative Work**\n\n**What you'll create:** An AI-themed creative project — a short film, artwork, short story, game, podcast episode, or another medium you propose.\n\n**What's expected:**\n- A 1-page artist statement explaining your creative vision and AI theme\n- The creative piece itself (polished, not a rough draft)\n- A written reflection on your process and what you learned\n- AI must be *central* to the work, not just a backdrop\n\n**This track is for you if:** You're a creative person who wants to express ideas through art, storytelling, or media. You'll be graded on effort, craft, and how deeply you engage with AI themes — not on being a professional filmmaker or artist."
    },

    // ── TRACK SELECTION QUIZ ─────────────────────────────────────────────────
    {
      id: "section-quiz",
      type: "section_header",
      title: "Which Track Fits You?",
      subtitle: "~3 min — quick self-assessment",
      icon: "🧭"
    },
    {
      id: "text-quiz-intro",
      type: "text",
      content: "Not sure which track to pick? Answer these honestly — there are no wrong answers. Your responses might point you toward a track you hadn't considered."
    },
    {
      id: "mc-quiz-fun",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of these sounds most fun to you?",
      options: [
        "Researching a topic until I know it inside and out, then writing about it",
        "Designing something that solves a real problem people actually have",
        "Going head-to-head with someone in an argument where I have to think on my feet",
        "Making something creative — a video, a story, art, a podcast, a game"
      ],
      allCorrect: true,
      explanation: "There's no wrong answer! Research → Track 1, Design → Track 2, Debate → Track 3, Creative → Track 4. But don't feel locked in — these are just starting points."
    },
    {
      id: "mc-quiz-strength",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What's your strongest skill?",
      options: [
        "Writing — I can explain complex ideas clearly on paper",
        "Problem-solving — I like figuring out how things should work",
        "Speaking — I'm good at thinking on my feet and persuading people",
        "Creating — I express ideas best through art, video, music, or storytelling"
      ],
      allCorrect: true,
      explanation: "Play to your strengths! But also consider — the capstone is a chance to challenge yourself. Picking a track that stretches you a little can lead to your best work."
    },
    {
      id: "mc-quiz-saturday",
      type: "question",
      questionType: "multiple_choice",
      prompt: "It's Saturday afternoon and you have nothing to do. You'd probably:",
      options: [
        "Fall into a Wikipedia rabbit hole about something random",
        "Sketch out an idea for an app or product you wish existed",
        "Get into a debate with someone about something you care about",
        "Work on a creative project — draw, write, film, build something"
      ],
      allCorrect: true,
      explanation: "What you do when nobody's watching often reveals what track will feel the most natural."
    },

    // ── EXAMPLE TOPICS ───────────────────────────────────────────────────────
    {
      id: "section-examples",
      type: "section_header",
      title: "Example Topics",
      subtitle: "Inspiration, not a limit",
      icon: "💭"
    },
    {
      id: "callout-examples",
      type: "callout",
      style: "tip",
      icon: "🔥",
      content: "**Research Paper Ideas:**\n- Should schools ban AI-generated homework? (policy analysis)\n- How AI deepfakes are changing elections (investigation)\n- The environmental cost of training large AI models (data-driven)\n- AI in criminal justice: do algorithms belong in courtrooms?\n\n**Design Prototype Ideas:**\n- An AI tutor that adapts to how you learn (education)\n- A deepfake detection tool for social media (trust/safety)\n- An AI assistant for students with disabilities (accessibility)\n- A neighborhood safety app that uses AI without surveillance (ethics + design)\n\n**Debate Topics:**\n- \"AI-generated art should be eligible for awards and competitions\"\n- \"Schools should require AI literacy as a graduation requirement\"\n- \"Companies should be legally liable when their AI causes harm\"\n- \"AI should never be used in hiring decisions\"\n\n**Creative Work Ideas:**\n- A short film about a student whose AI tutor knows them too well (thriller)\n- A podcast episode interviewing classmates about their AI fears and hopes\n- An illustrated zine about AI bias told through personal stories\n- A choose-your-own-adventure game about navigating AI ethics dilemmas"
    },
    {
      id: "text-examples-note",
      type: "text",
      content: "These are just starting points. You can pick one of these or come up with your own. The only rule: **your topic must connect to AI in a meaningful way.** \"AI is cool\" isn't a topic. \"AI is changing how doctors diagnose cancer and here's why that's complicated\" — that's a topic."
    },

    // ── PROPOSAL INSTRUCTIONS ────────────────────────────────────────────────
    {
      id: "section-proposal",
      type: "section_header",
      title: "Your Capstone Proposal",
      subtitle: "~10 min — due by Friday",
      icon: "📋"
    },
    {
      id: "text-proposal-instructions",
      type: "text",
      content: "Before you start building, you need to tell me what you're building and why.\n\nYour **capstone proposal** is due by **Friday**. It doesn't need to be long — just clear. Here's what to include:\n\n1. **Track:** Which of the 4 tracks are you choosing?\n2. **Topic:** What specific AI topic or question will you focus on?\n3. **Plan:** In 2–3 sentences, describe what your final product will look like.\n4. **Why it matters:** One sentence on why this topic is interesting or important to you.\n\nI'll review proposals over the weekend and give you feedback on Monday. If your topic needs to be narrowed, expanded, or redirected, I'll let you know before you go too deep."
    },
    {
      id: "callout-proposal-tip",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Common proposal mistakes to avoid:**\n\n- Topic is too broad: \"AI in healthcare\" → narrow it to \"AI misdiagnosis rates in emergency rooms\"\n- Topic is too vague: \"AI and society\" → pick a specific angle like \"how AI hiring tools affect minority applicants\"\n- No real plan: \"I'll make something about AI\" → describe the actual deliverable: \"a 4-page paper arguing that AI art should be copyrightable\"\n- Picking a track because it seems easy: the tracks are equally challenging in different ways. Pick what excites you."
    },
    {
      id: "sa-proposal",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your capstone proposal. Include: (1) Which track you're choosing, (2) Your specific topic, (3) A 2–3 sentence plan for what you'll create, (4) Why this topic matters to you.",
      placeholder: "Track: [Research / Design / Debate / Creative]\nTopic: ...\nPlan: ...\nWhy it matters: ..."
    },

    // ── EXIT TICKET ──────────────────────────────────────────────────────────
    {
      id: "section-exit",
      type: "section_header",
      title: "Exit Ticket",
      subtitle: "~1 min",
      icon: "🎯"
    },
    {
      id: "mc-exit-track",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which track are you leaning toward right now?",
      options: [
        "Research Paper — I want to investigate and write",
        "Design Prototype — I want to build a solution",
        "Formal Debate — I want to argue my case live",
        "Creative Work — I want to make something original"
      ],
      allCorrect: true,
      explanation: "Noted! If you haven't submitted your proposal yet, make sure to do that before Friday. You can still change your mind — the proposal is your chance to commit."
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "AI Literacy P4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "AI Literacy P5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "AI Literacy P7" },
    { courseId: "fUw67wFhAtobWFhjwvZ5", label: "AI Literacy P9" },
  ];
  const lessonId = "capstone-kickoff";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId)
      .collection("lessons").doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length}`);
  console.log(`   ⚠️  visible: false — open LessonEditor to set order and publish.`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
