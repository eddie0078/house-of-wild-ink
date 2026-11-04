"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark, Wordmark } from "./BrandMark";
import { KeyRound, Menu, X } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Poems", href: "/poems" },
    { label: "Stories", href: "/stories" },
    { label: "Essays", href: "/essays" },
    { label: "Audio Stories", href: "/audio-stories" },
    { label: "Collections", href: "/collections" },
    { label: "About Linda", href: "/about" },
    { label: "People", href: "/people" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[rgba(197,160,89,0.3)] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Wordmark with Floral Blossom */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral rounded-lg p-1"
        >
          <div className="relative">
            <BrandMark size={36} variant="dark" className="group-hover:scale-105 transition-transform" />
            <span className="absolute -top-1 -right-1.5 text-[11px] text-[#C85A46] animate-pulse">🌸</span>
          </div>
          <Wordmark size="md" showSignature={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-sans font-medium rounded-md transition-all ${
                  isActive
                    ? "text-brand-coral font-semibold bg-brand-cream/80"
                    : "text-brand-forest/90 hover:text-brand-forest hover:bg-brand-cream/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Section 3: The Ink Room Door/Key Button */}
          <Link
            href="/ink-room/gate"
            className="ml-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-gold/60 text-brand-forest text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-forest hover:text-brand-cream hover:border-brand-forest transition-all shadow-xs"
            title="Private Author Entrance"
          >
            <KeyRound className="w-3.5 h-3.5 text-brand-coral" />
            <span>The Ink Room</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center lg:hidden gap-2">
          <Link
            href="/ink-room/gate"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-brand-gold/50 text-brand-forest text-xs font-sans font-medium hover:bg-brand-forest hover:text-brand-cream transition-all"
            aria-label="The Ink Room Door"
          >
            <KeyRound className="w-3 h-3 text-brand-coral" />
            <span>Ink Room</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-brand-forest hover:bg-brand-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-brand-gold/20 bg-brand-parchment px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-md text-base font-sans ${
                  isActive
                    ? "font-semibold text-brand-coral bg-brand-cream"
                    : "text-brand-forest hover:bg-brand-cream/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 mt-2 border-t border-brand-gold/20">
            <Link
              href="/ink-room/gate"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-brand-forest text-brand-forest font-sans text-sm font-semibold tracking-wide uppercase hover:bg-brand-forest hover:text-brand-cream transition-all"
            >
              <KeyRound className="w-4 h-4 text-brand-coral" />
              <span>Enter The Ink Room</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
