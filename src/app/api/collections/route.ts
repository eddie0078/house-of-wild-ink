import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession, hasPermission } from "@/lib/auth";

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

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getInkRoomSession();
    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role permission check
    if (!hasPermission(auth.user.role, "delete")) {
      return NextResponse.json(
        { error: `Your role (${auth.user.role}) cannot perform the 'delete' action.` },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Collection ID is required" }, { status: 400 });
    }

    const collection = db.getCollectionById(id);
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const success = db.deleteCollection(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted collection "${collection.title}".`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete collection" },
      { status: 500 }
    );
  }
}
