import React from "react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { BougainvilleaBractCluster, BougainvilleaDivider } from "@/components/Bougainvillea";
import { ShieldCheck, Lock, HeartHandshake, FileText, Mail, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Reader Sanctuary",
  description: "Our solemn commitment to reader privacy, zero third-party advertising tracking, and transparent first-party data stewardship at House of Wild Ink.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <PublicShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] text-xs font-serif text-[#D81E28]">
            <BougainvilleaBractCluster color="crimson" size={18} />
            <span className="tracking-widest uppercase text-[11px] font-semibold text-[#182C25]">
              Reader Sanctuary & Privacy
            </span>
            <BougainvilleaBractCluster color="gold" size={18} />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#182C25]">
            Privacy & First-Party Stewardship
          </h1>

          <p className="font-reading italic text-lg sm:text-xl text-[#64746E]">
            “Reading is an intimate, contemplative act. We honor your sanctuary.”
          </p>

          <p className="text-xs font-mono uppercase tracking-wider text-[#64746E]">
            Last Updated: November 2026 · House of Wild Ink
          </p>
        </div>

        <BougainvilleaDivider className="my-10" />

        <div className="space-y-12 font-reading text-lg text-[#182C25]/90 leading-relaxed">
          {/* Section 1: The Core Covenant */}
          <section className="floral-card bg-[#FAF8F5] rounded-2xl p-8 sm:p-10 border border-[rgba(197,160,89,0.3)] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-[#182C25] font-display text-2xl font-bold">
              <ShieldCheck className="w-6 h-6 text-[#D81E28]" />
              <h2>Our Core Covenant to Readers</h2>
            </div>
            <p>
              House of Wild Ink was founded by Linda Emefa Daniels as an unhurried digital sanctuary for poetry, drama, and personal reflections. We believe literature should never be entangled with surveillance capitalism, behavioural ad-profiling, or data brokerage.
            </p>
            <p className="font-sans text-sm font-semibold text-[#182C25]">
              We do not sell, rent, license, or trade your personal information. We do not load third-party tracking pixels (such as Google Analytics or Meta Pixel), cross-site advertising beacons, or commercial cookies.
            </p>
          </section>

          {/* Section 2: What Data We Collect & Why */}
          <section className="space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#182C25]">
              1. What Data We Collect and Why
            </h2>

            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold text-[#182C25]">A. Anonymous, First-Party Literary Telemetry</h3>
              <p>
                To understand how readers experience the archive—such as which stanzas evoke deep contemplation and which stories hold readers until the final beat—we measure aggregate, first-party reader engagement. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[#182C25]/85">
                <li>Page visits and reading dwell time (measured passively on the page without user fingerprints).</li>
                <li>Scroll completion milestones (e.g. reaching 25%, 50%, or 100% of a long poem or story).</li>
                <li>Voluntary interaction actions (e.g. copying a verse to clipboard or initiating an audio recording).</li>
              </ul>
              <p className="text-base text-[#64746E] italic">
                All telemetry is strictly aggregated and privacy-preserving. We do not build individual reader profiles or track you across the web.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold text-[#182C25]">B. Newsletter Subscriptions</h3>
              <p>
                When you voluntarily subscribe to the House of Wild Ink newsletter, we collect your email address. This is used solely to deliver occasional literary dispatches, new collection releases, and personal notes penned by Linda Emefa Daniels. Every email includes a one-click unsubscribe mechanism.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold text-[#182C25]">C. Direct Reader Inquiries</h3>
              <p>
                If you write to Linda through our contact desk, we collect your name, email address, inquiry topic, and message content. This communication is delivered directly to Linda’s private workspace in The Ink Room for personal response.
              </p>
            </div>
          </section>

          {/* Section 3: Processors & Infrastructure */}
          <section className="space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#182C25]">
              2. Infrastructure and Trusted Processors
            </h2>
            <p>
              To deliver high performance and uninterrupted reading globally, House of Wild Ink relies on the following infrastructure partners:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[rgba(197,160,89,0.3)]">
                <h4 className="font-bold text-[#182C25] mb-1">Vercel Inc. (Hosting & Edge)</h4>
                <p className="text-[#64746E]">
                  Serves site assets, renders pages via global Edge infrastructure, and processes API requests securely.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[rgba(197,160,89,0.3)]">
                <h4 className="font-bold text-[#182C25] mb-1">Upstash Redis (Session Storage)</h4>
                <p className="text-[#64746E]">
                  Provides encrypted, privacy-safe token verification and rate limiting for secure desk operations.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[rgba(197,160,89,0.3)]">
                <h4 className="font-bold text-[#182C25] mb-1">YouTube (Spoken Audio Streams)</h4>
                <p className="text-[#64746E]">
                  Official spoken word recordings hosted on YouTube are embedded with privacy-enhanced modes where applicable.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[rgba(197,160,89,0.3)]">
                <h4 className="font-bold text-[#182C25] mb-1">Local Ink Room Storage</h4>
                <p className="text-[#64746E]">
                  Archival texts, stanzas, and reader messages are preserved within our private, first-party database.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Data Retention & Reader Rights */}
          <section className="space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#182C25]">
              3. Data Retention and Your Rights
            </h2>
            <p>
              Under global privacy frameworks (including GDPR, CCPA, and best editorial practices), you hold unconditional sovereignty over your data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base text-[#182C25]/85">
              <li>
                <strong>One-Click Unsubscribe:</strong> You may opt out of our dispatches at any time via our{" "}
                <Link href="/unsubscribe" className="text-[#D81E28] underline underline-offset-2">
                  Peaceful Unsubscribe Page
                </Link>.
              </li>
              <li>
                <strong>Right of Erasure:</strong> To request complete deletion of your email address, contact records, or message history, write to Linda at{" "}
                <a href="mailto:lindaemefadaniels@gmail.com" className="text-[#D81E28] underline underline-offset-2">
                  lindaemefadaniels@gmail.com
                </a>. All records will be expunged within 7 business days.
              </li>
              <li>
                <strong>Right to Access:</strong> You may request a copy of any personal data associated with your email address by writing to us.
              </li>
            </ul>
          </section>

          {/* Section 5: Editorial Contact */}
          <section className="pt-8 border-t border-[rgba(197,160,89,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold text-[#182C25]">Questions or Privacy Requests?</h3>
              <p className="text-sm text-[#64746E] mt-1">
                Reach Linda Emefa Daniels directly at{" "}
                <a href="mailto:lindaemefadaniels@gmail.com" className="text-[#D81E28] font-semibold">
                  lindaemefadaniels@gmail.com
                </a>
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#182C25] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2D5A46] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to The Garden</span>
            </Link>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
