import Link from "next/link";
import type { DealDTO } from "@/lib/types";
import DeleteDealButton from "@/components/DeleteDealButton";

export default function DealCard({
  deal,
  isCheapest,
}: {
  deal: DealDTO;
  isCheapest: boolean;
}) {
  return (
    <div className="group -mx-2 flex flex-col gap-1.5 rounded-lg px-2 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-medium text-zinc-900 dark:text-zinc-50">{deal.name}</h3>
          <p className="text-sm text-zinc-500">{deal.restaurant}</p>
        </div>
        <div className="flex shrink-0 items-baseline gap-1.5">
          {isCheapest && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">Cheapest</span>
          )}
          <span className="font-medium tabular-nums text-emerald-600">${deal.price.toFixed(2)}</span>
        </div>
      </div>

      {deal.description && <p className="text-sm text-zinc-600 dark:text-zinc-400">{deal.description}</p>}

      <p className="text-xs text-zinc-400">{deal.address}</p>
      {deal.dealDays && <p className="text-xs text-zinc-400">{deal.dealDays}</p>}

      {deal.link && (
        <a
          href={deal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline dark:hover:text-zinc-200"
        >
          Source
        </a>
      )}

      <div className="mt-1 flex items-center gap-3 text-xs">
        <Link
          href={`/deals/${deal.id}/edit`}
          className="font-medium text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          Edit
        </Link>
        <DeleteDealButton id={deal.id} name={deal.name} />
      </div>
    </div>
  );
}
