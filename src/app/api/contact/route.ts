import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit, sanitizeText } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client-local";
    const rate = checkRateLimit(`contact:${ip}`, 4, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many messages sent. Please wait before contacting again." }, { status: 429 });
    }

    const { name, email, category, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Please fill in all required fields (name, email, and message)." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const cleanName = sanitizeText(name);
    const cleanCategory = sanitizeText(category || "General Inquiry");
    const cleanMessage = sanitizeText(message);

    const saved = db.saveMessage(cleanName, email.trim(), cleanCategory, cleanMessage);

    return NextResponse.json({
      success: true,
      message: "Thank you for writing to House of Wild Ink. Your message has been safely delivered to Linda’s desk.",
      id: saved.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to deliver message" }, { status: 500 });
  }
}
