import { Transaction, SavingsGoal, BudgetConfig, UserSettings, Category } from '../types';

export const CATEGORY_DETAILS: Record<Category, { name: Category; icon: string; color: string; bgColor: string; darkBgColor: string; description: string }> = {
  Food: {
    name: 'Food',
    icon: 'Utensils',
    color: '#F97316', // orange-500
    bgColor: 'bg-orange-50 text-orange-600 border-orange-200',
    darkBgColor: 'dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/40',
    description: 'Groceries, dining out, snacks & coffee',
  },
  Shopping: {
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#EC4899', // pink-500
    bgColor: 'bg-pink-50 text-pink-600 border-pink-200',
    darkBgColor: 'dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-800/40',
    description: 'Clothing, gadgets, personal items',
  },
  Transport: {
    name: 'Transport',
    icon: 'Car',
    color: '#3B82F6', // blue-500
    bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
    darkBgColor: 'dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40',
    description: 'Fuel, bus/train passes, rideshare',
  },
  Entertainment: {
    name: 'Entertainment',
    icon: 'Gamepad2',
    color: '#8B5CF6', // purple-500
    bgColor: 'bg-purple-50 text-purple-600 border-purple-200',
    darkBgColor: 'dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/40',
    description: 'Movies, concerts, streaming, games',
  },
  School: {
    name: 'School',
    icon: 'GraduationCap',
    color: '#06B6D4', // cyan-500
    bgColor: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    darkBgColor: 'dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/40',
    description: 'Books, tuition, supplies, courses',
  },
  Bills: {
    name: 'Bills',
    icon: 'Receipt',
    color: '#EF4444', // red-500
    bgColor: 'bg-red-50 text-red-600 border-red-200',
    darkBgColor: 'dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/40',
    description: 'Phone plan, internet, utilities, subscriptions',
  },
  Other: {
    name: 'Other',
    icon: 'Sparkles',
    color: '#64748B', // slate-500
    bgColor: 'bg-slate-100 text-slate-600 border-slate-200',
    darkBgColor: 'dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50',
    description: 'Gifts, miscellaneous, unexpected items',
  },
};

// Generate date strings relative to current date
const now = new Date();
const formatDate = (daysAgo: number): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Part-Time Job Salary',
    amount: 1250,
    type: 'income',
    category: 'Other',
    date: formatDate(1),
    description: 'Bi-weekly paycheck deposit',
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'tx-2',
    title: 'Grocery Supermarket',
    amount: 68.50,
    type: 'expense',
    category: 'Food',
    date: formatDate(1),
    description: 'Weekly meal prep groceries and fruits',
    createdAt: Date.now() - 86400000 * 1 + 5000,
  },
  {
    id: 'tx-3',
    title: 'Monthly Metro Transit Pass',
    amount: 45.00,
    type: 'expense',
    category: 'Transport',
    date: formatDate(2),
    description: 'Unlimited subway and city bus card',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'tx-4',
    title: 'Freelance Design Project',
    amount: 320.00,
    type: 'income',
    category: 'Other',
    date: formatDate(3),
    description: 'Logo design for campus event club',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'tx-5',
    title: 'Physics & Calc Textbooks',
    amount: 85.00,
    type: 'expense',
    category: 'School',
    date: formatDate(4),
    description: 'Used textbooks from university bookstore',
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'tx-6',
    title: 'Movie Night & Popcorn',
    amount: 24.50,
    type: 'expense',
    category: 'Entertainment',
    date: formatDate(5),
    description: 'Cinema ticket with friends',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'tx-7',
    title: 'Mobile Phone & Data Bill',
    amount: 35.00,
    type: 'expense',
    category: 'Bills',
    date: formatDate(7),
    description: 'Monthly 5G unlimited plan',
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: 'tx-8',
    title: 'New Running Shoes',
    amount: 89.99,
    type: 'expense',
    category: 'Shopping',
    date: formatDate(9),
    description: 'Running sneakers on sale',
    createdAt: Date.now() - 86400000 * 9,
  },
  {
    id: 'tx-9',
    title: 'Coffee & Breakfast Bagel',
    amount: 9.75,
    type: 'expense',
    category: 'Food',
    date: formatDate(10),
    description: 'Morning study session at local cafe',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'tx-10',
    title: 'Tutoring Sessions Income',
    amount: 150.00,
    type: 'income',
    category: 'School',
    date: formatDate(12),
    description: '3 hours of math tutoring',
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: 'tx-11',
    title: 'Streaming & Music Subscriptions',
    amount: 17.99,
    type: 'expense',
    category: 'Bills',
    date: formatDate(14),
    description: 'Spotify Student & Netflix plan',
    createdAt: Date.now() - 86400000 * 14,
  },
  {
    id: 'tx-12',
    title: 'Pizza Night with Roommates',
    amount: 22.00,
    type: 'expense',
    category: 'Food',
    date: formatDate(16),
    description: 'Split artisanal pizza delivery',
    createdAt: Date.now() - 86400000 * 16,
  },
  {
    id: 'tx-13',
    title: 'Campus Stationery & Notebooks',
    amount: 18.50,
    type: 'expense',
    category: 'School',
    date: formatDate(18),
    description: 'Highlighters, binder, and graph paper',
    createdAt: Date.now() - 86400000 * 18,
  },
  {
    id: 'tx-14',
    title: 'Birthday Gift from Family',
    amount: 100.00,
    type: 'income',
    category: 'Other',
    date: formatDate(20),
    description: 'Gift card deposit from grandparents',
    createdAt: Date.now() - 86400000 * 20,
  },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'New Phone',
    targetAmount: 850,
    savedAmount: 620,
    categoryIcon: 'Smartphone',
    targetDate: '2026-11-30',
    color: '#3B82F6',
    isCompleted: false,
  },
  {
    id: 'goal-2',
    name: 'Gaming Console',
    targetAmount: 499,
    savedAmount: 380,
    categoryIcon: 'Gamepad2',
    targetDate: '2026-12-25',
    color: '#8B5CF6',
    isCompleted: false,
  },
  {
    id: 'goal-3',
    name: 'Holiday Trip',
    targetAmount: 1200,
    savedAmount: 750,
    categoryIcon: 'Palmtree',
    targetDate: '2027-01-15',
    color: '#10B981',
    isCompleted: false,
  },
  {
    id: 'goal-4',
    name: 'Emergency Savings',
    targetAmount: 1500,
    savedAmount: 1100,
    categoryIcon: 'ShieldCheck',
    targetDate: '2026-10-31',
    color: '#F59E0B',
    isCompleted: false,
  },
];

