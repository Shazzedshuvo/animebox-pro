// src/services/tmdbMapping.js - Anime to TMDB ID Mapping for VidSrc & MovieBox Streaming Engines

export const ANIME_TMDB_MAP = {
  // Popular Anime TMDB TV IDs
  'jujutsu kaisen': 95479,
  'jujutsu kaisen season 2': 95479,
  'demon slayer': 85937,
  'demon slayer: kimetsu no yaiba': 85937,
  'attack on titan': 1429,
  'shingeki no kyojin': 1429,
  'solo leveling': 209867,
  'naruto': 46260,
  'naruto shippuden': 31910,
  'one piece': 37854,
  'death note': 13916,
  'bleach': 30984,
  'bleach: thousand-year blood war': 214999,
  'chainsaw man': 114410,
  'my hero academia': 65930,
  'boku no hero academia': 65930,
  'tokyo ghoul': 61374,
  'hunter x hunter': 46298,
  'hunter x hunter (2011)': 46298,
  'spy x family': 120089,
  'vinland saga': 89502,
  'black clover': 73223,
  'blue lock': 124800,
  'kaiju no. 8': 209117,
  'fullmetal alchemist: brotherhood': 31911,
  'dragon ball z': 12971,
  'dragon ball super': 62710,
  'dragon ball daima': 236528,
  'mashle': 209088,
  'mashle: magic and muscles': 209088,
  'hell\'s paradise': 114479,
  'jigokuraku': 114479,
  'frieren': 209867,
  'frieren: beyond journey\'s end': 209867,
  'wind breaker': 222479,
  'dandadan': 240411,
  'dr. stone': 86031,
  'dr. stone: new world': 86031,
  'sword art online': 45782,
  'overlord': 64196,
  're:zero': 65942,
  're:zero - starting life in another world': 65942,
  'mushoku tensei': 99581,
  'mushoku tensei: jobless reincarnation': 99581,
  'classroom of the elite': 72636,
  'mob psycho 100': 67070,
  'one punch man': 63926,
  'haikyu!!': 60863,
  'haikyuu': 60863,
  'cyberpunk: edgerunners': 105248,
  'oshi no ko': 203737,
  'tokyo revengers': 116753,
  'vinland saga season 2': 89502,
  'steins;gate': 42009,
  'cowboy bebop': 2996,
  'neon genesis evangelion': 890,
  'code geass': 32415
};

/**
 * Resolves TMDB ID for an anime title
 */
export const getTmdbIdForAnime = (title = '', malId = 20) => {
  if (!title) return 95479; // fallback Jujutsu Kaisen
  const clean = title.toLowerCase().trim();

  // 1. Direct match
  if (ANIME_TMDB_MAP[clean]) return ANIME_TMDB_MAP[clean];

  // 2. Partial match
  for (const [key, id] of Object.entries(ANIME_TMDB_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return id;
    }
  }

  // 3. Fallback default
  return malId || 95479;
};
