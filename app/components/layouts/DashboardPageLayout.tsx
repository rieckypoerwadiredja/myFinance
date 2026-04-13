"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardHeader from "../fragments/DashboardHeader";
import DashboardKeyStats from "../fragments/DashboardKeyStats";
import DashboardRecentSection from "../fragments/DashboardRecentSection";
import DashboardSpendingSection from "../fragments/DashboardSpendingSection";
import { fetchTransactions } from "../../lib/transactionClient";
import { SheetTransaction } from "../../types/types";
import { formatRupiah } from "../../lib/rupiah";
import { CATEGORY_OPTIONS } from "../../lib/categories";

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

function parseDateLoose(input: string): Date | null {
  const raw = input.trim();
  if (!raw) return null;

  const m1 = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m1) {
    const day = Number(m1[1]);
    const month = Number(m1[2]);
    const year = Number(m1[3]);
    const d = new Date(year, month - 1, day);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const iso = new Date(raw);
  if (!Number.isNaN(iso.getTime())) return iso;

  return null;
}

async function fetchAllTransactionsForYear(year: number) {
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;
  const limit = 500;

  let page = 1;
  let all: SheetTransaction[] = [];
  while (true) {
    const res = await fetchTransactions({ page, limit, from, to });
    all = all.concat(res.data);
    if (all.length >= res.totalCount) break;
    page += 1;
    if (page > 50) break;
  }

  return all;
}

function computeMonthlyTotals(rows: SheetTransaction[], year: number) {
  const totals = new Array<number>(12).fill(0);
  for (const r of rows) {
    const d = parseDateLoose(r.tanggal);
    if (!d) continue;
    if (d.getFullYear() !== year) continue;
    const idx = d.getMonth();
    totals[idx] += Math.abs(r.pengeluaranNumber ?? 0);
  }
  return totals;
}

function computeWeeklyTotals(
  rows: SheetTransaction[],
  year: number,
  month: number,
) {
  const totals = new Array<number>(5).fill(0);
  for (const r of rows) {
    const d = parseDateLoose(r.tanggal);
    if (!d) continue;
    if (d.getFullYear() !== year) continue;
    if (d.getMonth() + 1 !== month) continue;
    const weekIndex = Math.min(4, Math.floor((d.getDate() - 1) / 7));
    totals[weekIndex] += Math.abs(r.pengeluaranNumber ?? 0);
  }
  return totals;
}

function monthInRange(month: number, startMonth: number, endMonth: number) {
  return month >= startMonth && month <= endMonth;
}

