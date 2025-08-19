
// src/lib/spoonacular.ts
import type { Recipe, RecipeSummary, RecipeWithDetails, IngredientSubstitution } from './types';

const SPOONACULAR_API_URL = 'https://api.spoonacular.com';

const getApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
  if (!apiKey) {
    throw new Error('Spoonacular API key is not configured. Please set NEXT_PUBLIC_SPOONACULAR_API_KEY in your .env.local file.');
  }
  return apiKey;
};


// Simple in-memory cache to avoid re-fetching the same data within a short period.
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

async function fetchWithCache<T>(url: string, tags: string[] = []): Promise<T> {
  const cacheKey = url;
  const cached = cache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
    return cached.data as T;
  }
  
  // Use Next.js's built-in fetch caching, revalidating once per day.
  const response = await fetch(url, { next: { revalidate: 86400, tags } });
  
  if (response.status === 402) { // Payment Required
    console.error("Spoonacular API limit reached. Please check your plan.");
    throw new Error("The daily recipe search limit has been reached. Please try again tomorrow!");
  }
  
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Failed to fetch from Spoonacular: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

const SPICY_INGREDIENTS = [
    'chili', 'chile', 'jalapeño', 'habanero', 'cayenne', 'paprika', 'sriracha', 'gochujang',
    'wasabi', 'horseradish', 'pepperoncini', 'tabasco', 'ghost pepper'
];

const getSpiceLevel = (ingredients: { name: string }[]): RecipeSummary['spiceLevel'] => {
    if (!ingredients) return 'None';
    const spicyMentions = ingredients.reduce((acc, ing) => {
        const name = ing.name.toLowerCase();
        if (SPICY_INGREDIENTS.some(spicy => name.includes(spicy))) {
            return acc + 1;
        }
        return acc;
    }, 0);

    if (spicyMentions >= 3) return 'Spicy';
    if (spicyMentions >= 1) return 'Medium';
    if (spicyMentions > 0) return 'Mild';
    return 'None';
}

const getDietaryClassification = (recipe: any): RecipeSummary['dietaryClassification'] => {
    if (recipe.vegan) {
        return 'Vegan';
    }
    if (recipe.vegetarian) {
        return 'Veg';
    }
    // Check for egg if not vegetarian
    const hasEgg = recipe.extendedIngredients?.some((ing: any) => ing.name.toLowerCase().includes('egg'));
    if (hasEgg) {
        return 'Non-Veg';
    }

    return 'Non-Veg';
};


const transformToRecipeSummary = (recipe: any): RecipeSummary => ({
  id: recipe.id,
  title: recipe.title || 'Untitled Recipe',
  image: recipe.image || 'https://placehold.co/600x400.png',
  readyInMinutes: recipe.readyInMinutes,
  servings: recipe.servings,
  dishTypes: recipe.dishTypes || [],
  difficulty: recipe.veryHealthy ? 'Easy' : (recipe.cheap ? 'Medium' : 'Hard'), // Example logic
  spiceLevel: getSpiceLevel(recipe.extendedIngredients),
  dietaryClassification: getDietaryClassification(recipe),
  spoonacularScore: recipe.spoonacularScore,
});


const transformToRecipeWithDetails = (recipe: any): RecipeWithDetails => {
    const ingredients = recipe.extendedIngredients?.map((ing: any) => ({
        name: ing.name,
        measure: `${ing.amount} ${ing.unit}`,
        image: `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`
    })) || [];
    
    const instructions = recipe.analyzedInstructions?.[0]?.steps.map((step: any) => step.step) || [];

    return {
        ...transformToRecipeSummary(recipe),
        instructions,
        tags: recipe.dishTypes || [],
        sourceUrl: recipe.sourceUrl,
        ingredients,
        equipment: Array.from(new Set(recipe.analyzedInstructions?.[0]?.steps.flatMap((s:any) => s.equipment.map((e:any) => e.name)) || [])),
        nutrition: {
            calories: recipe.nutrition?.nutrients.find((n:any) => n.name === 'Calories')?.amount,
            fat: recipe.nutrition?.nutrients.find((n:any) => n.name === 'Fat')?.amount,
            protein: recipe.nutrition?.nutrients.find((n:any) => n.name === 'Protein')?.amount,
            carbs: recipe.nutrition?.nutrients.find((n:any) => n.name === 'Carbohydrates')?.amount,
        },
        variations: {
            preparation: [],
            regional: [],
        },
    }
}


