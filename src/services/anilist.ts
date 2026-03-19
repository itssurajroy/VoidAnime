import type { 
  AniListMedia, 
  AnilistCharacter, 
  AnilistRelated, 
  AnilistAiringSchedule,
  SearchResultsData 
} from "@/types";

const KENJITSU_API = 'https://kenjitsu-api.vercel.app/api';

/* =========================
   SEARCH (AniList via Kenjitsu)
========================= */

export const searchAniList = async (query: string, page: number = 1): Promise<{ status: number; data: SearchResultsData }> => {
  try {
    const res = await fetch(
      `${KENJITSU_API}/anilist/anime/search?q=${encodeURIComponent(query)}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) return { status: res.status, data: { animes: [], currentPage: 1, totalPages: 1, hasNextPage: false } };
    
    const json = await res.json();
    return { 
      status: 200, 
      data: {
        animes: json.data?.map((item: any) => ({
          id: item.anilistId?.toString() || '',
          name: item.title?.romaji || item.title?.english || '',
          poster: item.image || item.bannerImage || '',
          type: item.format || '',
          rating: item.score?.toString() || '',
          episodes: { sub: item.episodes || 0, dub: 0 }
        })) || [],
        currentPage: json.currentPage || 1,
        totalPages: json.lastPage || 1,
        hasNextPage: json.hasNextPage || false
      }
    };
  } catch (error) {
    console.error("AniList search error:", error);
    return { status: 500, data: { animes: [], currentPage: 1, totalPages: 1, hasNextPage: false } };
  }
};

/* =========================
   TOP ANIME (AniList via Kenjitsu)
========================= */

export const getTopAniList = async (
  category: 'airing' | 'trending' | 'upcoming' | 'rating' | 'popular' = 'popular',
  format: string = 'TV',
  page: number = 1
): Promise<{ status: number; data: SearchResultsData }> => {
  try {
    const res = await fetch(
      `${KENJITSU_API}/anilist/anime/top/${category}?format=${format}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) return { status: res.status, data: { animes: [], currentPage: 1, totalPages: 1, hasNextPage: false } };
    
    const json = await res.json();
    return { 
      status: 200, 
      data: {
        animes: json.data?.map((item: any) => ({
          id: item.anilistId?.toString() || '',
          name: item.title?.romaji || item.title?.english || '',
          poster: item.image || item.bannerImage || '',
          type: item.format || '',
          rating: item.score?.toString() || '',
          episodes: { sub: item.episodes || 0, dub: 0 }
        })) || [],
        currentPage: json.currentPage || 1,
        totalPages: json.lastPage || 1,
        hasNextPage: json.hasNextPage || false
      }
    };
  } catch (error) {
    console.error("AniList top anime error:", error);
    return { status: 500, data: { animes: [], currentPage: 1, totalPages: 1, hasNextPage: false } };
  }
};

/* =========================
   SEASONAL ANIME (AniList via Kenjitsu)
========================= */

export const getSeasonalAniList = async (
  season: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER',
  year: number,
  format: string = 'TV',
  page: number = 1
): Promise<{ status: number; data: SearchResultsData }> => {
  try {
    const res = await fetch(
      `${KENJITSU_API}/anilist/seasons/${season}/${year}?format=${format}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) return { status: res.status, data: { animes: [], currentPage: 1, totalPages: 1, hasNextPage: false } };
    
    const json = await res.json();
    return { 
      status: 200, 
      data: {
        animes: json.data?.map((item: any) => ({
          id: item.anilistId?.toString() || '',
          name: item.title?.romaji || item.title?.english || '',
          poster: item.image || item.bannerImage || '',
          type: item.format || '',
          rating: item.score?.toString() || '',
          episodes: { sub: item.episodes || 0, dub: 0 }
        })) || [],
        currentPage: json.currentPage || 1,
        totalPages: json.lastPage || 1,
        hasNextPage: json.hasNextPage || false
      }
    };
  } catch (error) {
    console.error("AniList seasonal error:", error);
    return { status: 500, data: { animes: [], currentPage: 1, totalPages: 1, hasNextPage: false } };
  }
};

/* =========================
   ANIME DETAILS (AniList via Kenjitsu)
========================= */

export const getAniListDetails = async (anilistId: number): Promise<{ status: number; data: AniListMedia | null }> => {
  try {
    const res = await fetch(
      `${KENJITSU_API}/anilist/anime/${anilistId}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) return { status: res.status, data: null };
    
    const json = await res.json();
    return { 
      status: 200, 
      data: json.data || null
    };
  } catch (error) {
    console.error("AniList details error:", error);
    return { status: 500, data: null };
  }
};

/* =========================
   CHARACTERS (AniList via Kenjitsu)
========================= */

