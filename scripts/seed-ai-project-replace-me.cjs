/**
 * AI Literacy — Course Project: Replace Me — An Automation Experiment
 * Lesson ID: ai-project-replace-me
 * Order: 78 | Visible: false
 * Multi-day project. Students pick a workflow they currently do and try to FULLY automate it
 * with AI. Goal: find exactly where AI breaks down. Critical lab work for "Will AI take your job?"
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-replace-me.jpg';

const lesson = {
  id: 'ai-project-replace-me',
  title: 'Replace Me: Try to Automate Your Own Workflow',
  unit: 'Course Projects',
  order: 78,
  visible: false,
  blocks: [
    // ---- 1. Warm Up ----
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },

    // ---- 2. Objectives ----
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Break a real workflow you do into discrete, repeatable steps',
      'Attempt to fully automate that workflow using AI tools',
      'Identify the specific points where AI fails and explain why those points are hard',
      'Make a defensible argument about whether your task is replaceable by AI today',
    ]},

    // ---- 3. Hook question ----
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Pick a job you can imagine yourself doing in 10 years. Which parts of it do you think AI can already do well? Which parts do you think it will never replace? Why?' },

    // ---- 4. Hero image ----
    { type: 'image', id: id(), url: HERO_URL,
      alt: 'A workflow diagram on a whiteboard — discrete steps drawn as a flowchart, with several boxes circled in red and labeled "AI broke here," and human silhouettes inserted at the failure points.' },

    // ---- 5. The Project ----
    { type: 'section_header', id: 'sh-project', label: 'The Project' },

    // ---- 6. What you are doing ----
    { type: 'text', id: id(), content: `Everyone keeps asking the same question — "Will AI take my job?" The honest answer is: nobody knows in the abstract, but you can absolutely test it for one specific task. That is what this project is.\n\nYou are going to pick a workflow you actually do — something with real steps — and try to fully automate it with AI. Not "AI helps me." Full replacement. The AI does the whole thing, end to end, while you watch.\n\nThen you are going to document — with brutal honesty — exactly where the automation breaks down.\n\nGood candidate workflows:\n\n- Studying for a specific test (notes → flashcards → practice problems → review)\n- Writing a particular type of school assignment you do often\n- A part-time job task (taking orders, restocking, scheduling, replying to customer messages)\n- A hobby workflow (editing a video, writing a song, drawing a character, building a deck)\n- A household task (planning meals for the week, doing laundry intake-to-folded, helping a sibling with homework)\n- A sports or training workflow (planning a workout, breaking down film, tracking progress)\n\nPick something you've done at least 5 times. You need to know what "good" looks like, because you're the judge.` },

    // ---- 7. Project goal callout ----
    { type: 'callout', id: id(), style: 'info',
      content: "**Your project goal:** Try to make AI replace YOU on one specific task. Document exactly where it can't, and explain why those points are the hard ones." },

    // ---- 8. What You'll Make ----
    { type: 'section_header', id: 'sh-deliverables', label: "What You'll Make" },

    // ---- 9. Deliverables (checklist) ----
    { type: 'checklist', id: id(),
      title: 'Deliverables',
      items: [
        'ONE Google Doc with all four sections below, clear headings, ~1,200–1,500 words total plus screenshots',
        'Section 1 — The Original Workflow (200–300 words): your current process step-by-step, granular enough that a stranger could follow it and replicate the task',
        'Section 2 — The Automation Attempt (350–450 words + screenshots): which AI tool(s) you used and why, the exact prompts you gave (pasted in), the actual AI output (excerpts or screenshots), workarounds you tried, and where you had to step back in as a human',
        'Section 3 — The Failure Points (300–400 words): for each AI failure, document WHAT it failed at and WHY (judgment, real-world knowledge, physical action, taste, ethics, current information, your context) — and whether a future AI could fix it or the failure is structural',
        'Section 4 — The Verdict (250–350 words): one of "Fully replaceable / Partially replaceable / Not replaceable today," defended with at least 3 specific pieces of evidence, ending with what would have to change for the verdict to flip',
        'Submission: paste the Google Doc share link in the submission box (sharing set to anyone-with-link can view)',
      ]
    },

    // ---- 10. Day-by-Day Process ----
    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },

    // ---- 11. Process ----
    { type: 'text', id: id(), content: `This project runs across 6 days. The hardest part is being honest, especially when the AI does better than you expected.\n\n**Day 1 — Pick & Map**\n- Pick your workflow. It must be something you've done at least 5 times.\n- Write Section 1 (The Original Workflow) before you touch any AI. This is your baseline.\n- If your workflow is shorter than 5 distinct steps, pick a different workflow — it isn't substantial enough.\n\n**Day 2 — First Attempt**\n- Pick your AI tool. Write the best prompt you can — give it your full step-by-step from Section 1 and ask it to produce the final output for you.\n- Save the prompt and the output. Take screenshots.\n- Note where the output is good. Note where it falls apart.\n\n**Day 3 — Iterate**\n- Take everything you learned from Day 2 and try again. Better prompt, more context, multiple tools chained together if needed (e.g., one tool for research, another for writing, another for images).\n- Save every version. The history is the project.\n\n**Day 4 — Hand-Off Test**\n- Take the AI's best output and treat it like the real deliverable. Would you actually use this? Submit this? Show this to a customer? A coach? A teacher?\n- Where does it fail the "actually use it" test? Be specific.\n\n**Day 5 — Write Sections 2 and 3**\n- Document the attempt and the failure points while the work is fresh. Don't trust your memory.\n- Pull in screenshots, prompt excerpts, AI output excerpts. Show your evidence.\n\n**Day 6 — Verdict + Polish**\n- Write Section 4 (The Verdict) last, after you've laid out all the evidence. Your verdict must be defensible from the evidence in Sections 2 and 3.\n- Re-read the whole thing as if you didn't do it. Does it hold up?\n\n**Submission Day** — Paste your Google Doc share link in the submission box.` },

    // ---- 12. Rubric ----
    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },

    // ---- 13. Rubric block ----
    { type: 'rubric', id: id(),
      title: 'Project Rubric',
      totalPoints: 100,
      intro: 'Each of the five criteria is scored 1–4 and weighted to total 100. Specificity, evidence, and self-honesty matter more than polish.',
      criteria: [
        {
          name: 'Workflow Definition',
          weight: 15,
          levels: [
            { score: 4, label: 'Exemplary', description: 'Original workflow is broken into 5+ specific steps. Granular enough that a stranger could replicate the task. Inputs, decisions, and outputs are explicit.' },
            { score: 3, label: 'Proficient', description: 'Steps are mostly clear but a few are vague or skipped over; a stranger could mostly follow but would need to fill in some gaps.' },
            { score: 2, label: 'Developing', description: 'Workflow is described in 2–3 broad steps. Lots of "and then I just figure it out."' },
            { score: 1, label: 'Beginning', description: 'Workflow is a single paragraph with no real step structure.' },
          ]
        },
        {
          name: 'Quality of Automation Attempt',
          weight: 25,
          levels: [
            { score: 4, label: 'Exemplary', description: 'Includes the actual prompts used (pasted in), actual AI outputs (pasted or screenshotted), and at least 2 iterations with a clear improvement attempt between them.' },
            { score: 3, label: 'Proficient', description: 'Shows prompts and outputs but only one attempt — or iterations are mentioned without evidence of what changed and why.' },
            { score: 2, label: 'Developing', description: 'Vague description of what the student "asked the AI." No prompts or outputs included.' },
            { score: 1, label: 'Beginning', description: 'No evidence of an actual attempt. Reads like a hypothetical written without ever opening a tool.' },
          ]
        },
        {
          name: 'Failure Point Analysis',
          weight: 25,
          levels: [
            { score: 4, label: 'Exemplary', description: 'Identifies at least 2 specific failure points. For each one, explains both WHAT failed and WHY (judgment, real-world knowledge, taste, current info, etc.). Distinguishes "AI got it wrong this time" from "this is structurally hard for AI."' },
            { score: 3, label: 'Proficient', description: 'Identifies failures with WHAT but the WHY is shallow and doesn\'t reach the structural reason.' },
            { score: 2, label: 'Developing', description: 'Mentions one failure. Treats it as "AI just isn\'t smart enough yet" without further analysis.' },
            { score: 1, label: 'Beginning', description: 'No failures identified, or claims everything worked perfectly.' },
          ]
        },
        {
          name: 'Verdict & Evidence',
          weight: 20,
          levels: [
            { score: 4, label: 'Exemplary', description: 'Verdict is clear (fully / partially / not replaceable). Defended with 3+ specific pieces of evidence from the attempt. Acknowledges what could change to flip the verdict.' },
            { score: 3, label: 'Proficient', description: 'Verdict is clear but defended with general claims rather than specific pieces of evidence from the attempt.' },
            { score: 2, label: 'Developing', description: 'Verdict contradicts the evidence shown, or is hedged into uselessness.' },
            { score: 1, label: 'Beginning', description: 'No real verdict.' },
          ]
        },
        {
          name: 'Honesty & Self-Awareness',
          weight: 15,
          levels: [
            { score: 4, label: 'Exemplary', description: 'Acknowledges where AI did better than expected, not just where it failed. Doesn\'t inflate the human role to feel better. Confronts uncomfortable findings directly.' },
            { score: 3, label: 'Proficient', description: 'Mostly honest but slightly biased toward "humans win"; downplays a couple of AI strengths.' },
            { score: 2, label: 'Developing', description: 'Frames the result to make the student look good. Downplays AI strengths.' },
            { score: 1, label: 'Beginning', description: 'Reads as defensive or as AI-hype, not as honest investigation.' },
          ]
        },
      ]
    },

    // ---- 14. Strong vs Weak Exemplar ----
    { type: 'section_header', id: 'sh-exemplars', label: 'Strong vs. Weak Response' },

    { type: 'exemplar_compare', id: id(),
      prompt: 'Both responses are writing the **Verdict** section. The student\'s task: writing a personalized weekly progress message to each kid she babysits for, sent to the parents on Sunday nights. Compare how each one handles the same prompt.',
      strong: {
        label: 'Strong Response',
        body: `**The Verdict: Partially Replaceable**\n\nAI can do about 60% of this task and that surprised me, because I thought messages to parents were exactly the kind of thing AI couldn't fake. With Claude, if I gave it a bullet list of what each kid did that week, it produced a Sunday-night message that was actually warmer and better-organized than the ones I usually type out exhausted on my phone. That part is replaceable, and I should probably keep using it.\n\nWhere it broke was the input. The AI cannot watch a 6-year-old and decide which moments matter to that specific parent. Mrs. Reyes wants to hear about reading and math. The Patels care about whether their daughter played with the other kids. The Williams want to know if their son listened the first time he was asked something. I am the only person who knows what each parent actually cares about, and I only know that because I've been watching their kids for a year. The AI has no access to that — and even if I tried to write it all into a system prompt, the prompt would be longer than the message and I'd still be the one collecting the observations.\n\nSo: the WRITING is replaceable. The OBSERVING and the JUDGING-WHAT-MATTERS-TO-THIS-PARENT are not — at least not by any AI I have access to today. For this to become fully replaceable, an AI would need to physically observe the kids alongside me, learn each parent's preferences over time, and decide which 3 of the 50 things that happened this week to mention. That's a much bigger ask than "write me a nice message."`,
        annotations: [
          'Verdict is unambiguous and tied to specific evidence (the input vs. output split)',
          'Acknowledges where AI was BETTER than the student, instead of inflating the human role',
          'Distinguishes a contingent failure ("I haven\'t fed it enough context") from a structural one ("the AI cannot watch the kids")',
          'Closes with a precise condition for the verdict to change — that is real analysis, not hand-waving',
        ]
      },
      weak: {
        label: 'Weak Response',
        body: `**The Verdict: Not Replaceable**\n\nAI cannot replace me at this job. Babysitting is about human connection and AI doesn't have feelings or empathy. Parents want to hear from a real person who knows their kid, not a robot. Even though AI is getting better every year, there are some things only humans can do, like care about kids and understand them. Maybe one day AI will be smarter but for now, this job is safe from automation.`,
        annotations: [
          'The verdict is a feeling ("AI doesn\'t have feelings"), not a finding from the actual attempt',
          'Zero specific evidence from the student\'s own week — could have been written without ever opening an AI tool',
          'Repeats internet talking points ("AI is getting better every year," "human connection") instead of observations from this experiment',
          'Misses the interesting truth: parts of the workflow ARE replaceable, and pretending they aren\'t is exactly the kind of comfortable wrong answer this project exists to challenge',
        ]
      }
    },

    // ---- 15. Submit ----
    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },

    // ---- 16. Submission ----
    { type: 'slide_submit', id: 'submit-final',
      prompt: 'Paste the share link to your Google Doc containing all four sections (Original Workflow, Automation Attempt, Failure Points, Verdict). Make sure sharing is set so anyone with the link can view.',
      maxScore: 100 },

    // ---- 17. Reflection ----
    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },

    // ---- 18. Reflection questions ----
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Where did the AI do BETTER than you expected? Be specific. Did that change how you think about your own work on this task?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Of the failure points you identified, which one feels structural — meaning, no amount of "smarter AI" would fix it without something else changing about the world? Explain.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Apply what you learned to a real career you are considering. What parts of that career do you now believe are most exposed to AI replacement, and what parts feel safest? Use the same kind of reasoning you used in your verdict.' },
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
