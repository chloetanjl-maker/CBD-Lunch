"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/categories";
import type { DealDTO } from "@/lib/types";
import DealCard from "@/components/DealCard";

// Leaflet touches `window` at module load, so it can't be server-rendered.
const DealsMap = dynamic(() => import("@/components/DealsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-900">
      Loading map...
    </div>
  ),
});

type CategoryFilter = "all" | Category;
type SortOrder = "price-asc" | "price-desc" | "name-asc";
type MobilePane = "list" | "map";

export default function DealsBrowser({ deals }: { deals: DealDTO[] }) {
  const [mobilePane, setMobilePane] = useState<MobilePane>("map");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("price-asc");

  const filtered = useMemo(() => {
    let result = deals;

    if (category !== "all") {
      result = result.filter((d) => d.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.restaurant.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q) ||
          (d.description ?? "").toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    sorted.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [deals, category, search, sort]);

  const cheapest = filtered[0];
  const unmappedCount = filtered.filter((d) => d.lat == null || d.lng == null).length;

  return (
    <div className="relative flex h-full min-h-0 flex-col md:flex-row">
      {/* Sidebar: filters + list */}
      <div
        className={`${
          mobilePane === "list" ? "flex" : "hidden"
        } h-full min-h-0 w-full flex-col border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:flex md:w-[380px] md:shrink-0 md:border-r lg:w-[420px]`}
      >
        <div className="flex shrink-0 flex-col gap-3 border-b border-zinc-100 p-4 dark:border-zinc-800">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                category === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              All deals
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  category === c
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search by name, restaurant, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>

          <p className="text-xs text-zinc-500">
            {filtered.length} deal{filtered.length === 1 ? "" : "s"} found
            {cheapest && (
              <>
                {" "}
                &middot; cheapest is{" "}
                <span className="font-semibold text-emerald-600">${cheapest.price.toFixed(2)}</span> at{" "}
                {cheapest.restaurant}
              </>
            )}
            {unmappedCount > 0 && (
              <> &middot; {unmappedCount} not shown on map (no coordinates)</>
            )}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-400 dark:border-zinc-700">
              No deals match your filters yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((deal) => (
                <DealCard key={deal.id} deal={deal} isCheapest={deal.id === cheapest?.id} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className={`${mobilePane === "map" ? "block" : "hidden"} h-full min-h-0 flex-1 md:block`}>
        <DealsMap deals={filtered} />
      </div>

      {/* Mobile list/map toggle */}
      <div className="fixed bottom-5 left-1/2 z-[1100] flex -translate-x-1/2 gap-1 rounded-full bg-zinc-900/95 p-1 shadow-lg backdrop-blur md:hidden">
        {(["map", "list"] as MobilePane[]).map((pane) => (
          <button
            key={pane}
            onClick={() => setMobilePane(pane)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              mobilePane === pane ? "bg-white text-zinc-900" : "text-zinc-300"
            }`}
          >
            {pane === "map" ? `🗺️ Map` : `☰ List (${filtered.length})`}
          </button>
        ))}
      </div>
    </div>
  );
}
