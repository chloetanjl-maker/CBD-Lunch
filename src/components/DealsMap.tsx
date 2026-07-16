"use client";

import { useMemo, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import type { DealDTO } from "@/lib/types";
import { CBD_CENTER } from "@/lib/categories";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const containerStyle = { width: "100%", height: "100%" };

function groupKey(deal: DealDTO) {
  // Round to ~11m precision so deals at the same address share a pin.
  return `${deal.lat!.toFixed(4)},${deal.lng!.toFixed(4)}`;
}

export default function DealsMap({
  deals,
  onSwitchToList,
}: {
  deals: DealDTO[];
  onSwitchToList: () => void;
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "cbd-lunch-deals-map",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY ?? "",
  });

  const groups = useMemo(() => {
    const byKey = new Map<string, DealDTO[]>();
    for (const deal of deals) {
      if (deal.lat == null || deal.lng == null) continue;
      const key = groupKey(deal);
      const existing = byKey.get(key) ?? [];
      existing.push(deal);
      byKey.set(key, existing);
    }
    for (const list of byKey.values()) {
      list.sort((a, b) => a.price - b.price);
    }
    return byKey;
  }, [deals]);

  const unmappedCount = deals.length - [...groups.values()].reduce((n, l) => n + l.length, 0);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-[32rem] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
        <p className="font-semibold text-zinc-700 dark:text-zinc-300">Map view needs a Google Maps API key</p>
        <p className="max-w-sm">
          Add <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          to your <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">.env</code> file and restart the
          dev server to enable it.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-[32rem] items-center justify-center rounded-2xl border border-dashed border-red-300 p-8 text-center text-sm text-red-500">
        Failed to load Google Maps. Check that your API key is valid and has the Maps JavaScript API enabled.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[32rem] items-center justify-center rounded-2xl border border-zinc-200 text-sm text-zinc-400 dark:border-zinc-800">
        Loading map...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="h-[32rem] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <GoogleMap mapContainerStyle={containerStyle} center={CBD_CENTER} zoom={15}>
          {[...groups.entries()].map(([key, groupDeals]) => {
            const coords = { lat: groupDeals[0].lat!, lng: groupDeals[0].lng! };
            const cheapest = groupDeals[0];
            return (
              <MarkerF
                key={key}
                position={coords}
                label={{ text: String(groupDeals.length), color: "white", fontWeight: "bold" }}
                title={`${cheapest.restaurant} — from $${cheapest.price.toFixed(2)}`}
                onClick={() => setActiveKey(key)}
              >
                {activeKey === key && (
                  <InfoWindowF position={coords} onCloseClick={() => setActiveKey(null)}>
                    <div className="max-w-[16rem] text-sm">
                      <p className="mb-1.5 font-semibold text-zinc-900">{groupDeals[0].restaurant}</p>
                      <p className="mb-1.5 text-xs text-zinc-500">{groupDeals[0].address}</p>
                      <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto">
                        {groupDeals.map((deal) => (
                          <li key={deal.id} className="border-t border-zinc-100 pt-1.5 first:border-t-0 first:pt-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="font-medium text-zinc-800">{deal.name}</span>
                              <span className="whitespace-nowrap font-bold text-emerald-600">
                                ${deal.price.toFixed(2)}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </InfoWindowF>
                )}
              </MarkerF>
            );
          })}
        </GoogleMap>
      </div>
      {unmappedCount > 0 && (
        <p className="text-xs text-zinc-400">
          {unmappedCount} deal{unmappedCount === 1 ? "" : "s"} not shown on the map (no coordinates set).{" "}
          <button type="button" onClick={onSwitchToList} className="underline">
            Switch to list view
          </button>{" "}
          to see them.
        </p>
      )}
    </div>
  );
}
