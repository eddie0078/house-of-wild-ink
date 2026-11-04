import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) {
    return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
  }

  const revisions = db.getRevisions(itemId);
  return NextResponse.json({ revisions });
}

export async function POST(req: NextRequest) {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { revisionId } = await req.json();
    if (!revisionId) {
      return NextResponse.json({ error: "Missing revisionId" }, { status: 400 });
    }

    const restored = db.restoreRevision(revisionId, auth.user.name);
    if (!restored) {
      return NextResponse.json({ error: "Revision not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Restored to version from history. A new revision has been created to preserve complete history.`,
      item: restored,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to restore revision" }, { status: 500 });
  }
}
