/**
 * AI Literacy Course Project: Centaur Showdown
 * Lesson ID: ai-project-centaur-showdown
 * Order: 76 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-centaur-showdown.jpg';

const lesson = {
  id: 'ai-project-centaur-showdown',
  title: 'Centaur Showdown: You vs. AI vs. You + AI',
  unit: 'Course Projects',
  order: 76,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Complete the same task three ways: alone, AI-only, and human + AI together (Centaur)',
      'Identify what each approach actually adds and what each one loses',
      'Defend a specific claim about when collaboration with AI is worth the friction — and when it isn\'t',
      'Connect your findings to the Centaurs vs. Cyborgs framework from the Futures unit',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Think back to the Centaurs and Cyborgs lesson. A Centaur splits work between human and AI on separate sub-tasks; a Cyborg blends human and AI moves on the same sub-task. Predict: for the kind of task you usually do for school, do you think working with AI would help, hurt, or just feel different? Why?' },

    { type: 'image', id: id(), url: HERO_URL, alt: 'Centaur Showdown: three workstations side-by-side — solo human, AI-only screen, and a human-and-AI collaboration setup' },

    { type: 'section_header', id: 'sh-project', label: 'The Project' },
    { type: 'text', id: id(), content: `Most arguments about AI happen in the abstract. "AI is going to replace writers." "AI can\'t actually think." "AI makes everyone lazy." None of those statements mean anything until you actually run the experiment yourself.\n\nThis project is the experiment.\n\nYou will pick ONE specific task. You will do it three different ways: alone (no AI, no internet help, just you), AI-only (you describe the task, AI does the whole thing, you don\'t edit), and Centaur (you and AI iterate together — you direct, AI executes, you edit, AI refines). Then you compare the three outputs side by side and write the verdict.\n\nThe goal isn\'t to "prove" any particular conclusion. The goal is to see, with your own eyes, exactly what each mode adds and exactly what each one loses. By the end, you\'ll have a much sharper take on when AI is genuinely useful, when it\'s a trap, and when human + AI together actually beats either alone.` },
    { type: 'callout', id: id(), style: 'info', content: '**Pick one task. Do it three ways. Compare honestly. Decide which mode actually wins — and prove it.**' },

    { type: 'section_header', id: 'sh-modes', label: 'The Three Modes' },
    { type: 'case_cards', id: id(),
      title: 'The Three Modes',
      cards: [
        { id: 'card-solo', label: 'A', title: 'Solo (Human Only)', body: '**Rules:** No AI. No Google. No Wikipedia. No friend help. Just you, the task, and a 25-minute timer.\n\n**What it tests:** what raw human output looks like with zero assistance. The voice, the weird unexpected detail, the ideas only you would have had.\n\n**Save:** the output exactly as you produced it. Don\'t polish it later.' },
        { id: 'card-ai', label: 'B', title: 'AI Only — No Editing', body: '**Rules:** Write a single prompt describing the task. Submit. Take the first complete response. Don\'t re-prompt. Don\'t edit. Don\'t even fix typos.\n\n**What it tests:** what un-piloted, unsupervised AI actually produces — the baseline before any human direction.\n\n**Save:** the output exactly as the AI produced it.' },
        { id: 'card-centaur', label: 'C', title: 'Centaur (You + AI)', body: '**Rules:** Iterate together for 25 minutes. Prompt → react → re-prompt → edit → refine. You\'re the director, AI is the collaborator.\n\n**What it tests:** what human + AI actually produces when the human stays in the loop and applies taste.\n\n**Save:** the final output AND the iteration log — every prompt you wrote and your reaction to what came back.' },
      ]
    },

    { type: 'section_header', id: 'sh-deliverables', label: 'Deliverables' },
    { type: 'checklist', id: id(), title: 'Deliverables', items: [
      'A task brief — one paragraph that locks in what you\'re making, the constraints, and the imaginary audience (approved by Mr. McCarthy on Day 1)',
      '5 scoring criteria chosen BEFORE doing any of the modes — each criterion specific and observable (e.g., "uses sensory details from at least 3 senses" not "is good")',
      'All three outputs in full, clearly labeled A (Solo), B (AI-Only), C (Centaur), saved exactly as produced',
      'A scoring grid scoring each output 1–10 on each of your 5 criteria, with totals visible',
      'A 200–300 word "Verdict" essay — which mode actually won, what each mode added or lost, what surprised you, and a callback to the Centaurs vs. Cyborgs framework',
      'The Centaur iteration log — every prompt you wrote in Mode C plus your reaction to each response',
      'One submission link to a Google Doc or Slides containing all of the above, sharing set to "Anyone with the link can view"',
    ]},
    { type: 'callout', id: id(), style: 'tip', content: 'Pick a task narrow enough that "doing it" has a clear definition. Examples: opening 300–400 words of a horror story, a logo concept brief, a 4-day road-trip itinerary on a $600 budget, a persuasive email to a principal, a 30-second TikTok script with a shot list, debugging a piece of broken code, or solving a hard SAT word problem with a clean explanation.' },

    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    { type: 'text', id: id(), content: `**Day 1 — Pick the task & lock the constraints (in class)**\n- Pick your task. Write a one-paragraph task brief: what success looks like, what the constraints are, who the imaginary audience is.\n- Get it approved. Tasks that are too vague ("write something cool") get sent back. Tasks that are too easy ("write a haiku") also get sent back.\n- Pick your 5 scoring criteria in advance, before you do any of the three modes. (Picking criteria after you\'ve seen the outputs makes the experiment biased.)\n\n**Day 2 — Mode A: Solo Human (in class)**\n- 25 minutes, head down, no devices except whatever you need for the task itself. No AI. No Google.\n- Save your output. Don\'t touch it again.\n\n**Day 3 — Mode B: AI-Only (in class)**\n- Write a single prompt. Submit it. Take the first complete response.\n- No re-prompting. No editing. The whole point is to see what raw, un-piloted AI produces.\n- Save the output. Don\'t touch it again.\n\n**Day 4 — Mode C: Centaur (homework)**\n- 25 minutes of real iteration. Prompt, react, re-prompt, edit, refine. Treat AI like a colleague you\'re directing.\n- Save the final output AND the iteration log.\n- Score all three outputs against your 5 criteria. Total them.\n- Write your Verdict.\n\n**Day 5 — Comparison & Defense (in class)**\n- Pair up. Read each other\'s three outputs without looking at the labels. Independently rank them best-to-worst.\n- Compare your ranking to your partner\'s. Compare both to your scoring grid.\n- 3–4 students share their verdicts with the class. Class debates: did the data agree with the verdict?\n- Submit your final comparison doc.` },

    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },
    { type: 'rubric', id: id(),
      title: 'Project Rubric',
      totalPoints: 100,
      criteria: [
        { name: 'All three modes completed honestly', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'All three outputs are present, clearly labeled, and clearly different. Mode A shows real solo work (not polished, not AI-touched). Mode B is unedited AI. Mode C shows clear iteration in the log.' },
          { score: 3, label: 'Proficient', description: 'All three present but one mode shows minor cross-contamination (Solo output looks suspiciously polished, or AI-Only output appears edited).' },
          { score: 2, label: 'Developing', description: 'One mode is missing or so similar to another that they\'re indistinguishable.' },
          { score: 1, label: 'Beginning', description: 'Two or more modes missing, or the experiment was clearly faked after the fact.' },
        ]},
        { name: 'Scoring grid is rigorous and pre-committed', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: '5 criteria chosen BEFORE doing the task, each criterion specific and observable (e.g., "uses sensory details from at least 3 senses" not "is good"), and all three outputs scored 1–10 on each. Totals visible.' },
          { score: 3, label: 'Proficient', description: '5 criteria, but 1–2 are vague ("creativity," "quality").' },
          { score: 2, label: 'Developing', description: 'Fewer than 5 criteria, or criteria appear to have been chosen after seeing the outputs.' },
          { score: 1, label: 'Beginning', description: 'No scoring grid, or only the winner is scored.' },
        ]},
        { name: 'Centaur iteration log shows real direction', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Log contains 5+ specific prompts plus reactions ("v1 was too generic — added a constraint that the protagonist must already be wounded"). Shows the student steering, not just hitting regenerate.' },
          { score: 3, label: 'Proficient', description: 'Log contains 3–4 prompts with surface reactions ("better," "worse").' },
          { score: 2, label: 'Developing', description: 'Fewer than 3 prompts, or prompts are paraphrased rather than copy-pasted.' },
          { score: 1, label: 'Beginning', description: 'No iteration log, or log shows zero direction (just "make it better, make it longer").' },
        ]},
        { name: 'Verdict is specific and surprising', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Picks a clear winner, names the SPECIFIC thing that mode added (e.g., "the Solo opening had a weird unexpected detail no AI ever generated, and that detail carried the whole piece"), names the SPECIFIC thing the losing modes lost, and includes at least one moment that genuinely surprised the student. Connects to Centaurs/Cyborgs framework.' },
          { score: 3, label: 'Proficient', description: 'Picks a winner with reasoning, but observations are general rather than specific to the three actual outputs.' },
          { score: 2, label: 'Developing', description: 'Picks a winner but reasoning could apply to any task ("AI was faster," "human had more emotion").' },
          { score: 1, label: 'Beginning', description: 'No clear winner picked, or verdict reads like the student didn\'t actually look at their own outputs.' },
        ]},
        { name: 'Honest about limits', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Names something the winning mode also LOST. Names something an unexpected mode unexpectedly NAILED. Acknowledges the conclusion might be different on a different task and explains why.' },
          { score: 3, label: 'Proficient', description: 'Acknowledges some limits but doesn\'t engage with what the losing modes did right.' },
          { score: 2, label: 'Developing', description: 'Verdict is one-sided ("AI is just better" / "humans are just better").' },
          { score: 1, label: 'Beginning', description: 'No engagement with limits or trade-offs at all.' },
        ]},
      ]
    },

    { type: 'section_header', id: 'sh-exemplars', label: 'Exemplars' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'Write the opening 300 words of a horror short story. Audience: high schoolers. Constraint: no jump scares — the dread has to be psychological. Setting: an abandoned hospital. Run the task three ways (Solo / AI-Only / Centaur), score the outputs against 5 pre-committed criteria, and write the verdict.',
      strong: {
        label: 'Strong Response — "The Hand Soap"',
        body: `**Mode A — Solo Human (excerpt):**\n*"The third floor still had power, which was the part Maya didn\'t like. The elevator dinged when she got on, like it was expecting her. A laminated nurse\'s schedule from 2009 was still taped to the wall. She read every name on it. She didn\'t know why."*\n\n**Mode B — AI-Only (single prompt: "Write the opening 300 words of a psychological horror story set in an abandoned hospital, audience high schoolers"):**\n*"Sarah pushed open the heavy doors of St. Margaret\'s Hospital, her flashlight cutting through the thick darkness. The air was stale and cold, carrying with it a sense of dread that seemed to seep into her very bones. She had heard stories about this place — about the patients who had disappeared, about the nurses who had gone mad…"*\n\n**Mode C — Centaur final (after 6 iteration rounds):**\n*"The elevator dinged when Maya stepped on, even though she hadn\'t pressed anything yet. Floor three lit up by itself. The doors closed slow. Halfway up she noticed the smell — not rot, not mildew. Hand soap. The kind hospitals use. Fresh."*\n\n**Iteration log (excerpts):**\n- *Prompt 1:* "Open with Maya stepping into the elevator. Make it dread-by-detail not dread-by-adjective. No words like \'eerie\' or \'sinister.\'" — *AI obeyed but added a creepy whisper. Cut the whisper, that\'s a jump scare.*\n- *Prompt 3:* "Replace the whisper with one specific thing that doesn\'t belong but isn\'t scary on its own. Something domestic." — *Got "a child\'s drawing on the wall." Better but cliché.*\n- *Prompt 5:* "Domestic + medical, but not patient-related. Something a working nurse would have left." — *Got "a half-eaten yogurt cup on the nurse\'s station." Almost — wrong sense.*\n- *Prompt 6:* "Same idea but smell instead of sight. The thing is fresh, not old. That\'s the horror." — *Got the hand soap. That\'s the line. Locked it.*\n\n**Scoring grid (1–10 each, 5 criteria):**\n\n| Criterion | A: Solo | B: AI | C: Centaur |\n|---|---|---|---|\n| Opens with a hook in sentence 1 | 7 | 4 | 9 |\n| Uses specific concrete detail (not adjectives) | 8 | 2 | 9 |\n| Dread is psychological, not jump-scare | 8 | 5 | 9 |\n| Voice feels like a real person wrote it | 9 | 3 | 7 |\n| I want to read the next page | 7 | 4 | 9 |\n| **Total** | **39** | **18** | **43** |\n\n**Verdict (excerpt):** "Centaur won by 4 points, but the gap to AI-only was 25 points — the hand-piloted version was night and day better than what the AI produced unattended. The most surprising finding was that Solo beat Centaur on **voice** — my own writing felt more like a real person than the polished iterated version, which started to feel slightly varnished by round 6. So Centaur won the technical contest but at a small cost to voice. This lines up with the Centaur framework: AI was great at executing on a specific instruction once I figured out the right instruction. AI was useless at having taste. The whole job in Mode C was being the taste."`,
        annotations: [
          'Three actual outputs are visible and clearly different from each other — none are recycled or sandbagged',
          'Scoring criteria are specific and observable ("uses concrete detail" vs. "is good"), and the grid totals make the winner provable',
          'The iteration log shows real direction — you can see the student steering toward a specific aesthetic, not just hitting regenerate',
          'The verdict picks a winner AND admits the winner lost something (voice). That\'s what honest analysis looks like.',
          'Direct callback to the Centaurs/Cyborgs lesson — frames the human as the one with taste, AI as the one with execution speed',
        ]
      },
      weak: {
        label: 'Weak Response — "AI is just better"',
        body: `**Mode A — Solo:** *"It was a dark and stormy night. Sarah went to the abandoned hospital. She was scared. She heard a noise. She turned around. Nothing was there. She kept walking. She heard another noise. She started running. The end of the chapter."* (78 words.)\n\n**Mode B — AI-Only:** *(Pasted in a 300-word AI response about Sarah at St. Margaret\'s Hospital, basically identical to the AI-only example in the strong exemplar.)*\n\n**Mode C — Centaur:** *(The exact same 300-word AI response, but with two sentences moved around and one word changed from "eerie" to "creepy.")*\n\n**Iteration log:** *"I asked the AI to write the story. It was good. I made it a little better."*\n\n**Scoring grid:** Mode A: 5/10. Mode B: 8/10. Mode C: 9/10. (No criteria specified.)\n\n**Verdict:** *"Centaur won because human plus AI is always best. AI is faster than humans and helps you write better. Humans alone can\'t write as well as AI."*`,
        annotations: [
          'Mode A is a fragment, not a real attempt — sandbagging the solo run kills the whole experiment because you can\'t compare three modes when one was thrown',
          'Mode C is just Mode B with two sentences moved — no real iteration, no real direction, no real Centaur work. The student let AI do everything and called it collaboration.',
          'The scoring grid has no criteria, so the scores are made up. You can\'t prove a winner without showing what you measured.',
          'The Verdict is generic — "AI is better than humans" is something a student could write without doing the assignment at all. No surprise, no trade-off, no Centaurs/Cyborgs callback.',
        ]
      }
    },

    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Paste the link to your final comparison doc (Google Doc or Slides) here. The doc should contain: (1) your task brief and 5 pre-committed criteria, (2) all three outputs in full, clearly labeled A/B/C, (3) the scoring grid with totals, (4) your 200–300 word Verdict, (5) your Centaur iteration log. Set the link to "Anyone with the link can view."' },

    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Which of the three modes produced the best result on YOUR specific task — and what specifically did it add that the other two modes couldn\'t? Be precise. Point at one concrete thing in your output.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'When would you ever pick AI-only mode in real life? Name a real situation where you genuinely don\'t need a human in the loop. If you can\'t think of one, say so and explain why.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Connect your findings to the Centaurs vs. Cyborgs lesson. In Mode C, were you operating more like a Centaur (handing AI a sub-task and combining the result) or a Cyborg (blending your moves with AI moves on the same sub-task)? Which one worked better for your task — and would you flip modes if you did this again?' },
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
