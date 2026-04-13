import { SheetTransaction, TransactionsListResponse } from "../types/types";

/**
 * Frontend helpers for calling /api/transaction.
 *
 * Keeps fetch calls in one place so UI fragments stay focused on state + rendering.
 * All requests are same-origin (client-side), so no base URL is required.
 */
type ListParams = {
  page: number;
  limit: number;
  category?: string;
  from?: string;
  to?: string;
  search?: string;
};

export async function fetchTransactions(params: ListParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));
  if (params.category && params.category !== "All") {
    searchParams.set("category", params.category);
  }
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.search) searchParams.set("search", params.search);

  const res = await fetch(`/api/transaction?${searchParams.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: ${res.status}`);
  }

  return (await res.json()) as TransactionsListResponse;
}

export async function updateTransaction(payload: {
  id: string;
  tanggal?: string;
  kriteria?: string;
  pengeluaran?: string;
  note?: string;
}) {
  const res = await fetch("/api/transaction", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as unknown;
    throw new Error(
      typeof body === "object" && body && "message" in body
        ? String((body as { message: string }).message)
        : `Failed to update transaction: ${res.status}`,
    );
  }

  return (await res.json()) as { message: string; data: SheetTransaction | null };
}

export async function deleteTransaction(id: string) {
  const res = await fetch(`/api/transaction?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as unknown;
    throw new Error(
      typeof body === "object" && body && "message" in body
        ? String((body as { message: string }).message)
        : `Failed to delete transaction: ${res.status}`,
    );
  }

  return (await res.json()) as { message: string; id: string };
}

export async function createTransactions(items: Array<{
  tanggal: string;
  kriteria: string;
  pengeluaran: string;
  note: string;
}>) {
  const res = await fetch("/api/transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as unknown;
    throw new Error(
      typeof body === "object" && body && "message" in body
        ? String((body as { message: string }).message)
        : `Failed to create transactions: ${res.status}`,
    );
  }

  return (await res.json()) as {
    message: string;
    count: number;
    data: SheetTransaction[];
  };
}
