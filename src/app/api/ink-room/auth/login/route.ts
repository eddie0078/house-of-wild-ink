import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAccessKey } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, key } = body || {};

    const cookieGate = req.cookies.get("ink_gate_token")?.value;
    let isGateUnlocked = cookieGate === "unlocked_verified";

    // If an access key was submitted in the login request, verify it directly
    if (key && typeof key === "string") {
      const settings = db.getSettings();
      if (verifyAccessKey(key.trim(), settings.owner_access_key_hash, settings.owner_access_key_salt)) {
        isGateUnlocked = true;
      } else {
        return NextResponse.json(
          { error: "Incorrect Access Key. Please check the master key." },
          { status: 401 }
        );
      }
    }

    if (!isGateUnlocked) {
      return NextResponse.json(
        {
          error: "Layer 1 Access Key required. Please enter the master vault key (WildInk2026!AuthorVault) or unlock the gate first.",
        },
        { status: 403 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(normalizedEmail);

    if (!user) {
      return NextResponse.json(
        {
          error: `The email "${normalizedEmail}" is not recognized as an authorized author. Please use lindaemefadaniels@gmail.com.`,
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

    // Set both cookies so author access is completely unlocked in one step
    res.cookies.set("ink_gate_token", "unlocked_verified", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 4, // 4 hours
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
