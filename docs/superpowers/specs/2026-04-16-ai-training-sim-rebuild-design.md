# AI Training Simulator — Rebuild as Scored Embed

**Date:** 2026-04-16
**Lesson:** `ai-training-sim` — "Training AI: Who Decides What It Learns?" (AI Literacy, Unit: AI Ethics and Society)
**Replaces:** Existing standalone deploy at https://ai-training-sim-paps.firebaseapp.com (auth-gated, partial postMessage wiring)

## Goal

Replace the current external sign-in app with a single-file HTML embed that:
- Runs inline inside PantherLearn's `EmbedBlock` iframe — no auth, no new tab
- Auto-fires `score: 5, maxScore: 5, gameComplete: true` on completion screen render
- Surfaces the lesson's pedagogical thesis: **bias in training data → bias in model output**

## Pedagogical Frame

Student plays admin training "ElectiveBot" — an AI that recommends an elective for incoming students. Across 4 stages they make consequential data decisions and watch the model reflect those choices. Bias reveal is explicit but not preachy.

## Stages

### 1. Pick Training Data (~3 min)
- Pool of 12 historical student profiles. Each profile: name, grade level, 2-3 interests, demographic hints (neighborhood, gender), the elective they took
- Pool is intentionally skewed:
  - 5 of 6 "Wood Shop" historical students are male
  - 4 of 5 "Art" historical students are female
  - 3 of 4 "Robotics" historical students are from the same neighborhood (East Side absent)
- Student checks which to include in training. No skew warning given upfront.
- Affordances: "Select All", "Deselect All", per-card checkbox

### 2. Label Edge Cases (~3 min)
- 4 ambiguous students appear:
  - "Loves both art and engineering — hasn't picked"
  - "No clear interest — does well in everything"
  - "New to school, no records yet"
  - "Wants to try something brand new"
- Student picks elective for each via dropdown (becomes a labeled training example)
- Surfaces: even your judgments reflect bias

### 3. Training Animation (~30 sec)
- Brief visual: profile cards stream into a "model" graphic, progress bar fills
- Skippable click after 5 sec
- Pure cosmetic — no real ML

### 4. Evaluate (~5 min)
- 6 brand-new test students, shown one at a time as a card
- Each card: profile → ElectiveBot's recommendation → one-line "why" citing the training pattern
- Examples:
  - *"Maya (loves video games, female) → Art. (Female students with creative interests typically chose Art in your training data.)"*
  - *"Jamal (East Side, low GPA) → no recommendation. (Your training data has no East Side students with this profile.)"*
- After all 6 cards, completion screen renders: a one-paragraph recap of the bias patterns the activity revealed (gender clustering, neighborhood gaps, etc.), and a single line: "Now answer the reflection questions on the lesson page." No interactive prompts inside the activity — the lesson page owns those.
- **`postMessage({type: 'activityScore', score: 5, maxScore: 5, gameComplete: true, completedAt: ...})` fires once on completion screen render**

## Tech

- **Single HTML file**, vanilla JS, no React, no build step
- **No auth, no Firebase, no external dependencies**
- **Bilingual EN/ES toggle** in top-right (per global memory `feedback_bilingual_embeds.md`)
- **Dark theme** matching PantherLearn (CSS vars: bg `#0d1116`, surface `#181c23`, accent `#7c3aed`)
- **Mobile-friendly**: 375px minimum viewport, touch-friendly checkbox sizes (44px min)
- **No score-on-click submit button** (per memory `feedback_auto_submit_scores.md`); auto-fires on completion screen render only
- **Score format**: `type: 'activityScore'` (camelCase, no hyphen) — exact format in `.claude/rules/scored-embed-checklist.md`

## Lesson Wiring

After deploy, modify all 4 AI Lit sections (`Y9Gdhw5MTY8wMFt6Tlvj`, `DacjJ93vUDcwqc260OP3`, `M2MVSXrKuVCD9JQfZZyp`, `fUw67wFhAtobWFhjwvZ5`):

- Lesson `ai-training-sim`, block id `activity-block`
- Change from `type: "ai_training_sim"` (link button) → `type: "embed"`
- Set: `src: "https://ai-training-sim-paps.web.app"`, `scored: true`, `weight: 5`
- Block ID preserved (no student progress to break — lesson is hidden everywhere)
- Use `safeLessonWrite()` per grade-data-integrity rule

## Deploy Targets

- Activity HTML → `ai-training-sim-paps` Firebase hosting target (replaces current build; serves at https://ai-training-sim-paps.web.app and .firebaseapp.com mirror)
- Lesson updates → Firestore (4 sections)

## Verification

- `/deploy-verify ai-training-sim` after activity deploy
- Spot-check the embed loads inside a PantherLearn lesson page, completes end-to-end, score lands in MyGrades
- Pixel auto-QA at 375/768/1280 (per memory `feedback_pixel_qa_embeds.md`)

## Out of Scope (deliberately excluded)

- Performance scoring — flat 5/5 on completion per Luke's call
- "Re-train with fairer data" loop — pushes past 12-min comfortable length
- Saving partial progress — single-session activity
- Student input of own data — too slow, distracts from bias point
- Removing the existing `ExternalActivityBlock` registry entry — leaving in place for now (other activities use the same block type); only the lesson wiring changes
