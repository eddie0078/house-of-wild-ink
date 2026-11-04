import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicShell } from "@/components/PublicShell";
import { BrandMark } from "@/components/BrandMark";
import { FloralDivider } from "@/components/FloralDivider";
import { SoundwaveIcon } from "@/components/SoundwaveIcon";
import { db } from "@/lib/db";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Feather,
  Headphones,
  Play,
  Clock,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { QuoteCarousel } from "@/components/QuoteCarousel";
import { NewsletterForm } from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const settings = db.getSettings();
  const featuredPoem = settings.featured_poem_id ? db.getContentById(settings.featured_poem_id) : undefined;
  const featuredStory = settings.featured_story_id ? db.getContentById(settings.featured_story_id) : undefined;
  const audioStories = db.getContentItems({ type: "audio_story", status: "published" }).slice(0, 3);
  const essays = db.getContentItems({ status: "published" }).filter((i) =>
    ["essay", "article", "reflection"].includes(i.content_type)
  ).slice(0, 2);
  const collections = db.getCollections(true).slice(0, 3);
  const people = db.getPeople(true).slice(0, 4);

  const portraitSrc = settings.press_photo_url || "/images/linda-emefa-daniels.jpg";

  return (
    <PublicShell>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#182C25] text-[#FAF8F5] border-b border-[rgba(197,160,89,0.3)]">
        {/* Subtle Atmospheric Lighting & Architectural House Vignette */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C5A059] blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#C85A46] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center flex flex-col items-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[rgba(197,160,89,0.4)] text-[#DFC182] text-xs font-serif tracking-widest uppercase mb-6">
            <span className="text-[#C85A46]">🌸</span>
            <span>LINDA EMEFA DANIELS · WRITER</span>
            <span className="text-[#C5A059]">✿</span>
          </div>

          {/* Large Editorial Wordmark */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#FAF8F5] mb-2 leading-none">
            House of Wild Ink
          </h1>

          {/* Refined Signature Line */}
          <p className="font-serif text-sm sm:text-base tracking-[0.25em] uppercase text-[#DFC182] mb-8">
            By Linda Emefa Daniels
          </p>

          {/* Exact Tagline */}
          <blockquote className="font-reading italic text-2xl sm:text-3xl lg:text-4xl text-[#F7F4EE] max-w-3xl mb-8 leading-snug">
            “A home for stories that refuse to stay quiet.”
          </blockquote>

          {/* Warm Introduction to Linda's Writing */}
          <p className="font-sans text-base sm:text-lg text-[#F7F4EE]/85 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Welcome inside. Here, poems, stories, spoken audio narratives, short dramas, and quiet reflections find room to breathe.
            Every piece begins at the intersection of lived faith, honest emotion, and the words we carry together.
          </p>

          {/* Primary and Secondary Calls to Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="#featured"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C85A46] text-white font-sans font-semibold text-sm tracking-wide uppercase hover:bg-[#b04a38] hover:scale-105 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Begin Reading</span>
            </Link>
            <Link
              href="/audio-stories"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[rgba(197,160,89,0.7)] text-[#FAF8F5] font-sans font-medium text-sm tracking-wide uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Headphones className="w-4 h-4 text-[#DFC182]" />
              <span>Audio Stories</span>
            </Link>
          </div>

          {/* Restrained Scroll Prompt */}
          <div className="mt-14 sm:mt-18 flex flex-col items-center text-[#F7F4EE]/50 text-xs font-sans tracking-widest uppercase">
            <span className="mb-2">Enter the House</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-[#DFC182]" />
          </div>
        </div>
      </section>

      {/* 2. ROTATING QUOTATION / "FROM THE NOTEBOOK" */}
      <section className="bg-[#FAF8F5] border-b border-[rgba(197,160,89,0.2)] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <QuoteCarousel quotes={settings.notebook_quotes} />
        </div>
      </section>

      {/* 3. FEATURED POEM & STORY SECTION */}
      <section id="featured" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-widest uppercase text-[#C85A46] font-semibold flex items-center justify-center gap-1.5">
            <span>🌸</span>
            <span>Curated from the Desk</span>
            <span>✿</span>
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#182C25] mt-1">
            Featured Literary Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Featured Poem Card */}
          {featuredPoem ? (
            <div className="floral-card bg-[#FAF8F5] rounded-2xl p-8 sm:p-10 border border-[rgba(197,160,89,0.3)] shadow-xs flex flex-col justify-between hover:border-[#C5A059] transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs font-sans tracking-wider uppercase text-[#64746E] mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[#C85A46] font-semibold">
                    <Feather className="w-3.5 h-3.5" />
                    Featured Poem
                  </span>
                  <span>{featuredPoem.reading_time_minutes} min read</span>
                </div>
                <h3 className="font-display text-3xl text-[#182C25] mb-3">{featuredPoem.title}</h3>
                <p className="poetry-content text-[#182C25]/90 leading-relaxed text-lg mb-6 line-clamp-4">
                  {featuredPoem.raw_content}
                </p>
              </div>
              <div className="pt-6 border-t border-[rgba(197,160,89,0.2)] flex items-center justify-between">
                <span className="text-xs font-serif text-[#64746E]">
                  {featuredPoem.author_credit}
                </span>
                <Link
                  href={`/poems/${featuredPoem.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-[#C85A46] hover:text-[#182C25] transition-colors"
                >
                  <span>Read Poem</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-[rgba(197,160,89,0.4)] text-center flex flex-col items-center justify-center text-[#64746E]">
              <p className="font-reading italic">No poem featured currently.</p>
            </div>
          )}

          {/* Featured Story or Short Drama Card */}
          {featuredStory ? (
            <div className="floral-card bg-[#FAF8F5] rounded-2xl p-8 sm:p-10 border border-[rgba(197,160,89,0.3)] shadow-xs flex flex-col justify-between hover:border-[#C5A059] transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs font-sans tracking-wider uppercase text-[#64746E] mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[#C85A46] font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    {featuredStory.content_type === "short_drama" ? "Featured Short Drama" : "Featured Story"}
                  </span>
                  <span>{featuredStory.reading_time_minutes} min read</span>
                </div>
                <h3 className="font-display text-3xl text-[#182C25] mb-2">{featuredStory.title}</h3>
                {featuredStory.subtitle && (
                  <p className="font-sans text-sm text-[#C85A46] mb-3 font-medium">{featuredStory.subtitle}</p>
                )}
                <p className="font-reading text-[#182C25]/90 leading-relaxed text-lg mb-6 line-clamp-4">
                  {featuredStory.excerpt}
                </p>
              </div>
              <div className="pt-6 border-t border-[rgba(197,160,89,0.2)] flex items-center justify-between">
                <span className="text-xs font-serif text-[#64746E]">
                  {featuredStory.author_credit}
                </span>
                <Link
                  href={`/stories/${featuredStory.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-[#C85A46] hover:text-[#182C25] transition-colors"
                >
                  <span>Read {featuredStory.content_type === "short_drama" ? "Drama" : "Story"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-[rgba(197,160,89,0.4)] text-center flex flex-col items-center justify-center text-[#64746E]">
              <p className="font-reading italic">No story featured currently.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. NEW: AUDIO STORIES SHOWCASE WITH YOUTUBE INTEGRATION */}
      {audioStories.length > 0 && (
        <section className="bg-[#FAF8F5] py-20 px-6 border-y border-[rgba(197,160,89,0.25)] floral-watermark">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="font-serif text-xs tracking-widest uppercase text-[#C85A46] font-semibold flex items-center gap-1.5">
                  <span>🌸</span>
                  <span>Spoken Word & Narratives</span>
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-[#182C25] mt-1">
                  Audio Stories
                </h2>
                <p className="text-xs text-[#64746E] mt-1">
                  Narrated by Linda Emefa Daniels — Listen directly on YouTube
                </p>
              </div>
              <Link
                href="/audio-stories"
                className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#182C25] hover:text-[#C85A46] transition-colors"
              >
                <span>View all audio pieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {audioStories.map((audio) => {
                const cover = audio.cover_image_url || "/images/linda-emefa-daniels.jpg";
                const yt = audio.youtube_url || "https://www.youtube.com";

                return (
                  <div
                    key={audio.id}
                    className="floral-card bg-white rounded-2xl overflow-hidden border border-[rgba(197,160,89,0.3)] shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-video overflow-hidden group">
                      <Image
                        src={cover}
                        alt={audio.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <a
                          href={yt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-[#C85A46] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                          aria-label={`Listen to ${audio.title} on YouTube`}
                        >
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </a>
                      </div>
                      <div className="absolute top-2.5 left-2.5 bg-[#182C25]/85 text-white px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#C5A059]" />
                        <span>{audio.audio_duration || "Audio"}</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-semibold text-[#64746E] tracking-wider">
                            Narrated by Linda
                          </span>
                          <SoundwaveIcon isPlaying={true} />
                        </div>
                        <h3 className="font-display text-xl text-[#182C25] font-bold hover:text-[#C85A46] transition-colors">
                          <Link href={`/audio-stories/${audio.slug}`}>{audio.title}</Link>
                        </h3>
                        <p className="text-xs text-[#182C25]/80 line-clamp-2 leading-relaxed">
                          {audio.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[rgba(197,160,89,0.2)] flex items-center justify-between">
                        <Link
                          href={`/audio-stories/${audio.slug}`}
                          className="text-xs font-serif text-[#182C25] hover:text-[#C85A46]"
                        >
                          Notes →
                        </Link>
                        <a
                          href={yt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C85A46] text-white text-[11px] font-semibold hover:bg-[#b04a38] transition"
                        >
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>YouTube ↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. SELECTED COLLECTIONS */}
      {collections.length > 0 && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="font-sans text-xs tracking-widest uppercase text-[#C85A46] font-semibold">
                Volumes & Themes
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#182C25] mt-1">
                Selected Collections
              </h2>
            </div>
            <Link
              href="/collections"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#182C25] hover:text-[#C85A46] transition-colors"
            >
              <span>View all collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((coll) => (
              <Link
                key={coll.id}
                href={`/collections/${coll.slug}`}
                className="group floral-card bg-[#FAF8F5] rounded-2xl p-8 border border-[rgba(197,160,89,0.25)] hover:border-[#C5A059] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-sans tracking-wider uppercase text-[#C85A46] font-medium">
                    Collection
                  </span>
                  <h3 className="font-display text-2xl text-[#182C25] group-hover:text-[#C85A46] transition-colors mt-2 mb-2">
                    {coll.title}
                  </h3>
                  {coll.subtitle && (
                    <p className="font-sans text-xs text-[#64746E] mb-3 italic">{coll.subtitle}</p>
                  )}
                  <p className="font-reading text-sm text-[#182C25]/80 line-clamp-3 leading-relaxed">
                    {coll.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[rgba(197,160,89,0.2)] flex items-center justify-between text-xs font-sans text-[#64746E]">
                  <span>{coll.item_ids.length} works included</span>
                  <span className="group-hover:translate-x-1 transition-transform text-[#C85A46] font-semibold">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. INTRODUCTION TO LINDA EMEFA DANIELS WITH OFFICIAL PORTRAIT */}
      <section className="bg-[#FAF8F5] py-24 px-6 border-t border-[rgba(197,160,89,0.25)] floral-watermark">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Portrait in Botanical Vignette */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-t-[100px] rounded-b-2xl overflow-hidden border-2 border-[rgba(197,160,89,0.4)] shadow-lg bg-[#FAF8F5] p-2">
              <div className="relative w-full h-full rounded-t-[90px] rounded-b-xl overflow-hidden">
                <Image
                  src={portraitSrc}
                  alt="Author Linda Emefa Daniels"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 240px, 280px"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FAF8F5] border border-[rgba(197,160,89,0.4)] px-3 py-0.5 rounded-full text-[10px] text-[#C85A46] font-serif shadow-xs flex items-center gap-1">
                <span>🌸</span>
                <span>L.E. Daniels</span>
              </div>
            </div>
          </div>

          {/* Statement & Bio Details */}
          <div className="md:col-span-8 space-y-6 text-center md:text-left">
            <span className="font-serif text-xs tracking-widest uppercase text-[#C85A46] font-semibold flex items-center justify-center md:justify-start gap-1.5">
              <span>🌸</span>
              <span>Author Statement</span>
              <span>✿</span>
            </span>

            <h2 className="font-display text-3xl sm:text-4xl text-[#182C25] font-bold">
              Writing Our Stories
            </h2>

            <blockquote className="font-reading italic text-lg sm:text-xl text-[#182C25] leading-relaxed selection:bg-[#C5A059]/30 border-l-2 border-[#C85A46] pl-4 md:pl-6 text-left">
              “{settings.about_linda_statement}”
            </blockquote>

            <p className="font-sans text-xs text-[#64746E] uppercase tracking-widest font-semibold">
              — L.E. Daniels | DEFFA
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                href="/about"
                className="px-6 py-2.5 rounded-full border border-[#182C25] text-[#182C25] font-sans text-xs font-semibold tracking-wider uppercase hover:bg-[#182C25] hover:text-[#FAF8F5] transition-all"
              >
                Read Linda’s Full Biography
              </Link>
              <Link
                href="/essays"
                className="text-xs font-serif font-semibold text-[#C85A46] hover:underline flex items-center gap-1"
              >
                Explore Essays & Articles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER INVITATION SECTION */}
      <section className="bg-[#182C25] text-[#FAF8F5] py-20 px-6 border-t border-[rgba(197,160,89,0.3)]">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-sans text-xs tracking-widest uppercase text-[#DFC182] font-semibold">
            Direct Post
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#FAF8F5] mt-1 mb-4">
            Letters from the House
          </h2>
          <p className="font-reading italic text-[#F7F4EE]/85 text-lg mb-8 leading-relaxed">
            Receive new poems, audio stories, private reflections, and notices of upcoming works directly in your inbox.
            Quiet, intentional mailings with zero advertising.
          </p>
          <NewsletterForm sourcePage="/" />
        </div>
      </section>
    </PublicShell>
  );
}
