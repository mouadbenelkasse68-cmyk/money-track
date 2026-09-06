import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  TrendingDown,
  Calendar,
  Sparkles,
  Info,
  Edit3,
  X,
  Check,
  Zap,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Category } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';
import { CategoryIcon } from './CategoryIcon';

const ALL_CATEGORIES: Category[] = [
  'Food',
  'Shopping',
  'Transport',
  'Entertainment',
  'School',
  'Bills',
  'Other',
];

export const BudgetView: React.FC = () => {
  const {
    budget,
    updateBudget,
    thisMonthSpending,
    budgetRemaining,
    budgetPercentage,
    isBudgetCloseToLimit,
    isBudgetExceeded,
    transactions,
    formatCurrency,
    settings,
  } = useFinance();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [monthlyLimitInput, setMonthlyLimitInput] = useState(budget.monthlyLimit.toString());
  const [categoryLimitsInput, setCategoryLimitsInput] = useState<Partial<Record<Category, number>>>(
    budget.categoryLimits || {}
  );

  // Calculate current month's spending per category
  const categorySpending = useMemo(() => {
    const currentYearMonth = new Date().toISOString().substring(0, 7);
    const spending: Record<Category, number> = {
      Food: 0,
      Shopping: 0,
      Transport: 0,
      Entertainment: 0,
      School: 0,
      Bills: 0,
      Other: 0,
    };

    transactions.forEach((tx) => {
      if (tx.type === 'expense' && tx.date.startsWith(currentYearMonth)) {
        spending[tx.category] = (spending[tx.category] || 0) + tx.amount;
      }
    });

    return spending;
  }, [transactions]);

  // Daily Pace calculations
  const { daysInMonth, currentDay, daysRemaining, dailyPaceSoFar, dailyAllowedRemaining } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const dInMonth = new Date(year, month + 1, 0).getDate();
    const day = now.getDate();
    const dRemaining = Math.max(1, dInMonth - day);

    const pace = thisMonthSpending / Math.max(1, day);
    const allowedRemaining = Math.max(0, budgetRemaining / dRemaining);

    return {
      daysInMonth: dInMonth,
      currentDay: day,
      daysRemaining: dRemaining,
      dailyPaceSoFar: pace,
      dailyAllowedRemaining: allowedRemaining,
    };
  }, [thisMonthSpending, budgetRemaining]);

  const handleOpenEdit = () => {
    setMonthlyLimitInput(budget.monthlyLimit.toString());
    setCategoryLimitsInput(budget.categoryLimits || {});
    setIsEditModalOpen(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(monthlyLimitInput);
    if (isNaN(parsedLimit) || parsedLimit <= 0) return;

    updateBudget({
      monthlyLimit: parsedLimit,
      categoryLimits: categoryLimitsInput,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Monthly Budget
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep your spending within bounds and prevent month-end surprises.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenEdit}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-emerald-200 dark:shadow-emerald-950/40 transition-all self-start sm:self-auto"
        >
          <Sliders size={17} />
          <span>Edit Limits</span>
        </button>
      </div>

      {/* Main Budget Status Banner */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 transition-all relative overflow-hidden ${
          isBudgetExceeded
            ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
            : isBudgetCloseToLimit
            ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Monthly Spending Limit
              </span>
              {isBudgetExceeded ? (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={13} /> Over Limit by {formatCurrency(thisMonthSpending - budget.monthlyLimit)}
                </span>
              ) : isBudgetCloseToLimit ? (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={13} /> Warning: 80%+ of budget reached
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={13} /> On Track
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {formatCurrency(thisMonthSpending)}
              </span>
              <span className="text-base text-slate-400 dark:text-slate-500">
                spent of {formatCurrency(budget.monthlyLimit)} limit
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {budgetRemaining > 0 ? (
                <>
                  You have <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(budgetRemaining)}</strong> left for the remaining {daysRemaining} days.
                </>
              ) : (
                'You have depleted your allocated monthly budget.'
              )}
            </p>
          </div>

          {/* Big percentage metric */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-right">
              <div
                className={`text-3xl sm:text-4xl font-bold ${
                  isBudgetExceeded
                    ? 'text-rose-500 dark:text-rose-400'
                    : isBudgetCloseToLimit
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {budgetPercentage}%
              </div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Budget Used
              </span>
            </div>
          </div>
        </div>

        {/* Big Progress Meter */}
        <div className="mt-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${
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

      {/* Daily Pace Insights Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Calendar Progress
            </span>
            <Calendar size={16} className="text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Day {currentDay} of {daysInMonth}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {daysRemaining} days remaining this month
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Current Daily Spend
            </span>
            <TrendingDown size={16} className="text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(dailyPaceSoFar)} / day
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Average spending pace so far
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Safe Target Daily Pace
            </span>
            <Zap size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(dailyAllowedRemaining)} / day
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Recommended to stay within budget
          </p>
        </div>
      </div>

      {/* Category Budgets Breakdown */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Category Budgets &amp; Limits
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of expenses by category for this calendar month
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenEdit}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Adjust Limits
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {ALL_CATEGORIES.map((cat) => {
            const spent = categorySpending[cat] || 0;
            const limit = budget.categoryLimits?.[cat] || 100;
            const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const isCatOver = spent > limit;
            const isCatWarning = percent >= 80 && percent <= 100;

            return (
              <div
                key={cat}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryIcon category={cat} withBackground size={18} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {cat}
                        </span>
                        {isCatOver && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-1.5 py-0.5 rounded">
                            Over budget
                          </span>
                        )}
                        {isCatWarning && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
                            80%+ used
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {CATEGORY_DETAILS[cat].description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                      {formatCurrency(spent)}
                      <span className="text-xs font-normal text-slate-400 ml-1">
                        / {formatCurrency(limit)}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isCatOver
                          ? 'text-rose-500'
                          : isCatWarning
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      {percent}% used
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isCatOver ? 'bg-rose-500' : isCatWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational 50/30/20 Budgeting Rule Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-850 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800">
          <Info size={18} className="text-emerald-600" />
          <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
            Educational Budgeting Guide: The 50 / 30 / 20 Rule
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
          The 50/30/20 rule is an easy-to-follow guideline for dividing your income into three clear buckets:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              50% Needs
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Groceries, rent, transport, utility bills, and basic school supplies.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
              30% Wants
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Dining out, movies, gaming, entertainment subscriptions, and shopping.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
            <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
              20% Savings
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Savings goals, emergency fund, and building future financial security.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Budget Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold font-heading">Set Monthly Limits</h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveBudget} className="mt-4 space-y-4">
                {/* Total Monthly Limit */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Overall Monthly Budget Limit
                  </label>
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                      {settings.currencySymbol}
                    </span>
                    <input
                      type="number"
                      step="10"
                      min="1"
                      value={monthlyLimitInput}
                      onChange={(e) => setMonthlyLimitInput(e.target.value)}
                      required
                      className="w-full bg-transparent py-2.5 pl-9 pr-3 text-xl font-bold focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Category Limits */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Category Limits (Monthly)
                  </h4>
                  <div className="space-y-2.5">
                    {ALL_CATEGORIES.map((cat) => (
                      <div key={cat} className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {cat}
                        </span>
                        <div className="relative w-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            {settings.currencySymbol}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="5"
                            value={categoryLimitsInput[cat] || ''}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setCategoryLimitsInput((prev) => ({
                                ...prev,
                                [cat]: isNaN(val) ? 0 : val,
                              }));
                            }}
                            className="w-full bg-transparent py-1.5 pl-7 pr-2 text-xs font-bold text-right focus:outline-hidden"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md"
                >
                  Save Budget Settings
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
