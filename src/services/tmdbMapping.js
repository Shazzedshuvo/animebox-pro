// src/services/tmdbMapping.js - Anime to TMDB ID Mapping for Series & Blockbuster Movies

export const ANIME_TMDB_MAP = {
  // Blockbuster Anime Movies
  'your name': { id: 372058, isMovie: true },
  'kimi no na wa': { id: 372058, isMovie: true },
  'demon slayer: mugen train': { id: 635302, isMovie: true },
  'demon slayer the movie: mugen train': { id: 635302, isMovie: true },
  'kimetsu no yaiba movie: mugen ressha-hen': { id: 635302, isMovie: true },
  'jujutsu kaisen 0': { id: 810693, isMovie: true },
  'jujutsu kaisen 0 movie': { id: 810693, isMovie: true },
  'a silent voice': { id: 378064, isMovie: true },
  'koe no katachi': { id: 378064, isMovie: true },
  'spirited away': { id: 129, isMovie: true },
  'sen to chihiro no kamikakushi': { id: 129, isMovie: true },
  'suzume': { id: 916224, isMovie: true },
  'suzume no tojimari': { id: 916224, isMovie: true },
  'weathering with you': { id: 568160, isMovie: true },
  'tenki no ko': { id: 568160, isMovie: true },
  'howl\'s moving castle': { id: 4935, isMovie: true },
  'princess mononoke': { id: 128, isMovie: true },
  'one piece film: red': { id: 900667, isMovie: true },
  'one piece film red': { id: 900667, isMovie: true },
  'dragon ball super: super hero': { id: 610150, isMovie: true },
  'dragon ball super: broly': { id: 503919, isMovie: true },
  'the boy and the heron': { id: 508883, isMovie: true },
  'kimitachi wa dou ikiru ka': { id: 508883, isMovie: true },
  'akira': { id: 149, isMovie: true },
  'i want to eat your pancreas': { id: 504253, isMovie: true },
  'grave of the fireflies': { id: 12477, isMovie: true },
  'my neighbor totoro': { id: 8392, isMovie: true },
  'the garden of words': { id: 198370, isMovie: true },
  '5 centimeters per second': { id: 38142, isMovie: true },
  'look back': { id: 1241982, isMovie: true },

  // TV Series
  'jujutsu kaisen': { id: 95479, isMovie: false },
  'jujutsu kaisen season 2': { id: 95479, isMovie: false },
  'demon slayer': { id: 85937, isMovie: false },
  'demon slayer: kimetsu no yaiba': { id: 85937, isMovie: false },
  'attack on titan': { id: 1429, isMovie: false },
  'shingeki no kyojin': { id: 1429, isMovie: false },
  'solo leveling': { id: 209867, isMovie: false },
  'naruto': { id: 46260, isMovie: false },
  'naruto shippuden': { id: 31910, isMovie: false },
  'one piece': { id: 37854, isMovie: false },
  'death note': { id: 13916, isMovie: false },
  'bleach': { id: 30984, isMovie: false },
  'bleach: thousand-year blood war': { id: 214999, isMovie: false },
  'chainsaw man': { id: 114410, isMovie: false },
  'my hero academia': { id: 65930, isMovie: false },
  'boku no hero academia': { id: 65930, isMovie: false },
  'tokyo ghoul': { id: 61374, isMovie: false },
  'hunter x hunter': { id: 46298, isMovie: false },
  'hunter x hunter (2011)': { id: 46298, isMovie: false },
  'spy x family': { id: 120089, isMovie: false },
  'vinland saga': { id: 89502, isMovie: false },
  'black clover': { id: 73223, isMovie: false },
  'blue lock': { id: 124800, isMovie: false },
  'kaiju no. 8': { id: 209117, isMovie: false },
  'fullmetal alchemist: brotherhood': { id: 31911, isMovie: false },
  'dragon ball z': { id: 12971, isMovie: false },
  'dragon ball super': { id: 62710, isMovie: false },
  'dragon ball daima': { id: 236528, isMovie: false },
  'mashle': { id: 209088, isMovie: false },
  'mashle: magic and muscles': { id: 209088, isMovie: false },
  'hell\'s paradise': { id: 114479, isMovie: false },
  'jigokuraku': { id: 114479, isMovie: false },
  'frieren': { id: 209867, isMovie: false },
  'frieren: beyond journey\'s end': { id: 209867, isMovie: false },
  'wind breaker': { id: 222479, isMovie: false },
  'dandadan': { id: 240411, isMovie: false },
  'dr. stone': { id: 86031, isMovie: false },
  'dr. stone: new world': { id: 86031, isMovie: false },
  'sword art online': { id: 45782, isMovie: false },
  'overlord': { id: 64196, isMovie: false },
  're:zero': { id: 65942, isMovie: false },
  're:zero - starting life in another world': { id: 65942, isMovie: false },
  'mushoku tensei': { id: 99581, isMovie: false },
  'mushoku tensei: jobless reincarnation': { id: 99581, isMovie: false },
  'classroom of the elite': { id: 72636, isMovie: false },
  'mob psycho 100': { id: 67070, isMovie: false },
  'one punch man': { id: 63926, isMovie: false },
  'haikyu!!': { id: 60863, isMovie: false },
  'haikyuu': { id: 60863, isMovie: false },
  'cyberpunk: edgerunners': { id: 105248, isMovie: false },
  'oshi no ko': { id: 203737, isMovie: false },
  'tokyo revengers': { id: 116753, isMovie: false },
  'vinland saga season 2': { id: 89502, isMovie: false },
  'steins;gate': { id: 42009, isMovie: false },
  'cowboy bebop': { id: 2996, isMovie: false },
  'neon genesis evangelion': { id: 890, isMovie: false },
  'code geass': { id: 32415, isMovie: false }
};

/**
 * Resolves TMDB ID & Media Type for an anime title
 */
export const getTmdbInfoForAnime = (title = '', malId = 20, isMovieHint = false) => {
  if (!title) return { id: 95479, isMovie: false };
  const clean = title.toLowerCase().trim();

  // 1. Direct match
  if (ANIME_TMDB_MAP[clean]) return ANIME_TMDB_MAP[clean];

  // 2. Partial match
  for (const [key, info] of Object.entries(ANIME_TMDB_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return info;
    }
  }

  // 3. Fallback default
  return { id: malId || 95479, isMovie: isMovieHint };
};
