import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Target, 
  Gift, 
  History, 
  Plus,
  Menu,
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  onAddHabit: () => void;
}

const Navigation = ({ onAddHabit }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/rewards', icon: Gift, label: 'Rewards' },
    { path: '/history', icon: History, label: 'History' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-6 bg-gradient-card border-b border-border">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Habit Tracker</h1>
              <p className="text-sm text-muted-foreground">Cross-Chain Rewards</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`flex items-center gap-2 ${
                    isActive(item.path) 
                      ? 'bg-gradient-primary shadow-glow' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <Button
          onClick={onAddHabit}
          className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-card border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold">Habit Tracker</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-8 w-8 p-0"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-card border-b border-border"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        isActive(item.path) 
                          ? 'bg-gradient-primary shadow-glow' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
                
                <Button
                  onClick={() => {
                    onAddHabit();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-3 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  Add Habit
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-card border-t border-border p-4 md:hidden">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-col h-auto p-2 gap-1 ${
                    isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            ))}
            <Button
              onClick={onAddHabit}
              size="sm"
              className="flex-col h-auto p-2 gap-1 bg-gradient-primary"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;