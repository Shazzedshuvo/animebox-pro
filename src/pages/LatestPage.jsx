// src/pages/LatestPage.jsx - Real API Latest Seasonal Releases
import React, { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLatestQuery } from '../hooks/useAnimeQuery';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { FilterPanel } from '../components/anime/FilterPanel';
import { SkeletonGrid } from '../components/common/SkeletonCard';

export const LatestPage = ({ onOpenDownload }) => {
  const { t } = useLanguage();
  const { data: latestRaw, isLoading } = useLatestQuery();

  const [filters, setFilters] = useState({
    genre: "All",
    audio: "all",
    type: "all",
    sortBy: "latest"
  });

  const handleReset = () => {
    setFilters({
      genre: "All",
      audio: "all",
      type: "all",
      sortBy: "latest"
    });
  };

  const latestList = useMemo(() => {
    let list = latestRaw || [];

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
      list = [...list].sort((a, b) => b.releaseYear - a.releaseYear);
    }

    return list;
  }, [latestRaw, filters]);

  return (
    <div className="catalog-page-root container">
      <div className="page-header-block">
        <div className="page-title-badge">
          <Clock size={20} className="page-title-icon" />
          <h1 className="page-main-title">{t('latestReleases')}</h1>
        </div>
        <span className="page-count-tag">{latestList.length} {t('latest')}</span>
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
            animeList={latestList} 
            onOpenDownload={onOpenDownload} 
          />
        )}
      </div>
    </div>
  );
};
