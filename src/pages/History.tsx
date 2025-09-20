import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Coins, Flame, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Habit, HabitCompletion } from '@/types/habit';

interface HistoryProps {
  habits: Habit[];
  completions: HabitCompletion[];
}

const History = ({ habits, completions }: HistoryProps) => {
  const sortedCompletions = useMemo(() => {
    return [...completions].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  }, [completions]);

  const stats = useMemo(() => {
    const totalRewards = completions.reduce((sum, completion) => sum + completion.rewardEarned, 0);
    const totalCompletions = completions.length;
    const averageMultiplier = completions.length > 0 
      ? completions.reduce((sum, completion) => sum + completion.multiplier, 0) / completions.length
      : 0;
    
    const last7Days = completions.filter(completion => {
      const completionDate = new Date(completion.completedAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return completionDate >= sevenDaysAgo;
    }).length;

    return {
      totalRewards,
      totalCompletions,
      averageMultiplier,
      last7Days,
    };
  }, [completions]);

  const getHabitName = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    return habit?.name || 'Unknown Habit';
  };

  const getHabitCategory = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    return habit?.category || 'unknown';
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'fitness': return '💪';
      case 'learning': return '📚';
      case 'wellness': return '🧘';
      case 'productivity': return '⚡';
      case 'social': return '👥';
      case 'creativity': return '🎨';
      default: return '⭐';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Habit History</h1>
        <p className="text-muted-foreground">
          Track your progress and rewards over time
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-card text-center">
            <div className="flex justify-center mb-2">
              <Coins className="h-8 w-8 text-token-gold" />
            </div>
            <p className="text-2xl font-bold text-token-gold">
              {stats.totalRewards.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">Total Rewards</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-gradient-card text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <p className="text-2xl font-bold">{stats.totalCompletions}</p>
            <p className="text-sm text-muted-foreground">Completions</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-card text-center">
            <div className="flex justify-center mb-2">
              <Flame className="h-8 w-8 text-accent" />
            </div>
            <p className="text-2xl font-bold text-accent">
              {stats.averageMultiplier.toFixed(2)}x
            </p>
            <p className="text-sm text-muted-foreground">Avg Multiplier</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-gradient-card text-center">
            <div className="flex justify-center mb-2">
              <Calendar className="h-8 w-8 text-success" />
            </div>
            <p className="text-2xl font-bold text-success">{stats.last7Days}</p>
            <p className="text-sm text-muted-foreground">Last 7 Days</p>
          </Card>
        </motion.div>
      </div>

      {/* History Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        
        {sortedCompletions.length === 0 ? (
          <Card className="p-8 text-center bg-gradient-card">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No history yet</h3>
            <p className="text-muted-foreground">
              Complete some habits to see your progress here!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedCompletions.map((completion, index) => (
              <motion.div
                key={completion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-lg">
                          {getCategoryEmoji(getHabitCategory(completion.habitId))}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">
                          {getHabitName(completion.habitId)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(completion.completedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-streak-fire" />
                          <span className="font-semibold">{completion.streakCount}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">streak</p>
                      </div>

                      <Separator orientation="vertical" className="h-8" />

                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {completion.multiplier.toFixed(2)}x
                          </span>
                          <Badge className="bg-gradient-reward text-black font-semibold">
                            {completion.rewardEarned.toFixed(2)} HABIT
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">reward earned</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;