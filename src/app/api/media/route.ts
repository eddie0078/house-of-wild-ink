import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { getInkRoomSession } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function GET() {
  const media = db.getMedia();
  return NextResponse.json({ media });
}

export async function POST(req: NextRequest) {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("alt_text") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const credit = (formData.get("credit") as string) || "";
    const source = (formData.get("source") as string) || "";
    const focalX = parseFloat((formData.get("focal_x") as string) || "0.5");
    const focalY = parseFloat((formData.get("focal_y") as string) || "0.5");

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 10 MB size limit" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are permitted." },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const asset = db.saveMedia({
      filename: file.name,
      storage_url: `/uploads/${filename}`,
      mime_type: file.type,
      file_size_bytes: file.size,
      alt_text: altText,
      caption,
      credit,
      source,
      focal_point: { x: focalX, y: focalY },
      layout_suitability: ["inline", "wide", "cover"],
    });

    return NextResponse.json({ asset });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to upload image" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing media ID" }, { status: 400 });
  }

  const deleted = db.deleteMedia(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Cannot delete media: It is currently referenced by an active story, poem, or collection." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: "Media deleted successfully." });
}
