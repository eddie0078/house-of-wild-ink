import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession } from "@/lib/auth";

export async function GET() {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = db.getAnalyticsSummary();
  return NextResponse.json(summary);
}

export async function POST(req: NextRequest) {
  try {
    const { path, contentType, engaged, shared } = await req.json();

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    db.logPageView(path, contentType || "page", !!engaged, !!shared);
    return NextResponse.json({ logged: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to log event" }, { status: 500 });
  }
}
