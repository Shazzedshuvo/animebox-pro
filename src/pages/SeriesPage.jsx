// src/pages/SeriesPage.jsx - Real API TV Series Page
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tv } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSeriesQuery } from '../hooks/useAnimeQuery';
import { FilterPanel } from '../components/anime/FilterPanel';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { SkeletonGrid } from '../components/common/SkeletonCard';

export const SeriesPage = ({ onOpenDownload }) => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get('genre') || 'All';

  const { data: seriesList, isLoading } = useSeriesQuery();

  const [filters, setFilters] = useState({
    genre: initialGenre,
    audio: "all",
    type: "TV Series",
    sortBy: "popular"
  });

  useEffect(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam) {
      setFilters(prev => ({ ...prev, genre: genreParam }));
    }
  }, [searchParams]);

  const handleReset = () => {
    setFilters({
      genre: "All",
      audio: "all",
      type: "TV Series",
      sortBy: "popular"
    });
  };

  const series = useMemo(() => {
    let list = seriesList || [];

    if (filters.genre !== "All") {
      list = list.filter(a => a.genres?.some(g => g.toLowerCase() === filters.genre.toLowerCase()));
    }

    if (filters.audio !== "all") {
      list = list.filter(a => a.audioTypes?.includes(filters.audio));
    }

    if (filters.sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "latest") {
      list = [...list].sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (filters.sortBy === "az") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list = [...list].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return list;
  }, [seriesList, filters]);

  return (
    <div className="catalog-page-root container">
      <div className="page-header-block">
        <div className="page-title-badge">
          <Tv size={20} className="page-title-icon" />
          <h1 className="page-main-title">{t('popularSeries')}</h1>
        </div>
        <span className="page-count-tag">{series.length} {t('series')}</span>
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
            animeList={series} 
            onOpenDownload={onOpenDownload} 
          />
        )}
      </div>
    </div>
  );
};
