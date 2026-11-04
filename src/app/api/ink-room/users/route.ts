import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession } from "@/lib/auth";

export async function GET() {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = db.getUsers();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated || auth.user?.role !== "Owner") {
    return NextResponse.json({ error: "Forbidden: Owner only" }, { status: 403 });
  }

  try {
    const { email, name, role } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const newUser = db.addUser(email, name, role || "Contributor");
    return NextResponse.json({ user: newUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add user" }, { status: 500 });
  }
}
