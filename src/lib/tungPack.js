// src/lib/tungPack.js
// "Tung Pack" — Tung Tung Tung Sahur (Italian brainrot meme) + Stick companion
// Two variants each: faithful meme rendering + pixel-art tribute
// Exempt uids bypass unlockLevel gating

import { registerClassDraw, registerPetDraw, px, drawHead } from "./pixelArt";

// Juan Quinche — Period 4 AI Lit. Only he can use tung/stick regardless of level.
export const TUNG_EXEMPT_UIDS = ["WcymXtM3IhUIVhCiULS0nyq6b4I3"];

// ═══════════════════════════════════════
// CLASSES — both variants unlock at level 999 (unreachable) unless exempt
// ═══════════════════════════════════════
export const TUNG_CLASSES = {
  tung: {
    id: "tung",
    name: "Tung Tung Tung Sahur",
    icon: "🪵",
    pack: "tung",
    description: "Wooden log guardian of the dawn — faithful meme rendering",
    unlockLevel: 999,
    exemptUids: TUNG_EXEMPT_UIDS,
    rentable: true,
    rentalCost: 5,
    rentalHours: 24,
    color: {
      robe: "#a06830",      // log body mid
      robeMid: "#b8783a",
      robeDark: "#6a4018",  // log body dark
      robeLight: "#d48848", // log body light
      accent: "#2a1608",    // bark lines / eye rim
    },
    abilities: {
      passive: "Sahur Wake — +1 class HP at start of every session",
      active: "Bat Slam — Deal 5 damage on next correct answer (5 question cooldown)",
    },
  },
  tung_pixel: {
    id: "tung_pixel",
    name: "Tung Sahur (Pixel)",
    icon: "🪵",
    pack: "tung",
    description: "Stylized pixel-art tribute of the log warrior",
    unlockLevel: 999,
    exemptUids: TUNG_EXEMPT_UIDS,
    rentable: true,
    rentalCost: 5,
    rentalHours: 24,
    color: {
      robe: "#8a5a28",
      robeMid: "#a06830",
      robeDark: "#583818",
      robeLight: "#b87838",
      accent: "#f0c848",
    },
    abilities: {
      passive: "Sahur Wake — +1 class HP at start of every session",
      active: "Bat Slam — Deal 5 damage on next correct answer (5 question cooldown)",
    },
  },
};

// ═══════════════════════════════════════
// PETS — stick companion, two variants
// ═══════════════════════════════════════
export const TUNG_PETS = [
  {
    id: "stick",
    name: "Stick (Sahur Bat)",
    icon: "🥖",
    unlockLevel: 999,
    exemptUids: TUNG_EXEMPT_UIDS,
    rentable: true,
    rentalCost: 5,
    rentalHours: 24,
  },
  {
    id: "stick_pixel",
    name: "Stick (Pixel)",
    icon: "🪵",
    unlockLevel: 999,
    exemptUids: TUNG_EXEMPT_UIDS,
    rentable: true,
    rentalCost: 5,
    rentalHours: 24,
  },
];

