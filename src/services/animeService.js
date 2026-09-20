import { fetchAniListBrowse, fetchAniListDetails } from '../api/anilistApi';
import { 
  fetchJikanTopAnime, 
  fetchJikanSearch, 
  fetchJikanDetails, 
  fetchJikanRecommendations, 
  fetchJikanEpisodes, 
  fetchJikanStreaming, 
  fetchJikanVideos 
} from '../api/jikanApi';
import { fallbackAnimeList } from '../data/fallbackAnime';
import { getDubInfo, getAudioBadges } from '../data/dubAvailability';
import { formatRating, formatDuration } from '../utils/formatters';

let isUsingFallbackData = false;

export const getIsUsingFallback = () => isUsingFallbackData;

/**
 * Generates dynamic fallback episodes array if API provides count but no item list
 */
export const generateEpisodeList = (totalCount, baseAnime, jikanEpisodes = [], streamingEpisodes = []) => {
  const count = Math.max(1, Math.min(totalCount || 12, 1200));
  const jikanMap = new Map();
  if (Array.isArray(jikanEpisodes)) {
    jikanEpisodes.forEach(ep => {
      if (ep && ep.mal_id) jikanMap.set(ep.mal_id, ep);
    });
  }

  const streamMap = new Map();
  if (Array.isArray(streamingEpisodes)) {
    streamingEpisodes.forEach((s, idx) => {
      if (s) streamMap.set(idx + 1, s);
    });
  }

  const list = [];
  for (let i = 1; i <= count; i++) {
    const jEp = jikanMap.get(i);
    const sEp = streamMap.get(i);

    const title = jEp?.title || sEp?.title || `Episode ${i}`;
    const banglaTitle = `এপিসোড ${i}`;
    const thumbnail = sEp?.thumbnail || baseAnime.bannerImage || baseAnime.posterImage;
    const aired = jEp?.aired ? new Date(jEp.aired).toLocaleDateString() : null;
    const isFiller = Boolean(jEp?.filler);

    list.push({
      episodeNumber: i,
      title: title,
      banglaTitle: banglaTitle,
      japaneseTitle: jEp?.title_japanese || "",
      thumbnail: thumbnail,
      duration: "24m",
      aired: aired,
      isFiller: isFiller,
      score: jEp?.score || null,
      officialUrl: sEp?.url || null,
      site: sEp?.site || null
    });
  }

  return list;
};

/**
 * Normalizes AniList GraphQL Media Object
 */
export const normalizeAniList = (media) => {
  if (!media) return null;

  const engTitle = media.title?.english || media.title?.romaji || media.title?.native || "Anime Title";
  const native = media.title?.native || "";
  const score = media.averageScore ? (media.averageScore / 10).toFixed(1) : "8.5";
  const year = media.seasonYear || media.startDate?.year || 2024;
  const isMovie = media.format === "MOVIE";
  const eps = isMovie ? 1 : (media.episodes || 12);
  const poster = media.coverImage?.large || media.coverImage?.medium || "https://images.weserv.nl/?url=https://cdn.myanimelist.net/images/anime/1170/124305l.jpg&w=600&h=900&fit=cover";
  const largePoster = media.coverImage?.extraLarge || poster;
  const banner = media.bannerImage || largePoster;
  const cleanDesc = (media.description || "Exciting anime series full of thrilling battles and deep emotional journeys.")
    .replace(/<[^>]*>?/gm, '');

  const dubInfo = getDubInfo(engTitle);
  const audioTypes = getAudioBadges(engTitle);

  // Extract official streaming external links
  const officialStreams = [];
  if (Array.isArray(media.externalLinks)) {
    media.externalLinks.forEach(link => {
      if (link && link.url && (link.type === 'STREAMING' || ['Crunchyroll', 'Netflix', 'Hulu', 'YouTube', 'Bilibili', 'Disney Plus', 'Funimation', 'VRV', 'HIDIVE'].includes(link.site))) {
        officialStreams.push({
          name: link.site,
          url: link.url,
          icon: link.icon || null,
          color: link.color || '#e50914'
        });
      }
    });
  }

  return {
    id: media.id,
    malId: media.idMal || media.id,
    title: engTitle,
    englishTitle: media.title?.english || engTitle,
    nativeTitle: native,
    banglaTitle: engTitle,
    description: cleanDesc,
    banglaDescription: `${engTitle} এর টানটান উত্তেজনাপূর্ণ কাহিনী এবং চমৎকার এনিমেশন উপভোগ করুন এনিমেবক্স-এ।`,
    posterImage: poster,
    largePosterImage: largePoster,
    bannerImage: banner,
    genres: media.genres?.length ? media.genres : ["Action", "Adventure"],
    rating: parseFloat(score),
    popularity: media.popularity || 90,
    releaseYear: year,
    season: media.season || "WINTER",
    status: media.status === "FINISHED" ? "Completed" : "Ongoing",
    format: media.format || "TV",
    type: isMovie ? "Movie" : (media.format === "OVA" ? "OVA" : "TV Series"),
    totalEpisodes: eps,
    duration: formatDuration(media.duration, media.format),
    studios: media.studios?.nodes?.map(s => s.name) || ["Anime Studio"],
    trailer: media.trailer?.site === "youtube" ? { id: media.trailer.id, site: "youtube" } : null,
    audioTypes,
    isDubbed: dubInfo.english || dubInfo.hindi,
    officialStreams,
    streamingEpisodes: media.streamingEpisodes || []
  };
};

