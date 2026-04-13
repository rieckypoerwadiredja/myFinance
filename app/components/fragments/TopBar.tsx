import React from "react";
import { Bell, UserCircle, Search } from "lucide-react";

export default function TopBar() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 h-14 sm:h-16 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex items-center gap-4 sm:gap-8 min-w-0">
        <div className="text-lg sm:text-2xl font-bold tracking-tight text-primary font-headline truncate">
          The Financial Ledger
        </div>
        <div className="hidden md:flex items-center bg-surface-low rounded-full px-4 py-1.5 w-56 lg:w-64">
          <Search size={16} className="text-on-surface-variant mr-2" />
          <input
            type="text"
            placeholder="Search ledger..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 hover:bg-surface-high rounded-full transition-colors text-on-surface-variant">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 hover:bg-surface-high rounded-full transition-colors cursor-pointer">
          <UserCircle size={22} className="text-primary" />
          <span className="hidden sm:inline text-sm font-medium">
            Riecky Poerwadiredja
          </span>
        </div>
      </div>
    </nav>
  );
}