// ═══════════════════════════════════════
// CLASS DRAW — TUNG (faithful meme rendering)
// Wooden-log body with arms, legs, one wide eye, crooked mouth, holding a bat.
// Canvas is 48×48; body sprite anchor y~5..44. Standard class draw signature.
// ═══════════════════════════════════════
function drawTung(ctx, sk, hr, ey, cl, L, by, f, sp, gl) {
  // Ground shadow
  for (let x = 14; x <= 33; x++) px(ctx, x, 46, "#0004");

  // ── Legs (two stubby wooden legs) ──
  for (let y = 38; y <= 44; y++) {
    for (let x = 18; x <= 22; x++) px(ctx, x, y + by, cl.robe);
    for (let x = 25; x <= 29; x++) px(ctx, x, y + by, cl.robe);
    // shading left side of each leg
    px(ctx, 18, y + by, cl.robeDark);
    px(ctx, 25, y + by, cl.robeDark);
    // highlight right
    px(ctx, 22, y + by, cl.robeLight);
    px(ctx, 29, y + by, cl.robeLight);
  }
  // Feet / cut ends
  for (let x = 17; x <= 23; x++) px(ctx, x, 44 + by, cl.robeDark);
  for (let x = 24; x <= 30; x++) px(ctx, x, 44 + by, cl.robeDark);

  // ── Main log body (vertical log, slightly tapered at top) ──
  for (let y = 8; y <= 37; y++) {
    for (let x = 14; x <= 33; x++) {
      let c = cl.robe;
      if (x <= 15) c = cl.robeDark;
      else if (x >= 32) c = cl.robeLight;
      else if (x <= 17) c = cl.robeMid || cl.robe;
      px(ctx, x, y + by, c);
    }
  }

  // ── Bark texture (vertical grain lines) ──
  for (let y = 10; y <= 36; y += 1) {
    if (y % 4 === 0) {
      px(ctx, 19, y + by, cl.robeDark);
      px(ctx, 26, y + by, cl.robeDark);
      px(ctx, 30, y + by, cl.robeDark);
    }
    if (y % 5 === 2) px(ctx, 22, y + by, cl.robeDark);
  }
  // Knot holes
  for (let dy = 0; dy <= 1; dy++) for (let dx = 0; dx <= 1; dx++) px(ctx, 28 + dx, 22 + dy + by, cl.robeDark);
  px(ctx, 17, 31 + by, cl.robeDark);
  px(ctx, 18, 31 + by, cl.robeDark);

  // ── Top cut ring (lighter cut wood) ──
  for (let x = 16; x <= 31; x++) px(ctx, x, 7 + by, cl.robeLight);
  for (let x = 18; x <= 29; x++) px(ctx, x, 6 + by, cl.robeLight);
  for (let x = 20; x <= 27; x++) px(ctx, x, 5 + by, cl.robeLight);
  // rings on top
  for (let x = 22; x <= 25; x++) px(ctx, x, 6 + by, cl.robeMid || cl.robe);

  // ── Face: one huge eye (meme canon is two small eyes — do two, cartoon style) ──
  // Left eye
  for (let y = 16; y <= 22; y++) for (let x = 17; x <= 22; x++) px(ctx, x, y + by, "#f8f0d8");
  for (let y = 16; y <= 22; y++) { px(ctx, 17, y + by, cl.accent); px(ctx, 22, y + by, cl.accent); }
  for (let x = 17; x <= 22; x++) { px(ctx, x, 16 + by, cl.accent); px(ctx, x, 22 + by, cl.accent); }
  // Pupil left (looks slightly right)
  for (let y = 18; y <= 20; y++) for (let x = 19; x <= 20; x++) px(ctx, x, y + by, "#000");
  px(ctx, 19, 18 + by, "#fff"); // eye gleam

  // Right eye
  for (let y = 16; y <= 22; y++) for (let x = 25; x <= 30; x++) px(ctx, x, y + by, "#f8f0d8");
  for (let y = 16; y <= 22; y++) { px(ctx, 25, y + by, cl.accent); px(ctx, 30, y + by, cl.accent); }
  for (let x = 25; x <= 30; x++) { px(ctx, x, 16 + by, cl.accent); px(ctx, x, 22 + by, cl.accent); }
  for (let y = 18; y <= 20; y++) for (let x = 27; x <= 28; x++) px(ctx, x, y + by, "#000");
  px(ctx, 27, 18 + by, "#fff");

  // ── Mouth (open, crooked grin showing a tooth) ──
  for (let x = 19; x <= 28; x++) px(ctx, x, 28 + by, cl.accent);
  for (let x = 20; x <= 27; x++) px(ctx, x, 29 + by, "#2a0806");
  for (let x = 20; x <= 27; x++) px(ctx, x, 30 + by, "#2a0806");
  for (let x = 21; x <= 26; x++) px(ctx, x, 31 + by, "#2a0806");
  // lower lip line
  for (let x = 20; x <= 27; x++) px(ctx, x, 32 + by, cl.accent);
  // tooth
  px(ctx, 23, 29 + by, "#f8f0d8");
  px(ctx, 23, 30 + by, "#f8f0d8");

  // ── Left arm: short log arm, held at side ──
  for (let y = 22; y <= 34; y++) { px(ctx, 12, y + by, cl.robeDark); px(ctx, 13, y + by, cl.robe); }
  // hand stub
  for (let y = 33; y <= 35; y++) { px(ctx, 11, y + by, cl.robeMid || cl.robe); px(ctx, 12, y + by, cl.robe); }

  // ── Right arm raised, holding baseball bat ──
  // Arm
  for (let y = 22; y <= 30; y++) { px(ctx, 34, y + by, cl.robe); px(ctx, 35, y + by, cl.robeLight); }
  // Hand gripping bat
  for (let y = 28; y <= 32; y++) for (let x = 35; x <= 37; x++) px(ctx, x, y + by, cl.robeMid || cl.robe);

  // Bat (wooden, tapered) — goes up and to the right diagonally
  const batColor = "#d4a468";
  const batDark = "#8a5a28";
  const batHi = "#f0c088";
  // grip end near hand
  for (let i = 0; i < 10; i++) {
    const bx = 37 + i;
    const by2 = 28 - i;
    // bat is 3px thick
    px(ctx, bx, by2 + by, batDark);
    px(ctx, bx, by2 - 1 + by, batColor);
    px(ctx, bx, by2 - 2 + by, batHi);
  }
  // bat taper — wider at top (end)
  px(ctx, 45, 20 + by, batColor);
  px(ctx, 46, 19 + by, batColor);
  px(ctx, 46, 18 + by, batHi);
  px(ctx, 45, 17 + by, batHi);
  px(ctx, 44, 18 + by, batDark);

  // Grip tape (dark rings at handle)
  px(ctx, 38, 27 + by, "#1a0806");
  px(ctx, 39, 26 + by, "#1a0806");
  px(ctx, 37, 28 + by, "#1a0806");

  // ── Optional glow (only at high XP; tung is max tier meme, no gating here) ──
  if (gl) {
    for (let x = 14; x <= 33; x++) {
      px(ctx, x, 7 + by, cl.robeLight + "80");
    }
  }
}

