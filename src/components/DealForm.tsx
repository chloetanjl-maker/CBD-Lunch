"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DealDTO } from "@/lib/types";

type Props = {
  deal?: DealDTO;
};

const inputClass =
  "w-full rounded-lg border-none bg-zinc-100 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none ring-0 focus:ring-2 focus:ring-emerald-500/40 dark:bg-zinc-800 dark:text-zinc-100";
const labelClass = "text-xs font-medium text-zinc-500";

export default function DealForm({ deal }: Props) {
  const router = useRouter();
  const isEdit = Boolean(deal);

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Deal name</span>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Build-Your-Own Bowl"
          required
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Restaurant / stall</span>
        <input
          className={inputClass}
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          placeholder="e.g. Green Bites Salad"
          required
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Address</span>
        <input
          className={inputClass}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. 50 Market Street, Golden Shoe Car Park, #03-20, Singapore 048940"
          required
        />
      </label>

      <label className="flex flex-col gap-1.5">
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

      <label className="flex flex-col gap-1.5">
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
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Deal days / hours (optional)</span>
          <input
            className={inputClass}
            value={dealDays}
            onChange={(e) => setDealDays(e.target.value)}
            placeholder="e.g. Mon-Fri, 11am-2pm"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Source link (optional)</span>
          <input
            className={inputClass}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
        <span className={labelClass}>Map location (optional)</span>
        <p className="text-xs text-zinc-400">
          Look up the coordinates on Google Maps or OpenStreetMap and paste them here to place a pin.
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

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Add deal"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
