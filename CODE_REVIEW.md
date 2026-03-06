# PantherLearn — Comprehensive Code Review & Improvement Roadmap

**Date:** March 6, 2026
**Scope:** Every file in the repository (~150+ source files)
**Reviewed by:** Automated deep code review across 6 parallel analysis passes

---

## Executive Summary

PantherLearn is an ambitious gamified learning platform built with React 19 + Firebase. It has impressive breadth — lesson viewing, grading, gamification (XP, mana, boss battles, leaderboards), chatbot workshops, bias detective activities, space rescue missions, and more. However, the rapid feature growth has introduced significant **security vulnerabilities**, **performance bottlenecks**, **architectural debt**, and **accessibility gaps** that should be addressed before scaling to more users.

**By the numbers:**
- **12 Critical** findings (security holes that could be exploited today)
- **22 High** findings (data integrity, performance, lost student work)
- **25 Medium** findings (code quality, maintainability, minor security)
- **30+ Low** findings (accessibility, polish, dead code)

---

## Big Project Ideas (Prioritized)

### Project 1: Security Hardening (CRITICAL — Do First)

**Estimated scope: Large**

This is the most urgent work. Multiple vulnerabilities could allow data exfiltration, privilege escalation, or financial abuse.

#### 1a. Fix Firestore Security Rules
- **Role self-escalation**: Users can set their own `role` field to `"teacher"` because `/users/{uid}` allows `write: if isOwner(uid)` with no field restrictions. A student can self-promote and access all teacher features.
- **Teachers can write ANY user's document**: `allow write: if isOwner(uid) || isTeacher()` lets any teacher overwrite any user's profile, including other teachers.
- **All courses readable by all users**: Any logged-in user can enumerate all course metadata, leaking enrollment codes.
- **Legacy paths too permissive**: `gamification/{uid}`, `progress/{uid}/**`, `chatLogs/{uid}/**` grant teacher write access without course membership checks.
- **Bot projects/conversations readable by all**: Any authenticated user can read all student bot projects system-wide.

**Fix:** Add field-level write restrictions (prevent `role` modification by non-admins), scope teacher writes to their own courses via `isCourseTeacher()`, and restrict reads with enrollment checks.

#### 1b. Authenticate All Cloud Function Endpoints
- **`geminiProxy` has ZERO authentication**: Anyone who discovers the URL can make unlimited Gemini API calls at your expense. The code explicitly comments "No login needed."
- **Translation endpoint has no auth header**: The `translate` cloud function can be called without a Firebase ID token.
- **All Cloud Functions use `cors: true`** (wildcard): Requests from any origin are accepted. Should be restricted to your actual domains.

**Fix:** Add `verifyIdToken` to all endpoints, restrict CORS to `pantherlearn.web.app` and `pantherlearn.firebaseapp.com`.

#### 1c. Remove Dangerous Seed Script Pattern
- `seed-dl-week3.js` **deploys fully open Firestore rules to production** (`allow read, write: if true`), seeds data, then restores originals. If the script crashes mid-run, the entire database stays permanently world-readable/writable.

**Fix:** Use Firebase Admin SDK (which bypasses rules server-side) like the other seed scripts already do.

#### 1d. Sanitize All `dangerouslySetInnerHTML` Usage
- 5 components (`TextBlock`, `ActivityBlock`, `CalloutBlock`, `ExternalLinkBlock`, `ChatLogCard`) inject `renderMarkdown()` output via `dangerouslySetInnerHTML` without sanitization. This is a stored XSS vector — any content in Firestore could execute scripts in every student's browser.

**Fix:** Add DOMPurify to `renderMarkdown()` in `utils.jsx`. Single change fixes all 5 files.

#### 1e. Fix Prompt Injection Risk
- `validateReflection` cloud function inserts student text directly into Gemini prompts. Sophisticated prompt injection could trick the model into approving gibberish reflections.

**Fix:** Use structured input/output (JSON schema) and validate the model's response independently.

#### 1f. Fix Guess Who Secret Leakage
- Both players' secret character IDs are stored in the same Firestore document. Either player can read the opponent's secret via browser dev tools.

**Fix:** Store secrets in player-specific subcollections with per-player read rules.

---

### Project 2: Performance & Scalability Overhaul (HIGH)

**Estimated scope: Large**

