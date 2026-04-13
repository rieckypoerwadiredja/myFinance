"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  X,
} from "lucide-react";
import { SheetTransaction } from "../../types/types";
import { cn } from "../../lib/utils";
import IconButton from "../elements/IconButton";
import { formatRupiah } from "../../lib/rupiah";
import {
  CATEGORY_OPTIONS,
  getCategoryBadgeClassName as getCategoryBadgeClassNameFromConfig,
} from "../../lib/categories";

type Props = {
  rows: SheetTransaction[];
  loading: boolean;
  page: number;
  limit: number;
  totalCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  editingKey: string | null;
  draft: {
    tanggal: string;
    kriteria: string;
    pengeluaran: string;
    note: string;
  };
  saving: boolean;
  deletingId: string | null;
  onStartEdit: (row: SheetTransaction, rowKey: string) => void;
  onCancelEdit: () => void;
  onDraftChange: (next: Partial<Props["draft"]>) => void;
  onSaveEdit: () => void;
  onDelete: (id: string) => void;
};

function getCategoryBadgeClassName(category: string) {
  return cn(
    "px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter",
    getCategoryBadgeClassNameFromConfig(category),
  );
}

function formatRowRange(
  page: number,
  limit: number,
  totalCount: number,
  pageCount: number,
) {
  if (totalCount === 0 || pageCount === 0) return "0";
  const start = (page - 1) * limit + 1;
  const end = start + pageCount - 1;
  return `${start}-${end}`;
}

export default function TransactionsTable({
  rows,
  loading,
  page,
  limit,
  totalCount,
  onPrevPage,
  onNextPage,
  editingKey,
  draft,
  saving,
  deletingId,
  onStartEdit,
  onCancelEdit,
  onDraftChange,
  onSaveEdit,
  onDelete,
}: Props) {
  const maxPage = Math.max(1, Math.ceil(Math.max(0, totalCount) / limit));
  const hasPrev = page > 1;
  const hasNext = page < maxPage;

  return (
    <div className="bg-surface-container-low rounded-2xl overflow-hidden p-1">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left bg-surface-container-low/50">
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                ID
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Tanggal
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Kiteria
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Note
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">
                Pengeluaran
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-on-surface-variant"
                >
                  Loading...
                </td>
              </tr>
            ) : null}
            {!loading && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-on-surface-variant"
                >
                  No transactions found for the selected filters.
                </td>
              </tr>
            ) : null}
            {rows.map((row, index) => {
              const rowKey = `${row.id || "missing"}-${index}`;
              const isEditing = editingKey === rowKey;
              const amount = row.pengeluaranNumber ?? 0;

              return (
                <tr
                  key={rowKey}
                  className="group hover:bg-surface-container-high transition-colors cursor-default"
                >
                  <td className="px-6 py-5 text-sm font-medium text-outline-variant">
                    {row.id}
                  </td>

                  <td className="px-6 py-5">
                    {isEditing ? (
                      <input
                        type="date"
                        value={draft.tanggal}
                        onChange={(e) =>
                          onDraftChange({ tanggal: e.target.value })
                        }
                        className="w-full bg-surface-container-low border border-outline-variant/15 px-3 py-2 rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <span className="text-sm text-on-surface">
                        {row.tanggal}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    {isEditing ? (
                      <select
                        value={draft.kriteria}
                        onChange={(e) =>
                          onDraftChange({ kriteria: e.target.value })
                        }
                        className="w-full bg-surface-container-low border border-outline-variant/15 px-3 py-2 rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary"
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={getCategoryBadgeClassName(row.kriteria)}>
                        {row.kriteria}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    {isEditing ? (
                      <input
                        value={draft.note}
                        onChange={(e) => onDraftChange({ note: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/15 px-3 py-2 rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <span className="text-sm text-on-surface">
                        {row.note}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-sm font-bold text-right text-on-surface">
                    {isEditing ? (
                      <input
                        type="number"
                        inputMode="numeric"
                        value={draft.pengeluaran}
                        onChange={(e) =>
                          onDraftChange({ pengeluaran: e.target.value })
                        }
                        className="w-full bg-surface-container-low border border-outline-variant/15 px-3 py-2 rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary text-right"
                      />
                    ) : (
                      formatRupiah(amount)
                    )}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isEditing ? (
                        <>
                          <IconButton
                            className="hover:bg-primary/10 text-primary disabled:opacity-50"
                            disabled={saving}
                            onClick={onSaveEdit}
                          >
                            <Check size={18} />
                          </IconButton>
                          <IconButton
                            className="hover:bg-surface-container-high text-on-surface disabled:opacity-50"
                            disabled={saving}
                            onClick={onCancelEdit}
                          >
                            <X size={18} />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            className="hover:bg-primary/10 text-primary"
                            disabled={!row.id}
                            onClick={() => onStartEdit(row, rowKey)}
                          >
                            <Edit3 size={18} />
                          </IconButton>
                          <IconButton
                            className="hover:bg-error/10 text-error disabled:opacity-50"
                            disabled={deletingId === row.id || !row.id}
                            onClick={() => onDelete(row.id)}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-8 py-6 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">
            Showing{" "}
            <span className="font-bold text-on-surface">
              {formatRowRange(page, limit, totalCount, rows.length)}
            </span>{" "}
            of {totalCount.toLocaleString("en-US")} entries
          </p>
          <div className="flex items-center gap-1">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-outline-variant transition-colors disabled:opacity-30"
              disabled={!hasPrev}
              onClick={onPrevPage}
            >
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">
              {page}
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-outline-variant transition-colors disabled:opacity-30"
              disabled={!hasNext}
              onClick={onNextPage}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