export const getAniListCharacters = async (anilistId: number): Promise<{ status: number; data: AnilistCharacter | null }> => {
  try {
    const res = await fetch(
      `${KENJITSU_API}/anilist/anime/${anilistId}/characters`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) return { status: res.status, data: null };
    
    const json = await res.json();
    return { 
      status: 200, 
      data: json.data || null
    };
  } catch (error) {
    console.error("AniList characters error:", error);
    return { status: 500, data: null };
  }
};

/* =========================
   RELATED ANIME (AniList via Kenjitsu)
========================= */

export const getAniListRelated = async (anilistId: number): Promise<{ status: number; data: AnilistRelated | null }> => {
  try {
    const res = await fetch(
      `${KENJITSU_API}/anilist/anime/${anilistId}/related`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) return { status: res.status, data: null };
    
    const json = await res.json();
    return { 
      status: 200, 
      data: json.data || null
    };
  } catch (error) {
    console.error("AniList related error:", error);
    return { status: 500, data: null };
  }
};

/* =========================
   AIRING SCHEDULE (AniList via Kenjitsu)
========================= */

export const getAniListSchedule = async (date: string): Promise<{ status: number; data: AnilistAiringSchedule }> => {
  try {
    const res = await fetch(
      `${KENJITSU_API}/anilist/airing/date/${date}`,
      { next: { revalidate: 1800 } }
    );
    
    if (!res.ok) return { status: res.status, data: { hasNextPage: false, currentPage: 1, total: 0, lastPage: 1, perPage: 20, data: [] } };
    
    const json = await res.json();
    return { 
      status: 200, 
      data: json || { hasNextPage: false, currentPage: 1, total: 0, lastPage: 1, perPage: 20, data: [] }
    };
  } catch (error) {
    console.error("AniList schedule error:", error);
    return { status: 500, data: { hasNextPage: false, currentPage: 1, total: 0, lastPage: 1, perPage: 20, data: [] } };
  }
};

/* =========================
   PROVIDER MAPPINGS (AniList to Streaming)
========================= */

export const getAniListMappings = async (
  anilistId: number, 
  provider: 'kaido' | 'hianime' | 'animepahe' | 'anizone' = 'kaido'
): Promise<{ status: number; data: any }> => {
  try {
    const res = await fetch(
      `${KENJITSU_API}/anilist/mappings/${anilistId}?provider=${provider}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) return { status: res.status, data: null };
    
    const json = await res.json();
    return { 
      status: 200, 
      data: json.data || null
    };
  } catch (error) {
    console.error("AniList mappings error:", error);
    return { status: 500, data: null };
  }
};

/* =========================
   PROVIDER EPISODES (via AniList)
========================= */

export const getAniListEpisodes = async (
  anilistId: number, 
  provider: 'kaido' | 'hianime' | 'animepahe' | 'anizone' = 'kaido'
): Promise<{ status: number; data: any }> => {
  try {
    const res = await fetch(
      `${KENJITSU_API}/anilist/episodes/${anilistId}?provider=${provider}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) return { status: res.status, data: null };
    
    const json = await res.json();
    return { 
      status: 200, 
      data: json.data || null
    };
  } catch (error) {
    console.error("AniList episodes error:", error);
    return { status: 500, data: null };
  }
};

/* =========================
   LEGACY: Direct AniList GraphQL (kept for compatibility)
========================= */

const ANILIST_API_URL = 'https://graphql.anilist.co';

const extrasQuery = `
query ($search: String) {
  Media (search: $search, type: ANIME) {
    id
    idMal
    title {
      romaji
      english
      native
    }
    status
    format
    averageScore
    meanScore
    popularity
    favourites
    season
    seasonYear
    episodes
    description
    bannerImage
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    trailer {
      id
      site
      thumbnail
    }
    studios {
      nodes {
        id
        name
        isAnimationStudio
      }
    }
    genres
    tags {
      id
      name
      description
      rank
      category
    }
    recommendations (sort: RATING_DESC, perPage: 10) {
      edges {
        node {
          mediaRecommendation {
            id
            idMal
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            format
            type
            status
            averageScore
          }
        }
      }
    }
    relations {
      edges {
        relationType
        node {
          id
          idMal
          type
          format
          status
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
        }
      }
    }
    externalLinks {
      id
      url
      site
      icon
      color
    }
    characters (sort: ROLE, perPage: 25) {
      edges {
        role
        node {
          id
          name {
            full
          }
          image {
            large
          }
        }
        voiceActors (language: JAPANESE, sort: RELEVANCE) {
          id
          name {
            full
          }
          image {
            large
          }
        }
      }
    }
  }
}
`;

export async function getAniListExtras(animeName: string): Promise<AniListMedia | null> {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: extrasQuery,
        variables: { search: animeName },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status !== 404) {
        console.error("AniList API error:", response.status, await response.text());
      }
      return null;
    }

    const json = await response.json();
    
    if (json.errors) {
        console.error("AniList GraphQL errors:", json.errors);
        return null;
    }

    return json.data.Media;
  } catch (error) {
    console.error("Error fetching from AniList:", error);
    return null;
  }
}
