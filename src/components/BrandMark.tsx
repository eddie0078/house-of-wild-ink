import React from "react";

interface BrandMarkProps {
  className?: string;
  size?: number;
  variant?: "light" | "dark" | "gold";
}

export function BrandMark({ className = "", size = 32, variant = "dark" }: BrandMarkProps) {
  const strokeColor =
    variant === "light"
      ? "#FAF8F5"
      : variant === "gold"
      ? "#C5A059"
      : "#182C25";

  const accentColor = variant === "light" ? "#DFC182" : "#C85A46";
  const doorwayFill = variant === "light" ? "rgba(223, 193, 130, 0.15)" : "rgba(197, 160, 89, 0.18)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="House of Wild Ink mark"
    >
      {/* 1. House Roof & Gable */}
      <path
        d="M3 13.5L16 3L29 13.5"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* House Walls & Base */}
      <path
        d="M6 11.5V28H26V11.5"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Open Doorway */}
      {/* Door frame */}
      <path
        d="M11 28V15C11 14.4477 11.4477 14 12 14H20C20.5523 14 21 14.4477 21 15V28"
        stroke={strokeColor}
        strokeWidth="1.5"
        fill={doorwayFill}
      />
      {/* Open door panel pivoted inward */}
      <path
        d="M11 14.5L14 16.5V27.5L11 28V14.5Z"
        fill={strokeColor}
        fillOpacity="0.2"
        stroke={strokeColor}
        strokeWidth="1"
      />

      {/* 3. Pen Nib in the glowing doorway threshold */}
      {/* Nib body */}
      <path
        d="M16 16L18 20H14L16 16Z"
        fill={accentColor}
      />
      {/* Nib slit */}
      <line
        x1="16"
        y1="16"
        x2="16"
        y2="23"
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Nib breather hole */}
      <circle cx="16" cy="20.5" r="0.8" fill={strokeColor} />
      {/* Nib shaft base */}
      <rect x="15" y="23" width="2" height="4" fill={strokeColor} rx="0.5" />
    </svg>
  );
}

export function Wordmark({
  className = "",
  size = "md",
  showSignature = true,
  theme = "dark",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSignature?: boolean;
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";

  const titleSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-6xl",
  };

  const sigSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-base sm:text-lg",
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <span
        className={`font-display font-bold tracking-tight transition-colors ${
          titleSizes[size]
        } ${isLight ? "text-brand-cream" : "text-brand-forest"}`}
      >
        House of Wild Ink
      </span>
      {showSignature && (
        <span
          className={`font-sans tracking-widest uppercase transition-colors mt-0.5 ${
            sigSizes[size]
          } ${isLight ? "text-brand-gold-light" : "text-brand-coral"}`}
        >
          By Linda Emefa Daniels
        </span>
      )}
    </div>
  );
}
