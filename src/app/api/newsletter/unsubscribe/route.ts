import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client-local";
    const rate = checkRateLimit(`unsub:${ip}`, 10, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }

    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const result = db.unsubscribe(email);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process unsubscribe request" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email || !email.includes("@")) {
      return NextResponse.redirect(new URL("/unsubscribe?error=invalid_email", req.url));
    }

    const result = db.unsubscribe(email);
    if (result.success) {
      return NextResponse.redirect(new URL("/unsubscribe?status=unsubscribed", req.url));
    } else {
      return NextResponse.redirect(new URL("/unsubscribe?error=not_found", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/unsubscribe?error=server_error", req.url));
  }
}
