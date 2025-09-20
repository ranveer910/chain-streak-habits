import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Star, Trophy, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
}

const HabitCard = ({ habit, onComplete, onEdit }: HabitCardProps) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (habit.completedToday) return;
    
    setIsCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    onComplete(habit.id);
    setIsCompleting(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'hard': return 'bg-destructive';
      case 'expert': return 'bg-gradient-streak';
      default: return 'bg-muted';
    }
  };

  const getCategoryIcon = (category: string) => {
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

  const getStreakLevel = (streak: number) => {
    if (streak >= 50) return { level: 'Legendary', color: 'text-token-gold' };
    if (streak >= 30) return { level: 'Master', color: 'text-purple-400' };
    if (streak >= 21) return { level: 'Expert', color: 'text-accent' };
    if (streak >= 14) return { level: 'Advanced', color: 'text-primary' };
    if (streak >= 7) return { level: 'Intermediate', color: 'text-warning' };
    return { level: 'Beginner', color: 'text-muted-foreground' };
  };

  const streakLevel = getStreakLevel(habit.streak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 bg-gradient-card border-border hover:shadow-card transition-all duration-300">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getCategoryIcon(habit.category)}</span>
              <div>
                <h3 className="font-semibold text-card-foreground">{habit.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {habit.category} • {habit.difficulty}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(habit)}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Streak and Reward Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-streak-fire" />
              <span className="font-bold text-lg">{habit.streak}</span>
              <span className={`text-sm ${streakLevel.color} font-medium`}>
                {streakLevel.level}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-token-gold" />
              <span className="text-token-gold font-semibold">
                {habit.baseReward} HABIT
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to next milestone</span>
              <span className="text-muted-foreground">
                {habit.streak % 7}/7
              </span>
            </div>
            <Progress 
              value={(habit.streak % 7) * (100/7)} 
              className="h-2 bg-muted"
            />
          </div>

          {/* Difficulty Badge */}
          <Badge 
            className={`${getDifficultyColor(habit.difficulty)} text-white border-0 capitalize`}
          >
            <Trophy className="h-3 w-3 mr-1" />
            {habit.difficulty}
          </Badge>

          {/* Completion Button */}
          <AnimatePresence mode="wait">
            {habit.completedToday ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center p-3 bg-success/10 border border-success/20 rounded-lg"
              >
                <div className="flex items-center gap-2 text-success">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    ✓
                  </motion.div>
                  <span className="font-medium">Completed today!</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="incomplete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  {isCompleting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    <>Mark Complete</>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default HabitCard;