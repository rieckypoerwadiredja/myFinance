"use client";

import { Calendar, Filter } from "lucide-react";
import { cn } from "../../lib/utils";

type Props = {
  isCategoryOpen: boolean;
  isDateOpen: boolean;
  onToggleCategory: () => void;
  onToggleDate: () => void;
};

export default function TransactionsHeader({
  isCategoryOpen,
  isDateOpen,
  onToggleCategory,
  onToggleDate,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
          Ledger Details
        </h1>
        <p className="text-on-surface-variant max-w-lg leading-relaxed">
          A curated view of your validated financial activities. Each entry
          reflects a verified movement of value across your digital assets.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          className={cn(
            "bg-surface-container-lowest border border-outline-variant/15 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors",
            isCategoryOpen && "bg-surface-container-high",
          )}
          onClick={onToggleCategory}
        >
          <Filter size={16} />
          Filter
        </button>
        <button
          className={cn(
            "bg-surface-container-lowest border border-outline-variant/15 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors",
            isDateOpen && "bg-surface-container-high",
          )}
          onClick={onToggleDate}
        >
          <Calendar size={16} />
          Date Range
        </button>
      </div>
    </div>
  );
}
