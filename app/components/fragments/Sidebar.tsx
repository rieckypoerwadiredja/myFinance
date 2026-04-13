"use client";
import { LayoutDashboard, Receipt, CloudUpload, Plus } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full p-6 gap-8 w-64 bg-surface-low pt-24 z-40">
      <div className="space-y-2">
        <Link
          href="/"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-lowest text-primary shadow-sm font-bold`}
        >
          <LayoutDashboard size={20} />
          <span className="text-sm">Dashboard</span>
        </Link>
        <Link
          href="/transactions"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-lowest text-primary shadow-sm font-bold`}
        >
          <Receipt size={20} />
          <span className="text-sm">Transactions</span>
        </Link>
        <Link
          href="/upload"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-lowest text-primary shadow-sm font-bold`}
        >
          <CloudUpload size={20} />
          <span className="text-sm">Upload</span>
        </Link>
      </div>

      <Link href="/upload" className="mt-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-br from-primary to-primary-dim text-white font-semibold rounded-full shadow-lg"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </motion.button>
      </Link>
    </aside>
  );
}
