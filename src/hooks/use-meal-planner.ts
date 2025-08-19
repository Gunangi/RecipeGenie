
import { useState, useEffect, useCallback } from 'react';
import type { Meal, MealPlan } from '@/lib/types';

const MEAL_PLAN_KEY = 'recipe-genie-meal-plan';

export const useMealPlan = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan>({});

  useEffect(() => {
    try {
      const storedMealPlan = localStorage.getItem(MEAL_PLAN_KEY);
      if (storedMealPlan) {
        setMealPlan(JSON.parse(storedMealPlan));
      }
    } catch (error) {
      console.error('Failed to parse meal plan from localStorage', error);
      setMealPlan({});
    }
  }, []);

  const saveMealPlan = useCallback((newMealPlan: MealPlan) => {
    try {
      setMealPlan(newMealPlan);
      localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(newMealPlan));
    } catch (error) {
      console.error('Failed to save meal plan to localStorage', error);
    }
  }, []);

  const addMeal = useCallback((date: string, meal: Meal) => {
    const newMealPlan = { ...mealPlan };
    if (!newMealPlan[date]) {
      newMealPlan[date] = [];
    }
    // Prevent adding duplicates
    if (!newMealPlan[date].some(m => m.recipe.id === meal.recipe.id && m.type === meal.type)) {
       newMealPlan[date].push(meal);
       saveMealPlan(newMealPlan);
    }
  }, [mealPlan, saveMealPlan]);

  const removeMeal = useCallback((date: string, mealId: string) => {
    const newMealPlan = { ...mealPlan };
    if (newMealPlan[date]) {
      newMealPlan[date] = newMealPlan[date].filter(m => m.id !== mealId);
      if (newMealPlan[date].length === 0) {
        delete newMealPlan[date];
      }
      saveMealPlan(newMealPlan);
    }
  }, [mealPlan, saveMealPlan]);
  
  const getMealsForDate = useCallback((date: string): Meal[] => {
    return mealPlan[date] || [];
  }, [mealPlan]);

  return { mealPlan, addMeal, removeMeal, getMealsForDate };
};
