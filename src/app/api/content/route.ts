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