// ═══════════════════════════════════════
// CLASS DRAW — TUNG (pixel-art tribute)
// Stylized chibi version: rounder, cleaner, fits the existing hero-pack aesthetic.
// Uses drawHead() for consistent face stack, swaps body for wooden log feel.
// ═══════════════════════════════════════
function drawTungPixel(ctx, sk, hr, ey, cl, L, by, f, sp, gl) {
  // Ground shadow
  for (let x = 16; x <= 31; x++) px(ctx, x, 46, "#0004");

  // ── Body (wooden log, standard hero proportions) ──
  for (let y = 22; y <= 40; y++) {
    for (let x = 17; x <= 30; x++) {
      let c = cl.robe;
      if (x <= 18) c = cl.robeDark;
      else if (x >= 29) c = cl.robeLight;
      px(ctx, x, y + by, c);
    }
  }
  // Belt / rope detail
  for (let x = 17; x <= 30; x++) px(ctx, x, 34 + by, cl.accent);
  // Vertical grain pattern
  for (let y = 23; y <= 33; y += 3) { px(ctx, 20, y + by, cl.robeDark); px(ctx, 27, y + by, cl.robeDark); }
  for (let y = 36; y <= 40; y += 2) { px(ctx, 22, y + by, cl.robeDark); px(ctx, 26, y + by, cl.robeDark); }

  // Legs
  for (let y = 35; y <= 44; y++) { for (let x = 18; x <= 22; x++) px(ctx, x, y + by, cl.robe); for (let x = 25; x <= 29; x++) px(ctx, x, y + by, cl.robe); }
  for (let x = 17; x <= 23; x++) px(ctx, x, 44 + by, cl.robeDark);
  for (let x = 24; x <= 30; x++) px(ctx, x, 44 + by, cl.robeDark);

  // Arms (wooden)
  for (let y = 23; y <= 34; y++) { px(ctx, 14, y + by, cl.robeDark); px(ctx, 15, y + by, cl.robe); px(ctx, 32, y + by, cl.robe); px(ctx, 33, y + by, cl.robeLight); }
  px(ctx, 14, 35 + by, cl.robeMid || cl.robe); px(ctx, 15, 35 + by, cl.robeLight);
  px(ctx, 32, 35 + by, cl.robeMid || cl.robe); px(ctx, 33, 35 + by, cl.robeLight);

  // Standard head (uses skin/hair — stylized, not literal log face)
  drawHead(ctx, sk, hr, ey, L, by, f, sp);

  // Wooden helmet / log cap — ring of wood around top of head
  for (let x = 17; x <= 30; x++) {
    px(ctx, x, 4 + by, cl.robeDark);
    px(ctx, x, 5 + by, cl.robe);
  }
  px(ctx, 16, 5 + by, cl.robeDark);
  px(ctx, 31, 5 + by, cl.robeDark);
  // growth rings on cap
  px(ctx, 23, 5 + by, cl.robeLight);
  px(ctx, 24, 5 + by, cl.robeLight);

  // ── Bat held at side (right arm) ──
  const batColor = cl.accent;
  const batDark = cl.robeDark;
  // shaft
  for (let y = 28; y <= 42; y++) { px(ctx, 36, y + by, batDark); px(ctx, 37, y + by, batColor); }
  // barrel (wider top, wait — bat held head-down so wide at bottom)
  for (let y = 38; y <= 42; y++) { px(ctx, 35, y + by, batDark); px(ctx, 38, y + by, batColor); }
  // bat knob at top (near hand)
  px(ctx, 36, 27 + by, cl.robeLight);
  px(ctx, 37, 27 + by, cl.robeLight);

  // Level-based glow on cap
  if (L >= 25) {
    const pulse = f % 6 < 3 ? "#f0c84880" : "#f0c84840";
    for (let x = 18; x <= 29; x++) px(ctx, x, 3 + by, pulse);
  }
}

