import { getRecipeOfTheDay } from '@/lib/spoonacular';
import { RecipeOfTheDayCard } from './recipe-of-the-day-card';

// This component is now deprecated as we are fetching data directly in the page
// and passing it to the card. This component can be removed in the future.
export async function RecipeOfTheDay() {
  const recipe = await getRecipeOfTheDay();

  if (!recipe) return null;

  return <RecipeOfTheDayCard recipe={recipe} />;
}