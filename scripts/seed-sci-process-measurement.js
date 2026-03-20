// seed-sci-process-measurement.js
// Creates "Measurement, Units, and Significant Figures" lesson (Unit 0: Scientific Process, Lesson 2)
// Run: node scripts/seed-sci-process-measurement.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Measurement, Units, and Significant Figures",
  questionOfTheDay: "If one person measures a table in inches and another in centimeters, how do you compare their results? What would happen if scientists used different units with no conversion standard?",
  course: "Physics",
  unit: "Scientific Process",
  order: 2,
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
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** In 1999, NASA lost a $125 million Mars orbiter because one team used metric units and another used imperial units — and no one caught the discrepancy until the spacecraft burned up entering Mars's atmosphere. What does this tell you about the importance of standardized units?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "How many different units can you think of for measuring length? List as many as you can (from tiny to huge).",
      placeholder: "Units for length: ...",
      difficulty: "recall"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Name the SI base units for length (m), mass (kg), and time (s)",
        "Convert units using dimensional analysis (factor-label method)",
        "Count significant figures in a measurement",
        "Distinguish precision from accuracy",
        "Calculate percent error"
      ]
    },

    // ═══════════════════════════════════════════
    // SI UNITS
    // ═══════════════════════════════════════════
    {
      id: "section-si-units",
      type: "section_header",
      icon: "📏",
      title: "The International System of Units (SI)",
      subtitle: "~10 minutes"
    },
    {
      id: "b-si-intro",
      type: "text",
      content: "Science uses the **International System of Units (SI)** — a standardized system based on powers of 10. Every country's scientists use SI so results can be compared worldwide.\n\n### Three Base Units You'll Use All Year\n\n| Quantity | SI Unit | Symbol |\n|---|---|---|\n| Length | Meter | m |\n| Mass | Kilogram | kg |\n| Time | Second | s |\n\n### SI Prefixes (Powers of 10)\n\n| Prefix | Symbol | Multiplier |\n|---|---|---|\n| kilo- | k | 1,000 (10³) |\n| centi- | c | 0.01 (10⁻²) |\n| milli- | m | 0.001 (10⁻³) |\n| micro- | μ | 0.000001 (10⁻⁶) |\n\n**Examples:** 1 km = 1000 m. 1 cm = 0.01 m. 1 ms = 0.001 s."
    },
    {
      id: "b-def-si",
      type: "definition",
      term: "SI Units",
      definition: "International System of Units — the standard measurement system used in science. Based on powers of 10. Core units: meter (m), kilogram (kg), second (s)."
    },

    // ═══════════════════════════════════════════
    // UNIT CONVERSION
    // ═══════════════════════════════════════════
    {
      id: "section-conversion",
      type: "section_header",
      icon: "🔄",
      title: "Unit Conversion: Dimensional Analysis",
      subtitle: "~15 minutes"
    },
    {
      id: "b-conversion-intro",
      type: "text",
      content: "**Dimensional analysis** (also called the factor-label method) is a systematic way to convert between units. You multiply by fractions equal to 1 (same quantity, different units) to cancel unwanted units.\n\n### The Method:\n\nStart with what you know. Multiply by a conversion fraction. Cancel units.\n\n**Example: Convert 65 mph to m/s**\n\n65 miles/hour × (1609 m / 1 mile) × (1 hour / 3600 s)\n\n= 65 × 1609 / 3600 m/s\n\n= **29.1 m/s**\n\n**How to check:** The units you don't want should cancel like fractions. If you end up with the right units, the algebra is correct."
    },
    {
      id: "b-conversion-examples",
      type: "text",
      content: "### Common Conversions\n\n| From → To | Conversion factor |\n|---|---|\n| km → m | × 1000 |\n| m → cm | × 100 |\n| hours → seconds | × 3600 |\n| miles → km | × 1.609 |\n| mph → m/s | × 0.447 |\n\n**Multi-step example: 100 cm → m → km**\n\n100 cm × (1 m / 100 cm) × (1 km / 1000 m) = 100/100,000 km = 0.001 km\n\n(Check: 100 cm = 1 m = 0.001 km ✓)"
    },
    {
      id: "embed-unit-converter",
      type: "iframe_embed",
      src: "https://www.physicsclassroom.com/Physics-Interactives/1-D-Kinematics/Conversion-Factor-Interactive/Conversion-Factor-Interactive",
      title: "Unit Conversion Trainer",
      height: 450
    },
    {
      id: "callout-tool-note",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Practice Tool:** Use this to practice unit conversions. The goal is to be able to do them by hand using dimensional analysis — the tool helps you check your work."
    },
    {
      id: "q-conversion-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Convert 65 mph to m/s using dimensional analysis. Show each conversion factor step.\n(1 mile = 1609 m, 1 hour = 3600 s)",
      placeholder: "65 miles/hr × (... / ...) × (... / ...) = ... m/s",
      difficulty: "apply"
    },
    {
      id: "q-conversion-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A car travels 500 km. How many meters is that?",
      options: [
        "0.5 m",
        "5,000 m",
        "50,000 m",
        "500,000 m"
      ],
      correctIndex: 3,
      explanation: "1 km = 1000 m, so 500 km × 1000 m/km = 500,000 m. When converting from larger to smaller units, you multiply.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SIGNIFICANT FIGURES
    // ═══════════════════════════════════════════
    {
      id: "section-sig-figs",
      type: "section_header",
      icon: "🔢",
      title: "Significant Figures",
      subtitle: "~10 minutes"
    },
    {
      id: "b-sig-figs-intro",
      type: "text",
      content: "**Significant figures** tell you how precise a measurement is. The number of sig figs reflects the reliability of the measuring instrument.\n\n### Rules for Counting Significant Figures:\n\n1. **Non-zero digits are always significant:** 123 → 3 sig figs\n2. **Zeros between non-zeros are significant:** 1003 → 4 sig figs\n3. **Trailing zeros with a decimal point are significant:** 12.30 → 4 sig figs\n4. **Leading zeros are NOT significant:** 0.0045 → 2 sig figs\n5. **Trailing zeros without a decimal point are ambiguous:** 1200 → 2, 3, or 4 sig figs (use scientific notation to be clear)\n\n### Examples:\n- 5.4 → 2 sig figs\n- 100.0 → 4 sig figs\n- 0.0023 → 2 sig figs\n- 4050 → ambiguous (3 or 4 sig figs)"
    },
    {
      id: "b-def-sig-figs",
      type: "definition",
      term: "Significant Figures",
      definition: "The digits in a measurement that carry meaningful information about its precision. More sig figs = more precise measurement."
    },
    {
      id: "q-sig-figs-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How many significant figures does 0.00340 have?",
      options: [
        "6",
        "5",
        "3",
        "2"
      ],
      correctIndex: 2,
      explanation: "Leading zeros (the 0.00 before 340) are NOT significant — they just show the decimal place. The trailing zero after 34 IS significant (it was written deliberately). So 3, 4, and 0 are significant → 3 sig figs.",
      difficulty: "apply"
    },
    {
      id: "q-sig-figs-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A ruler reads 12.4 cm. How many significant figures does this measurement have?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      explanation: "12.4 has three significant figures: 1, 2, and 4. All three non-zero digits are significant. This means the measurement is precise to the tenths place — the ruler can read to 0.1 cm.",
      difficulty: "apply"
    },
    {
      id: "q-sig-figs-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which measurement is most precise?",
      options: [
        "12 m",
        "12.0 m",
        "12.00 m",
        "1200 m"
      ],
      correctIndex: 2,
      explanation: "12.00 m has 4 sig figs — it tells you the value is known to the hundredths place. 12 m only has 2 sig figs. More sig figs = more precise. The trailing zeros in 12.00 are meaningful — someone measured to centimeter precision.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // PRECISION VS ACCURACY
    // ═══════════════════════════════════════════
    {
      id: "section-precision-accuracy",
      type: "section_header",
      icon: "🎯",
      title: "Precision vs. Accuracy",
      subtitle: "~5 minutes"
    },
    {
      id: "b-prec-acc",
      type: "text",
      content: "**Accuracy:** How close a measurement is to the true (accepted) value.\n\n**Precision:** How consistent repeated measurements are (how close they are to each other).\n\nThink of a dartboard:\n- **Accurate but not precise:** Darts scattered around the bullseye — sometimes close, sometimes far\n- **Precise but not accurate:** Darts clustered together but away from the bullseye\n- **Both:** Darts clustered ON the bullseye\n- **Neither:** Darts scattered everywhere\n\n### Percent Error (measuring accuracy):\n\n**% error = |measured − accepted| / accepted × 100%**\n\nExample: You measure g = 9.3 m/s². Accepted = 9.8 m/s².\n% error = |9.3 − 9.8| / 9.8 × 100% = 0.5/9.8 × 100% ≈ 5.1%"
    },
    {
      id: "q-prec-acc",
      type: "question",
      questionType: "short_answer",
      prompt: "A student measures the density of aluminum 5 times: 2.7, 2.7, 2.6, 2.7, 2.6 g/cm³. The accepted value is 2.7 g/cm³.\n(a) Are the measurements precise? (b) Are they accurate? (c) Calculate the percent error for a measurement of 2.6 g/cm³.",
      placeholder: "(a) Precise? ... because ... (b) Accurate? ... because ... (c) % error = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "Today's key takeaways:\n\n- **SI units:** meter (m), kilogram (kg), second (s) — standard units for science worldwide\n- **Dimensional analysis:** multiply by conversion fractions to cancel units\n- **Significant figures:** reflect measurement precision; more sig figs = more precise\n- **Precision vs. accuracy:** precision = consistency; accuracy = closeness to true value\n- **Percent error** = |measured − accepted| / accepted × 100%\n\n**Next up:** CER Framework — how to write up what your data means."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A ruler reads 12.4 cm. (a) How many significant figures? (b) What does the number of sig figs tell you about the ruler's precision? (c) If the 'true' length is 12.0 cm, what is the percent error?",
      placeholder: "(a) Sig figs: ... (b) This tells me the ruler... (c) % error = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Vocabulary",
      subtitle: ""
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "SI Units", definition: "International System of Units. Meter (length), kilogram (mass), second (time). Used universally in science." },
        { term: "Dimensional Analysis", definition: "A method for unit conversion using conversion fractions. Units cancel like algebraic variables." },
        { term: "Significant Figures (sig figs)", definition: "Digits in a measurement that carry meaningful precision. Non-zero digits, zeros between non-zeros, and trailing zeros after a decimal point are significant." },
        { term: "Accuracy", definition: "How close a measurement is to the true (accepted) value." },
        { term: "Precision", definition: "How consistent repeated measurements are with each other. Independent of whether they are close to the true value." },
        { term: "Percent Error", definition: "|measured − accepted| / accepted × 100%. Measures how far off a measurement is from the accepted value." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("sci-process-measurement")
      .set(lesson);
    console.log('✅ Lesson "Measurement, Units, and Significant Figures" seeded successfully!');
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   📘 Course: ${lesson.course}`);
    console.log(`   📂 Unit: ${lesson.unit}`);
    console.log(`   🔢 Order: ${lesson.order}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
