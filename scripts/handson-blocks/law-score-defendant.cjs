module.exports = {
  printableFilename: 'law-defendant-scoring-worksheet.html',
  blocks: [
    {
      type: 'section_header',
      id: 'sh-handson',
      label: 'Hands-On Activity',
      title: 'Score the Defendant',
    },
    {
      type: 'callout',
      id: 'co-handson-materials',
      variant: 'teacher-note',
      title: 'Materials (teacher prep ~2 min)',
      content: '- 1 double-sided worksheet per student (B&W)\n- Pencils',
    },
    {
      type: 'text',
      id: 'tx-handson-instructions',
      content: '### How it works\n\nEach student gets a defendant profile card + blank point-tally sheet. Compute a COMPAS-style risk score by hand using the given weights:\n\n- Age bracket: +1 to +4 points\n- Prior record: +0 to +5 points\n- Employment status: +0 to +3 points\n- Neighborhood code: +0 to +4 points\n\nTotal = risk score. 0–5 = Low. 6–10 = Medium. 11+ = High.\n\n### Small-group compare (5 min)\n\nIn groups of 4, compare your scores. Who got the highest? Who got the lowest? What factor drove the biggest jump?\n\n### Debrief\n\n- None of the inputs said "race." Can the output still produce a racially biased pattern?\n- Which factor felt most "neutral" but actually tracks something else?\n- If you could remove one factor, which would it be — and what do you lose in exchange?',
    },
    {
      type: 'callout',
      id: 'co-handson-debrief',
      variant: 'reflection',
      title: 'Wrap-up question',
      content: 'If this algorithm were used to decide whether you went home or stayed in jail, which input would you want to challenge first — and on what grounds?',
    },
  ],
};
