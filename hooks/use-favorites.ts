import { useState, useEffect } from 'react';

interface FavoriteItem {
  id: string;
  name: string;
  href: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, []);

  const saveFavorites = (updatedFavorites: FavoriteItem[]) => {
    setFavorites(updatedFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prevFavorites => {
      const newFavorites = isFavorite(item.id)
        ? prevFavorites.filter(fav => fav.id !== item.id)
        : [...prevFavorites, item];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  return { favorites, isFavorite, toggleFavorite };
}