Multiple pages make unbounded Firestore reads that won't scale past a small class.

#### 2a. Eliminate Full-Collection Reads
These queries fetch the ENTIRE collection, then filter client-side:
| Location | What it fetches |
|----------|----------------|
| `RosterSync.jsx`, `StudentProgress.jsx`, `StudentAnalytics.jsx`, `TeamManager.jsx`, `TeamPanel.jsx` | `getDocs(collection(db, "users"))` — ALL user documents |
| `RosterSync.jsx`, `StudentProgress.jsx`, `TeamManager.jsx`, `StudentAnalytics.jsx` | `getDocs(collection(db, "enrollments"))` — ALL enrollments |
| `gamification.jsx:getLeaderboard` | ALL users + ALL gamification docs |
| `enrollment.jsx:findCourseByEnrollCode` (fallback) | ALL courses |

**Fix:** Add `where` clauses to scope queries, move aggregation to Cloud Functions, and paginate results.

#### 2b. Fix N+1 Query Patterns
- **StudentAnalytics.jsx**: ~1,080 individual Firestore reads per page load (student × lesson × day)
- **GradingDashboard.jsx**: Sequential `getDoc` per enrolled student + nested loops for chat logs
- **All 6 activity review components**: Sequential loops through every student × course for grades
- **MessageCenter.jsx**: Sequential user profile fetches per enrolled student
- **`computeEngagementScores` Cloud Function**: 7 reads per student per course (7,000 reads for 200 students × 5 courses)

**Fix:** Use `Promise.all` for parallelization, batch reads with `where("__name__", "in", batch)`, and restructure data for efficient queries.

#### 2c. Fix Write-on-Read Antipatterns
- **Leaderboard.jsx** writes snapshot data back to Firestore on every render/view, meaning every student viewing the leaderboard triggers a write.
- **BiasInvestigation.jsx** calls `save()` to Firestore on every keystroke without debouncing.

**Fix:** Move leaderboard aggregation to a Cloud Function triggered on score changes. Debounce save calls (300-500ms).

#### 2d. Fix Batch Write Bug
- `computeEngagementScores` Cloud Function reuses a committed `WriteBatch` object after calling `batch.commit()`. Must create a new batch after each commit.

#### 2e. Move Images to Firebase Storage
- `WeeklyEvidence.jsx` and `EvidenceUploadBlock.jsx` store base64 images directly in Firestore documents (1MB limit). This causes silent data loss for large photos.

**Fix:** Upload to Firebase Storage, store download URLs in Firestore.

---

### Project 3: Authentication & Authorization Architecture (HIGH)

**Estimated scope: Medium**

#### 3a. Move Role Assignment Server-Side
- `useAuth.jsx` determines student vs. teacher role by counting digits in the email prefix. This is client-side only with no server verification. Anyone with an atypical email could be misclassified.

**Fix:** Use Firebase Custom Claims set via Admin SDK in a Cloud Function. Client reads claims from the ID token.

#### 3b. Add Race Condition Protection
- `awardXP()`, `awardMana()`, `spendMana()`, `castVote()` all use read-then-write without transactions. Concurrent requests cause lost updates (double XP, mana overspend).

**Fix:** Use `runTransaction()` (already done correctly in `bossBattle.jsx` — extend that pattern).

#### 3c. Add Rate Limiting to Enrollment
- `enrollWithCode` has no rate limiting. Code space is only ~810,000 combinations per prefix, making brute-force feasible.

**Fix:** Add server-side rate limiting via Cloud Function.

---

### Project 4: Fix Lost Student Work (HIGH)

**Estimated scope: Small-Medium**

#### 4a. SortingBlock Never Persists Results
- `SortingBlock.jsx` receives `onAnswer` prop but never calls it. Student sorting work is lost on refresh.

#### 4b. ChecklistBlock State Not Persisted
- `ChecklistBlock.jsx` uses only local `useState`. Refreshing loses all checkbox progress.

#### 4c. Auto-Save Error Handling
- `useAutoSave` resets deltas before confirming Firestore write success. If the write fails, data is permanently lost.
- The `beforeunload` handler calls an async save function synchronously — writes may be silently dropped.

**Fix:** Wire up `onAnswer` callbacks, only reset deltas after confirmed writes.

---

### Project 5: Component Architecture Refactor (MEDIUM)

