import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import HabitCard from '@/components/HabitCard';
import RewardPanel from '@/components/RewardPanel';
import WalletConnect from '@/components/WalletConnect';
import { Habit, HabitCategory, WalletState } from '@/types/habit';
import { Target, TrendingUp, Flame, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  habits: Habit[];
  walletState: WalletState;
  onCompleteHabit: (habitId: string) => void;
  onEditHabit: (habit: Habit) => void;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onClaimReward: () => void;
}

const Dashboard = ({
  habits,
  walletState,
  onCompleteHabit,
  onEditHabit,
  onConnectWallet,
  onDisconnectWallet,
  onClaimReward,
}: DashboardProps) => {
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');

  const categories: { value: HabitCategory | 'all'; label: string; emoji: string }[] = [
    { value: 'all', label: 'All', emoji: '🎯' },
    { value: 'fitness', label: 'Fitness', emoji: '💪' },
    { value: 'learning', label: 'Learning', emoji: '📚' },
    { value: 'wellness', label: 'Wellness', emoji: '🧘' },
    { value: 'productivity', label: 'Productivity', emoji: '⚡' },
    { value: 'social', label: 'Social', emoji: '👥' },
    { value: 'creativity', label: 'Creativity', emoji: '🎨' },
  ];

  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'all') return habits;
    return habits.filter(habit => habit.category === selectedCategory);
  }, [habits, selectedCategory]);

  const stats = useMemo(() => {
    const totalStreaks = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const completedToday = habits.filter(habit => habit.completedToday).length;
    const availableReward = habits
      .filter(habit => habit.completedToday)
      .reduce((sum, habit) => sum + habit.baseReward, 0);
    const activeStreaks = habits.filter(habit => habit.streak > 0).length;

    return {
      totalStreaks,
      completedToday,
      availableReward,
      activeStreaks,
      totalHabits: habits.length,
    };
  }, [habits]);

  const ftsoMultiplier = 1.23; // Mock multiplier from FTSO feeds

  return (
    <div className="space-y-4 pb-16 md:pb-4">
      {/* Wallet Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WalletConnect
            walletState={walletState}
            onConnect={onConnectWallet}
            onDisconnect={onDisconnectWallet}
          />
        </div>
        <div className="space-y-4">
          <RewardPanel
            availableReward={stats.availableReward}
            multiplier={ftsoMultiplier}
            totalStreaks={stats.activeStreaks}
            onClaimReward={onClaimReward}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-card text-center">
            <div className="flex justify-center mb-2">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <p className="text-2xl font-bold">{stats.totalHabits}</p>
            <p className="text-sm text-muted-foreground">Total Habits</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-gradient-card text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <p className="text-2xl font-bold text-success">{stats.completedToday}</p>
            <p className="text-sm text-muted-foreground">Completed Today</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-card text-center">
            <div className="flex justify-center mb-2">
              <Flame className="h-8 w-8 text-streak-fire" />
            </div>
            <p className="text-2xl font-bold text-streak-fire">{stats.activeStreaks}</p>
            <p className="text-sm text-muted-foreground">Active Streaks</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-gradient-card text-center">
            <div className="flex justify-center mb-2">
              <Star className="h-8 w-8 text-token-gold" />
            </div>
            <p className="text-2xl font-bold text-token-gold">{stats.totalStreaks}</p>
            <p className="text-sm text-muted-foreground">Total Streaks</p>
          </Card>
        </motion.div>
      </div>

      {/* Habits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Habits</h2>
          <Badge variant="secondary" className="text-xs">
            {filteredHabits.length} habits
          </Badge>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center gap-2 whitespace-nowrap ${
                selectedCategory === category.value
                  ? 'bg-gradient-primary shadow-glow'
                  : 'hover:bg-muted/50'
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </Button>
          ))}
        </div>

        {/* Habits Grid */}
        {filteredHabits.length === 0 ? (
          <Card className="p-8 text-center bg-gradient-card">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory === 'all' 
                ? "Start your journey by creating your first habit!"
                : `No ${selectedCategory} habits found. Try a different category or create a new habit.`
              }
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HabitCard
                  habit={habit}
                  onComplete={onCompleteHabit}
                  onEdit={onEditHabit}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;