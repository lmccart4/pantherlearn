// seed-diglit-psa-day3.js
// Digital Literacy — PSA Sprint, Day 3: Production Day (Wed 5/27/2026)
// Run: node scripts/seed-diglit-psa-day3.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "psa-day3-production";

const lesson = {
  title: "PSA Sprint Day 3 — Production Day",
  questionOfTheDay: "85% of social-feed video gets watched on mute. What does that fact change about how you produce a PSA?",
  course: "Digital Literacy",
  unit: "PSA Sprint",
  order: 64.2,
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
      content: "**Question of the Day:** 85% of social-feed video gets watched on mute. What does that fact change about how you produce a PSA?"
    },
    {
      id: "b-warmup-intro",
      type: "text",
      content: "Heads-down work day. You have your storyboard, your sources, your design lock, your scripts. Today the only thing standing between you and a finished PSA is **execution.**\n\nThis is the day where students fall behind by chasing perfection on the wrong things. Read the production rules below before you start. The mid-period checkpoint at minute 25 is a hard checkpoint — if you're behind, we triage."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Today's first move: open your storyboard or poster sketch from yesterday. Write below the very next concrete thing you have to do — like 'film the establishing shot in the hallway' or 'lay out poster 1 in Canva at 1080x1080.' One sentence. Then go do it.",
      placeholder: "Next concrete action: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Produce a rough cut (video) or draft layout (posters) by the mid-period checkpoint",
        "Apply caption-first design — every video must work on mute; every poster must read at 6 feet",
        "Export to the correct delivery format (300 DPI for print, 1080x1080 for IG, 9:16 vertical for school monitors)",
        "Cite all sources visibly on screen or in the caption — no source = cut the claim"
      ]
    },

    // ─── MAIN: WORK MODE ──────────────────────────────────────

    {
      id: "section-workmode",
      type: "section_header",
      icon: "🛠️",
      title: "Work Mode — Read This Once, Then Build",
      subtitle: "~30 minutes (heads-down)"
    },
    {
      id: "b-video-rules",
      type: "text",
      content: "## If you're making a video\n\n- **Captions are required.** Every word of voiceover or dialogue gets captioned. Most people watch on mute — a video without captions is a video most people skip without context.\n- **Hook in the first 3 seconds.** This is non-negotiable. The first frame should already be the strongest thing in the piece.\n- **B-roll fills the gaps.** When the voiceover is talking, the visuals should be doing something. Don't sit on a static shot for 8 seconds.\n- **Voiceover quality matters.** Record in the quietest spot you can find. Phone in a closet works. Phone in the cafeteria does not.\n- **Music: royalty-free only.** Pixabay Music, YouTube Audio Library, CapCut commercial-use library. Tag it in your caption when you submit.\n- **Sources on screen.** Every stat needs the source visible at the bottom of the frame when the stat appears (e.g., \"CDC, 2024\"). Or list all sources at the very end on a credits frame.\n- **Length: ~60 seconds.** 50–70 is fine. 90 is too long. 30 is too short to do the structure justice."
    },
    {
      id: "img-production-cheatsheet",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/psa-production-cheatsheet.jpg",
      alt: "A two-column production cheatsheet titled 'Video' and 'Posters'. The video column lists captions required, hook in first 3 seconds, b-roll, voiceover quality, royalty-free music, sources on screen, ~60 second length. The poster column lists 6-foot readability test, headline hierarchy, single dominant CTA, source citations, two export sizes (300 DPI print + 1080x1080 digital), and white space. Clean infographic style on dark background.",
      caption: "Pin this open while you work. If you skip a line, your grade drops."
    },
    {
      id: "b-poster-rules",
      type: "text",
      content: "## If you're making posters\n\n- **6-foot readability test.** Open your poster on your laptop, walk 6 feet away, and look back. Can you read the headline and the CTA? If not, the type is too small or the contrast is too low.\n- **One dominant headline per poster.** One. Not three competing pieces of text fighting for attention.\n- **Source citation on each poster.** Small text at the bottom: e.g., \"Source: Pew Research Center, 2024.\" If you can't cite it, cut the claim — same rule as video.\n- **CTA on every poster.** Each of your 3 posters must show the call-to-action. Same CTA across all 3, not three different actions.\n- **White space is your friend.** A poster with breathing room reads. A poster crammed edge to edge gets ignored.\n- **Two export sizes from one design.** 300 DPI print version (11x17 or 18x24) AND a 1080x1080 IG square OR 9:16 vertical for school monitors. Do both before you submit."
    },
    {
      id: "callout-sources-onscreen",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Sources must be visible.** Either on screen at the moment a stat appears, or as a final credits frame (video) / footer (poster). Sources hidden in the caption only do not count for the rubric. The data and the source travel together — always."
    },
    {
      id: "q-mute-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "About 85% of social-media video gets watched on mute, according to industry research. Which production decision is the MOST important consequence of that fact for your PSA?",
      options: [
        "Use only royalty-free music to avoid copyright strikes",
        "Caption every word of voiceover and on-screen dialogue, and burn the captions into the video",
        "Make the video shorter so people don't lose interest",
        "Use a louder soundtrack to compensate for muted playback"
      ],
      correctIndex: 1,
      explanation: "If most viewers never hear your audio, every word the audio carries has to also appear as on-screen text. Burned-in captions (not just auto-captions the platform might toggle off) make sure your message lands whether the volume is up or off. Royalty-free music matters too, but it doesn't solve the mute problem — captions do.",
      difficulty: "apply"
    },

    // ─── ACTIVITY: PRODUCTION + CHECKPOINT ────────────────────

    {
      id: "section-checkpoint",
      type: "section_header",
      icon: "⏱️",
      title: "Mid-Period Checkpoint (Minute 25)",
      subtitle: "~2 minutes"
    },
    {
      id: "b-checkpoint",
      type: "text",
      content: "**At minute 25 of class, every student shows me where they are.**\n\n- **Video kids:** rough cut on the timeline. Doesn't need to be polished — it needs to exist. Captions and music can come after; the visual sequence and voiceover need to be down.\n- **Poster kids:** at least one of the three posters laid out in Canva, headline + image + CTA in roughly the right places.\n\nIf you're behind, we triage on the spot — either we cut scope (drop a panel, drop a poster) or we shift you to working at home tonight to finish for showcase tomorrow. **No one starts Day 4 with nothing built.** That's the rule."
    },
    {
      id: "q-checkpoint",
      type: "question",
      questionType: "short_answer",
      prompt: "At the checkpoint, paste a one-line description of what you have so far. Examples: 'Rough cut to second 40, no captions yet, no music yet.' Or: 'Poster 1 fully designed, poster 2 headline only, poster 3 not started.' Be honest — this is for triage, not for grading.",
      placeholder: "Where I am at minute 25: ...",
      difficulty: "apply"
    },

    // ─── ACTIVITY: TOOLS / RESOURCES ──────────────────────────

    {
      id: "section-tools",
      type: "section_header",
      icon: "🧰",
      title: "Production Resources",
      subtitle: "Open these as you need them"
    },
    {
      id: "b-tools-intro",
      type: "text",
      content: "Open these as you go. Don't pre-browse — that's procrastination dressed up as research."
    },
    {
      id: "ext-capcut",
      type: "external_link",
      url: "https://www.capcut.com/",
      title: "CapCut — Video Editor",
      description: "Free, browser- or app-based. Auto-captions are decent — always proofread them after generating. Use the Commercial Use music library to avoid copyright issues."
    },
    {
      id: "ext-canva",
      type: "external_link",
      url: "https://www.canva.com/",
      title: "Canva — Poster Designer",
      description: "Sign in with your school Google. For posters, start with a custom canvas (11x17 inches at 300 DPI for print, or 1080x1080 px for IG). Brand Kit fonts and colors should already be saved from the prior unit."
    },
    {
      id: "ext-pixabay-music",
      type: "external_link",
      url: "https://pixabay.com/music/",
      title: "Pixabay Music — Royalty-Free Tracks",
      description: "Free, commercial use OK, no attribution required (but cite the artist anyway in your credits)."
    },
    {
      id: "ext-yt-audio",
      type: "external_link",
      url: "https://www.youtube.com/audiolibrary",
      title: "YouTube Audio Library",
      description: "Free music and sound effects. Filter by mood or genre. Some tracks require attribution — check the column before you download."
    },
    {
      id: "ext-cdc-resources",
      type: "external_link",
      url: "https://www.cdc.gov/",
      title: "CDC — Stat Source",
      description: "Last-call source check. Pull at least one current statistic and screenshot the exact page so you can cite it accurately on screen."
    },
    {
      id: "ext-pew-resources",
      type: "external_link",
      url: "https://www.pewresearch.org/",
      title: "Pew Research — Stat Source",
      description: "Last-call source check. Same drill — find a current stat, screenshot the source page, cite the exact year."
    },
    {
      id: "ext-988-resources",
      type: "external_link",
      url: "https://988lifeline.org/promote-988/",
      title: "988 Lifeline — Logos and Assets",
      description: "If your PSA is mental-health related: download the official 988 logo from this page and burn it into your video or poster. Required if you're touching the topic."
    },
    {
      id: "ext-afsp-safe-messaging",
      type: "external_link",
      url: "https://afsp.org/safe-messaging-guidelines",
      title: "AFSP — Safe Messaging Guidelines",
      description: "Required reading if your topic is mental health, suicide, or self-harm. Tells you exactly what to show and what NOT to show. Re-read before exporting."
    },

    // ─── CLOSING: REFLECTION + GUARDRAILS + DUE DATE ──────────

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
      icon: "⚠️",
      content: "**Production guardrails — still in effect:**\n\n- **No fake stats.** Every number on screen must come from your cited sources. Made-up numbers = automatic 0 on the evidence rubric.\n- **No identifying classmates, teachers, or staff.** Faces of unwilling subjects = cut the shot. Get verbal consent for any volunteer on camera.\n- **Sensitive topics:** safe messaging in production. No graphic content. No method details. 988 visible on screen the entire emotional segment.\n- **Royalty-free music only.** Tag the source in your end-credits or caption. No commercial tracks unless you have a license."
    },
    {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content: "**Tomorrow (Thu 5/28):** Showcase day. Final polish (15 min) → showcase + class vote (22 min) → top 3 submitted to admin (5 min). You will present 30 seconds of context (audience + data) before playing your PSA. **Both export formats due before showcase begins.**"
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit ticket: What's left to finish before showcase tomorrow? List every remaining task in order of priority. If anything is blocking you (footage you couldn't get, a stat you couldn't verify, a tool that wasn't working), name it now so we can fix it before tomorrow.",
      placeholder: "Remaining tasks in priority order:\n1. ...\n2. ...\n3. ...\nBlockers (if any): ...",
      difficulty: "evaluate"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc(COURSE_ID)
      .collection("lessons").doc(LESSON_ID)
      .set(lesson);
    console.log(`✅ Lesson "${lesson.title}" seeded!`);
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
