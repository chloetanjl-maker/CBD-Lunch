import Link from "next/link";
import type { DealDTO } from "@/lib/types";
import { CATEGORY_LABELS, type Category } from "@/lib/categories";
import DeleteDealButton from "@/components/DeleteDealButton";

export default function DealCard({
  deal,
  isCheapest,
}: {
  deal: DealDTO;
  isCheapest: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{deal.name}</h3>
          <p className="text-sm text-zinc-500">{deal.restaurant}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-emerald-600">${deal.price.toFixed(2)}</span>
          {isCheapest && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              🏆 cheapest
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {CATEGORY_LABELS[deal.category as Category] ?? deal.category}
        </span>
      </div>

      {deal.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{deal.description}</p>
      )}

      <p className="text-xs text-zinc-400">📍 {deal.address}</p>

      {deal.dealDays && <p className="text-xs text-zinc-400">⏰ {deal.dealDays}</p>}

      {deal.link && (
        <a
          href={deal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-emerald-600 hover:underline"
        >
          View source ↗
        </a>
      )}

      <div className="mt-1 flex items-center gap-3 border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
        <Link
          href={`/deals/${deal.id}/edit`}
          className="font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          Edit
        </Link>
        <DeleteDealButton id={deal.id} name={deal.name} />
      </div>
    </div>
  );
}
