
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/header';
import { RecipeCard } from '@/components/recipe-card';
import { getRecipeDetails } from '@/lib/spoonacular';
import type { RecipeSummary } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';

function FavoritesPageComponent() {
  const { favorites: favoriteIds } = useFavorites();
  const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setLoading(false);
      setFavoriteRecipes([]);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchFavorites = async () => {
      try {
        const recipePromises = favoriteIds.map(id => getRecipeDetails(String(id)));
        const results = await Promise.all(recipePromises);
        const validRecipes = results.filter((r): r is RecipeSummary => r !== null);
        setFavoriteRecipes(validRecipes);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your favorite recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds]);

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex items-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-foreground">
                Your Favorite Recipes
            </h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Recipes you've saved for later.
        </p>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: favoriteIds.length || 3 }).map((_, i) => (
               <div key={i} className="flex flex-col space-y-3">
                 <Skeleton className="h-48 w-full rounded-xl" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-5/6" />
                   <Skeleton className="h-4 w-3/4" />
                 </div>
               </div>
            ))}
          </div>
        )}
        
        {error && <p className="text-destructive text-center">{error}</p>}

        {!loading && !error && favoriteRecipes.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Favorites Yet!</h2>
            <p className="text-muted-foreground mt-2">
              Click the heart icon on any recipe to save it here.
            </p>
          </div>
        )}

        {!loading && !error && favoriteRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe, index) => (
              <RecipeCard key={`${recipe.id}-${index}`} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


export default function FavoritesPage() {
    return (
        <Suspense key="favorites-page-suspense" fallback={<div>Loading favorites...</div>}>
            <FavoritesPageComponent />
        </Suspense>
    )
}
