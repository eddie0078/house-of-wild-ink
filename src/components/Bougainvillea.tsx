"use client";

import React from "react";
import Image from "next/image";

export type BougainvilleaColor = "crimson" | "magenta" | "coral" | "purple" | "gold" | "rose";

interface ColorConfig {
  filter: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  hex: string;
  name: string;
}

export const BOUGAINVILLEA_COLORS: Record<BougainvilleaColor, ColorConfig> = {
  crimson: {
    filter: "hue-rotate(0deg) saturate(1.25) contrast(1.05)",
    badgeBg: "bg-[#D81E28]/10",
    badgeText: "text-[#D81E28]",
    dotColor: "#D81E28",
    hex: "#D81E28",
    name: "Scarlet Crimson",
  },
  magenta: {
    filter: "hue-rotate(295deg) saturate(1.35) brightness(1.08)",
    badgeBg: "bg-[#D91E75]/10",
    badgeText: "text-[#D91E75]",
    dotColor: "#D91E75",
    hex: "#D91E75",
    name: "Fuchsia Magenta",
  },
  coral: {
    filter: "hue-rotate(28deg) saturate(1.2) brightness(1.1)",
    badgeBg: "bg-[#FF6F59]/10",
    badgeText: "text-[#E0533C]",
    dotColor: "#FF6F59",
    hex: "#FF6F59",
    name: "Sunset Coral",
  },
  purple: {
    filter: "hue-rotate(255deg) saturate(1.25) brightness(0.98)",
    badgeBg: "bg-[#8338EC]/10",
    badgeText: "text-[#8338EC]",
    dotColor: "#8338EC",
    hex: "#8338EC",
    name: "Royal Violet",
  },
  gold: {
    filter: "hue-rotate(60deg) saturate(1.35) brightness(1.15)",
    badgeBg: "bg-[#E09F3E]/10",
    badgeText: "text-[#C47E1F]",
    dotColor: "#E09F3E",
    hex: "#E09F3E",
    name: "Golden Apricot",
  },
  rose: {
    filter: "hue-rotate(330deg) saturate(1.1) brightness(1.12)",
    badgeBg: "bg-[#E57A82]/10",
    badgeText: "text-[#C85A46]",
    dotColor: "#E57A82",
    hex: "#E57A82",
    name: "Wild Rose",
  },
};

/**
 * High-craft SVG cluster of delicate, paper-thin Bougainvillea bracts
 */
export function BougainvilleaBractCluster({
  color = "crimson",
  size = 48,
  className = "",
}: {
  color?: BougainvilleaColor;
  size?: number;
  className?: string;
}) {
  const conf = BOUGAINVILLEA_COLORS[color] || BOUGAINVILLEA_COLORS.crimson;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      {/* Delicate Olive Leaves */}
      <path
        d="M 50 55 C 30 75 10 65 15 45 C 30 45 45 50 50 55 Z"
        fill="#3D5347"
        fillOpacity="0.75"
      />
      <path
        d="M 55 50 C 75 70 95 60 90 40 C 75 40 60 45 55 50 Z"
        fill="#4A6556"
        fillOpacity="0.7"
      />

      {/* Stem connection */}
      <path
        d="M 50 90 Q 52 70 50 50"
        stroke="#6E5835"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Three Bougainvillea Papery Bracts */}
      {/* Bract 1: Top Left */}
      <g transform="translate(42, 42) rotate(-35)">
        <path
          d="M 0 0 C -15 -25 -5 -40 0 -45 C 5 -40 15 -25 0 0 Z"
          fill={conf.hex}
          fillOpacity="0.92"
        />
        {/* Paper veins */}
        <path
          d="M 0 -42 L 0 -5 M -6 -28 L 0 -22 M 6 -28 L 0 -22 M -4 -16 L 0 -12 M 4 -16 L 0 -12"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* Tiny white central star floret */}
        <circle cx="0" cy="-6" r="2.2" fill="#FFFDF8" stroke="#DFC182" strokeWidth="0.5" />
      </g>

      {/* Bract 2: Top Right */}
      <g transform="translate(58, 42) rotate(35)">
        <path
          d="M 0 0 C -15 -25 -5 -40 0 -45 C 5 -40 15 -25 0 0 Z"
          fill={conf.hex}
          fillOpacity="0.95"
        />
        <path
          d="M 0 -42 L 0 -5 M -6 -28 L 0 -22 M 6 -28 L 0 -22 M -4 -16 L 0 -12 M 4 -16 L 0 -12"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle cx="0" cy="-6" r="2.2" fill="#FFFDF8" stroke="#DFC182" strokeWidth="0.5" />
      </g>

      {/* Bract 3: Center Bottom overlapping */}
      <g transform="translate(50, 48)">
        <path
          d="M 0 0 C -18 -22 -6 -38 0 -42 C 6 -38 18 -22 0 0 Z"
          fill={conf.hex}
          fillOpacity="0.88"
        />
        <path
          d="M 0 -38 L 0 -4 M -6 -24 L 0 -18 M 6 -24 L 0 -18"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle cx="0" cy="-5" r="2" fill="#FFFDF8" stroke="#DFC182" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

