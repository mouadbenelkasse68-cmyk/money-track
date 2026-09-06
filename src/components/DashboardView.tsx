import React, { useMemo, useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  ChevronRight,
  AlertTriangle,
  Plus,
  Target,
  Sparkles,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { CategoryIcon } from './CategoryIcon';
import { FINANCIAL_TIPS } from '../data/initialData';
import { ActiveTab } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  const {
    currentBalance,
    totalIncome,
    totalExpense,
    totalSaved,
    thisMonthSpending,
    budget,
    budgetRemaining,
    budgetPercentage,
    isBudgetCloseToLimit,
    isBudgetExceeded,
    transactions,
    savingsGoals,
    settings,
    formatCurrency,
  } = useFinance();

  const [chartRange, setChartRange] = useState<'7d' | '30d'>('7d');

  // Random or rotating tip
  const tipOfTheDay = useMemo(() => {
    return FINANCIAL_TIPS[Math.floor(Math.random() * FINANCIAL_TIPS.length)] || FINANCIAL_TIPS[0];
  }, []);

  // Compute spending chart data
  const chartData = useMemo(() => {
    const days = chartRange === '7d' ? 7 : 30;
    const result = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString(undefined, {
        weekday: days <= 7 ? 'short' : undefined,
        month: 'short',
        day: 'numeric',
      });

      // Sum expenses and income for this day
      let expense = 0;
      let income = 0;
      transactions.forEach((tx) => {
        if (tx.date === dateStr) {
          if (tx.type === 'expense') expense += tx.amount;
          else income += tx.amount;
        }
      });

      result.push({
        date: dateStr,
        label: dayLabel,
        Spent: expense,
        Income: income,
      });
    }

    return result;
  }, [transactions, chartRange]);

  // Recent 5 transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt)
      .slice(0, 5);
  }, [transactions]);

  // Top 3 savings goals
  const activeGoals = useMemo(() => {
    return savingsGoals.slice(0, 3);
  }, [savingsGoals]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Welcome back{settings.userName ? `, ${settings.userName}` : ''}, here's what's happening with your money.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            Monthly Report
          </button>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-200 dark:shadow-emerald-950/40 transition-all text-sm flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        </div>
      </header>

      {/* 4 Metric Cards (Clean Minimalism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 transition-all">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Total Balance
          </p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
            {formatCurrency(currentBalance)}
          </p>
          <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ArrowUpRight size={13} />
            <span>Active net balance</span>
          </div>
        </div>

        {/* Total Received */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 transition-all">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Total Received
          </p>
          <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalIncome)}
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Earnings &amp; deposits
          </p>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 transition-all">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Total Spent
          </p>
          <p className="text-2xl font-bold mt-1 text-rose-500 dark:text-rose-400">
            {formatCurrency(totalExpense)}
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {budgetPercentage}% of monthly budget
          </p>
        </div>

        {/* Total Saved */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 transition-all">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Total Saved
          </p>
          <p className="text-2xl font-bold mt-1 text-indigo-600 dark:text-indigo-400">
            {formatCurrency(totalSaved)}
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Across {savingsGoals.length} savings goals
          </p>
        </div>
      </div>

      {/* Monthly Budget Quick Banner / Warning */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isBudgetExceeded
          ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
          : isBudgetCloseToLimit
          ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isBudgetExceeded
                ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
                : isBudgetCloseToLimit
                ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
            }`}>
              {isBudgetExceeded || isBudgetCloseToLimit ? <AlertTriangle size={19} /> : <TrendingDown size={19} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Budget Status
                </h3>
                {isBudgetExceeded && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white">
                    Exceeded limit!
                  </span>
                )}
                {isBudgetCloseToLimit && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white">
                    Close to limit ({budgetPercentage}%)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Spent {formatCurrency(thisMonthSpending)} of your {formatCurrency(budget.monthlyLimit)} monthly limit ({budgetRemaining > 0 ? `${formatCurrency(budgetRemaining)} remaining` : 'Limit reached'})
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('budget')}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 self-start sm:self-center"
          >
            <span>Manage Budget</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              isBudgetExceeded
                ? 'bg-rose-500'
                : isBudgetCloseToLimit
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, budgetPercentage)}%` }}
          />
        </div>
      </div>

      {/* Main Content Grid: 3-column layout (Clean Minimalism) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spending Analysis Section (2 cols) */}
        <section className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Spending Analysis
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Cashflow tracking &amp; day-by-day comparison
              </p>
            </div>

            {/* Week / Month Toggle */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setChartRange('7d')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  chartRange === '7d'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setChartRange('30d')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  chartRange === '30d'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  tickFormatter={(val) => `${settings.currencySymbol}${val}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl text-xs backdrop-blur-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
                          {payload.map((item, idx) => (
                            <p
                              key={idx}
                              className={`flex items-center justify-between gap-4 font-medium ${
                                item.dataKey === 'Spent' ? 'text-rose-500' : 'text-emerald-500'
                              }`}
                            >
                              <span>{item.name}:</span>
                              <span className="font-bold">
                                {formatCurrency(Number(item.value))}
                              </span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Spent"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSpent)"
                />
                <Area
                  type="monotone"
                  dataKey="Income"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Expenses
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Income
              </span>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              Full Analytics <ChevronRight size={13} />
            </button>
          </div>
        </section>

        {/* Savings Goals & Recent Transactions Section (1 col) */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Savings Goals
              </h2>
              <button
                onClick={() => onNavigate('goals')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                View All ({savingsGoals.length})
              </button>
            </div>

            <div className="space-y-5">
              {activeGoals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {goal.name}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: goal.color || '#6366F1',
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {activeGoals.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No active savings goals yet.
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions at bottom of card */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Recent Transactions
              </h3>
              <button
                onClick={() => onNavigate('transactions')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {recentTransactions.slice(0, 3).map((tx) => {
                const isIncome = tx.type === 'income';
                const initial = tx.title.charAt(0).toUpperCase();
                return (
                  <div key={tx.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-sm shrink-0">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {tx.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {tx.date} • {tx.category}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold shrink-0 ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                );
              })}

              {recentTransactions.length === 0 && (
                <p className="text-xs text-slate-400 py-3 text-center">No recent transactions.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Smart Financial Habit / Educational Tip */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {tipOfTheDay.tag}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {tipOfTheDay.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              {tipOfTheDay.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
