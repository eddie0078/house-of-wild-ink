import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get("ink_session_token")?.value;
  if (sessionToken) {
    db.destroySession(sessionToken);
  }

  const res = NextResponse.json({
    success: true,
    message: "The Ink Room is now securely locked. Return requires access key verification.",
  });

  res.cookies.delete("ink_gate_token");
  res.cookies.delete("ink_session_token");

  return res;
}
