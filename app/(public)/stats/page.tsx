import { StatsClient } from "@/components/StatsClient";
import { BarChart3 } from "lucide-react";

export default function StatsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-[#f5a623]" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Stats & Analytics
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Personal viewing patterns, category distribution, ratings, and time spent.
        </p>
      </div>
      <StatsClient />
    </div>
  );
}
