
export interface RecipeSummary {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  dishTypes?: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  spiceLevel?: 'None' | 'Mild' | 'Medium' | 'Spicy';
  dietaryClassification?: 'Vegan' | 'Veg' | 'Non-Veg';
  spoonacularScore?: number;
  nutrition?: { // Make nutrition optional here
    calories?: number;
    fat?: number;
    protein?: number;
    carbs?: number;
  };
}

export interface RecipeWithDetails extends RecipeSummary {
  instructions: string[];
  tags: string[];
  youtubeUrl?: string;
  sourceUrl?: string;
  ingredients: {
    name: string;
    measure: string;
    image?: string;
  }[];
  equipment?: string[];
  nutrition: { // Nutrition is required here
    calories?: number;
    fat?: number;
    protein?: number;
    carbs?: number;
  };
  variations: {
    preparation: string[];
    regional: string[];
  };
}

// A full recipe might have more details than summary
export type Recipe = RecipeSummary | RecipeWithDetails;

export interface IngredientSubstitution {
  ingredient: string;
  substitutes: string[];
  message: string;
}

// Types for Meal Planner
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal {
  id: string;
  type: MealType;
  recipe: RecipeSummary;
}

export interface MealPlan {
  [date: string]: Meal[]; // Key is 'yyyy-MM-dd'
}