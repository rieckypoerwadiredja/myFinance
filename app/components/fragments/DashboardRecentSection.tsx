import { ArrowRight } from "lucide-react";
import SectionHeader from "../elements/SectionHeader";
import { SheetTransaction } from "../../types/types";
import { formatRupiah } from "../../lib/rupiah";
import { cn } from "../../lib/utils";
import { getCategoryBarClassName } from "../../lib/categories";
import Link from "next/link";

type Props = {
  items: SheetTransaction[];
};

export default function DashboardRecentSection({ items }: Props) {
  const rows = items.slice(0, 2);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <section className="lg:col-span-8 flex flex-col gap-6">
        <SectionHeader
          className="items-end"
          title="Recent Activity"
          rightSlot={
            <Link
              href="/transactions"
              className="text-primary text-xs font-bold hover:underline"
            >
              View Transaction History
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.length === 0 ? (
            <div className="p-5 bg-surface-lowest border border-outline-variant/10 rounded-xl text-sm text-on-surface-variant">
              No recent activity.
            </div>
          ) : null}
          {rows.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-5 bg-surface-lowest border border-outline-variant/10 rounded-xl hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    getCategoryBarClassName(item.kriteria),
                  )}
                />
                <div>
                  <div className="font-bold text-on-surface">
                    {item.kriteria}
                  </div>
                  <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    {item.note || "—"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-on-surface">
                  -{formatRupiah(Math.abs(item.pengeluaranNumber ?? 0))}
                </div>
                <div className="text-[10px] text-on-surface-variant font-medium">
                  {item.tanggal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lg:col-span-4">
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-white overflow-hidden group cursor-pointer shadow-lg h-full flex flex-col justify-center">
          <div className="relative z-10">
            <span className="inline-block px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase mb-4">
              New Insight
            </span>
            <h3 className="font-bold text-xl leading-tight mb-2">
              Portfolio Optimization
            </h3>
            <p className="text-sm text-white/80 mb-6 max-w-[200px]">
              Reduce monthly subscriptions by 15% using our AI Auditor.
            </p>
            <button className="bg-white text-primary hover:bg-white/90 px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 group-hover:gap-3">
              Launch Auditor <ArrowRight size={14} />
            </button>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
        </div>
      </section>
    </div>
  );
}
