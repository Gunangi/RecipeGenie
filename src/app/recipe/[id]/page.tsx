import { Header } from '@/components/header';
import { getRecipeDetails } from '@/lib/spoonacular';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Flame, BarChart, BrainCircuit, ChefHat, ListChecks, Sprout, Leaf, Fish } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { RecipeSummary, RecipeWithDetails } from '@/lib/types';
import { StarRating } from '@/components/star-rating';

const spiceLevelColors = {
  None: 'text-muted-foreground',
  Mild: 'text-yellow-500',
  Medium: 'text-orange-500',
  Spicy: 'text-red-500',
};

const dietaryClassificationIcons = {
  'Vegan': <Leaf className="w-6 h-6 text-green-500" />,
  'Veg': <Sprout className="w-6 h-6 text-green-500" />,
  'Non-Veg': <Fish className="w-6 h-6 text-red-500" />,
};

export default async function RecipePage({ params }: { params: { id: string } }): Promise<JSX.Element> {
  const recipe = await getRecipeDetails(params.id);

  if (!recipe) {
    return (
        <div className="bg-background min-h-screen">
            <Header />
            <main className="container mx-auto p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold">Recipe not found</h1>
            </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:py-8">
        <div className="max-w-5xl mx-auto">
             <Card className="shadow-lg overflow-hidden mb-8">
                 <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6 flex flex-col justify-between">
                         <div>
                            {recipe.dishTypes && recipe.dishTypes.length > 0 && <Badge variant="outline" className="border-primary text-primary w-fit mb-4">{recipe.dishTypes[0]}</Badge>}
                            <CardTitle className="font-headline text-4xl">{recipe.title}</CardTitle>
                            {recipe.spoonacularScore && recipe.spoonacularScore > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                    <StarRating rating={recipe.spoonacularScore} />
                                    <span className="text-muted-foreground text-sm">({(recipe.spoonacularScore / 20).toFixed(1)} / 5)</span>
                                </div>
                            )}
                             <div className="flex flex-wrap gap-2 mt-4">
                                {recipe.tags?.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                         </div>
                         <CardContent className="p-0 pt-4">
                            <div className="flex justify-around items-center p-4 border rounded-lg bg-muted/50 mt-4">
                                <div className="flex items-center flex-col gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-6 w-6 text-primary" />
                                    <span className='font-bold text-foreground text-base'>{recipe.readyInMinutes} min</span>
                                    <span>Ready in</span>
                                </div>
                                <div className="flex items-center flex-col gap-1 text-sm text-muted-foreground">
                                    <Users className="h-6 w-6 text-primary" />
                                    <span className='font-bold text-foreground text-base'>{recipe.servings}</span>
                                    <span>Servings</span>
                                </div>
                                <div className="flex items-center flex-col gap-1 text-sm text-muted-foreground">
                                     <BarChart className="h-6 w-6 text-primary" />
                                     <span className='font-bold text-foreground text-base'>{recipe.difficulty}</span>
                                     <span>Difficulty</span>
                                </div>
                                {recipe.dietaryClassification && (
                                <div className="flex items-center flex-col gap-1 text-sm text-muted-foreground">
                                    {dietaryClassificationIcons[recipe.dietaryClassification]}
                                    <span className='font-bold text-foreground text-base'>{recipe.dietaryClassification}</span>
                                    <span>Type</span>
                                </div>
                                )}
                                {recipe.spiceLevel && recipe.spiceLevel !== 'None' && (
                                <div className="flex items-center flex-col gap-1 text-sm text-muted-foreground">
                                    <Flame className={cn("h-6 w-6", spiceLevelColors[recipe.spiceLevel as keyof typeof spiceLevelColors])} />
                                    <span className='font-bold text-foreground text-base'>{recipe.spiceLevel}</span>
                                    <span>Spice Level</span>
                                </div>
                                )}
                            </div>
                         </CardContent>
                    </div>
                    <div className="relative min-h-[300px]">
                        <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
                    </div>
                 </div>
            </Card>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     {/* Instructions Card */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><ListChecks className="text-primary"/>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ol className="list-decimal list-inside space-y-4">
                               {recipe.instructions.map((step, index) => (
                                   <li key={index} className="pl-2 leading-relaxed">{step}</li>
                               ))}
                           </ol>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="space-y-8">
                    {/* Ingredients Card */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Sprout className="text-primary"/>Ingredients</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                               {recipe.ingredients.map((ing, index) => (
                                   <li key={`${ing.name}-${index}`} className="flex items-center gap-3">
                                     <div className="w-10 h-10 relative">
                                        <Image src={ing.image || 'https://placehold.co/100x100.png'} alt={ing.name} fill className="object-contain rounded-md" />
                                     </div>
                                     <div>
                                        <span className="font-semibold">{ing.name}</span>
                                        <p className="text-sm text-muted-foreground">{ing.measure}</p>
                                     </div>
                                   </li>
                               ))}
                           </ul>
                        </CardContent>
                    </Card>
                    
                    {/* Nutritional Analysis */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl flex items-center gap-2"><BarChart className="text-primary"/>Nutritional Analysis</CardTitle>
                             <CardDescription>Per serving</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <div className="flex justify-between"><span>Calories</span><span className="font-semibold">{recipe.nutrition.calories?.toFixed(0)}</span></div>
                           <Separator />
                           <div className="flex justify-between"><span>Fat</span><span className="font-semibold">{recipe.nutrition.fat?.toFixed(1)}g</span></div>
                            <Separator />
                           <div className="flex justify-between"><span>Protein</span><span className="font-semibold">{recipe.nutrition.protein?.toFixed(1)}g</span></div>
                            <Separator />
                           <div className="flex justify-between"><span>Carbs</span><span className="font-semibold">{recipe.nutrition.carbs?.toFixed(1)}g</span></div>
                        </CardContent>
                    </Card>

                     {/* Equipment */}
                    {recipe.equipment && recipe.equipment.length > 0 && (
                      <Card className="shadow-lg">
                          <CardHeader>
                              <CardTitle className="font-headline text-xl flex items-center gap-2"><ChefHat className="text-primary"/>Equipment</CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-2">
                             {recipe.equipment.map(item => (
                                 <Badge key={item} variant="outline" className="capitalize">{item}</Badge>
                             ))}
                          </CardContent>
                      </Card>
                    )}

                    {/* Source */}
                    {recipe.sourceUrl && (
                      <Card className="shadow-lg">
                          <CardHeader>
                              <CardTitle className="font-headline text-xl flex items-center gap-2"><BrainCircuit className="text-primary"/>Source</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                This recipe was originally sourced from <Link href={recipe.sourceUrl} target='_blank' rel="noopener noreferrer" className="text-primary hover:underline">{recipe.sourceUrl.split('/')[2]}</Link>.
                              </p>
                              <Button asChild className="w-full">
                                <Link href={recipe.sourceUrl} target='_blank' rel="noopener noreferrer">
                                  View Original Recipe
                                </Link>
                              </Button>
                          </CardContent>
                      </Card>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
