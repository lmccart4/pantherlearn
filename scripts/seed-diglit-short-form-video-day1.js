// seed-diglit-short-form-video-day1.js
// Creates "Short-Form Video Sprint Day 1: Deconstruction + Storyboard"
// Course: Digital Literacy, Unit: Short-Form Video Sprint, order: 63
// Run: node scripts/seed-diglit-short-form-video-day1.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const LESSON_ID = "short-form-video-day1-deconstruction";
const COURSE_ID = "digital-literacy";

const lesson = {
  title: "Short-Form Video Sprint — Day 1: Deconstruction + Storyboard",
  questionOfTheDay: "What's the last short-form video you watched twice? Why did you stop scrolling?",
  course: "Digital Literacy",
  unit: "Short-Form Video Sprint",
  order: 63,
  visible: false,
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎬",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What's the last short-form video you watched **twice**? Why did you stop scrolling?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Name a short-form video (TikTok, Reel, Short) you watched at least twice in the last week. Describe its first 3 seconds in detail. What made you stop scrolling?",
      placeholder: "Video: ...\nFirst 3 seconds: ...\nWhy I stopped scrolling: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Deconstruct a short-form video by identifying its hook, payoff, and watch-time loop",
        "Connect what makes a video go viral to algorithm signals (variable rewards, hook density, completion rate)",
        "Pick a format and topic for your own 30-60 second video",
        "Build a 6-panel storyboard with shot type, on-screen text, and sound for each panel"
      ]
    },
    {
      id: "v-mrbeast-short",
      type: "video",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-videos/digital-literacy/04-mrbeast-short-hook.mp4",
      caption: "Teaser: watch this MrBeast Short before we deconstruct anything. Count how many hook elements he stacks in the first 2 seconds — we'll come back to this."
    },

    // ─── MAIN: DECONSTRUCTION ───────────────────────────────

    {
      id: "section-main",
      type: "section_header",
      icon: "🔬",
      title: "Deconstructing the Algorithm's Favorites",
      subtitle: "~20 minutes"
    },
    {
      id: "b-intro",
      type: "text",
      content: "You've already studied **how recommendation algorithms work** in the Algorithm Economy unit. You know about variable rewards, hook density, and watch-time loops.\n\nNow flip the camera around. Today you're not the user — you're the creator. Your job for the next four days: build a 30-60 second vertical video that the algorithm would actually push.\n\nWe start by reverse-engineering three videos that already won. For each one, we ask the same three questions:\n\n1. **What's the hook?** (the first 3 seconds — what stops the scroll?)\n2. **When does the payoff hit?** (the timestamp where the promise gets delivered)\n3. **Why does the algorithm reward it?** (which signals — completion, re-watch, share, comment — does the structure trigger?)"
    },
    {
      id: "b-khaby",
      type: "text",
      content: "## Example 1 — Khaby Lame: \"Life Hack\" Debunk\n\n**Format:** Reaction + visual debunk. No words.\n\n- **Hook (0:00–0:03):** A weird life-hack video plays in the corner — someone doing something needlessly complicated (cutting an apple with a sewing machine, opening a banana with a hammer, etc.).\n- **Payoff (~0:08):** Khaby shrugs, walks in, does the thing the simple way, hits his signature open-palm gesture.\n- **Why the algorithm rewards it:**\n  - Zero words = works in **every language** = global completion rate\n  - Setup → punchline → signature gesture = **clean watch-time loop** (people re-watch the gesture)\n  - Universal frustration (\"why is this complicated\") = high **share signal** (\"this is so true\")\n  - 10–15 seconds long = high **completion rate** (most viewers finish)"
    },
    {
      id: "v-khaby-clip",
      type: "video",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-videos/digital-literacy/01-khaby-pizza-hack.mp4",
      caption: "Khaby Lame debunking a pizza life-hack. Notice: no words, signature gesture, complete watch-time loop in under 15 seconds."
    },
    {
      id: "b-mrbeast",
      type: "text",
      content: "## Example 2 — MrBeast: \"$1 vs $1,000,000 Hotel Room\" Opener\n\n**Format:** Contrast + escalation promise.\n\n- **Hook (0:00–0:02):** \"This is a $1 hotel room.\" Cut to a horrible room. Title card flashes the contrast.\n- **Payoff:** Promised escalation — viewer wants to see the $10 room, the $100 room, all the way up.\n- **Why the algorithm rewards it:**\n  - **Hook density** is brutal — number, contrast, and visual all land in <2 seconds\n  - The **promise** (\"we'll show you 8 more rooms, each crazier\") locks in watch time\n  - Curiosity gap = **comment signal** (\"I need to see the million dollar one\")\n  - The structure works in any short-form re-cut — algorithm pushes the original AND the clip"
    },
    {
      id: "v-mrbeast-hotel",
      type: "video",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-videos/digital-literacy/02-mrbeast-1-vs-1m-hotel.mp4",
      caption: "MrBeast's \"$1 vs $1,000,000 Hotel Room\" opener. Watch how the contrast hook and escalation promise both land before the 3-second mark."
    },
    {
      id: "b-local",
      type: "text",
      content: "## Example 3 — LeJuan James: Latino Family Sketch\n\n**Format:** Cultural specificity. The hook IS the relatability.\n\nLeJuan James built a following of millions playing every member of a Latino family — the mom, the dad, the cousin, the abuela — in short scripted sketches. The humor doesn't translate to a general audience. It doesn't have to. It lands hard with the people it's actually made for.\n\n- **Hook:** A Spanish phrase, a familiar family dynamic, a specific dish, a sound everyone in this room has heard at home growing up.\n- **Payoff:** Recognition + warmth. \"This is MY world on screen.\"\n- **Why the algorithm rewards it:**\n  - **Cultural specificity** = strong completion + share signal inside that audience\n  - Comments fire (\"my mom does this EXACT thing\") — comment signal feeds the loop\n  - Audio often goes viral on its own → algorithm tracks **sound trends** and pushes anyone using it\n\n**The lesson:** specificity beats generality. \"Universal\" content gets ignored. Content that feels like it was made for *you* gets watched twice."
    },
    {
      id: "v-lejuan-clip",
      type: "video",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-videos/digital-literacy/03-lejuan-room-chilling.mp4",
      caption: "LeJuan James playing the cousin chilling in the room. Cultural specificity in action — the family dynamic, the Spanish phrasing, the energy. Every detail lands harder with the audience it was made for."
    },
    {
      id: "callout-teacher-note",
      type: "callout",
      style: "note",
      icon: "📌",
      content: "**TEACHER NOTE:** LeJuan James clip embedded below. If you want to swap in a different creator with stronger PA-specific resonance (someone the room actually follows), pause the embedded clip and pull yours up on the projector instead."
    },
    {
      id: "img-hook-3-seconds",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/hook-in-3-seconds.jpg",
      alt: "Diagram of the hook-in-3-seconds principle: vertical phone screen showing a stopwatch ticking from 0:00 to 0:03 with annotations for visual surprise, question, and pattern interrupt",
      caption: "The hook-in-3-seconds rule. Whatever happens in the first three seconds decides whether the algorithm even gives the rest of your video a chance."
    },
    {
      id: "callout-hook-rule",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The 3-Second Rule:** If the algorithm sees viewers swipe past your video before the 3-second mark, it stops showing it to anyone. Watch time in the first 3 seconds is the single biggest signal that decides whether your video gets pushed or buried.\n\n**What lands in 3 seconds:** a visual surprise, a question that demands an answer, a strong claim, or a pattern interrupt (something that doesn't look like the videos around it)."
    },
    {
      id: "q-hook-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A creator opens their video with a 5-second slow zoom on their face before saying anything. Most viewers swipe away in the first 2 seconds. What does the algorithm conclude?",
      options: [
        "The video has a strong hook because it builds suspense",
        "The video has a weak hook — low watch time in the first 3 seconds means the algorithm will stop pushing it",
        "The algorithm only cares about likes, not watch time, so the video will still spread",
        "The slow zoom counts as a pattern interrupt and helps the video"
      ],
      correctIndex: 1,
      explanation: "Completion rate in the first 3 seconds is the most important signal on TikTok and Reels. A slow zoom with no payoff lets viewers swipe before they're hooked. The algorithm reads early swipes as \"this video isn't relevant\" and stops surfacing it.",
      difficulty: "apply"
    },
    {
      id: "q-algo-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why does Khaby Lame's no-words format spread so well across the algorithm?",
      options: [
        "Because TikTok hides videos that have a lot of dialogue",
        "Because comedy videos always outperform other categories on the algorithm",
        "Because the algorithm gives bonus reach to creators with hand gestures",
        "Because no-words content has the same completion rate in every language, so it spreads across global feeds"
      ],
      correctIndex: 3,
      explanation: "Wordless content has no language barrier. A Spanish speaker, a Korean speaker, and an English speaker all watch it to completion the same way. That global completion rate is one of the most powerful signals a short-form video can produce.",
      difficulty: "understand"
    },
    {
      id: "q-deconstruct-sa",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick ONE of the three videos we deconstructed (Khaby, MrBeast, or the local creator). In your own words, walk through: (1) what the hook is, (2) when the payoff hits and what makes it land, (3) one specific algorithm signal the structure triggers (completion, share, comment, re-watch).",
      placeholder: "Video: ...\nHook: ...\nPayoff (with timestamp): ...\nAlgorithm signal: ...",
      difficulty: "analyze"
    },

    // ─── ACTIVITY: PICK + STORYBOARD ────────────────────────

    {
      id: "section-activity",
      type: "section_header",
      icon: "✏️",
      title: "Pick Your Format. Storyboard It.",
      subtitle: "~17 minutes"
    },
    {
      id: "b-pick-format",
      type: "text",
      content: "## Pick Your Format (5 min)\n\nPick ONE of these formats for your 30-60 second video. You can change it later — but pick one to plan around right now.\n\n- **Explainer** — Teach something quickly (a skill, a concept, how something works).\n- **Reaction** — React to a clip, an image, or a claim. Khaby-style works here.\n- **Day-in-life** — Snippets from your day, school, neighborhood, practice.\n- **Sketch** — Short scripted bit. Has a setup and a punchline.\n- **Tutorial** — Show somebody how to do one specific thing in 30 seconds.\n- **Local pride** — Something specific to PAHS, Perth Amboy, or your community.\n- **Your own (approved)** — Pitch it to Mr. McCarthy before storyboarding.\n\n## Pick Your Topic\n\nPick something you actually know or care about. The algorithm rewards specificity — \"my abuela's three rules for sazón\" beats \"cooking tips\" every single time."
    },
    {
      id: "img-storyboard",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/storyboard-six-panel.jpg",
      alt: "A six-panel vertical storyboard template with each panel labeled for shot type, on-screen text, and sound, showing a hook in panel 1 and a payoff in panel 5",
      caption: "Six-panel storyboard layout. Panel 1 = hook. Panel 5 or 6 = payoff. Everything else builds the loop."
    },
    {
      id: "b-storyboard-howto",
      type: "text",
      content: "## Storyboard Your Video (12 min)\n\n6 boxes in a 2×3 or 3×2 grid. Each box = **one shot** in your video.\n\nPick how you want to build it — all three work the same way for grading:\n\n- 📝 **Paper** — grab a sheet, draw 6 boxes by hand\n- ✏️ **Whiteboard + markers** — pull one off the stack, sketch the 6 boxes\n- 💻 **Google Slides or Canva** — 6 slides or 6 frames; cleaner if you'd rather build digitally\n\nFor each box, label three things:\n\n1. **Shot type** — close-up on face, wide of room, over-the-shoulder, screen recording, B-roll, etc.\n2. **On-screen text** — what caption appears in this shot? (Even if it's none, write \"none.\")\n3. **Sound** — music, voiceover, ambient (room sound), or silent\n\n**Required:**\n- **Panel 1 = your hook.** The first shot has to stop the scroll inside 3 seconds.\n- **Panel 5 or 6 = your payoff.** The promise from the hook gets delivered.\n- The middle panels build the loop — they have to keep the viewer watching toward the payoff.\n\n**Last 2 minutes:** Show your storyboard to ONE neighbor. They should be able to tell you the hook out loud after one look. If they can't — the hook isn't clear enough yet.\n\nWhen your storyboard is done, submit it in the block below. Paper or whiteboard = upload a photo. Slides or Canva = paste the share link. Either way, you only submit ONE."
    },
    {
      id: "sb-storyboard-submit",
      type: "storyboard_submit",
      scored: true,
      weight: 5,
      prompt: "**Submit Your Storyboard**\n\nPick the option that matches how you built it. You can switch or undo any time before submitting."
    },
    {
      id: "b-resources",
      type: "text",
      content: "## Resources for Today\n\nWe're not editing yet — that's Day 3. But if you want to look ahead at trending hooks and what's working right now, the links below are good places to study examples without doom-scrolling."
    },

    // ─── CLOSING ────────────────────────────────────────────

    {
      id: "section-closing",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-guardrails",
      type: "callout",
      style: "warning",
      icon: "🛡️",
      content: "**Content Guardrails — read before you storyboard:**\n\n- **No personal attacks, no shaming classmates, no filming anyone who didn't agree to be on camera.**\n- **No PII** — no last names, phone numbers, addresses, schedules, license plates, school IDs.\n- **PAPS AUP applies** — no copyrighted music if you're posting publicly. Use CapCut's royalty-free library on Day 3.\n- **Posting publicly is optional.** In-class submission to PantherLearn is the only required upload. Anyone under 18 needs parent consent before posting to a public account.\n- **Sensitive topics** (mental health, family, identity) — talk to Mr. McCarthy before shooting."
    },
    {
      id: "callout-due-date",
      type: "callout",
      style: "note",
      icon: "📅",
      content: "**Due dates this week:**\n- **End of Day 1 (today):** Storyboard submitted as exit ticket.\n- **End of Day 2:** All clips shot and uploaded to your CapCut project.\n- **End of Day 3:** Rough cut with captions and music.\n- **End of Day 4:** Final 30-60 second .mp4 vertical, uploaded to the submission block."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "**Exit Ticket:** Write your hook in ONE sentence. Then describe (in 1-2 sentences) what your payoff is and where it lands in the video. If your hook depends on something visual, describe that too.",
      placeholder: "My hook (one sentence): ...\nMy payoff: ...\nWhat panel it lands in: ...",
      difficulty: "create"
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "Looking back at the three videos we deconstructed today — which one's structure are you borrowing from for your own video, and why? What signal (completion, share, comment, re-watch) are you trying to trigger?",
      placeholder: "Borrowing from: ...\nWhy: ...\nSignal I'm targeting: ...",
      difficulty: "evaluate"
    },

    // ─── VOCABULARY ────────────────────────────────────────

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
        { term: "Hook", definition: "The first 3 seconds of a short-form video. Whatever lands here decides whether the algorithm pushes the video or buries it." },
        { term: "Payoff", definition: "The moment the promise from the hook gets delivered. If the hook says \"I'll show you the cheapest hotel,\" the payoff is when you finally see it." },
        { term: "Pattern interrupt", definition: "Something in your hook that doesn't look like the videos around it — a sudden cut, a bold visual, an unexpected sound — that breaks the scroll." },
        { term: "Watch-time loop", definition: "Structure that keeps viewers watching all the way through (and often re-watching). Setup → tension → payoff → signature beat." },
        { term: "Storyboard", definition: "A panel-by-panel sketch of your video before you shoot. Each panel = one shot, with shot type, on-screen text, and sound noted." },
        { term: "Cultural specificity", definition: "Content that lands hard with a specific audience because it speaks their exact language, food, neighborhood, or experience. Beats \"universal\" content on the algorithm." }
      ]
    }
  ],
  updatedAt: new Date()
};

async function seed() {
  try {
    // Preserve admin-managed fields (visible, dueDate, gradesReleased) from existing doc
    const existing = await db.collection("courses").doc(COURSE_ID)
      .collection("lessons").doc(LESSON_ID).get();
    if (existing.exists) {
      const d = existing.data();
      if (d.visible !== undefined) lesson.visible = d.visible;
      if (d.dueDate !== undefined) lesson.dueDate = d.dueDate;
      if (d.gradesReleased !== undefined) lesson.gradesReleased = d.gradesReleased;
    }
    const result = await safeLessonWrite(db, COURSE_ID, LESSON_ID, lesson);
    console.log(`✅ Lesson seeded: "${lesson.title}"`);
    console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
    console.log(`   Blocks: ${lesson.blocks.length} | Order: ${lesson.order} | visible: ${lesson.visible}`);
    console.log(`   safeLessonWrite: ${result.action} (preserved ${result.preserved} block IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
