
'use client';

import Link from 'next/link';
import { Clock, Users, Flame, UtensilsCrossed, Heart, BarChart, Leaf, Fish, Sprout } from 'lucide-react';
import type { RecipeWithDetails } from '@/lib/types';
import type { RecipeSummary } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';

interface RecipeOfTheDayCardProps {
  recipe: RecipeWithDetails;
}

export function RecipeOfTheDayCard({ recipe }: RecipeOfTheDayCardProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.includes(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe.id);
    }
  };

  if (!recipe) return null;

  const spiceLevelColors: Record<NonNullable<RecipeSummary['spiceLevel']>, string> = {
    None: 'text-muted-foreground',
    Mild: 'text-yellow-500',
    Medium: 'text-orange-500',
    Spicy: 'text-red-500',
  };

  const dietaryClassificationIcons: Record<NonNullable<RecipeSummary['dietaryClassification']>, React.ReactNode> = {
    'Vegan': <Leaf className="w-5 h-5 text-green-500" />,
    'Veg': <Sprout className="w-5 h-5 text-green-500" />,
    'Non-Veg': <Fish className="w-5 h-5 text-red-500" />,
  }

  return (
    <Card className="shadow-lg overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background">
      <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <UtensilsCrossed className="w-5 h-5"/>
                <span>Recipe of the Day</span>
            </div>
            <Button size="icon" variant="ghost" className="relative bg-white/80 backdrop-blur-sm rounded-full h-9 w-9 hover:bg-white z-10" onClick={handleFavoriteClick}>
                <Heart className={cn(`h-5 w-5 text-gray-500`, isFavorite && 'fill-red-500 text-red-500')} />
            </Button>
          </div>
          <CardTitle className="font-headline text-2xl mt-2">{recipe.title}</CardTitle>
          <CardDescription>
            A delicious and easy-to-make dish, perfect for today's meal.
          </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-grow space-y-4">
          <div className="flex flex-wrap gap-2">
              {recipe.dishTypes?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
              ))}
          </div>
           <div className="flex justify-around items-center p-3 border rounded-lg bg-muted/50 mt-4">
              <div className="flex items-center flex-col gap-1 text-xs text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className='font-bold text-foreground'>{recipe.readyInMinutes} min</span>
                  <span>Time</span>
              </div>
              <div className="flex items-center flex-col gap-1 text-xs text-muted-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  <span className='font-bold text-foreground'>{recipe.servings}</span>
                  <span>Servings</span>
              </div>
              <div className="flex items-center flex-col gap-1 text-xs text-muted-foreground">
                   <BarChart className="h-5 w-5 text-primary" />
                   <span className='font-bold text-foreground'>{recipe.difficulty}</span>
                   <span>Difficulty</span>
              </div>
              {recipe.dietaryClassification && (
                <div className="flex items-center flex-col gap-1 text-xs text-muted-foreground">
                    {dietaryClassificationIcons[recipe.dietaryClassification]}
                    <span className='font-bold text-foreground'>{recipe.dietaryClassification}</span>
                    <span>Type</span>
                </div>
              )}
               {recipe.spiceLevel && recipe.spiceLevel !== 'None' && (
               <div className="flex items-center flex-col gap-1 text-xs text-muted-foreground">
                    <Flame className={cn("h-5 w-5", spiceLevelColors[recipe.spiceLevel])} />
                    <span className='font-bold text-foreground'>{recipe.spiceLevel}</span>
                    <span>Spice</span>
                </div>
                )}
          </div>
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-md mt-2" asChild>
              <Link href={`/recipe/${recipe.id}`}>View Recipe</Link>
          </Button>
      </CardContent>
    </Card>
  );
}