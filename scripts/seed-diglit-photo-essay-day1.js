// seed-diglit-photo-essay-day1.js
// Digital Literacy — Photo Essay Sprint, Day 1 of 3 (Fri 5/8)
// "Theme + Composition" — pick a theme, learn rule of thirds / leading lines / framing,
// shoot 5 photos in/around the building, send weekend with a 30+ photo target.
// Run: node scripts/seed-diglit-photo-essay-day1.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const LESSON_ID = "photo-essay-day1-theme-composition";

const lesson = {
  title: "Photo Essay — Day 1: Theme & Composition",
  course: "Digital Literacy",
  unit: "Photo Essay Sprint",
  order: 61,
  visible: false,
  questionOfTheDay: "What makes a Humans of New York caption hit so hard? What would the photo lose without it?",
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "📸",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Mr. McCarthy is going to pull up *@humansofny* on the projector and show you 3 posts. What makes the caption hit? What would the photo lose if you stripped the caption away?"
    },
    {
      id: "b-warmup-context",
      type: "text",
      content: "Brandon Stanton — the photographer behind **Humans of New York** — built one of the biggest accounts on the internet by doing two things at once: shooting strangers in a way that respects them, and writing captions that turn a single photo into a whole story.\n\nA photo essay does the same thing on purpose, with intention. Photo + caption + sequence = a story you can hold in your hand.\n\nThis week you build one of your own."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick one of the three Humans of New York posts Mr. McCarthy showed. In 2-3 sentences, describe what the caption did that the photo alone couldn't. Be specific — name what changed when you read the words.",
      placeholder: "The photo alone showed... but the caption added... so now I see...",
      difficulty: "analyze"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Pick a photo essay theme you can actually shoot over the weekend",
        "Apply rule of thirds, leading lines, and framing on purpose (not by accident)",
        "Recognize the difference between a flat snapshot and an intentional photograph",
        "Capture 5 in-class photos that demonstrate all three composition techniques"
      ]
    },

    // ─── MINI-LESSON: COMPOSITION ────────────────────────────

    {
      id: "section-composition",
      type: "section_header",
      icon: "🎯",
      title: "Composition Crash Course",
      subtitle: "~12 minutes"
    },
    {
      id: "b-comp-intro",
      type: "text",
      content: "Composition is *where you put stuff inside the frame.* Most phone photos are bad because the photographer pointed the phone at the thing and tapped the button. The subject lands dead-center, the background is whatever was behind it, and the photo dies.\n\nThree techniques fix 90% of bad photos:\n\n1. **Rule of thirds**\n2. **Leading lines**\n3. **Framing**\n\nAll three of them have one thing in common: they make the viewer's eye *travel* through the image instead of just landing on the middle and bouncing off."
    },
    {
      id: "b-rule-of-thirds",
      type: "text",
      content: "### 1. Rule of Thirds\n\nImagine a 3×3 grid over your photo (most phones can turn this on in camera settings — do it now). Instead of putting your subject dead-center, put them on one of the four points where the lines cross.\n\n- **Why it works:** the viewer's eye naturally drifts to those intersection points. Centering everything makes the image feel static and posed.\n- **NatGeo cover trick:** look at any National Geographic cover. The subject is almost never centered. Their face, their eye, the horizon — all sit on a third.\n- **Try this:** turn on the grid in your camera app right now. Settings → Camera → Grid (iPhone) or Camera → Settings → Grid Lines (Android)."
    },
    {
      id: "img-rule-of-thirds",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/photo-essay-day1-rule-of-thirds-example.jpg",
      alt: "Photo demonstrating the rule of thirds with a 3x3 grid overlay — a young person's eyes sit on the upper-third gridline, leaving negative space to the right.",
      caption: "Rule of thirds — the eyes sit on the upper-third line, not the center. The negative space pulls you in."
    },
    {
      id: "b-leading-lines",
      type: "text",
      content: "### 2. Leading Lines\n\nA leading line is anything in the frame that **points toward your subject** — a hallway, a railing, a road, the edge of a table, a row of lockers, a sidewalk crack. Your eye follows lines whether you want to or not.\n\n- **In school:** the long hallway, the cafeteria tables, the bleachers, the gym floor stripes, the staircase rails. PAHS is full of them.\n- **The classic shot:** Steve McCurry's train-track photos — two parallel rails pulling your eye to a single figure in the distance. You can't *not* look at them.\n- **Practical move:** find a long line in the building and place your subject where the line ends or bends. Shoot from low so the line takes up more of the frame."
    },
    {
      id: "b-framing",
      type: "text",
      content: "### 3. Framing\n\nFraming means shooting your subject **through something** — a doorway, a window, a fence, a half-open locker, a hand, a chair leg, a tree branch. The thing you shoot *through* becomes a frame inside the photo.\n\n- **Why it works:** it adds depth. A flat photo has one layer (the subject). A framed photo has at least two (the frame in front, the subject behind). Your brain reads layers as *real space.*\n- **In school:** doorways between classrooms, a chain-link fence at the gym, the gap between two lockers, a vending machine window, your hand cupped at the lens.\n- **Pro move:** get the frame *out of focus* by tapping your phone screen on the subject behind it. The blurred frame feels intentional, not accidental."
    },
    {
      id: "img-comp-comparison",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/photo-essay-day1-bad-vs-good-composition.jpg",
      alt: "Side-by-side comparison: left photo shows a centered, flash-lit, dead-on shot of a backpack on a desk (boring); right photo shows the same backpack from a low angle near a window with natural light, framed by a doorway in the background (intentional composition).",
      caption: "Same backpack. Left: flash-on, centered, dead. Right: low angle, natural window light, doorway frame, backpack on a third. The second one is a photograph. The first one is just evidence the backpack exists."
    },
    {
      id: "callout-bad-photo",
      type: "callout",
      style: "warning",
      icon: "🚫",
      content: "**Why the flat photo dies:** flash kills depth, dead-center kills movement, and shooting straight-on kills layers. Three things wrong, no thing right. Don't take that photo this weekend."
    },

    // ─── MC CHECKS ───────────────────────────────────────────

    {
      id: "q-thirds-check",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're shooting a portrait of a friend leaning against a brick wall. Where should you place their eyes in the frame to follow the rule of thirds?",
      options: [
        "On the upper-third horizontal gridline, with negative space above",
        "Dead-center, exactly halfway up the frame",
        "At the very top edge of the frame so all the wall is below them",
        "In the bottom corner so the brick wall fills most of the photo"
      ],
      correctIndex: 0,
      explanation: "The rule of thirds places key subjects — especially eyes in a portrait — on the gridlines, most often the upper third. That leaves natural negative space and gives the viewer's eye somewhere to travel. Dead-center is the default mistake; the very top crops out forehead and feels claustrophobic.",
      difficulty: "apply"
    },
    {
      id: "q-framing-check",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of these is the clearest example of *framing* as a composition technique?",
      options: [
        "A selfie taken with the front-facing camera at arm's length",
        "A photo of the cafeteria taken from the doorway, with the doorframe visible around the edges of the shot",
        "A flash-lit photo of a textbook on a desk",
        "A landscape photo with the horizon centered exactly halfway"
      ],
      correctIndex: 1,
      explanation: "Framing means shooting your subject *through* something so that something becomes a frame-within-the-frame. The doorway around the cafeteria adds a second layer and makes the photo feel like real depth. Selfies, centered landscapes, and flat textbook shots have no framing element.",
      difficulty: "understand"
    },
    {
      id: "q-comp-spot",
      type: "question",
      questionType: "short_answer",
      prompt: "Walk through the school in your head. Name **one specific spot in the PAHS building** where you could use a leading line, and **one specific spot** where you could use framing. Be specific — name the hallway, the doorway, the staircase, whatever it is.",
      placeholder: "Leading line spot: ...\nFraming spot: ...",
      difficulty: "apply"
    },

    // ─── THEME PICK ──────────────────────────────────────────

    {
      id: "section-theme",
      type: "section_header",
      icon: "🧭",
      title: "Pick Your Theme",
      subtitle: "~3 minutes"
    },
    {
      id: "b-theme-intro",
      type: "text",
      content: "Your photo essay needs a **theme** — one idea, one thread, one thing the whole essay is *about.* If somebody flips through your final 6-8 photos and can't tell what they're all about, the essay failed before composition even mattered.\n\nPick one now. You'll write it on your slide draft this period and shoot for it all weekend."
    },
    {
      id: "b-theme-options",
      type: "text",
      content: "**Pick one of these — or get a custom theme approved by Mr. McCarthy before you leave:**\n\n- **Hands at Work** — only hands, no faces. Cooks, custodians, mechanics, your grandma kneading dough, a friend tying shoes, a teacher gripping a marker.\n- **A Day at PAHS** — your school, told as a single day from arrival to dismissal. Hallways, lunch trays, scoreboards, the parking lot at 3pm.\n- **Things You Walk Past** — the stuff nobody photographs. A specific bench, a specific tree, a specific bodega sign, a specific crack in a sidewalk. Make the ordinary feel important.\n- **What Color Means Home** — pick one color (red, blue, yellow, green) and find it everywhere in your week. Mailboxes, jackets, stop signs, walls, food.\n- **Quiet Moments** — moments where nothing is technically happening. A friend zoning out in class, a dog asleep on a porch, an empty hallway, a drink condensing on a table.\n- **Your own theme** — has to be approvable in one sentence. \"I want to shoot ___ because ___.\""
    },
    {
      id: "callout-theme-pick",
      type: "callout",
      style: "tip",
      icon: "✏️",
      content: "**Right now:** open the class slide deck (link in Google Classroom). Find the slide with your name. Type your theme in the title box. That's your commitment for the weekend."
    },

    // ─── IN-CLASS SHOOT ──────────────────────────────────────

    {
      id: "section-shoot",
      type: "section_header",
      icon: "🚶",
      title: "In-Class Shoot Challenge",
      subtitle: "~17 minutes"
    },
    {
      id: "b-shoot-rules",
      type: "text",
      content: "Phones out. You'll leave the room **in pairs** (Mr. McCarthy will pair you up — no solo wandering, no groups of 4+).\n\n**The challenge:** shoot **5 photos** in or around the building that demonstrate **all 3 composition techniques** (rule of thirds, leading lines, framing). At least one of those photos has to be of a **person** — and you have to ask permission first. \"Can I take your photo for a class project?\" works fine.\n\n**Rules:**\n- No selfies\n- No flash unless you have an intentional reason (and you'll have to defend it)\n- No staying inside the same room — at least move\n- Keep it to public/common areas — hallways, courtyard, gym entrance, cafeteria, library\n- Be back when the timer hits zero. If you're late, your partner gets penalized too. Don't do that to them."
    },
    {
      id: "b-shoot-prompts",
      type: "text",
      content: "**Try at least three of these as starting points:**\n\n- **Thirds:** a portrait of your partner with their eyes on the upper third of the frame, lots of negative space on one side\n- **Leading lines:** a hallway shot from low, looking down the line of lockers, person standing where the line ends\n- **Framing:** shoot through a doorway, through a fence diamond, through a hand cupped at the lens\n- **Layered:** find a window where the reflection adds a second layer to the photo\n- **Wild card:** shoot something nobody else in this class will think to shoot"
    },
    {
      id: "b-shoot-tools",
      type: "text",
      content: "**Tools to check before you walk out:**\n\n- Turn the **3×3 grid on** in your camera app right now. iPhone: Settings → Camera → Grid. Android: Camera app → Settings (gear) → Grid lines → 3×3.\n- Tap-to-focus before every shot. Tap the part of the screen where your subject is — phones lock focus *and* exposure to whatever you tapped.\n- Don't zoom. Walk closer. Phone zoom destroys image quality.\n- Hold the phone with two hands, elbows tucked in. Shaky hands = blurry photos."
    },
    {
      id: "external-tap-focus",
      type: "external_link",
      url: "https://www.apple.com/shop/buy-iphone",
      title: "Phone camera basics — tap focus, AE/AF lock",
      description: "If you've never used tap-to-focus or AE/AF lock, search your phone model + 'AE/AF lock' on YouTube before the weekend. 60 seconds of video, big quality jump."
    },

    // ─── EXIT + HOMEWORK ─────────────────────────────────────

    {
      id: "section-exit",
      type: "section_header",
      icon: "🎬",
      title: "Exit + Weekend Shoot",
      subtitle: "~5 minutes"
    },
    {
      id: "b-exit-share",
      type: "text",
      content: "**Exit ticket — last 5 minutes of class:**\n\n1. Pick your favorite of the 5 photos you just shot.\n2. AirDrop it (or upload via the Google Slides link) onto **your slide** in the class deck.\n3. Add one line under it: *\"Technique: rule of thirds / leading lines / framing — and here's where I shot it.\"*\n4. Mr. McCarthy will pull a few up for a quick share. Be ready to defend your composition choice in one sentence."
    },
    {
      id: "callout-weekend-shoot",
      type: "callout",
      style: "warning",
      icon: "📅",
      content: "**Homework — Weekend Shoot (Fri 5/8 → Mon 5/11):**\n\n- Target **30+ photos** for your theme. Bare minimum is 30. More is better — you'll cut down to 6-8 in class Monday.\n- **Vary your shots:**\n  - Different **times of day** — including at least 5 in **golden hour** (~7:30pm Saturday, 7:30pm Sunday) or low light\n  - Different **angles** — low (camera near the ground), high (camera above your head), eye-level\n  - Different **distances** — wide (whole scene), medium (subject + context), close (detail)\n- Bring them Monday on your phone, AirDropped to a Mac, or in a Google Drive folder.\n- **No photos = no curate day.** This is non-negotiable. If you forget, you're shooting at lunch and after school Monday."
    },

    // ─── REFERENCE LINKS ─────────────────────────────────────

    {
      id: "section-refs",
      type: "section_header",
      icon: "🔗",
      title: "Reference & Inspiration",
      subtitle: "Open these on your phone before you shoot"
    },
    {
      id: "external-hony",
      type: "external_link",
      url: "https://www.humansofnewyork.com/",
      title: "Humans of New York — Brandon Stanton",
      description: "The standard-setter for portrait + caption photo essays. Scroll the homepage. Notice: shallow depth of field, eye contact, off-center subjects, captions that turn the photo into a story."
    },
    {
      id: "external-natgeo-yourshot",
      type: "external_link",
      url: "https://www.nationalgeographic.com/photography/",
      title: "National Geographic — Photography",
      description: "Look at any cover or feature gallery. Almost no centered subjects. Composition lecture in image form."
    },
    {
      id: "external-mccurry",
      type: "external_link",
      url: "https://stevemccurry.com/galleries",
      title: "Steve McCurry — Galleries",
      description: "Master of leading lines and framing. The Afghan Girl portrait, the train-track photos. Open one and just look at where his subjects sit in the frame."
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
      prompt: "What's your theme, and why did you pick it? Then: what's your honest plan for the weekend shoot — when, where, and who's in the photos? If you already know you're going to slack, name what's most likely to derail you, so you can plan around it. Be real, not polite.",
      placeholder: "My theme: ...\nWhy I picked it: ...\nMy plan (Sat AM / Sat golden hour / Sun): ...\nWhat could derail me: ..."
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