/**
 * Organic Bougainvillea Photographic Vignette with Color Variations
 */
export function BougainvilleaPhotoSprig({
  color = "crimson",
  size = 72,
  className = "",
}: {
  color?: BougainvilleaColor;
  size?: number;
  className?: string;
}) {
  const conf = BOUGAINVILLEA_COLORS[color] || BOUGAINVILLEA_COLORS.crimson;

  return (
    <div
      className={`relative inline-block overflow-hidden rounded-full transition-transform hover:scale-110 ${className}`}
      style={{ width: size, height: size }}
      title={`Bougainvillea (${conf.name})`}
    >
      <Image
        src="/images/bougainvillea-flower.webp"
        alt={`Bougainvillea Flower in ${conf.name}`}
        fill
        className="object-cover"
        style={{ filter: conf.filter }}
        sizes={`${size}px`}
      />
      {/* Delicate inner gold rim */}
      <div className="absolute inset-0 rounded-full border border-white/40 shadow-inner pointer-events-none" />
    </div>
  );
}

/**
 * Cascading Bougainvillea Garland across corners and architectural borders
 */
export function BougainvilleaCascadingVine({
  position = "top-right",
  primaryColor = "crimson",
  secondaryColor = "magenta",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  primaryColor?: BougainvilleaColor;
  secondaryColor?: BougainvilleaColor;
  className?: string;
}) {
  const isLeft = position.includes("left");
  const isBottom = position.includes("bottom");

  return (
    <div
      className={`absolute pointer-events-none z-20 flex items-center gap-1 opacity-90 ${
        isLeft ? "left-0" : "right-0"
      } ${isBottom ? "bottom-0" : "top-0"} ${className}`}
      aria-hidden="true"
    >
      <div className={`flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        {/* Main large cluster */}
        <BougainvilleaBractCluster color={primaryColor} size={64} className="transform -rotate-12" />
        {/* Secondary cluster in alternating complementary color */}
        <BougainvilleaBractCluster
          color={secondaryColor}
          size={46}
          className="transform rotate-15 -ml-3"
        />
        {/* Small budding third blossom */}
        <BougainvilleaBractCluster
          color="coral"
          size={32}
          className="transform -rotate-6 -ml-2 opacity-85"
        />
      </div>
    </div>
  );
}

/**
 * Bougainvillea Botanical Section Divider with alternating multi-color blossoms
 */
export function BougainvilleaDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center my-10 ${className}`} aria-hidden="true">
      <div className="flex-grow max-w-xs h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-[#D81E28]/60" />
      <div className="px-5 flex items-center gap-3">
        {/* Left: Golden Apricot Bract */}
        <BougainvilleaBractCluster color="gold" size={28} className="transform -rotate-15 opacity-85" />
        {/* Mid-Left: Sunset Coral */}
        <BougainvilleaBractCluster color="coral" size={34} className="transform rotate-10" />
        {/* Center: Hero Crimson (matching user's flower photo) */}
        <div className="relative group">
          <BougainvilleaBractCluster color="crimson" size={44} className="transform hover:scale-125 transition-transform" />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-serif text-[#D81E28] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Bougainvillea
          </span>
        </div>
        {/* Mid-Right: Fuchsia Magenta */}
        <BougainvilleaBractCluster color="magenta" size={34} className="transform -rotate-10" />
        {/* Right: Royal Violet */}
        <BougainvilleaBractCluster color="purple" size={28} className="transform rotate-15 opacity-85" />
      </div>
      <div className="flex-grow max-w-xs h-[1px] bg-gradient-to-l from-transparent via-[#C5A059]/50 to-[#D91E75]/60" />
    </div>
  );
}
