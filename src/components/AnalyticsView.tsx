import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  PieChart as PieChartIcon,
  TrendingUp,
  BarChart3,
  Calendar,
  Sparkles,
  Award,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORY_DETAILS } from '../data/initialData';
import { Category } from '../types';

export const AnalyticsView: React.FC = () => {
  const { transactions, formatCurrency, settings, totalIncome, totalExpense } = useFinance();
  const [timeRange, setTimeRange] = useState<'this_month' | 'all_time'>('this_month');

  // Filter transactions according to selected range
  const relevantTransactions = useMemo(() => {
    if (timeRange === 'all_time') return transactions;
    const currentYearMonth = new Date().toISOString().substring(0, 7);
    return transactions.filter((tx) => tx.date.startsWith(currentYearMonth));
  }, [transactions, timeRange]);

  // 1. Spending by Category (Pie / Donut Chart)
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    let totalExpenseInRange = 0;

    relevantTransactions.forEach((tx) => {
      if (tx.type === 'expense') {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
        totalExpenseInRange += tx.amount;
      }
    });

    const data = Object.entries(map).map(([cat, amount]) => {
      const details = CATEGORY_DETAILS[cat as Category];
      const percentage = totalExpenseInRange > 0 ? Math.round((amount / totalExpenseInRange) * 100) : 0;
      return {
        name: cat,
        value: amount,
        percentage,
        color: details ? details.color : '#64748B',
      };
    });

    return data.sort((a, b) => b.value - a.value);
  }, [relevantTransactions]);

  // 2. Spending Over Time & Income vs Expense (Monthly grouping)
  const monthlyComparisonData = useMemo(() => {
    const monthsMap: Record<string, { month: string; income: number; expense: number; savings: number }> = {};

    transactions.forEach((tx) => {
      const ym = tx.date.substring(0, 7); // YYYY-MM
      if (!monthsMap[ym]) {
        const [year, month] = ym.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        const label = dateObj.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
        monthsMap[ym] = { month: label, income: 0, expense: 0, savings: 0 };
      }

      if (tx.type === 'income') {
        monthsMap[ym].income += tx.amount;
      } else {
        monthsMap[ym].expense += tx.amount;
      }
    });

    // Sort by key
    const sorted = Object.keys(monthsMap)
      .sort()
      .map((k) => {
        const item = monthsMap[k];
        item.savings = Math.max(0, item.income - item.expense);
        return item;
      });

    return sorted.slice(-6); // last 6 months
  }, [transactions]);

  // Top spending category
  const topCategory = categoryData[0] || null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual breakdown of where your money comes from and where it goes.
          </p>
        </div>

        {/* Time range switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('this_month')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'this_month'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('all_time')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'all_time'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Top Highlights Banner */}
      {topCategory && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: topCategory.color }}
            >
              <Award size={22} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Top Spending Category
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {topCategory.name} ({topCategory.percentage}%)
              </p>
              <p className="text-xs text-slate-500">
                {formatCurrency(topCategory.value)} spent
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ArrowUpRight size={22} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total Income Tracked
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalIncome)}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Earnings &amp; deposits
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ArrowDownLeft size={22} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total Spending Tracked
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalExpense)}
              </p>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                All-time expense outflows
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Spending by Category & Income vs Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Spending by Category (Donut) */}
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieChartIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Spending by Category
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Percentage distribution across all major categories
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl text-xs backdrop-blur-xs">
                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block"
                                style={{ backgroundColor: data.color }}
                              />
                              {data.name}
                            </p>
                            <p className="mt-1 text-slate-600 dark:text-slate-300">
                              Amount: <strong>{formatCurrency(data.value)}</strong>
                            </p>
                            <p className="text-slate-500">
                              Share: <strong>{data.percentage}%</strong> of expenses
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No expense data available for this range.
              </div>
            )}
          </div>

          {/* Category Legend Pills */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="truncate text-slate-600 dark:text-slate-300">{cat.name}</span>
                <span className="ml-auto font-bold text-slate-900 dark:text-white">
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Income vs Expenses Comparison (Bar Chart) */}
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Income vs Expenses
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Side-by-side comparison over recent months
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyComparisonData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                <XAxis
                  dataKey="month"
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
                        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl text-xs backdrop-blur-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
                          {payload.map((item, idx) => (
                            <p
                              key={idx}
                              className={`flex items-center justify-between gap-4 font-medium ${
                                item.dataKey === 'income' ? 'text-emerald-500' : 'text-rose-500'
                              }`}
                            >
                              <span className="capitalize">{item.name}:</span>
                              <span className="font-bold">{formatCurrency(Number(item.value))}</span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  formatter={(value) => (value === 'income' ? 'Income' : 'Expenses')}
                />
                <Bar dataKey="income" name="income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expense" name="expense" fill="#F43F5E" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Higher green bars indicate healthy positive cashflow</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Positive balance
            </span>
          </div>
        </div>
      </div>

      {/* Chart 3: Monthly Savings Growth */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Monthly Net Savings
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Net surplus (Income minus Expenses) available to fund your savings goals
          </p>
        </div>

        <div className="h-56 sm:h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyComparisonData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
              <XAxis
                dataKey="month"
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
                      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl text-xs backdrop-blur-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Net Savings: {formatCurrency(Number(payload[0].value))}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="savings" name="Net Savings" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
