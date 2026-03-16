// seed-final-project-launch.js
// Lesson 27 — Final Project Launch + Work Day
// Students choose a track and begin their capstone project.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Final Project: AI in Our World",
  course: "AI Literacy",
  unit: "Final Project",
  order: 29,
  visible: false,
  blocks: [
    {
      id: "section-intro",
      type: "section_header",
      title: "Final Project Launch",
      subtitle: "~15 minutes",
      icon: "🚀"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Choose a final project track that connects your interests to AI literacy concepts from the semester",
        "Plan a project that demonstrates understanding of how AI works, its limitations, and its societal impact",
        "Begin independent work on a substantive project using skills built throughout the course"
      ]
    },
    {
      id: "intro-text",
      type: "text",
      content: "This is your capstone project for AI Literacy. It's your chance to go deep on something that matters to you — using everything you've learned this semester about how AI works, what it can and can't do, and how it's changing the world.\n\nYou'll choose one of four tracks. Each one has different requirements, but they all demand the same thing: **show that you understand AI, don't just use it.**"
    },
    {
      id: "track-a",
      type: "callout",
      icon: "📝",
      style: "scenario",
      content: "**Track A: Research Paper**\n\nWrite a 500-750 word paper on an AI topic of your choice.\n\n**Requirements:**\n- Clear thesis statement\n- At least 2 specific examples or case studies\n- Explanation of how the AI technology works (not just what it does)\n- Discussion of limitations, risks, or ethical considerations\n- Your own analysis — not just summary\n\n**Topic ideas:** AI in your future career, AI bias in a specific domain, AI and privacy, AI in education, the future of creative AI, AI regulation"
    },
    {
      id: "track-b",
      type: "callout",
      icon: "🎨",
      style: "scenario",
      content: "**Track B: Design Project**\n\nDesign an AI-powered product, tool, or system that solves a real problem.\n\n**Requirements:**\n- Clear problem statement (what problem does your product solve?)\n- Description of how AI would be used (what type of AI, what data it needs)\n- User experience mockup or walkthrough (sketched, digital, or described)\n- Honest assessment of limitations and risks\n- Explanation of how you'd make it fair and ethical\n\n**Ideas:** AI tutor for a specific subject, AI-powered accessibility tool, AI health assistant, AI community safety system"
    },
    {
      id: "track-c",
      type: "callout",
      icon: "🗣️",
      style: "scenario",
      content: "**Track C: Debate Position**\n\nPrepare and present a 3-5 minute argument on a controversial AI topic.\n\n**Requirements:**\n- Clear position (for or against)\n- At least 3 evidence-based arguments\n- Acknowledgment of the strongest counterargument\n- Connection to technical concepts from the course (not just opinion)\n- Persuasive delivery\n\n**Topics:** Should AI-generated art be copyrightable? Should schools ban AI tools? Should facial recognition be used in public spaces? Should there be an AI pause?"
    },
    {
      id: "track-d",
      type: "callout",
      icon: "🎵",
      style: "scenario",
      content: "**Track D: Creative Showcase**\n\nCreate an original creative work that demonstrates AI co-creation AND critical reflection.\n\n**Requirements:**\n- An original creative piece made with AI assistance (music, visual art, writing, or multimedia)\n- A written reflection (250-400 words) explaining:\n  - Your creative vision and process\n  - What AI contributed vs. what you contributed\n  - What you learned about AI as a creative tool\n  - An honest assessment of what feels authentic vs. generic\n- The reflection is as important as the creative piece"
    },

    // ═══════════════════════════════════════════════════════
    // PLANNING
    // ═══════════════════════════════════════════════════════
    {
      id: "section-plan",
      type: "section_header",
      title: "Project Planning",
      subtitle: "~10 minutes",
      icon: "📋"
    },
    {
      id: "plan-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Which track are you choosing (A, B, C, or D)? What specific topic or idea will you focus on?",
      placeholder: "I'm choosing Track _ because... My topic is..."
    },
    {
      id: "plan-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "What AI concepts from this semester will your project connect to? List at least 3.",
      placeholder: "1. ...\n2. ...\n3. ..."
    },
    {
      id: "plan-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "What do you need to research, create, or prepare before the next work day? Make a to-do list.",
      placeholder: "1. ...\n2. ...\n3. ..."
    },
    {
      id: "plan-checklist",
      type: "checklist",
      title: "Project Readiness Checklist",
      items: [
        "I've chosen a track (A, B, C, or D)",
        "I have a specific topic or idea",
        "I know which AI concepts I'll connect to",
        "I have a plan for what to work on during work time",
        "I understand the requirements for my track"
      ]
    },

    // ═══════════════════════════════════════════════════════
    // WORK TIME
    // ═══════════════════════════════════════════════════════
    {
      id: "section-work",
      type: "section_header",
      title: "Work Time",
      subtitle: "~20 minutes",
      icon: "💻"
    },
    {
      id: "work-text",
      type: "text",
      content: "Use the remaining time to begin your project. Your teacher is available for questions."
    },
    {
      id: "work-chatbot",
      type: "chatbot",
      title: "Project Advisor",
      icon: "🎓",
      instructions: "Use this advisor to brainstorm ideas, check if your approach is on track, or get help with research.",
      systemPrompt: "You are a project advisor for a high school AI Literacy final project. Students have 4 tracks: Research Paper, Design Project, Debate Position, or Creative Showcase. Help them by:\n\n1. Brainstorming specific topic ideas within their chosen track\n2. Suggesting AI concepts from the course they should connect to (token prediction, embeddings, bias, training data, prompt engineering, copyright, ethics, etc.)\n3. Helping them structure their work (outlines, argument flow, design elements)\n4. Answering content questions about AI topics\n\nDo NOT write their project for them. Help them think, organize, and research — but the words, designs, and arguments must be their own. Keep responses concise (under 150 words). Ask guiding questions rather than giving direct answers when possible.",
      starterMessage: "I'm your project advisor! Tell me which track you chose and what topic you're thinking about, and I'll help you shape your approach. I can help with brainstorming, structuring, or answering AI questions — but the final product is all you.",
      minMessages: 2
    },
    {
      id: "exit-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit ticket: What did you accomplish during work time today? What's your next step?",
      placeholder: "Today I... My next step is..."
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "Period 4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "Period 5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "Period 7" },
    { courseId: "fUw67wFhAtobWFhjwvZ5", label: "Period 9" },
  ];
  const lessonId = "final-project-launch";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
