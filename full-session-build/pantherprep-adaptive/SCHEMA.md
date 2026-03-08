# PantherPrep Adaptive Engine — Firestore Schema

## Overview

The adaptive engine layers on top of PantherPrep's existing Firestore collections
(`students`, `sessions`, `questionStats`) by adding normalized performance tracking,
error pattern classification, and spaced-repetition scheduling.

---

## Existing Collections (unchanged)

### `students/{uid}`
```
{
  name: string,
  email: string,
  totalQ: number,
  totalCorrect: number,
  sessions: number,
  domains: {
    "practice|Algebra": { correct: number, total: number },
    "practice|Problem Solving": { correct: number, total: number },
    ...
  },
  lastActive: Timestamp
}
```

### `sessions/{sessionId}`
```
{
  uid: string,
  name: string,
  email: string,
  test: string,         // e.g. "psat89_math", "sat_rw"
  domain: string,
  correct: number,
  total: number,
  pct: number,
  type: "practice",
  ts: Timestamp,
  dateStr: string
}
```

### `questionStats/{questionId}`
```
{
  attempts: number,
  correct: number
}
```

---

## New Collections

### `performanceLog/{uid}/answers/{answerId}`

Granular per-answer log — the raw feed for all adaptive logic.

```
{
  uid: string,
  questionId: string,
  moduleId: string,          // e.g. "psat_nmsqt_rw_3", "sat_math_7"
  course: string,            // "psat89_math" | "psat89_rw" | "psat_nmsqt_rw" | "psat_nmsqt_math" | "sat_rw" | "sat_math"
  domain: string,            // "Algebra" | "Geometry" | "Information & Ideas" | etc.
  skill: string,             // fine-grained: "linear_equations" | "quadratic_formula" | "transitions" | etc.
  difficulty: "F" | "M" | "C",  // Foundation / Medium / Challenge
  correct: boolean,
  selectedAnswer: string,    // what the student chose
  correctAnswer: string,     // what was right
  errorCode: string | null,  // "SIGN_ERROR" | "WRONG_METHOD" | "MISREAD" | "TRAP" | "TIME_PRESSURE" | null
  errorCategory: string | null, // "content_gap" | "careless" | "time_pressure" | "misread_trap" | "strategy_gap"
  timeSpent: number,         // seconds on this question
  timestamp: Timestamp,
  sessionId: string          // links back to sessions collection
}
```

### `adaptiveProfile/{uid}`

Computed adaptive state per student — updated after each session.

```
{
  uid: string,
  lastUpdated: Timestamp,
  
  // Overall stats
  totalAnswers: number,
  totalCorrect: number,
  streakDays: number,
  lastActiveDate: string,    // "2026-03-05"
  
  // Per-skill mastery (SM-2 inspired)
  skills: {
    "linear_equations": {
      correct: number,
      total: number,
      mastery: number,        // 0.0 - 1.0 (weighted recent performance)
      ease: number,           // SM-2 ease factor (1.3 - 2.5)
      interval: number,       // days until next review
      nextReview: string,     // ISO date
      lastSeen: Timestamp,
      errorPatterns: {        // counts by error category
        "content_gap": number,
        "careless": number,
        "time_pressure": number,
        "misread_trap": number,
        "strategy_gap": number
      }
    },
    ...
  },
  
  // Per-domain rollup
  domains: {
    "Algebra": {
      mastery: number,
      totalCorrect: number,
      totalAnswers: number,
      weakestSkills: string[],   // top 3 skill keys needing work
      strongestSkills: string[]  // top 3 mastered skills
    },
    ...
  },
  
  // Recommendations queue (pre-computed)
  recommendations: [
    {
      skill: string,
      domain: string,
      reason: string,          // "Low mastery (32%)" | "Due for review" | "High error rate on traps"
      priority: number,        // 1 = highest
      suggestedDifficulty: "F" | "M" | "C",
      questionCount: number    // how many to serve
    }
  ],
  
  // Weekly summary for teacher dashboard
  weeklyStats: {
    answersThisWeek: number,
    correctThisWeek: number,
    sessionsThisWeek: number,
    dominantErrorCategory: string | null,
    improvingDomains: string[],
    decliningDomains: string[]
  }
}
```

### `questionPool/{questionId}`

Normalized question bank for adaptive practice generation.

```
{
  id: string,
  course: string,
  moduleId: string,
  domain: string,
  skill: string,
  difficulty: "F" | "M" | "C",
  questionText: string,
  choices: [
    { key: "A", text: string },
    { key: "B", text: string },
    { key: "C", text: string },
    { key: "D", text: string }
  ],
  correctAnswer: string,
  explanation: string,
  trapType: string | null,    // "attractive_distractor" | "partial_answer" | "scope_shift" | "reversal" | null
  tags: string[],
  katex: boolean              // whether question needs KaTeX rendering
}
```

---

## Skill Taxonomy

### Math Skills
| Domain | Skills |
|--------|--------|
| Algebra | `linear_equations`, `linear_inequalities`, `systems_of_equations`, `linear_functions`, `absolute_value` |
| Advanced Math | `quadratic_equations`, `quadratic_formula`, `polynomial_operations`, `exponential_functions`, `radical_equations`, `rational_expressions` |
| Problem Solving & Data | `ratios_rates`, `percentages`, `unit_conversion`, `scatterplots`, `linear_regression`, `probability`, `statistics_central_tendency`, `statistics_spread`, `two_way_tables`, `expected_value` |
| Geometry & Trig | `area_perimeter`, `volume`, `triangles`, `circles`, `coordinate_geometry`, `right_triangle_trig`, `unit_circle` |

### R&W Skills
| Domain | Skills |
|--------|--------|
| Information & Ideas | `central_ideas`, `details_evidence`, `inferences`, `quantitative_evidence`, `text_structure` |
| Craft & Structure | `vocabulary_in_context`, `purpose_function`, `cross_text_connections`, `point_of_view` |
| Expression of Ideas | `transitions`, `rhetorical_synthesis`, `organization` |
| Standard English Conventions | `subject_verb_agreement`, `pronoun_clarity`, `modifiers`, `parallelism`, `verb_tense`, `punctuation_boundaries`, `comma_usage`, `colon_usage`, `possessives` |

---

## Error Category Taxonomy

| Category | Code | Description | Example |
|----------|------|-------------|---------|
| Content Gap | `content_gap` | Student doesn't know the concept | Can't factor, doesn't know comma rules |
| Careless Error | `careless` | Knew it but made a mistake | Sign error, miscopied, skipped a step |
| Time Pressure | `time_pressure` | Ran out of time or rushed | Guessed on last 3, spent too long on one |
| Misread / Trap | `misread_trap` | Fell for a distractor or misread the question | Chose "most" when question said "least" |
| Strategy Gap | `strategy_gap` | Used wrong approach | Tried to solve algebraically when plugging in was faster |

---

## Index Requirements

```
// For loading a student's recent answers
performanceLog/{uid}/answers — composite index: (timestamp DESC)

// For adaptive practice generation
questionPool — composite index: (course, domain, skill, difficulty)

// For teacher dashboard — class-wide queries
adaptiveProfile — composite index: (lastActiveDate DESC)
```
