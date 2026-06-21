// seed-phys-u1-l01-night-lights-v2.cjs — Unit 1 Lesson 1: expanded anchor + pre-assessment.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l01-night-lights-v2.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l01-night-lights',
  title: 'The Night the Lights Went Out',
  unit: 'Unit 1: Energy & the Grid',
  order: 101,
  visible: false,
  dueDate: '2026-09-08',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'The Night the Lights Went Out', subtitle: 'Unit 1 · Lesson 1 — Our Anchoring Phenomenon' }),

    k.objectives([
      'Observe and ask questions about the Superstorm Sandy blackout in New Jersey',
      'Build an initial model of how electricity reaches our community',
      'Contribute your questions to our class Driving Question Board',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l01-night-lights-hero.jpg',
      alt: 'A dark New Jersey coastal neighborhood at night after Superstorm Sandy, with no lights in any home.',
      caption: 'Superstorm Sandy left much of New Jersey dark for days — the phenomenon that drives this whole unit. *(Illustration.)*',
    }),

    k.text(
      "On the evening of **October 29, 2012**, Superstorm Sandy made landfall near Brigantine, New Jersey. " +
      "It was the largest Atlantic hurricane ever recorded by size — its winds stretched more than 1,000 miles across.\n\n" +
      "When the storm passed, **about 2.7 million** New Jersey homes and businesses had no electricity. It was the " +
      "largest blackout in the history of our state. A full **week later, around 775,000 people were still in the dark**. " +
      "Repair crews had to cut down more than **93,000 trees** and replace over **2,400 power poles** before the lights " +
      "could come back on.\n\n" +
      "This wasn't just something that happened far away. Right here in **Perth Amboy**, the storm surge pushed the " +
      "Raritan River over its banks, flooding the waterfront, destroying the marina, and forcing people from their homes. " +
      "For days, families had no heat, no refrigeration, no way to charge a phone, and no way to know when it would end."
    ),

    k.callout({
      style: 'question',
      icon: '🎯',
      title: 'Our Driving Question',
      content:
        "**How can we design a more reliable energy system for our community?**\n\n" +
        "This question stays with us for the whole unit. Every lesson, we'll learn one more piece of the answer — " +
        "and by the end, *you* will redesign the grid yourself.",
    }),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: How big is 2.7 million outages?',
      content:
        "The number **2.7 million** is hard to picture. Let's give it a scale.\n\n" +
        "- Perth Amboy has about **55,000** residents.\n" +
        "- If each home or business averaged about **2.5 people**, then 2.7 million outages means roughly " +
        "**6.75 million people** were without power at some point — more than the entire population of New Jersey today.\n" +
        "- Even a week later, **775,000 people** still had no lights. That's about **14 times the population of Perth Amboy** " +
        "still waiting in the dark.\n\n" +
        "So when we say the grid failed, we mean it failed at a massive scale. The physics we study in this unit — " +
        "energy, current, power, systems — is what engineers use to keep failures this large from happening again.\n\n" +
        "*Note: The 55,000 Perth Amboy population figure is rounded from recent U.S. Census estimates; the 2.5 people per " +
        "account is a rough teaching estimate, not a published statistic.*",
    }),

    k.text(
      "**Notice & Wonder**\n\n" +
      "Before we explain anything, we observe. Scientists start by noticing carefully and asking good questions. " +
      "Look closely at the photos and the numbers about Sandy, then answer below."
    ),

    k.shortAnswer({
      prompt:
        "**What do you notice?**\n\nList everything you observe about the storm, the power outage, and how people were " +
        "affected. There are no wrong answers here — just careful observations.",
      placeholder: 'I notice that…',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**What are you wondering?**\n\nWrite at least **three questions** you have — about how electricity normally " +
        "reaches your home, or about why the power went out and stayed out for so long.",
      placeholder: '1.\n2.\n3.',
      difficulty: 'understand',
    }),

    k.sketch({
      title: 'Your Initial Model',
      instructions:
        'Draw a model showing how you think electricity normally travels from a power plant all the way to a device ' +
        'in your home. Then circle or label the place(s) you think failed during Sandy.',
      prompt: "Label every part you can — don't worry about being \"right.\" This is your starting point, and we'll come back to it.",
    }),

    k.shortAnswer({
      prompt:
        "**Explain your thinking.**\n\nIn your own words, describe **everything you currently think happens** between a " +
        "power plant and your phone charger. What has to work for your phone to charge?",
      placeholder: 'When I plug in my phone…',
      difficulty: 'analyze',
    }),

    k.mc({
      prompt: 'The lesson says about **2.7 million** New Jersey homes and businesses lost power. What does that number tell us?',
      options: [
        'The storm caused the largest blackout in New Jersey history.',
        'Exactly 2.7 million people were physically injured during the storm.',
        'Most people in the state kept power, with only a few outages.',
        'Only businesses lost power; homes were mostly unaffected.',
      ],
      correctIndex: 0,
      explanation:
        '2.7 million accounts without power made Sandy the largest blackout in New Jersey history. It does not mean ' +
        '2.7 million people were physically hurt, and it does not mean most people kept power.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'A full week after the storm, around **775,000 people** in New Jersey were still without power. What does that suggest?',
      options: [
        'The damage was minor, so most repairs were finished within a single day.',
        'The storm stayed over one small town and never spread beyond it.',
        'Restoration took a long time because grid damage was widespread and severe.',
        'Power plants stopped producing electricity for the whole week.',
      ],
      correctIndex: 2,
      explanation:
        'If hundreds of thousands of people were still in the dark a week later, the damage to lines, poles, substations, ' +
        'and trees must have been extensive. Power plants were largely intact; the failure was in delivery.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'In Perth Amboy, what did the storm surge from Sandy do?',
      options: [
        'It raised the Raritan River by a few inches with no reported damage.',
        'It increased electricity production at the local power plant.',
        'It caused a blackout only in the school\'s cafeteria.',
        'It flooded the Perth Amboy waterfront and destroyed the marina.',
      ],
      correctIndex: 3,
      explanation:
        'The surge pushed the Raritan River over its banks, flooded the waterfront, destroyed the marina, and forced evacuations.',
      difficulty: 'understand',
    }),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Vocabulary — The Grid & Blackouts',
      content:
        "- **Grid:** the connected system of power plants, transmission lines, substations, and distribution wires that " +
        "delivers electricity to homes and businesses.\n" +
        "- **Blackout:** a large-scale loss of electric power across an area.\n" +
        "- **Outage:** any interruption in electric service, from one home to a whole region.\n" +
        "- **Transformer:** a device that raises or lowers the voltage of electricity so it can travel efficiently over " +
        "long distances and then safely enter homes.\n" +
        "- **Substation:** a facility where voltage is changed and electricity is routed between transmission lines and " +
        "local distribution lines.\n" +
        "- **Restoration:** the process of repairing the grid and bringing power back after an outage.",
    }),

    k.shortAnswer({
      prompt:
        "**Exit Ticket.** In one or two sentences, describe one way the Sandy blackout affected daily life in New Jersey. " +
        "Then write one question you still have about how electricity reaches Perth Amboy.",
      placeholder: 'One effect was… One question I still have is…',
      difficulty: 'understand',
    }),

    k.callout({
      style: 'info',
      icon: '📌',
      title: 'About the Driving Question Board',
      content:
        "Mr. McCarthy will post your questions on our class **Driving Question Board**. As we work through this unit, " +
        "we'll come back to your questions and check off the ones we can answer. This first model is **not graded for " +
        "being correct** — it's graded for honest effort. It's the \"before\" picture of your thinking.",
    }),

    k.externalLink({
      icon: '📚',
      title: 'Source: EIA — Hurricane Sandy and the New Jersey Power Outage',
      description:
        'U.S. Energy Information Administration report on the scale and timeline of power restoration after Sandy.',
      url: 'https://www.eia.gov/todayinenergy/detail.php?id=8730',
      buttonLabel: 'Read EIA Report',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
