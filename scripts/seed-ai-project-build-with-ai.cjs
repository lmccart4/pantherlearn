/**
 * AI Literacy Course Project: Build-With-AI Showcase
 * Lesson ID: ai-project-build-with-ai
 * Order: 71 | Visible: false
 *
 * Tool stack curated May 2026 — low-curve, free-tier-export-confirmed only.
 * Sora dead. Udio downloads disabled. Suno free downloads removed (Warner deal).
 * Glide free publishing removed (Oct 2025). Custom GPT requires Plus.
 * Cursor demoted (SheerID friction with @paps.net). Replit Agent / v0 medium-high curve.
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-build-with-ai.jpg';

const lesson = {
  id: 'ai-project-build-with-ai',
  title: 'Build With AI: Make Something Real You Couldn\'t Make Alone',
  unit: 'Year-End Projects',
  order: 71,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Use 2+ AI tools in combination to create a tangible artifact you couldn\'t produce alone',
      'Document your prompting process — including the moments AI got it wrong and what you did to fix it',
      'Demo your build to peers in under 90 seconds with a clear "before AI / with AI" framing',
      'Reflect on where AI acted as a power tool vs. where it failed and required human judgment',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Think about something you\'ve always wanted to make but never had the skills, time, or money to actually pull off — a song, a game, a website, a short film, a podcast, a working app. What is it? Be honest about why you never built it.' },

    { type: 'image', id: id(), url: HERO_URL, alt: 'Build With AI showcase: students presenting AI-assisted creative projects on a stage with phones, screens, and posters' },

    { type: 'section_header', id: 'sh-project', label: 'The Project' },
    { type: 'text', id: id(), content: `For most of human history, making things — real things, polished things — required years of skill-building. Wanted to make a song? Learn an instrument, learn production, save up for gear. Wanted to make a game? Learn to code, learn art, learn design. The barrier between "I have an idea" and "the idea exists in the world" was usually measured in years.\n\nThat barrier just collapsed.\n\nNot to zero. AI doesn\'t erase the need for taste, judgment, or effort. But it absolutely erases the need for years of pre-skill before you can start. You can ship a song this week. A working app this month. A short film this weekend.\n\nThe question this project asks you to answer: **what would you build if the only ceiling was your own ambition?**\n\nThe catch: it has to be something you genuinely could not have made alone. If you could have made it in PowerPoint or Canva in 30 minutes, that doesn\'t count. The whole point is to feel the leverage AI gives you — to make something that would have taken a team of professionals five years ago, by yourself, in a week.` },
    { type: 'callout', id: id(), style: 'info', content: '**Build something real that you genuinely could not have made without AI — then show your class how you made it.**' },

    { type: 'section_header', id: 'sh-categories', label: 'Pick a Build Type' },
    { type: 'callout', id: id(), style: 'tip', content: '**Each card lists a Recommended Stack — one specific tool combo that\'s confirmed to work end-to-end on free tier in May 2026.** Stick with the Recommended Stack unless you have a strong reason to deviate. The whole point is for you to spend Days 2–4 *creating*, not learning a tool.' },
    { type: 'case_cards', id: id(),
      title: 'Pick a Build Type',
      cards: [
        { id: 'card-app', label: '1', title: 'No-Code Web App or Game', body: '**Recommended Stack:** Bolt.new (describe a web app or game in plain English, get a deployed URL).\n\n**Scope:** at least 3 functional screens (or 2 minutes of playable gameplay). It must actually run — buttons that go nowhere don\'t count.\n\n**Good fit if:** you\'ve always wanted to ship software but don\'t code.' },
        { id: 'card-music', label: '2', title: 'Original Music Track', body: '**Recommended Stack:** Gemini Music + Code.org Music Lab (combined workflow).\n\n**The workflow:** Generate 30-second custom audio clips in Gemini (sign in with @paps.net) — your hooks, themes, atmospheric layers. Download as MP3 (10/day on free). Upload those clips into Code.org Music Lab and arrange them into a full track alongside the Music Lab\'s built-in samples.\n\n**Scope:** minimum 90 seconds final length, at least 2 distinct sections (verse/chorus or A/B). At least one section uses YOUR Gemini-generated audio (not just precurated Music Lab samples).\n\n**Good fit if:** you\'ve got a song idea in your head but can\'t play an instrument or produce. The Gemini step gives you original raw material; the Music Lab step gives you the compositional canvas to arrange it.' },
        { id: 'card-anim', label: '3', title: 'Animated Short', body: '**Recommended Stack:** Kling (primary, 66 free credits/day) + Nano Banana 2 via aistudio.google.com (starting frames, no watermark).\n\n**Scope:** minimum 30 seconds, at least 3 distinct shots, an original concept (no recreating existing IP — no Marvel, no anime characters).\n\n**Good fit if:** you have a visual idea you can\'t draw or film yourself.\n\n*Pika is an OK backup but Kling resets daily — use Kling first.*' },
        { id: 'card-bot', label: '4', title: 'Working Chatbot', body: '**Recommended Stack:** Poe (publicly shareable, 13+ TOS, lets you wrap a free base model like Claude Haiku or GPT-4o-mini).\n\n**Scope:** a clear niche purpose (homework helper for one specific class, niche advice bot, character roleplay), a custom system prompt 200+ words, tested with 5+ realistic user inputs.\n\n**Good fit if:** you want to build the assistant nobody has built yet.' },
        { id: 'card-site', label: '5', title: 'Interactive Story or Mini-Site', body: '**Recommended Stack:** Bolt.new (describe what you want, Bolt deploys it to a public URL).\n\n**Scope:** must work on phone, must include images you generated yourself (use Nano Banana 2 via aistudio.google.com), must have at least one interactive element (a quiz, a chooser, a hover effect).\n\n**Good fit if:** you want a visual + interactive build but not full app complexity.' },
        { id: 'card-pod', label: '6', title: 'Podcast or Audio Drama', body: '**Recommended Stack:** NotebookLM (host conversation, free, downloads as WAV) + ElevenLabs (character voices, 10K char/mo free) + Code.org Music Lab (theme music).\n\n**Scope:** minimum 5 minutes, at least 2 distinct voices, an original script you wrote.\n\n**Good fit if:** you\'re into storytelling and want to make audio without a recording booth or voice actors.\n\n*Heads up: NotebookLM exports WAV. If your final upload spot needs MP3, convert with a free site like cloudconvert.com.*' },
        { id: 'card-data', label: '7', title: 'Data Story or Dashboard', body: '**Recommended Stack:** Bolt.new + a real public dataset (CDC, NOAA, FBI, NASA, sports stats, music charts).\n\n**Scope:** must use real data, must answer a specific question, must run in a browser. Paste your CSV into a Bolt prompt and ask it to build an interactive HTML chart that explores your question.\n\n**Good fit if:** you like patterns, numbers, or "I wonder if this is true" curiosity.' },
      ]
    },
    { type: 'callout', id: id(), style: 'tip', content: 'Pitch your own category to Mr. McCarthy if none of these fit — bring a specific idea, not just "something cool with AI."' },

    { type: 'section_header', id: 'sh-network', label: 'Heads Up: School Network' },
    { type: 'callout', id: id(), style: 'warning', content: '**Some of these tools (especially media generators — Kling, ElevenLabs, sometimes Suno alternatives) get blocked on PAPS school wifi.** Plan to do all media generation at home or on your phone using cellular data, then assemble at school. Code/chat tools (Bolt, Claude, NotebookLM, Poe) usually work at school — but test on Day 1 to be sure.' },

    { type: 'section_header', id: 'sh-deliverables', label: 'Deliverables' },
    { type: 'checklist', id: id(), title: 'Deliverables', items: [
      'A working build — link, file, or video where the artifact actually functions (not a screenshot of an idea)',
      'A process doc (Google Doc or Slides) with three sections: The Pitch (1 paragraph on what it is and why), The Prompts (your 5 most important prompts copy-pasted, with notes on what worked and what didn\'t), and The Failure Story (one specific moment AI got it wrong and what you did to fix it)',
      'A 60–90 second demo video (Loom, phone screen recording, or in-class live demo) that shows the build running and calls out the "couldn\'t-have-done-this-alone" moment',
      'One submission link to a Google Doc or Slides hub that contains the build link, the process doc, and the demo video — sharing set to "Anyone with the link can view"',
    ]},

    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    { type: 'text', id: id(), content: `**Day 1 — Pitch + Tool Smoke Test (in class)**\n- Pick your build category and your specific idea. 2-minute pitch to Mr. McCarthy.\n- Identify the 1–2 tools you\'ll use. **Use the Recommended Stack** for your category unless you have a strong reason to deviate.\n- **Tool Smoke Test (must pass before you leave today):** in your chosen tool, generate ONE test output. Confirm you can download it (or copy the share link). Open the share link in a different browser to confirm it actually works for someone else. Submit the link or screenshot as proof.\n- **If your smoke test fails — swap tools right now, today.** Don\'t lose Day 2 to a paywall or a tool that won\'t export. The whole point of Day 1 is to surface those problems before you invest real time.\n\n**Day 2 — First Build Attempt (in class + homework)**\n- Generate your first version. Don\'t polish — just get something end-to-end working.\n- Save every prompt you write. Copy/paste them into your process doc as you go.\n- Expect this version to be rough. That\'s the point — you need to see what AI gets wrong before you can fix it.\n\n**Day 3 — Iterate & Fix (in class)**\n- Watch/listen/play your Day 2 version. Write down the 3 biggest weaknesses.\n- Re-prompt or use a different tool to fix each one. Document what changed and why.\n- This is where most of the actual learning happens. AI rarely gets it right the first time.\n\n**Day 4 — Polish & Process Doc (homework)**\n- Final pass on the build. Cover art, intro/outro, formatting, whatever your category needs.\n- Write the process doc. The Failure Story matters most — be honest and specific.\n- Record your demo video.\n\n**Day 5 — Demo Day (in class)**\n- Everyone demos. 60–90 seconds each.\n- Audience votes for: Most Ambitious, Best Use of AI, Most Polished, Best Failure Story.\n- Submit your final link.` },

    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },
    { type: 'rubric', id: id(),
      title: 'Project Rubric',
      totalPoints: 100,
      criteria: [
        { name: 'Build actually works', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Build runs end-to-end without breaking. App opens, song plays, video renders, chatbot responds. No "imagine this part worked" moments.' },
          { score: 3, label: 'Proficient', description: 'Build works with one minor issue (a broken button, a glitch in one shot, slightly low audio).' },
          { score: 2, label: 'Developing', description: 'Build mostly works but has 2+ issues that interrupt the experience.' },
          { score: 1, label: 'Beginning', description: 'Build doesn\'t function as described, the student submitted screenshots/mockups instead of a working artifact, or the student spent all available time fighting an unfamiliar tool and never produced a finished build.' },
        ]},
        { name: 'AI leverage is undeniable', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'A reasonable person looking at this would say "no high-schooler could have made this in a week without AI." Production quality clearly exceeds what 5 days of solo human effort produces.' },
          { score: 3, label: 'Proficient', description: 'Clearly AI-assisted, but a motivated student could have made something similar (less polished) without AI in the same time.' },
          { score: 2, label: 'Developing', description: 'AI was used but the build doesn\'t obviously require it — the same artifact could have been made in Canva, PowerPoint, or by hand.' },
          { score: 1, label: 'Beginning', description: 'No clear evidence AI was actually used in production, or AI use was limited to a single sentence or image.' },
        ]},
        { name: 'Prompt documentation is specific', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Process doc contains 5+ actual copy-pasted prompts with specific notes on what each one produced and why it was kept or discarded. Notes show iteration ("v1 was too generic, added voice/length constraints in v2").' },
          { score: 3, label: 'Proficient', description: 'Contains 5 prompts but notes are surface-level ("worked well" / "didn\'t work").' },
          { score: 2, label: 'Developing', description: 'Fewer than 5 prompts, or prompts are paraphrased rather than copy-pasted.' },
          { score: 1, label: 'Beginning', description: 'No prompts shown, or prompts are obviously fabricated after the fact.' },
        ]},
        { name: 'Failure Story is honest and specific', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Identifies exactly where AI failed (specific output, specific prompt), explains why it failed, and shows the specific fix that was applied. Names the tool, names the failure mode, names the workaround.' },
          { score: 3, label: 'Proficient', description: 'Names a real failure but misses one of the three (what failed / why / how it was fixed).' },
          { score: 2, label: 'Developing', description: 'Failure described in vague terms ("the AI got it wrong so I tried again").' },
          { score: 1, label: 'Beginning', description: 'No failure story, or claims everything worked perfectly the first time (which is never true).' },
        ]},
        { name: 'Demo communicates the leverage moment', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Demo is under 90 seconds, shows the build working, AND includes a clear moment where the student points to one specific thing and says "I could not have made this part without AI because ___."' },
          { score: 3, label: 'Proficient', description: 'Demo shows the build but the AI-leverage moment is implied rather than called out directly.' },
          { score: 2, label: 'Developing', description: 'Demo shows the build but is over time, or skips actually demonstrating it works.' },
          { score: 1, label: 'Beginning', description: 'No demo submitted, or demo doesn\'t show the build functioning.' },
        ]},
      ]
    },

    { type: 'section_header', id: 'sh-exemplars', label: 'Exemplars' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'Demo Day pitch: a one-paragraph build summary, the most important prompts you wrote, the failure story, and the 60-second demo script — all for a single AI-assisted build.',
      strong: {
        label: 'Strong Response — "Hive Tactics"',
        body: `**Sample Build: "Hive Tactics" — an interactive Warhammer 40K Tyranid faction selector**\n\n**The Pitch:** A web app where players answer 8 questions about their playstyle and get a recommended Tyranid hive fleet, with custom AI-generated lore for that fleet, an art card showing their hive\'s "look," and a starter army list. Built in 5 days by one student who has never written code before.\n\n**The Prompts (excerpts from the process doc):**\n\n*Prompt 1 (Bolt.new):* "Build a single-page web app with 8 multiple-choice questions. Each question has 4 options. Each option awards points to one of 6 hive fleet types: Leviathan, Kraken, Behemoth, Hydra, Gorgon, Tiamet. After question 8, show the highest-scoring fleet with a description box. Mobile-friendly, dark background, neon green accent."\n→ *Bolt deployed it on the first try and gave me a public URL. The questions it generated were generic ("What is your favorite color?") so I had to rewrite them all manually using the actual lore.*\n\n*Prompt 4 (Nano Banana 2 via aistudio.google.com):* "Top-down splash art of a Tyranid Hive Fleet Kraken bio-ship descending on a forge world. Massive scale, biomechanical horror, deep purple and acid green, no text, cinematic lighting, no chaos symbols."\n→ *First three outputs had Imperial eagles in them, which makes no sense for Tyranids. Added "no Imperial iconography, no eagles, alien architecture only" to the prompt and the 4th output was the keeper.*\n\n**The Failure Story:** "Bolt kept generating placeholder lore that read like generic sci-fi (\'the alien horde descended\'). I needed lore that sounded like real Warhammer codex writing. The fix: I copy-pasted three actual paragraphs from the Tyranid codex into Bolt as a style reference and said \\"write in this exact voice — heavy on Imperial dread, archaic phrasing, third-person ominous narrator.\\" The outputs after that were good enough that one of my friends thought I copied them from the actual codex."\n\n**The Demo (transcript):** "Hi, I built Hive Tactics. *(Opens phone)* I answer the questions — I prefer overwhelming numbers, I prefer attrition, etc. *(Submits)* Boom — Hive Fleet Leviathan, custom lore in the codex voice, custom splash art that doesn\'t exist anywhere else, and a starter list with point costs that match the actual game. *(Points to art)* I could not have made this image without AI. I cannot draw. This took me 11 prompts to get right. The whole app took 5 days. Three years ago this would have been a $5,000 freelance project."`,
        annotations: [
          'The build genuinely couldn\'t exist without AI — custom code + custom art + custom lore in a specific voice, three different AI capabilities stacked on each other',
          'Specific tools named (Bolt.new, Nano Banana 2 via AI Studio), specific failure modes named (placeholder lore, Imperial eagles), specific fixes named (style-reference paragraphs, negative prompts)',
          'The demo points at one specific artifact and explains exactly why AI was load-bearing for that piece',
          'The Failure Story has all three required parts: what failed, why it failed, and how it got fixed',
        ]
      },
      weak: {
        label: 'Weak Response — "My AI Project"',
        body: `**Sample Build: "My AI Project" — a poster about endangered animals**\n\n**The Pitch:** "I made a poster about endangered animals using AI. It has facts and pictures."\n\n**The Prompts:** "I asked ChatGPT to give me facts about pandas. I asked it to give me facts about polar bears. I used Canva to put it together. I used DALL-E to make a picture of a panda."\n\n**The Failure Story:** "Sometimes the AI got things wrong but I just tried again and it worked."\n\n**The Demo:** *(holds up phone showing a Canva poster)* "Here\'s my poster. I made it with AI."`,
        annotations: [
          'A poster is not "something you couldn\'t have made alone" — anyone could have made this in Canva in 30 minutes without ever touching AI, so the leverage isn\'t there',
          '"I asked ChatGPT for facts" doesn\'t document a prompt — there are no actual prompts, no outputs to react to, no decisions to defend',
          '"I just tried again and it worked" is the opposite of a Failure Story — a real one names a specific output, a specific reason it was wrong, and a specific fix',
          'The demo doesn\'t show anything happening — there\'s no functional artifact and no moment of "look at this thing AI made possible"',
        ]
      }
    },

    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Paste the link to your final project hub (Google Doc or Slides) here. Your hub should contain: (1) the link to or file of the build itself, (2) your process doc with 5+ prompts and the Failure Story, (3) the link to your demo video. Make sure the link is set to "Anyone with the link can view."' },

    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What did AI let you do on this project that you genuinely could not have done alone? Be specific — name the artifact, name the skill you don\'t have, name the AI capability that filled the gap.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Where did AI fail on this project — and what did you (the human) have to do that AI could not? This is the most important question on the reflection. Be honest.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If you had to ship a second version of this build with one more week, what would you change — and would AI help with the change, or would you need a real human skill you don\'t have yet?' },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
    await ref.set(lesson);
    console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
