"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
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

type SortOrder = "price-asc" | "price-desc" | "name-asc";
type MobilePane = "list" | "map";

const fieldClass =
  "w-full rounded-lg border-none bg-zinc-100 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none ring-0 focus:ring-2 focus:ring-emerald-500/40 dark:bg-zinc-800 dark:text-zinc-100";

export default function DealsBrowser({ deals }: { deals: DealDTO[] }) {
  const [mobilePane, setMobilePane] = useState<MobilePane>("map");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("price-asc");

  const filtered = useMemo(() => {
    let result = deals;

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
  }, [deals, search, sort]);

  const cheapest = filtered[0];
  const unmappedCount = filtered.filter((d) => d.lat == null || d.lng == null).length;

  return (
    <div className="relative flex h-full min-h-0 flex-col md:flex-row">
      {/* Sidebar: filters + list */}
      <div
        className={`${
          mobilePane === "list" ? "flex" : "hidden"
        } h-full min-h-0 w-full flex-col bg-white dark:bg-zinc-900 md:flex md:w-[380px] md:shrink-0 md:border-r md:border-zinc-100 lg:w-[420px] dark:md:border-zinc-800`}
      >
        <div className="flex shrink-0 flex-col gap-3 p-4">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={fieldClass}
          />

          <select value={sort} onChange={(e) => setSort(e.target.value as SortOrder)} className={fieldClass}>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>

          <p className="text-xs text-zinc-400">
            {filtered.length} deal{filtered.length === 1 ? "" : "s"}
            {cheapest && (
              <>
                {" "}
                &middot; cheapest ${cheapest.price.toFixed(2)} at {cheapest.restaurant}
              </>
            )}
            {unmappedCount > 0 && <> &middot; {unmappedCount} not on map</>}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filtered.length === 0 ? (
            <div className="rounded-lg p-8 text-center text-sm text-zinc-400">No deals match your filters yet.</div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
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
      <div className="fixed bottom-5 left-1/2 z-[1100] flex -translate-x-1/2 gap-1 rounded-full bg-white/90 p-1 shadow-lg backdrop-blur-md dark:bg-zinc-900/90 md:hidden">
        {(["map", "list"] as MobilePane[]).map((pane) => (
          <button
            key={pane}
            onClick={() => setMobilePane(pane)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mobilePane === pane
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {pane === "map" ? "Map" : `List (${filtered.length})`}
          </button>
        ))}
      </div>
    </div>
  );
}
