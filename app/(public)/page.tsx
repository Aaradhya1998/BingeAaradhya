export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { EntryCard } from "@/components/EntryCard";
import { RankedList } from "@/components/RankedList";

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

  return (
    <div className="space-y-10">
      <section className="surface overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Personal showcase</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              A living shelf for everything Aaradhya is watching, ranking, and recommending.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Current obsessions, all-time favorites, hand-picked recommendations, and a full archive that stays editable behind a simple admin gate.
            </p>
          </div>
          <div className="rounded-[28px] bg-[linear-gradient(135deg,_rgba(240,101,36,0.18),_rgba(255,255,255,0.86))] p-6">
            <p className="text-sm text-muted-foreground">This week&apos;s snapshot</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-semibold">{currentlyWatching.length}</p>
                <p className="text-sm text-muted-foreground">Currently watching</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">{top10.length}</p>
                <p className="text-sm text-muted-foreground">Top 10 slots filled</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Currently Watching</h2>
            <p className="text-sm text-muted-foreground">What&apos;s in progress right now.</p>
          </div>
        </div>
        {currentlyWatching.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {currentlyWatching.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="surface p-8 text-sm text-muted-foreground">
            Nothing is marked as currently watching yet.
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">My Top 10</h2>
          {top10.length ? (
            <RankedList listKey="top10" entries={top10} />
          ) : (
            <div className="surface p-8 text-sm text-muted-foreground">
              The all-time list is still being curated.
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Top 5 Recommendations</h2>
          {top5.length ? (
            <RankedList listKey="top5" entries={top5} />
          ) : (
            <div className="surface p-8 text-sm text-muted-foreground">
              Recommendations will appear here once they&apos;re pinned.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
