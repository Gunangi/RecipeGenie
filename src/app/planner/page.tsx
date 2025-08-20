
'use client';

import { useState } from 'react';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Coffee, Utensils, Drumstick, Plus, Trash2, Clock, Flame } from 'lucide-react';
import { useMealPlan } from '@/hooks/use-meal-planner';
import type { Meal, MealType } from '@/lib/types';
import { AddMealDialog } from './add-meal-dialog';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const mealTypes: { type: MealType; icon: React.ReactNode }[] = [
  { type: 'Breakfast', icon: <Coffee className="w-5 h-5 text-yellow-500" /> },
  { type: 'Lunch', icon: <Utensils className="w-5 h-5 text-blue-500" /> },
  { type: 'Dinner', icon: <Drumstick className="w-5 h-5 text-red-500" /> },
  { type: 'Snack', icon: <Coffee className="w-5 h-5 text-purple-500" /> },
];

function WeekCalendar({ selectedDate, onDateChange }: { selectedDate: Date; onDateChange: (date: Date) => void }) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="flex justify-between items-center bg-muted p-2 rounded-lg">
      {weekDays.map(day => (
        <Button
          key={day.toISOString()}
          variant={isSameDay(day, selectedDate) ? 'default' : 'ghost'}
          className="flex flex-col h-auto px-3 py-2"
          onClick={() => onDateChange(day)}
        >
          <span>{format(day, 'E')}</span>
          <span className="text-xl font-bold">{format(day, 'd')}</span>
        </Button>
      ))}
    </div>
  );
}

function MealCard({ meal, onRemove }: { meal: Meal, onRemove: () => void }) {
    if (!meal.recipe) {
        return null;
    }
  return (
    <Card className="relative group overflow-hidden border-l-4 border-dashed border-transparent hover:border-primary transition-all">
       <Link href={`/recipe/${meal.recipe.id}`} className="block">
        <CardContent className="p-3">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold">{meal.recipe.title}</h4>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{meal.recipe.readyInMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{meal.recipe.nutrition?.calories?.toFixed(0) ?? 'N/A'} cal</span>
                </div>
            </div>
        </CardContent>
      </Link>
    </Card>
  );
}


export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { mealPlan, addMeal, removeMeal } = useMealPlan();
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [mealTypeToAdd, setMealTypeToAdd] = useState<MealType | null>(null);

  const formattedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const mealsForSelectedDay = mealPlan[formattedDateKey] || [];
  
  const handleAddMealClick = (mealType: MealType) => {
    setMealTypeToAdd(mealType);
    setIsAddMealOpen(true);
  };
  
  const handleAddMeal = (recipe: any) => {
    if (mealTypeToAdd) {
      addMeal(formattedDateKey, {
          id: `${Date.now()}`,
          type: mealTypeToAdd,
          recipe: {
              ...recipe,
              // we need to get nutrition info separately if not available
              nutrition: recipe.nutrition || { calories: Math.floor(Math.random() * 300) + 200 }
          }
      });
    }
  };

  const mealsPlannedCount = mealsForSelectedDay.length;

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                 <Calendar className="w-8 h-8 text-primary" />
                 <CardTitle className="font-headline text-3xl">Weekly Meal Planner</CardTitle>
              </div>
              <CardDescription>
                Plan your week, get grocery lists, and discover meal prep suggestions. Drag and drop recipes to build your perfect week.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <WeekCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
              
              <div>
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold">{format(selectedDate, "EEEE's Meals")}</h2>
                    {mealsPlannedCount > 0 && <Badge variant="secondary">{mealsPlannedCount} planned</Badge>}
                </div>
                
                <div className="space-y-6">
                    {mealTypes.map(({ type, icon }) => {
                        const mealsOfType = mealsForSelectedDay.filter(m => m.type === type);
                        return (
                            <div key={type}>
                                <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                                    {icon}
                                    {type}
                                </h3>
                                <div className="space-y-3 pl-7 border-l-2 border-muted">
                                    {mealsOfType.map(meal => (
                                        <MealCard key={meal.id} meal={meal} onRemove={() => removeMeal(formattedDateKey, meal.id)} />
                                    ))}
                                    <Button variant="ghost" className="w-full border-2 border-dashed" onClick={() => handleAddMealClick(type)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add meal
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
      {mealTypeToAdd && (
        <AddMealDialog
            isOpen={isAddMealOpen}
            onClose={() => setIsAddMealOpen(false)}
            onAddMeal={handleAddMeal}
            mealType={mealTypeToAdd}
        />
      )}
    </div>
  );
}