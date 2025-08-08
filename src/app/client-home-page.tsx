
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { RecipeFilters } from '@/components/recipe-filters';
import { RecipeSearchForm } from '@/components/recipe-search-form';
import { RecipeCard } from '@/components/recipe-card';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarTrigger, SidebarContent, SidebarFooter, MobileSidebar } from '@/components/ui/sidebar';
import { RecipeOfTheDayCard } from '@/components/recipe-of-the-day-card';
import type { RecipeSummary, RecipeWithDetails } from '@/lib/types';
import { SettingsButton } from '@/components/settings-button';

export default function ClientHomePage({ popularRecipes, recipeOfTheDay }: { popularRecipes: RecipeSummary[], recipeOfTheDay: RecipeWithDetails | null }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen}>
              <SidebarContent className="p-4">
                 <RecipeFilters />
              </SidebarContent>
              <SidebarFooter>
                 <SettingsButton />
              </SidebarFooter>
          </Sidebar>
          <main className="flex-1">
            <div className="container mx-auto p-4 md:py-8 space-y-8">
               <div className="flex items-center gap-4">
                 <MobileSidebar>
                    <SidebarContent className="p-4">
                      <RecipeFilters />
                    </SidebarContent>
                    <SidebarFooter>
                      <SettingsButton />
                    </SidebarFooter>
                 </MobileSidebar>
                 <SidebarTrigger isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                 <h1 className="text-3xl font-headline font-bold text-foreground">
                    Welcome to RecipeGenie
                 </h1>
               </div>
               
               <div className="space-y-8">
                 {recipeOfTheDay && <RecipeOfTheDayCard recipe={recipeOfTheDay} />}
                 <RecipeSearchForm />
               </div>

              <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-headline font-bold text-foreground">
                    Popular Recipes
                    </h2>
                     <Button variant="link">View All &rarr;</Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(popularRecipes || []).map((recipe, index) => (
                    recipe && <RecipeCard key={`${recipe.id}-${index}`} recipe={recipe} />
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
  );
}
