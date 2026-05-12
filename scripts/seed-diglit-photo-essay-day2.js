// seed-diglit-photo-essay-day2.js
// Digital Literacy — Photo Essay Sprint, Day 2 of 3 (Mon 5/11)
// "Curate & Sequence" — cut 30+ photos to 6-8, decide the order, draft specific captions.
// Run: node scripts/seed-diglit-photo-essay-day2.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const LESSON_ID = "photo-essay-day2-curate-sequence";

const lesson = {
  title: "Photo Essay — Day 2: Curate & Sequence",
  course: "Digital Literacy",
  unit: "Photo Essay Sprint",
  order: 61.1,
  visible: false,
  questionOfTheDay: "You shot 30+ photos this weekend. Only 6-8 make the final essay. How do you decide which ones live and which ones die?",
  blocks: [

    // ─── SUB-DAY BANNER ──────────────────────────────────────

    {
      id: "callout-sub-day",
      type: "callout",
      style: "warning",
      icon: "📋",
      content: "**Mr. McCarthy is out today.** This lesson runs entirely on its own. Read each section carefully, do the work, scroll all the way to the bottom, and submit your reflection before the bell. The sub is here for behavior, not for content questions — everything you need is on this page.\n\n**No photos from Friday's shoot?** Scroll down to Work Time → there's a fallback option that lets you still complete today's work."
    },
    {
      id: "b-today",
      type: "text",
      content: "**Today's job:** take the 30+ photos you shot over the weekend and cut them down to a finished 6-8 photo essay draft — sequenced and captioned — by the end of the period. That draft goes in your Google Slides template and stays there for tomorrow's layout + showcase day."
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Cut 30+ photos down to 6-8 that all serve the same theme",
        "Sequence photos as opener → middle → closer (not in random order)",
        "Write captions that are specific — names, numbers, exact moments — not generic",
        "Get a partner read on whether your sequence reads the way you meant it to"
      ]
    },

    // ─── MINI-LESSON: CURATE ─────────────────────────────────

    {
      id: "section-curate",
      type: "section_header",
      icon: "✂️",
      title: "Curate — Choose Your Best Shots",
      subtitle: "~5 minutes"
    },
    {
      id: "b-curate-intro",
      type: "text",
      content: "**Curate** = decide what to leave out.\n\nYou shot 30+. You're allowed 6-8 in your final essay. That means **at least 22 photos get cut.** Some of those cuts are going to feel bad. The photo you love that doesn't fit the theme — cut it. The photo of your best friend that's technically blurry — cut it. The shot you spent 10 minutes setting up that just didn't land — cut it.\n\nThis is the part where photographers get sentimental and the essay falls apart. Don't get sentimental.\n\n**The rule:** every photo that stays must answer *yes* to one question — *does this photo make my theme stronger?* If it doesn't, it's gone. Doesn't matter how much you like it. Doesn't matter how long it took. It's noise."
    },
    {
      id: "b-curate-process",
      type: "text",
      content: "**The process (do this in order):**\n\n1. **Open all 30+ photos** in your phone's Photos app or your Drive folder.\n2. **First pass — STAR your top 12.** Don't think too hard. Gut reaction. Star anything that immediately works.\n3. **Second pass — cut the 12 down to 8.** Now think hard. Which 4 are weakest? Cut those.\n4. **Third pass — pick your 6-8 final.** From the 8, decide if any are weaker than the others. If 8 all hit, keep 8. If only 6 truly serve the theme, keep 6.\n\n**Watch for repetition.** Three photos of basically the same thing? Keep the strongest one. Cut the other two."
    },
    {
      id: "img-curate-grid",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/photo-essay-day2-curate-grid.jpg",
      alt: "A photo grid showing 30+ thumbnails of a single theme (a day at school), with 8 thumbnails marked with a star and the rest faded out — showing the result of a curation pass.",
      caption: "30 shots in, 8 chosen. Notice how the kept photos cover different angles, distances, and moments — no two photos repeat the same beat."
    },

    // ─── MINI-LESSON: SEQUENCE ───────────────────────────────

    {
      id: "section-sequence",
      type: "section_header",
      icon: "🎼",
      title: "Sequence — Like a Song",
      subtitle: "~5 minutes"
    },
    {
      id: "b-sequence-intro",
      type: "text",
      content: "**Sequence** = the order you put the photos in. A photo essay is read in order, top to bottom, slide to slide. The order is the story.\n\nThink of it like a song:\n\n- **Opener** — sets the scene. The viewer doesn't know what they're looking at yet. Your opener tells them *where, when, who.*\n- **Middle** — builds. Each photo adds a layer. New angle, new moment, new detail. The viewer sinks in.\n- **Closer** — lands it. The last photo is the one they remember. Make it count.\n\nA random order isn't a photo essay. It's a folder."
    },
    {
      id: "b-sequence-roles",
      type: "text",
      content: "**Photo roles you can fill in your sequence:**\n\n- **Establishing shot** — wide, sets the location. Almost always the opener.\n- **Portrait** — a person looking at the camera. High emotional weight. Use sparingly.\n- **Detail** — close-up of a single object. Hands, a sign, a worn-out shoe. Adds texture.\n- **Action** — somebody doing the thing. Mid-motion, candid.\n- **Quiet moment** — the pause between actions. Often the most powerful slide in the essay.\n- **Closing shot** — leaves the viewer with a feeling. Often a wide shot or a quiet moment, not a portrait."
    },
    {
      id: "img-sequence-arc",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/photo-essay-day2-sequence-arc.jpg",
      alt: "A diagram showing 6 photo thumbnails arranged left to right with labels: opener (wide establishing shot), build (portrait), build (detail close-up), build (action shot), build (quiet moment), closer (wide ending shot) — visualizing the opener-middle-closer arc of a photo essay.",
      caption: "Six-photo arc: open wide, build through portrait + detail + action + quiet, close wide. Same shape as a song."
    },

    // ─── MINI-LESSON: CAPTIONS ───────────────────────────────

    {
      id: "section-captions",
      type: "section_header",
      icon: "✍️",
      title: "Captions — Be Specific or Don't Bother",
      subtitle: "~5 minutes"
    },
    {
      id: "b-captions-intro",
      type: "text",
      content: "Generic captions kill photo essays. *\"A person walking.\"* *\"My friend.\"* *\"The hallway.\"* These tell the viewer nothing they couldn't see.\n\nSpecific captions earn the photo. Names. Numbers. Exact moments. The thing you only know because you were there."
    },
    {
      id: "callout-caption-examples",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Bad → Good caption rewrites:**\n\n- ❌ *A person walking.* → ✅ *Mr. Diaz, finishing his 14th lap before the bell.*\n- ❌ *My friend at lunch.* → ✅ *Jas, halfway through the same chicken sandwich she's bought every Wednesday since freshman year.*\n- ❌ *The hallway.* → ✅ *C-wing, third period — the only 4 minutes a day this hallway is louder than the cafeteria.*\n- ❌ *A worker.* → ✅ *Mrs. Reyes, 22 years cleaning these halls. She knows every kid by name.*\n\nThe specific version makes you *trust* the photographer. They know what they're looking at. They were there."
    },
    {
      id: "b-caption-recipe",
      type: "text",
      content: "**A simple recipe:**\n\n1. **Name** — a person, a place, a thing. \"Mr. Diaz.\" \"C-wing.\" \"The third floor vending machine.\"\n2. **Number or time** — \"14th lap.\" \"22 years.\" \"7:42am.\" \"every Wednesday since freshman year.\"\n3. **The specific moment** — what's happening *right now in this photo,* not in general.\n\nKeep it to 1-2 sentences. If you can cut a word, cut it. If you can replace a generic word with a specific one, do it."
    },
    {
      id: "q-caption-rewrite",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick one of your weekend photos. First, write the lazy caption you might've written if you weren't paying attention (something like \"a person at the park\" or \"my dog\"). Then rewrite it using the recipe — name, number/time, specific moment. Both versions side by side.",
      placeholder: "Lazy caption: ...\nSpecific caption: ...",
      difficulty: "apply"
    },

    // ─── MC CHECKS ───────────────────────────────────────────

    {
      id: "q-curate-check",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You shot 32 photos for your \"Hands at Work\" theme. Three of them are nearly identical close-ups of the same chef chopping onions, all sharp, all well-composed. What's the right curation move?",
      options: [
        "Pick the single strongest of the three and cut the other two",
        "Keep all three — more photos of the strongest moment make the essay stronger",
        "Cut all three — duplicates always feel cheap",
        "Keep the first one you shot, regardless of quality, because it was the most authentic"
      ],
      correctIndex: 0,
      explanation: "Three near-duplicates of the same moment occupy three slots that could cover three different beats of the theme. Pick the strongest one and cut the other two. Keeping all three repeats the same note; cutting all three loses a strong moment entirely. The first-shot rule is fake — quality wins, not order.",
      difficulty: "apply"
    },
    {
      id: "q-sequence-check",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Looking at the opener → middle → closer arc, which shot is generally the WEAKEST choice for the OPENER of a photo essay?",
      options: [
        "A wide establishing shot of the location at dawn",
        "A landscape showing the neighborhood from a rooftop",
        "A photo of a sign at the entrance to the building",
        "An extreme close-up of a single eye with no context around it"
      ],
      correctIndex: 3,
      explanation: "Openers establish *where, when, who* — they orient the viewer. An extreme close-up with no context does the opposite: it disorients before the viewer has any anchor. Close-ups are powerful in the middle of an essay (after context is set) or as a final beat (after the story has built up to it). Wide shots, landscapes, and signs all establish location — that's the opener's job.",
      difficulty: "understand"
    },
    {
      id: "q-caption-check",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of these captions follows the \"name + number/time + specific moment\" recipe?",
      options: [
        "A teacher in the hallway.",
        "School in the morning.",
        "Ms. Patel, 7:42am, unlocking room 211 for the first student of the day.",
        "I love this photo because it shows a real moment at our school."
      ],
      correctIndex: 2,
      explanation: "Option C names the subject (Ms. Patel), gives a specific time (7:42am), and describes the exact moment (unlocking room 211 for the first student). The other three are generic — no name, no time, no specific moment. \"A teacher in the hallway\" tells you nothing the photo can't.",
      difficulty: "understand"
    },

    // ─── WORK TIME ───────────────────────────────────────────

    {
      id: "section-work",
      type: "section_header",
      icon: "💻",
      title: "Work Time — Curate, Sequence, Caption",
      subtitle: "~22 minutes"
    },
    {
      id: "b-work-steps",
      type: "text",
      content: "**Step-by-step — do these in order:**\n\n1. **Click the template link below.** It will prompt you to *Make a copy.* Click the blue *Make a copy* button. The copy lands in your Drive automatically.\n2. **Rename the copy** — top-left of Slides — to *\"YourName — Photo Essay.\"*\n3. **Open your phone Photos app or your Drive folder** with your weekend shots. **Star + cut:** top 12 → 8 → 6-8 final.\n4. **One photo per slide** — drag each final photo into its own slide in your copy (Insert → Image → Upload from phone or Drive).\n5. **Decide the order** — drag slides in the left panel up/down. First photo = opener. Last photo = closer.\n6. **Caption box under each photo** — type your draft caption right now. 1-2 sentences. Use the recipe.\n7. **Don't worry about cover page or artist statement yet** — that's tomorrow.\n\n**No photos from Friday's shoot?** Use the fallback link below — pick 6-8 photos from the free stock pool, sequence them as if you shot them, and write specific captions for each. You'll still get full credit today, but you owe Mr. McCarthy your own shoot before showcase day."
    },
    {
      id: "external-slides-template",
      type: "external_link",
      url: "https://docs.google.com/presentation/d/1GZf2X9znpJkIgpG-DT9Ys-6B_4MngSC9QNaw0XOkolg/copy",
      title: "📋 Photo Essay Template — Make a Copy",
      description: "Click here first. This opens the class template and prompts you to Make a copy. The copy is yours — work in it today and tomorrow."
    },
    {
      id: "external-fallback-photos",
      type: "external_link",
      url: "https://unsplash.com/s/photos/everyday-life",
      title: "🔁 Fallback Photo Pool (only if you didn't shoot)",
      description: "If you have no photos from Friday's shoot, browse Unsplash 'everyday life' and download 8-10 photos that could read as one cohesive theme. Treat them as if you shot them — sequence and caption them with the same care."
    },
    {
      id: "external-canva",
      type: "external_link",
      url: "https://www.canva.com/photo-essay-templates/",
      title: "Canva — Photo Essay Templates",
      description: "If you'd rather build in Canva than Google Slides, browse photo essay templates here. Pick one with lots of white space, not a busy template. We finish in either tool — you pick. (Login with your school Google account.)"
    },
    {
      id: "external-natgeo-yourshot",
      type: "external_link",
      url: "https://www.nationalgeographic.com/photography/article/photo-essays",
      title: "NatGeo — Photo Essay Examples",
      description: "When you get stuck, scroll through real photo essays here. Look at how the pros sequence — opener, middle, closer. Look at the captions."
    },
    {
      id: "external-atlantic-photo",
      type: "external_link",
      url: "https://www.theatlantic.com/photo/",
      title: "The Atlantic — In Focus (caption inspiration)",
      description: "When your captions feel generic, come back here. Notice how the captions almost always include a name or location, a time, and a specific detail that the photo alone wouldn't tell you."
    },

    // ─── EXIT ────────────────────────────────────────────────

    {
      id: "section-exit",
      type: "section_header",
      icon: "👀",
      title: "Exit — Partner Read",
      subtitle: "~5 minutes"
    },
    {
      id: "b-exit-pair",
      type: "text",
      content: "**Pair up with the person next to you.**\n\nShow your draft slide deck — sequence + photos + captions. Don't tell your partner what your theme is. Don't explain.\n\n**They tell *you*:** what story do they see? What do they think the theme is? What's the strongest photo? What's the weakest?\n\nIf the story they see matches what you meant — your sequence works. If it doesn't, you've got tomorrow morning to fix it before showcase."
    },
    {
      id: "q-partner-feedback",
      type: "question",
      questionType: "short_answer",
      prompt: "What did your partner say the theme was, just from looking at your sequence? Did it match what you intended? Which photo did they call the strongest, and which the weakest? What are you going to change tonight or tomorrow before layout day?",
      placeholder: "Partner's read on theme: ...\nMatched my intent? ...\nStrongest / weakest photo: ...\nChanges I'm making: ...",
      difficulty: "evaluate"
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
      prompt: "What was hardest today — curating, sequencing, or writing captions? Why? Pick the one photo in your final 6-8 that you almost cut and explain why you kept it. Then: which photo are you most worried about, and what's your plan to either fix the caption or replace the photo before tomorrow?",
      placeholder: "Hardest part: ...\nThe photo I almost cut: ...\nWhy I kept it: ...\nThe photo I'm worried about: ...\nMy plan: ..."
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
