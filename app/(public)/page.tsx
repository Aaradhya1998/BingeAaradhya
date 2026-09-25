export const dynamic = "force-dynamic";

import Link from "next/link";
import { Sparkles, Compass, Flame, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HeroDualBanners } from "@/components/HeroDualBanners";
import { HomeTrendingSection } from "@/components/HomeTrendingSection";
import { EntryCard } from "@/components/EntryCard";

export default async function HomePage() {
  const [currentlyWatching, top10, top5] = await Promise.all([
    prisma.entry.findMany({
      where: { status: "WATCHING" },
      orderBy: [{ dateStarted: "desc" }, { updatedAt: "desc" }],
      take: 8,
    }),
    prisma.entry.findMany({
      where: { isTop10: true },
      orderBy: { top10Rank: "asc" },
      take: 10,
    }),
    prisma.entry.findMany({
      where: { isTop5Rec: true },
      orderBy: { top5Rank: "asc" },
      take: 5,
    }),
  ]);

  // Extract unique genres across entries for dynamic category pill filtering
  const allGenres = Array.from(
    new Set([...currentlyWatching, ...top10, ...top5].flatMap((e) => e.genres))
  ).filter(Boolean);

  return (
    <div className="space-y-12">
      {/* 2. Hero Section: Dual-Banner Featured Cards (Flix-id Style) */}
      <section>
        <HeroDualBanners currentlyWatching={currentlyWatching} />
      </section>

      {/* 3, 4, 5. Category Pills + Section Header + 6-Column Card Grid */}
      <HomeTrendingSection
        initialEntries={top10.length > 0 ? top10 : currentlyWatching}
        allGenres={allGenres}
      />

      {/* Additional Showcase: Aaradhya's Top 5 Curated Recommendations */}
      {top5.length > 0 && (
        <section className="space-y-5 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-8">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#f5a623]" />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Aaradhya&apos;s Recommendations
                </h2>
                <span className="flex h-5 items-center justify-center rounded-full bg-[#f5a623]/20 px-2 text-xs font-semibold text-[#f5a623]">
                  Top 5
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Hand-picked titles I would unequivocally tell a friend to watch
              </p>
            </div>

            <Link
              href="/library"
              className="text-xs font-medium text-[#f5a623] hover:text-[#ffb733] transition-colors"
            >
              Explore all in library &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {top5.map((entry, index) => (
              <EntryCard
                key={`rec-${entry.id}`}
                entry={entry}
                rank={index + 1}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
