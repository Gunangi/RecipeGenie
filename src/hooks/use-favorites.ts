import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'recipe-genie-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to parse favorites from localStorage', error);
      setFavorites([]);
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: number[]) => {
    try {
      setFavorites(newFavorites);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
    }
  }, []);

  const addFavorite = useCallback((recipeId: number) => {
    if (!favorites.includes(recipeId)) {
      const newFavorites = [...favorites, recipeId];
      saveFavorites(newFavorites);
    }
  }, [favorites, saveFavorites]);

  const removeFavorite = useCallback((recipeId: number) => {
    const newFavorites = favorites.filter(id => id !== recipeId);
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  return { favorites, addFavorite, removeFavorite };
};