// seed-diglit-psa-day2.js
// Digital Literacy — PSA Sprint, Day 2: Storyboard, Script, Design (Tue 5/26/2026)
// Run: node scripts/seed-diglit-psa-day2.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "psa-day2-storyboard-design";

const lesson = {
  title: "PSA Sprint Day 2 — Storyboard, Script, and Design Lock",
  questionOfTheDay: "What does an effective PSA do in its first 3 seconds — and how long does it hold the emotional moment before pulling back?",
  course: "Digital Literacy",
  unit: "PSA Sprint",
  order: 64.1,
  visible: false,
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎞️",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What does an effective PSA do in its first 3 seconds — and how long does it hold the emotional moment before pulling back?"
    },
    {
      id: "b-warmup-intro",
      type: "text",
      content: "You picked your topic, your audience, your CTA, and three credible sources. Today is **build day on paper** — every shot, every line, every color decided before you touch the camera or Canva.\n\nThe rule is simple: PSAs that get planned in detail get made well. PSAs that get planned vaguely get made vaguely. Today is for detail."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Read your topic, audience, and CTA from Day 1 back to yourself. Has anything changed over the weekend? Is there a sharper angle now that you've done more research? Lock in your final version below — this is the version we're building today.",
      placeholder: "Topic: ...\nAudience: ...\nCTA: ...\nFormat (60-sec video or 3-poster series): ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Deconstruct three real PSAs (It's On Us, AT&T It Can Wait, 988) by identifying hook, emotional moment, and call-to-action",
        "Build a complete 6-panel storyboard (video) or 3-poster sketch series (poster) before production",
        "Lock a 2-3 color palette, type pairing, and voice — anchored to Brand Kit principles",
        "Pass the teacher check-off (storyboard + sources verified) — required to start production tomorrow"
      ]
    },

    // ─── MAIN: REFERENCE DECONSTRUCTION ───────────────────────

    {
      id: "section-deconstruct",
      type: "section_header",
      icon: "🔍",
      title: "Reference Deconstruction",
      subtitle: "~10 minutes"
    },
    {
      id: "b-deconstruct-intro",
      type: "text",
      content: "We're going to watch three of the most-studied PSAs of the last 15 years. As we watch each one, you're going to track three things:\n\n- **The hook** — what happens in the first 3 seconds that makes you not scroll away?\n- **The emotional moment** — when do they let the feeling land, and how long do they hold it before pulling back to the facts?\n- **The CTA** — what is the one action they want you to take, and how is it shown on screen?\n\nThree campaigns:\n\n1. **\"It's On Us\"** — consent and bystander intervention on college campuses. Started by the Obama White House, picked up by athletes and celebrities. Notice how it makes consent everyone's responsibility, not just the perpetrator's or the victim's.\n2. **AT&T \"It Can Wait\"** — the original anti-texting-and-driving campaign. The 30-second version with the survivor's voiceover is the one to watch. The hook is brutal. The CTA — \"No text is worth a life\" — is everywhere by second 25.\n3. **A 988 Lifeline spot** — modern mental-health PSAs. Watch how carefully they handle the topic: no graphic content, no method details, 988 on screen the entire time. This is what safe messaging looks like in production."
    },
    {
      id: "ext-itsonus",
      type: "external_link",
      url: "https://www.itsonus.org/",
      title: "It's On Us — Campaign Site",
      description: "Watch the original 60-second spot and one of the athlete spots. Note how the CTA shifts from 'don't be a perpetrator' to 'don't be a bystander.' That's the whole campaign in one move."
    },
    {
      id: "ext-itcanwait",
      type: "external_link",
      url: "https://www.att.com/itcanwait/",
      title: "AT&T — It Can Wait",
      description: "Watch the 30-second spot featuring a real crash survivor. Time the hook (first 3 seconds), emotional peak, and CTA. Notice they NEVER show the crash itself — restraint."
    },
    {
      id: "ext-988-spot",
      type: "external_link",
      url: "https://988lifeline.org/promote-988/",
      title: "988 Lifeline — Promote 988 Materials",
      description: "Watch any of the official 988 video spots. Note: 988 is on screen the entire time, no graphic content, no method details, focus on connection and hope. This is safe messaging in production."
    },
    {
      id: "img-deconstruction-grid",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/psa-deconstruction-grid.jpg",
      alt: "A 3-column reference grid showing freeze-frames from three PSA campaigns side by side: 'It's On Us' consent campaign, AT&T 'It Can Wait', and a 988 Suicide Prevention spot. Each column is annotated with hook, emotional moment, and call-to-action timing.",
      caption: "Three campaigns, same anatomy: hook in the first 3 seconds, emotional moment in the middle, CTA hammered home at the end."
    },
    {
      id: "callout-restraint",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The pattern:** Hook → Data → Moment → CTA. AT&T never shows the crash. 988 never shows the act. Truth never shows a smoker dying. The most powerful PSAs **trust the audience to feel it without being shown.** That's restraint. That's respect."
    },
    {
      id: "q-deconstruct-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In the 30-second AT&T 'It Can Wait' spot, what does the campaign deliberately NOT show on screen, and why?",
      options: [
        "The phone, because it's the villain of the story",
        "The driver's face, because the campaign is about anonymity",
        "The text message, because reading it would distract from the message",
        "The crash itself, because trusting the audience to feel it without graphic footage is more powerful and respectful"
      ],
      correctIndex: 3,
      explanation: "AT&T's 'It Can Wait' deliberately does not show the crash. The audio, the survivor's voiceover, and the aftermath do all the work. Showing the crash would be exploitative and would shift attention from the CTA to the trauma. Restraint is the entire point of the campaign.",
      difficulty: "analyze"
    },

    // ─── MAIN: STORYBOARD / SKETCH ────────────────────────────

    {
      id: "section-storyboard",
      type: "section_header",
      icon: "✏️",
      title: "Storyboard or Poster Sketch",
      subtitle: "~15 minutes"
    },
    {
      id: "b-storyboard-rules",
      type: "text",
      content: "**If you're making a 60-second video:**\n- Draw a **6-panel storyboard.** One panel per ~10 seconds.\n  - Panel 1 (0–3s): the **hook.** What stops the scroll?\n  - Panels 2–3 (3–30s): the **problem with data.** Numbers on screen.\n  - Panels 4–5 (30–50s): the **emotional moment.** Brief, honest, not exploitative.\n  - Panel 6 (50–60s): the **CTA.** One action. Source citations visible.\n- Underneath each panel write: shot type (wide/medium/close-up), audio (voiceover line, music vibe, ambient sound), and on-screen text.\n- Make a **shot list** below your storyboard — every clip you need to film, in order.\n\n**If you're making a 3-poster series:**\n- Sketch all three posters on one page. Same brand, three angles on the same problem.\n- Each poster needs: a single dominant **headline**, a **visual** (photo, illustration, or data graphic), a **stat with source** in small text, and the **CTA**.\n- Posters work as a series — left poster opens the question, middle poster shows the data, right poster gives the action.\n- Plan two export sizes from the start: print (300 DPI, 11x17 or 18x24) and digital (1080x1080 IG square OR 9:16 vertical for the school monitors)."
    },
    {
      id: "img-storyboard-template",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/psa-storyboard-template.jpg",
      alt: "A two-panel reference template: top half shows a 6-panel video storyboard with each panel labeled by phase (Hook, Problem, Data, Emotional Moment, CTA, Sources) and rows for shot type, audio, and on-screen text; bottom half shows a 3-poster series layout with shared brand identity but three angles on the same issue.",
      caption: "Two production paths. Same anatomy. Pick one and commit."
    },
    {
      id: "q-storyboard",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your storyboard or poster sketch in detail below. Video kids — list all 6 panels (timing, shot type, on-screen text, audio for each). Poster kids — list all 3 posters (headline, visual concept, stat + source, CTA). The more specific you are now, the faster production will go tomorrow.",
      placeholder: "Format: video / posters\nPanel/Poster 1: ...\nPanel/Poster 2: ...\nPanel/Poster 3: ...\n(continue for video panels 4–6 if applicable)",
      difficulty: "create"
    },

    // ─── MAIN: DESIGN LOCK ────────────────────────────────────

    {
      id: "section-design",
      type: "section_header",
      icon: "🎨",
      title: "Design Lock",
      subtitle: "~10 minutes"
    },
    {
      id: "b-design-rules",
      type: "text",
      content: "**Lock these decisions before you leave today.** Once you start shooting or designing, you don't change them. Every change costs production time.\n\n- **Color palette: 2–3 colors max.** One dominant, one accent, optional one for highlights. Tone matches the topic — quiet topics get muted palettes; urgent topics get high-contrast palettes. (Pull from your Brand Kit work.)\n- **Type pairing: 1 display font + 1 body font.** Display for headlines, body for everything else. No more than two fonts total. Inter, DM Sans, Bebas Neue, Anton, Cormorant — anything from your Brand Kit list.\n- **Voice:** Pick one. *Urgent. Warm. Blunt. Quiet. Direct.* Whatever you pick, every line of voiceover or every headline has to match it.\n- **Music vibe (video only):** Tempo, instrumentation, mood. Use royalty-free sources only. Pixabay Music, YouTube Audio Library, or CapCut's commercial-use library. Match the voice — urgent voice doesn't pair with sleepy lo-fi.\n- **Tie back to your Brand Kit.** This PSA needs a brand. If it looks like five different students made it, you'll lose 5 points on production polish."
    },
    {
      id: "q-design-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Your PSA is about late-night phone use. You've decided your voice is 'quiet, direct, almost a whisper — like a friend telling you the truth at 1 AM.' Which color palette and music choice BEST match that voice?",
      options: [
        "Muted navy + soft white + a single warm accent, slow ambient piano or lo-fi",
        "Bright neon yellow + black, fast EDM with heavy bass drops",
        "Bright red + flashing white, urgent action-movie score",
        "Rainbow gradient, upbeat pop with vocal hooks"
      ],
      correctIndex: 0,
      explanation: "A quiet, intimate voice needs a quiet, intimate palette and audio. Muted navy + warm accent reads like a bedroom at night. Slow ambient piano or lo-fi matches that tone. The other options pair urgency or hype with a quiet message — that's a brand mismatch and the PSA will feel off.",
      difficulty: "apply"
    },
    {
      id: "q-design-lock",
      type: "question",
      questionType: "short_answer",
      prompt: "Lock your design decisions in writing. List your 2-3 color palette (with hex codes if you have them), your display + body font pairing, your voice in one word or phrase, and your music vibe (video only). This is what you commit to — no changes after today.",
      placeholder: "Colors: ...\nFonts: display ... / body ...\nVoice: ...\nMusic vibe (video only): ...",
      difficulty: "evaluate"
    },

    // ─── ACTIVITY: TEACHER CHECK-OFF ──────────────────────────

    {
      id: "section-checkoff",
      type: "section_header",
      icon: "✅",
      title: "Teacher Check-Off",
      subtitle: "~5 minutes"
    },
    {
      id: "b-checkoff",
      type: "text",
      content: "Before you leave today, **show me three things at the front:**\n\n1. **Storyboard or poster sketch** — fully drawn, all panels/posters, with shot details or layout details written out.\n2. **Source list** — your 3+ credible sources, written down, with the organization and one specific stat from each.\n3. **Design lock sheet** — colors, fonts, voice, music vibe.\n\n**No check-off, no production day tomorrow.** I'm not being mean — production goes wrong fast when the plan is fuzzy. The check-off catches the fuzziness today instead of letting it eat your whole Wednesday."
    },
    {
      id: "callout-sensitive",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Sensitive topic check-off:** If your PSA is about mental health, suicide, self-harm, eating disorders, or any other sensitive issue — your **full script** must be approved by Mr. McCarthy before you start production. I'll read every line. Follow safe messaging guidelines: no graphic depictions, no method details, no glorification. **988 must be visible on screen** for the entire emotional segment. Read the AFSP guide linked on Day 1 if you haven't yet."
    },

    // ─── CLOSING: REFLECTION + GUARDRAILS + DUE DATE ──────────

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
      icon: "⚠️",
      content: "**Topic guardrails — still in effect:**\n\n- **No fake stats.** If you can't cite the source, cut the claim.\n- **No identifying classmates, teachers, or staff.** Use yourself, willing volunteers with consent, or stock footage.\n- **Sensitive topics** require teacher approval of the script before production. 988 visible on screen. No graphic content. No method details.\n- **Check in with yourself.** If researching or writing about your topic is putting you in a bad place, switch topics or come talk to me. Wellbeing first."
    },
    {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content: "**Tomorrow (Wed 5/27):** Production day. Heads-down work. Bring everything — your storyboard, your sources, your scripts, your phone if you're filming, your laptop logged in to CapCut/Canva. Mid-period checkpoint at minute 25: every student must show me a rough cut or draft poster."
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit ticket: What's the one part of your PSA you're most nervous about (the hook? the emotional moment? finding the right footage? sticking to safe messaging?), and what's your plan to handle it tomorrow? Be honest — naming the fear early is how you don't get blocked at minute 30 of production.",
      placeholder: "Most nervous about: ...\nMy plan to handle it: ...",
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
