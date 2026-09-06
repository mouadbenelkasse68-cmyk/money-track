import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Coins,
  Bell,
  User,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Check,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CURRENCIES, FINANCIAL_TIPS } from '../data/initialData';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    toggleDarkMode,
    resetToSampleData,
    clearAllData,
    transactions,
    savingsGoals,
    budget,
  } = useFinance();

  const [savedNotice, setSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSavedBadge = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleCurrencyChange = (newCurr: string) => {
    updateSettings({ currency: newCurr });
    showSavedBadge();
  };

  const handleExportJSON = () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      transactions,
      savingsGoals,
      budget,
      settings,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `moneytrack_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.transactions && parsed.savingsGoals && parsed.budget) {
          localStorage.setItem('moneytrack_transactions_v1', JSON.stringify(parsed.transactions));
          localStorage.setItem('moneytrack_goals_v1', JSON.stringify(parsed.savingsGoals));
          localStorage.setItem('moneytrack_budget_v1', JSON.stringify(parsed.budget));
          if (parsed.settings) {
            localStorage.setItem('moneytrack_settings_v1', JSON.stringify(parsed.settings));
          }
          window.location.reload();
        } else {
          alert('Invalid backup file format');
        }
      } catch (err) {
        alert('Could not parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Profile &amp; Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize your currency, notifications, appearance, and account preferences.
          </p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Check size={14} /> Saved!
          </span>
        )}
      </div>

      {/* 1. Account Settings */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <User size={18} />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Account Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => {
                updateSettings({ userName: e.target.value });
                showSavedBadge();
              }}
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              Estimated Monthly Income
            </label>
            <div className="relative rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                {settings.currencySymbol}
              </span>
              <input
                type="number"
                value={settings.monthlyIncomeEstimate || ''}
                onChange={(e) => {
                  updateSettings({ monthlyIncomeEstimate: parseFloat(e.target.value) || 0 });
                  showSavedBadge();
                }}
                placeholder="2000"
                className="w-full bg-transparent py-2.5 pl-8 pr-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Currency & Appearance */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Coins size={18} />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Currency &amp; Display
          </h2>
        </div>

        {/* Currency selection */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2.5">
            Default Currency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CURRENCIES.map((c) => {
              const isSelected = settings.currency === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCurrencyChange(c.code)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-500/20'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{c.code}</span>
                    <span className="text-[11px] text-slate-400 truncate block">{c.symbol}</span>
                  </div>
                  {isSelected && <Check size={16} className="text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dark / Light Mode */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Color Theme
            </h3>
            <p className="text-xs text-slate-400">
              Switch between clean light minimalism and low-light mode
            </p>
          </div>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {settings.isDarkMode ? (
              <>
                <Sun size={16} className="text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={16} className="text-slate-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Bell size={18} />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Notifications &amp; Alerts
          </h2>
        </div>

        <div className="space-y-3 divide-y divide-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Budget Threshold Warning
              </p>
              <p className="text-xs text-slate-400">
                Receive visual warnings when reaching 80% or 100% of monthly spending limits
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.budgetAlerts}
              onChange={(e) => {
                updateSettings({
                  notifications: { ...settings.notifications, budgetAlerts: e.target.checked },
                });
                showSavedBadge();
              }}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Savings Goal Milestones
              </p>
              <p className="text-xs text-slate-400">
                Trigger celebration confetti and badges whenever a savings target is reached
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.goalMilestones}
              onChange={(e) => {
                updateSettings({
                  notifications: { ...settings.notifications, goalMilestones: e.target.checked },
                });
                showSavedBadge();
              }}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Weekly Spending Summary
              </p>
              <p className="text-xs text-slate-400">
                Highlight top spending categories and weekly trends
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.weeklySummary}
              onChange={(e) => {
                updateSettings({
                  notifications: { ...settings.notifications, weeklySummary: e.target.checked },
                });
                showSavedBadge();
              }}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* 4. Data Management (Export, Import, Reset, Clear) */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <RotateCcw size={18} />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Data &amp; Backup
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your data is stored locally in your browser. You can export a JSON backup, restore an earlier backup, or reset to realistic demo data anytime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download size={15} />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Upload size={15} />
            <span>Import Backup (JSON)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all transactions and goals to sample starter data?')) {
                resetToSampleData();
              }
            }}
            className="w-full sm:w-auto text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 py-2 transition-colors"
          >
            Reset to Sample Starter Data
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all transactions and goals? This action cannot be undone.')) {
                clearAllData();
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 py-2 transition-colors"
          >
            <Trash2 size={14} />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* 5. Educational Philosophy & Financial Education */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BookOpen size={18} />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            MoneyTrack Philosophy: Habit Over Restriction
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
          MoneyTrack is designed strictly for <strong>education, awareness, and habit tracking</strong>. We believe that tracking where every dollar goes builds emotional clarity around your personal choices without judgment. Small mindful adjustments—like setting goal funds before impulse shopping—compound into true peace of mind.
        </p>
      </div>
    </div>
  );
};
