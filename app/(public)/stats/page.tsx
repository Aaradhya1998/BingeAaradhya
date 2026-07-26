import { StatsClient } from "@/components/StatsClient";

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Stats & Analytics</h1>
        <p className="text-muted-foreground">
          Genre breakdown, estimated hours watched, ratings distribution, and activity over time.
        </p>
      </div>
      <StatsClient />
    </div>
  );
}
