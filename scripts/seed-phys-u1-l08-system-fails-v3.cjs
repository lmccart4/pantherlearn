// seed-phys-u1-l08-system-fails-v3.cjs — Unit 1 Lesson 8: what physically failed during Sandy.
// v3 = v2 lesson plus appended native graded practice blocks from l08-sandy-data-interpreter.md.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l08-system-fails-v3.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l08-system-fails',
  title: 'When the System Fails',
  unit: 'Unit 1: Energy & the Grid',
  order: 108,
  visible: false,
  dueDate: '2026-09-17',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'When the System Fails', subtitle: 'Unit 1 · Lesson 8' }),

    k.objectives([
      'Identify what physically failed in the grid during Superstorm Sandy',
      'Analyze and interpret outage and restoration data over time',
      'Use numbers from the data table to estimate how many customers were restored',
      'Revise our Lesson 1 model of how electricity reaches our community',
    ]),

    k.text(
      "On the night of October 29, 2012, Superstorm Sandy made landfall near Brigantine, New Jersey. Within hours, millions " +
      "of homes and businesses went dark. A full week later, hundreds of thousands of people still had no power.\n\n" +
      "Here is the surprising part: most of New Jersey's power plants were still running. The blackout was not mainly a failure " +
      "of **generation**. It was a failure of **delivery** — the substations, transmission lines, and distribution lines that " +
      "carry electricity from the plant to the home."
    ),

    k.text(
      "Two things broke in the delivery path.\n\n" +
      "**1. Flooded substations.** The storm surge pushed Raritan Bay and the ocean inland and submerged switching stations and " +
      "substations under **4 to 8 feet of water** — often salt water. Substations are the nodes that route and step down " +
      "high-voltage electricity so it can reach neighborhoods. Once one is underwater, you cannot just flip it back on. It has " +
      "to be drained, cleaned, dried, and inspected first, and salt water corrodes cables, motors, and metal parts and causes " +
      "short circuits. That is why a flooded substation takes far longer to restore than a downed line.\n\n" +
      "**2. Downed transmission and distribution lines.** NJ wind gusts reached about **80 mph**, driving trees into the lines. " +
      "Crews ended up removing **more than 93,000 trees** and replacing **over 2,400 poles** before power could come back.\n\n" +
      "The power plants kept generating electricity; the delivery system could not get it to customers."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l08-flooded-substation.jpg',
      alt: 'An electrical substation with its transformers and switchgear submerged in murky storm floodwater under dark clouds.',
      caption:
        "Sandy's surge flooded substations like this. Saltwater-soaked equipment cannot be switched back on until it is drained, " +
        "cleaned, and dried — which is why the power stayed out so long.",
    }),

    k.mdTable({
      lead: '**Customers Without Power After Sandy**',
      headers: ['Location / Date', 'Customers without power', 'What this tells us'],
      rows: [
        ['New Jersey — peak outage', '~$2.7$ million', 'Largest blackout in NJ history'],
        ['New Jersey — one week later', '~$775{,}000$', 'Still hundreds of thousands in the dark after 7 days'],
        ['National (U.S.) — Oct 30, 2012', '~$8.2$ million', 'Largest power outage in U.S. history by customer count'],
        ['National (U.S.) — Nov 8, 2012', '~$90\\%$ restored', 'Restoration took more than a week for many customers'],
      ],
      note: 'Sources: EIA Today in Energy; Wikipedia: Effects of Hurricane Sandy in New Jersey. Full citations below.',
    }),

    k.dataTable({
      title: 'Copy the verified outage data into the table below',
      preset: 'numeric',
      rows: [
        { key: 'nj_peak', label: 'New Jersey — peak outage' },
        { key: 'nj_week', label: 'New Jersey — one week later' },
        { key: 'us_1030', label: 'National (U.S.) — Oct 30, 2012' },
        { key: 'us_1108', label: 'National (U.S.) — Nov 8, 2012' },
      ],
      columns: [
        { key: 'customers', label: 'Customers Without Power' },
        { key: 'note', label: 'What This Tells Us' },
      ],
    }),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: How many NJ customers got power back in the first week?',
      content:
        "**Step 1:** Identify peak and one-week-later values.\n\n" +
        "- Peak NJ outage: ~$2{,}700{,}000$ customers\n" +
        "- One week later: ~$775{,}000$ customers\n\n" +
        "**Step 2:** Subtract to find the number restored.\n\n" +
        "$$2{,}700{,}000 - 775{,}000 = 1{,}925{,}000$$\n\n" +
        "**Step 3:** Express as a percentage of the peak outage.\n\n" +
        "$$\\frac{1{,}925{,}000}{2{,}700{,}000} \\approx 0.713 \\approx 71\\%$$\n\n" +
        "So about **$71\\%$** of the customers who lost power in NJ had it back after one week. That still left roughly " +
        "**$775{,}000$** customers waiting.",
    }),

    k.mc({
      prompt:
        'Based on the evidence, what was the main physical reason New Jersey lost power — even though the power plants kept generating electricity?',
      options: [
        'Flooded substations and downed lines broke the delivery system.',
        'The power plants supposedly ran out of fuel during the storm.',
        'Too little electricity was generated to meet customer demand.',
        'Customers used so much power that the wires overheated and melted.',
      ],
      correctIndex: 0,
      explanation:
        'Generation survived — NJ\'s thermal plants kept producing electricity. The failure was in delivery: storm surge flooded ' +
        'substations under 4–8 ft of water (slow to restore because they must be drained, cleaned, dried, and inspected) and ~80 mph ' +
        'winds drove trees into transmission lines.',
      difficulty: 'analyze',
    }),

    k.mc({
      prompt: 'According to the table, approximately how many U.S. customers were still without power on October 30, 2012?',
      options: [
        'About $2.7$ million customers',
        'About $775{,}000$ customers',
        'About $8.2$ million customers',
        'About $90\\%$ of affected customers',
      ],
      correctIndex: 2,
      explanation:
        'The table lists the national Oct 30 figure as ~$8.2$ million customers without power. The $2.7$ million figure is NJ peak; ' +
        '$775{,}000$ is NJ one week later; $90\\%$ is the national restoration share by Nov 8.',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'Why does restoring a flooded substation usually take longer than repairing a downed line?',
      options: [
        'Substations generate all the electricity used by an entire neighborhood.',
        'Flooded substations must be drained, cleaned, dried, and inspected before reuse.',
        'Substations are usually located far away from where repair crews are based.',
        'Downed lines do not actually need repairs before power can safely return.',
      ],
      correctIndex: 1,
      explanation:
        'Substations route and step down power. Once flooded — often with salt water — the equipment must be carefully drained, cleaned, ' +
        'dried, and inspected to avoid short circuits and corrosion. Downed lines can often be repaired more quickly.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'Go back to the model of the grid you drew in Lesson 1. Where exactly did the path break during Sandy? Explain why the failure was in delivery, not generation.',
      placeholder: 'In my Lesson 1 model, the path broke at… This was a delivery failure because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Using the outage data, claim what the single biggest driver of the New Jersey blackout was. Cite evidence from the table and your reading, then reason using what you know about the grid.',
      claimHint: 'Name the single biggest driver of the NJ blackout (generation vs. delivery).',
      evidenceHint:
        'Cite specific numbers from the table and details from the reading (e.g., 4–8 ft flooding, ~93,000 trees, NJ peak vs. one-week-later counts).',
      reasoningHint:
        'Explain why that evidence points to a delivery failure, not a generation failure — and why a flooded substation stays offline longer than a downed line.',
    }),

    k.callout({
      style: 'definition',
      icon: '📖',
      title: 'Vocabulary — When the System Fails',
      content:
        '- **Outage:** a period when electric service is interrupted.\n' +
        '- **Generation:** the production of electricity at power plants.\n' +
        '- **Delivery:** the transmission, substation, and distribution system that moves electricity to users.\n' +
        '- **Substation:** a facility that routes power and changes voltage between transmission and distribution levels.\n' +
        '- **Transmission line:** a high-voltage line that carries power long distances.\n' +
        '- **Distribution line:** a lower-voltage line that delivers power to neighborhoods.\n' +
        '- **Storm surge:** a rise in ocean water level pushed ashore by a storm.\n' +
        '- **Restoration:** the process of repairing the grid and bringing power back.\n' +
        '- **Resilience:** the ability of a system to withstand or recover from a disruption.',
    }),

    k.shortAnswer({
      prompt:
        'In two or three sentences, explain why the Sandy blackout was mainly a failure of delivery, not generation. Use at least one specific number from the lesson.',
      placeholder: 'The Sandy blackout was mainly a delivery failure because… One number that shows this is…',
      difficulty: 'apply',
    }),

    k.text(
      "**Extension:** After Sandy, PSE&G launched the **Energy Strong** program to harden the grid. The work included raising or " +
      "eliminating substations in flood zones to at least the 100-year-flood level plus one foot, replacing older equipment, and adding " +
      "smarter grid monitoring. The investment totaled roughly **$4.8$ billion** across multiple phases and covered about **26 stations**. " +
      "Hoboken, whose Marshall Street substation flooded during Sandy, had zero power outages during Hurricanes Henri and Ida after the " +
      "substation was relocated and elevated."
    ),

    k.externalLink({
      icon: '📊',
      title: 'Source: EIA — Hurricane Sandy Caused Electric Power Outages',
      description:
        'U.S. Energy Information Administration report on the scale and restoration of power outages after Hurricane Sandy.',
      url: 'https://www.eia.gov/todayinenergy/detail.php?id=8730',
      buttonLabel: 'View EIA Report',
    }),

    k.externalLink({
      icon: '🏗️',
      title: 'Source: PSE&G — Energy Strong',
      description: 'PSE&G overview of grid-hardening work completed after Superstorm Sandy.',
      url: 'https://nj.pseg.com/energystrong',
      buttonLabel: 'View Energy Strong',
    }),

    // ----- Appended native practice blocks from l08-sandy-data-interpreter.md -----
    k.sectionHeader({ icon: '📉', title: 'Practice: Sandy Outage Data', subtitle: 'Calculate and interpret the verified numbers' }),

    k.mc({
      prompt:
        'About how many New Jersey customers had their power restored during the first week after the storm?',
      options: [
        'About $775{,}000$ customers',
        'About $1{,}925{,}000$ customers',
        'About $2{,}700{,}000$ customers',
        'About $90{,}000$ customers',
      ],
      correctIndex: 1,
      explanation:
        'Subtract the one-week count from the peak count: $2{,}700{,}000 - 775{,}000 = 1{,}925{,}000$ customers restored.',
      difficulty: 'apply',
    }),

    k.mc({
      prompt:
        'What percentage of the peak New Jersey outage was still without power after one week?',
      options: [
        'About $71\\%$',
        'About $50\\%$',
        'About $29\\%$',
        'About $10\\%$',
      ],
      correctIndex: 2,
      explanation:
        '$775{,}000 \\div 2{,}700{,}000 \\approx 0.287$, which is about $29\\%$.',
      difficulty: 'apply',
    }),

    k.mc({
      prompt:
        'If about $90\\%$ of the $8.2$ million U.S. customers had power restored by Nov 8, about how many were still out?',
      options: [
        'About $90{,}000$ customers',
        'About $1{,}640{,}000$ customers',
        'About $8{,}200{,}000$ customers',
        'About $820{,}000$ customers',
      ],
      correctIndex: 3,
      explanation:
        '$10\\%$ of $8{,}200{,}000$ is $820{,}000$, so about $820{,}000$ customers were still without power.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'The power plants kept generating electricity, yet customers lost power. What does that tell you about where the failure happened?',
      placeholder: 'The failure happened in… because…',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'Why did flooded substations take longer to restore than downed lines?',
      placeholder: 'Flooded substations took longer because…',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'Which number in the Sandy outage table surprises you the most? Why?',
      placeholder: 'The number that surprises me most is… because…',
      difficulty: 'evaluate',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
