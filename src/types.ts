export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Entertainment'
  | 'School'
  | 'Bills'
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // YYYY-MM-DD
  description?: string;
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  categoryIcon: string;
  targetDate?: string;
  color: string;
  isCompleted?: boolean;
}

export interface BudgetConfig {
  monthlyLimit: number;
  categoryLimits: Partial<Record<Category, number>>;
}

export interface UserSettings {
  userName: string;
  currency: string;
  currencySymbol: string;
  isDarkMode: boolean;
  monthlyIncomeEstimate: number;
  notifications: {
    budgetAlerts: boolean;
    goalMilestones: boolean;
    weeklySummary: boolean;
  };
}

export type ActiveTab = 'dashboard' | 'transactions' | 'budget' | 'goals' | 'analytics' | 'settings';
