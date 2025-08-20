
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchRecipes } from '@/lib/spoonacular';
import type { RecipeSummary, MealType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import Image from 'next/image';

interface AddMealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (recipe: RecipeSummary) => void;
  mealType: MealType;
}

export function AddMealDialog({ isOpen, onClose, onAddMeal, mealType }: AddMealDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const handler = setTimeout(() => {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ query: searchTerm, type: mealType.toLowerCase() });
        searchRecipes(params)
          .then(setRecipes)
          .catch(() => setError('Failed to fetch recipes.'))
          .finally(() => setLoading(false));
      }, 500);
      return () => clearTimeout(handler);
    } else {
        setRecipes([]);
    }
  }, [searchTerm, mealType]);
  
  const handleAdd = (recipe: RecipeSummary) => {
    onAddMeal(recipe);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Meal to {mealType}</DialogTitle>
          <DialogDescription>Search for a recipe to add to your meal plan.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Search for a recipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ScrollArea className="h-72">
            <div className="pr-4 space-y-2">
                {loading && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                {error && <p className="text-destructive">{error}</p>}
                {!loading && recipes.length === 0 && searchTerm.length > 2 && <p className="text-muted-foreground text-center">No recipes found.</p>}
                {recipes.map(recipe => (
                    <div key={recipe.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                        <Image src={recipe.image} alt={recipe.title} width={64} height={64} className="rounded-md object-cover h-16 w-16" />
                        <div className="flex-1">
                            <p className="font-semibold line-clamp-2">{recipe.title}</p>
                        </div>
                         <Button size="icon" variant="outline" onClick={() => handleAdd(recipe)}>
                            <Plus className="h-4 w-4" />
                         </Button>
                    </div>
                ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}