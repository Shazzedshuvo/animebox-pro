// src/services/animeApi.js - AniList GraphQL + Jikan API Fallback + Local Mock Cache

import fullAnimeDatabase from '../data/animeData';

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';
const JIKAN_API_ENDPOINT = 'https://api.jikan.moe/v4';

// In-memory cache to prevent excessive requests
const apiCache = new Map();

/**
 * GraphQL Query for AniList trending & popular anime
 */
const ANILIST_BROWSE_QUERY = `
query ($page: Int, $perPage: Int, $sort: [MediaSort], $genre: String, $search: String, $format: MediaFormat) {
  Page(page: $page, perPage: $perPage) {
    media(sort: $sort, genre: $genre, search: $search, format: $format, type: ANIME, isAdult: false) {
      id
      title {
        romaji
        english
        native
      }
      bannerImage
      coverImage {
        extraLarge
        large
        medium
      }
      description
      averageScore
      genres
      startDate {
        year
      }
      status
      format
      duration
      episodes
      popularity
      trailer {
        id
        site
      }
    }
  }
}
`;

/**
 * Normalizes AniList API item into our unified Anime model
 */
const normalizeAniListItem = (media, index) => {
  const englishTitle = media.title?.english || media.title?.romaji || "Untitled Anime";
  const rating = media.averageScore ? (media.averageScore / 10).toFixed(1) : 8.5;
  const year = media.startDate?.year || 2024;
  const isMovie = media.format === "MOVIE";
  const totalEps = isMovie ? 1 : (media.episodes || 12);
  const poster = media.coverImage?.extraLarge || media.coverImage?.large || `https://picsum.photos/seed/anime_${media.id}/600/900`;
  const banner = media.bannerImage || poster;
  const cleanDescription = (media.description || "Exciting anime series full of thrilling moments and deep storytelling.")
    .replace(/<[^>]*>?/gm, '');

  return {
    id: media.id || (1000 + index),
    title: englishTitle,
    banglaTitle: media.title?.native || englishTitle,
    bannerImage: banner,
    posterImage: poster,
    description: cleanDescription,
    banglaDescription: `${englishTitle} এর টানটান উত্তেজনাপূর্ণ কাহিনী এবং চমৎকার এনিমেশন উপভোগ করুন এনিমেবক্স-এ।`,
    rating: parseFloat(rating),
    genres: media.genres?.length ? media.genres : ["Action", "Adventure"],
    releaseYear: year,
    status: media.status === "FINISHED" ? "Completed" : "Ongoing",
    type: isMovie ? "Movie" : (media.format === "OVA" ? "OVA" : "TV Series"),
    duration: isMovie ? "1h 50m" : `${media.duration || 24}m per ep`,
    quality: "4K UHD",
    ageRating: "13+",
    audioType: ["Sub", "English Dub", "Hindi Dub"],
    totalEpisodes: totalEps,
    trending: index < 8,
    popularity: media.popularity || 90,
    featured: index === 0,
    trailerUrl: media.trailer?.site === "youtube" ? `https://www.youtube.com/watch?v=${media.trailer.id}` : null,
    isLiveFetched: true
  };
};

/**
 * Fetch live anime from AniList GraphQL with fallback to local database
 */
export const fetchAniListAnime = async ({ sort = ["TRENDING_DESC"], genre = null, search = null, format = null, perPage = 30 } = {}) => {
  const cacheKey = JSON.stringify({ sort, genre, search, format, perPage });
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  try {
    const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: ANILIST_BROWSE_QUERY,
        variables: {
          page: 1,
          perPage,
          sort,
          genre,
          search,
          format
        }
      })
    });

    if (!response.ok) {
      throw new Error(`AniList returned HTTP ${response.status}`);
    }

    const json = await response.json();
    const mediaList = json.data?.Page?.media;
    if (mediaList && mediaList.length > 0) {
      const normalized = mediaList.map((m, idx) => normalizeAniListItem(m, idx));
      apiCache.set(cacheKey, normalized);
      return normalized;
    }
    throw new Error('No AniList media returned');
  } catch (error) {
    console.warn('AniList API error, falling back to local database / Jikan:', error.message);
    return fallbackLocalFilter({ genre, search, format, sort });
  }
};

/**
 * Local fallback filter logic
 */
const fallbackLocalFilter = ({ genre, search, format, sort } = {}) => {
  let results = [...fullAnimeDatabase];

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.banglaTitle.toLowerCase().includes(q) ||
      a.genres.some(g => g.toLowerCase().includes(q))
    );
  }

  if (genre && genre !== "All") {
    results = results.filter(a => a.genres.some(g => g.toLowerCase() === genre.toLowerCase()));
  }

  if (format) {
    if (format === "MOVIE") results = results.filter(a => a.type === "Movie");
    else if (format === "TV") results = results.filter(a => a.type === "TV Series");
    else if (format === "OVA") results = results.filter(a => a.type === "OVA");
  }

  return results;
};

/**
 * Get anime by ID from combined data
 */
export const getAnimeById = (id) => {
  const numericId = Number(id);
  const found = fullAnimeDatabase.find(a => a.id === numericId);
  if (found) return found;

  // Search in memory cache
  for (const list of apiCache.values()) {
    const inCache = list.find(a => a.id === numericId);
    if (inCache) return inCache;
  }

  // Fallback to first item if not found
  return fullAnimeDatabase[0];
};

/**
 * Get curated categories for the Home page
 */
export const getHomeCatalog = () => {
  return {
    featured: fullAnimeDatabase.slice(0, 6),
    trending: fullAnimeDatabase.filter(a => a.trending).slice(0, 15),
    topTen: fullAnimeDatabase.slice(0, 10),
    hindiDubbed: fullAnimeDatabase.filter(a => a.audioType.includes("Hindi Dub")).slice(0, 15),
    englishDubbed: fullAnimeDatabase.filter(a => a.audioType.includes("English Dub")).slice(0, 15),
    popularSeries: fullAnimeDatabase.filter(a => a.type === "TV Series" && a.rating >= 9.3).slice(0, 15),
    movies: fullAnimeDatabase.filter(a => a.type === "Movie").slice(0, 15),
    latest: fullAnimeDatabase.filter(a => a.releaseYear >= 2023).slice(0, 15),
    highestRated: [...fullAnimeDatabase].sort((a, b) => b.rating - a.rating).slice(0, 15),
    romance: fullAnimeDatabase.filter(a => a.genres.includes("Romance")).slice(0, 15),
    action: fullAnimeDatabase.filter(a => a.genres.includes("Action")).slice(0, 15),
    fantasy: fullAnimeDatabase.filter(a => a.genres.includes("Fantasy")).slice(0, 15)
  };
};
