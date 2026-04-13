"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Filter } from "lucide-react";
import {
  SheetTransaction,
  TransactionsSummary as TransactionsSummaryType,
  TransactionTrend,
} from "../../types/types";
import {
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "../../lib/transactionClient";
import TransactionsFooterBrand from "./TransactionsFooterBrand";
import TransactionsSummary from "./TransactionsSummary";
import TransactionsTable from "./TransactionsTable";
import { formatRupiah } from "../../lib/rupiah";
import { CATEGORY_OPTIONS } from "../../lib/categories";
import PageHeader from "../elements/PageHeader";
import { Button } from "../elements/Button";

const LIMIT = 100;

const emptySummary: TransactionsSummaryType = {
  totalVolume: 0,
  percentChange: null,
  trend: "flat",
  validatedEntries: 0,
};

type Draft = {
  tanggal: string;
  kriteria: string;
  pengeluaran: string;
  note: string;
};

function normalizeToDateInput(value: string) {
  const raw = value.trim();
  if (!raw) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const m1 = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m1) {
    const day = Number(m1[1]);
    const month = Number(m1[2]);
    const year = Number(m1[3]);
    if (year > 1900 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }

  const iso = new Date(raw);
  if (!Number.isNaN(iso.getTime())) {
    const y = iso.getFullYear();
    const m = String(iso.getMonth() + 1).padStart(2, "0");
    const d = String(iso.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return "";
}

export default function TransactionsView() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<SheetTransaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [summary, setSummary] = useState<TransactionsSummaryType>(emptySummary);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({
    tanggal: "",
    kriteria: "",
    pengeluaran: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categoryOptions = useMemo(() => ["All", ...categories], [categories]);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchTransactions({
        page,
        limit: LIMIT,
        category: selectedCategory,
        from: startDate || undefined,
        to: endDate || undefined,
      });
      setRows(data.data);
      setCategories(data.categories);
      setSummary(data.summary);
      setTotalCount(data.totalCount);
    } catch (e) {
      setRows([]);
      setCategories([]);
      setSummary(emptySummary);
      setTotalCount(0);
      setErrorMessage(
        e instanceof Error ? e.message : "Failed to load transactions.",
      );
    } finally {
      setLoading(false);
    }
  }, [endDate, page, selectedCategory, startDate]);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(row: SheetTransaction, rowKey: string) {
    setEditingKey(rowKey);
    setEditingRowId(row.id);
    setDraft({
      tanggal: normalizeToDateInput(row.tanggal) || row.tanggal,
      kriteria: CATEGORY_OPTIONS.includes(
        row.kriteria as (typeof CATEGORY_OPTIONS)[number],
      )
        ? row.kriteria
        : "Lainnya",
      pengeluaran:
        row.pengeluaranNumber !== null && row.pengeluaranNumber !== undefined
          ? String(Math.abs(row.pengeluaranNumber))
          : row.pengeluaran,
      note: row.note,
    });
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditingRowId(null);
    setDraft({ tanggal: "", kriteria: "", pengeluaran: "", note: "" });
  }

  async function saveEdit() {
    const id = (editingRowId ?? "").trim();
    if (!id) {
      setErrorMessage("Tidak bisa update: ID transaksi kosong.");
      return;
    }

    setSaving(true);
    try {
      await updateTransaction({
        id,
        tanggal: draft.tanggal,
        kriteria: draft.kriteria,
        pengeluaran: draft.pengeluaran,
        note: draft.note,
      });
      cancelEdit();
      await load();
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "Failed to update transaction.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeRow(id: string) {
    const ok = confirm("Hapus transaksi ini?");
    if (!ok) return;

    setDeletingId(id);
    try {
      await deleteTransaction(id);
      const nextTotal = totalCount - 1;
      const maxPage = Math.max(1, Math.ceil(nextTotal / LIMIT));
      const nextPage = Math.min(page, maxPage);
      setEditingKey(null);
      setEditingRowId(null);
      setDraft({ tanggal: "", kriteria: "", pengeluaran: "", note: "" });
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await load();
      }
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "Failed to delete transaction.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const trend = (summary.trend ?? "flat") as TransactionTrend;
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="space-y-4">
        <PageHeader
          title="Ledger Details"
          description="A curated view of your validated financial activities. Each entry reflects a verified movement of value across your digital assets."
          actions={
            <>
              <Button
                variant={isCategoryOpen ? "secondary" : "outline"}
                onClick={() => {
                  setIsCategoryOpen((v) => !v);
                  setIsDateOpen(false);
                }}
              >
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
              <Button
                variant={isDateOpen ? "secondary" : "outline"}
                onClick={() => {
                  setIsDateOpen((v) => !v);
                  setIsCategoryOpen(false);
                }}
              >
                <Calendar size={16} className="mr-2" />
                Date Range
              </Button>
            </>
          }
        />

        {(isCategoryOpen || isDateOpen) && (
          <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl p-5">
            {isCategoryOpen ? (
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/15 px-4 py-3 rounded-xl text-on-surface focus:ring-2 focus:ring-primary font-medium"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="bg-surface-container-low border border-outline-variant/15 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors"
                  onClick={() => {
                    setSelectedCategory("All");
                    setPage(1);
                  }}
                >
                  Clear
                </button>
              </div>
            ) : null}

            {isDateOpen ? (
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/15 px-4 py-3 rounded-xl text-on-surface focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/15 px-4 py-3 rounded-xl text-on-surface focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>
                <button
                  className="bg-surface-container-low border border-outline-variant/15 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                  }}
                >
                  Clear
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {errorMessage ? (
        <div className="bg-error/10 border border-error/20 text-error rounded-2xl px-5 py-4 text-sm font-medium">
          {errorMessage}
        </div>
      ) : null}

      <TransactionsSummary
        totalVolumeLabel={formatRupiah(summary.totalVolume)}
        entriesCount={summary.validatedEntries}
        percentChange={summary.percentChange}
        trend={trend}
      />

      <TransactionsTable
        rows={rows}
        loading={loading}
        page={page}
        limit={LIMIT}
        totalCount={totalCount}
        onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
        onNextPage={() =>
          setPage((p) =>
            p < Math.ceil(Math.max(1, totalCount) / LIMIT) ? p + 1 : p,
          )
        }
        editingKey={editingKey}
        draft={draft}
        saving={saving}
        deletingId={deletingId}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onDraftChange={(next) => setDraft((d) => ({ ...d, ...next }))}
        onSaveEdit={saveEdit}
        onDelete={removeRow}
      />

      <TransactionsFooterBrand />
    </div>
  );
}
