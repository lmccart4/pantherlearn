const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const saPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (fs.existsSync(saPath)) {
  admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
} else {
  admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
}
const db = admin.firestore();

const lesson = {
  title: "Gaming Project: Showcase Day!",
  course: "Digital Literacy",
  unit: "Gaming & Esports",
  order: 11,
  visible: false,
  dueDate: "2026-03-10",
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎬",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Present your completed gaming video to the class",
        "Give constructive feedback on classmates' videos",
        "Reflect on your creative process and what you learned"
      ]
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "?",
      content: "**Question of the Day:** What makes a video presentation memorable? Think about the best YouTube video or presentation you've ever seen — what made it stick with you?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "On a scale of 1-10, how proud are you of your final video? Why?",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // SHOWCASE PREP
    // ═══════════════════════════════════════════
    {
      id: "section-prep",
      type: "section_header",
      icon: "📋",
      title: "Showcase Prep",
      subtitle: "~5 minutes"
    },
    {
      id: "text-prep",
      type: "text",
      content: "Before we start watching videos, take a moment to prepare. When your video plays, you'll give a **brief intro** (15-30 seconds) to the class:\n\n- What game/topic did you choose and why?\n- What was the hardest part of making this video?\n- What are you most proud of?\n\nYou do NOT need to explain the whole video — let it speak for itself."
    },
    {
      id: "checklist-prep",
      type: "checklist",
      title: "Pre-Showcase Checklist",
      items: [
        "My video is exported and ready to play",
        "I know my brief intro (game choice, challenge, proud moment)",
        "I have the video link or file ready to share"
      ]
    },

    // ═══════════════════════════════════════════
    // SHOWCASE
    // ═══════════════════════════════════════════
    {
      id: "section-showcase",
      type: "section_header",
      icon: "🎤",
      title: "Video Showcase",
      subtitle: "~25 minutes"
    },
    {
      id: "text-showcase-rules",
      type: "text",
      content: "**Showcase Rules:**\n- Give each presenter your full attention — no phones, no side conversations\n- Applaud after each video\n- Save detailed feedback for the written portion\n- Be respectful — everyone put real effort into these projects"
    },
    {
      id: "callout-feedback",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**While watching each video, think about:**\n\n- What was the creator's main argument or message?\n- What editing techniques stood out?\n- Was the video convincing / entertaining / informative?\n- What would you steal for your own next project?"
    },

    // ═══════════════════════════════════════════
    // PEER FEEDBACK
    // ═══════════════════════════════════════════
    {
      id: "section-feedback",
      type: "section_header",
      icon: "💬",
      title: "Peer Feedback",
      subtitle: "~10 minutes"
    },
    {
      id: "text-feedback-intro",
      type: "text",
      content: "Now that you've watched everyone's videos, it's time to give feedback. Pick **two classmates' videos** that stood out to you and write specific, constructive feedback for each."
    },
    {
      id: "q-feedback-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Peer Feedback #1: Which classmate's video are you reviewing? What was the STRONGEST element of their video (argument, editing, visuals, audio, storytelling)? Give a specific example from the video.",
      difficulty: "analyze"
    },
    {
      id: "q-feedback-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Peer Feedback #2: Which classmate's video are you reviewing? What was the STRONGEST element of their video? What is ONE thing they could improve for next time?",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // CLASS VOTE
    // ═══════════════════════════════════════════
    {
      id: "section-vote",
      type: "section_header",
      icon: "🏆",
      title: "Class Awards",
      subtitle: "~5 minutes"
    },
    {
      id: "text-vote",
      type: "text",
      content: "Time to vote! For each category below, pick the video you think deserves the award. **You cannot vote for yourself.** Be honest — this is about recognizing great work."
    },
    {
      id: "q-vote-argument",
      type: "question",
      questionType: "short_answer",
      prompt: "Best Argument Award: Which video made the most convincing case for their gaming topic? (Name the creator)",
      difficulty: "evaluate"
    },
    {
      id: "q-vote-editing",
      type: "question",
      questionType: "short_answer",
      prompt: "Best Editing Award: Which video had the best production quality — visuals, transitions, audio, pacing? (Name the creator)",
      difficulty: "evaluate"
    },
    {
      id: "q-vote-creative",
      type: "question",
      questionType: "short_answer",
      prompt: "Most Creative Award: Which video surprised you or took a unique approach? (Name the creator)",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // SELF-REFLECTION
    // ═══════════════════════════════════════════
    {
      id: "section-reflection",
      type: "section_header",
      icon: "🪞",
      title: "Self-Reflection",
      subtitle: "~5 minutes"
    },
    {
      id: "q-reflect-process",
      type: "question",
      questionType: "short_answer",
      prompt: "Think back over the entire Gaming & Esports project — from research to scripting to filming to editing. What was the most valuable skill you developed? How could you use this skill outside of this class?",
      difficulty: "evaluate"
    },
    {
      id: "q-reflect-growth",
      type: "question",
      questionType: "short_answer",
      prompt: "If you could redo this project from scratch with everything you know now, what would you do differently? Be specific.",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🏁",
      title: "Wrap Up",
      subtitle: "~2 minutes"
    },
    {
      id: "text-wrapup",
      type: "text",
      content: "**Great work on this project!** You took a topic you're passionate about, researched it, built an argument, and created a polished video to share your perspective.\n\nThese are real-world skills:\n- **Research** — finding and evaluating sources\n- **Persuasion** — building a convincing argument\n- **Production** — planning, filming/recording, and editing media\n- **Presentation** — sharing your work with an audience\n\nWhether you end up making YouTube videos, class presentations, or work projects — you now have the foundation to create compelling media."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: In one sentence, what is the #1 thing you're taking away from this project?",
      difficulty: "remember"
    }
  ]
};

async function seed() {
  await db.doc("courses/digital-literacy/lessons/gaming-showcase-day").set(lesson);
  console.log("Seeded 'Gaming Project: Showcase Day!' with", lesson.blocks.length, "blocks");
  console.log("Visible: false");
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
