import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client-local";
    const rate = checkRateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many subscription requests. Please try again later." }, { status: 429 });
    }

    const { email, sourcePage } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const result = db.addSubscriber(email, sourcePage || "/");
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Subscription failed" }, { status: 500 });
  }
}
