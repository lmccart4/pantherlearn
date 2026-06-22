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
    { type: 'external_link', id: id(),
      url: 'https://docs.google.com/presentation/d/1NrCvvEpAPNY6KYNo2ZCv-x4gWkAwzsABFBOyehbNBB4/copy',
      title: 'Project Slides Template (REQUIRED)',
      description: 'Click to open the template. File → Make a copy. Do ALL your work inside your copy. This is your submission — every slide is already laid out for you: The Pitch, The Build, The Prompts, The Failure Story, The Demo, Reflection, and a Rubric Self-Check. Do not delete slides.' },

    { type: 'section_header', id: 'sh-categories', label: 'Pick a Build Type' },
    { type: 'callout', id: id(), style: 'tip', content: '**Each card lists a Recommended Stack — one specific tool combo that\'s confirmed to work end-to-end on free tier in May 2026.** Stick with the Recommended Stack unless you have a strong reason to deviate. The whole point is for you to spend Days 2–4 *creating*, not learning a tool.' },
    { type: 'case_cards', id: id(),
      title: 'Pick a Build Type',
      cards: [
        { id: 'card-app', label: '1', title: 'No-Code Web App or Game', body: '**Recommended Stack:** Gemini Canvas (vibe-code iteratively, FERPA/COPPA compliant, ~100 Pro prompts/day) → Google Sites (paste the HTML into an Embed Code widget for a shareable URL).\n\n**The workflow:** Build and iterate inside Gemini Canvas — tweak colors, add features, fix bugs. When the build is stable, copy the HTML/CSS/JS, open Google Sites, drop an Embed Code widget on the page, paste, publish. Your shareable URL is the Google Sites link.\n\n**Scope:** at least 3 functional screens (or 2 minutes of playable gameplay). It must actually run — buttons that go nowhere don\'t count. Final submission is a Google Sites URL.\n\n**Good fit if:** you\'ve always wanted to ship software but don\'t code.' },
        { id: 'card-music', label: '2', title: 'Original Music Track', body: '**Recommended Stack:** Suno (you used this earlier in the semester — familiar interface, full song export) OR Gemini Music (Lyria 3, 10/day on @paps.net, up to 3-minute tracks). Pick whichever platform you prefer.\n\n**Scope:** A coherent **3-track EP** where every track is **3+ minutes long**. All three tracks share a through-line — same vibe, same instrumentation, but different moods (e.g., calm intro / building middle / triumphant close). Submit all three tracks together with a 1-paragraph note explaining the theme that ties them.\n\n**Good fit if:** you\'ve got a song idea in your head but can\'t play an instrument or produce.' },
        { id: 'card-bot', label: '3', title: 'Working Chatbot', body: '**Recommended Stack:** Build a **custom Gem** inside Gemini — give it a name, a personality, a 200+ word instruction set, and (optionally) reference files it should always read. Share it with classmates on @paps.net via the Share button.\n\n**Scope:** a clear niche purpose (homework helper for one specific class, niche advice bot, character roleplay), a custom instruction set 200+ words, tested with 5+ realistic user inputs.\n\n**Good fit if:** you want to build the assistant nobody has built yet.' },
        { id: 'card-site', label: '4', title: 'Interactive Story or Mini-Site', body: '**Recommended Stack:** Gemini Canvas (vibe-code the structure + interactivity) → Google Sites (paste the HTML into an Embed Code widget). For images: Nano Banana 2 via gemini.google.com.\n\n**Scope:** must work on phone, must include AI-generated images you made yourself (not stock photos), must have at least one interactive element (a quiz, a chooser, a hover effect, a clickable storyline branching).\n\n**Good fit if:** you want a visual + interactive build but not full app complexity.' },
        { id: 'card-pod', label: '5', title: 'Podcast or Audio Drama', body: '**Recommended Stack:** NotebookLM — two synthetic hosts have a real conversation about sources you upload. Free, downloads as WAV. Optional theme music: a 30-sec Gemini Music clip used as your intro/outro.\n\n**Scope:** minimum 5 minutes total. Upload a substantial source pack to NotebookLM (your own research notes, a topic dossier, an original script) so the hosts have something specific to talk about — generic prompts produce generic podcasts.\n\n**Good fit if:** you\'re into storytelling and want to make audio without a recording booth or voice actors.\n\n*Heads up: NotebookLM exports WAV. If your final upload spot needs MP3, convert with a free site like cloudconvert.com.*' },
        { id: 'card-data', label: '6', title: 'Data Story or Dashboard', body: '**Recommended Stack:** Gemini Canvas (build + iterate the chart visualization) → Google Sites (paste HTML to deploy) + a real public dataset (CDC, NOAA, FBI, NASA, sports stats, music charts).\n\n**Scope:** must use real data, must answer a specific question, must run in a browser. Paste your CSV into Canvas and ask it to build an interactive HTML chart that explores your question. Iterate until the visualization tells the story clearly, then publish via Google Sites.\n\n**Good fit if:** you like patterns, numbers, or "I wonder if this is true" curiosity.' },
        { id: 'card-visual', label: '7', title: 'Visual Design Campaign', body: '**Recommended Stack:** Canva for Education + Magic Media (Text-to-Image, Text-to-Graphic, Text-to-Video, even 3D renders).\n\n**REQUIRED FIRST STEP:** Accept Mr. McCarthy\'s Canva for Education classroom invitation. The classroom Education plan has higher AI generation limits than personal Canva accounts. If you build using a personal Canva account, you\'ll hit caps fast.\n\n**Scope:** A multi-asset visual campaign for a real cause, club, or issue you care about. Required: at least **5 original AI-generated images** (cohesive style — these should look like they belong together, not random) AND at least **one short AI-generated video clip** (15+ seconds). Final assets: a poster + 3 social media posts + 30-sec hype video, all themed around one idea. (Optional bonus: 1 AI 3D render that fits your campaign theme.)\n\n**Good fit if:** you\'re visually-minded — you think in colors, layouts, typography, and want to ship something professional-looking.' },
      ]
    },
    { type: 'callout', id: id(), style: 'tip', content: 'Pitch your own category to Mr. McCarthy if none of these fit — bring a specific idea, not just "something cool with AI."' },
    { type: 'callout', id: id(), style: 'info', content: '**Cross-cutting tool: NotebookLM** (you learned this on May 8). Available for any category where you want to synthesize your own uploaded sources — research notes, reference docs, transcripts. Especially useful if your build draws on a real body of material (a topic you\'re studying, a niche you know well, source documents for a chatbot\'s knowledge base). Goes alongside the Recommended Stack for your category — not a replacement.' },
    { type: 'callout', id: id(), style: 'warning', content: '**Gemini mode strategy — don\'t waste your Pro prompts.** Gemini has 3 model modes with different daily limits: **Pro** (100/day, for heavy Canvas coding), **Thinking** (300/day, for standard iteration), and **Fast** (virtually unlimited, for media generation). Generating an image or music while in Pro Mode burns BOTH a media credit AND a Pro prompt — wasted reasoning power on a task Fast Mode handles fine. **Always switch to Fast Mode before generating images or music, then switch back to Pro/Thinking when you return to coding.** Over a 5-day build, this discipline can mean the difference between hitting your Pro cap on Day 3 and finishing strong on Day 5.' },

    { type: 'section_header', id: 'sh-tools', label: 'Recommended Tools' },
    { type: 'callout', id: id(), style: 'info', content: 'These are the tools called out in the Recommended Stacks above. All free, all confirmed working in May 2026. Sign in with `lucamccarthy@paps.net` wherever Google sign-in is offered.' },
    { type: 'external_link', id: id(),
      url: 'https://gemini.google.com',
      title: 'Gemini',
      description: 'Your primary surface — covers Canvas (vibe-code HTML/CSS/JS apps and games, ~100 Pro prompts/day), Music with Lyria 3 (30-sec MP3 clips, 10/day), Deep Research (multi-source reports, ~5/day), and Nano Banana 2 image generation. Switch to Fast Mode before generating images or music so you don\'t burn Pro prompts on media.' },
    { type: 'external_link', id: id(),
      url: 'https://gemini.google.com/gems/view',
      title: 'Gemini Gems',
      description: 'Build a custom AI assistant inside Gemini in about 5 minutes — give it a name, a personality, a set of instructions, and (optionally) reference files it should know. Share the Gem with anyone on @paps.net by clicking Share. This is the chatbot path: no code, no SMS verification, fully on your school account.' },
    { type: 'external_link', id: id(),
      url: 'https://sites.google.com',
      title: 'Google Sites',
      description: 'Deploy step for any Canvas-built app or interactive site. Drop an Embed Code widget on a page, paste your HTML, publish — the page URL is your shareable build link.' },
    { type: 'external_link', id: id(),
      url: 'https://notebooklm.google.com',
      title: 'NotebookLM',
      description: 'Podcast-style audio overviews from sources you upload. Two synthetic hosts have a real conversation about your material. Free, 3 audio overviews/day, exports as WAV — convert to MP3 with cloudconvert.com if needed.' },
    { type: 'external_link', id: id(),
      url: 'https://canva.com/education',
      title: 'Canva for Education + Magic Media',
      description: 'Visual Design Campaign primary tool. Magic Media generates images, graphics, video, and 3D renders inside the Canva canvas. **Required first step:** accept Mr. McCarthy\'s classroom invitation — Education plan limits are much higher than personal Canva caps.' },

    { type: 'section_header', id: 'sh-network', label: 'Heads Up: School Network' },
    { type: 'callout', id: id(), style: 'warning', content: '**Test every tool from school wifi on Day 1.** Some media-generation sites get blocked on PAPS school wifi. If something is blocked at school, plan to generate at home or on your phone using cellular data, then assemble at school. Code/chat tools (Gemini Canvas, NotebookLM, Canva) usually work at school.' },

    { type: 'section_header', id: 'sh-deliverables', label: 'Deliverables' },
    { type: 'checklist', id: id(), title: 'Deliverables', items: [
      'A working build — link, file, or video where the artifact actually functions (not a screenshot of an idea)',
      'A completed copy of the Project Slides Template with every slide filled in: The Pitch, The Build, The Prompts (your 5 most important prompts copy-pasted, with notes on what worked and what didn\'t), The Failure Story (one specific moment AI got it wrong and what you did to fix it), The Demo, and Reflection',
      'A 60–90 second demo video (Loom, phone screen recording, or in-class live demo) that shows the build running and calls out the "couldn\'t-have-done-this-alone" moment',
      'One submission link to your copy of the Slides template — sharing set to "Anyone with the link can view"',
    ]},

    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    { type: 'text', id: id(), content: `**Day 1 — Pitch + Tool Smoke Test (in class)**\n- Pick your build category and your specific idea. 2-minute pitch to Mr. McCarthy.\n- Identify the 1–2 tools you\'ll use. **Use the Recommended Stack** for your category unless you have a strong reason to deviate.\n- **Tool Smoke Test (must pass before you leave today):** in your chosen tool, generate ONE test output. Confirm you can download it (or copy the share link). Open the share link in a different browser to confirm it actually works for someone else. Submit the link or screenshot as proof.\n- **If your smoke test fails — swap tools right now, today.** Don\'t lose Day 2 to a paywall or a tool that won\'t export. The whole point of Day 1 is to surface those problems before you invest real time.\n\n**Day 2 — First Build Attempt (in class + homework)**\n- Generate your first version. Don\'t polish — just get something end-to-end working.\n- Save every prompt you write. Copy/paste them into your process doc as you go.\n- Expect this version to be rough. That\'s the point — you need to see what AI gets wrong before you can fix it.\n\n**Day 3 — Iterate & Fix (in class)**\n- Watch/listen/play your Day 2 version. Write down the 3 biggest weaknesses.\n- Re-prompt or use a different tool to fix each one. Document what changed and why.\n- This is where most of the actual learning happens. AI rarely gets it right the first time.\n\n**Day 4 — Polish & Process Slides (homework)**\n- Final pass on the build. Cover art, intro/outro, formatting, whatever your category needs.\n- Fill in every slide of the Project Slides Template. The Failure Story matters most — be honest and specific.\n- Record your demo video and paste the link into Slide 6.\n\n**Day 5 — Demo Day (in class)**\n- Everyone demos. 60–90 seconds each.\n- Audience votes for: Most Ambitious, Best Use of AI, Most Polished, Best Failure Story.\n- Submit your final link.` },

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
        label: 'Strong Response — "Vibe Check"',
        body: `**Sample Build: "Vibe Check" — an interactive aesthetic quiz with custom mood-board art and a music-recommendation Gem**\n\n**The Pitch:** A web app where players answer 10 questions about their daily routines, taste, and energy level, and get matched to one of 8 current aesthetic vibes (cottagecore, cyberpunk, dark academia, coastal grandma, Y2K revival, etc.) — with a custom AI-generated mood-board image for their result, plus a link to a Gemini Gem that gives them ongoing music + outfit recommendations matching their vibe. Built in 5 days by one student who had never written code before.\n\n**The Prompts (excerpts from the process doc):**\n\n*Prompt 1 (Gemini Canvas):* "Build a single-page HTML/CSS/JS web app with 10 multiple-choice questions. Each question has 4 options. Each option awards points to one of 8 aesthetic types: cottagecore, cyberpunk, dark academia, coastal grandma, Y2K, minimalist, art-hoe, soft-grunge. After question 10, show the highest-scoring vibe with a description block, a slot for a mood-board image, and a button labeled \\"Open my Vibe Gem.\\" Mobile-friendly, soft cream background, deep plum accent. Self-contained — no external dependencies."\n→ *Canvas built it in one shot. The questions it generated were generic ("What is your favorite color?") so I rewrote them all manually so each question was actually diagnostic. Then I copied the final HTML, dropped it into Google Sites with an Embed Code widget, and got a shareable URL.*\n\n*Prompt 4 (Nano Banana 2 via gemini.google.com):* "Mood-board collage in the cottagecore aesthetic: a sunlit linen tablecloth with wildflowers, a hand-thrown ceramic mug, a worn paperback book, a wicker basket of fresh-picked strawberries, soft window light. Muted greens and butter yellows. No text overlays, no logos."\n→ *First three outputs had random text on them ("COTTAGECORE" splashed across the image in Canva-style fonts). Added "no text overlays, no typography, no captions in the image" to the prompt and the 4th output was the keeper.*\n\n**The Failure Story:** "The Gem kept giving generic music recommendations (\'try indie music!\') no matter which vibe I picked. I needed it to actually distinguish between aesthetics. The fix: I rewrote the Gem\'s instructions with three real song examples per aesthetic baked in (\'cottagecore = Maisie Peters, Phoebe Bridgers, Adrianne Lenker\') and a hard rule that every recommendation had to name a specific artist plus a specific song. After that the Gem stopped hand-waving and gave actual recommendations."\n\n**The Demo (transcript):** "Hi, I built Vibe Check. *(Opens phone)* I answer the 10 questions — I cook, I read, I prefer the morning, etc. *(Submits)* Boom — cottagecore, custom mood-board art that didn\'t exist before today, plus a button that opens my Vibe Gem. *(Taps the Gem)* I ask \\"what should I listen to walking to school today?\\" and it recommends Maisie Peters\' \'Run\' with a one-line reason. *(Points to mood-board)* I could not have made this image without AI. I cannot draw or paint. This took me 9 prompts to get right. The whole app took 5 days. Three years ago this would have been a freelance design + dev gig."`,
        annotations: [
          'The build genuinely couldn\'t exist without AI — custom code + custom mood-board art + a working chatbot Gem, three different AI capabilities stacked on each other',
          'Specific tools named (Gemini Canvas, Nano Banana 2, Gemini Gems), specific failure modes named (text overlays in image gen, generic Gem responses), specific fixes named (negative prompts, instruction rewrites with concrete examples)',
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
      prompt: 'Paste the link to your copy of the Project Slides Template here. Your slides should contain: (1) The Pitch + approved build category, (2) The Build slide with a working link/screenshot, (3) The Prompts slide with 5+ copy-pasted prompts and notes, (4) The Failure Story slide with one specific moment AI failed and how you fixed it, (5) The Demo slide with a 60–90 second video link, (6) the Reflection slide. Make sure the link is set to "Anyone with the link can view."' },

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
    const snap = await ref.get();
    const currentVisible = snap.exists ? snap.data().visible : false;
    const lessonToWrite = { ...lesson, visible: currentVisible };
    await ref.set(lessonToWrite);
    console.log(`✅ Seeded ${lesson.title} → ${courseId} (visible: ${currentVisible})`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
