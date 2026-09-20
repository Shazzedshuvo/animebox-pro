// src/services/streamingService.js - Real Anime Streaming & Multi-Server Architecture
import { getMovieBoxStreamUrls } from '../api/consumetApi';

/**
 * 5-Tier High Speed Streaming Servers for MovieBox Experience
 */
export const SERVERS = [
  {
    id: "vidcloud",
    name: "VidCloud Ultra HD",
    banglaName: "সার্ভার ১ — ভিডক্লাউড আল্ট্রা HD (১০৮০p)",
    type: "Japanese Sub / Eng Dub",
    audio: "Original JP Sub / Multi-Sub",
    quality: "1080p 60FPS",
    badge: "1080p ULTRA",
    speed: "Master CDN — <20ms",
    provider: "HiAnime / Zoro Core"
  },
  {
    id: "gogostream",
    name: "GogoStream Pro",
    banglaName: "সার্ভার ২ — গোগো-স্ট্রিম প্রো (ফাস্ট সাব)",
    type: "English Sub & Dub",
    audio: "Sub & Dub Fast Stream",
    quality: "1080p / 720p HD",
    badge: "FAST SUB/DUB",
    speed: "Ultra CDN — <30ms",
    provider: "GogoAnime Core"
  },
  {
    id: "vidsrc",
    name: "VidSrc MovieBox VIP",
    banglaName: "সার্ভার ৩ — মুভিবক্স ভিআইপি (ডুয়াল অডিও)",
    type: "Dual Audio Sub/Dub",
    audio: "Dual Audio (JP/EN)",
    quality: "Auto 1080p Adaptive",
    badge: "MOVIEBOX VIP",
    speed: "Buffer-Free Global",
    provider: "MovieBox Core"
  },
  {
    id: "autoembed",
    name: "AutoEmbed Cloud",
    banglaName: "সার্ভার ৪ — অটো-এমবেড ক্লাউড (নো-ল্যাগ)",
    type: "Adaptive Stream",
    audio: "Multi-Language Sub",
    quality: "Full HD 1080p",
    badge: "NO-LAG 1080p",
    speed: "Edge CDN — Instant",
    provider: "AutoEmbed Network"
  },
  {
    id: "multidub",
    name: "AnimeWorld Multi-Dub",
    banglaName: "সার্ভার ৫ — হিন্দি ও বাংলা ডাব স্পেশাল",
    type: "Hindi / English / Bengali Dub",
    audio: "Hindi, Eng, Ben Audio",
    quality: "1080p HD Dub",
    badge: "HINDI / DUB",
    speed: "South-Asia CDN",
    provider: "AnimeWorld MultiCloud"
  }
];

export const SUBTITLES_TRACKS = [
  { id: "off", label: "Off", banglaLabel: "বন্ধ" },
  { id: "en", label: "English", banglaLabel: "ইংরেজি", flag: "🇺🇸" },
  { id: "bn", label: "বাংলা (Bengali)", banglaLabel: "বাংলা", flag: "🇧🇩" },
  { id: "hi", label: "हिन्दी (Hindi)", banglaLabel: "হিন্দি", flag: "🇮🇳" },
  { id: "jp", label: "日本語 (Japanese)", banglaLabel: "জাপানি", flag: "🇯🇵" }
];

/**
 * Returns stream URL for a given server and episode
 */
export const getStreamUrlForEpisode = (malId, episodeNum = 1, serverId = "vidcloud", title = "") => {
  const streamMap = getMovieBoxStreamUrls(malId, episodeNum, title);
  return streamMap[serverId] || streamMap.vidcloud;
};

/**
 * Generates download package info
 */
export const generateDownloadInfo = (animeTitle, episodeNum, quality = "1080p", audio = "Original Sub") => {
  let sizeMb = 450;
  if (quality === "480p") sizeMb = 180;
  else if (quality === "720p") sizeMb = 280;
  else if (quality === "1080p") sizeMb = 550;

  const safeTitle = (animeTitle || "Anime").replace(/[^a-zA-Z0-9]/g, '_');

  return {
    fileName: `ANIMEBOX_${safeTitle}_EP${episodeNum}_${quality}_${audio.replace(/\s+/g, '')}.mp4`,
    fileSize: `${sizeMb} MB`,
    quality,
    audio,
    downloadUrl: `https://vidsrc.cc/v2/embed/anime/${safeTitle}/${episodeNum}`
  };
};
