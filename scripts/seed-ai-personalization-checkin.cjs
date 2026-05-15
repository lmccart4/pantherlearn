/**
 * Seeds the "Quick Check-In" lesson for all 4 AI Literacy sections.
 *
 * 10 native PantherLearn question blocks (no Google Forms, no email matching).
 * Student responses land in Firestore under progress/{uid}/lessons/{lessonId}.
 * Lachlan pulls them Sunday night to draft personalized Suno songs.
 *
 * Seeded visible:false. Flip visible:true Friday morning (handled by the
 * scheduled flip-visible task — see scripts/flip-ai-personalization-checkin.cjs).
 *
 * Usage:
 *   cd ~/pantherlearn && node scripts/seed-ai-personalization-checkin.cjs
 */

const path = require('path');
const admin = require('firebase-admin');
const { safeLessonWrite } = require(path.join(__dirname, 'safe-lesson-write.cjs'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(process.env.HOME + '/.config/firebase/pantherlearn-admin.json')),
  });
}
const db = admin.firestore();

const COURSES = {
  'Y9Gdhw5MTY8wMFt6Tlvj': 'AI Literacy — Period 4',
  'DacjJ93vUDcwqc260OP3': 'AI Literacy — Period 5',
  'M2MVSXrKuVCD9JQfZZyp': 'AI Literacy — Period 7',
  'fUw67wFhAtobWFhjwvZ5': 'AI Literacy — Period 9',
};

const LESSON_ID = 'ai-personalization-checkin';

// Hardcoded block IDs so re-seeds preserve progress (per grade-data-integrity rule).
const lesson = {
  title: 'Quick Check-In',
  unit: 'Year-End Projects',
  order: 68,
  visible: false,
  gradesReleased: false,
  dueDate: '2026-05-18',
  objectives: [
    'Share a few personal details that will fuel a surprise activity next class.',
  ],
  blocks: [
    {
      type: 'text',
      id: 'pc-intro',
      content:
        "Quick check-in — should take about **4 minutes**.\n\n" +
        "I'm going to use your answers to set up something for Monday. " +
        "It's a surprise, but I want you to know up front: **an AI tool will read what you write here.** " +
        "Keep it school-appropriate, but have fun with it. You can skip any question except your name.\n\n" +
        "— Mr. McCarthy",
    },

    // Q1 — Name (pronunciation)
    {
      type: 'question',
      id: 'pc-q1-name',
      questionType: 'short_answer',
      prompt: "**Your name** — first and last, spelled the way you want it said out loud.\n\nIf your name gets mispronounced a lot, write it phonetically (example: 'Jeyson = JAY-son').",
    },

    // Q2 — Vibe (3 words)
    {
      type: 'question',
      id: 'pc-q2-vibe',
      questionType: 'short_answer',
      prompt: "**Pick 3 words that describe your vibe.**\n\nExample: chill, competitive, funny",
    },

    // Q3 — Hobby
    {
      type: 'question',
      id: 'pc-q3-hobby',
      questionType: 'short_answer',
      prompt: "**What sport, hobby, or activity are you actually into right now?**\n\nExample: soccer, anime, baking, gym, Fortnite, cars, drawing",
    },

    // Q4 — Hype song
    {
      type: 'question',
      id: 'pc-q4-hypesong',
      questionType: 'short_answer',
      prompt: "**What's your walk-up / hype song?**\n\n(Or the song you've been replaying most lately.) Artist + song title.",
    },

    // Q5 — Genres (multi via comma-separated short answer; PantherLearn has no checkbox question type)
    {
      type: 'question',
      id: 'pc-q5-genres',
      questionType: 'short_answer',
      prompt:
        "**What music genres do you actually listen to?**\n\n" +
        "Pick all that apply, separated by commas:\n\n" +
        "reggaeton · corridos tumbados · regional Mexican · bachata · salsa · hip-hop · rap · R&B · pop · rock · indie · K-pop · EDM · country · other (write it in)",
    },

    // Q6 — Language preference (opinion MC — every answer is valid, use allCorrect)
    {
      type: 'question',
      id: 'pc-q6-language',
      questionType: 'multiple_choice',
      prompt: "**If we wrote a song about you, would you want it in...**",
      options: [
        'English only',
        'Spanish only',
        'Bilingual (mix of both)',
        "Doesn't matter, surprise me",
      ],
      correctAnswer: 0,   // ignored because allCorrect
      allCorrect: true,
    },

    // Q7 — Known for / roasted for
    {
      type: 'question',
      id: 'pc-q7-knownfor',
      questionType: 'short_answer',
      prompt: "**What are you known for in class?** Or what do your friends roast you about?\n\nBe honest — this is where the personality comes through.",
    },

    // Q8 — Goal
    {
      type: 'question',
      id: 'pc-q8-goal',
      questionType: 'short_answer',
      prompt: "**What's something you're working toward?**\n\nCareer, college, money goal, skill, anything. Example: play college soccer, become a nurse, save up for a car, make it as a producer.",
    },

    // Q9 — Anything else
    {
      type: 'question',
      id: 'pc-q9-anythingelse',
      questionType: 'reflection',
      prompt: "**Anything else you want the song — I mean, the *lesson* — to know about you?**\n\nOptional. Skip if you got nothing.",
    },
  ],
};

(async () => {
  for (const [courseId, label] of Object.entries(COURSES)) {
    process.stdout.write(`Seeding ${label} (${courseId}) ... `);
    try {
      await safeLessonWrite(db, courseId, LESSON_ID, lesson);
      console.log('OK');
    } catch (e) {
      console.log('FAIL');
      console.error('   ', e.message);
    }
  }
  console.log('\nDone. Lesson seeded hidden across all 4 AI Literacy periods.');
  console.log('Next: scheduled task will flip visible:true on Friday morning.');
  process.exit(0);
})();
