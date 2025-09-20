import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { WalletState } from '@/types/habit';

interface WalletConnectProps {
  walletState: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletConnect = ({ walletState, onConnect, onDisconnect }: WalletConnectProps) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate MetaMask connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      onConnect();
      toast({
        title: "Wallet Connected!",
        description: "Your MetaMask wallet is now connected.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please make sure MetaMask is installed and unlocked.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!walletState.connected) {
    return (
      <Card className="p-6 bg-gradient-card border-border">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
            <p className="text-muted-foreground text-sm">
              Connect MetaMask to track habits and earn rewards
            </p>
          </div>
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isConnecting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card border-border">
      <div className="space-y-4">
        {/* Wallet Address */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Wallet Address</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{formatAddress(walletState.address!)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onDisconnect}
            className="text-xs"
          >
            Disconnect
          </Button>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">XLPR Tokens</p>
            <p className="text-lg font-bold text-token-gold">{walletState.xlprBalance.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">ETH Balance</p>
            <p className="text-lg font-bold">{walletState.ethBalance.toFixed(4)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WalletConnect;