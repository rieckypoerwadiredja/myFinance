"use client";

import { motion } from "motion/react";
import ProgressBar from "../elements/ProgressBar";
import SectionHeader from "../elements/SectionHeader";
import { formatJutaCompact, formatRupiah } from "../../lib/rupiah";
import { cn } from "../../lib/utils";
import {
  getCategoryBadgeClassName,
  getCategoryBarClassName,
} from "../../lib/categories";

type CategoryItem = {
  label: string;
  amount: number;
  percent: number;
};

type Props = {
  view: "weekly" | "monthly";
  onChangeView: (next: "weekly" | "monthly") => void;
  years: number[];
  selectedYear: number;
  onChangeYear: (year: number) => void;
  selectedMonth: number;
  onChangeMonth: (month: number) => void;
  startMonth: number;
  endMonth: number;
  onChangeStartMonth: (month: number) => void;
  onChangeEndMonth: (month: number) => void;
  monthlyTotals: number[];
  weeklyTotals: number[];
  categories: CategoryItem[];
  topCategoryLabel: string | null;
  noTrendData: boolean;
};

function buildYAxis(maxValue: number) {
  const max = Math.max(0, maxValue);
  const step = max / 3;
  return [max, step * 2, step, 0].map((v) => Math.round(v));
}

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function DashboardSpendingSection({
  view,
  onChangeView,
  years,
  selectedYear,
  onChangeYear,
  selectedMonth,
  onChangeMonth,
  startMonth,
  endMonth,
  onChangeStartMonth,
  onChangeEndMonth,
  monthlyTotals,
  weeklyTotals,
  categories,
  topCategoryLabel,
  noTrendData,
}: Props) {
  const series = view === "monthly" ? monthlyTotals : weeklyTotals;
  const maxValue = Math.max(0, ...series);
  const yAxis = buildYAxis(maxValue);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
      <section className="lg:col-span-8 bg-surface-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm">
        <SectionHeader
          className="mb-10"
          title="Spending Trends"
          description="Historical monthly cash flow"
          rightSlot={
            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-2 bg-surface-low p-1 rounded-full">
                <button
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
                    view === "weekly"
                      ? "bg-primary text-white shadow-sm"
                      : "hover:bg-white",
                  )}
                  onClick={() => onChangeView("weekly")}
                >
                  Weekly
                </button>
                <button
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
                    view === "monthly"
                      ? "bg-primary text-white shadow-sm"
                      : "hover:bg-white",
                  )}
                  onClick={() => onChangeView("monthly")}
                >
                  Monthly
                </button>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <select
                  value={String(selectedYear)}
                  onChange={(e) => onChangeYear(Number(e.target.value))}
                  className="bg-surface-container-low border border-outline-variant/15 px-4 py-2 rounded-full text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary"
                >
                  {years.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>

                {view === "weekly" ? (
                  <select
                    value={String(selectedMonth)}
                    onChange={(e) => onChangeMonth(Number(e.target.value))}
                    className="bg-surface-container-low border border-outline-variant/15 px-4 py-2 rounded-full text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary"
                  >
                    {monthLabels.map((m, i) => (
                      <option key={m} value={String(i + 1)}>
                        {m}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <select
                      value={String(startMonth)}
                      onChange={(e) =>
                        onChangeStartMonth(Number(e.target.value))
                      }
                      className="bg-surface-container-low border border-outline-variant/15 px-4 py-2 rounded-full text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary"
                    >
                      {monthLabels.map((m, i) => (
                        <option key={m} value={String(i + 1)}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      value={String(endMonth)}
                      onChange={(e) => onChangeEndMonth(Number(e.target.value))}
                      className="bg-surface-container-low border border-outline-variant/15 px-4 py-2 rounded-full text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary"
                    >
                      {monthLabels.map((m, i) => (
                        <option key={m} value={String(i + 1)}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
          }
        />

        <div className="relative">
          <div className="absolute left-0 -translate-x-full h-64 flex flex-col justify-between text-[10px] text-on-surface-variant/60 font-medium pr-4">
            {yAxis.map((v, idx) => (
              <span key={`${idx}-${v}`}>{formatRupiah(v)}</span>
            ))}
          </div>

          <div className={cn(view === "monthly" ? "overflow-x-auto" : "")}>
            <div className={cn(view === "monthly" ? "min-w-[720px]" : "")}>
              <div className="h-64 flex items-end gap-3 px-2 border-b border-outline-variant/30 pb-2">
                {series.map((value, i) => {
                  const heightPct = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  const isHighlighted =
                    view === "monthly" &&
                    i + 1 >= startMonth &&
                    i + 1 <= endMonth;

                  return (
                    <motion.div
                      key={`${view}-${i}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ delay: i * 0.03, duration: 0.5 }}
                      className={cn(
                        "flex-1 rounded-t-lg transition-all group relative",
                        "bg-surface-high hover:bg-primary/20",
                        isHighlighted
                          ? "bg-primary shadow-[0_4px_12px_rgba(17,92,185,0.2)]"
                          : "",
                      )}
                      style={view === "monthly" ? { minWidth: 44 } : undefined}
                    >
                      <div
                        className={cn(
                          "absolute inset-x-1 top-1 text-[9px] font-extrabold text-center leading-none pointer-events-none select-none",
                          isHighlighted
                            ? "text-white/95"
                            : "text-on-surface/60",
                        )}
                      >
                        {formatJutaCompact(value)}
                      </div>
                      <div className="absolute inset-x-1 top-6 text-center pointer-events-none select-none">
                        <div className="inline-block bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatRupiah(value)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant px-2 uppercase tracking-widest">
                {series.map((_, i) => {
                  const label = view === "monthly" ? monthLabels[i] : `W${i + 1}`;
                  return (
                    <span
                      key={`${view}-label-${i}`}
                      className="flex-1 text-center"
                      style={view === "monthly" ? { minWidth: 44 } : undefined}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {noTrendData ? (
            <div className="mt-6 text-sm text-on-surface-variant font-medium">
              No data for the selected period.
            </div>
          ) : null}
        </div>
      </section>

      <section className="lg:col-span-4 bg-surface-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm">
        <h2 className="text-xl font-bold mb-8">Spending by Category</h2>
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.label} className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      getCategoryBarClassName(cat.label),
                    )}
                  ></span>
                  {cat.label}
                </span>
                <span className="text-on-surface-variant">
                  {formatRupiah(cat.amount)}
                </span>
              </div>
              <ProgressBar
                value={cat.percent}
                trackClassName="bg-surface-low"
                barClassName={getCategoryBarClassName(cat.label)}
              />
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">
              Top Category
            </span>
            <span
              className={cn(
                "text-xs font-bold px-2 py-0.5 rounded",
                topCategoryLabel
                  ? getCategoryBadgeClassName(topCategoryLabel)
                  : "bg-surface-container-high text-on-surface",
              )}
            >
              {topCategoryLabel ?? "—"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
