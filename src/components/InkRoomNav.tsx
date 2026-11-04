"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { UserRole } from "@/lib/types";
import {
  LayoutDashboard,
  Feather,
  BookOpen,
  Layers,
  Image as ImageIcon,
  Users,
  Mail,
  Users2,
  BarChart3,
  ShieldCheck,
  Lock,
  ExternalLink,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export function InkRoomNav({
  user,
}: {
  user: { email: string; name: string; role: UserRole };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLockNow = async () => {
    try {
      await fetch("/api/ink-room/auth/logout", { method: "POST" });
      router.push("/ink-room/gate");
    } catch {
      router.push("/ink-room/gate");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/ink-room", icon: LayoutDashboard },
    { label: "Poems", href: "/ink-room/poems", icon: Feather },
    { label: "Stories & Drama", href: "/ink-room/stories", icon: BookOpen },
    { label: "Collections", href: "/ink-room/collections", icon: Layers },
    { label: "Media Library", href: "/ink-room/media", icon: ImageIcon },
    { label: "People & Profiles", href: "/ink-room/people", icon: Users },
    { label: "Messages Desk", href: "/ink-room/messages", icon: Mail },
    { label: "Subscribers", href: "/ink-room/subscribers", icon: Users2 },
    { label: "First-Party Analytics", href: "/ink-room/analytics", icon: BarChart3 },
    { label: "Security & Access", href: "/ink-room/security", icon: ShieldCheck, ownerOnly: true },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-brand-forest text-brand-cream px-4 py-3 flex items-center justify-between border-b border-brand-gold/30">
        <div className="flex items-center gap-2">
          <BrandMark size={24} variant="light" />
          <span className="font-display font-bold text-sm tracking-tight">The Ink Room</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLockNow}
            className="px-2.5 py-1 rounded bg-brand-coral/90 text-brand-cream text-xs font-sans font-semibold flex items-center gap-1"
            title="Lock Ink Room Now"
          >
            <Lock className="w-3 h-3" />
            <span>Lock</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-brand-parchment"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop and Mobile Drawer) */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-brand-forest text-brand-cream shrink-0 flex flex-col justify-between border-r border-brand-gold/25 p-5 md:min-h-screen z-30`}
      >
        <div>
          {/* Header */}
          <div className="pb-6 border-b border-brand-gold/20 mb-6">
            <Link href="/ink-room" className="flex items-center gap-3">
              <BrandMark size={32} variant="light" />
              <div>
                <h2 className="font-display font-bold text-lg text-brand-cream tracking-tight leading-tight">
                  The Ink Room
                </h2>
                <span className="font-sans text-[10px] tracking-widest uppercase text-brand-gold-light">
                  Author Workspace
                </span>
              </div>
            </Link>

            {/* Logged in author info */}
            <div className="mt-4 p-2.5 rounded-xl bg-brand-parchment/10 border border-brand-gold/20 flex items-center justify-between text-xs font-sans">
              <div className="truncate mr-2">
                <span className="block font-semibold text-brand-cream truncate">{user.name}</span>
                <span className="text-[11px] text-brand-gold-light uppercase tracking-wider">{user.role}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active Session" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Ink Room Workspace Navigation">
            {navItems.map((item) => {
              if (item.ownerOnly && user.role !== "Owner") return null;

              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                    isActive
                      ? "bg-brand-gold text-brand-forest font-bold shadow-xs"
                      : "text-brand-parchment/85 hover:text-brand-cream hover:bg-brand-parchment/10"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-forest" : "text-brand-coral"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions: Public Site Link & Mandatory Lock Control */}
        <div className="pt-6 border-t border-brand-gold/20 space-y-3 mt-6">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans text-brand-gold-light hover:bg-brand-parchment/10 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Section 12: Lock Ink Room now button */}
          <button
            type="button"
            onClick={handleLockNow}
            className="w-full py-2.5 px-3 rounded-xl bg-brand-coral hover:bg-brand-coral/90 text-brand-cream font-sans font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Ink Room Now</span>
          </button>
        </div>
      </aside>
    </>
  );
}