/**
 * Normalizes Jikan REST API Anime Object
 */
export const normalizeJikan = (item) => {
  if (!item) return null;

  const engTitle = item.title_english || item.title || "Anime Title";
  const score = item.score ? item.score.toFixed(1) : "8.4";
  const isMovie = item.type === "Movie";
  const eps = isMovie ? 1 : (item.episodes || 12);
  const poster = item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || "https://images.weserv.nl/?url=https://cdn.myanimelist.net/images/anime/1170/124305l.jpg&w=600&h=900&fit=cover";
  const banner = poster;
  const cleanDesc = (item.synopsis || "Exciting anime series full of thrilling battles.")
    .replace(/\[Written by MAL Rewrite\]/g, '');

  const dubInfo = getDubInfo(engTitle);
  const audioTypes = getAudioBadges(engTitle);

  return {
    id: item.mal_id,
    malId: item.mal_id,
    title: engTitle,
    englishTitle: engTitle,
    nativeTitle: item.title_japanese || "",
    banglaTitle: engTitle,
    description: cleanDesc,
    banglaDescription: `${engTitle} এর টানটান উত্তেজনাপূর্ণ কাহিনী উপভোগ করুন এনিমেবক্স-এ।`,
    posterImage: poster,
    largePosterImage: poster,
    bannerImage: banner,
    genres: item.genres?.map(g => g.name) || ["Action"],
    rating: parseFloat(score),
    popularity: item.popularity || 85,
    releaseYear: item.year || (item.aired?.from ? new Date(item.aired.from).getFullYear() : 2023),
    season: item.season ? item.season.toUpperCase() : "FALL",
    status: item.status === "Finished Airing" ? "Completed" : "Ongoing",
    format: item.type === "Movie" ? "MOVIE" : "TV",
    type: item.type === "Movie" ? "Movie" : "TV Series",
    totalEpisodes: eps,
    duration: item.duration || "24m",
    studios: item.studios?.map(s => s.name) || ["Studio"],
    trailer: item.trailer?.youtube_id ? { id: item.trailer.youtube_id, site: "youtube" } : null,
    audioTypes,
    isDubbed: dubInfo.english || dubInfo.hindi,
    officialStreams: []
  };
};

/**
 * High-res Hero Featured Anime (6-8 items)
 */
export const getHeroFeaturedAnime = async () => {
  try {
    const list = await fetchAniListBrowse({ sort: ["TRENDING_DESC", "POPULARITY_DESC"], perPage: 8 });
    if (list && list.length > 0) {
      isUsingFallbackData = false;
      return list.map(normalizeAniList);
    }
  } catch (err) {
    console.warn("AniList hero fetch failed, trying Jikan fallback:", err.message);
  }

  try {
    const jikanList = await fetchJikanTopAnime("", "airing", 1, 8);
    if (jikanList && jikanList.length > 0) {
      isUsingFallbackData = false;
      return jikanList.map(normalizeJikan);
    }
  } catch (err) {
    console.warn("Jikan hero fetch failed, using local fallback:", err.message);
  }

  isUsingFallbackData = true;
  return fallbackAnimeList.slice(0, 8);
};

/**
 * Trending Anime
 */
export const getTrendingAnime = async () => {
  try {
    const list = await fetchAniListBrowse({ sort: ["TRENDING_DESC"], perPage: 16 });
    if (list && list.length > 0) return list.map(normalizeAniList);
  } catch (e) {
    console.warn("Trending fetch failed:", e.message);
  }
  return fallbackAnimeList;
};

