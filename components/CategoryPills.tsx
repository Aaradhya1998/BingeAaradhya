"use client";

import {
  Flame,
  Clapperboard,
  Compass,
  Sparkles,
  Heart,
  Ghost,
  Laugh,
  Film,
  Tv,
  Layers,
} from "lucide-react";

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories?: string[];
}

const DEFAULT_CATEGORIES = [
  { label: "Trending", value: "", icon: Flame },
  { label: "Sci-Fi", value: "Sci-Fi", icon: Compass },
  { label: "Animation", value: "Animation", icon: Sparkles },
  { label: "Action", value: "Action", icon: Clapperboard },
  { label: "Drama", value: "Drama", icon: Film },
  { label: "Romance", value: "Romance", icon: Heart },
  { label: "Comedy", value: "Comedy", icon: Laugh },
  { label: "Mystery", value: "Mystery", icon: Ghost },
];

export function CategoryPills({
  selectedCategory,
  onSelectCategory,
  categories,
}: CategoryPillsProps) {
  // Merge or map dynamic categories if provided
  const items = categories && categories.length > 0
    ? [
        { label: "All", value: "", icon: Flame },
        ...categories.map((cat) => {
          let IconComponent = Film;
          const lower = cat.toLowerCase();
          if (lower.includes("sci-fi")) IconComponent = Compass;
          else if (lower.includes("anim")) IconComponent = Sparkles;
          else if (lower.includes("action")) IconComponent = Clapperboard;
          else if (lower.includes("drama")) IconComponent = Film;
          else if (lower.includes("romance")) IconComponent = Heart;
          else if (lower.includes("comedy")) IconComponent = Laugh;
          else if (lower.includes("horror") || lower.includes("myst")) IconComponent = Ghost;
          else if (lower.includes("series") || lower.includes("tv")) IconComponent = Tv;
          return { label: cat, value: cat, icon: IconComponent };
        }),
      ]
    : DEFAULT_CATEGORIES;

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-1">
        {items.map((item) => {
          const isActive = selectedCategory === item.value;
          const Icon = item.icon;
          return (
            <button
              key={item.value || "all"}
              type="button"
              onClick={() => onSelectCategory(item.value)}
              className={`group flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#f5a623] text-slate-950 font-bold border border-[#f5a623] shadow-[0_0_20px_rgba(245,166,35,0.35)] scale-[1.02]"
                  : "border border-white/[0.12] bg-white/[0.07] text-slate-300 hover:border-white/25 hover:bg-white/[0.14] hover:text-white backdrop-blur-md"
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isActive
                    ? "stroke-[2.5] text-slate-950"
                    : "text-slate-400 group-hover:text-white group-hover:scale-110"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
