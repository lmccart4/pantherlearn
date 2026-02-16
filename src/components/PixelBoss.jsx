// src/components/PixelBoss.jsx
// Renders animated pixel art boss sprites on canvas
// Uses the same px()-based drawing approach as PixelAvatar

import { useRef, useEffect } from "react";
import { drawBoss } from "../lib/pixelBoss";

export default function PixelBoss({ bossId = "dragon", size = 200, hit = false, lowHP = false }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    let running = true;
    function animate() {
      if (!running) return;
      frameRef.current++;
      drawBoss(ctx, bossId, frameRef.current);
      animRef.current = setTimeout(() => requestAnimationFrame(animate), 120);
    }
    animate();

    return () => {
      running = false;
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [bossId]);

  return (
    <canvas
      ref={canvasRef}
      width={128}
      height={128}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        animation: hit ? "bossHit 0.6s ease" : undefined,
        filter: lowHP ? "hue-rotate(15deg) saturate(1.5) brightness(0.9)" : "none",
        transition: "filter 0.5s",
      }}
    />
  );
}
