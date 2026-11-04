import React from "react";
import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { KeyRound, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-forest text-brand-cream border-t border-brand-gold/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Identity & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <BrandMark size={36} variant="light" />
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-brand-cream">
                  House of Wild Ink
                </h3>
                <p className="font-sans text-xs tracking-widest uppercase text-brand-gold-light">
                  By Linda Emefa Daniels
                </p>
              </div>
            </div>
            <p className="font-reading italic text-brand-parchment/90 text-lg max-w-md pt-2">
              “A home for stories that refuse to stay quiet.”
            </p>
            <p className="font-sans text-xs text-brand-parchment/60 leading-relaxed max-w-md">
              A literary home for poems, stories, short dramas, essays, reflections and other writing.
            </p>
          </div>

          {/* Public Destinations */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-xs tracking-widest uppercase text-brand-gold-light">
              Destinations
            </h4>
            <ul className="space-y-2 text-sm font-sans text-brand-parchment/80">
              <li>
                <Link href="/poems" className="hover:text-brand-coral transition-colors">
                  Poems
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-brand-coral transition-colors">
                  Stories & Prose
                </Link>
              </li>
              <li>
                <Link href="/essays" className="hover:text-brand-coral transition-colors">
                  Essays & Articles
                </Link>
              </li>
              <li>
                <Link href="/audio-stories" className="hover:text-brand-coral transition-colors">
                  Audio Stories
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-brand-coral transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-coral transition-colors">
                  About Linda
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-brand-coral transition-colors">
                  People & Profiles
                </Link>
              </li>
            </ul>
          </div>

          {/* Literary Room & Inquiries */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-xs tracking-widest uppercase text-brand-gold-light">
              Dialogue
            </h4>
            <ul className="space-y-2 text-sm font-sans text-brand-parchment/80">
              <li>
                <Link href="/newsletter" className="inline-flex items-center gap-1.5 hover:text-brand-coral transition-colors">
                  <Mail className="w-3.5 h-3.5 text-brand-gold-light" />
                  <span>The Newsletter</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-flex items-center gap-1.5 hover:text-brand-coral transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-gold-light" />
                  <span>Send a Message</span>
                </Link>
              </li>
              <li className="pt-3">
                <Link
                  href="/ink-room/gate"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/40 text-brand-parchment text-xs font-sans hover:bg-brand-gold hover:text-brand-forest transition-all"
                >
                  <KeyRound className="w-3.5 h-3.5 text-brand-coral" />
                  <span>The Ink Room</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-gold/15 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-parchment/60 gap-4">
          <p>© {new Date().getFullYear()} House of Wild Ink by Linda Emefa Daniels. All rights reserved.</p>
          <p className="font-reading italic text-brand-parchment/70">
            Pen-name presentation: L.E. Daniels | DEFFA
          </p>
        </div>
      </div>
    </footer>
  );
}
