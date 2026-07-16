"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { DealDTO } from "@/lib/types";
import { CBD_CENTER } from "@/lib/categories";

const containerStyle = { width: "100%", height: "100%" };

function groupKey(deal: DealDTO) {
  // Round to ~11m precision so deals at the same address share a pin.
  return `${deal.lat!.toFixed(4)},${deal.lng!.toFixed(4)}`;
}

function pinIcon(count: number) {
  return L.divIcon({
    className: "",
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:32px;height:32px;border-radius:9999px;
      background:#059669;color:white;font:700 13px system-ui, sans-serif;
      border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);
    ">${count}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14],
  });
}

export default function DealsMap({ deals }: { deals: DealDTO[] }) {
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

  return (
    <MapContainer
      center={[CBD_CENTER.lat, CBD_CENTER.lng]}
      zoom={15}
      maxZoom={19}
      style={containerStyle}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {[...groups.entries()].map(([key, groupDeals]) => {
        const coords: [number, number] = [groupDeals[0].lat!, groupDeals[0].lng!];
        return (
          <Marker key={key} position={coords} icon={pinIcon(groupDeals.length)}>
            <Popup>
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
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
