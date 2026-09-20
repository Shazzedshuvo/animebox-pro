// src/pages/SearchPage.jsx - Real API Search Page
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Film, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDebounce } from '../hooks/useDebounce';
import { useAnimeSearchQuery, usePopularQuery } from '../hooks/useAnimeQuery';
import { FilterPanel } from '../components/anime/FilterPanel';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { SkeletonGrid } from '../components/common/SkeletonCard';

export const SearchPage = ({ onOpenDownload }) => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearch = useDebounce(searchTerm, 350);

  const [filters, setFilters] = useState({
    genre: "All",
    audio: "all",
    type: "all",
    sortBy: "popular"
  });

  const { data: searchResults, isLoading: isSearchLoading } = useAnimeSearchQuery(debouncedSearch);
  const { data: popularFallback, isLoading: isPopLoading } = usePopularQuery();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleReset = () => {
    setFilters({
      genre: "All",
      audio: "all",
      type: "all",
      sortBy: "popular"
    });
    setSearchTerm('');
    setSearchParams({});
  };

  const displayedList = useMemo(() => {
    let list = debouncedSearch.trim() ? (searchResults || []) : (popularFallback || []);

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
    } else if (filters.sortBy === "latest") {
      list = [...list].sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (filters.sortBy === "az") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list = [...list].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return list;
  }, [debouncedSearch, searchResults, popularFallback, filters]);

  const isLoading = debouncedSearch.trim() ? isSearchLoading : isPopLoading;

  return (
    <div className="catalog-page-root container">
      {/* Search Input Bar */}
      <div className="search-page-input-card glass-panel">
        <Search size={22} className="text-secondary" />
        <input
          type="text"
          className="search-page-input"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button className="btn-icon-small" onClick={() => { setSearchTerm(''); setSearchParams({}); }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <div className="mt-4">
        <FilterPanel 
          filters={filters} 
          onFilterChange={setFilters} 
          onReset={handleReset} 
        />
      </div>

      {/* Results Header */}
      <div className="search-results-header mt-6">
        <h2 className="search-results-heading">
          {debouncedSearch ? (
            <span>Search Results for "<strong className="text-crimson">{debouncedSearch}</strong>"</span>
          ) : (
            <span>{t('browse')} Anime Catalog</span>
          )}
        </h2>
        <span className="results-count-badge">
          {isLoading ? 'Searching...' : `${displayedList.length} Results`}
        </span>
      </div>

      {/* Results Grid */}
      <div className="mt-4">
        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : (
          <AnimeGrid 
            animeList={displayedList} 
            onOpenDownload={onOpenDownload} 
          />
        )}
      </div>
    </div>
  );
};
