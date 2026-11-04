"use client";

import React, { useEffect, useRef } from "react";

interface BougainvilleaBract {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
  bractVariant: 0 | 1 | 2; // Papery variations
}

// Full Bougainvillea Color Palette: Crimson, Fuchsia Magenta, Sunset Coral, Royal Purple, Golden Apricot
const BOUGAINVILLEA_PETAL_COLORS = [
  "rgba(216, 30, 40, 0.80)",  // Scarlet Crimson (User's Bougainvillea)
  "rgba(228, 45, 55, 0.75)",  // Bright Red Bract
  "rgba(217, 30, 117, 0.75)", // Fuchsia Magenta
  "rgba(181, 23, 158, 0.70)", // Deep Violet-Magenta
  "rgba(255, 111, 89, 0.75)", // Sunset Coral
  "rgba(131, 56, 236, 0.65)", // Royal Purple
  "rgba(224, 159, 62, 0.70)", // Golden Apricot
  "rgba(244, 166, 175, 0.70)",// Soft Rose Bract
];

export function FloatingPetals({ count = 30, className = "" }: { count?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const petals: BougainvilleaBract[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 7,
      speedX: Math.random() * 0.9 - 0.25,
      speedY: Math.random() * 1.0 + 0.55,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.035,
      opacity: Math.random() * 0.35 + 0.45,
      color: BOUGAINVILLEA_PETAL_COLORS[Math.floor(Math.random() * BOUGAINVILLEA_PETAL_COLORS.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.012,
      bractVariant: (Math.floor(Math.random() * 3) as 0 | 1 | 2),
    }));

    const drawBougainvilleaBract = (p: BougainvilleaBract) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      // Draw characteristic heart-shaped, paper-thin Bougainvillea bract
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.1);
      ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.7, p.size * 1.05, p.size * 0.4, 0, p.size * 0.95);
      ctx.bezierCurveTo(-p.size * 1.05, p.size * 0.4, -p.size * 0.9, -p.size * 0.7, 0, -p.size * 1.1);
      ctx.fill();

      // Delicate translucent paper-skin veins
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.9);
      ctx.lineTo(0, p.size * 0.7);

      // Branching side veins
      ctx.moveTo(-p.size * 0.4, -p.size * 0.3);
      ctx.lineTo(0, -p.size * 0.15);
      ctx.lineTo(p.size * 0.4, -p.size * 0.3);

      ctx.moveTo(-p.size * 0.35, p.size * 0.2);
      ctx.lineTo(0, p.size * 0.3);
      ctx.lineTo(p.size * 0.35, p.size * 0.2);
      ctx.stroke();

      // Tiny creamy floret star at the base
      ctx.fillStyle = "#FFFDF5";
      ctx.beginPath();
      ctx.arc(0, p.size * 0.65, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.75;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around boundaries
        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }
        if (p.x > width + 25) p.x = -25;
        if (p.x < -25) p.x = width + 25;

        drawBougainvilleaBract(p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-10 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
