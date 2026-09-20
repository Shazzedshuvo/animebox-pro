// src/services/animeWorldService.js - AnimeWorld India (watchanimeworld.one) API & Stream Integration

const ANIMEWORLD_BASE = 'https://watchanimeworld.one';

// Slug mapper for popular anime titles to watchanimeworld slugs
const SLUG_MAP = {
  'naruto': 'naruto',
  'naruto shippuden': 'naruto-shippuden',
  'one piece': 'one-piece',
  'jujutsu kaisen': 'jujutsu-kaisen',
  'demon slayer': 'demon-slayer-kimetsu-no-yaiba',
  'demon slayer: kimetsu no yaiba': 'demon-slayer-kimetsu-no-yaiba',
  'attack on titan': 'attack-on-titan',
  'solo leveling': 'solo-leveling',
  'dragon ball super': 'dragon-ball-super',
  'dragon ball z': 'dragon-ball-z',
  'chainsaw man': 'chainsaw-man',
  'death note': 'death-note',
  'bleach': 'bleach',
  'bleach: thousand-year blood war': 'bleach-thousand-year-blood-war',
  'my hero academia': 'my-hero-academia',
  'black clover': 'black-clover',
  'spy x family': 'spy-x-family',
  'tokyo ghoul': 'tokyo-ghoul',
  'hunter x hunter': 'hunter-x-hunter',
  'vinland saga': 'vinland-saga',
  'haikyuu': 'haikyu',
  'haikyu!!': 'haikyu',
  'fullmetal alchemist: brotherhood': 'fullmetal-alchemist-brotherhood',
  'blue lock': 'blue-lock',
  'kaiju no. 8': 'kaiju-no-8',
  'mashle': 'mashle-magic-and-muscles'
};

/**
 * Gets the anime world slug for a title
 */
export const getAnimeWorldSlug = (title = '') => {
  if (!title) return 'naruto';
  const clean = title.toLowerCase().trim();
  if (SLUG_MAP[clean]) return SLUG_MAP[clean];

  for (const [key, slug] of Object.entries(SLUG_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return slug;
    }
  }

  return clean
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Builds direct episode link for watchanimeworld.one
 */
export const getAnimeWorldEpisodeUrl = (title, episodeNumber = 1, season = 1) => {
  const slug = getAnimeWorldSlug(title);
  return `${ANIMEWORLD_BASE}/episode/${slug}-${season}x${episodeNumber}/`;
};

/**
 * Builds series page link for watchanimeworld.one
 */
export const getAnimeWorldSeriesUrl = (title) => {
  const slug = getAnimeWorldSlug(title);
  return `${ANIMEWORLD_BASE}/series/${slug}/`;
};

/**
 * AnimeWorld Streaming Servers
 */
export const ANIMEWORLD_SERVERS = [
  {
    id: 'aw-multicloud',
    name: 'AnimeWorld MultiCloud',
    banglaName: 'এনিমেওয়ার্ল্ড মাল্টিক্লাউড',
    audio: 'Hindi / Bengali / English / Japanese',
    type: 'Multi-Audio Fast CDN',
    badge: 'HINDI / BEN / ENG'
  },
  {
    id: 'aw-abyss',
    name: 'AnimeWorld Abyss',
    banglaName: 'এনিমেওয়ার্ল্ড অ্যাবিস',
    audio: 'Hindi / English Dub',
    type: 'Ultra HD 1080p',
    badge: '1080p DUB'
  },
  {
    id: 'aw-direct',
    name: 'Official Stream / PV',
    banglaName: 'অফিসিয়াল স্ট্রিম / প্রিভিউ',
    audio: 'Original Japanese HD',
    type: 'Official Channel',
    badge: 'OFFICIAL'
  }
];
