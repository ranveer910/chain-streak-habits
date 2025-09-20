import { useState, useCallback } from 'react';
import { Habit, HabitCompletion, WalletState } from '@/types/habit';

// Mock data for development
const createMockHabits = (): Habit[] => [
  {
    id: '1',
    name: 'Morning Workout',
    category: 'fitness',
    difficulty: 'medium',
    baseReward: 2,
    streak: 5,
    completedToday: false,
    createdAt: new Date('2024-01-01'),
    description: '30 minutes of cardio and strength training',
  },
  {
    id: '2',
    name: 'Read Technical Books',
    category: 'learning',
    difficulty: 'hard',
    baseReward: 4,
    streak: 12,
    completedToday: true,
    lastCompleted: new Date(),
    createdAt: new Date('2024-01-05'),
    description: 'Read for at least 45 minutes daily',
  },
  {
    id: '3',
    name: 'Meditation',
    category: 'wellness',
    difficulty: 'easy',
    baseReward: 1,
    streak: 8,
    completedToday: false,
    createdAt: new Date('2024-01-10'),
    description: '15 minutes of mindfulness meditation',
  },
];

const createMockCompletions = (): HabitCompletion[] => [
  {
    id: '1',
    habitId: '2',
    completedAt: new Date(),
    streakCount: 12,
    rewardEarned: 4.8,
    multiplier: 1.2,
  },
  {
    id: '2',
    habitId: '1',
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    streakCount: 4,
    rewardEarned: 2.4,
    multiplier: 1.2,
  },
  {
    id: '3',
    habitId: '3',
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    streakCount: 7,
    rewardEarned: 1.15,
    multiplier: 1.15,
  },
];

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(createMockHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(createMockCompletions);
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    xlprBalance: 0,
    xrpBalance: 0,
    btcBalance: 0,
    ethBalance: 0,
  });

  const connectWallet = useCallback(() => {
    setWalletState({
      connected: true,
      address: '0x742d35Cc4c2B2B5D4Fd2F1E2C02E7B3f8F8F8F8F',
      xlprBalance: 127.5,
      xrpBalance: 1250.0,
      btcBalance: 0.0234,
      ethBalance: 2.4567,
    });
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      connected: false,
      xlprBalance: 0,
      xrpBalance: 0,
      btcBalance: 0,
      ethBalance: 0,
    });
  }, []);

  const addHabit = useCallback((habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name || '',
      category: habitData.category || 'fitness',
      difficulty: habitData.difficulty || 'medium',
      baseReward: habitData.baseReward || 2,
      streak: 0,
      completedToday: false,
      createdAt: new Date(),
      description: habitData.description,
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, ...updates } : habit
    ));
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    setCompletions(prev => prev.filter(completion => completion.habitId !== habitId));
  }, []);

  const completeHabit = useCallback(async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completedToday) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const multiplier = 1 + Math.random() * 0.5; // Random multiplier between 1.0 and 1.5
    const newStreak = habit.streak + 1;
    const rewardEarned = habit.baseReward * multiplier;

    // Update habit
    setHabits(prev => prev.map(h => 
      h.id === habitId 
        ? { 
            ...h, 
            completedToday: true, 
            streak: newStreak,
            lastCompleted: new Date(),
          }
        : h
    ));

    // Add completion record
    const newCompletion: HabitCompletion = {
      id: Date.now().toString(),
      habitId,
      completedAt: new Date(),
      streakCount: newStreak,
      rewardEarned,
      multiplier,
    };

    setCompletions(prev => [newCompletion, ...prev]);
  }, [habits]);

  const claimReward = useCallback(async () => {
    if (!walletState.connected) return;

    // Calculate total available rewards
    const availableReward = habits
      .filter(habit => habit.completedToday)
      .reduce((sum, habit) => sum + habit.baseReward, 0);

    if (availableReward <= 0) return;

    // Simulate claiming rewards and updating wallet balance
    await new Promise(resolve => setTimeout(resolve, 1500));

    const multiplier = 1.23; // Mock FTSO multiplier
    const totalReward = availableReward * multiplier;

    setWalletState(prev => ({
      ...prev,
      xlprBalance: prev.xlprBalance + totalReward,
    }));

    // Reset completed today status
    setHabits(prev => prev.map(habit => ({
      ...habit,
      completedToday: false,
    })));
  }, [habits, walletState.connected]);

  const resetDailyProgress = useCallback(() => {
    // This would typically be called by a scheduled job at midnight
    setHabits(prev => prev.map(habit => ({
      ...habit,
      completedToday: false,
    })));
  }, []);

  return {
    habits,
    completions,
    walletState,
    connectWallet,
    disconnectWallet,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    claimReward,
    resetDailyProgress,
  };
};