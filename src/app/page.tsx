import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicShell } from "@/components/PublicShell";
import { BrandMark } from "@/components/BrandMark";
import { FloralDivider } from "@/components/FloralDivider";
import { FloralGarland } from "@/components/FloralGarland";
import { FloatingPetals } from "@/components/FloatingPetals";
import { SoundwaveIcon } from "@/components/SoundwaveIcon";
import {
  BougainvilleaBractCluster,
  BougainvilleaPhotoSprig,
  BougainvilleaCascadingVine,
  BougainvilleaDivider,
  BOUGAINVILLEA_COLORS,
  type BougainvilleaColor,
} from "@/components/Bougainvillea";
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
  Heart,
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
      <div className="floral-allover-pattern min-h-screen relative">
        {/* ======================================================== */}
        {/* 1. MASTER ARTWORK HERO WITH CASCADING BOUGAINVILLEA      */}
        {/* ======================================================== */}
        <section className="relative overflow-hidden min-h-[92vh] flex items-center justify-center border-b border-[#C5A059]/30">
          {/* Background Artwork: The Tuscan Villa Archway with Climbing Roses & Sunlit Library */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/house-of-wild-ink-hero.jpg"
              alt="House of Wild Ink Villa Archway with Climbing Roses and Sunlit Library"
              fill
              priority
              className="object-cover object-center sm:object-[center_right] filter brightness-[0.88] saturate-[1.08]"
              sizes="100vw"
            />
            {/* Atmospheric overlay: Deep emerald twilight gradient on left for impeccable reading contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#182C25]/95 via-[#182C25]/75 to-transparent lg:to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#182C25]/90 via-transparent to-black/30" />
          </div>

          {/* Cascading Bougainvillea Vines on Top Corners */}
          <BougainvilleaCascadingVine
            position="top-left"
            primaryColor="crimson"
            secondaryColor="magenta"
            className="hidden md:flex top-2 left-6 transform scale-110"
          />
          <BougainvilleaCascadingVine
            position="top-right"
            primaryColor="coral"
            secondaryColor="purple"
            className="hidden md:flex top-2 right-6 transform scale-110"
          />

          {/* Floating Bougainvillea Paper Bracts drifting gently across the breeze */}
          <FloatingPetals count={32} />

          {/* Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
            <div className="max-w-2xl lg:max-w-xl space-y-6 text-left">
              {/* Floral Eyebrow Pill with Scarlet Bougainvillea Bract */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-[#C5A059]/50 text-xs font-serif text-[#DFC182] shadow-sm">
                <BougainvilleaBractCluster color="crimson" size={20} className="filter drop-shadow-sm" />
                <span className="tracking-[0.2em] uppercase text-[11px] font-semibold text-[#FAF8F5]">
                  GOOD STORIES · BRAVER PEOPLE
                </span>
                <span className="text-[#C5A059]">✿</span>
              </div>

              {/* Exact Master Typography from Artwork */}
              <div>
                <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#FAF8F5] leading-[0.95] drop-shadow-md">
                  House <span className="font-serif italic font-normal text-[#DFC182] text-4xl sm:text-6xl">of</span>
                  <br />
                  <span className="font-serif italic text-[#DFC182] drop-shadow-sm font-normal">Wild </span>
                  <span className="text-[#FAF8F5]">Ink</span>
                </h1>

                {/* Subtitle Line */}
                <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-[#DFC182] mt-4 font-semibold">
                  BY LINDA EMEFA DANIELS
                </p>
              </div>

              {/* Fountain Pen Nib Divider from Image */}
              <div className="flex items-center gap-3 py-1 text-[#C5A059]" aria-hidden="true">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]" />
                <span className="text-xl text-[#DFC182] rotate-[-45deg] inline-block font-serif">✒</span>
                <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]" />
              </div>

              {/* Authentic Tagline */}
              <blockquote className="font-reading italic text-2xl sm:text-3xl text-[#FAF8F5] leading-snug drop-shadow-sm font-light">
                “A home for stories that refuse to stay quiet.”
              </blockquote>

              {/* Warm Welcome Description */}
              <p className="font-reading text-base sm:text-lg text-[#F7F4EE]/90 leading-relaxed font-normal max-w-lg">
                Step inside the open door. Here, poems, stories, spoken audio narratives, and quiet reflections find room to breathe among climbing bougainvillea blooms and sunlit bookshelves.
              </p>

              {/* Multi-Color Bougainvillea Spectrum Pill Strip */}
              <div className="flex items-center gap-2 pt-1 pb-1">
                <span className="text-[10px] uppercase tracking-widest font-serif text-[#DFC182]/80 mr-1">
                  Bougainvillea Bloom:
                </span>
                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D81E28] ring-1 ring-white/50" title="Scarlet Crimson" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D91E75] ring-1 ring-white/50" title="Fuchsia Magenta" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6F59] ring-1 ring-white/50" title="Sunset Coral" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8338EC] ring-1 ring-white/50" title="Royal Violet" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E09F3E] ring-1 ring-white/50" title="Golden Apricot" />
                </div>
              </div>

              {/* Four Virtues from the Artwork's Book Spines */}
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 text-[11px] font-serif uppercase tracking-widest text-[#DFC182]/90">
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs border border-[#C5A059]/30">Braver</span>
                <span className="text-[#D81E28]">•</span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs border border-[#C5A059]/30">Kinder</span>
                <span className="text-[#D91E75]">•</span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs border border-[#C5A059]/30">Wider</span>
                <span className="text-[#FF6F59]">•</span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs border border-[#C5A059]/30">Wiser</span>
              </div>

              {/* Interactive Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="#featured"
                  className="px-7 py-3.5 rounded-full bg-[#D81E28] hover:bg-[#b51720] text-white font-sans font-semibold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Begin Reading</span>
                </Link>

                <Link
                  href="/audio-stories"
                  className="px-7 py-3.5 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 border border-[#C5A059]/80 text-[#FAF8F5] font-sans font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-[#DFC182]" />
                  <span>Audio Stories</span>
                  <span className="text-[#FF6F59]">✿</span>
                </Link>

                <Link
                  href="/about"
                  className="px-5 py-3.5 rounded-full text-xs font-serif text-[#DFC182] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Meet Linda</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Archway Scroll Cue */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-[#DFC182]/80 text-[11px] font-serif tracking-widest uppercase pointer-events-none">
            <span className="text-xs mb-1">Enter The Garden</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#D81E28]" />
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. BOUGAINVILLEA MULTI-COLOR DIVIDER & QUOTE CAROUSEL    */}
        {/* ======================================================== */}
        <section className="relative py-12 px-6 bg-[#FAF8F5]/90 border-b border-[rgba(197,160,89,0.25)]">
          {/* Bougainvillea Divider featuring all 5 colors */}
          <BougainvilleaDivider className="mb-6" />

          <div className="max-w-4xl mx-auto">
            <QuoteCarousel quotes={settings.notebook_quotes} />
          </div>

          <FloralDivider variant="rose" className="mt-8 mb-0" />
        </section>

        {/* ======================================================== */}
        {/* 3. FEATURED LITERARY WORKS WITH BOUGAINVILLEA CORNERS     */}
        {/* ======================================================== */}
        <section id="featured" className="py-20 px-6 max-w-7xl mx-auto relative">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] text-xs font-serif text-[#D81E28]">
              <BougainvilleaBractCluster color="crimson" size={20} />
              <span className="tracking-widest uppercase text-[11px] font-semibold text-[#182C25]">
                Curated From The Desk
              </span>
              <BougainvilleaBractCluster color="magenta" size={20} />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#182C25] font-bold">
              Featured Literary Works
            </h2>
            <p className="font-reading italic text-base text-[#64746E]">
              Poems, short dramas, and stories crafted for the quiet corners of the heart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Featured Poem Card with Scarlet Crimson Bougainvillea Bract */}
            {featuredPoem ? (
              <div className="floral-card rounded-2xl p-8 sm:p-10 shadow-xs flex flex-col justify-between relative overflow-hidden">
                {/* Decorative Bougainvillea Bract in Top Corner */}
                <div className="absolute -top-1 -right-1 pointer-events-none opacity-85">
                  <BougainvilleaBractCluster color="crimson" size={48} className="transform rotate-12" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-sans tracking-wider uppercase text-[#64746E] mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[#D81E28] font-semibold">
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
                  <span className="text-xs font-serif text-[#64746E] flex items-center gap-1">
                    <span>❦</span>
                    <span>{featuredPoem.author_credit}</span>
                  </span>
                  <Link
                    href={`/poems/${featuredPoem.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-[#D81E28] hover:text-[#182C25] transition-colors"
                  >
                    <span>Read Poem</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Featured Story or Short Drama Card with Sunset Coral Bougainvillea */}
            {featuredStory ? (
              <div className="floral-card rounded-2xl p-8 sm:p-10 shadow-xs flex flex-col justify-between relative overflow-hidden">
                {/* Decorative Bougainvillea Bract in Top Corner */}
                <div className="absolute -top-1 -right-1 pointer-events-none opacity-85">
                  <BougainvilleaBractCluster color="coral" size={48} className="transform -rotate-12" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-sans tracking-wider uppercase text-[#64746E] mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[#E0533C] font-semibold">
                      <BookOpen className="w-3.5 h-3.5" />
                      {featuredStory.content_type === "short_drama" ? "Featured Short Drama" : "Featured Story"}
                    </span>
                    <span>{featuredStory.reading_time_minutes} min read</span>
                  </div>
                  <h3 className="font-display text-3xl text-[#182C25] mb-2">{featuredStory.title}</h3>
                  {featuredStory.subtitle && (
                    <p className="font-sans text-sm text-[#E0533C] mb-3 font-medium">{featuredStory.subtitle}</p>
                  )}
                  <p className="font-reading text-[#182C25]/90 leading-relaxed text-lg mb-6 line-clamp-4">
                    {featuredStory.excerpt}
                  </p>
                </div>
                <div className="pt-6 border-t border-[rgba(197,160,89,0.2)] flex items-center justify-between">
                  <span className="text-xs font-serif text-[#64746E] flex items-center gap-1">
                    <span>❦</span>
                    <span>{featuredStory.author_credit}</span>
                  </span>
                  <Link
                    href={`/stories/${featuredStory.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-[#E0533C] hover:text-[#182C25] transition-colors"
                  >
                    <span>Read {featuredStory.content_type === "short_drama" ? "Drama" : "Story"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. AUDIO STORIES SHOWCASE (YOUTUBE INTEGRATION & FLOWERS) */}
        {/* ======================================================== */}
        {audioStories.length > 0 && (
          <section className="py-20 px-6 border-y border-[rgba(197,160,89,0.25)] bg-[#FAF8F5]/85 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                <div>
                  <span className="font-serif text-xs tracking-widest uppercase text-[#D91E75] font-semibold flex items-center gap-2">
                    <BougainvilleaBractCluster color="magenta" size={22} />
                    <span>Spoken Word · Listen on YouTube</span>
                    <BougainvilleaBractCluster color="coral" size={20} />
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl text-[#182C25] mt-1 font-bold">
                    Audio Stories
                  </h2>
                  <p className="text-xs text-[#64746E] mt-1 font-reading text-sm">
                    Narrated by Linda Emefa Daniels — Click to open high-fidelity YouTube streams
                  </p>
                </div>
                <Link
                  href="/audio-stories"
                  className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#182C25] hover:text-[#D91E75] transition-colors"
                >
                  <span>Explore all audio recordings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {audioStories.map((audio, idx) => {
                  const cover = audio.cover_image_url || "/images/linda-emefa-daniels.jpg";
                  const yt = audio.youtube_url || "https://www.youtube.com";
                  const colors: ("crimson" | "magenta" | "purple")[] = ["crimson", "magenta", "purple"];
                  const cardColor = colors[idx % colors.length];

                  return (
                    <div
                      key={audio.id}
                      className="floral-card rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group relative"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={cover}
                          alt={audio.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                          <a
                            href={yt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-13 h-13 rounded-full bg-[#D81E28] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                            aria-label={`Listen to ${audio.title} on YouTube`}
                          >
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </a>
                        </div>
                        <div className="absolute top-3 left-3 bg-[#182C25]/85 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-sans">
                          <Clock className="w-2.5 h-2.5 text-[#C5A059]" />
                          <span>{audio.audio_duration || "Audio"}</span>
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <BougainvilleaBractCluster color={cardColor} size={24} className="filter drop-shadow-sm" />
                          <SoundwaveIcon isPlaying={true} className="bg-white/85 backdrop-blur-xs rounded-md py-0.5 px-1.5" />
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#D81E28] font-serif">
                            <span className="w-2 h-2 rounded-full bg-[#D81E28]" />
                            <span className="uppercase tracking-wider font-semibold text-[10px] text-[#64746E]">
                              Narrated by Linda
                            </span>
                          </div>
                          <h3 className="font-display text-xl text-[#182C25] font-bold hover:text-[#D81E28] transition-colors">
                            <Link href={`/audio-stories/${audio.slug}`}>{audio.title}</Link>
                          </h3>
                          <p className="text-xs text-[#182C25]/80 line-clamp-2 leading-relaxed font-reading text-sm">
                            {audio.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[rgba(197,160,89,0.2)] flex items-center justify-between">
                          <Link
                            href={`/audio-stories/${audio.slug}`}
                            className="text-xs font-serif text-[#182C25] hover:text-[#D81E28]"
                          >
                            Companion Notes →
                          </Link>
                          <a
                            href={yt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D81E28] text-white text-xs font-semibold hover:bg-[#b51720] transition shadow-xs cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-white" />
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

        {/* ======================================================== */}
        {/* 5. ESSAYS & THE INK ARCHIVE HIGHLIGHT                    */}
        {/* ======================================================== */}
        {essays.length > 0 && (
          <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="font-serif text-xs tracking-widest uppercase text-[#8338EC] font-semibold flex items-center gap-2">
                  <BougainvilleaBractCluster color="purple" size={22} />
                  <span>The Ink Archive</span>
                  <BougainvilleaBractCluster color="gold" size={20} />
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-[#182C25] mt-1 font-bold">
                  Essays & Articles
                </h2>
                <p className="text-xs text-[#64746E] mt-1 font-reading text-sm">
                  Long-form reflections, critical commentary, and meditations on writing
                </p>
              </div>
              <Link
                href="/essays"
                className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#182C25] hover:text-[#8338EC] transition-colors"
              >
                <span>Read all essays</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {essays.map((essay, idx) => (
                <div
                  key={essay.id}
                  className="floral-card rounded-2xl p-8 shadow-xs flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute -top-1 -right-1 pointer-events-none opacity-85">
                    <BougainvilleaBractCluster
                      color={idx === 0 ? "gold" : "purple"}
                      size={42}
                      className="transform rotate-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#64746E]">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8338EC] bg-[#8338EC]/10 px-2 py-0.5 rounded-full">
                        {essay.content_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5A059]" />
                        {essay.reading_time_minutes} min read
                      </span>
                    </div>

                    <h3 className="font-display text-2xl text-[#182C25] font-bold hover:text-[#8338EC] transition-colors">
                      <Link href={`/essays/${essay.slug}`}>{essay.title}</Link>
                    </h3>

                    {essay.subtitle && (
                      <p className="font-reading italic text-sm text-[#64746E]">{essay.subtitle}</p>
                    )}

                    <p className="font-reading text-base text-[#182C25]/85 line-clamp-3 leading-relaxed">
                      {essay.excerpt || essay.raw_content.slice(0, 160)}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[rgba(197,160,89,0.2)] flex items-center justify-between">
                    <span className="text-xs font-serif text-[#64746E]">
                      By <span className="font-semibold text-[#182C25]">{essay.author_credit}</span>
                    </span>
                    <Link
                      href={`/essays/${essay.slug}`}
                      className="text-xs font-semibold uppercase tracking-wider text-[#8338EC] hover:text-[#182C25] inline-flex items-center gap-1"
                    >
                      <span>Read Essay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* 6. SELECTED COLLECTIONS (THEMATIC VOLUMES)               */}
        {/* ======================================================== */}
        {collections.length > 0 && (
          <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[rgba(197,160,89,0.2)]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="font-sans text-xs tracking-widest uppercase text-[#D81E28] font-semibold flex items-center gap-1.5">
                  <BougainvilleaBractCluster color="coral" size={18} />
                  <span>Volumes & Themes</span>
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-[#182C25] mt-1 font-bold">
                  Curated Collections
                </h2>
              </div>
              <Link
                href="/collections"
                className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#182C25] hover:text-[#D81E28] transition-colors"
              >
                <span>View all collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.map((coll, idx) => {
                const colors: BougainvilleaColor[] = ["crimson", "magenta", "gold"];
                const collColor = colors[idx % colors.length];

                return (
                  <Link
                    key={coll.id}
                    href={`/collections/${coll.slug}`}
                    className="group floral-card rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-2 right-2 pointer-events-none opacity-80">
                      <BougainvilleaBractCluster color={collColor} size={32} />
                    </div>

                    <div>
                      <span className="text-[10px] font-sans tracking-wider uppercase text-[#D81E28] font-semibold bg-[#D81E28]/10 px-2 py-0.5 rounded-full">
                        Collection
                      </span>
                      <h3 className="font-display text-2xl text-[#182C25] group-hover:text-[#D81E28] transition-colors mt-3 mb-2 font-bold">
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
                      <span className="group-hover:translate-x-1 transition-transform text-[#D81E28] font-semibold">
                        Explore →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* 7. AUTHOR STATEMENT & LINDA'S PORTRAIT WITH VILLA VINES */}
        {/* ======================================================== */}
        <section className="py-24 px-6 border-t border-[rgba(197,160,89,0.25)] bg-[#FAF8F5]/90 relative overflow-hidden">
          <FloralGarland variant="header" className="mb-8" />
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Portrait in Arched Botanical Villa Frame with Bougainvillea Clusters */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-64 h-80 sm:w-72 sm:h-92 rounded-t-[140px] rounded-b-2xl overflow-hidden border-2 border-[rgba(197,160,89,0.45)] shadow-xl bg-[#FAF8F5] p-2.5">
                {/* Cascading Bougainvillea cluster over the arch */}
                <div className="absolute -top-1 -right-1 z-20 pointer-events-none">
                  <BougainvilleaBractCluster color="crimson" size={54} className="transform rotate-15" />
                </div>
                <div className="absolute -top-1 -left-1 z-20 pointer-events-none">
                  <BougainvilleaBractCluster color="magenta" size={44} className="transform -rotate-15" />
                </div>

                <div className="relative w-full h-full rounded-t-[130px] rounded-b-xl overflow-hidden">
                  <Image
                    src={portraitSrc}
                    alt="Author Linda Emefa Daniels"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 260px, 300px"
                  />
                </div>

                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#FAF8F5] border border-[rgba(197,160,89,0.5)] px-4 py-1 rounded-full text-[11px] text-[#D81E28] font-serif shadow-xs flex items-center gap-1.5 whitespace-nowrap z-20">
                  <span className="w-2 h-2 rounded-full bg-[#D81E28]" />
                  <span className="font-semibold text-[#182C25] uppercase tracking-wider text-[10px]">
                    L.E. Daniels | DEFFA
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#D91E75]" />
                </div>
              </div>

              {/* Bougainvillea Color Varieties Showcase under portrait */}
              <div className="mt-8 flex items-center gap-3">
                <BougainvilleaPhotoSprig color="crimson" size={44} className="shadow-xs hover:shadow-md" />
                <BougainvilleaPhotoSprig color="magenta" size={44} className="shadow-xs hover:shadow-md" />
                <BougainvilleaPhotoSprig color="coral" size={44} className="shadow-xs hover:shadow-md" />
                <BougainvilleaPhotoSprig color="purple" size={44} className="shadow-xs hover:shadow-md" />
                <BougainvilleaPhotoSprig color="gold" size={44} className="shadow-xs hover:shadow-md" />
              </div>
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#64746E] mt-2">
                Bougainvillea in 5 Palette Variations
              </span>
            </div>

            {/* Statement & Bio Details */}
            <div className="md:col-span-7 space-y-6 text-center md:text-left">
              <span className="font-serif text-xs tracking-widest uppercase text-[#D81E28] font-semibold flex items-center justify-center md:justify-start gap-1.5">
                <BougainvilleaBractCluster color="crimson" size={20} />
                <span>The Author’s Note</span>
                <BougainvilleaBractCluster color="coral" size={18} />
              </span>

              <h2 className="font-display text-3xl sm:text-4xl text-[#182C25] font-bold">
                Writing Our Stories
              </h2>

              <blockquote className="font-reading italic text-xl sm:text-2xl text-[#182C25] leading-relaxed border-l-3 border-[#D81E28] pl-5 md:pl-6 text-left selection:bg-[#C5A059]/30">
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
                <a
                  href={portraitSrc}
                  download="Linda-Emefa-Daniels-Portrait.jpg"
                  className="text-xs font-serif font-semibold text-[#D81E28] hover:underline flex items-center gap-1"
                >
                  Download Press Photograph ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 8. NEWSLETTER INVITATION: LETTERS FROM THE HOUSE         */}
        {/* ======================================================== */}
        <section className="bg-[#182C25] text-[#FAF8F5] py-20 px-6 border-t border-[rgba(197,160,89,0.3)] relative overflow-hidden">
          <BougainvilleaCascadingVine
            position="top-right"
            primaryColor="gold"
            secondaryColor="coral"
            className="hidden md:flex top-0 right-4 opacity-75"
          />

          <div className="max-w-2xl mx-auto text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-[#DFC182]">
              <BougainvilleaBractCluster color="gold" size={18} />
              <span>Direct Letters From Linda</span>
              <BougainvilleaBractCluster color="coral" size={18} />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#FAF8F5] font-bold">
              Letters from the House
            </h2>
            <p className="font-reading italic text-[#F7F4EE]/90 text-lg leading-relaxed">
              Receive new poems, audio stories, private reflections, and notices of upcoming works directly in your inbox.
              Quiet, intentional mailings with zero advertising.
            </p>
            <div className="pt-4">
              <NewsletterForm sourcePage="/" />
            </div>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
