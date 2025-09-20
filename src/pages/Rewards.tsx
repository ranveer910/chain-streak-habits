import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import RewardPanel from '@/components/RewardPanel';
import WalletConnect from '@/components/WalletConnect';
import { Habit, WalletState } from '@/types/habit';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Gift, 
  TrendingUp,
  Award,
  Coins
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RewardsProps {
  habits: Habit[];
  walletState: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onClaimReward: () => void;
}

const Rewards = ({
  habits,
  walletState,
  onConnectWallet,
  onDisconnectWallet,
  onClaimReward,
}: RewardsProps) => {
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
  const nextMilestone = Math.ceil(stats.totalStreaks / 100) * 100;
  const milestoneProgress = (stats.totalStreaks % 100);

  const rewardHistory = [
    { date: '2024-01-20', amount: 15.5, streaks: 12, multiplier: 1.29 },
    { date: '2024-01-19', amount: 22.3, streaks: 18, multiplier: 1.24 },
    { date: '2024-01-18', amount: 18.7, streaks: 15, multiplier: 1.25 },
    { date: '2024-01-17', amount: 28.9, streaks: 21, multiplier: 1.38 },
    { date: '2024-01-16', amount: 12.4, streaks: 10, multiplier: 1.24 },
  ];

  return (
    <div className="space-y-4 pb-16 md:pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-reward rounded-xl flex items-center justify-center">
          <Gift className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Rewards Center</h1>
          <p className="text-muted-foreground">Track your earnings and claim rewards</p>
        </div>
      </div>

      {/* Wallet & Claim Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WalletConnect
          walletState={walletState}
          onConnect={onConnectWallet}
          onDisconnect={onDisconnectWallet}
        />
        <RewardPanel
          availableReward={stats.availableReward}
          multiplier={ftsoMultiplier}
          totalStreaks={stats.activeStreaks}
          onClaimReward={onClaimReward}
        />
      </div>

      {/* Reward Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-3 bg-gradient-card text-center">
            <Coins className="h-6 w-6 text-token-gold mx-auto mb-2" />
            <p className="text-lg font-bold text-token-gold">{stats.availableReward}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-3 bg-gradient-card text-center">
            <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-lg font-bold text-accent">{ftsoMultiplier}x</p>
            <p className="text-xs text-muted-foreground">Multiplier</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-3 bg-gradient-card text-center">
            <Flame className="h-6 w-6 text-streak-fire mx-auto mb-2" />
            <p className="text-lg font-bold text-streak-fire">{stats.totalStreaks}</p>
            <p className="text-xs text-muted-foreground">Total Streaks</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-3 bg-gradient-card text-center">
            <Award className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-primary">{rewardHistory.length}</p>
            <p className="text-xs text-muted-foreground">Claims</p>
          </Card>
        </motion.div>
      </div>

      {/* Milestone Progress */}
      <Card className="p-4 bg-gradient-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-token-gold" />
            <h3 className="font-semibold">Next Milestone</h3>
          </div>
          <Badge variant="secondary" className="bg-gradient-reward">
            {nextMilestone} Streaks
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{stats.totalStreaks}/{nextMilestone}</span>
          </div>
          <Progress value={milestoneProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {nextMilestone - stats.totalStreaks} more streaks for bonus FAsset rewards!
          </p>
        </div>
      </Card>

      {/* Recent Rewards */}
      <Card className="p-4 bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-token-gold" />
            Recent Rewards
          </h3>
          <Badge variant="outline">{rewardHistory.length} claims</Badge>
        </div>
        
        <div className="space-y-3">
          {rewardHistory.map((reward, index) => (
            <motion.div
              key={reward.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Coins className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">{reward.amount} HABIT</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(reward.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-accent">{reward.multiplier}x</p>
                <p className="text-xs text-muted-foreground">{reward.streaks} streaks</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* FTSO Price Feeds */}
      <Card className="p-4 bg-gradient-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          FTSO Price Feeds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">BTC/USD</span>
              <Badge variant="secondary" className="text-xs">+2.3%</Badge>
            </div>
            <p className="text-lg font-bold text-success">$43,250</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">ETH/USD</span>
              <Badge variant="secondary" className="text-xs">+1.8%</Badge>
            </div>
            <p className="text-lg font-bold text-success">$2,640</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Multiplier</span>
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
            <p className="text-lg font-bold text-accent">{ftsoMultiplier}x</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Rewards;