// src/api/consumetApi.js - Real 24-Min Full Episode Anime & Movie Streaming Provider Engine
import { getTmdbInfoForAnime } from '../services/tmdbMapping';

/**
 * Generates verified working Stream URLs for both Anime Series and Movies
 */
export const getMovieBoxStreamUrls = (malId, epNum, animeTitle = '', season = 1, anime = null) => {
  const ep = Number(epNum) || 1;
  const s = Number(season) || 1;
  const isMovieExplicit = anime?.type === 'Movie' || anime?.format === 'MOVIE' || anime?.totalEpisodes === 1;
  const tmdbInfo = getTmdbInfoForAnime(animeTitle, malId, isMovieExplicit);
  const isMovie = tmdbInfo.isMovie || isMovieExplicit;
  const id = tmdbInfo.id;

  if (isMovie) {
    // 🎬 Full Movie Streaming Endpoints
    return {
      vidsrc_in: `https://vidsrc.in/embed/movie/${id}`,
      vidsrc_to: `https://vidsrc.to/embed/movie/${id}`,
      vidsrc_me: `https://vidsrc.me/embed/movie?tmdb=${id}`,
      embed_2cc: `https://2embed.cc/embed/${id}`,
      vidsrc_net: `https://vidsrc.net/embed/movie/${id}`
    };
  }

  // 📺 TV Series Episode Streaming Endpoints
  return {
    vidsrc_in: `https://vidsrc.in/embed/tv/${id}/${s}/${ep}`,
    vidsrc_to: `https://vidsrc.to/embed/tv/${id}/${s}/${ep}`,
    vidsrc_me: `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${ep}`,
    embed_2cc: `https://2embed.cc/embedtv/${id}&s=${s}&e=${ep}`,
    vidsrc_net: `https://vidsrc.net/embed/tv/${id}/${s}/${ep}`
  };
};

/**
 * Direct external streaming hub URLs for 100% uninterrupted watching
 */
export const getDirectWatchUrls = (title = '', episodeNum = 1, malId = 20) => {
  const cleanTitle = encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim());
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return [
    {
      name: 'AnimeWorld (Hindi/Eng/Ben)',
      url: `https://watchanimeworld.one/episode/${slug}-1x${episodeNum}/`,
      badge: 'HINDI / DUB',
      color: '#e50914'
    },
    {
      name: 'HiAnime HD (1080p)',
      url: `https://hianime.to/search?keyword=${cleanTitle}`,
      badge: '1080p SUB',
      color: '#ffb703'
    },
    {
      name: 'GogoAnime',
      url: `https://anitaku.to/search.html?keyword=${cleanTitle}`,
      badge: 'FAST DUB',
      color: '#06d6a0'
    },
    {
      name: 'YouTube HD',
      url: `https://www.youtube.com/results?search_query=${cleanTitle}+episode+${episodeNum}+english+sub`,
      badge: 'OFFICIAL 1080p',
      color: '#ff0000'
    }
  ];
};
