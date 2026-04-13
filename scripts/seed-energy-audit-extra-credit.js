// seed-energy-audit-extra-credit.js
// Physics — Energy Unit — Extra Credit
// "Real-World Energy Audit" — up to 10% extra credit for exemplary work
// Run: node scripts/seed-energy-audit-extra-credit.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Extra Credit — Real-World Energy Audit",
  questionOfTheDay: "Pick a real object in motion. Can you track its energy from start to finish — and prove where the 'lost' energy went?",
  course: "Physics",
  unit: "Energy",
  order: 50,
  visible: false,
  dueDate: "2026-04-13",
  gradesReleased: true,
  blocks: [

    {
      id: "section-intro",
      type: "section_header",
      title: "Extra Credit Challenge",
      subtitle: "Up to +10% to your grade",
      icon: "⚡"
    },
    {
      id: "b-intro",
      type: "callout",
      style: "insight",
      icon: "🏆",
      content: "**Real-World Energy Audit**\n\nPick a real object in motion, measure it, and track its energy through the journey using what you've learned in the Energy unit.\n\nExemplary work earns **up to a 10% boost** to your overall grade. Partial credit is available for solid-but-imperfect work. **Due: tomorrow (end of day).**"
    },
    {
      id: "b-why",
      type: "text",
      content: "Anyone can plug numbers into $KE = \\frac{1}{2}mv^2$ on a worksheet. This challenge asks something harder: **can you use those equations on something real?**\n\nYou'll pick an object you can actually measure, track its energy at three points in its motion, and figure out where the 'missing' energy went. This is what physicists actually do."
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "What You'll Do",
      items: [
        "Pick a real object in motion (something you can film and measure)",
        "Measure mass, heights, and speeds at three points",
        "Calculate kinetic energy and gravitational potential energy at each point",
        "Report the total mechanical energy at each point and the percent 'lost'",
        "Identify where the lost energy actually went (friction, sound, heat, deformation)",
        "Submit a video as proof that you did the measurement yourself"
      ]
    },

    { id: "div-1", type: "divider" },

    {
      id: "section-pick",
      type: "section_header",
      title: "Step 1: Pick Your System",
      icon: "🎯"
    },
    {
      id: "b-pick-text",
      type: "text",
      content: "Pick **one** system from the physics classroom that you can measure with the lab equipment we already have. It must:\n\n- Have measurable **mass** (use the triple-beam or digital balance)\n- Move through measurable **height changes** or along a track where you can track its position\n- Move slowly enough that a **motion detector** can capture clean data\n- Be **safe** — no sending things flying across the room\n\nClean data and clean math are what earn the top score. Pick something simple that you can measure well."
    },
    {
      id: "b-pick-ideas",
      type: "callout",
      style: "scenario",
      icon: "💡",
      content: "**Suggested systems** (all using gear from our classroom):\n\n- **Dynamics cart on a ramp** — release from the top, track it down the incline\n- **Dynamics cart + pulley + hanging mass** — classic Atwood-style setup\n- **Ball rolling down a ramp** into a level stretch (bowling ball, steel ball, whatever's on the shelf)\n- **Pendulum** — swing a mass from a known height and track it at the bottom\n- **Mass on a spring** — drop a mass attached to a spring, track vertical motion\n- **Cart with added mass** — change the mass and see how the energy changes\n- **Falling mass** — drop a known mass onto a cushion in front of the motion detector\n\nPick one. Simple is better than clever if it means your data is cleaner."
    },

    { id: "div-2", type: "divider" },

    {
      id: "section-measure",
      type: "section_header",
      title: "Step 2: Measure",
      icon: "📏"
    },
    {
      id: "b-measure-text",
      type: "text",
      content: "You need **three data points** along your system's motion. For each point, record:\n\n- **Height** above a reference line (meters) — use a meter stick or the track's markings\n- **Speed** (meters per second) — from the motion detector\n- The **time** (in seconds) from your Logger Pro / Capstone graph where that point occurs\n\n**Use a motion detector (strongly recommended).** The Vernier / PASCO motion sensors we have in the lab give you position vs. time and velocity vs. time graphs directly. Read the speed straight off the velocity graph at each of your three time points. This is *much* more accurate than eyeballing a phone video, and it's what physicists actually do in a real lab.\n\n**If a motion detector isn't available** for your setup, a phone video with a meter-stick in frame is an acceptable backup — step through frame-by-frame and use $v = \\frac{\\Delta x}{\\Delta t}$. Expect a slight penalty on the data quality score.\n\n**Mass:** Use the classroom balance. Record the mass in kilograms and note which balance you used."
    },
    {
      id: "b-measure-callout",
      type: "callout",
      style: "warning",
      icon: "📐",
      content: "Your three points should span a **real energy change** — e.g., start (lots of PE, no KE) → middle (some PE, some KE) → end (no PE, peak KE, or after friction has slowed it). Don't pick three points that are all basically the same state.\n\nTip: when you set up the motion detector, put tape or marks on the track at the three positions you'll analyze so you know exactly where each reading comes from."
    },

    { id: "div-3", type: "divider" },

    {
      id: "section-calc",
      type: "section_header",
      title: "Step 3: Calculate",
      icon: "🧮"
    },
    {
      id: "b-calc-text",
      type: "text",
      content: "At each of your three points, calculate:\n\n**Kinetic Energy:** $KE = \\frac{1}{2}mv^2$\n\n**Gravitational Potential Energy:** $PE = mgh$  (use $g = 9.8 \\text{ m/s}^2$)\n\n**Total Mechanical Energy:** $E_{total} = KE + PE$\n\nUse correct units (joules) and **show your work**. A bare final number with no setup will not score."
    },
    {
      id: "b-loss-text",
      type: "text",
      content: "Then calculate the **energy lost** from your starting point to your end point:\n\n$$\\% \\text{ lost} = \\frac{E_{start} - E_{end}}{E_{start}} \\times 100\\%$$\n\nIf your end point has MORE energy than your start, something went wrong with your measurements — recheck before submitting."
    },

    { id: "div-4", type: "divider" },

    {
      id: "section-where",
      type: "section_header",
      title: "Step 4: Where Did the Energy Go?",
      icon: "🔍"
    },
    {
      id: "b-where-text",
      type: "text",
      content: "Energy can't actually be destroyed — so if your 'total mechanical energy' dropped between point 1 and point 3, the missing energy went **somewhere**. Your job is to name where.\n\nCommon answers:\n\n- **Friction** (wheels, axles, air resistance) → converted to **heat**\n- **Sound** (the thud, the screech, the slap of a ball)\n- **Deformation** (a ball squishing, concrete chipping, a skateboard flexing)\n- **Vibration** of the object itself\n\nYour answer should be specific to YOUR setup. Don't just list 'friction' — tell me *what* was rubbing against *what*."
    },

    { id: "div-5", type: "divider" },

    {
      id: "section-rubric",
      type: "section_header",
      title: "Rubric",
      subtitle: "How exemplary work is scored",
      icon: "📊"
    },
    {
      id: "b-rubric",
      type: "callout",
      style: "objective",
      icon: "🏅",
      content: "**Full 10% boost (exemplary):** Every section below is complete, accurate, and shows real effort.\n\n- **System & measurements (2 pts)** — clean classroom setup, mass + 3 motion detector data points, clearly reported with units and method\n- **KE calculations (2 pts)** — correct formula, correct units, shown work at all 3 points\n- **PE calculations (2 pts)** — correct formula, correct units, shown work at all 3 points\n- **Energy loss analysis (2 pts)** — correct % calculation AND specific identification of where the energy went\n- **Evidence proof (1 pt)** — clear screenshot of your motion detector graphs + photo of your setup (video optional, but nice)\n- **Written reflection (1 pt)** — connects your data to the work-energy theorem\n\nPartial credit scales: 7-9 points = meaningful boost (5-8%), 4-6 points = small boost (2-4%), under 4 = no credit."
    },

    { id: "div-6", type: "divider" },

    {
      id: "section-submit",
      type: "section_header",
      title: "Your Submission",
      subtitle: "Fill out every field — show your work in full",
      icon: "✍️"
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "**Your system:** What real object are you analyzing, and what motion are you tracking? (one or two sentences)",
      difficulty: "apply"
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "**Mass:** What is the mass of your object (in kg), and how did you measure it? (scale? kitchen scale? spec sheet?)",
      difficulty: "apply"
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "**Three data points:** For Point 1, Point 2, and Point 3 — report the height (m), speed (m/s), and the time (s) from your motion detector / Logger Pro graph where that point occurs.",
      difficulty: "apply"
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "**Kinetic energy at each point:** Show your work. Plug values into $KE = \\frac{1}{2}mv^2$ at Point 1, Point 2, and Point 3. Report your answers in joules.",
      difficulty: "apply"
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "**Potential energy at each point:** Show your work. Plug values into $PE = mgh$ (use $g = 9.8$) at Point 1, Point 2, and Point 3. Report your answers in joules.",
      difficulty: "apply"
    },
    {
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "**Total mechanical energy:** Add KE + PE at each point. How much total energy did the system have at Point 1, Point 2, and Point 3?",
      difficulty: "apply"
    },
    {
      id: "q7",
      type: "question",
      questionType: "short_answer",
      prompt: "**Percent energy 'lost':** Using $\\% \\text{ lost} = \\frac{E_{start} - E_{end}}{E_{start}} \\times 100\\%$, calculate how much energy left your system from Point 1 to Point 3. Show your work.",
      difficulty: "analyze"
    },
    {
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "**Where did the missing energy actually go?** Be specific to YOUR setup. Name the exact surfaces, parts, or mechanisms involved. Don't just say 'friction' — tell me what was rubbing against what, and what form the energy ended up in (heat, sound, deformation, etc.).",
      difficulty: "analyze"
    },
    {
      id: "q9",
      type: "question",
      questionType: "short_answer",
      prompt: "**Reflection:** Did your results match what you expected? What did this exercise show you about how the work-energy theorem applies in the real world (vs. textbook problems where energy is perfectly conserved)?",
      difficulty: "evaluate"
    },
    {
      id: "q10",
      type: "question",
      questionType: "short_answer",
      prompt: "**Google Drive evidence link:** Paste a shareable Drive link to your evidence here. Evidence should include: (1) a screenshot of your motion detector graphs (position vs. time AND velocity vs. time) with your three points labeled, AND (2) a photo of your lab setup. A short video of the run is a bonus. Set sharing to \"Anyone with the link can view\" — if I can't open it, it doesn't count. Double-check the link works before submitting.",
      difficulty: "apply"
    },
    {
      id: "b-final",
      type: "callout",
      style: "warning",
      icon: "⏰",
      content: "**Before you submit:** Re-read your own answers. Did you show your work on every calculation? Did your Drive link actually work when you tested it in a private browser window? Exemplary work looks like a short physics lab report, not a fill-in-the-blank."
    }

  ]
};

async function seed() {
  try {
    await db.collection('courses').doc('physics')
      .collection('lessons').doc('energy-audit-extra-credit')
      .set(lesson);
    console.log('✅ Extra Credit Lesson seeded!');
    console.log('   Path: courses/physics/lessons/energy-audit-extra-credit');
    console.log('   Blocks:', lesson.blocks.length);
    console.log('   Order:', lesson.order);
    console.log('   Due:', lesson.dueDate);
    console.log('   Visible:', lesson.visible);
    console.log('   gradesReleased:', lesson.gradesReleased);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
