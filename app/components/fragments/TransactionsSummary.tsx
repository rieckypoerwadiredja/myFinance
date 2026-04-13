"use client";

import { TrendingUp, TrendingDown, Minus, CheckCircle } from "lucide-react";
import StatCard from "../elements/StatCard";

type Props = {
  totalVolumeLabel: string;
  percentChange: number | null;
  trend: "up" | "down" | "flat";
  entriesCount: number;
};

function formatPercent(value: number) {
  const abs = Math.abs(value);
  const txt = abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(1);
  return `${value >= 0 ? "+" : "-"}${txt}%`;
}

export default function TransactionsSummary({
  totalVolumeLabel,
  percentChange,
  trend,
  entriesCount,
}: Props) {
  const TrendIcon = trend === "down" ? TrendingDown : trend === "flat" ? Minus : TrendingUp;
  const trendClassName =
    trend === "down" ? "text-error" : trend === "flat" ? "text-on-surface-variant" : "text-primary";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-surface-container-lowest p-8 rounded-xl shadow-editorial">
        <StatCard
          label="Total Volume"
          labelClassName="text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2"
          value={totalVolumeLabel}
          valueClassName="text-3xl font-bold text-on-surface mt-0"
          footer={
            <div className={`flex items-center gap-2 ${trendClassName}`}>
              <TrendIcon size={14} />
              <span className="text-xs font-semibold">
                {percentChange === null ? "—" : formatPercent(percentChange)} from last period
              </span>
            </div>
          }
        />
      </div>
      <div className="bg-surface-container-lowest p-8 rounded-xl shadow-editorial">
        <StatCard
          label="Validated Entries"
          labelClassName="text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2"
          value={entriesCount.toLocaleString("en-US")}
          valueClassName="text-3xl font-bold text-on-surface mt-0"
          footer={
            <div className="flex items-center gap-2 text-tertiary">
              <CheckCircle size={14} />
              <span className="text-xs font-semibold">
                100% Reconciliation accuracy
              </span>
            </div>
          }
        />
      </div>
      <div className="bg-surface-container-low p-8 rounded-xl flex items-center justify-center relative overflow-hidden border border-primary/5">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary to-transparent"></div>
        <div className="text-center z-10">
          <TrendingUp size={32} className="text-primary mb-2 mx-auto" />
          <p className="text-sm font-bold text-primary">
            Generate Monthly Report
          </p>
        </div>
      </div>
    </div>
  );
}
