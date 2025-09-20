export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  baseReward: number;
  streak: number;
  completedToday: boolean;
  lastCompleted?: Date;
  createdAt: Date;
  description?: string;
}

export type HabitCategory = 
  | 'fitness' 
  | 'learning' 
  | 'wellness' 
  | 'productivity' 
  | 'social' 
  | 'creativity';

export type HabitDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: Date;
  streakCount: number;
  rewardEarned: number;
  multiplier: number;
}

export interface WalletState {
  connected: boolean;
  address?: string;
  xlprBalance: number;
  xrpBalance: number;
  btcBalance: number;
  ethBalance: number;
}

export interface RewardClaim {
  baseReward: number;
  multiplier: number;
  totalReward: number;
  timestamp: Date;
}