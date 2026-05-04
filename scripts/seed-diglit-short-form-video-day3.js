// seed-diglit-short-form-video-day3.js
// Creates "Short-Form Video Sprint Day 3: Edit in CapCut"
// Course: Digital Literacy, Unit: Short-Form Video Sprint, order: 63.2
// Run: node scripts/seed-diglit-short-form-video-day3.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const LESSON_ID = "short-form-video-day3-edit-capcut";
const COURSE_ID = "digital-literacy";

const lesson = {
  title: "Short-Form Video Sprint — Day 3: Edit in CapCut",
  questionOfTheDay: "Why are hard cuts almost always better than fancy transitions in short-form video?",
  course: "Digital Literacy",
  unit: "Short-Form Video Sprint",
  order: 63.2,
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
      content: "**Question of the Day:** Why are hard cuts almost always better than fancy transitions (spins, swirls, zoom-blurs) in short-form video?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about a TikTok or Reel you watched recently that had really flashy transitions (3D rotations, swirls, zoom-blurs). Did the transitions help or hurt your watch experience? Was it the transitions you remembered, or the actual content?",
      placeholder: "Video I'm thinking of: ...\nTransitions used: ...\nDid they help or hurt: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Build a CapCut timeline by importing, splitting, and arranging clips into the storyboard order",
        "Add on-screen text and auto-captions, then fix caption errors and styling",
        "Sync at least one cut to a music beat (snap to playhead)",
        "Justify when to use a transition vs. a hard cut, applying the 90/10 rule"
      ]
    },

    // ─── MAIN: CAPCUT WALK-THROUGH ──────────────────────────

    {
      id: "section-main",
      type: "section_header",
      icon: "✂️",
      title: "CapCut, Step by Step",
      subtitle: "~12 minutes"
    },
    {
      id: "b-import",
      type: "text",
      content: "## Step 1 — Import + Drag to Timeline\n\nOpen your CapCut project. All your clips from yesterday should already be there.\n\n- Tap **Import** and select all the clips you want to use\n- Drag them to the **timeline** at the bottom in storyboard order\n- The big preview at the top is what your final video will look like\n- The timeline is where you do all the work"
    },
    {
      id: "b-split-jump-cuts",
      type: "text",
      content: "## Step 2 — Split + Delete (Jump Cuts)\n\nA **jump cut** is when you cut out the boring middle of a clip and stitch the two ends together. It's how every YouTuber and TikToker keeps energy high.\n\n- Tap a clip to select it\n- Move the **playhead** (vertical white line) to the spot you want to cut\n- Tap **Split**\n- Tap the dead-time section and tap **Delete**\n\n**Rule:** if a clip has more than 0.5 seconds of nothing happening, cut it. The viewer's thumb is hovering over the swipe button — don't give them a reason to use it."
    },
    {
      id: "b-text",
      type: "text",
      content: "## Step 3 — On-Screen Text\n\nText on screen does two things: it carries the message when the sound is muted (most viewers watch muted at first), and it adds visual energy.\n\n- Tap **Text** → **Add Text**\n- Type the caption, set the font, set the color (white with a black stroke is bulletproof)\n- Drag the text to the **bottom-third caption safe zone** you saw yesterday\n- Drag the edges of the text bar in the timeline to set duration\n- Use **Animation** for entrance/exit effects (keep it simple — the typewriter or a fade is plenty)"
    },
    {
      id: "b-music",
      type: "text",
      content: "## Step 4 — Music\n\nAudio is the second-most-powerful signal after the hook. The right track tells the algorithm \"this video belongs in the same feed as everything else using this sound.\"\n\n- Tap **Audio** → **Sounds**\n- Browse trending sounds OR royalty-free tracks\n- Pick something that matches your video's energy (not just whatever's #1 right now)\n- **Royalty-free first.** If you're going to post publicly, only use CapCut's royalty-free library or sounds marked safe to use. Copyrighted music = takedowns and AUP problems.\n- Drag the audio onto the timeline below your video clips\n- Trim the music so it ends with the video"
    },
    {
      id: "b-sync-beat",
      type: "text",
      content: "## Step 5 — Sync a Cut to a Beat\n\nThis is the move that makes amateur edits feel professional.\n\n- Play your music in CapCut and watch the **waveform** at the bottom of the audio clip\n- Find a strong beat (a big spike in the waveform)\n- Move the playhead to that spike\n- Tap on a clip on the video timeline → **Split**\n- Snap the next clip's start to the playhead\n\nResult: the cut between two shots happens exactly on the beat. The viewer's brain reads the video as \"in time\" with the music — even if they can't tell you why."
    },
    {
      id: "b-captions",
      type: "text",
      content: "## Step 6 — Auto-Captions (then fix them)\n\nMost viewers watch on mute. Captions are not optional.\n\n- Tap **Text** → **Auto-captions**\n- Pick the language (English, Spanish, etc.)\n- Wait for CapCut to transcribe — usually takes 10-30 seconds\n- **Then fix it.** Auto-captions get names, slang, and Spanish-mixed-with-English wrong constantly. Read every caption.\n- Restyle if you want — bold, color, background highlight on the keyword. Keep it readable. Bottom-third safe zone.\n\nIf your video is bilingual, you can set captions to switch languages mid-video — CapCut supports it."
    },
    {
      id: "b-transitions",
      type: "text",
      content: "## Step 7 — Transitions: Use Them Sparingly\n\nThis is where most beginner edits go wrong. CapCut has dozens of fancy transitions — 3D spins, lens flares, zoom-blurs. **Use them almost never.**\n\nRule: **hard cuts > fancy transitions 90% of the time.**\n\n- Hard cut = no transition. Clip ends, next clip starts. Used 90% of the time.\n- The other 10% — a quick whip pan, a flash, or a match cut on a beat — only when the transition itself adds meaning.\n\nFancy transitions scream \"I just downloaded CapCut.\" Hard cuts feel like every video the algorithm pushes."
    },
    {
      id: "img-capcut-timeline",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/capcut-timeline-mock.jpg",
      alt: "A CapCut interface mock showing the timeline editor with multiple video clips arranged in sequence, on-screen captions appearing at specific moments, a music waveform synced to cuts, and a label pointing to a jump cut",
      caption: "CapCut timeline. Notice how the cut between clips lands right on the music waveform's beat, and the on-screen caption appears at the start of the new clip."
    },
    {
      id: "img-90-10-rule",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/hard-cut-vs-transition.jpg",
      alt: "A diagram comparing two video edits: 9 of 10 cuts shown as clean hard cuts labeled use this and 1 of 10 cuts shown as a flashy spin transition labeled use rarely, both displayed on vertical phone frames",
      caption: "The 90/10 rule. Hard cuts everywhere by default. Fancy transitions only when the transition itself is the joke."
    },
    {
      id: "callout-tieback",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Tie-back to the Algorithm Economy unit:**\n\n- Jump cuts kill dead time → keeps **completion rate** high\n- Captions let viewers watch on mute → unlocks the silent-watcher audience\n- Synced cuts to a trending sound → algorithm groups your video with everything else using that sound (a **discovery channel** by itself)\n- Hard cuts > fancy transitions → the **content** stays the focus, not the editor's plugin library\n\nEvery editing decision is a signal decision."
    },
    {
      id: "q-jump-cut-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're editing a 45-second clip and 8 seconds of it is a slow walk between two locations where nothing happens. What's the right move?",
      options: [
        "Leave it in — viewers want context",
        "Speed up that section to 4× and leave it in",
        "Split the clip, delete the dead time, and use a hard cut to jump straight to the next moment",
        "Replace the dead time with a 3D transition effect to cover the gap"
      ],
      correctIndex: 2,
      explanation: "Dead time tanks your completion rate. The standard short-form move is a jump cut — split, delete the boring middle, hard cut to the next moment. Speeding up the dead time is sometimes okay (especially if the speed-up itself is the joke), but cutting it out entirely is almost always better.",
      difficulty: "apply"
    },
    {
      id: "q-transitions-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which statement best describes when to use a fancy transition (spin, lens flare, zoom-blur) in a short-form video?",
      options: [
        "Almost never — about 10% of cuts at most, and only when the transition itself adds meaning (a beat, a match cut, a joke)",
        "Between every clip — it adds visual variety",
        "Whenever you cut between two locations",
        "Only between the hook and the rest of the video"
      ],
      correctIndex: 0,
      explanation: "The 90/10 rule. Hard cuts read as professional and let the content stay the focus. Fancy transitions read as amateur and pull attention to the editor's effects panel. Use transitions only when the transition itself is doing work — landing on a beat, matching one shot to another, or being the punchline.",
      difficulty: "understand"
    },
    {
      id: "q-edit-plan-sa",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your edit plan for the next 28 minutes. List, in order: (1) which jump cuts you need to make to kill dead time, (2) where on-screen captions appear, (3) one specific cut you'll sync to a music beat, (4) which one transition (if any) you'll use and why.",
      placeholder: "Jump cuts to make: ...\nCaption moments: ...\nBeat-synced cut: ...\nTransition I'll use (or none): ...",
      difficulty: "create"
    },

    // ─── ACTIVITY: EDIT TIME ────────────────────────────────

    {
      id: "section-activity",
      type: "section_header",
      icon: "🎧",
      title: "Edit Time",
      subtitle: "~28 minutes"
    },
    {
      id: "b-edit-block",
      type: "text",
      content: "## Headphones In. Heads Down.\n\nLuke and Lachlan circulate the room. Tap shoulder if you're stuck — it's faster than guessing for 5 minutes.\n\n## Target by end of class:\n\n- **Rough cut** assembled — clips in storyboard order, dead time killed, total length 30-60 seconds\n- **Captions** added (auto-captions fixed, OR manually typed)\n- **Music** added with at least one cut snapped to a beat\n- **Hard cuts** used everywhere by default; if you used a transition, you can name what it adds\n\n## If You Finish Early\n\n- Tighten the hook — re-cut your first 3 seconds and ask a neighbor: \"would you swipe past this?\"\n- Color grade — CapCut → Adjust → bump contrast and saturation slightly\n- **Export draft** to your phone as a checkpoint (Day 4 you do the final export)"
    },
    {
      id: "b-resources",
      type: "text",
      content: "## Resources While You Edit\n\nHit any of these if you get stuck. Linked tutorials are short — 5 minutes or less."
    },
    {
      id: "ext-capcut-tutorial",
      type: "external_link",
      url: "https://www.capcut.com/learning-hub",
      title: "CapCut Learning Hub — Editing Basics",
      description: "Official CapCut tutorials. Cover splitting, captions, music sync, and exporting. Pick the one that matches your stuck point."
    },
    {
      id: "ext-capcut-music",
      type: "external_link",
      url: "https://support.capcut.com/hc/en-us/articles/360054428272-Use-music-in-CapCut",
      title: "Adding Music + Royalty-Free Tracks in CapCut",
      description: "How to find royalty-free music inside CapCut. Critical if you plan to post publicly — copyrighted tracks get videos muted or taken down."
    },
    {
      id: "ext-tiktok-music-rules",
      type: "external_link",
      url: "https://support.tiktok.com/en/safety-hc/account-and-user-safety/intellectual-property",
      title: "TikTok — Intellectual Property + Music Rules",
      description: "TikTok's rules for music use. Most TikTok in-app sounds are licensed, but third-party music outside the app library is not safe."
    },
    {
      id: "ext-captions-best-practices",
      type: "external_link",
      url: "https://www.capcut.com/tools/auto-subtitle-generator",
      title: "CapCut Auto-Captions — Best Practices",
      description: "How auto-captions work in CapCut. Always read through and fix names, slang, and code-switched English/Spanish phrases."
    },

    // ─── CLOSING ────────────────────────────────────────────

    {
      id: "section-closing",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~3 minutes"
    },
    {
      id: "callout-guardrails",
      type: "callout",
      style: "warning",
      icon: "🛡️",
      content: "**Content guardrails — apply to your edit:**\n\n- **Royalty-free or in-app sounds only** if you might post publicly. No yanked-from-Spotify tracks.\n- **No PII in captions** — don't type out a classmate's last name in an on-screen text.\n- **No shaming** — even in jump cuts, even as a joke. If a classmate is on camera, they have to be okay with how you're cutting them.\n- **PAPS AUP** — same rules as Day 1 and 2.\n- **Posting publicly is optional** — submitting to PantherLearn tomorrow is what's required."
    },
    {
      id: "callout-due-date",
      type: "callout",
      style: "note",
      icon: "📅",
      content: "**Save before you leave:** Save your CapCut project. If CapCut auto-saves to cloud (it usually does on the same login), you're safe. If not, export a draft .mp4 to your phone as a backup.\n\n**Tomorrow (Day 4):** polish + showcase. Final export → upload → showcase on the projector → vote → mana for winners."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "**Exit Ticket:** What's the current length of your rough cut? What's the ONE thing you still need to fix tomorrow before you call this done?",
      placeholder: "Current length: ...\nOne thing to fix: ...",
      difficulty: "reflect"
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at your timeline. Connect ONE editing choice you made today (a jump cut, a caption moment, a beat-synced cut, your music pick) directly to an algorithm signal you studied earlier in the unit. Why did you make that choice?",
      placeholder: "Editing choice: ...\nAlgorithm signal it triggers: ...\nWhy I made the choice: ...",
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
        { term: "Timeline", definition: "The horizontal track at the bottom of CapCut where you arrange clips, audio, captions, and effects in time order." },
        { term: "Playhead", definition: "The vertical line on the timeline that marks your current position. Move it to choose where to split, add text, or insert audio." },
        { term: "Jump cut", definition: "A cut that removes dead time within a clip, joining the active parts together. Keeps energy high and completion rate up." },
        { term: "Beat sync", definition: "Lining up a video cut with a strong moment in the music's waveform. Makes the edit feel intentional and \"in time.\"" },
        { term: "Hard cut", definition: "A direct edit between two clips with no transition effect. The default for short-form video — used roughly 90% of the time." },
        { term: "Auto-captions", definition: "CapCut feature that listens to your audio and generates on-screen captions. Always proofread — names, slang, and bilingual mixes get errors." },
        { term: "Royalty-free music", definition: "Music licensed to use without paying royalties. CapCut's in-app sound library is the safest source for school content." }
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
