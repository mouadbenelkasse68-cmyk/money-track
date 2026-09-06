import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { BudgetView } from './components/BudgetView';
import { SavingsGoalsView } from './components/SavingsGoalsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { ActiveTab, Transaction } from './types';
import { Shield, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenAddModal = (tx?: Transaction | null) => {
    setEditingTransaction(tx || null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      {/* Sidebar (desktop) & Mobile Navigation Header/Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => handleOpenAddModal(null)}
      />

      {/* Main Scrollable Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 md:pb-12 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  onNavigate={(tab) => setActiveTab(tab)}
                  onOpenAddModal={() => handleOpenAddModal(null)}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionsView onOpenAddModal={handleOpenAddModal} />
              )}

              {activeTab === 'goals' && <SavingsGoalsView />}

              {activeTab === 'budget' && <BudgetView />}

              {activeTab === 'analytics' && <AnalyticsView />}

              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Subtle Minimalist Footer */}
        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 py-5 text-center text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-emerald-500" />
              <span className="font-medium text-slate-600 dark:text-slate-400">
                MoneyTrack • Clean Minimalism
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Personal finance &amp; habit tracking • Stored locally in your browser
            </p>
          </div>
        </footer>
      </div>

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        transactionToEdit={editingTransaction}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
