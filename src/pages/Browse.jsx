// src/pages/Browse.jsx - Advanced Anime Exploration & Discovery
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Compass, Filter, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePopularQuery, useGenreQuery } from '../hooks/useAnimeQuery';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { FilterPanel, GENRES_LIST } from '../components/anime/FilterPanel';
import { SkeletonGrid } from '../components/common/SkeletonCard';

export const BrowsePage = ({ onOpenDownload }) => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { genre: urlGenre } = useParams();

  const initialGenre = urlGenre || searchParams.get('genre') || 'All';

  const [filters, setFilters] = useState({
    genre: initialGenre,
    audio: searchParams.get('audio') || "all",
    type: searchParams.get('type') || "all",
    sortBy: searchParams.get('sort') || "popular"
  });

  useEffect(() => {
    if (urlGenre) {
      setFilters(prev => ({ ...prev, genre: urlGenre }));
    }
  }, [urlGenre]);

  const { data: popularList, isLoading: isPopLoading } = usePopularQuery();
  const { data: genreList, isLoading: isGenreLoading } = useGenreQuery(filters.genre !== 'All' ? filters.genre : null);

  const handleReset = () => {
    setFilters({
      genre: "All",
      audio: "all",
      type: "all",
      sortBy: "popular"
    });
    setSearchParams({});
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = {};
    if (newFilters.genre !== "All") params.genre = newFilters.genre;
    if (newFilters.audio !== "all") params.audio = newFilters.audio;
    if (newFilters.type !== "all") params.type = newFilters.type;
    if (newFilters.sortBy !== "popular") params.sort = newFilters.sortBy;
    setSearchParams(params);
  };

  const filteredAnime = useMemo(() => {
    let rawList = filters.genre !== 'All' ? (genreList || []) : (popularList || []);

    if (filters.audio !== "all") {
      rawList = rawList.filter(a => a.audioTypes?.includes(filters.audio));
    }

    if (filters.type !== "all") {
      rawList = rawList.filter(a => a.type === filters.type || a.format === filters.type);
    }

    if (filters.sortBy === "rating") {
      rawList = [...rawList].sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "latest") {
      rawList = [...rawList].sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (filters.sortBy === "az") {
      rawList = [...rawList].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      rawList = [...rawList].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return rawList;
  }, [filters, genreList, popularList]);

  const isLoading = filters.genre !== 'All' ? isGenreLoading : isPopLoading;

  return (
    <div className="catalog-page-root container">
      {/* Page Header */}
      <div className="page-header-block">
        <div className="page-title-badge">
          <Compass size={24} className="page-title-icon text-crimson" />
          <h1 className="page-main-title">
            {filters.genre !== "All" ? `${filters.genre} Anime` : t('browse')}
          </h1>
        </div>
        <span className="page-count-tag">{filteredAnime.length} {t('episodes') ? 'Titles' : 'শিরোনাম'}</span>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Results Grid */}
      <div className="mt-8">
        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : (
          <AnimeGrid 
            animeList={filteredAnime} 
            onOpenDownload={onOpenDownload} 
          />
        )}
      </div>
    </div>
  );
};
