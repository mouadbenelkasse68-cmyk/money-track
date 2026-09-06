import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Plus,
  PiggyBank,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  Edit2,
  Smartphone,
  Gamepad2,
  Palmtree,
  ShieldCheck,
  Laptop,
  Car,
  X,
  Check,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types';
import { GOAL_TEMPLATES } from '../data/initialData';

const ICON_COMPONENTS: Record<string, any> = {
  Smartphone,
  Gamepad2,
  Palmtree,
  ShieldCheck,
  Laptop,
  Car,
  Target,
};

const COLOR_OPTIONS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#EF4444', // Red
];

export const SavingsGoalsView: React.FC = () => {
  const {
    savingsGoals,
    totalSaved,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    depositToGoal,
    withdrawFromGoal,
    formatCurrency,
    settings,
  } = useFinance();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [activeDepositGoal, setActiveDepositGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMode, setDepositMode] = useState<'deposit' | 'withdraw'>('deposit');

  // New/Edit Goal Form state
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialSaved, setInitialSaved] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Smartphone');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [targetDate, setTargetDate] = useState('');
  const [formError, setFormError] = useState('');

  const openCreateModal = (preset?: typeof GOAL_TEMPLATES[0]) => {
    if (preset) {
      setGoalName(preset.name);
      setTargetAmount(preset.target.toString());
      setInitialSaved('0');
      setSelectedIcon(preset.icon);
      setSelectedColor(preset.color);
    } else {
      setGoalName('');
      setTargetAmount('');
      setInitialSaved('0');
      setSelectedIcon('Target');
      setSelectedColor('#10B981');
    }
    setTargetDate('');
    setFormError('');
    setEditingGoal(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setInitialSaved(goal.savedAmount.toString());
    setSelectedIcon(goal.categoryIcon || 'Target');
    setSelectedColor(goal.color || '#3B82F6');
    setTargetDate(goal.targetDate || '');
    setFormError('');
    setIsCreateOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const saved = parseFloat(initialSaved || '0');

    if (!goalName.trim()) {
      setFormError('Please enter a goal name');
      return;
    }
    if (isNaN(target) || target <= 0) {
      setFormError('Please enter a target amount greater than 0');
      return;
    }

    if (editingGoal) {
      updateSavingsGoal({
        ...editingGoal,
        name: goalName.trim(),
        targetAmount: target,
        savedAmount: isNaN(saved) ? editingGoal.savedAmount : saved,
        categoryIcon: selectedIcon,
        color: selectedColor,
        targetDate: targetDate || undefined,
      });
    } else {
      addSavingsGoal({
        name: goalName.trim(),
        targetAmount: target,
        savedAmount: Math.max(0, isNaN(saved) ? 0 : saved),
        categoryIcon: selectedIcon,
        color: selectedColor,
        targetDate: targetDate || undefined,
      });
    }

    setIsCreateOpen(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDepositGoal) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (depositMode === 'deposit') {
      depositToGoal(activeDepositGoal.id, amount);
    } else {
      withdrawFromGoal(activeDepositGoal.id, amount);
    }

    setActiveDepositGoal(null);
    setDepositAmount('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Savings Goals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set targets for things you care about and watch your savings grow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-emerald-200 dark:shadow-emerald-950/40 transition-all"
          >
            <Plus size={18} />
            <span>Create Goal</span>
          </button>
        </div>
      </div>

      {/* Summary Total Saved Card */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Accumulated Across Goals
            </span>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalSaved)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Allocated across {savingsGoals.length} savings {savingsGoals.length === 1 ? 'target' : 'targets'}
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 max-w-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <PiggyBank size={22} />
            </div>
            <div className="text-xs">
              <span className="block font-semibold text-slate-900 dark:text-white">Smart Habit</span>
              <span className="text-slate-500 dark:text-slate-400">Separating savings from spending keeps you disciplined.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Goal Presets / Templates */}
      <div className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Quick Suggestions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {GOAL_TEMPLATES.map((tmpl) => {
            const Icon = ICON_COMPONENTS[tmpl.icon] || Target;
            return (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => openCreateModal(tmpl)}
                className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/40 text-left transition-all group shadow-xs"
              >
                <div
                  className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: tmpl.color }}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {tmpl.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {settings.currencySymbol}{tmpl.target}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsGoals.map((goal) => {
          const Icon = ICON_COMPONENTS[goal.categoryIcon || 'Target'] || Target;
          const percentage = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
          const isDone = goal.savedAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className={`rounded-3xl border bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs transition-all relative overflow-hidden flex flex-col justify-between ${
                isDone
                  ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
                  : 'border-slate-100 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-xs shrink-0"
                      style={{ backgroundColor: goal.color || '#10B981' }}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {goal.name}
                        </h3>
                        {isDone && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={13} /> Completed!
                          </span>
                        )}
                      </div>
                      {goal.targetDate && (
                        <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Calendar size={13} /> Target: {goal.targetDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Dropdown / Edit */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Goal"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${goal.name}" goal?`)) {
                          deleteSavingsGoal(goal.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Amount Progress Display: Saved amount / Target amount */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {formatCurrency(goal.savedAmount)}
                      <span className="text-sm font-normal text-slate-400 ml-1.5">
                        / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: goal.color || '#10B981',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>
                      {remaining > 0 ? (
                        <>Need <strong>{formatCurrency(remaining)}</strong> more</>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Goal Achieved! 🎉</span>
                      )}
                    </span>
                    <span>
                      {goal.targetAmount > 0 && goal.savedAmount > 0
                        ? `${Math.round(goal.savedAmount / (goal.targetAmount / 100))}% reached`
                        : 'Just started'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deposit / Withdraw Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveDepositGoal(goal);
                    setDepositMode('deposit');
                    setDepositAmount('');
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold transition-colors"
                >
                  <ArrowUpRight size={15} />
                  <span>Deposit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDepositGoal(goal);
                    setDepositMode('withdraw');
                    setDepositAmount('');
                  }}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  <ArrowDownLeft size={15} />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          );
        })}

        {savingsGoals.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto text-emerald-600 mb-3">
              <Target size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Savings Goals Created Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Pick one of the quick suggestions above or create a custom goal to start budgeting towards your dreams.
            </p>
            <button
              onClick={() => openCreateModal()}
              className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold"
            >
              <Plus size={16} /> Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Deposit / Withdraw Modal */}
      <AnimatePresence>
        {activeDepositGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold font-heading">
                  {depositMode === 'deposit' ? 'Add Funds to Goal' : 'Withdraw from Goal'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveDepositGoal(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target: <strong>{activeDepositGoal.name}</strong> (Currently saved:{' '}
                  {formatCurrency(activeDepositGoal.savedAmount)})
                </p>

                <form onSubmit={handleDepositSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Amount
                    </label>
                    <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-within:border-emerald-500">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                        {settings.currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        autoFocus
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full bg-transparent py-2.5 pl-9 pr-3 text-xl font-bold focus:outline-hidden"
                      />
                    </div>

                    {/* Quick amount chips */}
                    <div className="flex gap-1.5 mt-2">
                      {[10, 25, 50, 100].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setDepositAmount(v.toString())}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          +{settings.currencySymbol}{v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm shadow-md ${
                      depositMode === 'deposit'
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                        : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    }`}
                  >
                    Confirm {depositMode === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create / Edit Goal Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white my-8"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold font-heading">
                  {editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveGoal} className="mt-4 space-y-4">
                {/* Goal Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., New Phone, Emergency Fund, Summer Holiday"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Target Amount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Target Amount
                    </label>
                    <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        {settings.currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        placeholder="500"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                        className="w-full bg-transparent py-2.5 pl-7 pr-3 text-sm font-bold focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Already Saved
                    </label>
                    <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        {settings.currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        placeholder="0"
                        value={initialSaved}
                        onChange={(e) => setInitialSaved(e.target.value)}
                        className="w-full bg-transparent py-2.5 pl-7 pr-3 text-sm font-bold focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Target Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Icon selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Icon
                  </label>
                  <div className="flex items-center gap-2">
                    {['Smartphone', 'Gamepad2', 'Palmtree', 'ShieldCheck', 'Laptop', 'Car', 'Target'].map(
                      (ic) => {
                        const IconComponent = ICON_COMPONENTS[ic];
                        return (
                          <button
                            key={ic}
                            type="button"
                            onClick={() => setSelectedIcon(ic)}
                            className={`p-2 rounded-xl border transition-all ${
                              selectedIcon === ic
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 ring-1 ring-emerald-500'
                                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <IconComponent size={18} />
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Color selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Badge Color
                  </label>
                  <div className="flex items-center gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                      >
                        {selectedColor === c && <Check size={14} className="text-white stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {formError && <p className="text-xs text-rose-500 font-semibold">{formError}</p>}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20"
                >
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
