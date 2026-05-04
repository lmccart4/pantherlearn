/**
 * AI Literacy Course Project: Prompt Engineering Portfolio
 * Lesson ID: ai-project-prompt-portfolio
 * Order: 73 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-prompt-portfolio.jpg';

const lesson = {
  id: 'ai-project-prompt-portfolio',
  title: 'Prompt Engineering Portfolio: Five Hard Tasks, Three Iterations Each',
  unit: 'Course Projects',
  order: 73,
  visible: false,
  blocks: [
    // 1
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    // 2
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Demonstrate that prompt quality directly determines output quality, with side-by-side evidence',
      'Iterate prompts deliberately: bad → better → best, with each step adding specific elements',
      'Annotate WHY a prompt change improved the output (role, context, constraints, format, examples, audience)',
      'Build a portfolio you could actually show to a future employer or college admissions reviewer',
    ]},
    // 3
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Think about a time an AI gave you a useless answer. What did you ask? Looking back, what was missing from your prompt?' },

    // Hero image
    { type: 'image', id: id(), url: HERO_URL, alt: 'A portfolio of side-by-side prompts and outputs showing iteration from bad to best' },

    // 4
    { type: 'section_header', id: 'sh-project', label: 'The Project' },
    // 5
    { type: 'text', id: id(), content: `You are going to build a prompt engineering portfolio with receipts.\n\nFive real-world tasks. Three prompt iterations per task: a bad prompt, a better prompt, a best prompt. Each iteration shows the actual output the AI gave you, side-by-side with the others. And each iteration is annotated — you explain exactly what you changed and why it improved the result.\n\nThis is the project version of the Prompt Engineering Deep Dive. There you saw the principles. Here you prove you can apply them, on tasks that matter, with evidence anyone can check.\n\nWhen this is done, you will have a document you could send to a future employer, a college admissions reader, or a younger student learning prompting. That is the bar.` },
    // 6
    { type: 'callout', id: id(), content: '**Project Goal:** Show — with receipts — that prompt quality determines output quality. 5 tasks × 3 iterations = 15 prompts and 15 outputs, all annotated.' },

    // 7
    { type: 'section_header', id: 'sh-deliverables', label: "What You'll Make" },
    // 8 — checklist replaces the deliverables text
    { type: 'checklist', id: id(), title: 'Deliverables (one Google Doc, five sections)', items: [
      'Task statement (1–2 sentences) for each of the 5 tasks: what you want the AI to do, and the real-world reason',
      'Iteration 1 — Bad Prompt: actual prompt + actual output (full text or screenshot)',
      'Iteration 2 — Better Prompt: actual prompt + actual output',
      'Iteration 3 — Best Prompt: actual prompt + actual output',
      'Annotations (3–4 bullets per iteration) naming the levers you used: role, audience, constraints, format, examples, anchor, anti-template',
      'Per-task reflection (50–80 words): what was the single biggest unlock from bad to best?',
      'One task each from all 5 categories: Writing, Analysis, Creative, Problem-solving, Teaching/Explanation',
      'Hard rule: outputs must be the actual outputs the AI gave you. Do not fake them.',
      'Hard rule: Iteration 1 must be genuinely lazy. Iteration 3 must use multiple named prompt-engineering levers.',
    ]},

    // 9
    { type: 'section_header', id: 'sh-categories', label: 'The Five Task Types' },
    // 10 — case_cards for the 5 task categories
    { type: 'case_cards', id: id(), title: 'The Five Task Types', cards: [
      { id: 'card-writing', label: '1', title: 'Writing Task',
        body: '**Real examples:** a cover letter for an actual job posting, a college essay draft, a tough text message you have been avoiding, a complaint letter, a thank-you email to a teacher.\n\n**What makes this category hard:** the AI defaults to corporate, hedging, "passionate-about-education" voice. Your job is to break that default by giving it a real candidate, a real audience, and a real anti-template.' },
      { id: 'card-analysis', label: '2', title: 'Analysis Task',
        body: '**Real examples:** compare two products you are deciding between, evaluate the argument in an article, summarize a long reading you actually had to do, analyze the lyrics of a song you love, weigh pros/cons of a real decision.\n\n**What makes this category hard:** without structure, the AI gives you mush. Best prompts force a specific output format (table, weighted criteria, ranked list).' },
      { id: 'card-creative', label: '3', title: 'Creative Task',
        body: '**Real examples:** write the opening of a short story you have been meaning to start, design a board game premise, write a rap verse with constraints, brainstorm a podcast concept, design a fictional product.\n\n**What makes this category hard:** "be creative" generates the most generic output of all. Best prompts use **anchors** (a specific tone, a specific setting, a forbidden cliché list) to force the AI off its defaults.' },
      { id: 'card-problem', label: '4', title: 'Problem-Solving Task',
        body: '**Real examples:** plan a 3-day trip on a $300 budget, debug a piece of code that is not working, plan a study schedule for a hard week, troubleshoot a real problem (printer not connecting, laptop slow), build a workout plan with constraints.\n\n**What makes this category hard:** the AI guesses without a complete picture. Best prompts give it the constraints, the context, and the format you want the answer in.' },
      { id: 'card-teaching', label: '5', title: 'Teaching / Explanation Task',
        body: '**Real examples:** explain something complex to a younger sibling, explain a concept three different ways (analogy, worked example, common mistake), generate a worked example for a topic you struggle with, build a 5-minute lesson on a single skill.\n\n**What makes this category hard:** "explain X" gets you Wikipedia. Best prompts pin down the audience (age, what they already know), the format (analogy + example + check-question), and the depth.' },
    ]},

    // Lever definitions
    { type: 'section_header', id: 'sh-levers', label: 'The Levers (use these by name in your annotations)' },
    { type: 'definition', id: id(), term: 'Role Assignment',
      definition: 'Telling the AI **who it is** before telling it what to do. "You are a 9th-grade English teacher helping a student revise their first college essay" pulls the model into a coaching stance. "Write me an essay" pulls it into generation mode. Role changes voice, depth, and what the model assumes about the audience.' },
    { type: 'definition', id: id(), term: 'Audience Specification',
      definition: 'Naming **who the output is for**, in concrete demographic terms. "Explain quantum entanglement" gets a Wikipedia answer. "Explain quantum entanglement to my 10-year-old cousin who loves Minecraft" gets you Minecraft analogies. Audience is the single highest-leverage lever in the teaching/explanation category.' },
    { type: 'definition', id: id(), term: 'Constraints',
      definition: 'The hard limits you put on the output: word count, paragraph count, reading level, time budget, dollar budget, tone. Constraints are how you stop the AI from giving you a 1,500-word answer to a 200-word problem. Specific constraint > vague constraint: "200–250 words, three short paragraphs" beats "make it short."' },
    { type: 'definition', id: id(), term: 'Format Specification',
      definition: 'The **shape** of the output: bullet list, table with columns X/Y/Z, JSON, numbered steps, two-column comparison. Format is what turns "a paragraph of mush" into "a thing I can actually use." For analysis tasks especially, naming the format is what unlocks the answer you wanted.' },
    { type: 'definition', id: id(), term: 'Anchor Examples',
      definition: 'Giving the AI **one or more concrete examples** of what good looks like — a real moment from your life, a sample of the writing voice you want, an example output to mimic. Anchors lock the AI to a specific texture instead of pulling from the average of its training data. The Diego/kitchen-table moment in the strong exemplar below is an anchor.' },
    { type: 'definition', id: id(), term: 'Anti-Template Instruction',
      definition: 'Naming the clichés you do **NOT** want. "Not passionate about education. Not team-oriented professional. Not dear hiring manager." This is one of the highest-leverage moves in writing tasks because the AI defaults are very strong — sometimes the only way to break them is to name them and forbid them.' },

    // 11
    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    // 12
    { type: 'text', id: id(), content: `**Day 1 — Pick your 5 tasks**\n- Choose 5 tasks (one per category) that are actually useful to you. Real cover letter > fake cover letter.\n- Write the task statements. Get them approved before you start prompting.\n\n**Day 2 — Tasks 1 & 2**\n- For each task: write the bad prompt first, run it, paste output. Then better, then best.\n- Annotate as you go — don't save it for the end.\n\n**Day 3 — Tasks 3 & 4**\n- Same process. Push yourself: the "better" prompt should be a clear step up, not just slightly longer.\n\n**Day 4 — Task 5 + cross-task patterns**\n- Finish task 5.\n- Now look across all 5 tasks. What pattern shows up in your "best" prompts? Audience-specification? Examples? Format constraints? Note it — this goes in your final reflection.\n\n**Day 5 — Polish + submit**\n- Reread every iteration. Are the bad prompts actually bad? Are the best prompts actually best?\n- Check annotations name a specific lever (role, context, constraints, format, examples, audience).\n- Submit.` },

    // 13
    { type: 'section_header', id: 'sh-rubric', label: 'Project Rubric' },
    // 14 — structured rubric
    { type: 'rubric', id: id(), title: 'Project Rubric', totalPoints: 100, criteria: [
      { name: 'Task Selection', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'All 5 tasks are real, specific, and represent genuinely different challenges. Each one matters to a real person or audience the student named.' },
        { score: 3, label: 'Proficient', description: '4 of 5 tasks are real and specific.' },
        { score: 2, label: 'Developing', description: '2–3 tasks are real; the others are generic ("write a story").' },
        { score: 1, label: 'Beginning', description: 'Tasks are vague or recycled across categories.' },
      ]},
      { name: 'Iteration Arc', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Every task shows a clear arc — bad is genuinely bad, best is genuinely strong, the middle iteration is a clear step up. Outputs visibly improve.' },
        { score: 3, label: 'Proficient', description: 'Arc is clear in 4 of 5 tasks.' },
        { score: 2, label: 'Developing', description: '2–3 tasks show clear improvement; others have prompts that are similar in quality.' },
        { score: 1, label: 'Beginning', description: 'Iterations are minor wording tweaks, not real changes in approach.' },
      ]},
      { name: 'Annotations', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Every iteration is annotated with 3+ specific levers (role, context, audience, constraints, format, examples, tone, anti-template). The "why it helped" is grounded in the output, not generic.' },
        { score: 3, label: 'Proficient', description: 'Most annotations name specific levers by name.' },
        { score: 2, label: 'Developing', description: 'Annotations are present but mostly say "I added more detail" or "I made it longer."' },
        { score: 1, label: 'Beginning', description: 'Annotations are missing or vague throughout.' },
      ]},
      { name: 'Output Evidence', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'All 15 outputs are present in full (or full screenshots), readable, clearly labeled with the iteration they belong to.' },
        { score: 3, label: 'Proficient', description: '13–14 outputs are complete; 1–2 are summaries.' },
        { score: 2, label: 'Developing', description: 'Outputs are excerpted or summarized for several tasks.' },
        { score: 1, label: 'Beginning', description: 'Outputs are missing or mostly described instead of shown.' },
      ]},
      { name: 'Reflection & Communication', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Reflection identifies a real cross-task pattern in your best prompts. Document is well-organized, easy to read side-by-side, no walls of text.' },
        { score: 3, label: 'Proficient', description: 'Reflection names a pattern but does not connect it across tasks; document is organized.' },
        { score: 2, label: 'Developing', description: 'Reflection is general; document is hard to scan.' },
        { score: 1, label: 'Beginning', description: 'No real reflection; document is disorganized.' },
      ]},
    ]},

    // 15 — exemplar_compare replaces the strong + weak text blocks
    { type: 'section_header', id: 'sh-exemplars', label: 'Exemplars: Strong vs. Weak (Same Task)' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'Both responses are completing the same Writing task: get the AI to draft a cover letter for the part-time tutoring job at the public library — a real $14/hr posting for after-school homework helpers, eligible to 9th-graders.',
      strong: {
        label: 'Strong Response',
        body: `**Iteration 1 — Bad Prompt**\n\n> Write me a cover letter for a tutoring job.\n\n*Output (excerpted):* "Dear Hiring Manager, I am writing to express my interest in the tutoring position at your organization. I am a hardworking and dedicated individual with a passion for helping others learn. I believe I would be a great fit for your team..."\n\n*Why this output is bad:* It's generic. It could be for any tutoring job at any place by any candidate. No specifics. No voice. The hiring manager has read this letter 200 times.\n\n---\n\n**Iteration 2 — Better Prompt**\n\n> Write me a cover letter for an after-school homework helper job at the public library. I'm a 9th-grader. I'm good at math and I tutored my younger cousin last summer. Make it sound like a real high schooler wrote it, not corporate.\n\n*Output (excerpted):* "Hi, my name is Maya and I'm applying for the after-school homework helper position. I'm a 9th-grader at Perth Amboy High School. Math is my strongest subject and last summer I tutored my younger cousin in pre-algebra twice a week — by August he went from getting 60s on his quizzes to getting 90s..."\n\n*Why this is better:* Has a specific role (homework helper at the library), a specific candidate (9th grader, math, cousin tutoring), and a tone constraint (real high schooler, not corporate). The output now has specifics.\n\n---\n\n**Iteration 3 — Best Prompt**\n\n> You are helping a 9th-grader at Perth Amboy High School (Maya, 14) write a cover letter for a real job: after-school homework helper at the Perth Amboy public library, $14/hr, working with K–6 students.\n>\n> Constraints:\n> - 200–250 words, three short paragraphs\n> - Tone: warm, confident, real high-schooler voice. Not "passionate about education." Not "team-oriented professional."\n> - Paragraph 1: open with a 1-sentence specific moment of teaching someone (Maya tutored her 7-year-old cousin Diego in pre-algebra last summer; he went from 60s to 90s)\n> - Paragraph 2: why she wants THIS job specifically (loves the library, has been going since she was 6, knows what it's like to need help with homework after school because both parents work)\n> - Paragraph 3: brief close — availability (Mon–Thu after 3 pm), how to reach her\n> - End with "Thanks for considering me, Maya"\n\n*Output (excerpted):* "Last summer I sat at our kitchen table with my 7-year-old cousin Diego three afternoons a week, and by August his math quiz scores went from the 60s to the 90s — the moment he understood why borrowing in subtraction worked, his whole face changed.\n\n"That's why I'm applying to be an after-school homework helper at the Perth Amboy public library. I have been coming to this library since I was 6, and I know what it feels like to need a quiet place and someone patient when both of your parents are still at work and your homework is due tomorrow..."\n\n**Reflection (50–80 words):** The biggest unlock between bad and best wasn't length — bad and best are similar lengths. It was specificity at the input. When I gave the AI one real moment (Diego, the kitchen table, 60s to 90s), the output stopped pulling from the cover-letter template in its training data and started building from my actual life. Naming the clichés I didn't want did almost as much work as naming what I did want.`,
        annotations: [
          'Role assigned to the AI: "You are helping..." instead of "Write me..." — pulls the AI into a coaching stance instead of a generation stance',
          'Audience and stakes named: real candidate, real library, real wage. The output gets specific because the prompt is specific.',
          'Format constraint: word count + paragraph count + content per paragraph. This kills the corporate-cover-letter default tone.',
          'Concrete anchor for paragraph 1: giving the AI the Diego story locks the opening in a real moment instead of a generic claim.',
          'Anti-template tone instruction: "Not passionate about education. Not team-oriented professional." Naming the clichés you DON\'T want is one of the highest-leverage prompt moves.',
        ],
      },
      weak: {
        label: 'Weak Response',
        body: `**Iteration 1 — Bad Prompt**\n\n> Write a cover letter for a tutoring job.\n\n*Output:* (generic cover letter)\n\n---\n\n**Iteration 2 — Better Prompt**\n\n> Write a cover letter for a tutoring job. Make it good.\n\n*Output:* (slightly more polished generic cover letter)\n\n---\n\n**Iteration 3 — Best Prompt**\n\n> Please write a really good and detailed cover letter for a tutoring job. Make it professional. Use formal language. Make it long.\n\n*Output:* (longer generic cover letter, now with extra adjectives)\n\n**Annotations the student wrote:**\n- I added more words to the prompt\n- I asked for it to be good\n- I made it longer\n- It came out better`,
        annotations: [
          '"Make it good" is not a lever. The AI does not know what good means without a referent.',
          'All three iterations are just adjective-stacking on the same vague prompt — there is no real change in approach',
          'No real candidate, no real audience, no real constraints — the output cannot get specific because the input was not',
          'Annotations do not name a single prompt-engineering principle. "I made it longer" is not a lever; it is a measurement.',
          'The "best" output is indistinguishable from the kind of cover letter ChatGPT writes for anyone, which means no real engineering happened',
        ],
      },
    },

    // 17
    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },
    // 18
    { type: 'slide_submit', id: 'submit-final', prompt: '**Paste your Google Doc link here.** Make sure it is set to "Anyone with the link can view." Submit when all 5 tasks × 3 iterations + annotations + reflections are complete.', maxScore: 100 },

    // 19
    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },
    // 20
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Look across all 5 of your "best" prompts. What pattern in your bad-to-better-to-best arcs surprised you? Was it audience? Role? Constraints? Examples? Be specific — point to which task showed it most clearly.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Which of your 5 tasks was hardest to improve through prompting alone — and why? Was the bottleneck the AI, the task, or your understanding of what "good" looked like?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You are about to teach a younger student one prompt-engineering move from this project. Just one. Which one do you teach them, and why is that the highest-leverage move for someone starting out?' },
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
