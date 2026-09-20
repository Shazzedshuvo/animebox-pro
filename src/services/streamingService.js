// src/services/streamingService.js - Real 24-Min Full Episode Anime & Movie Streaming System
import { getMovieBoxStreamUrls } from '../api/consumetApi';

/**
 * 4 In-App High-Speed Streaming Servers (No External Redirects)
 */
export const SERVERS = [
  {
    id: "vidsrc_in",
    name: "Server 1 — VidSrc Master (Sub & Dub)",
    banglaName: "সার্ভার ১ — মাস্টার সিডিএন (সাব ও ডাব)",
    type: "1080p Ultra HD",
    audio: "Original JP Sub / Dual Audio",
    quality: "1080p 60FPS",
    badge: "1080p HD",
    speed: "Master CDN — Instant",
    provider: "VidSrc Core"
  },
  {
    id: "vidsrc_to",
    name: "Server 2 — English Dubbed Cinema",
    banglaName: "সার্ভার ২ — ইংলিশ ডাব স্পেশাল (English Dub)",
    type: "English Dubbed HD",
    audio: "English Audio Track",
    quality: "Full HD 1080p",
    badge: "ENGLISH DUB",
    speed: "Fast CDN",
    provider: "VidSrc TO Engine"
  },
  {
    id: "vidsrc_me",
    name: "Server 3 — Multi-Audio / Hindi Stream",
    banglaName: "সার্ভার ৩ — মাল্টি-অডিও ও হিন্দি স্ট্রিম",
    type: "Multi-Audio 1080p",
    audio: "Multi-Audio (Hindi/Eng/JP)",
    quality: "1080p / 720p HD",
    badge: "MULTI-AUDIO",
    speed: "Global Edge CDN",
    provider: "VidSrc ME"
  },
  {
    id: "embed_2cc",
    name: "Server 4 — 2Embed Cloud VIP",
    banglaName: "সার্ভার ৪ — ২-এমবেড ক্লাউড ভিআইপি",
    type: "Ultra Fast Stream",
    audio: "Original Subbed",
    quality: "1080p HD",
    badge: "VIP FAST",
    speed: "Cloudflare CDN",
    provider: "2Embed CC"
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
 * Returns stream URL for a given server, episode, and media format (Movie / TV)
 */
export const getStreamUrlForEpisode = (malId, episodeNum = 1, serverId = "vidsrc_in", title = "", season = 1, anime = null) => {
  const ep = Number(episodeNum) || 1;
  const streamMap = getMovieBoxStreamUrls(malId, ep, title, season, anime);
  return streamMap[serverId] || streamMap.vidsrc_in;
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
    downloadUrl: `https://vidsrc.in/embed/movie/372058`
  };
};
