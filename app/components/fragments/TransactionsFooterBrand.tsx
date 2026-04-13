"use client";

export default function TransactionsFooterBrand() {
  return (
    <div className="mt-12 flex items-center justify-center opacity-30">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
          The Editorial Ledger
        </span>
        <div className="w-1 h-1 bg-on-surface rounded-full"></div>
        <span className="text-xs font-medium italic">
          Confidential Data Protocol
        </span>
      </div>
    </div>
  );
}
