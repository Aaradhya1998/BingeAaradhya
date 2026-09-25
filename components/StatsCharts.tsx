"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Sparkles } from "lucide-react";
import type { StatsPayload } from "@/lib/types";

const colors = ["#f5a623", "#38bdf8", "#a855f7", "#34d399", "#f43f5e", "#fb923c"];

const tooltipStyle = {
  backgroundColor: "#17222c",
  borderColor: "rgba(255,255,255,0.15)",
  borderRadius: "14px",
  color: "#f8fafc",
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
};

export function StatsCharts({ stats }: { stats: StatsPayload }) {
  const hasData =
    stats.byGenre.length > 0 || stats.ratings.length > 0 || stats.activity.length > 0;

  if (!hasData) {
    return (
      <div className="glass-panel p-10 text-center text-sm text-slate-400 sm:p-12">
        <Sparkles className="mx-auto h-9 w-9 text-[#f5a623] opacity-60 mb-2" />
        <p className="font-bold text-lg text-white">No Analytics Data Available Yet</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Add movies and TV shows to your database to view category breakdowns and rating statistics.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-panel p-6">
        <h3 className="mb-4 text-base font-bold text-white tracking-wide">
          Genre Breakdown
        </h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.byGenre}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={48}
                paddingAngle={3}
                isAnimationActive={false}
              >
                {stats.byGenre.map((item, index) => (
                  <Cell
                    key={item.label}
                    fill={colors[index % colors.length]}
                    stroke="#17222c"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#f8fafc" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="mb-4 text-base font-bold text-white tracking-wide">
          Ratings Distribution
        </h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.ratings}>
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#f8fafc" }} />
              <Bar dataKey="value" barSize={36} radius={[8, 8, 0, 0]} fill="#f5a623" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-6 lg:col-span-2">
        <h3 className="mb-4 text-base font-bold text-white tracking-wide">
          Watching Activity Over Time
        </h3>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stats.activity}>
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#f8fafc" }} />
              <Bar dataKey="value" barSize={28} radius={[8, 8, 0, 0]} fill="#38bdf8" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
