// src/utils/imageUtils.js - Smart Image Resolution & Fallback Pipeline

export const DEFAULT_POSTER = "https://images.weserv.nl/?url=https://cdn.myanimelist.net/images/anime/1170/124305l.jpg&w=600&h=900&fit=cover";
export const DEFAULT_BANNER = "https://images.weserv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-3flDafx19qpV.jpg&w=1600&h=700&fit=cover";

/**
 * Returns the best available banner or creates a cinematic backdrop from poster
 */
export const getHeroBackdrop = (anime) => {
  if (!anime) return DEFAULT_BANNER;
  if (anime.bannerImage && anime.bannerImage.trim() !== '') {
    return anime.bannerImage;
  }
  if (anime.largePosterImage && anime.largePosterImage.trim() !== '') {
    return anime.largePosterImage;
  }
  if (anime.posterImage && anime.posterImage.trim() !== '') {
    return anime.posterImage;
  }
  return DEFAULT_BANNER;
};

/**
 * Returns the best available poster image
 */
export const getPosterImage = (anime) => {
  if (!anime) return DEFAULT_POSTER;
  return anime.largePosterImage || anime.posterImage || DEFAULT_POSTER;
};

/**
 * Normalizes and proxies external anime images for reliability
 */
export const optimizeAnimeImage = (url, width = 600, height = 900) => {
  if (!url || typeof url !== 'string') return DEFAULT_POSTER;
  if (url.includes('images.weserv.nl') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&h=${height}&fit=cover&errorredirect=${encodeURIComponent(DEFAULT_POSTER)}`;
};
