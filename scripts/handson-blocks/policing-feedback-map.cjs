module.exports = {
  printableFilename: 'policing-grid-map.html',
  blocks: [
    {
      type: 'section_header',
      id: 'sh-handson',
      label: 'Hands-On Activity',
      title: 'Feedback Loop Map',
    },
    {
      type: 'callout',
      id: 'co-handson-materials',
      variant: 'teacher-note',
      title: 'Materials (teacher prep ~10 min first time, ~2 min after)',
      content: '- 1 grid-map worksheet per group of 4 (B&W)\n- ~20 tokens per group (pennies/chips) as patrol markers\n- Pencils for tracking rounds',
    },
    {
      type: 'text',
      id: 'tx-handson-instructions',
      content: '### How it works\n\nYour group is the chief of police for a 4-precinct city. Each precinct starts with different numbers of reported crimes (given on the map). You have 20 patrols to deploy.\n\n### Round 1\n\nPlace patrols based on Round 0 crime reports. Then roll new crime reports per precinct: **1 report for every 5 patrols deployed there + baseline**.\n\n### Rounds 2 and 3\n\nRe-deploy patrols based on the updated crime totals. Log what happens.\n\n### Debrief\n\n- Which precinct has the most patrols by Round 3? Why?\n- Did "crime" actually go up there, or did reporting go up because patrols were there?\n- Is there any fair way to use this data for future patrol decisions?\n- What would you have to change to break the loop?',
    },
    {
      type: 'callout',
      id: 'co-handson-debrief',
      variant: 'reflection',
      title: 'Wrap-up question',
      content: "If you were the mayor and the chief showed you this 3-round map as proof of 'where the crime is,' what would you ask before agreeing?",
    },
  ],
};
