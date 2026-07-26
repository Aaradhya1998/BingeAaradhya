import Image from "next/image";

import type { EntryRecord } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function formatDate(date?: Date | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function EntryCard({
  entry,
  compact = false,
}: {
  entry: EntryRecord;
  compact?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className={`grid gap-4 p-4 ${compact ? "grid-cols-[72px_1fr]" : "grid-cols-[96px_1fr]"}`}>
        <div className={`relative overflow-hidden rounded-2xl bg-muted ${compact ? "h-24 w-[72px]" : "h-32 w-24"}`}>
          {entry.posterUrl ? (
            <Image
              src={entry.posterUrl}
              alt={entry.title}
              fill
              className="object-cover"
              sizes="120px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No poster
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{entry.title}</h3>
              <Badge>{entry.type}</Badge>
              <Badge className="bg-secondary text-secondary-foreground">
                {entry.status.toLowerCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {entry.genres.join(" • ") || "Uncategorized"}
            </p>
          </div>
          {entry.synopsis ? (
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {entry.synopsis}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 text-sm">
            {typeof entry.rating === "number" ? <span>Rating: {entry.rating}/10</span> : null}
            {entry.progressText ? <span>Progress: {entry.progressText}</span> : null}
            {formatDate(entry.dateStarted) ? <span>Started: {formatDate(entry.dateStarted)}</span> : null}
            {formatDate(entry.dateWatched) ? <span>Watched: {formatDate(entry.dateWatched)}</span> : null}
          </div>
          {entry.notes ? <p className="text-sm italic text-muted-foreground">“{entry.notes}”</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
