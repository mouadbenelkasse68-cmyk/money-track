import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PiggyBank,
  PieChart,
  Target,
  Settings,
  Plus,
  Sun,
  Moon,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ReceiptText },
  { id: 'budget', label: 'Budgets', icon: PiggyBank },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
}) => {
  const { settings, toggleDarkMode } = useFinance();

  const userInitial = (settings.userName || 'Alex').charAt(0).toUpperCase();

  return (
    <>
      {/* Desktop Sidebar Navigation (Clean Minimalism layout) */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col shrink-0 h-screen sticky top-0 select-none">
        <div className="p-6 lg:p-8 flex-1 flex flex-col overflow-y-auto">
          {/* Logo */}
          <div
            className="flex items-center gap-3 mb-8 lg:mb-10 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-xs group-hover:bg-emerald-700 transition-colors">
              M
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">
              MoneyTrack
            </span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="mt-auto p-6 lg:p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div
              className="flex items-center gap-3 min-w-0 cursor-pointer group"
              onClick={() => setActiveTab('settings')}
              title="Open Settings"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-sm shrink-0 group-hover:ring-2 group-hover:ring-emerald-500 transition-all">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                  {settings.userName || 'Alex Rivers'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
                  Pro Plan
                </p>
              </div>
            </div>

            {/* Theme toggle in sidebar */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {settings.isDarkMode ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-xs">
              M
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">
              MoneyTrack
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {settings.isDarkMode ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-slate-500" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 dark:shadow-emerald-950/40 active:scale-95"
            >
              <Plus size={15} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[11px] font-medium transition-all ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <div
                  className={`p-1 rounded-lg ${
                    isActive ? 'bg-emerald-50 dark:bg-emerald-950/50' : ''
                  }`}
                >
                  <Icon size={19} />
                </div>
                <span className="truncate max-w-[62px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
