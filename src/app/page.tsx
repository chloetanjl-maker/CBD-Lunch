import { prisma } from "@/lib/prisma";
import DealsBrowser from "@/components/DealsBrowser";

export const dynamic = "force-dynamic";

export default async function Home() {
  const deals = await prisma.deal.findMany({ orderBy: { price: "asc" } });

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <DealsBrowser
        deals={deals.map((d) => ({ ...d, createdAt: d.createdAt.toISOString(), updatedAt: d.updatedAt.toISOString() }))}
      />
    </div>
  );
}
