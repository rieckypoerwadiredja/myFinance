import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  CloudUpload, 
  Plus 
} from 'lucide-react';
import { Page } from '../types';
import { motion } from 'motion/react';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'upload', label: 'Upload', icon: CloudUpload },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full p-6 gap-8 w-64 bg-surface-low pt-24 z-40">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (currentPage === 'verify' && item.id === 'upload');
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id as Page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-surface-lowest text-primary shadow-sm font-bold' 
                  : 'text-on-surface opacity-70 hover:translate-x-1 hover:bg-surface-high'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-br from-primary to-primary-dim text-white font-semibold rounded-full shadow-lg"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </motion.button>
      </div>
    </aside>
  );
}
