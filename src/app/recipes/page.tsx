

'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useMemo } from 'react';
import { Header } from '@/components/header';
import { RecipeCard } from '@/components/recipe-card';
import { searchRecipes } from '@/lib/spoonacular';
import type { RecipeSummary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function RecipesPageComponent() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchRecipes(queryParams)
      .then(data => {
        // client-side difficulty filter
        const difficulty = queryParams.get('difficulty');
        if (difficulty && difficulty !== 'all') {
            const filteredData = data.filter(r => r.difficulty?.toLowerCase() === difficulty);
            setRecipes(filteredData);
        } else {
            setRecipes(data);
        }
      })
      .catch(err => {
        console.error(err);
        if (err.message.includes('API limit reached')) {
          setError('The daily recipe search limit has been reached. Please try again tomorrow!');
        } else {
          setError('Failed to fetch recipes. The Spoonacular API might be unavailable.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryParams]);

  const getTitle = () => {
    const query = queryParams.get('query');
    const ingredients = queryParams.get('includeIngredients');
    const cuisine = queryParams.get('cuisine');
    const diet = queryParams.get('diet');
    const type = queryParams.get('type');
    
    if (query) return `Results for: "${query}"`;
    if (ingredients) {
      let title = `Recipes with: ${ingredients.split(',').join(', ')}`;
      const filters = [cuisine, diet, type].filter(Boolean).join(', ');
      if(filters) {
        title += ` (${filters})`
      }
      return title;
    }
    if (cuisine) return `${cuisine} Recipes`;
    if (diet) return `${diet} Recipes`;
    if (type) return `${type.charAt(0).toUpperCase() + type.slice(1)} Recipes`;

    return 'Search Results';
  }

  const getDescription = () => {
    let description = "Showing results for your search.";
    const parts = [];
    if(queryParams.get('cuisine')) parts.push(queryParams.get('cuisine'));
    if(queryParams.get('diet')) parts.push(queryParams.get('diet'));
    if(queryParams.get('type')) parts.push(queryParams.get('type'));

    if (parts.length > 0) {
        description = `Showing ${parts.join(', ')} recipes.`;
    }
    const maxReadyTime = queryParams.get('maxReadyTime');
    if (maxReadyTime) {
        description += ` Ready in ${maxReadyTime} minutes or less.`
    }

    return description;
  }

  const NoResultsMessage = () => {
    const query = queryParams.get('query');
    if (query) {
      return (
        <p className="text-muted-foreground text-center">
          No recipes found for &quot;{query}&quot;. Please try a different name.
        </p>
      );
    }
    return (
      <p className="text-muted-foreground text-center">
        No recipes found for these filters. Try a different combination!
      </p>
    );
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
       <main className="flex-1">
        <div className="container mx-auto p-4 md:p-8">
             <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold text-foreground capitalize">
                  {getTitle()}
                </h1>
                <p className="text-muted-foreground">
                  {getDescription()}
                </p>
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
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
            
            {error && <p className="text-destructive text-center font-semibold text-lg p-8 bg-destructive/10 rounded-lg">{error}</p>}

            {!loading && !error && recipes.length === 0 && (
              <NoResultsMessage />
            )}

            {!loading && !error && recipes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                  <RecipeCard key={`${recipe.id}-${index}`} recipe={recipe} />
                ))}
              </div>
            )}
        </div>
      </main>
    </div>
  );
}

export default function RecipesPage() {
    // A unique key is needed for Suspense to work correctly with useSearchParams
    const searchParams = useSearchParams();
    const key = searchParams.toString();

    return (
        <Suspense key={key} fallback={<div>Loading...</div>}>
            <RecipesPageComponent />
        </Suspense>
    )
}