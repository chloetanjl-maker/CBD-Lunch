"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/categories";
import type { DealDTO } from "@/lib/types";

type Props = {
  deal?: DealDTO;
};

export default function DealForm({ deal }: Props) {
  const router = useRouter();
  const isEdit = Boolean(deal);

  const [category, setCategory] = useState<Category>((deal?.category as Category) ?? "caifan");
  const [name, setName] = useState(deal?.name ?? "");
  const [restaurant, setRestaurant] = useState(deal?.restaurant ?? "");
  const [address, setAddress] = useState(deal?.address ?? "");
  const [price, setPrice] = useState(deal ? String(deal.price) : "");
  const [description, setDescription] = useState(deal?.description ?? "");
  const [dealDays, setDealDays] = useState(deal?.dealDays ?? "");
  const [link, setLink] = useState(deal?.link ?? "");
  const [lat, setLat] = useState(deal?.lat != null ? String(deal.lat) : "");
  const [lng, setLng] = useState(deal?.lng != null ? String(deal.lng) : "");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      name,
      restaurant,
      address,
      category,
      price: Number(price),
      description: description || null,
      dealDays: dealDays || null,
      link: link || null,
      lat: lat === "" ? null : Number(lat),
      lng: lng === "" ? null : Number(lng),
    };

    try {
      const res = await fetch(isEdit ? `/api/deals/${deal!.id}` : "/api/deals", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.push("/");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";
  const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
              category === c
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Deal name</span>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={category === "caifan" ? "e.g. 1 Meat + 2 Veg" : "e.g. Build-Your-Own Bowl"}
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Restaurant / stall</span>
        <input
          className={inputClass}
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          placeholder="e.g. Zhi Sheng Cooked Food"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Address</span>
        <input
          className={inputClass}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. Amoy Street Food Centre, 7 Maxwell Road, #02-108, Singapore 069111"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Price (SGD)</span>
        <input
          className={inputClass}
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 3.50"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Description (optional)</span>
        <textarea
          className={inputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="What's included in the deal?"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Deal days / hours (optional)</span>
          <input
            className={inputClass}
            value={dealDays}
            onChange={(e) => setDealDays(e.target.value)}
            placeholder="e.g. Mon-Fri, 11am-2pm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Source link (optional)</span>
          <input
            className={inputClass}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-3 dark:border-zinc-700">
        <span className={labelClass}>Map location (optional)</span>
        <p className="text-xs text-zinc-500">
          Right-click the spot on Google Maps and copy the coordinates to place it on the map view.
          Leave blank to skip.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputClass}
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude, e.g. 1.2799"
          />
          <input
            className={inputClass}
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude, e.g. 103.8454"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Add deal"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
