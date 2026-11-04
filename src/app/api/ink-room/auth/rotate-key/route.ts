import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession } from "@/lib/auth";
import { verifyAccessKey, hashAccessKey } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const auth = await getInkRoomSession();
    if (!auth.isAuthenticated || auth.user?.role !== "Owner") {
      return NextResponse.json({ error: "Unauthorized. Only the Owner can rotate the master access key." }, { status: 403 });
    }

    const { currentKey, newKey, confirmKey } = await req.json();

    if (!currentKey || !newKey || !confirmKey) {
      return NextResponse.json({ error: "All key fields are required." }, { status: 400 });
    }

    if (newKey !== confirmKey) {
      return NextResponse.json({ error: "The new access keys do not match." }, { status: 400 });
    }

    if (newKey.length < 12) {
      return NextResponse.json({ error: "New access key must be at least 12 characters long." }, { status: 400 });
    }

    const settings = db.getSettings();
    const isCurrentValid = verifyAccessKey(
      currentKey,
      settings.owner_access_key_hash,
      settings.owner_access_key_salt
    );

    if (!isCurrentValid) {
      return NextResponse.json({ error: "Current access key is incorrect." }, { status: 400 });
    }

    const { hash, salt } = hashAccessKey(newKey);
    db.rotateAccessKey(hash, salt);

    // Keep the current Owner's session token active so she is not locked out
    const sessionToken = req.cookies.get("ink_session_token")?.value;
    if (sessionToken && auth.user) {
      db.createSession(auth.user.email, auth.user.role);
    }

    return NextResponse.json({
      success: true,
      message: "The master access key has been securely updated. Other unlocked sessions have been invalidated.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to rotate access key" }, { status: 500 });
  }
}
