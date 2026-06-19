// seed-phys-u1-l08-system-fails.cjs — Unit 1 Lesson 8: what physically failed during Sandy (Analyzing & Interpreting Data).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l08-system-fails.cjs
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
      'Revise our Lesson 1 model of how electricity reaches our community',
    ]),

    k.text(
      "We started this unit in the dark. Now we know enough physics to ask the real question: when Sandy hit, " +
      "**what actually broke?**\n\n" +
      "Here's the part that surprises most people. The **power plants mostly kept working.** In New Jersey, our " +
      "electricity comes from thermal plants — natural gas and nuclear — and they were largely intact and still " +
      "generating. The lights went out anyway. So if generation survived, the failure had to be somewhere in " +
      "**delivery** — the path that carries electrical energy from the plant to your home."
    ),

    k.text(
      "Two things broke in that delivery path.\n\n" +
      "**1. Flooded substations.** The storm surge pushed Raritan Bay and the ocean inland and submerged switching " +
      "stations and substations under **4 to 8 feet of water** — often *salt* water. Substations are the nodes that " +
      "route and step down high-voltage electricity so it can reach neighborhoods. Once one is underwater, you can't " +
      "just flip it back on. It has to be **drained, cleaned, dried, and inspected** first, and salt water corrodes " +
      "cables, motors, and metal parts and causes short circuits. That's why a flooded substation takes far longer " +
      "to restore than a downed line.\n\n" +
      "**2. Downed transmission lines.** NJ wind gusts reached about **80 mph**, driving trees into the lines. Crews " +
      "ended up removing **more than 93,000 trees** and replacing **over 2,400 poles** before power could come back."
    ),

    // IMAGE PHASE: rights-cleared photo of a flooded substation / Sandy flooding (data pack §7 — FEMA/NOAA PD or Commons CC). Inserted after content is approved.

    k.dataTable({
      title: 'Customers Without Power After Sandy (Verified Figures)',
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

    k.barChart({ title: 'Customers Without Power Over Time', barCount: 3 }),

    k.text(
      "Now go back to the model you drew in **Lesson 1** — your picture of electricity traveling from a power plant " +
      "all the way to a device in your home. Find the exact place the path broke during Sandy.\n\n" +
      "It was **not** at the power plant (generation kept running). It was downstream, in the delivery system: the " +
      "**substations** that route and step down the voltage, and the **transmission and distribution lines** that " +
      "carry it the last stretch. Revise your model so the failure points sit there — between the plant and the home, " +
      "not at the plant itself."
    ),

    k.mc({
      prompt:
        'Based on the evidence, what was the main physical reason New Jersey lost power — even though the power ' +
        'plants kept generating electricity?',
      options: [
        'The power plants ran out of fuel during the storm.',
        'Flooded substations and downed transmission lines broke the delivery system.',
        'Too little electricity was generated to meet demand.',
        'Customers used so much power that the wires melted.',
      ],
      correctIndex: 1,
      explanation:
        'Generation survived — NJ\'s thermal plants kept producing electricity. The failure was in delivery: storm ' +
        'surge flooded substations under 4–8 ft of water (slow to restore because they must be drained, cleaned, ' +
        'dried, and inspected) and ~80 mph winds drove trees into transmission lines. The other options describe a ' +
        'generation or demand problem, which the evidence does not support.',
      difficulty: 'analyze',
    }),

    k.cer({
      prompt:
        'Using the outage data, claim what the single biggest driver of the New Jersey blackout was. Cite evidence ' +
        'from the table and your reading, then reason using what you know about the grid.',
      claimHint: 'Name the single biggest driver of the NJ blackout (generation vs. delivery).',
      evidenceHint: 'Cite specific numbers from the table and details from the reading (e.g., 4–8 ft flooding, ~93,000 trees, NJ peak vs. one-week-later counts).',
      reasoningHint: 'Explain why that evidence points to a delivery failure, not a generation failure — and why a flooded substation stays offline longer than a downed line.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
