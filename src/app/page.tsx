
import ClientHomePage from './client-home-page';
import { getPopularRecipes, getRecipeOfTheDay } from '@/lib/spoonacular';

// This is the new default export - an async Server Component.
// It fetches data and passes it to the Client Component.
export default async function Page() {
  const popularRecipes = await getPopularRecipes();
  const recipeOfTheDay = await getRecipeOfTheDay();
  
  return <ClientHomePage popularRecipes={popularRecipes} recipeOfTheDay={recipeOfTheDay} />;
}
