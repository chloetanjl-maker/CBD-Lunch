import { prisma } from "@/lib/prisma";
import DealsBrowser from "@/components/DealsBrowser";

export const dynamic = "force-dynamic";

export default async function Home() {
  const deals = await prisma.deal.findMany({ orderBy: { price: "asc" } });

  return (
    <div className="h-full min-h-0 flex-1">
      <DealsBrowser
        deals={deals.map((d) => ({ ...d, createdAt: d.createdAt.toISOString(), updatedAt: d.updatedAt.toISOString() }))}
      />
    </div>
  );
}
