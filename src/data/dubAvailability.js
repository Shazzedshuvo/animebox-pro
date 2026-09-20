// src/data/dubAvailability.js - Confirmed & Demo Dub Mapping Matrix

export const dubAvailabilityMap = {
  // Keyed by MAL ID or AniList ID or lowercase title keyword
  "solo leveling": { english: true, hindi: true, japanese: true },
  "demon slayer": { english: true, hindi: true, japanese: true },
  "kimetsu no yaiba": { english: true, hindi: true, japanese: true },
  "jujutsu kaisen": { english: true, hindi: true, japanese: true },
  "attack on titan": { english: true, hindi: true, japanese: true },
  "shingeki no kyojin": { english: true, hindi: true, japanese: true },
  "one piece": { english: true, hindi: true, japanese: true },
  "naruto": { english: true, hindi: true, japanese: true },
  "naruto shippuden": { english: true, hindi: true, japanese: true },
  "dragon ball": { english: true, hindi: true, japanese: true },
  "dragon ball super": { english: true, hindi: true, japanese: true },
  "dragon ball z": { english: true, hindi: true, japanese: true },
  "chainsaw man": { english: true, hindi: true, japanese: true },
  "frieren": { english: true, hindi: true, japanese: true },
  "my hero academia": { english: true, hindi: true, japanese: true },
  "black clover": { english: true, hindi: true, japanese: true },
  "bleach": { english: true, hindi: true, japanese: true },
  "death note": { english: true, hindi: true, japanese: true },
  "tokyo ghoul": { english: true, hindi: true, japanese: true },
  "hunter x hunter": { english: true, hindi: true, japanese: true },
  "spy x family": { english: true, hindi: true, japanese: true },
  "blue lock": { english: true, hindi: true, japanese: true },
  "haikyuu": { english: true, hindi: true, japanese: true },
  "vinland saga": { english: true, hindi: true, japanese: true },
  "your name": { english: true, hindi: true, japanese: true },
  "suzume": { english: true, hindi: true, japanese: true }
};

export const getDubInfo = (title = "", genres = []) => {
  const t = title.toLowerCase();
  for (const [key, val] of Object.entries(dubAvailabilityMap)) {
    if (t.includes(key)) {
      return val;
    }
  }
  // Default fallback
  return {
    english: true,
    hindi: false,
    japanese: true
  };
};

export const getAudioBadges = (title = "") => {
  const dub = getDubInfo(title);
  const badges = ["Sub"];
  if (dub.english) badges.push("English Dub");
  if (dub.hindi) badges.push("Hindi Dub");
  return badges;
};