**Estimated scope: Large**

#### 5a. Extract Shared Grading Utilities
The identical `GRADE_TIERS` array and `handleGrade` function are copy-pasted across **8 files** (`WrittenResponseCard`, `WeeklyEvidenceTab`, `BiasDetectiveReview`, `AITrainingSimReview`, `DataLabelingReview`, `SpaceRescueReview`, `PromptDuelReview`, `EthicsCourtReview`). Any change requires updating all 8 in lockstep.

**Fix:** Extract to `lib/grading.js` — eliminates ~400 lines of duplication.

#### 5b. Break Up God Components
| Component | Lines | Responsibility Count |
|-----------|-------|---------------------|
| `ClassChat.jsx` | ~750 | Messages, sending, typing, scroll, reactions, threading, UI |
| `RocketStagingChallenge.jsx` | ~994 | 15+ useState calls, physics, SVG, mission logic |
| `LessonEditor.jsx` | ~1000+ | All block editors, sidebar, JSON import, AI, duplication |
| `StudentAnalytics.jsx` | ~1012 | Data fetching, charts, tables, all in one |
| `StudentProgress.jsx` | ~1600 | All users + enrollments + progress in one component |

**Fix:** Extract sub-components, move data fetching into custom hooks, use reducers for complex state.

#### 5c. Consolidate Duplicate Infrastructure
- `useEngagementTimer` and `useTelemetry` independently register the same window event listeners (`mousemove`, `keydown`, `scroll`, `touchstart`, `click`, `visibilitychange`), run independent 1-second intervals, and independently track idle state. That's 10+ redundant listeners and 2 redundant intervals.
- `heroBody()` helper is copy-pasted in 4 pixel art files.
- Two separate `ErrorBoundary` components exist (neither reports to an external service).
- Two independent `cosineSimilarity` implementations.

#### 5d. Extract Styles from Inline to CSS
Nearly every component uses extensive inline `style={{...}}` objects recreated every render. The project already has CSS files proving the build system supports them. Extract to CSS modules or shared style constants.

---

### Project 6: Context Provider Performance (MEDIUM)

**Estimated scope: Small**

#### 6a. Memoize All Context Provider Values
`PreviewContext`, `TelemetryContext`, and `TranslationContext` all create new `value` objects on every render, causing all consumers to re-render unnecessarily.

**Fix:** Wrap `value` in `useMemo` with appropriate dependencies.

#### 6b. Fix Engagement Timer Re-renders
`useEngagementTimer` calls `setSeconds()` every 1 second, forcing a component re-render every second. Consider coarser updates (every 5-10 seconds) or exposing via ref.

#### 6c. Fix Stale `isActive` Return
`useEngagementTimer` returns `activeRef.current` as a plain value — it never triggers re-renders when activity status changes, giving consumers stale data.

---

### Project 7: Error Handling & Resilience (MEDIUM)

**Estimated scope: Medium**

#### 7a. Prevent Login Hanging
- `syncUserProfile` has zero try/catch. If Firestore is unreachable during login, `setLoading(false)` is never reached, leaving the app in a permanent loading state.
- `autoLinkEnrollments` failure can similarly block login completion.

#### 7b. Add User-Facing Error States
Almost every `catch` block across the codebase only calls `console.error()`. No error reporting service (Sentry, etc.), no user-visible toast/notification. Students and teachers get no feedback when operations fail.

#### 7c. Add Error Boundaries Around Lazy Imports
`ActivitiesTab.jsx` uses `React.lazy` with `Suspense` but no error boundary. Network failures crash the entire grading page. Similarly, floating widgets in `App.jsx` lack individual error boundaries.

#### 7d. Fix Cloud Function Silent Failures
- Rate limit bypass on failure: if the rate-limiting transaction fails, the code logs a warning and **proceeds anyway**, effectively disabling rate limits under Firestore stress.
- `validateReflection` auto-approves on error, silently passing all reflections when the API is down.
- `generateBaselines` uses `process.env` for secrets instead of `defineSecret`, so secrets may not be available at runtime.

---

### Project 8: Accessibility (MEDIUM)

**Estimated scope: Medium-Large**

