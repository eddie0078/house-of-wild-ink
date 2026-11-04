import React from "react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { db } from "@/lib/db";
import { Users, Feather, ArrowRight, ExternalLink } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "People & Profiles",
  description: "Contributors, collaborators, and writers connected to House of Wild Ink by Linda Emefa Daniels.",
};

export const dynamic = "force-dynamic";

export default function PeoplePage() {
  const people = db.getPeople(true);

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Voices & Collaborators</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-brand-forest font-bold tracking-tight mb-4">
            People & Profiles
          </h1>
          <p className="font-reading text-lg sm:text-xl text-brand-forest/80 leading-relaxed italic">
            The writers, editors, artists, and creators who lend their vision, craft, and voices to the House.
          </p>
        </div>

        {/* People Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {people.map((person) => {
            const selectedWorks = person.selected_work_ids
              .map((id) => db.getContentById(id))
              .filter((w): w is NonNullable<typeof w> => w !== undefined && w.status === "published");

            return (
              <article
                key={person.id}
                className="bg-brand-cream rounded-2xl p-8 sm:p-10 border border-brand-gold/25 shadow-xs hover:border-brand-gold transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Avatar / Monogram */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-brand-forest text-brand-gold-light flex items-center justify-center font-display font-bold text-2xl border border-brand-gold/40 shadow-xs">
                      {person.display_name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl text-brand-ink font-bold">
                        {person.display_name}
                      </h2>
                      <p className="font-sans text-xs text-brand-coral font-semibold uppercase tracking-wider mt-0.5">
                        {person.roles.join(" · ")}
                      </p>
                    </div>
                  </div>

                  <p className="font-reading text-brand-forest/90 text-base leading-relaxed mb-6">
                    {person.short_bio}
                  </p>

                  {person.full_bio && (
                    <p className="font-reading text-sm text-brand-forest/80 leading-relaxed mb-6">
                      {person.full_bio}
                    </p>
                  )}

                  {/* Connected Works */}
                  {selectedWorks.length > 0 && (
                    <div className="pt-6 border-t border-brand-gold/15 mb-6">
                      <h4 className="font-sans font-semibold text-xs tracking-wider uppercase text-brand-forest/70 mb-3">
                        Connected Works
                      </h4>
                      <ul className="space-y-2">
                        {selectedWorks.map((work) => (
                          <li key={work.id}>
                            <Link
                              href={work.content_type === "poem" ? `/poems/${work.slug}` : `/stories/${work.slug}`}
                              className="text-sm font-reading font-medium text-brand-forest hover:text-brand-coral transition-colors inline-flex items-center gap-1.5"
                            >
                              <Feather className="w-3 h-3 text-brand-coral" />
                              <span>{work.title}</span>
                              <span className="text-xs text-brand-forest/50 font-sans">
                                ({work.content_type})
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Social & Website Links */}
                {person.links && Object.keys(person.links).length > 0 && (
                  <div className="pt-6 border-t border-brand-gold/20 flex items-center gap-4 text-xs font-sans text-brand-forest/70">
                    {person.links.website && (
                      <a
                        href={person.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-coral transition-colors inline-flex items-center gap-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {person.links.twitter && (
                      <a
                        href={`https://twitter.com/${person.links.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-coral transition-colors"
                      >
                        @{person.links.twitter}
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </PublicShell>
  );
}
