// src/api/anilistApi.js - Official AniList GraphQL API Client
import axios from 'axios';

const ANILIST_URL = 'https://graphql.anilist.co';

const anilistClient = axios.create({
  baseURL: ANILIST_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

const MEDIA_FIELDS = `
  id
  idMal
  title {
    romaji
    english
    native
  }
  description(asHtml: false)
  bannerImage
  coverImage {
    extraLarge
    large
    medium
    color
  }
  averageScore
  popularity
  trending
  episodes
  duration
  genres
  seasonYear
  season
  status
  format
  studios(isMain: true) {
    nodes {
      name
    }
  }
  trailer {
    id
    site
  }
`;

const BROWSE_QUERY = `
query ($page: Int, $perPage: Int, $sort: [MediaSort], $genre: String, $search: String, $format: MediaFormat, $status: MediaStatus, $season: MediaSeason, $seasonYear: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      hasNextPage
    }
    media(
      type: ANIME,
      isAdult: false,
      sort: $sort,
      genre: $genre,
      search: $search,
      format: $format,
      status: $status,
      season: $season,
      seasonYear: $seasonYear
    ) {
      ${MEDIA_FIELDS}
    }
  }
}
`;

const DETAILS_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    ${MEDIA_FIELDS}
    streamingEpisodes {
      title
      thumbnail
      url
      site
    }
    externalLinks {
      id
      url
      site
      type
      icon
      color
    }
    recommendations(perPage: 10, sort: RATING_DESC) {
      nodes {
        mediaRecommendation {
          ${MEDIA_FIELDS}
        }
      }
    }
    characters(perPage: 8, role: MAIN) {
      nodes {
        id
        name {
          full
          native
        }
        image {
          large
          medium
        }
      }
    }
  }
}
`;

export const fetchAniListBrowse = async (variables = {}) => {
  const { page = 1, perPage = 20, sort = ["TRENDING_DESC"], ...rest } = variables;
  const response = await anilistClient.post('', {
    query: BROWSE_QUERY,
    variables: { page, perPage, sort, ...rest }
  });
  return response.data?.data?.Page?.media || [];
};

export const fetchAniListDetails = async (id) => {
  const response = await anilistClient.post('', {
    query: DETAILS_QUERY,
    variables: { id: parseInt(id, 10) }
  });
  return response.data?.data?.Media || null;
};
