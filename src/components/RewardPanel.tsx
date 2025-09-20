import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Coins, TrendingUp, Gift, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface RewardPanelProps {
  availableReward: number;
  multiplier: number;
  totalStreaks: number;
  onClaimReward: () => void;
}

const RewardPanel = ({ availableReward, multiplier, totalStreaks, onClaimReward }: RewardPanelProps) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast();

  const totalReward = availableReward * multiplier;

  const handleClaim = async () => {
    if (availableReward <= 0) return;
    
    setIsClaiming(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onClaimReward();
      
      toast({
        title: "Rewards Claimed! 🎉",
        description: `You earned ${totalReward.toFixed(2)} HABIT tokens`,
      });
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsClaiming(false);
    }
  };

  // Mock FTSO price data
  const ftsoData = {
    btc: { price: 45230, change: 2.3 },
    eth: { price: 2890, change: -1.2 },
    flr: { price: 0.045, change: 5.7 }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Rewards Center</h2>
          <p className="text-muted-foreground">
            Claim your HABIT tokens with FTSO multipliers
          </p>
        </div>

        {/* FTSO Price Feeds */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            FTSO Price Feeds
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(ftsoData).map(([symbol, data]) => (
              <div key={symbol} className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase">{symbol}</p>
                <p className="font-bold">${data.price.toLocaleString()}</p>
                <p className={`text-xs ${data.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {data.change >= 0 ? '+' : ''}{data.change.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Reward Calculation */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Base Reward</span>
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-token-gold" />
              <span className="font-semibold">{availableReward.toFixed(1)} HABIT</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">FTSO Multiplier</span>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-accent" />
              <span className="font-semibold text-accent">{multiplier.toFixed(2)}x</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg">
            <span className="font-bold">Total Reward</span>
            <div className="flex items-center gap-1">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="h-5 w-5 text-token-gold" />
              </motion.div>
              <span className="font-bold text-token-gold">
                {totalReward.toFixed(2)} HABIT
              </span>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        <Button
          onClick={handleClaim}
          disabled={availableReward <= 0 || isClaiming}
          className="w-full bg-gradient-reward hover:shadow-token transition-all duration-300 text-black font-bold"
          size="lg"
        >
          {isClaiming ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            />
          ) : availableReward <= 0 ? (
            'No Rewards Available'
          ) : (
            <>
              <Gift className="mr-2 h-5 w-5" />
              Claim Rewards
            </>
          )}
        </Button>

        {/* Stats */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Total Active Streaks: <span className="text-primary font-semibold">{totalStreaks}</span></p>
        </div>
      </div>
    </Card>
  );
};

export default RewardPanel;