// ═══════════════════════════════════════
// PET DRAW — STICK (faithful: literal stick that looks like a baseball bat)
// 36×36 canvas. Args: (ctx, f=frame, b=bounce, fl=flicker)
// ═══════════════════════════════════════
function drawStick(ctx, f, b, fl) {
  // Ground shadow
  for (let x = 14; x <= 22; x++) px(ctx, x, 33, "#0003");

  const batLight = "#f0c088";
  const batMid = "#d4a468";
  const batDark = "#8a5a28";
  const batShadow = "#583818";

  // Held vertically, knob up, barrel down (like leaning on it)
  // Knob
  px(ctx, 17, 8 - b, batDark);
  px(ctx, 18, 8 - b, batMid);
  px(ctx, 19, 8 - b, batMid);
  px(ctx, 20, 8 - b, batDark);
  px(ctx, 17, 9 - b, batMid);
  px(ctx, 18, 9 - b, batLight);
  px(ctx, 19, 9 - b, batLight);
  px(ctx, 20, 9 - b, batMid);

  // Handle (thin)
  for (let y = 10; y <= 18; y++) {
    px(ctx, 18, y - b, batMid);
    px(ctx, 19, y - b, batLight);
  }
  // Grip tape
  for (let y = 11; y <= 16; y++) if (y % 2 === 0) { px(ctx, 18, y - b, "#1a0806"); px(ctx, 19, y - b, "#1a0806"); }

  // Taper into barrel
  for (let y = 19; y <= 22; y++) {
    const w = y - 18;
    for (let x = 18 - w; x <= 19 + w; x++) {
      if (x === 18 - w) px(ctx, x, y - b, batDark);
      else if (x === 19 + w) px(ctx, x, y - b, batMid);
      else px(ctx, x, y - b, batLight);
    }
  }

  // Barrel
  for (let y = 23; y <= 30; y++) {
    for (let x = 14; x <= 23; x++) {
      let c = batMid;
      if (x <= 15) c = batShadow;
      else if (x === 16) c = batDark;
      else if (x >= 22) c = batLight;
      px(ctx, x, y - b, c);
    }
  }

  // Wood grain on barrel
  for (let y = 24; y <= 29; y++) if (y % 2 === 0) px(ctx, 18, y - b, batDark);
  px(ctx, 20, 26 - b, batDark);
  px(ctx, 17, 27 - b, batDark);

  // Rounded barrel end (bottom)
  for (let x = 15; x <= 22; x++) px(ctx, x, 31 - b, batDark);
  for (let x = 16; x <= 21; x++) px(ctx, x, 32 - b, batShadow);

  // Little sparkle/smile face on the bat (since it IS Tung's companion)
  // Two dot eyes
  if (f % 20 < 16) {
    px(ctx, 17, 26 - b, "#000");
    px(ctx, 20, 26 - b, "#000");
    // smile
    px(ctx, 18, 28 - b, "#000");
    px(ctx, 19, 28 - b, "#000");
  } else {
    // blink
    px(ctx, 17, 26 - b, batDark);
    px(ctx, 20, 26 - b, batDark);
  }
}

