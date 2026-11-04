import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  if (all) {
    const auth = await getInkRoomSession();
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ collections: db.getCollections(false) });
  }

  return NextResponse.json({ collections: db.getCollections(true) });
}

export async function POST(req: NextRequest) {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Collection title is required" }, { status: 400 });
    }

    const saved = db.saveCollection(body);
    return NextResponse.json({ collection: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save collection" }, { status: 500 });
  }
}
