import React from "react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { BrandMark } from "@/components/BrandMark";
import { db } from "@/lib/db";
import { ArrowDown, ArrowRight, BookOpen, Feather, Sparkles, Heart } from "lucide-react";
import { QuoteCarousel } from "@/components/QuoteCarousel";
import { NewsletterForm } from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const settings = db.getSettings();
  const featuredPoem = settings.featured_poem_id ? db.getContentById(settings.featured_poem_id) : undefined;
  const featuredStory = settings.featured_story_id ? db.getContentById(settings.featured_story_id) : undefined;
  const collections = db.getCollections(true).slice(0, 3);
  const people = db.getPeople(true).slice(0, 4);

  return (
    <PublicShell>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-forest text-brand-cream border-b border-brand-gold/30">
        {/* Subtle Atmospheric Lighting & Architectural House Vignette */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-gold blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-coral blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-28 sm:pt-28 sm:pb-36 text-center flex flex-col items-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-parchment/10 border border-brand-gold/30 text-brand-gold-light text-xs font-sans tracking-widest uppercase mb-6">
            <Feather className="w-3.5 h-3.5 text-brand-coral" />
            <span>LINDA EMEFA DANIELS · WRITER</span>
          </div>

          {/* Large Editorial Wordmark */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-brand-cream mb-2 leading-none">
            House of Wild Ink
          </h1>

          {/* Refined Signature Line */}
          <p className="font-sans text-sm sm:text-base tracking-[0.25em] uppercase text-brand-gold-light mb-8">
            By Linda Emefa Daniels
          </p>

          {/* Exact Tagline */}
          <blockquote className="font-reading italic text-2xl sm:text-3xl lg:text-4xl text-brand-parchment max-w-3xl mb-8 leading-snug">
            “A home for stories that refuse to stay quiet.”
          </blockquote>

          {/* Warm Introduction to Linda's Writing */}
          <p className="font-sans text-base sm:text-lg text-brand-parchment/85 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Welcome inside. Here, poems, stories, short dramas, and quiet reflections find room to breathe.
            Every piece begins at the intersection of lived faith, honest emotion, and the words we carry together.
          </p>

          {/* Primary and Secondary Calls to Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="#featured"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-coral text-brand-cream font-sans font-semibold text-sm tracking-wide uppercase hover:bg-brand-coral/90 hover:scale-105 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Begin Reading</span>
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-brand-gold/60 text-brand-cream font-sans font-medium text-sm tracking-wide uppercase hover:bg-brand-parchment/10 transition-all flex items-center justify-center gap-2"
            >
              <span>Meet Linda</span>
              <ArrowRight className="w-4 h-4 text-brand-gold-light" />
            </Link>
          </div>

          {/* Restrained Scroll Prompt */}
          <div className="mt-16 sm:mt-20 flex flex-col items-center text-brand-parchment/50 text-xs font-sans tracking-widest uppercase">
            <span className="mb-2">Enter the House</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-brand-gold-light" />
          </div>
        </div>
      </section>

      {/* 2. ROTATING QUOTATION / "FROM THE NOTEBOOK" */}
      <section className="bg-brand-cream border-b border-brand-gold/20 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <QuoteCarousel quotes={settings.notebook_quotes} />
        </div>
      </section>

      {/* 3. FEATURED POEM & STORY SECTION */}
      <section id="featured" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-coral font-semibold">
            Curated from the Desk
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-brand-forest mt-1">
            Featured Literary Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Featured Poem Card */}
          {featuredPoem ? (
            <div className="bg-brand-cream rounded-2xl p-8 sm:p-10 border border-brand-gold/30 shadow-xs flex flex-col justify-between hover:border-brand-gold transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs font-sans tracking-wider uppercase text-brand-forest/70 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-brand-coral font-semibold">
                    <Feather className="w-3.5 h-3.5" />
                    Featured Poem
                  </span>
                  <span>{featuredPoem.reading_time_minutes} min read</span>
                </div>
                <h3 className="font-display text-3xl text-brand-ink mb-3">{featuredPoem.title}</h3>
                <p className="font-reading italic text-brand-forest/90 leading-relaxed whitespace-pre-line text-lg mb-6 line-clamp-4">
                  {featuredPoem.raw_content}
                </p>
              </div>
              <div className="pt-6 border-t border-brand-gold/20 flex items-center justify-between">
                <span className="text-xs font-sans text-brand-forest/70 uppercase">
                  {featuredPoem.author_credit}
                </span>
                <Link
                  href={`/poems/${featuredPoem.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-brand-coral hover:text-brand-forest transition-colors"
                >
                  <span>Read Poem</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-brand-gold/40 text-center flex flex-col items-center justify-center text-brand-forest/60">
              <p className="font-reading italic">No poem featured currently.</p>
            </div>
          )}

          {/* Featured Story or Short Drama Card */}
          {featuredStory ? (
            <div className="bg-brand-cream rounded-2xl p-8 sm:p-10 border border-brand-gold/30 shadow-xs flex flex-col justify-between hover:border-brand-gold transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs font-sans tracking-wider uppercase text-brand-forest/70 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-brand-coral font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    {featuredStory.content_type === "short_drama" ? "Featured Short Drama" : "Featured Story"}
                  </span>
                  <span>{featuredStory.reading_time_minutes} min read</span>
                </div>
                <h3 className="font-display text-3xl text-brand-ink mb-2">{featuredStory.title}</h3>
                {featuredStory.subtitle && (
                  <p className="font-sans text-sm text-brand-coral mb-3 font-medium">{featuredStory.subtitle}</p>
                )}
                <p className="font-reading text-brand-forest/90 leading-relaxed text-lg mb-6 line-clamp-4">
                  {featuredStory.excerpt}
                </p>
              </div>
              <div className="pt-6 border-t border-brand-gold/20 flex items-center justify-between">
                <span className="text-xs font-sans text-brand-forest/70 uppercase">
                  {featuredStory.author_credit}
                </span>
                <Link
                  href={`/stories/${featuredStory.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-brand-coral hover:text-brand-forest transition-colors"
                >
                  <span>Read {featuredStory.content_type === "short_drama" ? "Drama" : "Story"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-brand-gold/40 text-center flex flex-col items-center justify-center text-brand-forest/60">
              <p className="font-reading italic">No story featured currently.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. SELECTED COLLECTIONS */}
      {collections.length > 0 && (
        <section className="bg-brand-cream/60 py-20 px-6 border-t border-brand-gold/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="font-sans text-xs tracking-widest uppercase text-brand-coral font-semibold">
                  Volumes & Themes
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-brand-forest mt-1">
                  Selected Collections
                </h2>
              </div>
              <Link
                href="/collections"
                className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-brand-forest hover:text-brand-coral transition-colors"
              >
                <span>View all collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.map((coll) => (
                <Link
                  key={coll.id}
                  href={`/collections/${coll.slug}`}
                  className="group bg-brand-parchment rounded-xl p-8 border border-brand-gold/25 hover:border-brand-gold hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-sans tracking-wider uppercase text-brand-coral font-medium">
                      Collection
                    </span>
                    <h3 className="font-display text-2xl text-brand-forest group-hover:text-brand-coral transition-colors mt-2 mb-2">
                      {coll.title}
                    </h3>
                    {coll.subtitle && (
                      <p className="font-sans text-xs text-brand-forest/70 mb-3 italic">{coll.subtitle}</p>
                    )}
                    <p className="font-reading text-sm text-brand-forest/80 line-clamp-3 leading-relaxed">
                      {coll.description}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-brand-gold/20 flex items-center justify-between text-xs font-sans text-brand-forest/70">
                    <span>{coll.item_ids.length} works included</span>
                    <span className="group-hover:translate-x-1 transition-transform text-brand-coral font-semibold">
                      Explore →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. INTRODUCTION TO LINDA EMEFA DANIELS */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <BrandMark size={40} variant="dark" className="mx-auto mb-6" />
        <span className="font-sans text-xs tracking-widest uppercase text-brand-coral font-semibold">
          Author Statement
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-brand-forest mt-1 mb-6">
          Writing Our Stories
        </h2>
        <blockquote className="font-reading italic text-xl sm:text-2xl text-brand-ink leading-relaxed max-w-3xl mx-auto mb-8 selection:bg-brand-gold/30">
          “{settings.about_linda_statement}”
        </blockquote>
        <div className="inline-flex items-center gap-3">
          <Link
            href="/about"
            className="px-6 py-2.5 rounded-full border border-brand-forest text-brand-forest font-sans text-xs font-semibold tracking-wider uppercase hover:bg-brand-forest hover:text-brand-cream transition-all"
          >
            Read Linda’s Full Biography
          </Link>
        </div>
      </section>

      {/* 6. PEOPLE & COLLABORATORS PREVIEW */}
      {people.length > 0 && (
        <section className="bg-brand-cream/50 py-16 px-6 border-t border-brand-gold/20">
          <div className="max-w-7xl mx-auto text-center">
            <span className="font-sans text-xs tracking-widest uppercase text-brand-coral font-semibold">
              The Circle
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-brand-forest mt-1 mb-10">
              People & Voices
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {people.map((p) => (
                <div key={p.id} className="bg-brand-parchment p-6 rounded-xl border border-brand-gold/20 text-center">
                  <div className="w-14 h-14 rounded-full bg-brand-forest text-brand-gold-light mx-auto flex items-center justify-center font-display font-bold text-xl mb-3">
                    {p.display_name.charAt(0)}
                  </div>
                  <h4 className="font-display text-lg text-brand-forest font-semibold">{p.display_name}</h4>
                  <p className="font-sans text-xs text-brand-coral font-medium uppercase tracking-wider mb-2">
                    {p.roles.join(" · ")}
                  </p>
                  <p className="font-reading text-xs text-brand-forest/80 line-clamp-2 leading-relaxed">
                    {p.short_bio}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/people"
                className="text-xs font-sans font-semibold tracking-wider uppercase text-brand-forest hover:text-brand-coral transition-colors"
              >
                Meet all contributors & collaborators →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. NEWSLETTER INVITATION SECTION */}
      <section className="bg-brand-forest text-brand-cream py-20 px-6 border-t border-brand-gold/30">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-gold-light font-semibold">
            Direct Post
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-brand-cream mt-1 mb-4">
            Letters from the House
          </h2>
          <p className="font-reading italic text-brand-parchment/85 text-lg mb-8 leading-relaxed">
            Receive new poems, private reflections, and notices of upcoming works directly in your inbox.
            Quiet, intentional mailings with zero advertising.
          </p>
          <NewsletterForm sourcePage="/" />
        </div>
      </section>
    </PublicShell>
  );
}