// ═══════════════════════════════════════
// PET DRAW — STICK_PIXEL (stylized: little mascot creature that IS a bat)
// ═══════════════════════════════════════
function drawStickPixel(ctx, f, b, fl) {
  for (let x = 13; x <= 23; x++) px(ctx, x, 33, "#0003");

  const wood = "#a06830";
  const woodHi = "#c48848";
  const woodDk = "#6a4018";

  // Bob motion — slight side-to-side lean
  const lean = f % 20 < 10 ? 0 : 1;

  // Main body — upright bat with googly eyes and tiny arms
  // Barrel (bottom)
  for (let y = 22; y <= 30; y++) {
    for (let x = 14 + lean; x <= 22 + lean; x++) {
      let c = wood;
      if (x <= 15 + lean) c = woodDk;
      else if (x >= 21 + lean) c = woodHi;
      px(ctx, x, y - b, c);
    }
  }
  // Taper
  for (let y = 19; y <= 21; y++) {
    const w = 22 - y;
    for (let x = 18 + lean - w; x <= 18 + lean + w; x++) {
      let c = wood;
      if (x <= 18 + lean - w) c = woodDk;
      else if (x >= 18 + lean + w) c = woodHi;
      px(ctx, x, y - b, c);
    }
  }
  // Handle
  for (let y = 13; y <= 18; y++) {
    px(ctx, 17 + lean, y - b, woodDk);
    px(ctx, 18 + lean, y - b, wood);
    px(ctx, 19 + lean, y - b, woodHi);
  }
  // Knob
  for (let x = 16 + lean; x <= 20 + lean; x++) { px(ctx, x, 11 - b, woodDk); px(ctx, x, 12 - b, wood); }
  px(ctx, 16 + lean, 12 - b, woodDk);
  px(ctx, 20 + lean, 12 - b, woodDk);

  // Googly eyes on barrel (big cartoon eyes)
  for (let y = 24; y <= 26; y++) for (let x = 15 + lean; x <= 17 + lean; x++) px(ctx, x, y - b, "#fff");
  for (let y = 24; y <= 26; y++) for (let x = 19 + lean; x <= 21 + lean; x++) px(ctx, x, y - b, "#fff");
  // eye rims
  for (let y = 24; y <= 26; y++) { px(ctx, 15 + lean, y - b, "#000"); px(ctx, 17 + lean, y - b, "#000"); px(ctx, 19 + lean, y - b, "#000"); px(ctx, 21 + lean, y - b, "#000"); }
  for (let x = 15 + lean; x <= 17 + lean; x++) { px(ctx, x, 24 - b, "#000"); px(ctx, x, 26 - b, "#000"); }
  for (let x = 19 + lean; x <= 21 + lean; x++) { px(ctx, x, 24 - b, "#000"); px(ctx, x, 26 - b, "#000"); }
  // pupils (track with frame for life)
  const pupilX = f % 30 < 15 ? 0 : 1;
  px(ctx, 16 + lean + pupilX, 25 - b, "#000");
  px(ctx, 20 + lean + pupilX, 25 - b, "#000");

  // Happy mouth
  px(ctx, 17 + lean, 29 - b, "#000");
  px(ctx, 18 + lean, 30 - b, "#000");
  px(ctx, 19 + lean, 30 - b, "#000");
  px(ctx, 20 + lean, 29 - b, "#000");

  // Tiny twig arms
  const wiggle = f % 10 < 5 ? 0 : 1;
  px(ctx, 13 + lean, 22 - b + wiggle, woodDk);
  px(ctx, 14 + lean, 21 - b + wiggle, woodDk);
  px(ctx, 22 + lean, 22 - b + wiggle, woodDk);
  px(ctx, 23 + lean, 21 - b + wiggle, woodDk);

  // Little leaf sprig on knob
  const leafC = "#50a060";
  px(ctx, 18 + lean, 10 - b, leafC);
  px(ctx, 19 + lean, 9 - b, leafC);
  px(ctx, 20 + lean, 10 - b, leafC);
}

// ═══════════════════════════════════════
// REGISTER
// ═══════════════════════════════════════
registerClassDraw("tung", drawTung);
registerClassDraw("tung_pixel", drawTungPixel);
registerPetDraw("stick", drawStick);
registerPetDraw("stick_pixel", drawStickPixel);
