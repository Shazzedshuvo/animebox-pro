// src/hooks/useAnimeQuery.js - TanStack React Query Hooks for AnimeBox PRO
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as animeService from '../services/animeService';

const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000,    // 30 minutes
  retry: 2,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  refetchOnWindowFocus: false
};

export const useHeroAnimeQuery = () => {
  return useQuery({
    queryKey: ['anime', 'hero'],
    queryFn: animeService.getHeroFeaturedAnime,
    ...QUERY_CONFIG
  });
};

export const useTrendingQuery = () => {
  return useQuery({
    queryKey: ['anime', 'trending'],
    queryFn: animeService.getTrendingAnime,
    ...QUERY_CONFIG
  });
};

export const usePopularQuery = () => {
  return useQuery({
    queryKey: ['anime', 'popular'],
    queryFn: animeService.getPopularAnime,
    ...QUERY_CONFIG
  });
};

export const useTopRatedQuery = () => {
  return useQuery({
    queryKey: ['anime', 'top-rated'],
    queryFn: animeService.getTopRatedAnime,
    ...QUERY_CONFIG
  });
};

export const useLatestQuery = () => {
  return useQuery({
    queryKey: ['anime', 'latest'],
    queryFn: animeService.getLatestAnime,
    ...QUERY_CONFIG
  });
};

export const useMoviesQuery = () => {
  return useQuery({
    queryKey: ['anime', 'movies'],
    queryFn: animeService.getAnimeMovies,
    ...QUERY_CONFIG
  });
};

export const useSeriesQuery = () => {
  return useQuery({
    queryKey: ['anime', 'series'],
    queryFn: animeService.getAnimeSeries,
    ...QUERY_CONFIG
  });
};

export const useGenreQuery = (genre) => {
  return useQuery({
    queryKey: ['anime', 'genre', genre],
    queryFn: () => animeService.getAnimeByGenre(genre),
    enabled: Boolean(genre),
    ...QUERY_CONFIG
  });
};

export const useDubbedQuery = (type = "Hindi Dub") => {
  return useQuery({
    queryKey: ['anime', 'dubbed', type],
    queryFn: () => animeService.getDubbedAnime(type),
    ...QUERY_CONFIG
  });
};

export const useAnimeDetailsQuery = (id) => {
  return useQuery({
    queryKey: ['anime', 'details', id],
    queryFn: () => animeService.getAnimeDetails(id),
    enabled: Boolean(id),
    ...QUERY_CONFIG
  });
};

export const useAnimeSearchQuery = (searchTerm) => {
  return useQuery({
    queryKey: ['anime', 'search', searchTerm],
    queryFn: () => animeService.searchAnime(searchTerm),
    enabled: Boolean(searchTerm && searchTerm.trim().length > 1),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

/**
 * Prefetch anime details hook on card hover
 */
export const usePrefetchAnimeDetails = () => {
  const queryClient = useQueryClient();
  return (id) => {
    if (!id) return;
    queryClient.prefetchQuery({
      queryKey: ['anime', 'details', id],
      queryFn: () => animeService.getAnimeDetails(id),
      staleTime: 5 * 60 * 1000
    });
  };
};
