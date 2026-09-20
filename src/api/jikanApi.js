// src/api/jikanApi.js - Jikan v4 REST API Client
import axios from 'axios';

const JIKAN_URL = 'https://api.jikan.moe/v4';

const jikanClient = axios.create({
  baseURL: JIKAN_URL,
  timeout: 12000
});

export const fetchJikanTopAnime = async (type = "", filter = "", page = 1, limit = 20) => {
  const params = { page, limit };
  if (type) params.type = type;
  if (filter) params.filter = filter;
  const response = await jikanClient.get('/top/anime', { params });
  return response.data?.data || [];
};

export const fetchJikanSearch = async (query, page = 1, limit = 20) => {
  const response = await jikanClient.get('/anime', {
    params: { q: query, page, limit, sfw: true }
  });
  return response.data?.data || [];
};

export const fetchJikanDetails = async (id) => {
  const response = await jikanClient.get(`/anime/${id}/full`);
  return response.data?.data || null;
};

export const fetchJikanRecommendations = async (id) => {
  const response = await jikanClient.get(`/anime/${id}/recommendations`);
  return response.data?.data || [];
};

export const fetchJikanEpisodes = async (malId, page = 1) => {
  try {
    const response = await jikanClient.get(`/anime/${malId}/episodes`, {
      params: { page }
    });
    return response.data || { data: [], pagination: {} };
  } catch (err) {
    console.warn(`Jikan episodes fetch failed for MAL ID ${malId}:`, err.message);
    return { data: [], pagination: {} };
  }
};

export const fetchJikanStreaming = async (malId) => {
  try {
    const response = await jikanClient.get(`/anime/${malId}/streaming`);
    return response.data?.data || [];
  } catch (err) {
    console.warn(`Jikan streaming fetch failed for MAL ID ${malId}:`, err.message);
    return [];
  }
};

export const fetchJikanVideos = async (malId) => {
  try {
    const response = await jikanClient.get(`/anime/${malId}/videos`);
    return response.data?.data || null;
  } catch (err) {
    console.warn(`Jikan videos fetch failed for MAL ID ${malId}:`, err.message);
    return null;
  }
};

