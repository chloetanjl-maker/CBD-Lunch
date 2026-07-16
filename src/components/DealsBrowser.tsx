"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/categories";
import type { DealDTO } from "@/lib/types";
import DealCard from "@/components/DealCard";
import DealsMap from "@/components/DealsMap";

type CategoryFilter = "all" | Category;
type SortOrder = "price-asc" | "price-desc" | "name-asc";
type ViewMode = "list" | "map";

export default function DealsBrowser({ deals }: { deals: DealDTO[] }) {
  const [view, setView] = useState<ViewMode>("list");
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
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
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                category === c
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search by name, restaurant, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {filtered.length} deal{filtered.length === 1 ? "" : "s"} found
          {cheapest && (
            <>
              {" "}
              &middot; cheapest is{" "}
              <span className="font-semibold text-emerald-600">
                ${cheapest.price.toFixed(2)}
              </span>{" "}
              at {cheapest.restaurant}
            </>
          )}
        </p>
        <div className="flex shrink-0 gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
          {(["list", "map"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                view === v
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {v === "list" ? "☰ List" : "🗺️ Map"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center text-zinc-400 dark:border-zinc-700">
          No deals match your filters yet.
        </div>
      ) : view === "map" ? (
        <DealsMap deals={filtered} onSwitchToList={() => setView("list")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((deal) => (
            <DealCard key={deal.id} deal={deal} isCheapest={deal.id === cheapest?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
