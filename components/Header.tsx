'use client';

import React from 'react';
import {
  ArrowLeft,
  HelpCircle,
  Bell,
  Sparkles,
  ChevronDown,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  title?: string;
  showBack?: boolean;
  onOpenMobileMenu?: () => void;
}

export default function Header({
  onBack,
  title = 'Exams',
  showBack = true,
  onOpenMobileMenu,
}: HeaderProps) {
  return (
    <header className="h-16 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between z-10 shrink-0 select-none">
      {/* Left side breadcrumb & mobile menu */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {showBack && (
          <button
            onClick={onBack}
            className="p-1.5 md:p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center space-x-1.5 md:space-x-2">
          <span className="text-slate-400 text-sm">📁</span>
          <h1 className="font-semibold text-slate-800 text-xs md:text-sm tracking-wide truncate max-w-[140px] sm:max-w-none">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        <button className="hidden sm:block p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
        </button>

        <button className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full transition-colors">
          <Sparkles className="w-5 h-5" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-1.5 sm:pl-2 border-l border-slate-200 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-slate-900 overflow-hidden ring-2 ring-orange-400/50 flex items-center justify-center text-white text-xs font-bold shrink-0">
            MR
          </div>
          <span className="hidden sm:block text-xs font-semibold text-slate-700 group-hover:text-slate-900">
            Madhur Rastogi
          </span>
          <ChevronDown className="hidden sm:block w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </div>
      </div>
    </header>
  );
}
