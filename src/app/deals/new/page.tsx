import DealForm from "@/components/DealForm";

export default function NewDealPage() {
  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">Add a deal</h1>
      <DealForm />
    </div>
  );
}
