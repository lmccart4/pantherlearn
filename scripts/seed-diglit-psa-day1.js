// seed-diglit-psa-day1.js
// Digital Literacy — PSA Sprint, Day 1: Topic + Research (Fri 5/22/2026)
// Run: node scripts/seed-diglit-psa-day1.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "psa-day1-topic-research";

const lesson = {
  title: "PSA Sprint Day 1 — Topic, Audience, and Research",
  questionOfTheDay: "What's the difference between a PSA that actually changes behavior and one that gets mocked on the internet?",
  course: "Digital Literacy",
  unit: "PSA Sprint",
  order: 64,
  visible: false,
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "📣",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What's the difference between a PSA that actually changes behavior and one that gets mocked on the internet?"
    },
    {
      id: "b-warmup-intro",
      type: "text",
      content: "A **Public Service Announcement (PSA)** is a short message designed to change behavior or raise awareness about a real issue. The good ones change minds. The bad ones become memes.\n\nFor the next four class periods, you're going to make one. A real PSA — for a real audience — about a real issue. The top three from this class get sent to admin for the school monitor rotation. Real eyes. Real impact.\n\nBefore we pick topics, we need to figure out what separates a PSA that works from one that doesn't."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of any PSA, anti-drug ad, or awareness campaign you've actually seen — on TV, social media, or a billboard. What was it trying to get you to do? Did it work on you, or did you tune it out? Why?",
      placeholder: "The PSA was about: ...\nIt wanted me to: ...\nIt worked / didn't work because: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Compare an effective PSA (Truth.com 'Tip of the Iceberg') with an ineffective one (90s DARE-style ads) and explain why one works and the other doesn't",
        "Define a specific audience and a single, concrete call-to-action (CTA) for your own PSA",
        "Identify and log 3+ credible sources from a whitelist (.gov, .edu, peer-reviewed, CDC, Pew Research, Common Sense Media)",
        "Distinguish between evidence-based topics and opinion-driven ones"
      ]
    },

    // ─── MAIN: HOOK + DECONSTRUCTION ──────────────────────────

    {
      id: "section-hook",
      type: "section_header",
      icon: "🎬",
      title: "Two PSAs, Side by Side",
      subtitle: "~8 minutes"
    },
    {
      id: "b-truth-vs-dare",
      type: "text",
      content: "We're going to look at two PSAs that took the same kind of subject — substance use — and handled it in completely different ways.\n\n**The Truth.com 'Tip of the Iceberg' campaign** is the gold standard of modern PSAs. It tackled tobacco. It didn't lecture. It didn't show a kid coughing up a lung in slow motion. It just put hard data on screen — *hundreds of thousands of deaths a year, billions in marketing aimed at teens* — and trusted you to draw your own conclusion. Restraint. Respect.\n\n**The 90s DARE ads** did the opposite. Screaming actors. Eggs in frying pans. \"This is your brain on drugs.\" Fear, no data, no specific audience, no specific action. Today they're memes. Studies later showed DARE didn't actually reduce drug use — and may have backfired in some groups.\n\nThe difference between these two is not budget. It's **respect for the audience**."
    },
    {
      id: "img-truth-vs-dare",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/psa-truth-vs-dare-comparison.jpg",
      alt: "Side-by-side comparison: left panel shows a restrained Truth-style anti-tobacco PSA with a single large statistic and a clean call-to-action; right panel shows a fear-based 90s DARE-style ad with screaming faces and 'Drugs are bad!' text",
      caption: "Same subject, two strategies. Restraint earns attention. Fear gets ignored."
    },
    {
      id: "callout-restraint",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Best PSAs respect the audience.** They don't tell you what to think — they show you the data and trust you to think. A 9th grader can smell condescension from a mile away. If your PSA feels like an adult yelling at a teenager, it's already lost."
    },
    {
      id: "q-truth-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Truth.com's 'Tip of the Iceberg' campaign is widely considered an effective PSA. Based on the comparison above, which statement BEST explains why?",
      options: [
        "It used celebrity endorsements teens recognized",
        "It presented data and a clear call-to-action without lecturing or moralizing",
        "It was funnier than the DARE ads, which made it shareable",
        "It threatened legal consequences if teens kept smoking"
      ],
      correctIndex: 1,
      explanation: "Truth's strategy was restraint: present hard data (tobacco deaths, marketing dollars aimed at teens) and let viewers reach the conclusion themselves. That respect is what made it land. Lecturing and fear-mongering — DARE's approach — got tuned out and later mocked.",
      difficulty: "understand"
    },

    // ─── MAIN: THE 4-PIECE PSA STRUCTURE ──────────────────────

    {
      id: "section-anatomy",
      type: "section_header",
      icon: "🧱",
      title: "Anatomy of a PSA That Works",
      subtitle: "~6 minutes"
    },
    {
      id: "b-anatomy",
      type: "text",
      content: "Every effective PSA, video or poster, has the same four pieces. If even one is missing, the whole thing falls apart.\n\n1. **A specific audience.** Not \"teens.\" Not \"the public.\" Specific: *9th graders at PAHS who scroll past midnight.* If you can't picture one real person from that group, the audience is too vague.\n2. **A real, evidence-based problem.** Backed by 3+ credible sources. No \"I think.\" No vibes. Numbers and named institutions.\n3. **One emotional moment.** Brief. Honest. Not exploitative. The goal is to make the audience *feel* the data, not bully them with it.\n4. **One specific call-to-action (CTA).** \"Stop scrolling at 10 PM.\" Not \"be aware.\" \"Text 988 if you're struggling.\" Not \"reach out to someone.\"\n\nThat's it. Audience, problem, moment, action. Four boxes. Every box has to be filled."
    },
    {
      id: "img-psa-structure",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/psa-60-second-structure.jpg",
      alt: "Vertical timeline diagram of an effective 60-second PSA broken into four phases: Hook (0-3 seconds), Problem with data (3-30 seconds), Emotional moment (30-50 seconds), Call-to-Action (50-60 seconds)",
      caption: "The 60-second video PSA, broken into four phases. Posters compress all four onto a single frame."
    },
    {
      id: "q-cta-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the following is the strongest call-to-action for a PSA targeting 9th graders about late-night phone use?",
      options: [
        "Be aware of your screen time",
        "Phones can be bad for you",
        "Plug your phone in across the room before 10 PM",
        "Think about your relationship with technology"
      ],
      correctIndex: 2,
      explanation: "A strong CTA is one specific, concrete action a real person can do today. 'Plug your phone in across the room before 10 PM' is something a 9th grader can literally do tonight. The other three are vague suggestions that don't translate into behavior change.",
      difficulty: "apply"
    },

    // ─── MAIN: AUDIENCE + CTA WORKSHEET ───────────────────────

    {
      id: "section-audience",
      type: "section_header",
      icon: "🎯",
      title: "Audience + CTA Worksheet",
      subtitle: "~10 minutes"
    },
    {
      id: "b-audience-rules",
      type: "text",
      content: "Pick a topic from the approved list (or pitch your own — must be evidence-based, teacher approves before research). Then write your audience and CTA in **one sentence each.** If you can't, the topic isn't ready.\n\n**Approved topic list:**\n- Phone use and sleep\n- School stress / mental health (sensitive — see safe messaging callout below)\n- Online harassment / cyberbullying\n- Financial literacy for teens (saving, scams, predatory lending)\n- Local issues (Perth Amboy pride, voter registration at age 18)\n- Climate / local environment\n\n**Topic guardrails:**\n- Evidence-based only. No opinion pieces, no \"vaccines bad,\" no partisan political endorsements (voter registration is fine; \"vote for X party\" is not).\n- No identifying classmates, teachers, or staff in any video or poster.\n- Sensitive topics (mental health, suicide, self-harm, eating disorders) require teacher approval of the script BEFORE production. Follow safe messaging guidelines: no graphic depictions, no method details, **988 must be visible on screen.**"
    },
    {
      id: "q-audience-cta",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your audience sentence and your CTA sentence. Be specific. Examples of strong sentences:\n- Audience: \"9th graders at PAHS who scroll Instagram and TikTok past midnight on school nights.\"\n- CTA: \"Plug your phone in across the room before 10 PM.\"\n\nIf you can't fill both lines in one specific sentence each, your topic is not ready to research yet.",
      placeholder: "Topic: ...\nAudience (one specific sentence): ...\nCTA (one specific action): ...",
      difficulty: "apply"
    },

    // ─── ACTIVITY: RESEARCH START ─────────────────────────────

    {
      id: "section-research",
      type: "section_header",
      icon: "🔬",
      title: "Research Start",
      subtitle: "~14 minutes"
    },
    {
      id: "b-research-rules",
      type: "text",
      content: "Find **3+ credible sources** for your topic. Log them in your project doc with the URL, the publishing organization, and one statistic or finding you might use.\n\n**Source whitelist — what counts as credible:**\n- **.gov** — government agencies (CDC, NIH, FBI, BLS, Census)\n- **.edu** — university research and educational institutions\n- **Peer-reviewed journals** (Google Scholar, PubMed)\n- **Pew Research Center** — gold-standard polling and behavioral data\n- **Common Sense Media** — teen and tech research\n- **988 Lifeline / AFSP** — for mental health topics\n- Major news organizations citing the above\n\n**What does NOT count:**\n- Random TikTok or Instagram posts\n- Reddit threads, YouTube comments, opinion blogs\n- Anything without a clear author or publisher\n- AI-generated content with no original sourcing\n- Anything you can't trace back to a study, dataset, or named institution\n\nIf you can't cite the source, **cut the claim.** That's the rule."
    },
    {
      id: "b-research-links",
      type: "text",
      content: "Use these starter links to find credible data on most approved topics. Open each, search your topic, and log what you find."
    },
    {
      id: "ext-cdc",
      type: "external_link",
      url: "https://www.cdc.gov/",
      title: "CDC — Centers for Disease Control and Prevention",
      description: "Official US public-health source. Best for sleep, mental health, suicide prevention, vaping, substance use, and adolescent behavior data. Search '[topic] adolescents' or '[topic] teens'."
    },
    {
      id: "ext-pew",
      type: "external_link",
      url: "https://www.pewresearch.org/topic/internet-technology/",
      title: "Pew Research Center — Internet & Technology",
      description: "Gold-standard polling on teens, tech, social media, news, and politics. Search 'teens' or your topic to find current US-representative survey data."
    },
    {
      id: "ext-commonsense",
      type: "external_link",
      url: "https://www.commonsensemedia.org/research",
      title: "Common Sense Media — Research",
      description: "Annual reports on teens and tech: screen time, social media, sleep, mental health, online harassment. Use the Census of Tweens and Teens for statistics you can put on screen."
    },
    {
      id: "ext-988",
      type: "external_link",
      url: "https://988lifeline.org/",
      title: "988 Suicide & Crisis Lifeline",
      description: "If your PSA touches on mental health, suicide, or self-harm: cite 988 and embed it visibly on screen. This is the official national crisis line — text or call 988."
    },
    {
      id: "ext-afsp",
      type: "external_link",
      url: "https://afsp.org/safe-messaging-guidelines",
      title: "AFSP — Safe Messaging Guidelines",
      description: "Required reading if your topic is mental health, suicide, or self-harm. Tells you exactly what to show and what NOT to show. Read this before writing a single line of script."
    },
    {
      id: "ext-truth",
      type: "external_link",
      url: "https://www.thetruth.com/",
      title: "Truth.com — Reference Campaigns",
      description: "Browse the Truth campaigns to study the gold standard. Watch 2-3 spots and note: how do they hook? what's their CTA? how do they handle data?"
    },
    {
      id: "q-sources",
      type: "question",
      questionType: "short_answer",
      prompt: "Log your first 3 sources here. For each, paste the URL, name the publishing organization, and write one statistic or finding you might use in your PSA. Reminder: only sources from the whitelist (.gov, .edu, peer-reviewed, Pew, Common Sense Media, 988/AFSP) count.",
      placeholder: "Source 1 — URL / Organization / Stat or finding:\nSource 2 — URL / Organization / Stat or finding:\nSource 3 — URL / Organization / Stat or finding:",
      difficulty: "analyze"
    },

    // ─── ACTIVITY: TIE-BACK ───────────────────────────────────

    {
      id: "section-tieback",
      type: "section_header",
      icon: "🧩",
      title: "Tie-Back: This PSA Is Built On Everything You've Done",
      subtitle: "~3 minutes"
    },
    {
      id: "b-tieback",
      type: "text",
      content: "This is the **capstone-before-the-capstone.** Every prior sprint plugs in:\n\n- **Brand Kit voice** — your PSA needs a brand. Color palette, type pairing, tone.\n- **Photo Essay + Short-Form** — production. Framing, pacing, captions, exporting for the right platform.\n- **Data Lit + Infographic** — evidence. Numbers on screen, sources cited, no fake stats.\n- **Algorithm Economy** — hook in the first 3 seconds, target a specific audience, design for the platform you're on.\n\nA PSA that ignores any of these dies in the feed. One that uses all four can actually change behavior."
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
      content: "**Topic guardrails — non-negotiable:**\n\n- **Evidence-based only.** No opinion pieces, no partisan endorsements, no fake statistics. If you can't cite the source, cut the claim.\n- **No identifying classmates, teachers, or staff** in any video or poster. Use yourself, willing volunteers with consent, or stock/illustrative footage only.\n- **Sensitive topics** (mental health, suicide, self-harm, eating disorders) require teacher approval of the script BEFORE production. Follow safe messaging: no graphic depictions, no method details, 988 visible on screen.\n- **Check in with yourself.** If researching a topic is putting you in a bad place mentally, switch topics or talk to me. Your wellbeing matters more than any project."
    },
    {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content: "**Weekend homework (Memorial Day weekend, 5/23–5/25):** Deepen research, draft your script (video) or headline copy (posters). Bring drafts to class **Tuesday 5/26.** No drafts = no production day Wednesday."
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit ticket: In 3-4 sentences, lock in your plan. What's your topic? Who's your audience (one specific sentence)? What's your CTA (one specific action)? What format are you choosing — 60-second video or 3-poster series — and why?",
      placeholder: "Topic: ...\nAudience: ...\nCTA: ...\nFormat (video or posters) and why: ...",
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
