import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessKey, checkRateLimit, resetRateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client-local";
    const { key } = await req.json();

    const rate = checkRateLimit(`gate:${ip}`, 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Too many unsuccessful attempts. Access locked for ${rate.retryAfterSec} seconds.`,
          locked: true,
          retryAfterSec: rate.retryAfterSec,
        },
        { status: 429 }
      );
    }

    const settings = db.getSettings();
    const isValid = verifyAccessKey(
      key,
      settings.owner_access_key_hash,
      settings.owner_access_key_salt
    );

    if (!isValid) {
      return NextResponse.json(
        {
          error: `Incorrect access key. ${rate.remainingAttempts} attempt(s) remaining before temporary lockout.`,
          remainingAttempts: rate.remainingAttempts,
        },
        { status: 401 }
      );
    }

    resetRateLimit(`gate:${ip}`);

    const res = NextResponse.json({
      success: true,
      message: "Access key accepted. Proceeding to author identification.",
    });

    res.cookies.set("ink_gate_token", "unlocked_verified", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 4, // 4 hours
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process access key" }, { status: 500 });
  }
}