export const INITIAL_BUDGET: BudgetConfig = {
  monthlyLimit: 750,
  categoryLimits: {
    Food: 250,
    Shopping: 120,
    Transport: 70,
    Entertainment: 80,
    School: 100,
    Bills: 80,
    Other: 50,
  },
};

export const INITIAL_SETTINGS: UserSettings = {
  userName: 'Alex Morgan',
  currency: 'USD',
  currencySymbol: '$',
  isDarkMode: false,
  monthlyIncomeEstimate: 1800,
  notifications: {
    budgetAlerts: true,
    goalMilestones: true,
    weeklySummary: true,
  },
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham (DH)' },
];

export const GOAL_TEMPLATES = [
  { name: 'New phone', target: 800, icon: 'Smartphone', color: '#3B82F6' },
  { name: 'Gaming console', target: 500, icon: 'Gamepad2', color: '#8B5CF6' },
  { name: 'Holiday', target: 1200, icon: 'Palmtree', color: '#10B981' },
  { name: 'Emergency savings', target: 1500, icon: 'ShieldCheck', color: '#F59E0B' },
  { name: 'Laptop / PC Upgrade', target: 1100, icon: 'Laptop', color: '#EC4899' },
  { name: 'Car Down Payment', target: 2500, icon: 'Car', color: '#06B6D4' },
];

export const FINANCIAL_TIPS = [
  {
    title: 'The 50/30/20 Rule',
    tag: 'Budgeting',
    tip: 'Allocate 50% of your net income to Needs, 30% to Wants, and 20% to Savings & Goals.',
  },
  {
    title: 'The 24-Hour Purchase Rule',
    tag: 'Habit',
    tip: 'Wait 24 hours before making impulse purchases over $30. Most impulsive cravings fade by the next day.',
  },
  {
    title: 'Emergency Cushion First',
    tag: 'Safety',
    tip: 'Having even $500–$1,000 in dedicated emergency savings prevents unexpected expenses from becoming high-interest debt.',
  },
  {
    title: 'Audit Subscriptions Monthly',
    tag: 'Smart Saving',
    tip: 'Unused streaming, apps, or gym memberships quietly drain $30–$80 every single month.',
  },
];