export default function DashboardPageLayout() {
  const [years, setYears] = useState<number[]>([]);
  const [view, setView] = useState<"weekly" | "monthly">("monthly");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [startMonth, setStartMonth] = useState<number>(1);
  const [endMonth, setEndMonth] = useState<number>(12);

  const [yearRows, setYearRows] = useState<SheetTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const meta = await fetchTransactions({ page: 1, limit: 1 });
        if (!mounted) return;
        const ys = meta.years ?? [];
        setYears(ys);
        const current = new Date().getFullYear();
        const defaultYear = ys.includes(current)
          ? current
          : ys.length
            ? ys[ys.length - 1]
            : current;
        setSelectedYear(defaultYear);
      } catch {
        if (!mounted) return;
        setYears([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const rows = await fetchAllTransactionsForYear(selectedYear);
        if (!mounted) return;
        setYearRows(rows);
      } catch {
        if (!mounted) return;
        setYearRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedYear]);

  const monthlyTotalsAll = useMemo(
    () => computeMonthlyTotals(yearRows, selectedYear),
    [selectedYear, yearRows],
  );
  const monthlyTotalsMasked = useMemo(() => {
    return monthlyTotalsAll.map((v, idx) =>
      monthInRange(idx + 1, startMonth, endMonth) ? v : 0,
    );
  }, [endMonth, monthlyTotalsAll, startMonth]);

  const weeklyTotals = useMemo(
    () => computeWeeklyTotals(yearRows, selectedYear, selectedMonth),
    [selectedMonth, selectedYear, yearRows],
  );

  const filteredRows = useMemo(() => {
    return yearRows.filter((r) => {
      const d = parseDateLoose(r.tanggal);
      if (!d) return false;
      if (d.getFullYear() !== selectedYear) return false;
      const m = d.getMonth() + 1;
      if (view === "weekly") return m === selectedMonth;
      return monthInRange(m, startMonth, endMonth);
    });
  }, [endMonth, selectedMonth, selectedYear, startMonth, view, yearRows]);

  const totalLedgerBalance = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => acc + Math.abs(r.pengeluaranNumber ?? 0),
      0,
    );
  }, [filteredRows]);

  const { percentFromLastMonth, compareMonthLabel } = useMemo(() => {
    const rangeStartIdx = startMonth - 1;
    const rangeEndIdx = endMonth - 1;

    const currentMonthIndex =
      view === "weekly"
        ? selectedMonth - 1
        : (() => {
            for (let idx = rangeEndIdx; idx >= rangeStartIdx; idx--) {
              if ((monthlyTotalsAll[idx] ?? 0) > 0) return idx;
            }
            return rangeEndIdx;
          })();

    const prevIndex = currentMonthIndex - 1;
    if (prevIndex < 0) {
      return {
        percentFromLastMonth: null as number | null,
        compareMonthLabel: null as string | null,
      };
    }

    if (view !== "weekly" && prevIndex < rangeStartIdx) {
      return {
        percentFromLastMonth: null as number | null,
        compareMonthLabel: null as string | null,
      };
    }

    const currentTotal = monthlyTotalsAll[currentMonthIndex] ?? 0;
    const prevTotal = monthlyTotalsAll[prevIndex] ?? 0;
    if (currentTotal <= 0 || prevTotal <= 0) {
      return {
        percentFromLastMonth: null as number | null,
        compareMonthLabel: monthLabels[prevIndex] ?? null,
      };
    }

    const delta = ((currentTotal - prevTotal) / prevTotal) * 100;
    const rounded = Math.round(delta * 10) / 10;
    return {
      percentFromLastMonth: rounded,
      compareMonthLabel: monthLabels[prevIndex] ?? null,
    };
  }, [endMonth, monthlyTotalsAll, selectedMonth, startMonth, view]);

  const recentItems = useMemo(() => {
    return [...filteredRows]
      .map((r) => ({ r, d: parseDateLoose(r.tanggal) }))
      .filter((x): x is { r: SheetTransaction; d: Date } => x.d !== null)
      .sort((a, b) => b.d.getTime() - a.d.getTime())
      .slice(0, 2)
      .map((x) => x.r);
  }, [filteredRows]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const cat of CATEGORY_OPTIONS) map.set(cat, 0);

    for (const r of filteredRows) {
      const key = CATEGORY_OPTIONS.includes(
        r.kriteria as (typeof CATEGORY_OPTIONS)[number],
      )
        ? r.kriteria
        : "Lainnya";
      map.set(key, (map.get(key) ?? 0) + Math.abs(r.pengeluaranNumber ?? 0));
    }

    const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 0;
    return Array.from(map.entries())
      .map(([label, amount]) => ({
        label,
        amount,
        percent: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredRows]);

  const topCategoryLabel =
    categories.length && categories[0].amount > 0 ? categories[0].label : null;
  const noTrendData =
    view === "monthly"
      ? monthlyTotalsMasked.reduce((a, b) => a + b, 0) === 0
      : weeklyTotals.reduce((a, b) => a + b, 0) === 0;

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader eyebrow="Financial Overview" title="My Finanace" />

      <DashboardKeyStats
        totalLedgerBalanceLabel={
          loading ? "—" : formatRupiah(totalLedgerBalance)
        }
        percentFromLastMonth={percentFromLastMonth}
        compareMonthLabel={compareMonthLabel}
      />

      <DashboardSpendingSection
        view={view}
        onChangeView={(next) => setView(next)}
        years={years.length ? years : [selectedYear]}
        selectedYear={selectedYear}
        onChangeYear={(y) => setSelectedYear(y)}
        selectedMonth={selectedMonth}
        onChangeMonth={(m) => setSelectedMonth(m)}
        startMonth={startMonth}
        endMonth={endMonth}
        onChangeStartMonth={(m) => {
          const nextStart = m;
          setStartMonth(nextStart);
          if (nextStart > endMonth) setEndMonth(nextStart);
        }}
        onChangeEndMonth={(m) => {
          const nextEnd = m;
          setEndMonth(nextEnd);
          if (nextEnd < startMonth) setStartMonth(nextEnd);
        }}
        monthlyTotals={monthlyTotalsMasked}
        weeklyTotals={weeklyTotals}
        categories={categories}
        topCategoryLabel={topCategoryLabel}
        noTrendData={noTrendData}
      />

      <DashboardRecentSection items={recentItems} />
    </div>
  );
}
