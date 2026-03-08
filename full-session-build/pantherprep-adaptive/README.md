# PantherPrep Adaptive Engine

A complete adaptive learning system for PantherPrep that tracks student performance, classifies error patterns, computes skill mastery using a modified SM-2 spaced repetition algorithm, and generates personalized practice recommendations.

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        EXISTING MODULES                              │
│  PSAT Math │ PSAT R&W │ SAT Math │ SAT R&W │ PSAT 8/9              │
│  (React SPAs with localStorage tracking)                             │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ adaptiveBridge.recordAnswer()
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    ADAPTIVE BRIDGE (adaptiveBridge.js)                │
│  • Buffers answers during session                                    │
│  • Maps module error codes → error categories                        │
│  • Tracks time per question                                          │
│  • Flushes to Firestore on session complete                          │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ logAnswerBatch()
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                 PERFORMANCE SERVICE (performanceService.js)           │
│  Firestore CRUD for:                                                 │
│  • performanceLog/{uid}/answers/{id}  — granular answer log          │
│  • adaptiveProfile/{uid}              — computed mastery state        │
│  • questionPool/{id}                  — normalized question bank      │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ recomputeProfile()
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  ADAPTIVE ENGINE (adaptiveEngine.js)                  │
│  • Time-decayed mastery calculation (exponential halflife: 14 days)   │
│  • SM-2 ease factor with error-pattern penalties                     │
│  • Spaced repetition interval scheduling                             │
│  • Priority-scored recommendation generation                         │
│  • Adaptive practice set generation                                  │
│  • Weekly stats & streak calculation                                 │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
┌─────────────────────┐ ┌─────────────────────┐
│ STUDENT DASHBOARD   │ │ TEACHER DASHBOARD   │
│ • Mastery heat map  │ │ • Class overview     │
│ • Skill breakdown   │ │ • Per-student drill  │
│ • SM-2 schedule     │ │ • Intervention alerts│
│ • Recommendations   │ │ • Skill heatmap      │
│ • Practice launcher │ │ • Error patterns     │
│ • Answer history    │ │ • Question analysis  │
└─────────────────────┘ └─────────────────────┘
```

## File Structure

```
pantherprep-adaptive/
├── SCHEMA.md                          # Firestore data model documentation
├── README.md                          # This file
├── firestore.rules                    # Security rules for new collections
├── firestore.indexes.json             # Required composite indexes
└── src/
    ├── services/
    │   ├── performanceService.js      # Firestore CRUD layer
    │   └── adaptiveEngine.js          # Core adaptive logic (SM-2, recommendations)
    ├── hooks/
    │   └── useAdaptive.js             # React hooks for consuming adaptive data
    ├── components/
    │   ├── StudentDashboard.jsx       # Student-facing dashboard
    │   └── TeacherDashboard.jsx       # Teacher-facing dashboard
    └── utils/
        └── adaptiveBridge.js          # Drop-in integration for existing modules
```

## Integration Guide

### Step 1: Copy files into your PantherPrep project

```bash
cp -r src/services/* /path/to/pantherprep/src/services/
cp -r src/hooks/* /path/to/pantherprep/src/hooks/
cp -r src/components/* /path/to/pantherprep/src/components/
cp -r src/utils/* /path/to/pantherprep/src/utils/
```

### Step 2: Deploy Firestore indexes

```bash
firebase deploy --only firestore:indexes
```

### Step 3: Update Firestore security rules

Merge the rules from `firestore.rules` into your existing rules file,
then deploy:

```bash
firebase deploy --only firestore:rules
```

### Step 4: Integrate with existing modules

In any PantherPrep module that tracks answers, add the bridge:

```javascript
import adaptiveBridge from './utils/adaptiveBridge';
import { mapSkill } from './utils/adaptiveBridge';

// When module loads and user is authenticated:
adaptiveBridge.init(uid, 'psat_nmsqt_math', 'psat_nmsqt_math_7');

// When a question is displayed:
adaptiveBridge.startQuestion();

// When student answers:
adaptiveBridge.recordAnswer({
  questionId: 'q14',
  domain: 'Advanced Math',
  skill: mapSkill('quadratic'),  // → 'quadratic_equations'
  difficulty: 'M',
  correct: false,
  selectedAnswer: 'B',
  correctAnswer: 'C',
  errorCode: 'SIGN_ERROR',       // Optional: module-specific code
  // errorCategory auto-inferred from errorCode if not provided
});

// When module is complete:
const result = await adaptiveBridge.finishSession();
console.log(`Saved ${result.answerCount} answers, profile updated`);
```

### Step 5: Add dashboards to your app

```jsx
// In your React router or page component:
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

// Student view
<StudentDashboard uid={currentUser.uid} course="psat_nmsqt_math" />

// Teacher view
<TeacherDashboard course="psat_nmsqt_math" />
```

## How the Adaptive Algorithm Works

### Mastery Calculation

Each skill's mastery score is a **time-decayed weighted average**:

- Recent answers count more than old ones (halflife = 14 days)
- Harder questions (Challenge) are weighted 1.4x; Foundation questions 0.7x
- Requires at least 3 answers before computing mastery

### SM-2 Spaced Repetition

Each skill tracks an **ease factor** (1.3–2.5) and **review interval**:

- Ease increases when student answers correctly, decreases on errors
- Error *category* matters: content gaps hurt ease more than careless errors
- Interval resets to 1 day on failure, grows exponentially on success
- Next review date is calculated from the interval

### Recommendation Priority

Skills are ranked by a composite priority score (0–100):

| Factor | Weight | Description |
|--------|--------|-------------|
| Low mastery | 0–40 pts | Lower mastery = higher priority |
| Overdue review | 0–25 pts | Past next review date |
| Error severity | 0–20 pts | Content gaps weighted more than careless |
| Insufficient data | 0–15 pts | Skills with < 3 answers |

### Adaptive Practice Sets

When a student launches adaptive practice:

1. Top recommendations get the most questions
2. Difficulty is set based on current mastery (< 30% → Foundation, > 70% → Challenge)
3. Strong skills get 2-3 review questions mixed in
4. Final set is shuffled so same-skill questions aren't adjacent

## Error Category Taxonomy

| Category | Description | SM-2 Penalty |
|----------|-------------|-------------|
| Content Gap | Doesn't know the concept | -0.25 per occurrence |
| Strategy Gap | Used wrong approach | -0.20 |
| Misread/Trap | Fell for a distractor | -0.15 |
| Time Pressure | Rushed or ran out of time | -0.10 |
| Careless | Knew it, made a mistake | -0.05 |

## Teacher Dashboard Features

- **Class Overview**: Aggregate stats, domain performance, weekly trends
- **Student List**: Sortable by name, mastery, activity, or streak
- **Student Drill-Down**: Full per-student profile with domain breakdown, error patterns, and recommendations
- **Intervention Alerts**: Automatic flags for low mastery, declining performance, inactivity, and high content-gap errors
- **Skill Heatmap**: Class-wide mastery visualization per skill, highlighting where the whole class is struggling

## Cost Estimate

All new collections operate within Firestore's free tier for typical class sizes:

| Operation | Per-Student/Session | Class of 30/day | Monthly |
|-----------|-------------------|-----------------|---------|
| Answer writes | ~15 per session | ~450 | ~9,000 |
| Profile writes | 1 per session | ~30 | ~600 |
| Profile reads (dashboard) | ~5 per day | ~150 | ~3,000 |
| **Total** | | | **~12,600 ops** |

Free tier: 50,000 reads/day + 20,000 writes/day. You're well under.
