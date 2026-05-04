// seed-diglit-short-form-video-day4.js
// Creates "Short-Form Video Sprint Day 4: Polish + Showcase"
// Course: Digital Literacy, Unit: Short-Form Video Sprint, order: 63.3
// Run: node scripts/seed-diglit-short-form-video-day4.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const LESSON_ID = "short-form-video-day4-polish-showcase";
const COURSE_ID = "digital-literacy";

const lesson = {
  title: "Short-Form Video Sprint — Day 4: Polish + Showcase",
  questionOfTheDay: "If you had one more day on this video, what would you change first — and why is that the highest-leverage fix?",
  course: "Digital Literacy",
  unit: "Short-Form Video Sprint",
  order: 63.3,
  visible: false,
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎬",
      title: "Warm Up",
      subtitle: "~3 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you had one more day on this video, what's the FIRST thing you'd change — and why is that the highest-leverage fix?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Open your CapCut project. Watch your rough cut once, all the way through, with the sound up. Now answer: what's the first thing you'd change if you had one more day, and why does fixing that matter more than anything else?",
      placeholder: "First thing I'd change: ...\nWhy it matters most: ...",
      difficulty: "reflect"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply a polish pass to your video — tighten the hook, fix caption timing, balance audio levels",
        "Export a final 30-60 second .mp4 in vertical 1080×1920 and upload it to PantherLearn",
        "Critically evaluate classmates' videos using the four rubric categories (Hook, Pacing, Audio + Captions, Story)",
        "Cast informed votes for Best Hook / Best Pacing / Most Surprising / Most Likely to Go Viral"
      ]
    },

    // ─── MAIN: POLISH ───────────────────────────────────────

    {
      id: "section-main",
      type: "section_header",
      icon: "💎",
      title: "Polish Pass",
      subtitle: "~20 minutes"
    },
    {
      id: "b-polish-checklist",
      type: "text",
      content: "## The Polish Checklist\n\nGo through your video in this order. Don't skip steps.\n\n### 1. Tighten the Hook (3 min)\nWatch ONLY the first 3 seconds. Out of context, would you swipe? If yes, re-cut. Common fixes:\n- Open on a stronger visual\n- Add an on-screen text question to the very first frame\n- Trim the first 0.5 seconds of pre-action\n\n### 2. Caption Timing (4 min)\nPlay the video on mute. Each caption should appear exactly when the moment it describes lands — not 0.3s late, not 0.3s early. Drag the edges of caption text bars on the timeline to fine-tune.\n\n### 3. Audio Balance (3 min)\n- Voice should be clearly readable above the music — not buried\n- Music shouldn't be loud enough to clip or distort\n- CapCut → tap audio clip → **Volume** → adjust voice up to ~100%, music down to ~30-50%\n\n### 4. Length Check (1 min)\n- Total length must be **30-60 seconds**\n- Under 30 = trim B-roll OR add a beat to your payoff\n- Over 60 = cut a panel that isn't earning its time\n\n### 5. Final Watch (2 min)\nPlay it through one more time, full screen, sound up. If you'd swipe past it on TikTok — fix it now."
    },
    {
      id: "img-polish-checklist",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/polish-checklist.jpg",
      alt: "A checklist graphic with five polish steps for short-form video: tighten hook, caption timing, audio balance, length check, final watch — each step with a small icon next to it",
      caption: "The 5-step polish pass. Run through every video in this order before exporting."
    },
    {
      id: "b-export",
      type: "text",
      content: "## Final Export\n\n- Tap **Export** (top right in CapCut)\n- Resolution: **1080p**\n- Frame rate: **30 fps** (60 fps fine if your phone supports it)\n- Aspect ratio: **9:16 (vertical)** — should be set automatically since you shot vertical\n- Wait for the export bar to finish\n- Save the .mp4 to your phone\n\n## Upload to PantherLearn\n\nGo to today's lesson submission block on PantherLearn (it'll appear here once Luke flips it visible). Upload the final .mp4. **This is the only required submission** — public posting to TikTok/Reels is optional and needs parent consent if you're under 18."
    },
    {
      id: "callout-tieback",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The polish pass IS the difference.** A rough cut and a polished cut have the same clips and the same idea — but the polished one keeps viewers on screen long enough to trigger the algorithm signals (completion rate, re-watch, share) you've been studying for weeks.\n\nThe people whose videos blow up aren't the ones with better cameras. They're the ones who don't ship the rough cut."
    },
    {
      id: "q-polish-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Your rough cut is 47 seconds long. The hook is fine, the payoff lands, but in the middle there's a 6-second stretch where your face is talking and the energy dips. What's the right polish move?",
      options: [
        "Leave it — 47 seconds is in range, so length is fine",
        "Speed up that section to 2× and leave the rest alone",
        "Cut the dip — jump cut to remove the lowest-energy 4 seconds, drop the total to 43 seconds. Tighter wins.",
        "Add a flashy transition to mask the dip"
      ],
      correctIndex: 2,
      explanation: "Length being \"in range\" doesn't mean the video is the right length. Tighter videos perform better because viewers stay all the way through. Cutting 4 seconds of low-energy middle takes you from \"good enough\" to \"actually punchy\" without losing anything important.",
      difficulty: "apply"
    },
    {
      id: "q-export-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When exporting your final video from CapCut, which set of settings is correct for short-form video?",
      options: [
        "720p, 16:9 horizontal, 24fps — final .mov",
        "4K, 1:1 square, 60fps — final .mp4",
        "It doesn't matter — CapCut auto-detects the right settings for any platform",
        "1080p, 9:16 vertical, 30fps — final .mp4"
      ],
      correctIndex: 3,
      explanation: "Short-form video is 9:16 vertical (1080×1920). 1080p is the right resolution for TikTok, Reels, and Shorts (4K is overkill and slow to upload). 30fps is the standard. .mp4 is the universal export format that uploads cleanly everywhere.",
      difficulty: "remember"
    },

    // ─── ACTIVITY: SHOWCASE ─────────────────────────────────

    {
      id: "section-activity",
      type: "section_header",
      icon: "🏆",
      title: "Showcase + Vote",
      subtitle: "~20 minutes"
    },
    {
      id: "b-showcase-format",
      type: "text",
      content: "## Showcase Format\n\nEvery video plays. **No skipping.** Sound on, full screen, projector. We watch every classmate's video the way the algorithm would — full-screen, with sound, no distractions.\n\nAfter each video — round of applause. That's the rule.\n\n## What You're Watching For\n\nYou're voting at the end, so watch with intent. Use the rubric categories as your lens:\n\n- **Best Hook** — Did the first 3 seconds stop you?\n- **Best Pacing** — Did it feel tight? No dead air? Energy maintained from start to finish?\n- **Most Surprising** — Did the payoff actually surprise you in a way you didn't see coming?\n- **Most Likely to Go Viral** — Knowing what we know about the algorithm — would this video actually spread?\n\nAt the end of the showcase, vote on a slip or quick form for each category. **Mana goes to the winners.**"
    },
    {
      id: "b-showcase-rubric",
      type: "text",
      content: "## The Project Rubric (out of 20)\n\nThis is how your video is graded — independent of the showcase votes.\n\n- **Hook (5)** — First 3 seconds. Does it stop the scroll? Specific visual, question, claim, or pattern interrupt.\n- **Pacing & Editing (5)** — Cut density, no dead air, jump cuts where needed, length feels tight.\n- **Audio & Captions (5)** — Music synced to a beat or moment, captions readable on mute, audio levels balanced.\n- **Story & Concept (5)** — Clear idea. Payoff matches setup. You can describe it in one sentence.\n\nShowcase awards (Best Hook / Best Pacing / Most Surprising / Most Likely to Go Viral) are peer votes — they don't change your grade, but winners get mana."
    },
    {
      id: "img-showcase-awards",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/showcase-awards.jpg",
      alt: "Four trophy-style award cards arranged in a row: Best Hook, Best Pacing, Most Surprising, and Most Likely to Go Viral, each with a distinctive icon and color",
      caption: "The four showcase categories. Cast an informed vote — back it up with the rubric."
    },
    {
      id: "q-vote-sa",
      type: "question",
      questionType: "short_answer",
      prompt: "After the showcase, fill this in. For each category, name the classmate's video that won your vote AND give a one-sentence reason tied to the rubric.",
      placeholder: "Best Hook: ... — because ...\nBest Pacing: ... — because ...\nMost Surprising: ... — because ...\nMost Likely to Go Viral: ... — because ...",
      difficulty: "evaluate"
    },
    {
      id: "b-resources",
      type: "text",
      content: "## After Class — If You Want to Keep Going\n\nThis project ends today, but if you caught the bug, the links below are where to keep learning. None of these are required."
    },
    {
      id: "ext-tiktok-creator-academy",
      type: "external_link",
      url: "https://www.tiktok.com/creators/creator-portal/en-us/",
      title: "TikTok Creator Portal",
      description: "Free official resource. Deep dives on hooks, watch time, monetization, and what the algorithm actually rewards."
    },
    {
      id: "ext-capcut-effects",
      type: "external_link",
      url: "https://www.capcut.com/learning-hub",
      title: "CapCut Learning Hub — Advanced",
      description: "Once you've got the basics, this hub has color grading, masking, keyframe animation, and effects walkthroughs."
    },
    {
      id: "ext-mrbeast-rules",
      type: "external_link",
      url: "https://www.youtube.com/watch?v=q1c4_R2AfmM",
      title: "Why MrBeast's videos work (analysis)",
      description: "An analysis of MrBeast's hook structure, retention strategy, and why his videos hold viewers to the end. Practical takeaways for any short-form creator."
    },

    // ─── CLOSING ────────────────────────────────────────────

    {
      id: "section-closing",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~2 minutes"
    },
    {
      id: "callout-guardrails",
      type: "callout",
      style: "warning",
      icon: "🛡️",
      content: "**Final guardrail check before you submit OR post publicly:**\n\n- **No PII** — last names, phone numbers, addresses, schedule cards, license plates anywhere in the video?\n- **Anyone on camera consented?**\n- **Music is royalty-free or in-app?** (Critical if you post publicly.)\n- **No shaming, no personal attacks?**\n- **PAPS AUP followed?**\n- **Posting publicly?** Under 18 = parent consent required first. Talk to Luke if you're unsure."
    },
    {
      id: "callout-due-date",
      type: "callout",
      style: "note",
      icon: "📅",
      content: "**Required today:** Final 30-60 second .mp4 (vertical 1080×1920) uploaded to the PantherLearn submission block. **End of class is the deadline.**\n\n**Optional:** Post publicly to TikTok / Reels / Shorts (with parent consent if you're under 18). Tag the school account if you do — winners may show up on the DL hallway display."
    },
    {
      id: "q-closer",
      type: "question",
      questionType: "short_answer",
      prompt: "**Closer:** One line — what would you change if you had another day?",
      placeholder: "If I had another day, I would: ...",
      difficulty: "reflect"
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "Look back at the whole 4-day sprint — deconstruction, storyboard, shoot, edit, polish. What's ONE thing about how short-form video gets made that you didn't understand a week ago, but understand now? How does that change the way you'll watch TikTok / Reels going forward?",
      placeholder: "What I understand now: ...\nHow that changes how I watch short-form video: ...",
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
        { term: "Polish pass", definition: "Final round of editing focused on tightening the hook, fixing caption timing, balancing audio, and verifying length. The difference between a rough cut and a final cut." },
        { term: "Audio balance", definition: "Adjusting the volume of voice and music so dialogue stays readable above the music without either clipping or distorting." },
        { term: "Export", definition: "Rendering your CapCut project into a finished .mp4 file. Settings: 1080p, 9:16 vertical, 30fps for short-form video." },
        { term: "Submission block", definition: "The PantherLearn block where you upload your final .mp4. Required for the project grade." },
        { term: "Showcase", definition: "Class viewing of every video on the projector with sound and full screen. Followed by peer voting on Best Hook / Best Pacing / Most Surprising / Most Likely to Go Viral." },
        { term: "Rubric", definition: "The 4-category scoring guide (Hook, Pacing & Editing, Audio & Captions, Story & Concept) used to grade your project out of 20." }
      ]
    }
  ],
  updatedAt: new Date()
};

async function seed() {
  try {
    await db
      .collection("courses")
      .doc(COURSE_ID)
      .collection("lessons")
      .doc(LESSON_ID)
      .set(lesson);
    console.log(`✅ Lesson seeded: "${lesson.title}"`);
    console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
    console.log(`   Blocks: ${lesson.blocks.length}`);
    console.log(`   Order: ${lesson.order}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
