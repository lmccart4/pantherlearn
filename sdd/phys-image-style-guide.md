# OpenSciEd Physics U2–U6 — Lesson Image Style Guide

~74 images, generated via Gemini **Nano Banana 2** (the `generate.mjs` default model). Audience:
9th–11th grade physics, Perth Amboy (diverse, bilingual). Goal: a **visually cohesive** image set
across all 5 units that is **scientifically accurate** and genuinely teaches.

## Two image kinds (decide per marker from the lesson context)

**DIAGRAM** (most images — cross-sections, force diagrams, spectra, charts, processes):
- Clean modern **flat-vector educational diagram** / infographic. Crisp shapes, soft gradients.
- **Dark slate background (#0f172a / deep navy)** with vibrant accent colors — matches the embeds.
- **Short labels are GOOD and encouraged** — Nano Banana 2 spells single words / 2–3-word labels
  reliably (e.g. "MANTLE", "CRUST", "OUTER CORE"). NEVER put sentences or paragraphs in the image.
- If a formula is unavoidable, keep it trivially short (e.g. `v = fλ`); prefer a visual over text.
- Aspect **4:3**.

**SCENE / HERO** (lesson-opener phenomenon images):
- Atmospheric **illustration** of the phenomenon (Afar rift landscape, crumpled crash-test car,
  radio tower on a hill, night sky with galaxies). NOT a fake photorealistic news photo.
- Aspect **16:9**. Few or no labels.

## Non-negotiables
- **Scientific accuracy first.** Verify every diagram against the unit spec + data pack. A wrong
  diagram (bad EM-spectrum order, reversed H-R temperature axis, wrong force arrows, wrong Earth
  layer order) is worse than no image. List the facts the image must get right in the prompt.
- **No:** garbled/nonsense text, watermarks, logos, real identifiable people, copyrighted
  characters, gore. Put these in the JSON `"avoid"` field.
- Consistent visual language across all 74 (palette, flat-vector feel, clean sans-serif labels).

## JSON prompt schema (one object per image)
Write an array to `~/Lachlan/tools/image-gen/phys-u{N}-prompts.json`:
```json
{
  "prompt": "Detailed scene/diagram description. Name every label that should appear (short). State the science it must get right. End with the style: 'Clean flat-vector educational diagram, dark slate background, vibrant accents, crisp short labels.'",
  "filename": "phys-u2-l06-inside-earth-seismic-cross-section",
  "aspect": "4:3",
  "avoid": "garbled text, paragraphs, watermark, logos, blurry, photorealistic news photo"
}
```
- **filename** = `phys-u{N}-l{NN}-<lesson-slug>-<short-image-name>` (lowercase, hyphens), derived
  from the seed filename. Multiple images in one lesson get distinct `<short-image-name>`s.

## Wiring (do this in the same pass, in the seed script)
Replace each `// IMAGE PHASE: ...` marker with a `k.image({...})` block at the correct position in
the block array (file-top markers describe the HERO → place it right after the section_header /
objectives; inline markers → replace in place). The URL is **deterministic** from the filename:
```js
k.image({
  url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/<filename>.jpg',
  alt: 'One-sentence factual description of the image for screen readers.',
  caption: 'Short teaching caption. *(Diagram.)*'  // or *(Illustration.)* for scenes
}),
```
- Keep the original `// IMAGE PHASE` intent; if a marker was "optional," still wire it (we're doing all).
- After editing, run `node --check <seedfile>` to confirm the script still parses.
