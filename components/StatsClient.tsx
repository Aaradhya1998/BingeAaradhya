"use client";

import { useEffect, useState } from "react";
import type { StatsPayload } from "@/lib/types";
import { StatsCharts } from "@/components/StatsCharts";
import { CheckCircle2, PlayCircle, Clock, Sparkles } from "lucide-react";

export function StatsClient() {
  const [stats, setStats] = useState<StatsPayload | null>(null);

  useEffect(() => {
    void fetch("/api/stats")
      .then((response) => response.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-panel h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Watched Total */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completed
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-black tracking-tight text-white">
            {stats.totals.watched}
          </p>
          <p className="mt-1 text-xs text-slate-400">Films & Series watched</p>
        </div>

        {/* Currently Watching */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              In Progress
            </span>
            <PlayCircle className="h-4 w-4 text-[#f5a623]" />
          </div>
          <p className="mt-2 text-3xl font-black tracking-tight text-white">
            {stats.totals.watching}
          </p>
          <p className="mt-1 text-xs text-slate-400">Active titles on the go</p>
        </div>

        {/* Watchlist */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Watchlist
            </span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-2 text-3xl font-black tracking-tight text-white">
            {stats.totals.watchlist}
          </p>
          <p className="mt-1 text-xs text-slate-400">Queued for upcoming binges</p>
        </div>

        {/* Hours Watched */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Screen Time
            </span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-3xl font-black tracking-tight text-[#f5a623]">
            {stats.totals.hoursWatched}
            <span className="text-base font-normal text-slate-400 ml-1">hrs</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Estimated viewing duration</p>
        </div>
      </div>

      <StatsCharts stats={stats} />
    </div>
  );
}
