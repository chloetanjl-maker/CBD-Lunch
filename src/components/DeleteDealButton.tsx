"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteDealButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    setPending(true);
    try {
      const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        alert("Failed to delete deal");
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="font-medium text-zinc-400 hover:text-red-600 disabled:opacity-50 dark:hover:text-red-400"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
