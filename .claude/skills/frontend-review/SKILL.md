---
name: frontend-review
description: Use when someone asks to review front-end design, fix styling, polish the UI, make something look better, improve visual design, fix layout issues, or refine the look of a PantherLearn component or page. Also trigger on "design review", "fix the CSS", "improve responsiveness", "visual polish", or "make this look professional".
argument-hint: <component or page name>
disable-model-invocation: true
---

## What This Skill Does

Aggressively reviews and improves the front-end design of a PantherLearn component or page. Fixes styling, spacing, layout, responsiveness, visual hierarchy, and consistency with the design system — then implements all changes directly. Does NOT touch component logic, state, or event handlers.

## Steps

1. **Identify the target.** Use `` to find the component or page. Search for it:
   - `src/components/**/*.jsx` and `src/pages/**/*.jsx` — match by name
   - If ambiguous, list matches and pick the most likely one

2. **Read the design system references.** Load both:
   - `.claude/skills/frontend-review/design-system.md` — PantherLearn's CSS variables, spacing, typography, and component patterns
   - `.claude/skills/frontend-review/reference-shift5.md` — Shift5.io design inspiration: restraint, generous whitespace, size contrast for hierarchy, subtle animations, and professional polish

3. **Read the target files.** Read:
   - The target component JSX file
   - The relevant CSS file(s): `src/index.css`, `src/blocks.css`, or any CSS file that contains styles for this component
   - If a screenshot was provided, compare the current rendering against it

4. **Analyze and identify all issues.** Check for:

   **Consistency:**
   - Colors not using CSS variables (hardcoded hex/rgb values)
   - Font families not using `--font-display` or `--font-body`
   - Border radius not using `--radius` (14px)
   - Spacing that doesn't follow the established scale (12, 14, 16, 18, 20, 24, 28px)

   **Visual Hierarchy:**
   - Headings that don't stand out from body text
   - Missing visual separation between sections
   - Lack of depth (missing shadows, gradients, or subtle glows)
   - Inconsistent padding/margins within groups

   **Polish:**
   - Missing hover/focus/active states on interactive elements
   - Missing transitions on state changes
   - Abrupt visual changes that should be animated
   - Missing glassmorphism effects where appropriate (floating elements, overlays)
   - Missing subtle glow effects that other components use

   **Responsiveness:**
   - Elements that break at 480px or 768px
   - Text that's too small or too large on mobile
   - Padding/margins not adjusted for mobile
   - Missing media queries for the two breakpoints

   **Layout:**
   - Misaligned elements
   - Inconsistent gap sizes
   - Poor use of flexbox/grid
   - Content too wide or too narrow

   **Accessibility:**
   - Missing focus-visible styles
   - Poor color contrast
   - Missing prefers-reduced-motion support for animations

5. **Implement all fixes.** Make changes to both JSX (className adjustments, structural changes for better layout) and CSS files. Be aggressive:
   - Redesign sections if they look unprofessional
   - Add visual effects (glows, gradients, shadows) to match the rest of the app
   - Improve whitespace and breathing room
   - Strengthen visual hierarchy with size, weight, and color contrast
   - Add micro-interactions (hover states, transitions) where missing

6. **Verify mobile.** After making changes, review the CSS to confirm:
   - Media queries exist for `@media (max-width: 768px)` and `@media (max-width: 480px)`
   - Padding reduces appropriately on small screens
   - No horizontal overflow issues
   - Font sizes are adjusted for readability

## Guardrails

- **NEVER modify component logic** — no changes to state, props, event handlers, useEffect, API calls, or conditional rendering logic
- **NEVER add npm dependencies** — no installing CSS frameworks, icon libraries, or packages
- **NEVER break mobile responsiveness** — all changes must work at 480px and 768px breakpoints
- **ALWAYS use CSS custom properties** — use `var(--amber)`, `var(--surface)`, etc. instead of hardcoded values
- **ALWAYS respect `prefers-reduced-motion`** — any new animations must be disabled for reduced motion
- **ALWAYS use existing className conventions** — kebab-case class names matching existing patterns

## Notes

- If the target has no CSS at all, create new rules in the most appropriate existing CSS file (usually `src/blocks.css` for lesson blocks, `src/index.css` for pages)
- When adding new class names, follow the existing pattern: descriptive kebab-case (e.g., `question-block`, `chatbot-header`, `lesson-nav`)
- Prefer CSS over inline styles. If inline styles exist in JSX, move them to CSS classes when possible
- The app is dark-mode only — never introduce light-mode styles
- The "Ori spirit" effects (purple glows, breathing animations) are used sparingly for special elements — don't overuse them
