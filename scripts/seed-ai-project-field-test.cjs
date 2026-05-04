/**
 * AI Literacy — Course Project: AI Tool Field Test
 * Lesson ID: ai-project-field-test
 * Order: 70 | Visible: false
 * Multi-day project. Students pick ONE real-life task, use an AI tool every day for one week,
 * keep a daily log, and produce a written report + 60-second video reflection (or slide deck).
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-field-test.jpg';

const lesson = {
  id: 'ai-project-field-test',
  title: 'AI Tool Field Test: One Week, Real Life, Honest Findings',
  unit: 'Course Projects',
  order: 70,
  visible: false,
  blocks: [
    // ---- 1. Warm Up ----
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },

    // ---- 2. Objectives ----
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Test a real AI tool against a real task in your own life over multiple days',
      'Document specific successes and specific failures with evidence',
      'Distinguish between what AI is actually good at and what it just looks good at',
      'Communicate your findings in writing and on camera with honesty and detail',
    ]},

    // ---- 3. Hook question ----
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Think about the last time you used an AI tool for something that actually mattered — a real assignment, a real decision, a real plan. Did it deliver? Where did it fall short? Be specific.' },

    // ---- 4. Hero image ----
    { type: 'image', id: id(), url: HERO_URL,
      alt: 'A student\'s notebook open beside a phone running an AI chatbot — daily log entries dated across one week, with handwritten margin notes marking what worked and what failed.' },

    // ---- 5. The Project ----
    { type: 'section_header', id: 'sh-project', label: 'The Project' },

    // ---- 6. What you are doing ----
    { type: 'text', id: id(), content: `For one week, you are going to put an AI tool through a real-life test. Not a homework prompt. Not a hypothetical. Something you actually do.\n\nPick ONE task you do regularly — something that actually matters to you. Examples:\n\n- Studying for a specific class or test\n- Planning workouts or tracking progress in a sport\n- Meal prep or following a diet\n- A hobby workflow (drawing, music production, video editing, gaming, woodworking)\n- College or career research\n- Managing a part-time job or side hustle\n- A creative project you've been working on\n\nThen pick ONE AI tool and use it every single day for seven days to help with that task. Keep a daily log. Pay close attention to where the tool helps, where it wastes your time, where it gets things flat-out wrong, and where it surprises you.\n\nAt the end of the week, you will write a report and record a short video (or build a slide deck) about what you actually learned — not what you expected, not what AI marketing told you, what you actually saw.` },

    // ---- 7. Project goal callout ----
    { type: 'callout', id: id(), style: 'info',
      content: '**Your project goal:** Surface the gap between what AI is sold as and what AI actually does — using one specific tool, one specific task, and one week of honest evidence.' },

    // ---- 8. What You'll Make ----
    { type: 'section_header', id: 'sh-deliverables', label: "What You'll Make" },

    // ---- 9. Deliverables (checklist) ----
    { type: 'checklist', id: id(),
      title: 'Deliverables',
      items: [
        'ONE Google Doc or Slides deck containing all three pieces below, with clear headings and readable formatting',
        'Daily Log: 7 entries (one per day, dated), each ~75 words, including the exact task, the exact prompt or input, an excerpt or screenshot of what the AI produced, and what worked / failed / what you actually used',
        'Findings Report: 500–700 words with four sections — The Setup (75–100 words: tool, task, why), What Worked (150–200 words: 2–3 specific wins with day + example), What Failed (150–200 words: 2–3 specific failures with day + example), The Verdict (100–150 words: would you keep using it, why, be specific)',
        'Reflection Video OR Slide Deck (pick one): a 60-second video of you on camera summarizing your single biggest finding (phone-recorded fine, look at the camera, do not read a script word-for-word) — OR a 5-slide deck with tool + task / biggest win / biggest fail / biggest surprise / final verdict, one image per slide max, no paragraphs',
        'Submission link: paste the YouTube unlisted link, Google Drive share link, or slide deck link inside the Google Doc before you submit',
      ]
    },

    // ---- 10. Day-by-Day Process ----
    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },

    // ---- 11. Process ----
    { type: 'text', id: id(), content: `This project runs across 7 days. Plan ahead — you cannot do this the night before.\n\n**Day 1 — Setup**\n- Pick your task. Pick your AI tool. Write down what you expect the tool to do well and what you expect it to fail at. (You'll check this against reality at the end.)\n- Make a copy of the daily log template. Open it now.\n- Do the task with AI assistance. Write your Day 1 log entry the same day.\n\n**Days 2–4 — Daily Use**\n- Use the AI tool every day for the task. Push it. Don't just ask easy questions — see where it breaks.\n- Try to get specific answers, specific outputs, specific work product. Vague prompts give vague results, and you'll learn nothing.\n- Log every day, same day. Logs written from memory three days later are useless.\n\n**Day 5 — Stress Test**\n- Today, deliberately try something the tool probably won't do well. A weird edge case. A task that requires real-world knowledge. Something personal. Something that needs current information.\n- Log what happens.\n\n**Day 6 — Comparison**\n- Today, do part of the task WITHOUT AI. Then do the same part with AI. Compare. Which was faster? Which was better? Which felt better to do?\n- Log the comparison honestly.\n\n**Day 7 — Wrap & Write**\n- Final use of the tool. Then write your Findings Report and record your video / build your deck.\n- Re-read your daily logs before you write the report. Pull specific examples from them.\n\n**Submission Day** — Paste your Google Doc or Slides link in the submission box at the bottom of this lesson.` },

    // ---- 12. Rubric ----
    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },

    // ---- 13. Rubric block ----
    { type: 'rubric', id: id(),
      title: 'Project Rubric',
      totalPoints: 100,
      intro: 'Each of the five criteria is scored 1–4 and weighted to add up to 100. Graders look for specificity and honesty over polish.',
      criteria: [
        {
          name: 'Daily Log Quality',
          weight: 20,
          levels: [
            { score: 4, label: 'Exemplary', description: 'All 7 entries present, each with task + prompt + AI output excerpt + honest assessment. Clear evidence the work was done day-by-day, not backfilled the night before.' },
            { score: 3, label: 'Proficient', description: 'All 7 entries present but some are thin or missing one of the four required elements (task, prompt, output excerpt, assessment).' },
            { score: 2, label: 'Developing', description: 'Fewer than 7 entries, or entries are vague summaries with no concrete examples, prompts, or outputs.' },
            { score: 1, label: 'Beginning', description: 'Logs are absent, fabricated, or under 30 words each.' },
          ]
        },
        {
          name: 'Specificity of Examples',
          weight: 25,
          levels: [
            { score: 4, label: 'Exemplary', description: 'Findings Report cites specific days, specific prompts, and quotes or screenshots actual AI output. A reader can picture exactly what happened.' },
            { score: 3, label: 'Proficient', description: 'Most claims are backed by specific examples; one or two statements are general or unsupported.' },
            { score: 2, label: 'Developing', description: 'Generalities dominate ("the AI was helpful sometimes"). Few concrete examples and no quoted output.' },
            { score: 1, label: 'Beginning', description: 'No specific examples. Claims are unsupported and could have been written without doing the project.' },
          ]
        },
        {
          name: 'Honesty About Failure',
          weight: 20,
          levels: [
            { score: 4, label: 'Exemplary', description: 'Identifies at least 2 specific failure modes. Names exactly what the AI got wrong, why it was wrong, and what you did instead. Doesn\'t let the tool off the hook.' },
            { score: 3, label: 'Proficient', description: 'Identifies failures but the explanation is shallow ("it just didn\'t work well") and missing the underlying reason.' },
            { score: 2, label: 'Developing', description: 'Mentions one failure briefly. Tone stays mostly positive and avoids hard observations.' },
            { score: 1, label: 'Beginning', description: 'No failures identified, or "it was great at everything!" energy.' },
          ]
        },
        {
          name: 'Verdict Reasoning',
          weight: 20,
          levels: [
            { score: 4, label: 'Exemplary', description: 'Verdict ties directly back to specific evidence in the log. Position is defensible. Acknowledges trade-offs (e.g., "fast but unreliable, so I\'d use it for X but not Y").' },
            { score: 3, label: 'Proficient', description: 'Verdict is clear but the reasoning is general and not anchored to specific log entries.' },
            { score: 2, label: 'Developing', description: 'Verdict is vague or contradicts the evidence shown earlier in the report.' },
            { score: 1, label: 'Beginning', description: 'No real verdict. Closes with "it was okay I guess" or no answer at all.' },
          ]
        },
        {
          name: 'Reflection Quality (Video or Deck)',
          weight: 15,
          levels: [
            { score: 4, label: 'Exemplary', description: 'Communicates the single biggest finding clearly. Feels like a person talking, not a script being read. Slides (if chosen) are clean, with one image per slide max and no paragraphs of text.' },
            { score: 3, label: 'Proficient', description: 'Clear and complete but feels rehearsed or generic; lands the finding without making it memorable.' },
            { score: 2, label: 'Developing', description: 'Surface-level. Repeats the report without adding anything new or specific.' },
            { score: 1, label: 'Beginning', description: 'Missing, way under length, or unwatchable / unreadable.' },
          ]
        },
      ]
    },

    // ---- 14. Strong vs Weak Exemplar ----
    { type: 'section_header', id: 'sh-exemplars', label: 'Strong vs. Weak Response' },

    { type: 'exemplar_compare', id: id(),
      prompt: 'Both responses are writing the **"What Failed"** section of the Findings Report. The student tested ChatGPT for a 4-day-a-week pull/push/legs gym split. Compare how each one handles the same task.',
      strong: {
        label: 'Strong Response',
        body: `**What Failed**\n\nI used ChatGPT to help me build a 4-day-a-week pull/push/legs split for the gym. Two specific failures showed up.\n\nFirst, on Day 3 I asked it to swap out barbell rows because my school doesn't have a power rack free during my lunch. It gave me cable rows as a replacement, which is fine, but it kept the same weight and rep scheme — 4x6 at 185lbs — even though cable rows at my gym top out around 150lbs and feel completely different. It treated the swap as a name change, not a movement change. I ended up just dropping the weight myself and adding a set, but a beginner would have either failed the workout or skipped legs because the program said "185" and they couldn't hit it.\n\nSecond, on Day 5 I asked it to help me deload because my lower back was sore. It gave me what looked like a deload week — lower volume, lower intensity — but it still had me deadlifting on Day 5 of a deload. Every credible coaching source I've read says you cut the deadlift entirely or move to RDLs at 50% during a deload week, especially if your back is the thing that's tired. The AI knew the word "deload" but didn't actually understand what one is for.`,
        annotations: [
          'Names the exact tool, exact task, and exact day each failure happened',
          'Quotes the actual broken output ("4x6 at 185lbs," "deadlifting on Day 5 of a deload")',
          'Explains the underlying reason the AI got it wrong, not just that it was wrong',
          'Connects the failure to a real consequence ("a beginner would have failed the workout")',
        ]
      },
      weak: {
        label: 'Weak Response',
        body: `**What Failed**\n\nChatGPT was helpful most of the time but sometimes it didn't really get what I wanted. A few times the answers were kind of generic and I had to fix them myself. It also made some mistakes with the workout plan but I just changed them. Overall it was useful but not perfect, like every AI tool. You always have to double-check the answers because AI can make stuff up sometimes.`,
        annotations: [
          'Names no specific failures — just "sometimes" and "a few times"',
          'Never quotes a single thing the AI actually said or did',
          'The phrase "AI can make stuff up sometimes" is a generic talking point, not an observation from this student\'s actual week',
          '"I just changed them" hides the interesting part — the *what* and the *why*. A grader has nothing to learn from this paragraph.',
        ]
      }
    },

    // ---- 15. Submit ----
    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },

    // ---- 16. Submission ----
    { type: 'slide_submit', id: 'submit-final',
      prompt: 'Paste the share link to your Google Doc or Google Slides containing your daily log, findings report, and video link or slides. Make sure sharing is set so anyone with the link can view.',
      maxScore: 100 },

    // ---- 17. Reflection ----
    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },

    // ---- 18. Reflection questions ----
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What did you discover about your AI tool that you could not have learned from a textbook, a tutorial, or a marketing page? Be specific.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Looking back at the predictions you wrote on Day 1, where were you right about the tool and where were you wrong? What does that tell you about how you judge AI tools before testing them?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'For someone your age picking up this same AI tool tomorrow, what is the single most important thing you would tell them — not about AI in general, but about THIS tool for THIS kind of task?' },
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
