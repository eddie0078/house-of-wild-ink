import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#182C25", // Deep forest green
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "14px solid #C5A059", // Antique gold framing
          padding: "60px 80px",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Subtle decorative inner frame */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            bottom: "20px",
            left: "20px",
            right: "20px",
            border: "1px solid rgba(197, 160, 89, 0.4)",
            display: "flex",
          }}
        />

        {/* Minimal Doorway and Pen-Nib Architectural Glyph */}
        <div style={{ display: "flex", marginBottom: "32px", alignItems: "center", justifyContent: "center" }}>
          <svg width="72" height="72" viewBox="0 0 32 32" fill="none">
            <path d="M3 13.5L16 3L29 13.5" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 11.5V28H26V11.5" stroke="#C5A059" strokeWidth="1.8" />
            <path d="M11 28V15H21V28" stroke="#FAF8F5" strokeWidth="1.5" fill="rgba(250, 248, 245, 0.12)" />
            <path d="M16 16L18 20H14L16 16Z" fill="#C85A46" />
            <line x1="16" y1="16" x2="16" y2="23" stroke="#FAF8F5" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Brand Display Wordmark */}
        <div
          style={{
            color: "#FAF8F5",
            fontSize: "68px",
            fontFamily: "serif",
            fontWeight: "bold",
            letterSpacing: "-0.5px",
            marginBottom: "12px",
            display: "flex",
          }}
        >
          House of Wild Ink
        </div>

        {/* Hero Signature Line */}
        <div
          style={{
            color: "#C5A059",
            fontSize: "24px",
            fontFamily: "sans-serif",
            textTransform: "uppercase",
            letterSpacing: "4px",
            fontWeight: 600,
            marginBottom: "32px",
            display: "flex",
          }}
        >
          By Linda Emefa Daniels
        </div>

        {/* Exact Tagline */}
        <div
          style={{
            color: "#F7F4EE",
            fontSize: "26px",
            fontFamily: "serif",
            fontStyle: "italic",
            lineHeight: 1.4,
            maxWidth: "800px",
            display: "flex",
          }}
        >
          “A home for stories that refuse to stay quiet.”
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
