import React from 'react';
import { Bell, UserCircle, Search } from 'lucide-react';

export default function TopBar() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold tracking-tight text-primary font-headline">The Editorial Ledger</div>
        <div className="hidden md:flex items-center bg-surface-low rounded-full px-4 py-1.5 w-64">
          <Search size={16} className="text-on-surface-variant mr-2" />
          <input 
            type="text" 
            placeholder="Search ledger..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant/60"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface-high rounded-full transition-colors text-on-surface-variant">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-high rounded-full transition-colors cursor-pointer">
          <UserCircle size={24} className="text-primary" />
          <span className="text-sm font-medium">J. Sterling</span>
        </div>
      </div>
    </nav>
  );
}
