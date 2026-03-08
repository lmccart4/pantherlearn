// seed-gaming-project-days.js
// Seeds 3 lessons for the Gaming & Esports WeVideo project:
//   Day 2 (Thu 3/5): Production Day — Build Your Video
//   Day 3 (Fri 3/6): Refine & Review
//   Day 4 (Mon 3/9): Showcase Day — Share & Celebrate
// All in Digital Literacy → Video Production unit, after "Gaming: Make Your Case" (order 1)
//
// Run: node scripts/seed-gaming-project-days.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

// ═══════════════════════════════════════════════════════════════
// LESSON 1 — PRODUCTION DAY (Thursday 3/5)
// ═══════════════════════════════════════════════════════════════
const lesson1 = {
  title: "Gaming Project: Production Day",
  course: "Digital Literacy",
  unit: "Video Production",
  order: 2,
  visible: false,
  dueDate: "2026-03-09",
  blocks: [
    // --- WARM UP ---
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~5 minutes",
      icon: "🔥"
    },
    {
      id: "objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply persuasive video structure (hook → thesis → evidence → counterargument → conclusion)",
        "Record voiceover narration and layer it over B-roll footage",
        "Use text overlays and transitions to reinforce key arguments",
        "Manage time effectively during an extended production session"
      ]
    },
    {
      id: "qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What's the difference between a video that *states* an opinion and one that *convinces* someone? How does editing make that difference?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at your storyboard from yesterday. On a scale of 1-10, how ready is your video plan? What's the ONE thing you need to figure out before you start building?",
      difficulty: "remember"
    },

    // --- STATUS CHECK ---
    {
      id: "section-status",
      type: "section_header",
      title: "Where Are You?",
      subtitle: "~3 minutes",
      icon: "📍"
    },
    {
      id: "q-status",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Where are you in the video production process right now?",
      difficulty: "remember",
      options: [
        "I haven't started in WeVideo yet — still planning",
        "I've started my project but only have a few clips/text",
        "I have most of my clips and some voiceover recorded",
        "I'm mostly done and need to add finishing touches"
      ],
      correctIndex: 0,
      explanation: "No matter where you are, today is YOUR production day. Check the milestone checklist below and work toward completing as many items as you can."
    },
    {
      id: "text-timeline",
      type: "text",
      content: "Here's your schedule for the rest of the project:\n\n| Day | Focus | What's Due |\n|---|---|---|\n| **Today (Thu)** | 🎬 Build | Get a rough cut done — all clips placed, voiceover started |\n| **Tomorrow (Fri)** | ✨ Refine | Polish editing, peer feedback, final voiceover |\n| **Monday** | 🎤 Showcase | Export, share, and watch each other's videos |\n\n⏰ **Final deadline: Monday**"
    },

    // --- PRODUCTION ---
    {
      id: "section-produce",
      type: "section_header",
      title: "Production Time",
      subtitle: "~30 minutes",
      icon: "🎬"
    },
    {
      id: "text-reminders",
      type: "text",
      content: "**Quick Reminders Before You Build:**\n\n🎯 **Video length:** 60-90 seconds\n📐 **Structure:** Hook → Thesis → Evidence 1 → Evidence 2 → Counterargument → Conclusion\n🎙️ **Voiceover:** Click the microphone icon in WeVideo. Record in a quiet space.\n🖼️ **B-roll:** Use WeVideo's Stock Media tab to find gaming clips, images, and music\n✏️ **Text overlays:** Add key stats or quotes on screen using the Text (T) tool"
    },
    {
      id: "external-wevideo",
      type: "external_link",
      icon: "🎬",
      title: "Open WeVideo",
      url: "https://www.wevideo.com/",
      description: "Open WeVideo in a new tab to continue editing your project",
      buttonLabel: "Launch WeVideo",
      openInNewTab: true
    },
    {
      id: "checklist-milestones",
      type: "checklist",
      title: "Today's Production Milestones",
      items: [
        "All clips/images placed on the timeline in the right order",
        "Voiceover recorded for at least your thesis and one evidence section",
        "At least ONE text overlay with a key stat or quote",
        "At least ONE piece of B-roll playing under your voiceover",
        "Background music added (keep volume LOW — voice first!)",
        "Video is between 45-90 seconds so far"
      ]
    },
    {
      id: "callout-stuck",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Stuck? Try this:** If you're staring at a blank timeline, just start with your thesis. Record yourself saying your main argument, drop it on the timeline, then build around it. You don't have to go in order — start with the part you're most confident about."
    },
    {
      id: "chat-production",
      type: "chatbot",
      icon: "🎬",
      title: "Production Assistant",
      starterMessage: "Hey! I'm your production assistant for the gaming video project. I can help you with:\n\n• Writing or improving your script\n• Finding the right words for your voiceover\n• Strengthening your counterargument\n• WeVideo tips and tricks\n\nWhat do you need help with?",
      systemPrompt: "You are a production assistant helping high school students create a 60-90 second persuasive WeVideo project about whether gaming is beneficial for young people. Help them with: script writing, voiceover wording, finding good arguments/counterarguments, WeVideo technical tips (B-roll, text overlays, transitions, voiceover recording). Keep responses to 2-4 sentences max — they need to be working, not reading. Be encouraging and practical. If they ask non-video-production questions, redirect them. If they share their script, give specific, actionable feedback. Do NOT write entire scripts for them — help them improve what they have.",
      instructions: "Need help while you work? Ask the Production Assistant for script help, editing tips, or argument advice.",
      placeholder: "What do you need help with?"
    },

    // --- CHECK-IN ---
    {
      id: "section-checkin",
      type: "section_header",
      title: "End-of-Class Check-In",
      subtitle: "~5 minutes",
      icon: "✅"
    },
    {
      id: "q-progress",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe where your video is right now. What's done? What still needs to happen tomorrow?",
      difficulty: "apply"
    },
    {
      id: "q-challenge",
      type: "question",
      questionType: "short_answer",
      prompt: "What was the hardest part of production today? Did you figure it out? If not, what help do you need tomorrow?",
      difficulty: "evaluate"
    },
    {
      id: "text-tomorrow",
      type: "text",
      content: "**Tomorrow:** You'll do a peer review — someone else will watch your rough cut and give you feedback. Then you'll have time to polish your video based on that feedback. Come in ready to show what you have!"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 2 — REFINE & REVIEW (Friday 3/6)
// ═══════════════════════════════════════════════════════════════
const lesson2 = {
  title: "Gaming Project: Refine & Review",
  course: "Digital Literacy",
  unit: "Video Production",
  order: 3,
  visible: false,
  dueDate: "2026-03-09",
  blocks: [
    // --- WARM UP ---
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~5 minutes",
      icon: "🔥"
    },
    {
      id: "objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Give constructive peer feedback on video clarity, argument strength, and editing quality",
        "Receive and apply feedback to improve your own video",
        "Polish transitions, audio levels, and pacing for a professional result",
        "Self-assess your video against the project rubric"
      ]
    },
    {
      id: "qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why is getting feedback from someone else essential — even when you think your project is already good?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How complete is your video right now?",
      difficulty: "remember",
      options: [
        "Less than 25% — I need a lot more time",
        "About 50% — rough structure is there but missing pieces",
        "About 75% — most content is in, needs polish",
        "90%+ — basically done, just tweaks"
      ],
      correctIndex: 2,
      explanation: "Wherever you are, today's goal is to get feedback from a peer and use the remaining time to refine your video. Monday is the final deadline."
    },

    // --- PEER REVIEW ---
    {
      id: "section-peer",
      type: "section_header",
      title: "Peer Review",
      subtitle: "~15 minutes",
      icon: "👥"
    },
    {
      id: "text-peer-intro",
      type: "text",
      content: "Time to get a fresh set of eyes on your video! You'll pair up with someone and review each other's rough cuts.\n\n**How it works:**\n1. Find a partner (someone you haven't worked with yet if possible)\n2. Watch their video first WITHOUT commenting — just take it in\n3. Watch it a SECOND time and take notes using the feedback guide below\n4. Share your feedback face-to-face, then fill in the questions"
    },
    {
      id: "callout-feedback-rules",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Feedback Rules:**\n\n✅ Be specific — \"Your hook grabbed me because the stat was surprising\" > \"It was good\"\n✅ Be constructive — \"The transition at 0:30 felt abrupt, maybe a fade would work\" > \"That part was bad\"\n✅ Be kind — You're helping them make it better, not tearing it down\n❌ No vague comments like \"It's fine\" or \"I liked it\" without saying WHY"
    },
    {
      id: "activity-peer-review",
      type: "activity",
      icon: "👥",
      title: "Peer Review Protocol",
      instructions: "1. Pair up with a partner\n2. Partner A shares their screen and plays their video\n3. Partner B watches silently the first time, then watches again taking notes\n4. Partner B gives feedback out loud (2 minutes)\n5. SWITCH — repeat for Partner B's video\n6. Both partners answer the feedback questions below"
    },
    {
      id: "q-peer-strength",
      type: "question",
      questionType: "short_answer",
      prompt: "What was the STRONGEST part of your partner's video? Be specific — what moment, technique, or argument stood out?",
      difficulty: "analyze"
    },
    {
      id: "q-peer-improve",
      type: "question",
      questionType: "short_answer",
      prompt: "Give your partner ONE specific suggestion for improvement. What could they add, change, or remove to make their argument more convincing?",
      difficulty: "evaluate"
    },
    {
      id: "q-received-feedback",
      type: "question",
      questionType: "short_answer",
      prompt: "What feedback did YOU receive from your partner? What specific change will you make based on their suggestion?",
      difficulty: "apply"
    },

    // --- SELF-ASSESSMENT ---
    {
      id: "section-rubric",
      type: "section_header",
      title: "Self-Assessment",
      subtitle: "~5 minutes",
      icon: "📋"
    },
    {
      id: "text-rubric",
      type: "text",
      content: "Before you keep editing, rate yourself honestly on each category. This is the same rubric I'll use to grade your final video on Monday."
    },
    {
      id: "checklist-rubric",
      type: "checklist",
      title: "Video Quality Checklist — Check the ones you've achieved",
      items: [
        "ARGUMENT: My thesis is clearly stated (spoken or on-screen)",
        "ARGUMENT: I include at least 2 pieces of supporting evidence",
        "ARGUMENT: I address the counterargument",
        "EDITING: I used at least one text overlay",
        "EDITING: I used B-roll to support my voiceover",
        "EDITING: My audio levels are balanced (voice > music)",
        "EDITING: I used transitions between sections",
        "POLISH: My video is 60-90 seconds long",
        "POLISH: The pacing feels natural — not too rushed, not too slow",
        "POLISH: I would be proud to show this to the class"
      ]
    },

    // --- POLISH TIME ---
    {
      id: "section-polish",
      type: "section_header",
      title: "Polish Time",
      subtitle: "~15 minutes",
      icon: "✨"
    },
    {
      id: "text-polish",
      type: "text",
      content: "Use the remaining time to act on your peer feedback and self-assessment. Focus on the **highest-impact changes** first:\n\n🥇 **First:** Fix any missing elements (thesis, evidence, counterargument)\n🥈 **Second:** Fix audio issues (voiceover too quiet, music too loud)\n🥉 **Third:** Add polish (better transitions, text timing, B-roll)"
    },
    {
      id: "external-wevideo",
      type: "external_link",
      icon: "🎬",
      title: "Open WeVideo",
      url: "https://www.wevideo.com/",
      description: "Open WeVideo to apply your feedback and polish your video",
      buttonLabel: "Launch WeVideo",
      openInNewTab: true
    },
    {
      id: "callout-export",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**IMPORTANT — Export Before Monday!**\n\nWhen your video is done:\n1. Click **Finish** (top right in WeVideo)\n2. Give it a title: \"[Your Name] — Gaming: Make Your Case\"\n3. Set quality to **720p** (faster export)\n4. Click **Export**\n5. Wait for it to finish — then you'll get a shareable link\n\nDon't wait until Monday to export! Export tonight or over the weekend so you're ready for Showcase Day."
    },

    // --- WRAP UP ---
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: What is the single most important improvement you still need to make before Monday? How confident are you (1-10) that your video will be ready for Showcase Day?",
      difficulty: "evaluate"
    },
    {
      id: "text-monday",
      type: "text",
      content: "**Monday is Showcase Day! 🎤**\n\nHere's what's happening:\n- You'll share your finished video with the class\n- We'll watch each video together\n- You'll vote on categories: Most Convincing, Best Editing, Best Hook\n- You'll do a final reflection on the whole project\n\n**Come in Monday with your video EXPORTED and ready to play.** If you need weekend time to finish, WeVideo works from home at wevideo.com."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 3 — SHOWCASE DAY (Monday 3/9)
// ═══════════════════════════════════════════════════════════════
const lesson3 = {
  title: "Gaming Project: Showcase Day!",
  course: "Digital Literacy",
  unit: "Video Production",
  order: 4,
  visible: false,
  dueDate: "2026-03-09",
  blocks: [
    // --- INTRO ---
    {
      id: "section-intro",
      type: "section_header",
      title: "🎬 Showcase Day!",
      subtitle: "Share your Gaming & Esports video with the class",
      icon: "🎤"
    },
    {
      id: "objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Present your completed persuasive video to an audience",
        "Evaluate classmates' videos for argument strength and editing quality",
        "Reflect on the full video production process — from planning to final cut",
        "Identify skills learned that transfer beyond this project"
      ]
    },
    {
      id: "qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What did you learn about the power of video as a persuasion tool? Could a well-made video change someone's mind about gaming?"
    },

    // --- PRE-SCREENING ---
    {
      id: "section-prescreen",
      type: "section_header",
      title: "Pre-Screening Check",
      subtitle: "~5 minutes",
      icon: "✅"
    },
    {
      id: "q-ready",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Is your video exported and ready to share?",
      difficulty: "remember",
      options: [
        "Yes — exported and ready to play!",
        "It's exporting right now",
        "I need a few more minutes to finish",
        "I couldn't finish — I need to explain what I had planned"
      ],
      correctIndex: 0,
      explanation: "If you're not fully ready, use the first few minutes to export. If you couldn't finish, you'll still present — just explain your vision and show what you have."
    },
    {
      id: "external-wevideo",
      type: "external_link",
      icon: "🎬",
      title: "Open WeVideo",
      url: "https://www.wevideo.com/",
      description: "Open WeVideo to access your exported video for sharing",
      buttonLabel: "Launch WeVideo",
      openInNewTab: true
    },

    // --- SHOWCASE ---
    {
      id: "section-showcase",
      type: "section_header",
      title: "The Showcase",
      subtitle: "~25 minutes",
      icon: "🍿"
    },
    {
      id: "text-showcase-rules",
      type: "text",
      content: "**Showcase Rules:**\n\n🔇 **Respect:** Silent attention while each video plays — just like a film screening\n👏 **Applause:** Clap after each video\n📝 **Notes:** After each video, you'll note your reactions below\n🚫 **No heckling** — constructive vibes only\n\nEach person will:\n1. Introduce their video in one sentence (\"My video argues that...\")\n2. Play their video\n3. Take one question or comment from the audience"
    },
    {
      id: "q-favorite",
      type: "question",
      questionType: "short_answer",
      prompt: "As you watch your classmates' videos, which ONE video had the most convincing argument? What made it persuasive? (Don't pick your own!)",
      difficulty: "evaluate"
    },
    {
      id: "q-best-editing",
      type: "question",
      questionType: "short_answer",
      prompt: "Which video had the best EDITING — the most professional-looking use of B-roll, text overlays, transitions, or voiceover? What stood out?",
      difficulty: "analyze"
    },
    {
      id: "q-surprise",
      type: "question",
      questionType: "short_answer",
      prompt: "Did any video change your mind or make you think about gaming differently? What argument or moment caused that shift?",
      difficulty: "evaluate"
    },

    // --- AWARDS ---
    {
      id: "section-awards",
      type: "section_header",
      title: "Class Awards",
      subtitle: "~5 minutes",
      icon: "🏆"
    },
    {
      id: "text-awards",
      type: "text",
      content: "Time to vote! Think carefully about each category — these should go to the videos that truly earned it."
    },
    {
      id: "q-award-convincing",
      type: "question",
      questionType: "short_answer",
      prompt: "🏆 MOST CONVINCING: Which video made the strongest argument? (Write the creator's name and a one-sentence reason why)",
      difficulty: "evaluate"
    },
    {
      id: "q-award-editing",
      type: "question",
      questionType: "short_answer",
      prompt: "🎬 BEST EDITING: Which video had the most polished, professional editing? (Name + one-sentence reason)",
      difficulty: "evaluate"
    },
    {
      id: "q-award-hook",
      type: "question",
      questionType: "short_answer",
      prompt: "🎣 BEST HOOK: Which video had the most attention-grabbing opening? (Name + one-sentence reason)",
      difficulty: "analyze"
    },

    // --- FINAL REFLECTION ---
    {
      id: "section-reflection",
      type: "section_header",
      title: "Final Reflection",
      subtitle: "~10 minutes",
      icon: "🪞"
    },
    {
      id: "text-reflection-intro",
      type: "text",
      content: "You started this project by learning about the gaming industry and choosing a position. You planned, scripted, recorded, edited, got feedback, revised, and shared. That's the full video production pipeline — and it's the same process professionals use."
    },
    {
      id: "q-proud",
      type: "question",
      questionType: "short_answer",
      prompt: "What are you MOST proud of in your final video? Be specific — point to a moment, technique, or decision you made.",
      difficulty: "evaluate"
    },
    {
      id: "q-improve",
      type: "question",
      questionType: "short_answer",
      prompt: "If you could go back and redo ONE part of your video with unlimited time, what would you change and why?",
      difficulty: "evaluate"
    },
    {
      id: "q-skills",
      type: "question",
      questionType: "short_answer",
      prompt: "What skills did you develop during this project that you could use OUTSIDE of this class? Think about school, future jobs, or personal projects.",
      difficulty: "create"
    },
    {
      id: "sorting-skills",
      type: "sorting",
      icon: "🔀",
      title: "Skills Check: What did you practice?",
      instructions: "For each skill below, swipe RIGHT if you feel CONFIDENT in it now, or LEFT if you still need more practice.",
      leftLabel: "Need Practice",
      rightLabel: "Feeling Confident",
      items: [
        { text: "Writing a clear thesis statement", correct: "right" },
        { text: "Recording voiceover narration", correct: "right" },
        { text: "Using B-roll to support a message", correct: "right" },
        { text: "Adding text overlays in WeVideo", correct: "right" },
        { text: "Structuring a persuasive argument", correct: "right" },
        { text: "Giving constructive peer feedback", correct: "right" },
        { text: "Managing time on a multi-day project", correct: "right" },
        { text: "Addressing a counterargument", correct: "right" }
      ]
    },

    // --- WRAP UP ---
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "",
      icon: "🎬"
    },
    {
      id: "text-wrapup",
      type: "text",
      content: "**Congratulations!** 🎉 You just completed a full video production cycle:\n\n📋 **Research & Planning** → Explored the gaming industry, picked a side, built an argument\n✍️ **Pre-Production** → Storyboarded, scripted, gathered evidence\n🎬 **Production** → Recorded voiceover, assembled clips, added effects\n✨ **Post-Production** → Got feedback, revised, polished\n🎤 **Distribution** → Shared your finished work with an audience\n\nThese are the same steps used by YouTubers, filmmakers, marketers, and journalists. You just did what they do — and you have the skills to do it again."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Go back to the Question of the Day — what did you learn about the power of video as a persuasion tool? Could a well-made video change someone's mind about gaming? Use a specific example from today's showcase.",
      difficulty: "evaluate"
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Persuasive Video", definition: "A video designed to convince the viewer to adopt a specific viewpoint, using evidence, emotional appeal, and professional production techniques." },
        { term: "Thesis Statement", definition: "A clear, one-sentence declaration of your position and main reason — the backbone of your argument." },
        { term: "B-Roll", definition: "Supplemental footage layered over narration to visually support your message." },
        { term: "Voiceover", definition: "Narration recorded separately and placed over visuals, rather than speaking directly to camera." },
        { term: "Counterargument", definition: "Acknowledging the opposing viewpoint, then explaining why your position is still stronger — builds credibility." },
        { term: "Hook", definition: "The opening seconds of a video designed to grab attention and make the viewer want to keep watching." },
        { term: "Export", definition: "The process of rendering your finished video project into a shareable video file." },
        { term: "Peer Review", definition: "The process of having a classmate evaluate your work and provide constructive feedback before final submission." }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// SEED ALL THREE LESSONS
// ═══════════════════════════════════════════════════════════════
async function seed() {
  const lessons = [
    { data: lesson1, slug: "gaming-production-day", label: "Day 2: Production Day (Thu 3/5)" },
    { data: lesson2, slug: "gaming-refine-review", label: "Day 3: Refine & Review (Fri 3/6)" },
    { data: lesson3, slug: "gaming-showcase-day", label: "Day 4: Showcase Day! (Mon 3/9)" },
  ];

  try {
    for (const lesson of lessons) {
      await db.collection('courses').doc('digital-literacy')
        .collection('lessons').doc(lesson.slug)
        .set(lesson.data);
      console.log(`✅ ${lesson.label}`);
      console.log(`   Path: courses/digital-literacy/lessons/${lesson.slug}`);
      console.log(`   Blocks: ${lesson.data.blocks.length}`);
    }

    console.log(`\n🎬 All 3 Gaming Project lessons seeded successfully!`);
    console.log(`   Unit: Video Production`);
    console.log(`   Order: 2, 3, 4 (after "Gaming: Make Your Case" at order 1)`);
    console.log(`   Due: 2026-03-09 (Monday)`);
    console.log(`   Visible: false (publish via Lesson Editor)`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lessons:', err);
    process.exit(1);
  }
}

seed();
