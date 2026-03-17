import type { AniListMedia } from "@/types";

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
    stats {
      statusDistribution {
        status
        amount
      }
      scoreDistribution {
        score
        amount
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
    staff (perPage: 15) {
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
      // Use a short cache time for server-side fetches to avoid stale data
      // but still benefit from some caching.
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // It's common for an anime not to be found on AniList, so a 404 is not a critical error.
      // We'll log other errors, but not 404s.
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

const scheduleQuery = `
query ($weekStart: Int, $weekEnd: Int, $page: Int) {
  Page (page: $page) {
    pageInfo {
      hasNextPage
    }
    airingSchedules (airingAt_greater: $weekStart, airingAt_less: $weekEnd, sort: TIME) {
      id
      airingAt
      episode
      media {
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
        status
      }
    }
  }
}
`;

export async function getAniListSchedule(weekStart: number, weekEnd: number, page: number = 1): Promise<any[]> {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: scheduleQuery,
        variables: { weekStart, weekEnd, page },
      }),
      next: { revalidate: 1800 },
    });

    if (!response.ok) return [];
    const json = await response.json();
    const schedules = json.data.Page.airingSchedules;
    
    if (json.data.Page.pageInfo.hasNextPage && page < 3) { // Limit to 3 pages to avoid excessive fetching
        const nextSchedules = await getAniListSchedule(weekStart, weekEnd, page + 1);
        return [...schedules, ...nextSchedules];
    }

    return schedules;
  } catch (error) {
    console.error("Error fetching AniList schedule:", error);
    return [];
  }
}
