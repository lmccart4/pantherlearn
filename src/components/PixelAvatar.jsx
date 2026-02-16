// src/components/PixelAvatar.jsx
// Reusable pixel art character + pet renderers
// Usage:
//   <PixelAvatar avatar={avatarState} level={5} size={192} animate />
//   <PixelPet petId="fire_spirit" size={144} animate />
//   <MiniAvatar avatar={avatarState} level={3} size={48} />

import { useRef, useEffect, useCallback } from "react";
import { CLASSES, SKIN_TONES, HAIR_COLORS, EYE_COLORS } from "../lib/avatar";
import { drawCharacter, drawPet as drawPetCanvas } from "../lib/pixelArt";

// ═══════════════════════════════════════
// PIXEL AVATAR (main character)
// ═══════════════════════════════════════
export default function PixelAvatar({
  avatar,
  level = 1,
  size = 192,
  animate = true,
  showLabel = false,
  style = {},
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const timerRef = useRef(null);

  const cls = avatar?.classId || "mage";
  const skinId = avatar?.skinTone || "medium";
  const hairId = avatar?.hairColor || "black";
  const eyeId = avatar?.eyeColor || "brown";

  const sk = SKIN_TONES.find((s) => s.id === skinId) || SKIN_TONES[0];
  const hr = HAIR_COLORS.find((h) => h.id === hairId) || HAIR_COLORS[0];
  const ey = EYE_COLORS.find((e) => e.id === eyeId) || EYE_COLORS[0];
  const classData = CLASSES[cls] || CLASSES.mage;
  const cl = classData.color;

  // Build accessories object from avatar state
  const acc = {
    accessory: avatar?.accessory && avatar.accessory !== "none" ? avatar.accessory : null,
    power: avatar?.specialPower && avatar.specialPower !== "aura_none" && avatar.specialPower !== "none" ? avatar.specialPower : null,
  };

  const render = useCallback(
    (f) => {
      const c = canvasRef.current;
      if (!c) return;
      drawCharacter(c.getContext("2d"), cls, sk, hr, ey, cl, level, f, acc);
    },
    [cls, sk, hr, ey, cl, level, acc.accessory, acc.power]
  );

  useEffect(() => {
    render(0);
    if (!animate) return;
    const tick = () => {
      frameRef.current++;
      render(frameRef.current);
      timerRef.current = setTimeout(tick, 200);
    };
    timerRef.current = setTimeout(tick, 200);
    return () => clearTimeout(timerRef.current);
  }, [render, animate]);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", ...style }}>
      <canvas
        ref={canvasRef}
        width={80}
        height={48}
        style={{
          width: size * (80/48),
          height: size,
          imageRendering: "pixelated",
          borderRadius: 8,
        }}
      />
      {showLabel && (
        <div
          style={{
            marginTop: 6,
            fontSize: Math.max(10, size / 18),
            fontWeight: 800,
            color: cl.accent,
            textAlign: "center",
            textShadow: `0 0 8px ${cl.accent}44`,
          }}
        >
          {classData.icon} {classData.name}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// PIXEL PET
// ═══════════════════════════════════════
export function PixelPet({ petId = "fire_spirit", size = 144, animate = true, style = {} }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const timerRef = useRef(null);

  const render = useCallback(
    (f) => {
      const c = canvasRef.current;
      if (!c) return;
      drawPetCanvas(c.getContext("2d"), petId, f);
    },
    [petId]
  );

  useEffect(() => {
    render(0);
    if (!animate) return;
    const tick = () => {
      frameRef.current++;
      render(frameRef.current);
      timerRef.current = setTimeout(tick, 200);
    };
    timerRef.current = setTimeout(tick, 200);
    return () => clearTimeout(timerRef.current);
  }, [render, animate]);

  return (
    <canvas
      ref={canvasRef}
      width={36}
      height={36}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        borderRadius: 8,
        ...style,
      }}
    />
  );
}

// ═══════════════════════════════════════
// MINI AVATAR (leaderboards, team panels)
// ═══════════════════════════════════════
export function MiniAvatar({ avatar, level = 1, size = 48, style = {} }) {
  return <PixelAvatar avatar={avatar} level={level} size={size} animate={false} style={style} />;
}

// ═══════════════════════════════════════
// AVATAR WITH PET (side by side display)
// ═══════════════════════════════════════
export function AvatarWithPet({
  avatar,
  level = 1,
  charSize = 192,
  petSize = 144,
  animate = true,
}) {
  // Character canvas is now 80x48 (wider for wings)
  // Pull pet further in to compensate for wider character canvas
  const petOverlap = Math.round(charSize * -0.65);
  const petBottom = Math.round(charSize * 0.02);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <PixelAvatar avatar={avatar} level={level} size={charSize} animate={animate} />
      {avatar?.petId && (
        <PixelPet
          petId={avatar.petId}
          size={petSize}
          animate={animate}
          style={{ marginLeft: petOverlap, marginBottom: petBottom }}
        />
      )}
    </div>
  );
}