#### 8a. Critical Accessibility Gaps
- **No ARIA labels on icon-only buttons**: BugReporter, ChatToggle, NotificationBell, FloatingMusicPlayer, ScreenReader (ironically), expand/collapse buttons in grading
- **No keyboard navigation**: SortingBlock (swipe-only), SketchBlock (mouse-only), AnnotationOverlay (pointer-only), BarChartBlock (drag-only)
- **Modals don't trap focus**: JoinCourse, AnnouncementComposer, RatingModal (PhaseReflectionModal is the one exception)
- **Canvas elements have no text alternatives**: PixelAvatar, PixelBoss, SketchBlock
- **Interactive divs without button semantics**: MessageCenter sections, TeamManager (double-click to rename with no keyboard alternative)
- **Skip-to-content link target missing**: `App.jsx` links to `#main-content` but no element has that ID
- **Form inputs missing label associations** throughout

#### 8b. Replace `alert()`/`confirm()` with Custom Modals
~20+ instances of `window.alert()` and `window.confirm()` for critical operations (delete lesson, restart investigation, reset XP). These are blocking, not styleable, and break screen reader flow.

---

### Project 9: Code Cleanup & Developer Experience (LOW)

**Estimated scope: Small-Medium**

#### 9a. Dead Code Removal
- `gamification-extras.css` is never imported (dead file)
- `SESSION_GAP` constant in `useTelemetry` is defined but never used
- `existingSections` and `rosterFilter` state in `RosterSync.jsx` are declared but never populated
- Duplicate CSS keyframes in `blocks.css` and `gamification-extras.css`

#### 9b. Dependency & Config Cleanup
- `package.json` version is still `0.0.0`
- Default Vite favicon (`vite.svg`) is still in use
- No `<meta name="description">` in `index.html`
- PWA manifest only has one SVG icon (needs PNG at 192x192 and 512x512)
- `.gitignore` missing `.env.local`, `.env.development`, `serviceAccountKey.json`, `*.pem`, `*.key`
- `html2canvas` v1.4.1 is archived — consider `html-to-image`

#### 9c. Data Consistency
- Inconsistent `correctIndex` vs `correctAnswer` and `choices` vs `options` across seed scripts — can cause grading bugs
- `seed-lesson9.js` writes to wrong Firestore path (root `lessons` collection instead of `courses/{courseId}/lessons`)
- Inconsistent `db` import pattern — some files import directly, others receive as parameter

#### 9d. Cloud Function Code Deduplication
The auth verification pattern (~15 lines) is copy-pasted in 8 functions (~120 lines total). Rate-limiting logic is duplicated 3 times. Gemini error handling is duplicated 5+ times. Extract into shared middleware.

#### 9e. Move Static Data Out of Bundle
`biasCases.js` is ~88KB of static case study data bundled in the JS payload. Should live in a CMS, JSON file loaded at runtime, or Firestore.

#### 9f. CDN Script Injection
`BarChartBlock.jsx` appends a `<script>` tag to load KaTeX from CDN without an SRI integrity hash. Install via npm instead or add integrity attributes.

---

## Priority Matrix

| Priority | Project | Impact | Effort |
|----------|---------|--------|--------|
| **P0** | 1. Security Hardening | Prevents exploitation | Large |
| **P1** | 4. Fix Lost Student Work | Students losing work today | Small |
| **P1** | 2. Performance & Scalability | App won't scale | Large |
| **P2** | 3. Auth Architecture | Prevents privilege escalation | Medium |
| **P2** | 7. Error Handling | Prevents hung states | Medium |
| **P2** | 6. Context Performance | Quick wins | Small |
| **P3** | 5. Component Refactor | Maintainability | Large |
| **P3** | 8. Accessibility | Inclusion/compliance | Medium |
| **P4** | 9. Code Cleanup | Developer experience | Small |

---

## Quick Wins (Can do today)

1. Add DOMPurify to `renderMarkdown()` — fixes XSS in 5 components
2. Add `verifyIdToken` to `geminiProxy` — closes the open API proxy
3. Wire up `onAnswer` in `SortingBlock` and `ChecklistBlock` — stops losing student work
4. Wrap context provider values in `useMemo` — reduces unnecessary re-renders
5. Add try/catch around `syncUserProfile` in `useAuth` — prevents login hanging
6. Delete `gamification-extras.css` — dead code
7. Add `.env.local` and `serviceAccountKey.json` to `.gitignore`
8. Restrict CORS from `true` to actual domains in Cloud Functions
