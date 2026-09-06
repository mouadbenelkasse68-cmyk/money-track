import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Transaction, SavingsGoal, BudgetConfig, UserSettings, Category } from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_SAVINGS_GOALS, INITIAL_BUDGET, INITIAL_SETTINGS, CURRENCIES } from '../data/initialData';

interface FinanceContextType {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  budget: BudgetConfig;
  settings: UserSettings;
  
  // Computed metrics
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalSaved: number;
  thisMonthSpending: number;
  thisMonthIncome: number;
  budgetRemaining: number;
  budgetPercentage: number;
  isBudgetCloseToLimit: boolean;
  isBudgetExceeded: boolean;

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
  depositToGoal: (goalId: string, amount: number) => void;
  withdrawFromGoal: (goalId: string, amount: number) => void;

  updateBudget: (newBudget: BudgetConfig) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  toggleDarkMode: () => void;
  resetToSampleData: () => void;
  clearAllData: () => void;

  formatCurrency: (amount: number) => string;
}

const STORAGE_KEYS = {
  TRANSACTIONS: 'moneytrack_transactions_v1',
  GOALS: 'moneytrack_goals_v1',
  BUDGET: 'moneytrack_budget_v1',
  SETTINGS: 'moneytrack_settings_v1',
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or fall back to initial seed
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
    } catch {
      return INITIAL_SAVINGS_GOALS;
    }
  });

  const [budget, setBudget] = useState<BudgetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
      return saved ? JSON.parse(saved) : INITIAL_BUDGET;
    } catch {
      return INITIAL_BUDGET;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return { ...INITIAL_SETTINGS, isDarkMode: prefersDark };
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    // Apply dark class to document root
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Format currency helper
  const formatCurrency = (amount: number): string => {
    const symbol = settings.currencySymbol || '$';
    const isNegative = amount < 0;
    const absVal = Math.abs(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${isNegative ? '-' : ''}${symbol}${absVal}`;
  };

  // Calculations
  const {
    totalIncome,
    totalExpense,
    thisMonthSpending,
    thisMonthIncome,
  } = useMemo(() => {
    let income = 0;
    let expense = 0;
    let mSpending = 0;
    let mIncome = 0;

    const currentYearMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

    transactions.forEach((tx) => {
      const isCurrentMonth = tx.date.startsWith(currentYearMonth);
      if (tx.type === 'income') {
        income += tx.amount;
        if (isCurrentMonth) mIncome += tx.amount;
      } else {
        expense += tx.amount;
        if (isCurrentMonth) mSpending += tx.amount;
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      thisMonthSpending: mSpending,
      thisMonthIncome: mIncome,
    };
  }, [transactions]);

  const totalSaved = useMemo(() => {
    return savingsGoals.reduce((sum, g) => sum + (g.savedAmount || 0), 0);
  }, [savingsGoals]);

  const currentBalance = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  const budgetRemaining = useMemo(() => {
    return Math.max(0, budget.monthlyLimit - thisMonthSpending);
  }, [budget.monthlyLimit, thisMonthSpending]);

  const budgetPercentage = useMemo(() => {
    if (budget.monthlyLimit <= 0) return 0;
    return Math.round((thisMonthSpending / budget.monthlyLimit) * 100);
  }, [budget.monthlyLimit, thisMonthSpending]);

  const isBudgetCloseToLimit = budgetPercentage >= 80 && budgetPercentage < 100;
  const isBudgetExceeded = budgetPercentage >= 100;

  // Actions
  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: 'goal-' + Date.now(),
      isCompleted: goalData.savedAmount >= goalData.targetAmount,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);

    if (newGoal.isCompleted) {
      triggerConfetti();
    }
  };

  const updateSavingsGoal = (updatedGoal: SavingsGoal) => {
    const isNowCompleted = updatedGoal.savedAmount >= updatedGoal.targetAmount;
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? { ...updatedGoal, isCompleted: isNowCompleted } : g))
    );
    if (isNowCompleted) {
      triggerConfetti();
    }
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899'],
      });
    } catch {
      // safe fallback
    }
  };

  const depositToGoal = (goalId: string, amount: number) => {
    if (amount <= 0) return;
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newAmount = (g.savedAmount || 0) + amount;
          const completed = newAmount >= g.targetAmount;
          if (completed && !g.isCompleted) {
            triggerConfetti();
          }
          return {
            ...g,
            savedAmount: newAmount,
            isCompleted: completed,
          };
        }
        return g;
      })
    );
  };

  const withdrawFromGoal = (goalId: string, amount: number) => {
    if (amount <= 0) return;
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newAmount = Math.max(0, (g.savedAmount || 0) - amount);
          return {
            ...g,
            savedAmount: newAmount,
            isCompleted: newAmount >= g.targetAmount,
          };
        }
        return g;
      })
    );
  };

  const updateBudget = (newBudget: BudgetConfig) => {
    setBudget(newBudget);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      // update currency symbol if currency code changed
      if (newSettings.currency && newSettings.currency !== prev.currency) {
        const found = CURRENCIES.find((c) => c.code === newSettings.currency);
        if (found) {
          updated.currencySymbol = found.symbol;
        }
      }
      return updated;
    });
  };

  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const resetToSampleData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setBudget(INITIAL_BUDGET);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.BUDGET);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  const clearAllData = () => {
    setTransactions([]);
    setSavingsGoals([]);
    setBudget({ monthlyLimit: 500, categoryLimits: {} });
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        savingsGoals,
        budget,
        settings,
        currentBalance,
        totalIncome,
        totalExpense,
        totalSaved,
        thisMonthSpending,
        thisMonthIncome,
        budgetRemaining,
        budgetPercentage,
        isBudgetCloseToLimit,
        isBudgetExceeded,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        depositToGoal,
        withdrawFromGoal,
        updateBudget,
        updateSettings,
        toggleDarkMode,
        resetToSampleData,
        clearAllData,
        formatCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
