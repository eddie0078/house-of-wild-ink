import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession, hasPermission } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || undefined;
  const status = searchParams.get("status") || "published";
  const collectionId = searchParams.get("collectionId") || undefined;

  // If status is not "published", require authentication
  if (status !== "published") {
    const auth = await getInkRoomSession();
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access to drafts." }, { status: 403 });
    }
  }

  const items = db.getContentItems({ type, status, collectionId });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getInkRoomSession();
    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Role permission check
    const action = body.status === "published" ? "publish" : "create";
    if (!hasPermission(auth.user.role, action)) {
      return NextResponse.json(
        { error: `Your role (${auth.user.role}) cannot perform the '${action}' action.` },
        { status: 403 }
      );
    }

    const saved = db.saveContentItem(body, auth.user.name || "Author");
    return NextResponse.json({ item: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save content" }, { status: 500 });
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
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 });
    }

    const item = db.getContentById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Create a safety revision snapshot in the vault before deletion so it can be restored
    try {
      db.saveRevision(id, item.content_type, item, `Pre-deletion safety snapshot of '${item.title}'`);
    } catch (err) {
      console.warn("Failed to create pre-deletion revision snapshot:", err);
    }

    const success = db.deleteContentItem(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete item from database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Successfully deleted "${item.title}".` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete content" }, { status: 500 });
  }
}
