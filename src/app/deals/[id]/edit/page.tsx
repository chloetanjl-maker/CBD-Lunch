import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DealForm from "@/components/DealForm";

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) notFound();

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">Edit deal</h1>
      <DealForm
        deal={{
          ...deal,
          createdAt: deal.createdAt.toISOString(),
          updatedAt: deal.updatedAt.toISOString(),
        }}
      />
    </div>
  );
}
