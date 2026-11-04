import React from "react";
import { redirect } from "next/navigation";
import { getInkRoomSession } from "@/lib/auth";
import { InkRoomNav } from "@/components/InkRoomNav";

export const dynamic = "force-dynamic";

export default async function InkRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getInkRoomSession();

  // If not gate-unlocked or not logged in, redirect to gate
  if (!session.isGateUnlocked) {
    redirect("/ink-room/gate");
  }

  if (!session.isAuthenticated) {
    redirect("/ink-room/login");
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col md:flex-row">
      <InkRoomNav user={session.user!} />
      <main className="flex-1 overflow-y-auto min-h-screen p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
