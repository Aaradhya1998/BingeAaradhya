import Image from "next/image";
import Link from "next/link";
import { Play, Star, Sparkles, Tv, Film, Info } from "lucide-react";
import type { EntryRecord } from "@/lib/types";

interface HeroDualBannersProps {
  currentlyWatching: EntryRecord[];
}

export function HeroDualBanners({
  currentlyWatching,
}: HeroDualBannersProps) {
  // Take up to 2 items from currentlyWatching (strictly status: "WATCHING")
  const banners = currentlyWatching.slice(0, 2);

  if (banners.length === 0) {
    return (
      <div className="glass-panel p-8 text-center sm:p-12">
        <Sparkles className="mx-auto h-10 w-10 text-[#f5a623]" />
        <h2 className="mt-3 text-2xl font-bold text-white">No Currently Watching Titles</h2>
        <p className="mt-1 text-sm text-slate-400">
          No shows or movies marked as &quot;Currently Watching&quot; in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {banners.map((entry, idx) => {
        const isWatching = entry.status === "WATCHING";
        const imageSource = entry.backdropUrl || entry.posterUrl;

        return (
          <div
            key={`${entry.id}-${idx}`}
            className="group relative flex aspect-[16/10] sm:aspect-[16/9] min-h-[300px] sm:min-h-[340px] flex-col justify-between overflow-hidden rounded-[26px] border border-white/[0.14] bg-slate-950/80 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-300 hover:border-white/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
          >
            {/* Background Artwork with Zoom on Hover */}
            {imageSource && (
              <Image
                src={imageSource}
                alt={entry.title}
                fill
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
            )}

            {/* Cinematic Gradient Overlays for Readability */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111922] via-[#111922]/65 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#111922]/85 via-transparent to-[#111922]/40" />

            {/* Top Bar inside Banner */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md shadow-md">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isWatching ? "bg-emerald-400 animate-pulse" : "bg-[#f5a623]"
                    }`}
                  />
                  {isWatching ? "CURRENTLY WATCHING" : "FEATURED SPOTLIGHT"}
                </span>
                {entry.type && (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-300 backdrop-blur-md">
                    {entry.type === "Series" ? (
                      <Tv className="h-3 w-3" />
                    ) : (
                      <Film className="h-3 w-3" />
                    )}
                    {entry.type}
                  </span>
                )}
              </div>

              {typeof entry.rating === "number" && (
                <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-md">
                  <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" />
                  <span>{entry.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Bottom Content inside Banner */}
            <div className="relative z-10 space-y-3 pt-8">
              {/* Category / Genre Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#f5a623]">
                {entry.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-black/40 border border-white/10 px-2.5 py-0.5 backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
                {entry.releaseYear && (
                  <span className="text-slate-400">• {entry.releaseYear}</span>
                )}
                {entry.runtimeMin && (
                  <span className="text-slate-400">• {entry.runtimeMin}m</span>
                )}
              </div>

              {/* Bold 36-48px Headline Title */}
              <h2 className="line-clamp-1 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl drop-shadow-md">
                {entry.title}
              </h2>

              {/* Progress & Synopsis */}
              <p className="line-clamp-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {entry.progressText && (
                  <span className="mr-2 font-semibold text-amber-300">
                    [{entry.progressText}]
                  </span>
                )}
                {entry.synopsis || entry.notes || "Personal showcase item."}
              </p>

              {/* Buttons Row */}
              <div className="flex items-center gap-3 pt-1">
                <Link
                  href={`/library?search=${encodeURIComponent(entry.title)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f5a623] px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(245,166,35,0.45)] transition-all duration-200 hover:bg-[#ffb733] hover:scale-105 active:scale-95"
                >
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>Let&apos;s Play</span>
                </Link>

                <Link
                  href={`/library?search=${encodeURIComponent(entry.title)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white/35 hover:bg-white/20"
                >
                  <Info className="h-4 w-4" />
                  <span>Details</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
