
'use client';

import Link from 'next/link';
import { Heart, Clock, Flame, BarChart, Leaf, Fish, Sprout } from 'lucide-react';
import type { RecipeSummary } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useFavorites } from '@/hooks/use-favorites';

interface RecipeCardProps {
  recipe: RecipeSummary;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.includes(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe.id);
    }
  };

  if (!recipe) {
    return null;
  }
  
  const spiceLevelColors: Record<NonNullable<RecipeSummary['spiceLevel']>, string> = {
    None: 'text-muted-foreground',
    Mild: 'text-yellow-500',
    Medium: 'text-orange-500',
    Spicy: 'text-red-500',
  };
  
  const dietaryClassificationIcons: Record<NonNullable<RecipeSummary['dietaryClassification']>, React.ReactNode> = {
    'Vegan': <Leaf className="w-4 h-4 text-green-500" />,
    'Veg': <Sprout className="w-4 h-4 text-green-500" />,
    'Non-Veg': <Fish className="w-4 h-4 text-red-500" />,
  }

  return (
    <Link href={`/recipe/${recipe.id}`} className="block">
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl group h-full">
      <CardHeader className="p-0">
         <div className="relative h-48 w-full">
            <Image 
              src={recipe.image || 'https://placehold.co/600x400.png'}
              alt={recipe.title || 'Recipe image'}
              fill
              className="object-cover"
            />
             <div className="absolute top-2 right-2">
                <Button size="icon" variant="secondary" className="relative bg-white/80 backdrop-blur-sm rounded-full h-9 w-9 hover:bg-white z-10" onClick={handleFavoriteClick}>
                    <Heart className={cn(`h-5 w-5 text-gray-500`, isFavorite && 'fill-red-500 text-red-500')} />
                </Button>
            </div>
         </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
          <CardTitle className="font-headline text-xl h-14 line-clamp-2 group-hover:text-primary transition-colors">{recipe.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {recipe.dishTypes?.slice(0, 2).map((type) => (
               <Badge key={type} variant="secondary" className="font-normal capitalize">{type}</Badge>
            ))}
          </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-muted/50 mt-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>{recipe.readyInMinutes} min</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
           <BarChart className="h-4 w-4 text-primary" />
           <span>{recipe.difficulty}</span>
        </div>
        {recipe.dietaryClassification && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {dietaryClassificationIcons[recipe.dietaryClassification]}
                <span>{recipe.dietaryClassification}</span>
            </div>
        )}
        {recipe.spiceLevel && recipe.spiceLevel !== 'None' && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className={cn("h-4 w-4", spiceLevelColors[recipe.spiceLevel])} />
            <span>{recipe.spiceLevel}</span>
        </div>
        )}
      </CardFooter>
    </Card>
    </Link>
  );
}
