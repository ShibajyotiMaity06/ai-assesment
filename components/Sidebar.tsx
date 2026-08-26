'use client';

import React from 'react';
import {
  LayoutGrid,
  Users,
  FileText,
  ClipboardCheck,
  Clock,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutGrid },
    { id: 'classroom', label: 'My Classroom', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'exams', label: 'Exams', icon: ClipboardCheck },
    { id: 'library', label: 'My Library', icon: Clock },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen?.(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-50 flex flex-col justify-between ${
          mobileOpen
            ? 'translate-x-0 w-64 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Top Header Logo */}
        <div>
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
                V
              </div>
              <span className={`font-bold text-xl text-slate-900 tracking-tight ${collapsed ? 'lg:hidden' : 'block'}`}>
                Veda<span className="text-orange-600">AI</span>
              </span>
            </div>

            {/* Collapse toggle desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight
                className={`w-5 h-5 transition-transform duration-300 ${
                  collapsed ? 'rotate-0' : 'rotate-180'
                }`}
              />
            </button>

            {/* Close button mobile */}
            <button
              onClick={() => setMobileOpen?.(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Teacher's Toolkit Banner Button */}
          <div className="p-4">
            <button
              className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full bg-slate-900 text-white font-medium text-sm shadow-md hover:bg-slate-800 transition-all duration-200 border border-slate-800 relative group overflow-hidden ${
                collapsed ? 'lg:px-2' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-4 h-4 text-orange-400 animate-pulse shrink-0" />
              <span className={collapsed ? 'lg:hidden' : 'block'}>AI Teacher&apos;s Toolkit</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-2 px-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen?.(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-orange-600' : 'text-slate-400'
                    }`}
                  />
                  <span className={collapsed ? 'lg:hidden' : 'block'}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-100 space-y-3">
          <button
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium transition-colors ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
          >
            <Settings className="w-5 h-5 text-slate-400 shrink-0" />
            <span className={collapsed ? 'lg:hidden' : 'block'}>Settings</span>
          </button>

          {/* School Badge */}
          <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-emerald-700" />
            </div>
            <div className={`min-w-0 ${collapsed ? 'lg:hidden' : 'block'}`}>
              <p className="text-xs font-bold text-slate-900 truncate">
                Delhi Public School
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Bokaro Steel City
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
