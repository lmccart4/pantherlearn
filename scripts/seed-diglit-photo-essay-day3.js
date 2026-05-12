// seed-diglit-photo-essay-day3.js
// Digital Literacy — Photo Essay Sprint, Day 3 of 3 (Tue 5/12)
// "Layout & Showcase" — build a clean exportable layout in Canva or Slides,
// export to PDF, gallery walk with sticky-note compliments.
// Run: node scripts/seed-diglit-photo-essay-day3.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const LESSON_ID = "photo-essay-day3-layout-showcase";

const lesson = {
  title: "Photo Essay — Day 3: Layout & Showcase",
  course: "Digital Literacy",
  unit: "Photo Essay Sprint",
  order: 61.2,
  visible: false,
  questionOfTheDay: "Layout day. Your job is to make the photos the thing the viewer looks at — not the design around them. What's one design choice you're making to get out of the photos' way?",
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🖼️",
      title: "Warm Up",
      subtitle: "~2 minutes"
    },
    {
      id: "b-warmup-context",
      type: "text",
      content: "Designers have a phrase for this: **\"the design is done when there's nothing left to take away.\"** Most beginner layouts fail in the same direction — too much. Too many fonts, too many colors, photos crammed edge to edge, captions in three different sizes.\n\nA photo essay layout's job is to **disappear** so the photos can be the thing the viewer looks at. That's the whole game today."
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Build a clean, exportable photo essay layout in Canva or Google Slides",
        "Apply consistency rules — one photo per page, same caption font/size/position throughout",
        "Write a 3-5 sentence artist's statement that explains your theme",
        "Give and receive specific feedback in a gallery walk (no generic 'cool')"
      ]
    },

    // ─── MINI-LESSON: LAYOUT RULES ───────────────────────────

    {
      id: "section-layout",
      type: "section_header",
      icon: "📐",
      title: "Layout Rules",
      subtitle: "~7 minutes"
    },
    {
      id: "b-layout-rules",
      type: "text",
      content: "Five rules. Follow all five.\n\n1. **One photo per slide/page.** Don't try to fit two. The photo needs to *breathe.* If a photo is so weak it can't carry a whole page, you should've cut it on Day 2.\n2. **White space is fine.** It's not wasted. White space tells the viewer's eye *where to look.* Resist the urge to fill every corner.\n3. **Same caption font, same size, same position on every page.** This is consistency, and consistency reads as polish. If your caption is bottom-left in 14pt on slide 1, it's bottom-left in 14pt on every other slide.\n4. **One font family across the whole essay.** Two if you're confident — one for the title, one for captions. Three is too many. Comic Sans is a choice. Don't make it.\n5. **Cover page is minimal.** Title, your name, your theme. That's it. No photo on the cover unless it's full-bleed and devastating."
    },
    {
      id: "img-layout-comparison",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/photo-essay-day3-layout-comparison.jpg",
      alt: "Side-by-side comparison of two photo essay slide layouts: left slide is cluttered with three small photos, three different fonts, decorative borders, and rainbow text colors; right slide is clean with one large photo, generous white margins, a single neutral caption font in one consistent size, and no decorative elements.",
      caption: "Same content, two layouts. Left: cluttered, every corner filled, three fonts. Right: one photo, white margins, one font. The right one wins every time."
    },
    {
      id: "callout-fonts",
      type: "callout",
      style: "tip",
      icon: "🔤",
      content: "**Font picks that won't embarrass you:**\n\n- **Captions:** Inter, Helvetica, Source Sans, or Google Slides default Arial. Boring is correct here.\n- **Titles:** the same font, just bigger and bolder, works fine. Or go one step fancier — Playfair Display for serif, Bebas Neue for bold sans.\n- **Avoid:** Comic Sans, Papyrus, Impact, anything that came pre-installed with a clipart pack."
    },

    // ─── MINI-LESSON: COVER + STATEMENT ──────────────────────

    {
      id: "section-pages",
      type: "section_header",
      icon: "📄",
      title: "Cover Page + Artist's Statement",
      subtitle: "Two pages that bookend the essay"
    },
    {
      id: "b-cover-page",
      type: "text",
      content: "### Cover page (page 1)\n\nThree pieces of information, nothing else:\n\n1. **Title** — your theme, written like a real essay title. *\"Hands at Work,\"* not *\"My Photo Essay.\"*\n2. **Your name** — first and last.\n3. **Subtitle or theme line** — one sentence describing what the essay is about.\n\n**Optional:** one photo on the cover, full-bleed (edge to edge). If you do this, pick your single strongest photo. If you don't have one strong enough to stand alone behind your title, leave the cover photo-less and just use a clean color block."
    },
    {
      id: "b-artist-statement",
      type: "text",
      content: "### Artist's statement (last page)\n\n3-5 sentences. Written by you, not by a chatbot. (Mr. McCarthy will know.)\n\nAnswer these in any order:\n\n- **Why this theme?** What pulled you to it? Be honest — \"I picked it because it was easy\" is fine if it's true and you can defend it.\n- **What did you notice while shooting?** Not what you saw — what you *noticed.* The thing you didn't expect to find. The detail you walked past 10 times before you finally saw it.\n- **What's the one photo you're proudest of, and why?**\n\nKeep it simple, specific, and your own voice. If a sentence sounds like it came from an AI, rewrite it until it sounds like you."
    },
    {
      id: "callout-statement-example",
      type: "callout",
      style: "insight",
      icon: "✏️",
      content: "**Example artist's statement (Theme: Things You Walk Past):**\n\n> *I picked \"Things You Walk Past\" because I realized I take the same route to school every day and couldn't actually describe what's on it. I started shooting on Saturday morning with my dad's old camera and ended up spending 40 minutes on one block.*\n>\n> *The thing I noticed: there's a hand-painted sign in the window of the bodega on Smith Street that's been there since I was in third grade. I had never read it until this weekend. The photo on slide 4 is that sign.*\n>\n> *I'm proudest of slide 4 because the lighting was an accident — golden hour caught the window glass — but the framing through the door was on purpose.*"
    },

    // ─── MC CHECK ────────────────────────────────────────────

    {
      id: "q-layout-check",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're polishing your essay and notice your captions are in three different fonts across 8 slides — Arial on some, Times on some, a fancy script font on two. What's the right move?",
      options: [
        "Leave it — variety keeps the viewer's attention",
        "Pick one font and one size, apply it to every caption identically",
        "Use the script font on the captions you like best to highlight them",
        "Use a different font for each photo to match the mood of each one"
      ],
      correctIndex: 1,
      explanation: "Consistency is the whole game in layout. Picking one font and one size for every caption reads as professional and lets the photos do the work. Mixing fonts looks unfinished — the viewer reads inconsistency as 'amateur.' Variety in fonts is exactly the wrong place to add variety; vary your photos, not your typography.",
      difficulty: "apply"
    },
    {
      id: "q-statement-check",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which artist's statement is doing its job — explaining the theme in the photographer's own voice?",
      options: [
        "\"This photo essay explores various themes related to my community in a meaningful and impactful way that resonates deeply.\"",
        "\"In conclusion, photography is an important art form that has been around for many years and continues to inspire people of all ages.\"",
        "\"I picked 'Quiet Moments' because I always notice when my mom sits on the porch after work and I wanted to see if I could capture that without her noticing me.\"",
        "\"My photo essay is about quiet moments. The pictures show various quiet moments. Quiet moments are everywhere if you look.\""
      ],
      correctIndex: 2,
      explanation: "Option C is specific, personal, and in a real voice — names a moment (mom on the porch after work), an intention (capture without her noticing), and a feeling. Options A and B are generic AI-sounding filler. Option D just repeats the theme word three times without saying anything. Specificity is the job.",
      difficulty: "evaluate"
    },

    // ─── WORK TIME ───────────────────────────────────────────

    {
      id: "section-work",
      type: "section_header",
      icon: "🛠️",
      title: "Work Time — Build & Export",
      subtitle: "~22 minutes"
    },
    {
      id: "b-work-steps",
      type: "text",
      content: "**Open your draft from Monday — Canva or Google Slides, your choice.**\n\n**Build order:**\n\n1. **Cover page** — title, name, theme line. Clean. (3 min)\n2. **Photo pages** — one per slide. Drag photos full-size onto each slide. Same caption font, size, position on every page. (10 min)\n3. **Artist's statement** — final page. 3-5 real sentences. (5 min)\n4. **Polish pass** — check spelling, alignment, consistency. Read every caption out loud. If you stumble, rewrite. (2 min)\n5. **Get your share link.**\n   - **Google Slides:** *File → Download → PDF Document* (saves to your Downloads), **then** upload that PDF to your Drive and *Share → General access: Anyone with the link → Viewer → Copy link.* Or, if you'd rather submit the live Slides, *Share → Anyone with the link → Viewer → Copy link.*\n   - **Canva:** *Share → Download → File type: PDF Standard,* upload the PDF to Drive, then *Share → Anyone with the link → Viewer → Copy link.*\n6. **Paste your link into the submission box below.** (1 min)"
    },
    {
      id: "callout-export",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Submission must be a working link.** Before you click *anywhere else,* paste your share link into the submission box below and open it in an incognito tab to confirm it loads. If your link is set to *Restricted* instead of *Anyone with the link,* Mr. McCarthy can't open it and you don't get credit. No exceptions — fix the sharing setting now."
    },
    {
      id: "external-slides",
      type: "external_link",
      url: "https://slides.google.com/",
      title: "Google Slides",
      description: "If you started in Slides on Monday, finish here. Export: File → Download → PDF Document."
    },
    {
      id: "external-canva",
      type: "external_link",
      url: "https://www.canva.com/",
      title: "Canva",
      description: "If you started in Canva on Monday, finish here. Export: Share → Download → File type: PDF Standard."
    },
    {
      id: "external-fonts-pairing",
      type: "external_link",
      url: "https://fonts.google.com/",
      title: "Google Fonts — pairing browser",
      description: "If you want one nicer font for your title, browse here. Pick one. Don't pick three. Filter to 'serif' or 'display' for titles, 'sans-serif' for captions."
    },

    // ─── SUBMIT ──────────────────────────────────────────────

    {
      id: "section-submit",
      type: "section_header",
      icon: "📤",
      title: "Submit Your Final Project",
      subtitle: "Paste your link before the gallery walk"
    },
    {
      id: "q-submit-link",
      type: "question",
      questionType: "short_answer",
      prompt: "Paste the share link to your final photo essay. Accepts a Google Drive PDF link **or** a Google Slides share link. **Set sharing to \"Anyone with the link → Viewer\" before pasting** — if Mr. McCarthy can't open it, it doesn't count. Test it in an incognito tab first.",
      placeholder: "https://drive.google.com/...   or   https://docs.google.com/presentation/d/...",
      difficulty: "apply"
    },

    // ─── GALLERY WALK ────────────────────────────────────────

    {
      id: "section-gallery",
      type: "section_header",
      icon: "🚶‍♂️",
      title: "Showcase — Gallery Walk",
      subtitle: "~10 minutes"
    },
    {
      id: "b-gallery-rules",
      type: "text",
      content: "**Set up:**\n\n- Open your PDF on your Chromebook, full-screen.\n- Place the Chromebook on your desk, screen up, facing out.\n- Sit down or stand near it — when someone has a question, answer it.\n\n**The walk:**\n\n- Everyone rotates around the room.\n- Each viewer leaves **one sticky-note compliment** on at least **3 different essays** (so you'll write at least 3 sticky notes total).\n- Compliments must be **specific.** That means naming a slide, a caption, a technique. *\"The third photo's framing through the doorway\"* — yes. *\"Cool\"* — no, write a real one.\n- Stick the note on the corner of the desk near the Chromebook.\n\n**No \"nice.\" No \"cool.\" No \"good job.\"** Mr. McCarthy will toss generic notes in the trash and ask you to redo them."
    },
    {
      id: "callout-feedback-format",
      type: "callout",
      style: "tip",
      icon: "💬",
      content: "**Specific compliment examples (steal these formats):**\n\n- *\"Slide 4 — the caption naming her 22 years on the job hit me. The portrait alone wouldn't have.\"*\n- *\"Your sequence opens with a wide street shot and closes with a single hand on the door. That arc works.\"*\n- *\"Caption font choice on every slide is identical — feels like a real magazine.\"*\n- *\"The framing on slide 6 — shooting through the locker gap — I've walked past that hallway and never seen it that way.\"*\n\nName the slide. Name the technique. Say what it did to you."
    },

    // ─── DUE / SUBMISSION ────────────────────────────────────

    {
      id: "section-due",
      type: "section_header",
      icon: "📤",
      title: "Submission Checklist",
      subtitle: "Before you leave the room today"
    },
    {
      id: "b-checklist",
      type: "text",
      content: "**Before the bell:**\n\n- [ ] Cover page: title, name, theme line\n- [ ] 6-8 photo pages, one per slide, sequenced opener → middle → closer\n- [ ] Caption under every photo — same font, same size, same position throughout\n- [ ] Artist's statement on final page (3-5 sentences, your voice)\n- [ ] Exported as PDF (or Slides set to *Anyone with the link*)\n- [ ] Share link pasted in the submission box above — tested in an incognito tab\n- [ ] Wrote 3 specific sticky-note compliments on 3 different classmates' essays during the gallery walk\n\nAll of those checked = you're done. Grades go in the rubric this week (out of 20: Composition 5 + Story/Sequencing 5 + Captions 5 + Polish 5)."
    },

    // ─── REFLECTION ──────────────────────────────────────────

    {
      id: "section-reflection",
      type: "section_header",
      icon: "🪞",
      title: "Reflection",
      subtitle: "~3 minutes"
    },
    {
      id: "r-reflection",
      type: "reflection",
      prompt: "What's the single best decision you made across this 3-day project — picking the theme, a specific shot during the weekend, a caption rewrite, a sequencing choice, or a layout move? Why was it the right call? Then: what's one thing you'd do differently if you had this whole project to redo? Be specific — name the moment, not a vague 'plan better next time.'",
      placeholder: "Best decision: ...\nWhy it was right: ...\nWhat I'd do differently: ..."
    }
  ],
  updatedAt: new Date()
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc(LESSON_ID)
      .set(lesson);
    console.log(`✅ Lesson seeded: "${lesson.title}"`);
    console.log(`   Path: courses/digital-literacy/lessons/${LESSON_ID}`);
    console.log(`   Blocks: ${lesson.blocks.length}`);
    console.log(`   Order: ${lesson.order}`);
    console.log(`   Visible: ${lesson.visible}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seed();
