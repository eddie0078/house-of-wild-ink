import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession, hasPermission } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = db.getContentById(id);

  if (!item) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  if (item.status !== "published") {
    const auth = await getInkRoomSession();
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access to unpublished draft" }, { status: 403 });
    }
  }

  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(auth.user.role, "delete")) {
    return NextResponse.json({ error: "Forbidden: You lack delete permission." }, { status: 403 });
  }

  const success = db.deleteContentItem(id);
  if (!success) {
    return NextResponse.json({ error: "Item not found or already deleted" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Item deleted successfully." });
}
