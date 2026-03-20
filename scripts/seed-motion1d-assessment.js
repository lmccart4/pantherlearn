// seed-motion1d-assessment.js
// Creates "Unit 2 Assessment: Motion in 1D" lesson (Unit 2: Motion in 1D, Lesson 8)
// Run: node scripts/seed-motion1d-assessment.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Unit 2 Assessment: Motion in 1D",
  questionOfTheDay: "Looking back at Unit 2 — which concept took the longest to click: position vs. displacement, reading graphs, or free fall? What finally made it make sense?",
  course: "Physics",
  unit: "Motion in 1D",
  order: 8,
  isAssessment: true,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🏃",
      title: "Warm Up",
      subtitle: "~3 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Looking back at Unit 2 — which concept took the longest to click: position vs. displacement, reading graphs, or free fall? What finally made it make sense?"
    },

    // ═══════════════════════════════════════════
    // REVIEW SECTION
    // ═══════════════════════════════════════════
    {
      id: "section-review",
      type: "section_header",
      icon: "📚",
      title: "Review Section",
      subtitle: "Open notes"
    },
    {
      id: "callout-review-instructions",
      type: "callout",
      style: "insight",
      icon: "📋",
      content: "**Review Section:** Use your notes. Work through these to find any gaps before the assessment."
    },
    {
      id: "b-review-summary",
      type: "text",
      content: "### Unit 2 Key Concepts\n\n**Definitions:**\n- Position (x): where you are relative to the origin\n- Displacement (Δx): change in position (final − initial); can be negative\n- Distance: total path length; always positive\n- Speed: distance / time (scalar); always positive\n- Velocity: displacement / time (vector); has direction\n- Acceleration: change in velocity / time\n\n**P-T Graphs:** slope = velocity\n- Flat = stationary; positive slope = moving away; negative = moving back; steeper = faster\n\n**V-T Graphs:** slope = acceleration, area = displacement\n- Flat = constant velocity; rising = speeding up; falling = slowing down or negative direction\n\n**Motion Diagrams:** dots + arrows at equal intervals\n- Wide spacing = fast; close = slow; changing spacing = acceleration\n\n**Free Fall:**\n- g = 9.8 m/s² (use 10 for estimation)\n- v = gt; d = ½gt² (starting from rest)\n- All objects fall with same acceleration in vacuum"
    },
    {
      id: "q-review-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Quick Check: A runner starts at x = 3 m, runs to x = 15 m, then returns to x = 7 m.\n(a) What is the displacement?\n(b) What is the total distance?\n(c) If the whole trip takes 10 seconds, what is average velocity? Average speed?",
      placeholder: "(a) Δx = ... (b) distance = ... (c) avg velocity = ... avg speed = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // ASSESSMENT SECTION
    // ═══════════════════════════════════════════
    {
      id: "section-assessment",
      type: "section_header",
      icon: "📝",
      title: "Assessment Section",
      subtitle: "Try without notes"
    },
    {
      id: "callout-assessment-instructions",
      type: "callout",
      style: "warning",
      icon: "🚨",
      content: "**Assessment Section:** Challenge yourself to complete these without notes. Same format as the unit test."
    },
    {
      id: "q-mc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A p-t graph shows a straight line going from (0 s, 4 m) to (6 s, 4 m). What is the object's velocity?",
      options: [
        "4 m/s",
        "0.67 m/s",
        "0 m/s — the object is stationary",
        "Cannot be determined"
      ],
      correctIndex: 2,
      explanation: "A flat horizontal line on a p-t graph means the object doesn't change position — it stays at 4 m for 6 seconds. Velocity = slope = 0. The object is stationary.",
      difficulty: "apply"
    },
    {
      id: "q-mc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A v-t graph shows a line going from (0 s, 0 m/s) to (4 s, 8 m/s). What is the acceleration?",
      options: [
        "0.5 m/s²",
        "2 m/s²",
        "8 m/s²",
        "32 m/s²"
      ],
      correctIndex: 1,
      explanation: "Acceleration = slope of v-t graph = Δv/Δt = (8-0)/(4-0) = 8/4 = 2 m/s².",
      difficulty: "apply"
    },
    {
      id: "q-mc-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A v-t graph shows a flat line at v = 6 m/s for 5 seconds. What is the displacement?",
      options: [
        "1.2 m",
        "6 m",
        "30 m",
        "11 m"
      ],
      correctIndex: 2,
      explanation: "Displacement = area under v-t graph = v × t = 6 m/s × 5 s = 30 m. (Area of a rectangle = height × width = velocity × time.)",
      difficulty: "apply"
    },
    {
      id: "q-mc-4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which best describes a motion diagram with dots that are getting farther and farther apart?",
      options: [
        "Object moving at constant speed",
        "Object decelerating",
        "Object accelerating",
        "Object changing direction"
      ],
      correctIndex: 2,
      explanation: "Increasing dot spacing means more distance is covered each time interval — the object is moving faster over time. This is acceleration.",
      difficulty: "understand"
    },
    {
      id: "q-mc-5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An object is dropped in a vacuum. After falling for 2 seconds, it passes a sensor. How fast is it moving? (g = 10 m/s²)",
      options: [
        "5 m/s",
        "10 m/s",
        "20 m/s",
        "40 m/s"
      ],
      correctIndex: 2,
      explanation: "v = gt = 10 × 2 = 20 m/s. In free fall from rest, speed increases by 10 m/s every second.",
      difficulty: "apply"
    },
    {
      id: "q-multipart-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A p-t graph has these segments:\n- (0-3 s): position rises from 0 to 9 m\n- (3-7 s): position stays flat at 9 m\n- (7-10 s): position drops from 9 m to 0 m\n\n(a) What is velocity in each segment?\n(b) Describe the motion in words.\n(c) Sketch/describe what the v-t graph looks like for this motion.",
      placeholder: "(a) v1 = ... v2 = ... v3 = ... (b) In words: ... (c) v-t graph: ...",
      difficulty: "analyze"
    },
    {
      id: "q-synthesis",
      type: "question",
      questionType: "short_answer",
      prompt: "Three representations — same motion:\n\nA v-t graph shows: starts at 0, rises to 10 m/s in 5 s (straight line), stays flat at 10 m/s for 5 s, drops to 0 m/s in 3 s.\n\n(a) Describe this motion in words.\n(b) Calculate total displacement (find area under v-t graph in each phase).\n(c) Draw/describe the corresponding motion diagram.",
      placeholder: "(a) Words: ... (b) Phase 1 d = ... Phase 2 d = ... Phase 3 d = ... Total = ... (c) Motion diagram: ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // WRAP UP / REFLECTION
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Reflection",
      subtitle: "~3 minutes"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Unit 2 Self-Assessment: Which concept do you feel most confident about now? Which is still the haziest? What would help you understand it better?",
      placeholder: "Most confident: ... Still unsure about: ... What would help: ...",
      difficulty: "recall"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion1d-assessment")
      .set(lesson);
    console.log('✅ Lesson "Unit 2 Assessment: Motion in 1D" seeded successfully!');
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   📘 Course: ${lesson.course}`);
    console.log(`   📂 Unit: ${lesson.unit}`);
    console.log(`   🔢 Order: ${lesson.order}`);
    console.log(`   📊 isAssessment: ${lesson.isAssessment}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
