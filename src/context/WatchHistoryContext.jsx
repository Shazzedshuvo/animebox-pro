// src/context/WatchHistoryContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchHistoryContext = createContext();

export const WatchHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('animebox_history');
      return saved ? JSON.parse(saved) : [
        {
          animeId: 1,
          episodeNumber: 1,
          animeTitle: "Solo Leveling",
          banglaTitle: "সোলো লেভেলিং",
          posterImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
          progress: 920,
          duration: 1440,
          percentage: 64,
          lastWatched: new Date().toISOString()
        },
        {
          animeId: 2,
          episodeNumber: 3,
          animeTitle: "Demon Slayer",
          banglaTitle: "ডিমন স্লেয়ার",
          posterImage: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop",
          progress: 540,
          duration: 1440,
          percentage: 38,
          lastWatched: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('animebox_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  const updateProgress = ({ animeId, episodeNumber, animeTitle, banglaTitle, posterImage, progress, duration }) => {
    const numId = Number(animeId);
    const numEp = Number(episodeNumber);
    const pct = duration > 0 ? Math.min(100, Math.round((progress / duration) * 100)) : 0;

    setHistory(prev => {
      const filtered = prev.filter(item => !(item.animeId === numId && item.episodeNumber === numEp));
      const newItem = {
        animeId: numId,
        episodeNumber: numEp,
        animeTitle: animeTitle || `Anime #${numId}`,
        banglaTitle: banglaTitle || animeTitle,
        posterImage: posterImage || `https://picsum.photos/seed/anime_${numId}/600/900`,
        progress: Math.floor(progress),
        duration: Math.floor(duration),
        percentage: pct,
        lastWatched: new Date().toISOString()
      };
      return [newItem, ...filtered].slice(0, 50); // Keep max 50 items
    });
  };

  const removeFromHistory = (animeId, episodeNumber) => {
    const numId = Number(animeId);
    const numEp = episodeNumber ? Number(episodeNumber) : null;
    setHistory(prev => prev.filter(item => {
      if (numEp) {
        return !(item.animeId === numId && item.episodeNumber === numEp);
      }
      return item.animeId !== numId;
    }));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getProgress = (animeId, episodeNumber) => {
    const numId = Number(animeId);
    const numEp = Number(episodeNumber);
    return history.find(item => item.animeId === numId && item.episodeNumber === numEp) || null;
  };

  return (
    <WatchHistoryContext.Provider value={{ history, updateProgress, removeFromHistory, clearHistory, getProgress }}>
      {children}
    </WatchHistoryContext.Provider>
  );
};

export const useWatchHistory = () => {
  const context = useContext(WatchHistoryContext);
  if (!context) {
    throw new Error('useWatchHistory must be used within a WatchHistoryProvider');
  }
  return context;
};