/**
 * Popular Anime
 */
export const getPopularAnime = async () => {
  try {
    const list = await fetchAniListBrowse({ sort: ["POPULARITY_DESC"], perPage: 16 });
    if (list && list.length > 0) return list.map(normalizeAniList);
  } catch (e) {
    console.warn("Popular fetch failed:", e.message);
  }
  return fallbackAnimeList;
};

/**
 * Top Rated Anime
 */
export const getTopRatedAnime = async () => {
  try {
    const list = await fetchAniListBrowse({ sort: ["SCORE_DESC"], perPage: 16 });
    if (list && list.length > 0) return list.map(normalizeAniList);
  } catch (e) {
    console.warn("Top rated fetch failed:", e.message);
  }
  return [...fallbackAnimeList].sort((a, b) => b.rating - a.rating);
};

/**
 * Latest / Seasonal Releases
 */
export const getLatestAnime = async () => {
  try {
    const list = await fetchAniListBrowse({ sort: ["START_DATE_DESC"], perPage: 16, seasonYear: 2024 });
    if (list && list.length > 0) return list.map(normalizeAniList);
  } catch (e) {
    console.warn("Latest releases fetch failed:", e.message);
  }
  return fallbackAnimeList.filter(a => a.releaseYear >= 2023);
};

/**
 * Anime Blockbuster Movies
 */
export const getAnimeMovies = async () => {
  try {
    const list = await fetchAniListBrowse({ format: "MOVIE", sort: ["POPULARITY_DESC"], perPage: 16 });
    if (list && list.length > 0) return list.map(normalizeAniList);
  } catch (e) {
    console.warn("Anime movies fetch failed:", e.message);
  }
  return fallbackAnimeList.filter(a => a.type === "Movie" || a.format === "MOVIE");
};

/**
 * Popular TV Series
 */
export const getAnimeSeries = async () => {
  try {
    const list = await fetchAniListBrowse({ format: "TV", sort: ["POPULARITY_DESC"], perPage: 16 });
    if (list && list.length > 0) return list.map(normalizeAniList);
  } catch (e) {
    console.warn("Anime series fetch failed:", e.message);
  }
  return fallbackAnimeList.filter(a => a.type === "TV Series" || a.format === "TV");
};

/**
 * Anime by Specific Genre
 */
export const getAnimeByGenre = async (genre, perPage = 16) => {
  try {
    const list = await fetchAniListBrowse({ genre, sort: ["SCORE_DESC"], perPage });
    if (list && list.length > 0) return list.map(normalizeAniList);
  } catch (e) {
    console.warn(`Genre fetch for ${genre} failed:`, e.message);
  }
  return fallbackAnimeList.filter(a => a.genres.includes(genre));
};

/**
 * Dubbed Anime (Hindi Dub / English Dub)
 */
export const getDubbedAnime = async (type = "Hindi Dub") => {
  try {
    const list = await fetchAniListBrowse({ sort: ["POPULARITY_DESC"], perPage: 30 });
    if (list && list.length > 0) {
      const normalized = list.map(normalizeAniList);
      const filtered = normalized.filter(a => a.audioTypes.includes(type));
      if (filtered.length > 0) return filtered;
    }
  } catch (e) {
    console.warn("Dubbed fetch failed:", e.message);
  }
  return fallbackAnimeList.filter(a => a.audioTypes.includes(type));
};

/**
 * Real-Time Search API
 */
export const searchAnime = async (query, perPage = 12) => {
  if (!query || !query.trim()) return [];

  try {
    const list = await fetchAniListBrowse({ search: query.trim(), perPage });
    if (list && list.length > 0) return list.map(normalizeAniList);
  } catch (err) {
    console.warn("AniList search failed, trying Jikan search:", err.message);
  }

  try {
    const jikanList = await fetchJikanSearch(query.trim(), 1, perPage);
    if (jikanList && jikanList.length > 0) return jikanList.map(normalizeJikan);
  } catch (err) {
    console.warn("Jikan search failed, falling back to local dataset:", err.message);
  }

  // Fallback search across local dataset
  const q = query.toLowerCase().trim();
  return fallbackAnimeList.filter(a => 
    a.title.toLowerCase().includes(q) ||
    a.englishTitle.toLowerCase().includes(q) ||
    a.genres.some(g => g.toLowerCase().includes(q))
  );
};

/**
 * Anime Details by ID (AniList -> Jikan -> Fallback)
 * Automatically fetches real episodes, official streaming links, characters, and videos!
 */
