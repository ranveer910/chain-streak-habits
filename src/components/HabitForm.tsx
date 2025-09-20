import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Habit, HabitCategory, HabitDifficulty } from '@/types/habit';

interface HabitFormProps {
  habit?: Habit;
  onSave: (habit: Partial<Habit>) => void;
  onCancel: () => void;
}

const HabitForm = ({ habit, onSave, onCancel }: HabitFormProps) => {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    category: habit?.category || 'fitness' as HabitCategory,
    difficulty: habit?.difficulty || 'medium' as HabitDifficulty,
    description: habit?.description || '',
  });

  const getBaseReward = (difficulty: HabitDifficulty): number => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 4;
      case 'expert': return 8;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      baseReward: getBaseReward(formData.difficulty),
    });
  };

  const categories: { value: HabitCategory; label: string; emoji: string }[] = [
    { value: 'fitness', label: 'Fitness', emoji: '💪' },
    { value: 'learning', label: 'Learning', emoji: '📚' },
    { value: 'wellness', label: 'Wellness', emoji: '🧘' },
    { value: 'productivity', label: 'Productivity', emoji: '⚡' },
    { value: 'social', label: 'Social', emoji: '👥' },
    { value: 'creativity', label: 'Creativity', emoji: '🎨' },
  ];

  const difficulties: { value: HabitDifficulty; label: string; reward: number }[] = [
    { value: 'easy', label: 'Easy', reward: 1 },
    { value: 'medium', label: 'Medium', reward: 2 },
    { value: 'hard', label: 'Hard', reward: 4 },
    { value: 'expert', label: 'Expert', reward: 8 },
  ];

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {habit ? 'Edit Habit' : 'Create New Habit'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Habit Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Morning workout, Read for 30 minutes"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: HabitCategory) => 
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <span className="flex items-center gap-2">
                    <span>{category.emoji}</span>
                    <span>{category.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label>Difficulty & Reward</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value: HabitDifficulty) => 
              setFormData({ ...formData, difficulty: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty.value} value={difficulty.value}>
                  <span className="flex items-center justify-between w-full">
                    <span className="capitalize">{difficulty.label}</span>
                    <span className="text-token-gold font-semibold ml-4">
                      {difficulty.reward} HABIT
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Higher difficulty habits earn more HABIT tokens per completion
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add any notes or details about this habit..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {habit ? 'Update Habit' : 'Create Habit'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HabitForm;