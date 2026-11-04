import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const gateToken = req.cookies.get("ink_gate_token")?.value;
    if (gateToken !== "unlocked_verified") {
      return NextResponse.json(
        { error: "Layer 1 Access Key must be unlocked before identity verification." },
        { status: 403 }
      );
    }

    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(normalizedEmail);

    if (!user) {
      return NextResponse.json(
        {
          error: "This account has not been granted author access to The Ink Room. Only authorized writers invited by Linda may enter.",
        },
        { status: 403 }
      );
    }

    const sessionToken = db.createSession(user.email, user.role);

    const res = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    res.cookies.set("ink_session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Authentication error" }, { status: 500 });
  }
}