export const getAnimeDetails = async (id) => {
  const numericId = parseInt(id, 10);
  let normalizedAnime = null;
  let malId = numericId;

  // 1. Fetch from AniList
  try {
    const media = await fetchAniListDetails(numericId);
    if (media) {
      normalizedAnime = normalizeAniList(media);
      malId = media.idMal || numericId;

      if (media.recommendations?.nodes) {
        normalizedAnime.recommendations = media.recommendations.nodes
          .map(n => n.mediaRecommendation)
          .filter(Boolean)
          .map(normalizeAniList);
      }
      if (media.characters?.nodes) {
        normalizedAnime.characters = media.characters.nodes.map(c => ({
          id: c.id,
          name: c.name?.full || "Character",
          nativeName: c.name?.native || "",
          image: c.image?.large || c.image?.medium
        }));
      }
    }
  } catch (err) {
    console.warn(`AniList details failed for ID ${id}:`, err.message);
  }

  // 2. Fetch from Jikan if AniList wasn't found
  if (!normalizedAnime) {
    try {
      const jikanData = await fetchJikanDetails(numericId);
      if (jikanData) {
        normalizedAnime = normalizeJikan(jikanData);
        malId = jikanData.mal_id;
        const recs = await fetchJikanRecommendations(numericId);
        normalizedAnime.recommendations = recs.slice(0, 10).map(r => normalizeJikan(r.entry));
      }
    } catch (err) {
      console.warn(`Jikan details failed for ID ${id}:`, err.message);
    }
  }

  // 3. Fallback from local dataset
  if (!normalizedAnime) {
    const found = fallbackAnimeList.find(a => a.id === numericId || a.malId === numericId);
    normalizedAnime = found ? { ...found } : { ...fallbackAnimeList[0] };
    malId = normalizedAnime.malId || numericId;
  }

  // 4. Fetch Real Episodes & Official Streaming Links from Jikan / Official sources
  let jikanEpisodes = [];
  let jikanStreaming = [];
  let jikanVideos = null;

  try {
    const [epRes, streamRes, vidRes] = await Promise.allSettled([
      fetchJikanEpisodes(malId, 1),
      fetchJikanStreaming(malId),
      fetchJikanVideos(malId)
    ]);

    if (epRes.status === 'fulfilled' && epRes.value?.data) {
      jikanEpisodes = epRes.value.data;
    }
    if (streamRes.status === 'fulfilled' && Array.isArray(streamRes.value)) {
      jikanStreaming = streamRes.value;
    }
    if (vidRes.status === 'fulfilled' && vidRes.value) {
      jikanVideos = vidRes.value;
    }
  } catch (e) {
    console.warn("Jikan supplementary data error:", e.message);
  }

  // Combine official streaming links
  const mergedStreams = [...(normalizedAnime.officialStreams || [])];
  if (Array.isArray(jikanStreaming)) {
    jikanStreaming.forEach(st => {
      if (st && st.url && !mergedStreams.some(m => m.name?.toLowerCase() === st.name?.toLowerCase())) {
        mergedStreams.push({
          name: st.name,
          url: st.url,
          icon: null,
          color: '#e50914'
        });
      }
    });
  }

  // Add standard default official links if none exist
  if (mergedStreams.length === 0) {
    const encTitle = encodeURIComponent(normalizedAnime.title);
    mergedStreams.push(
      { name: 'Crunchyroll', url: `https://www.crunchyroll.com/search?q=${encTitle}`, color: '#ff6400' },
      { name: 'Netflix', url: `https://www.netflix.com/search?q=${encTitle}`, color: '#e50914' },
      { name: 'YouTube (Official Channel)', url: `https://www.youtube.com/results?search_query=${encTitle}+official+anime`, color: '#ff0000' }
    );
  }

  // Update trailer with promo video if not present
  if (!normalizedAnime.trailer && jikanVideos?.promo?.length > 0) {
    const p = jikanVideos.promo[0];
    if (p.trailer?.youtube_id) {
      normalizedAnime.trailer = { id: p.trailer.youtube_id, site: 'youtube' };
    }
  }

  // Attach promo videos list
  normalizedAnime.promoVideos = jikanVideos?.promo || [];
  normalizedAnime.officialStreams = mergedStreams;

  // Generate complete, accurate episodes list
  normalizedAnime.episodes = generateEpisodeList(
    normalizedAnime.totalEpisodes,
    normalizedAnime,
    jikanEpisodes,
    normalizedAnime.streamingEpisodes
  );

  return normalizedAnime;
};

