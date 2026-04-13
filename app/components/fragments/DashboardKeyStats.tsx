import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import StatCard from "../elements/StatCard";

type Props = {
  totalLedgerBalanceLabel: string;
  percentFromLastMonth: number | null;
  compareMonthLabel: string | null;
};

function formatPercent(value: number) {
  const abs = Math.abs(value);
  const txt = abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(1);
  return `${value >= 0 ? "+" : "-"}${txt}%`;
}

export default function DashboardKeyStats({
  totalLedgerBalanceLabel,
  percentFromLastMonth,
  compareMonthLabel,
}: Props) {
  const trend =
    percentFromLastMonth === null
      ? "flat"
      : percentFromLastMonth > 0
        ? "up"
        : percentFromLastMonth < 0
          ? "down"
          : "flat";

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const trendClassName =
    trend === "up"
      ? "text-error"
      : trend === "down"
        ? "text-primary"
        : "text-on-surface-variant";

  const trendText =
    percentFromLastMonth === null
      ? "-- dari bulan lalu"
      : `${formatPercent(percentFromLastMonth)} ${
          percentFromLastMonth > 0
            ? "lebih banyak"
            : percentFromLastMonth < 0
              ? "lebih sedikit"
              : "sama"
        } dibanding bulan lalu${compareMonthLabel ? ` (${compareMonthLabel})` : ""}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className="md:col-span-2 bg-surface-lowest p-8 rounded-xl editorial-shadow relative overflow-hidden flex flex-col justify-between h-64 border border-outline-variant/20">
        <div className="relative z-10">
          <span className="text-on-surface-variant font-semibold tracking-tighter uppercase text-xs">
            Total Expenses
          </span>
          <div className="text-4xl lg:text-6xl font-extrabold text-on-surface mt-2 tracking-tighter">
            {totalLedgerBalanceLabel}
          </div>
        </div>
        <div
          className={cn(
            "relative z-10 flex items-center gap-2 font-bold",
            trendClassName,
          )}
        >
          <TrendIcon size={20} />
          <span>{trendText}</span>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="space-y-8">
        <div className="bg-surface-low p-8 rounded-xl flex flex-col h-full border border-white/40 shadow-sm">
          <StatCard
            label="Monthly Income"
            value="Rp2.000.000"
            footer={
              <div className="flex items-center gap-2 text-tertiary">
                <Clock size={14} />
                <span className="text-xs">Next payout: Sep 30</span>
              </div>
            }
          />
        </div>
        <div className="bg-surface-low p-8 rounded-xl flex flex-col h-full border border-white/40 shadow-sm">
          <StatCard
            label="Monthly Expenses"
            value="$4,120.50"
            valueClassName="text-error mt-1"
            footer={
              <div className="flex items-center gap-2 text-error">
                <AlertCircle size={14} />
                <span className="text-xs">12% over budget</span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
