import Image from "next/image";
import Link from "next/link";
import { Star, Play, Film, Tv, Clock } from "lucide-react";
import type { EntryRecord } from "@/lib/types";

function formatDate(date?: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function EntryCard({
  entry,
  compact = false,
  rank,
}: {
  entry: EntryRecord;
  compact?: boolean;
  rank?: number;
}) {
  // Compact list layout (used for dense rankings or admin list)
  if (compact) {
    return (
      <div className="glass-card flex items-center gap-3.5 p-3">
        {rank !== undefined && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5a623] text-xs font-bold text-slate-950 shadow-[0_0_12px_rgba(245,166,35,0.4)]">
            #{rank}
          </div>
        )}
        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-800">
          {entry.posterUrl ? (
            <Image
              src={entry.posterUrl}
              alt={entry.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-slate-500">
              No poster
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-white">{entry.title}</h4>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300">
              {entry.type}
            </span>
          </div>
          <p className="truncate text-xs text-slate-400">
            {entry.genres.join(" • ") || "Uncategorized"}
          </p>
          {entry.notes && (
            <p className="line-clamp-1 text-xs italic text-slate-400">“{entry.notes}”</p>
          )}
        </div>
        {typeof entry.rating === "number" && (
          <div className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-[#f5a623] border border-white/10">
            <Star className="h-3 w-3 fill-[#f5a623]" />
            <span>{entry.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    );
  }

  // Primary Flix-id 2:3 Movie Card Grid Layout
  return (
    <div className="group relative flex flex-col transition-transform duration-300 hover:-translate-y-1.5">
      {/* 2:3 Poster Frame */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[18px] border border-white/[0.12] bg-slate-800/80 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 group-hover:border-white/30 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        {entry.posterUrl ? (
          <Image
            src={entry.posterUrl}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-slate-800 to-slate-900 p-4 text-center text-slate-500">
            <Film className="h-8 w-8 opacity-40" />
            <span className="text-xs">No Poster Available</span>
          </div>
        )}

        {/* Ambient Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 transition-opacity duration-300 group-hover:from-slate-950/90" />

        {/* Top Badges Row */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {/* Personal Rating Badge */}
          {typeof entry.rating === "number" ? (
            <div className="flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-bold text-white border border-white/20 backdrop-blur-md shadow-md">
              <Star className="h-3 w-3 fill-[#f5a623] text-[#f5a623]" />
              <span>{entry.rating.toFixed(1)}</span>
            </div>
          ) : (
            <div />
          )}

          {/* Type / Rank Badge */}
          {rank !== undefined ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5a623] text-xs font-black text-slate-950 shadow-[0_0_10px_rgba(245,166,35,0.5)]">
              #{rank}
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300 border border-white/10 backdrop-blur-md">
              {entry.type === "Series" ? (
                <Tv className="h-2.5 w-2.5" />
              ) : (
                <Film className="h-2.5 w-2.5" />
              )}
              {entry.type}
            </div>
          )}
        </div>

        {/* Center Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 pointer-events-none">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5a623] text-slate-950 shadow-[0_0_25px_rgba(245,166,35,0.6)] transform scale-75 transition-transform duration-300 group-hover:scale-100">
            <Play className="h-5 w-5 fill-slate-950 translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Progress Tag (if watching) */}
        {entry.progressText && (
          <div className="absolute bottom-2.5 inset-x-2.5 rounded-lg border border-amber-400/30 bg-black/75 px-2.5 py-1 text-center text-[11px] font-medium text-amber-300 backdrop-blur-md shadow truncate">
            {entry.progressText}
          </div>
        )}
      </div>

      {/* Metadata Below Poster */}
      <div className="mt-2.5 space-y-0.5 px-0.5">
        <h3
          title={entry.title}
          className="truncate text-sm font-semibold tracking-tight text-white transition-colors duration-200 group-hover:text-[#f5a623]"
        >
          {entry.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{entry.releaseYear || entry.genres[0] || entry.type}</span>
          {entry.genres.length > 0 && entry.releaseYear && (
            <span className="truncate max-w-[100px] text-[11px] text-slate-500">
              {entry.genres[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
