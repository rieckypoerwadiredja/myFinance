"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { createTransactions } from "../../lib/transactionClient";
import IconButton from "../elements/IconButton";
import { CATEGORY_OPTIONS } from "../../lib/categories";

type DraftRow = {
  tanggal: string;
  kriteria: string;
  pengeluaran: string;
  note: string;
};

const emptyRow: DraftRow = { tanggal: "", kriteria: "", pengeluaran: "", note: "" };

export default function UploadCreateTransactions() {
  const [rows, setRows] = useState<DraftRow[]>([{ ...emptyRow }]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function addRow() {
    setRows((r) => [...r, { ...emptyRow }]);
  }

  function removeRow(index: number) {
    setRows((r) => r.filter((_, i) => i !== index));
  }

  function updateRow(index: number, next: Partial<DraftRow>) {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, ...next } : row)));
  }

  async function submit() {
    setSubmitting(true);
    setMessage(null);
    try {
      const payload = rows
        .map((r) => ({
          tanggal: r.tanggal.trim(),
          kriteria: r.kriteria.trim(),
          pengeluaran: r.pengeluaran.trim(),
          note: r.note.trim(),
        }))
        .filter((r) => r.tanggal || r.kriteria || r.pengeluaran || r.note);

      if (payload.length === 0) {
        setMessage("Tidak ada data untuk dikirim.");
        return;
      }

      const res = await createTransactions(payload);
      setMessage(`${res.message} (${res.count} data)`);
      setRows([{ ...emptyRow }]);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Gagal menambahkan transaksi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-surface-container-lowest p-8 rounded-3xl shadow-editorial border border-outline-variant/15">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-on-surface mb-1">
            Tambah Transaksi
          </h3>
          <p className="text-sm text-on-surface-variant">
            Tambahkan banyak baris sekaligus. ID akan dibuat otomatis oleh API.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addRow}
            className="bg-surface-container-low border border-outline-variant/15 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors"
            type="button"
          >
            <Plus size={16} />
            Add Row
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold disabled:opacity-50"
            type="button"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {message ? (
        <div className="mb-6 text-sm font-medium text-on-surface-variant">
          {message}
        </div>
      ) : null}

      <div className="bg-surface-container-low rounded-2xl overflow-hidden p-1">
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-surface-container-low/50">
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
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-surface-container-high transition-colors"
                >
                  <td className="px-6 py-5">
                    <input
                      value={row.tanggal}
                      onChange={(e) => updateRow(index, { tanggal: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/15 px-3 py-2 rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary"
                      type="date"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <input
                      value={row.kriteria}
                      onChange={(e) => updateRow(index, { kriteria: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/15 px-3 py-2 rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary"
                      placeholder="Kategori"
                      list="category-options"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <input
                      value={row.note}
                      onChange={(e) => updateRow(index, { note: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/15 px-3 py-2 rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary"
                      placeholder="Catatan"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <input
                      value={row.pengeluaran}
                      onChange={(e) =>
                        updateRow(index, { pengeluaran: e.target.value })
                      }
                      className="w-full bg-surface-container-low border border-outline-variant/15 px-3 py-2 rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary text-right"
                      placeholder="Rp0"
                    />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center">
                      <IconButton
                        className="hover:bg-error/10 text-error disabled:opacity-30"
                        disabled={rows.length === 1}
                        onClick={() => removeRow(index)}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <datalist id="category-options">
        {CATEGORY_OPTIONS.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </section>
  );
}
