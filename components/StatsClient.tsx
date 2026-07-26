"use client";

import { useEffect, useState } from "react";

import type { StatsPayload } from "@/lib/types";
import { StatsCharts } from "@/components/StatsCharts";

export function StatsClient() {
  const [stats, setStats] = useState<StatsPayload | null>(null);

  useEffect(() => {
    void fetch("/api/stats")
      .then((response) => response.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-sm text-muted-foreground">Loading stats...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface p-5">
          <p className="text-sm text-muted-foreground">Watched</p>
          <p className="mt-2 text-3xl font-semibold">{stats.totals.watched}</p>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-muted-foreground">Currently watching</p>
          <p className="mt-2 text-3xl font-semibold">{stats.totals.watching}</p>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-muted-foreground">Watchlist</p>
          <p className="mt-2 text-3xl font-semibold">{stats.totals.watchlist}</p>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-muted-foreground">Hours watched</p>
          <p className="mt-2 text-3xl font-semibold">{stats.totals.hoursWatched}</p>
        </div>
      </div>
      <StatsCharts stats={stats} />
    </div>
  );
}
