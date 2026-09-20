// src/services/streamingService.js - Real 24-Min Full Episode Anime Streaming System
import { getMovieBoxStreamUrls } from '../api/consumetApi';
import { getAnimeWorldEpisodeUrl } from './animeWorldService';

/**
 * 5 Active High-Speed Streaming Servers for 24-Min Full Anime Episodes
 */
export const SERVERS = [
  {
    id: "vidsrc_in",
    name: "VidSrc Pro (24-Min Full Episode)",
    banglaName: "সার্ভার ১ — ভিডসোর্স প্রো (২৪ মিনিট ফুল এপিসোড)",
    type: "Full Episode 1080p",
    audio: "Original JP Sub / Multi-Sub",
    quality: "1080p 60FPS",
    badge: "FULL EPISODE",
    speed: "Master CDN — Instant",
    provider: "VidSrc IN Core"
  },
  {
    id: "vidsrc_to",
    name: "VidSrc TO (MovieBox Dual Audio)",
    banglaName: "সার্ভার ২ — মুভিবক্স ডুয়াল অডিও",
    type: "Dual Audio (JP/EN)",
    audio: "Dual Audio Sub/Dub",
    quality: "Full HD 1080p",
    badge: "DUAL AUDIO",
    speed: "Fast CDN",
    provider: "VidSrc TO Engine"
  },
  {
    id: "vidsrc_me",
    name: "VidSrc ME (Buffer-Free)",
    banglaName: "সার্ভার ৩ — ভিডসোর্স মি (বাফার-ফ্রি)",
    type: "1080p HD Stream",
    audio: "Sub & Dub Fast Stream",
    quality: "1080p / 720p HD",
    badge: "NO BUFFER",
    speed: "Global Edge CDN",
    provider: "VidSrc ME"
  },
  {
    id: "embed_2cc",
    name: "2Embed HD (Ultra Fast)",
    banglaName: "সার্ভার ৪ — ২-এমবেড এইচডি (আল্ট্রা ফাস্ট)",
    type: "Fast Subbed Stream",
    audio: "Original Subbed",
    quality: "1080p HD",
    badge: "ULTRA FAST",
    speed: "Cloudflare CDN",
    provider: "2Embed CC"
  },
  {
    id: "aw-stream",
    name: "AnimeWorld (Hindi/Eng/Ben Dub)",
    banglaName: "সার্ভার ৫ — হিন্দি ও বাংলা ডাব স্পেশাল",
    type: "Hindi & English Dub",
    audio: "Hindi, Eng, Ben Audio",
    quality: "Full HD 1080p",
    badge: "HINDI / DUB",
    speed: "Fast South-Asia CDN",
    provider: "AnimeWorld India"
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
export const getStreamUrlForEpisode = (malId, episodeNum = 1, serverId = "vidsrc_in", title = "", season = 1, anime = null) => {
  const ep = Number(episodeNum) || 1;

  if (serverId === "aw-stream") {
    return getAnimeWorldEpisodeUrl(title, ep, season);
  }

  const streamMap = getMovieBoxStreamUrls(malId, ep, title, season);
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
    downloadUrl: `https://vidsrc.in/embed/tv/1429/1/${episodeNum}`
  };
};
