import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Dashboard from '@/pages/Dashboard';
import History from '@/pages/History';
import Rewards from '@/pages/Rewards';
import HabitForm from '@/components/HabitForm';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types/habit';
import { motion, AnimatePresence } from 'framer-motion';

type Page = 'dashboard' | 'rewards' | 'history';

const Index = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const {
    habits,
    completions,
    walletState,
    connectWallet,
    disconnectWallet,
    addHabit,
    updateHabit,
    completeHabit,
    claimReward,
  } = useHabits();

  // Update current page based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/history') {
      setCurrentPage('history');
    } else if (path === '/rewards') {
      setCurrentPage('rewards');
    } else {
      setCurrentPage('dashboard');
    }
  }, [location.pathname]);

  const handleAddHabit = () => {
    setEditingHabit(undefined);
    setShowHabitForm(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowHabitForm(true);
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
    setShowHabitForm(false);
    setEditingHabit(undefined);
  };

  const handleCancelHabitForm = () => {
    setShowHabitForm(false);
    setEditingHabit(undefined);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'history':
        return <History habits={habits} completions={completions} />;
      case 'rewards':
        return (
          <Rewards
            habits={habits}
            walletState={walletState}
            onConnectWallet={connectWallet}
            onDisconnectWallet={disconnectWallet}
            onClaimReward={claimReward}
          />
        );
      default:
        return (
          <Dashboard
            habits={habits}
            walletState={walletState}
            onCompleteHabit={completeHabit}
            onEditHabit={handleEditHabit}
            onConnectWallet={connectWallet}
            onDisconnectWallet={disconnectWallet}
            onClaimReward={claimReward}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAddHabit={handleAddHabit} />
      
      <main className="container mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {showHabitForm ? (
            <motion.div
              key="habit-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <HabitForm
                habit={editingHabit}
                onSave={handleSaveHabit}
                onCancel={handleCancelHabitForm}
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderCurrentPage()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
