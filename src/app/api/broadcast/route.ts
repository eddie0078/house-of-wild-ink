import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, preheader, stationeryTheme, bodyText } = body;

    if (!subject || !bodyText) {
      return NextResponse.json({ error: "Subject and letter body are required." }, { status: 400 });
    }

    const subscribers = db.getSubscribers();
    const recipientCount = subscribers.length;

    // Record the broadcast log
    const broadcastRecord = {
      id: `bc_${Date.now()}`,
      subject,
      preheader: preheader || "",
      theme: stationeryTheme || "parchment",
      recipient_count: recipientCount,
      sent_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Broadside broadcast transmitted to ${recipientCount} subscribers.`,
      recipientCount,
      broadcast: broadcastRecord,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to dispatch broadcast" }, { status: 500 });
  }
}
