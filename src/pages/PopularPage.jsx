// src/pages/PopularPage.jsx - Real API Popular Anime Page
import React, { useState, useMemo } from 'react';
import { Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePopularQuery } from '../hooks/useAnimeQuery';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { FilterPanel } from '../components/anime/FilterPanel';
import { SkeletonGrid } from '../components/common/SkeletonCard';

export const PopularPage = ({ onOpenDownload }) => {
  const { t } = useLanguage();
  const { data: popularRaw, isLoading } = usePopularQuery();

  const [filters, setFilters] = useState({
    genre: "All",
    audio: "all",
    type: "all",
    sortBy: "popular"
  });

  const handleReset = () => {
    setFilters({
      genre: "All",
      audio: "all",
      type: "all",
      sortBy: "popular"
    });
  };

  const popularList = useMemo(() => {
    let list = popularRaw || [];

    if (filters.genre !== "All") {
      list = list.filter(a => a.genres?.some(g => g.toLowerCase() === filters.genre.toLowerCase()));
    }

    if (filters.audio !== "all") {
      list = list.filter(a => a.audioTypes?.includes(filters.audio));
    }

    if (filters.type !== "all") {
      list = list.filter(a => a.type === filters.type || a.format === filters.type);
    }

    if (filters.sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else {
      list = [...list].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return list;
  }, [popularRaw, filters]);

  return (
    <div className="catalog-page-root container">
      <div className="page-header-block">
        <div className="page-title-badge">
          <Flame size={20} className="page-title-icon text-crimson" />
          <h1 className="page-main-title">{t('popular')}</h1>
        </div>
        <span className="page-count-tag">{popularList.length} Anime</span>
      </div>

      <FilterPanel 
        filters={filters} 
        onFilterChange={setFilters} 
        onReset={handleReset} 
      />

      <div className="mt-8">
        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : (
          <AnimeGrid 
            animeList={popularList} 
            onOpenDownload={onOpenDownload} 
          />
        )}
      </div>
    </div>
  );
};
