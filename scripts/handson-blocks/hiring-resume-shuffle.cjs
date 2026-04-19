module.exports = {
  printableFilename: 'hiring-resumes.html',
  blocks: [
    {
      type: 'section_header',
      id: 'sh-handson',
      label: 'Hands-On Activity',
      title: 'The Resume Shuffle',
    },
    {
      type: 'callout',
      id: 'co-handson-materials',
      variant: 'teacher-note',
      title: 'Materials (teacher prep ~10 min first time, reusable after)',
      content: '- 30 printed resumes, B&W (1 class set, shared across all 4 sections)\n- 6 rule cards, B&W (1 per table)\n- Tables of 4-5 students',
    },
    {
      type: 'text',
      id: 'tx-handson-instructions',
      content: '### How it works\n\nEach table is an "AI hiring filter" with ONE rule. Rule cards are face-down on the table — flip yours now.\n\nApply your rule to all 30 resumes. Build two piles: **Passed** and **Rejected**.\n\n### Cross-table walk (5 min)\n\nWalk the room. Look at every other table\'s Passed pile. Note:\n- Who appears in lots of Passed piles?\n- Who got rejected by multiple filters stacked together?\n- Would you want to be evaluated by any of these rules?\n\n### Debrief\n\n- None of the rules mentioned race, gender, or disability. Did the outcomes still track those?\n- Which rule rejected the most people? Which looked neutral but cascaded hardest?\n- If a company used 3 of these rules together, what kind of person survives all 3?',
    },
    {
      type: 'callout',
      id: 'co-handson-debrief',
      variant: 'reflection',
      title: 'Wrap-up question',
      content: "If your resume had to pass 5 of these 6 filters to get to a human, what would you change about how you describe yourself — and what does that say about who the system rewards?",
    },
    {
      type: 'callout',
      id: 'co-handson-printable',
      variant: 'teacher-note',
      title: 'Printable packets (2 files)',
      content: '- `lesson-plans-public/ai-literacy/unit5-printables/hiring-resumes.html` — 30 resumes, B&W, 10 pages. 1 class set, reused across all 4 sections.\n- `lesson-plans-public/ai-literacy/unit5-printables/hiring-rule-cards.html` — 6 rule cards, B&W, 1 page. 1 card per table.',
    },
  ],
};
