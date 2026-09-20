// src/context/FavoritesContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('animebox_favorites');
      return saved ? JSON.parse(saved) : [1, 2, 4, 7]; // Initial curated favorites
    } catch {
      return [1, 2, 4, 7];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('animebox_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const addFavorite = (animeId) => {
    const id = Number(animeId);
    setFavorites(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFavorite = (animeId) => {
    const id = Number(animeId);
    setFavorites(prev => prev.filter(item => item !== id));
  };

  const toggleFavorite = (animeId) => {
    const id = Number(animeId);
    if (favorites.includes(id)) {
      removeFavorite(id);
      return false; // Removed
    } else {
      addFavorite(id);
      return true; // Added
    }
  };

  const isFavorite = (animeId) => {
    return favorites.includes(Number(animeId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
