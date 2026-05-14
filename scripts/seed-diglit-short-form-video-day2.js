// seed-diglit-short-form-video-day2.js
// Creates "Short-Form Video Sprint Day 2: Script + Shoot"
// Course: Digital Literacy, Unit: Short-Form Video Sprint, order: 63.1
// Run: node scripts/seed-diglit-short-form-video-day2.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const LESSON_ID = "short-form-video-day2-script-shoot";
const COURSE_ID = "digital-literacy";

const lesson = {
  title: "Short-Form Video Sprint — Day 2: Script + Shoot",
  questionOfTheDay: "What's one shot from your storyboard that has to look exactly right, or the whole video falls apart?",
  course: "Digital Literacy",
  unit: "Short-Form Video Sprint",
  order: 63.1,
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
      content: "**Question of the Day:** Look at your storyboard. What's ONE shot that has to look exactly right, or the whole video falls apart?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Pull out your storyboard from yesterday. Identify the one shot that carries the most weight — your hook, your payoff, or your signature beat. Describe it: what's in frame, what's the camera doing, what's the on-screen text?",
      placeholder: "Critical shot: ...\nWhat's in frame: ...\nCamera move: ...\nOn-screen text: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Distinguish when a video needs a script vs. a beat sheet",
        "Apply vertical-first shooting rules (1080×1920, rule of thirds, get close)",
        "Capture at least 5 usable clips with multiple takes per shot",
        "Get all footage off your phone — either into your CapCut project (Path A) or into Google Drive for WeVideo on your Chromebook (Path B)"
      ]
    },

    // ─── MAIN: SHOOT TECHNIQUE ──────────────────────────────

    {
      id: "section-main",
      type: "section_header",
      icon: "📱",
      title: "Vertical First. Get Close. Shoot More.",
      subtitle: "~10 minutes"
    },
    {
      id: "b-vertical-only",
      type: "text",
      content: "## Rule 1: Vertical Only\n\nLock your phone in portrait. Do not film horizontally and \"crop later\" — you lose more than half your resolution and the cropped frame will look soft.\n\nYour final export target is **1080×1920** (vertical, 9:16). Shoot at that aspect ratio from the start.\n\nIf your phone has a 4K vertical option, use it. More resolution = more freedom to reframe in CapCut without quality loss."
    },
    {
      id: "b-rule-of-thirds",
      type: "text",
      content: "## Rule 2: Rule of Thirds Still Applies\n\nVertical doesn't kill the rule of thirds — it changes it. Imagine your vertical frame split into a 3×3 grid. Put your subject's eyes (if it's a person) on the **upper third line**, not dead center. The bottom third is where on-screen captions live, so keep that area cleaner."
    },
    {
      id: "b-get-close",
      type: "text",
      content: "## Rule 3: Get Close\n\nShort-form video lives on a phone screen the size of your hand. Wide shots that work in a movie theater look empty in a TikTok. **Get close.**\n\n- For people: face fills the upper two-thirds of the frame\n- For objects: zoom in until detail is obvious\n- For locations: pick ONE detail of the location, not the whole scene"
    },
    {
      id: "b-multiple-takes",
      type: "text",
      content: "## Rule 4: Shoot Multiple Takes\n\nFor every shot on your storyboard, shoot it **at least 3 times**. The version you use in editing is rarely your first take.\n\n- Take 1 = warmup (you'll throw it out 80% of the time)\n- Take 2 = better delivery, better framing\n- Take 3 = the one you actually use\n\nB-roll = extra footage that's not in your storyboard. Shoot it anyway. Stuff in your environment, hands doing something, a closeup of a detail. B-roll saves you in editing when a cut feels too long.\n\n**Silence is allowed.** Let a beat breathe. Some of the best short-form videos have 1-2 second silent holds where the viewer reads on-screen text or absorbs a visual."
    },
    {
      id: "img-rule-of-thirds",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/vertical-rule-of-thirds.jpg",
      alt: "A vertical 1080x1920 phone frame with a 3x3 rule-of-thirds grid overlay, showing a person's eyes aligned to the upper-third line and a clear bottom-third caption safe zone",
      caption: "Vertical rule of thirds. Eyes on the upper line. Captions live in the bottom third — keep that zone visually clean."
    },
    {
      id: "img-short-form-anatomy",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/short-form-anatomy.jpg",
      alt: "An infographic of the anatomy of a winning short-form video as a vertical 45-second timeline split into Hook, Setup, Build/Loop, Payoff, and Signature Beat sections, with arrows mapping each section to algorithm signals",
      caption: "Anatomy of a winning short-form video. Each section is built to trigger a specific algorithm signal — hook for completion rate, setup for comments, payoff for shares, signature beat for re-watches."
    },
    {
      id: "callout-script-vs-beat",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Script vs. Beat Sheet — pick the right tool:**\n\n- **Script** (every word written out) — for narrative formats: explainers, sketches, tutorials with voiceover. If your video's success depends on what you say, write it down.\n- **Beat sheet** (a numbered list of moments to capture) — for non-narrative formats: day-in-life, montage, reaction, local pride. You're capturing moments, not delivering lines."
    },
    {
      id: "q-vertical-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You shoot your video horizontally (landscape) on your phone, planning to crop to vertical in CapCut. What's the actual problem with this approach?",
      options: [
        "Cropping is fine — modern phones have enough resolution that you won't notice",
        "You lose more than half your resolution and the cropped vertical frame will look noticeably soft",
        "CapCut doesn't support cropping landscape footage to vertical",
        "It only matters if you're posting on TikTok, not on Reels or Shorts"
      ],
      correctIndex: 1,
      explanation: "A 1920×1080 horizontal frame, cropped to vertical 9:16, gives you roughly 608×1080 — barely a third of the original pixel count. Then you'd need to upscale that to 1080×1920 for export, which softens everything. Lock the phone in portrait from the start.",
      difficulty: "apply"
    },
    {
      id: "q-script-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're making a 40-second \"day in the life at school\" montage with no dialogue — just clips and music. What's the right prep document?",
      options: [
        "A beat sheet — a numbered list of specific moments and shots to capture",
        "A full word-for-word script",
        "Nothing — montages are improvised",
        "A script for the music's lyrics"
      ],
      correctIndex: 0,
      explanation: "Montage and day-in-life formats don't have spoken lines, so a word-for-word script wastes time. A beat sheet (\"1. Walking through hallway between classes. 2. Closeup of cafeteria tray. 3. Practice field at end of day.\") gives you a clear shot list without locking in dialogue you don't have.",
      difficulty: "understand"
    },
    {
      id: "q-shot-list-sa",
      type: "question",
      questionType: "short_answer",
      prompt: "Write out your shot list for today. List each shot from your storyboard (1-6), then add at least 2 B-roll shots you'll capture as backup. Mark each shot as either S (script — has spoken dialogue) or V (visual only).",
      placeholder: "Shot 1: ... (S/V)\nShot 2: ... (S/V)\n...\nB-roll 1: ...\nB-roll 2: ...",
      difficulty: "create"
    },

    // ─── ACTIVITY: SHOOT ────────────────────────────────────

    {
      id: "section-activity",
      type: "section_header",
      icon: "🎥",
      title: "Shoot Time",
      subtitle: "~22 minutes"
    },
    {
      id: "b-shoot-block",
      type: "text",
      content: "## Phones Out. Spread Out (Inside the Room).\n\nAll shooting today happens **inside this classroom**. No hallway, no locker, no leaving for any reason — that's a separate conversation for another day. Pick a corner of the room, the front board, a desk setup, the back wall, near the window — work the space you have.\n\nIf your storyboard has a shot that ONLY works in another location (your kitchen, the lunchroom, the practice field, your neighborhood block), that shot is **homework**. Capture it tonight or before class tomorrow and AirDrop/upload it to your CapCut project. You can still build everything else today.\n\n## Minimum Deliverables (must be done by end of period):\n\n- **At least 5 usable clips** that map to your storyboard panels (shot in this room)\n- **At least 2 B-roll clips** as backup (classroom objects, hands, details, ambient room shots)\n- **Multiple takes** of your hook shot (panel 1) and your payoff shot (panel 5 or 6) — at least 3 takes each\n- **Re-shoot** any clip that's shaky, out of focus, or has bad audio\n- Any location-only shots: shoot tonight as homework, upload before Day 3\n\n## Working a Small Space\n\n- Move desks out of frame if you need a clean background\n- Use the whiteboard, posters, or a window for visual variety\n- Shoot closeups (hands, an object on the desk, a face) — short-form rewards tight framing anyway\n- Different corners of the room = different \"locations\" if you reframe carefully\n\n## Sound Tips\n\n- If you have voice in your video: shoot during a quieter moment, hold the phone close to your face (within arm's length)\n- If your video uses music only (no dialogue): room sound doesn't matter — but make sure no one is talking in the background that shouldn't be in your video\n- AirPods/earbuds can act as a mic — plug them in and clip the mic near your collar"
    },
    {
      id: "b-wrap-upload",
      type: "text",
      content: "## Wrap (last 2 minutes)\n\nGet all your clips off your phone and into a place you can edit from tomorrow. Pick ONE path:\n\n- **Path A — CapCut on your phone:** Upload all clips into your CapCut project. CapCut syncs to cloud automatically when you're logged in. Tomorrow you'll edit on the phone.\n- **Path B — WeVideo on your Chromebook:** AirDrop / upload your clips to Google Drive. Tomorrow you'll open WeVideo on your Chromebook and import them from Drive. WeVideo is the school-approved Chromebook editor — works the same way as CapCut, just in the browser.\n\nDo NOT leave footage stuck on one device with no backup — phones break, get lost, get reset overnight. If your footage isn't accessible from your editing device by tomorrow, you'll lose half of Day 3 re-shooting in this room.\n\nThe links below cover both editors."
    },
    {
      id: "ext-capcut-getting-started",
      type: "external_link",
      url: "https://www.capcut.com/tools/desktop-video-editor",
      title: "CapCut — Getting Started (desktop + mobile)",
      description: "Official CapCut walkthrough. Covers project setup, importing clips, and saving your work to the cloud so it syncs across devices."
    },
    {
      id: "ext-wevideo-chromebook",
      type: "external_link",
      url: "https://www.wevideo.com/education",
      title: "WeVideo — Editing on a Chromebook",
      description: "WeVideo runs in the browser and is school-approved for Chromebooks. Same concepts as CapCut — timeline, splits, captions, music. Use this path if you prefer editing on your school device."
    },
    {
      id: "ext-airdrop",
      type: "external_link",
      url: "https://support.apple.com/en-us/HT204144",
      title: "How to use AirDrop (Apple support)",
      description: "Quick reference for AirDropping clips between phones and to a Mac. Useful if you're shooting on a friend's phone or moving footage to a school computer."
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
      content: "**Content guardrails — re-read before shooting:**\n\n- **Don't film classmates without their okay.** A nod isn't enough — get a clear yes.\n- **No PII in frame** — no last names on jerseys, no schedule cards, no addresses, no license plates.\n- **PAPS AUP** — no inappropriate hand gestures, no profanity in audio if you plan to post publicly, no minors visible without consent.\n- **Sensitive topics** (mental health, family, identity) — talk to Mr. McCarthy before continuing.\n- **Posting publicly is optional.** Submission to PantherLearn is the only required upload."
    },
    {
      id: "callout-due-date",
      type: "callout",
      style: "note",
      icon: "📅",
      content: "**Due by end of class today:**\n- All clips uploaded to your CapCut project (not just on your phone).\n- Hook + payoff shots have at least 3 takes each.\n- 2 B-roll clips captured.\n\n**Tomorrow (Day 3):** edit in CapCut. If your footage isn't there, you'll lose half the period re-shooting."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "**Exit Ticket:** How many clips did you upload to CapCut by the end of class? Which shot are you most worried about looking right when you start editing tomorrow, and why?",
      placeholder: "Clips uploaded: ...\nShot I'm worried about: ...\nWhy: ...",
      difficulty: "reflect"
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "Compare what you actually shot to what was on your storyboard. What changed, and why? Did you find a better shot in the moment? Did one of your storyboard panels turn out to be impossible to film and need replacing?",
      placeholder: "Shots that match storyboard: ...\nShots that changed: ...\nWhy they changed: ...",
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
        { term: "9:16 / 1080×1920", definition: "Vertical aspect ratio for short-form video. Width 1080 pixels by height 1920 pixels. Shoot in portrait, never crop landscape." },
        { term: "Rule of thirds", definition: "Split the frame into a 3×3 grid. Place subjects on the lines, not dead center. In vertical, eyes on the upper-third line works well." },
        { term: "Script", definition: "Word-for-word text of what's said in your video. Use for explainers, sketches, voiceover tutorials." },
        { term: "Beat sheet", definition: "Numbered list of moments to capture. Use for non-narrative formats — montages, day-in-life, reactions." },
        { term: "B-roll", definition: "Extra footage outside your main shots — environment, hands, details. Used in editing to cover cuts and add texture." },
        { term: "Take", definition: "One attempt at filming a shot. Always shoot 3+ takes per shot — your first is rarely your best." }
      ]
    }
  ],
  updatedAt: new Date()
};

async function seed() {
  try {
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