export async function getPopularRecipes(): Promise<RecipeSummary[]> {
   const apiKey = getApiKey();
   // Switched from /random to a cacheable /complexSearch endpoint
   const url = `${SPOONACULAR_API_URL}/recipes/complexSearch?sort=popularity&number=10&addRecipeInformation=true&apiKey=${apiKey}`;
   try {
     const result = await fetchWithCache<{ results: any[] }>(url, ['popular-recipes']);
     return result.results.map(transformToRecipeSummary);
   } catch (error) {
     if (error instanceof Error && error.message.includes('API limit reached')) {
        console.warn("Could not fetch popular recipes due to API limit.");
        return [];
     }
     console.error("Failed to fetch popular recipes:", error);
     return [];
   }
}

export async function getRecipeOfTheDay(): Promise<RecipeWithDetails | null> {
    const apiKey = getApiKey();
    // Switched from /random to a cacheable /complexSearch endpoint
    const url = `${SPOONACULAR_API_URL}/recipes/complexSearch?sort=healthiness&number=1&addRecipeInformation=true&apiKey=${apiKey}`;
    try {
        const result = await fetchWithCache<{ results: any[] }>(url, ['recipe-of-the-day']);
        if (result.results && result.results.length > 0) {
            // A second call is needed to get full details, which will also be cached.
            return getRecipeDetails(String(result.results[0].id));
        }
        return null;
    } catch (error) {
        if (error instanceof Error && error.message.includes('API limit reached')) {
            console.warn("Could not fetch Recipe of the Day due to API limit.");
            return null;
        }
        console.error("Failed to fetch Recipe of the Day:", error);
        return null;
    }
}

export async function getRecipeDetails(id: string): Promise<RecipeWithDetails | null> {
  const apiKey = getApiKey();
  const url = `${SPOONACULAR_API_URL}/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`;
  try {
    const result = await fetchWithCache<any>(url, [`recipe-${id}`]);
    return transformToRecipeWithDetails(result);
  } catch(error) {
    if (error instanceof Error && error.message.includes('API limit reached')) {
        console.warn(`Could not fetch recipe ${id} due to API limit.`);
        return null;
    }
    console.error(`Failed to fetch details for recipe ${id}:`, error);
    return null;
  }
}

export async function searchRecipes(params: URLSearchParams): Promise<RecipeSummary[]> {
    const apiKey = getApiKey();
    const localParams = new URLSearchParams(params); // Create a copy to modify
    localParams.set('apiKey', apiKey);
    localParams.set('number', '10');
    localParams.set('addRecipeInformation', 'true');

    const query = localParams.get('query');
    if (query) {
        localParams.set('titleMatch', query);
        localParams.delete('query');
    }

    // If we have ingredients, we use findByIngredients endpoint, otherwise complexSearch
    let endpoint = 'complexSearch';
    if (localParams.has('includeIngredients') && !query) {
        endpoint = 'findByIngredients';
        localParams.set('ingredients', localParams.get('includeIngredients')!);
        localParams.delete('includeIngredients');
    }


    const url = `${SPOONACULAR_API_URL}/recipes/${endpoint}?${localParams.toString()}`;
    
    try {
        const results = await fetchWithCache<any>(url, [`search-${localParams.toString()}`]);
        const recipes = endpoint === 'complexSearch' ? results.results : results;
        
        // findByIngredients doesn't return full details, so we use the bulk endpoint
        if (endpoint === 'findByIngredients' && recipes.length > 0) {
            const recipeIds = recipes.map((r: any) => r.id).join(',');
            if (!recipeIds) return [];
            
            const bulkUrl = `${SPOONACULAR_API_URL}/recipes/informationBulk?ids=${recipeIds}&includeNutrition=true&apiKey=${apiKey}`;
            const detailedRecipes = await fetchWithCache<any[]>(bulkUrl, [`bulk-${recipeIds}`]);
            
            return detailedRecipes.map(transformToRecipeSummary);
        }

        return recipes.map(transformToRecipeSummary);
    } catch(error) {
        if (error instanceof Error && error.message.includes('API limit reached')) {
          console.error("Failed to search recipes:", error);
          throw error;
        }
        return [];
    }
}


export async function searchRecipesByIngredients(ingredients: string): Promise<RecipeSummary[]> {
    const params = new URLSearchParams();
    params.set('includeIngredients', ingredients);
    return searchRecipes(params);
}

export async function getIngredientSubstitutions(ingredientName: string): Promise<IngredientSubstitution> {
    const apiKey = getApiKey();
    const url = `${SPOONACULAR_API_URL}/food/ingredients/substitutes?ingredientName=${ingredientName}&apiKey=${apiKey}`;
    try {
        return await fetchWithCache<IngredientSubstitution>(url, [`substitutes-${ingredientName}`]);
    } catch(error) {
        console.error(`Failed to fetch substitutions for ${ingredientName}:`, error);
        throw error;
    }
}