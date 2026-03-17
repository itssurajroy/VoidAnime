export const ANILIST_ENDPOINT = 'https://graphql.anilist.co';

export interface AniListResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

async function fetchAniList<T>(query: string, variables: any = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(ANILIST_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: token ? 0 : 3600 },
  });

  const json: AniListResponse<T> = await response.json();

  if (json.errors) {
    console.error('AniList API Error:', json.errors);
    throw new Error(json.errors[0].message || 'Failed to fetch from AniList');
  }

  return json.data;
}

// 1. searchAnime
export async function searchAnime(query: string, page: number = 1, filters: any = {}) {
  const gqlQuery = `
    query ($page: Int, $search: String, $genre: [String], $year: Int, $status: MediaStatus, $format: MediaFormat, $sort: [MediaSort]) {
      Page(page: $page, perPage: 24) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(search: $search, genre_in: $genre, seasonYear: $year, status: $status, format: $format, type: ANIME, sort: $sort) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            color
          }
          startDate {
            year
          }
          season
          episodes
          averageScore
          genres
          status
          format
        }
      }
    }
  `;
  const variables = { 
    page, 
    search: query || undefined, 
    sort: filters.sort || ['POPULARITY_DESC'],
    ...filters 
  };
  return fetchAniList<any>(gqlQuery, variables);
}

// 1.1 searchManga
export async function searchManga(query: string, page: number = 1, filters: any = {}) {
  const gqlQuery = `
    query ($page: Int, $search: String, $genre: [String], $status: MediaStatus, $format: MediaFormat, $sort: [MediaSort]) {
      Page(page: $page, perPage: 24) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(search: $search, genre_in: $genre, status: $status, format: $format, type: MANGA, sort: $sort) {
          id
          title { romaji english }
          coverImage { extraLarge large color }
          chapters
          volumes
          averageScore
          genres
          status
          format
        }
      }
    }
  `;
  const variables = { 
    page, 
    search: query || undefined, 
    sort: filters.sort || ['POPULARITY_DESC'],
    ...filters 
  };
  return fetchAniList<any>(gqlQuery, variables);
}

// 2. getAnimeById
export async function getAnimeById(id: number) {
  const gqlQuery = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          color
        }
        bannerImage
        startDate { year month day }
        endDate { year month day }
        season
        seasonYear
        description
        type
        format
        status(version: 2)
        episodes
        duration
        chapters
        volumes
        genres
        synonyms
        source(version: 3)
        isAdult
        isLocked
        meanScore
        averageScore
        popularity
        favourites
        isFavourite
        hashtag
        siteUrl
        rankings {
          rank
          type
          format
          year
          season
          allTime
          context
        }
        stats {
          scoreDistribution {
            score
            amount
          }
          statusDistribution {
            status
            amount
          }
        }
        isRecommendationBlocked
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
        tags {
          id
          name
          description
          rank
          isMediaSpoiler
          isGeneralSpoiler
        }
        relations {
          edges {
            relationType(version: 2)
            node {
              id
              title { romaji english }
              format
              type
              status(version: 2)
              coverImage { large color }
            }
          }
        }
        characters(sort: [ROLE, RELEVANCE, ID], page: 1, perPage: 15) {
          edges {
            role
            node {
              id
              name { full native }
              image { large }
            }
            voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
              id
              name { full native }
              image { large }
            }
          }
        }
        staff(sort: [RELEVANCE, ID], page: 1, perPage: 10) {
          edges {
            role
            node {
              id
              name { full }
              image { large }
            }
          }
        }
        studios(isMain: true) {
          edges {
            isMain
            node { id name }
          }
        }
        recommendations(page: 1, perPage: 10, sort: [RATING_DESC, ID]) {
          nodes {
            rating
            mediaRecommendation {
              id
              title { romaji english }
              coverImage { large color }
              format
              type
              status(version: 2)
              averageScore
            }
          }
        }
        externalLinks {
          id
          url
          site
          type
          language
          icon
          color
        }
        streamingEpisodes {
          title
          thumbnail
          url
          site
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { id });
}

// 3. getMangaById
export async function getMangaById(id: number) {
  const gqlQuery = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        description
        coverImage { extraLarge large color }
        bannerImage
        format
        status(version: 2)
        chapters
        volumes
        genres
        averageScore
        popularity
        favourites
        siteUrl
        startDate { year month day }
        rankings {
          rank
          type
          format
          year
          season
          allTime
          context
        }
        tags {
          id
          name
          description
          category
          rank
          isMediaSpoiler
        }
        externalLinks {
          id
          url
          site
          type
          language
          icon
          color
        }
        characters(sort: [ROLE, RELEVANCE, ID], page: 1, perPage: 15) {
          edges {
            role
            node {
              id
              name { full }
              image { large }
            }
          }
        }
        recommendations(page: 1, perPage: 10, sort: [RATING_DESC, ID]) {
          nodes {
            rating
            mediaRecommendation {
              id
              title { romaji english }
              coverImage { large color }
              format
              type
              status(version: 2)
              averageScore
            }
          }
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { id });
}

// 4. getSeasonalAnime
export async function getSeasonalAnime(season: string, year: number, page: number = 1) {
  const gqlQuery = `
    query ($season: MediaSeason, $year: Int, $page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
          id
          idMal
          title { romaji english }
          coverImage { extraLarge color }
          genres
          averageScore
          episodes
          studios(isMain: true) { nodes { name } }
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { season, year, page });
}

// 5. getTrending
export async function getTrending(page: number = 1) {
  const gqlQuery = `
    query ($page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          total
          currentPage
          hasNextPage
        }
        media(sort: TRENDING_DESC, type: ANIME) {
          id
          idMal
          title { romaji english }
          coverImage { extraLarge color }
          bannerImage
          description
          genres
          averageScore
          episodes
          trending
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { page });
}

// 6. getAiringSchedule
export async function getAiringSchedule(weekStart: number, weekEnd: number, page: number = 1) {
  const gqlQuery = `
    query ($weekStart: Int, $weekEnd: Int, $page: Int) {
      Page(page: $page, perPage: 50) {
        pageInfo {
          hasNextPage
          currentPage
        }
        airingSchedules(airingAt_greater: $weekStart, airingAt_lesser: $weekEnd, sort: TIME) {
          id
          airingAt
          timeUntilAiring
          episode
          media {
            id
            idMal
            title { romaji english }
            coverImage { large color }
            episodes
            averageScore
          }
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { weekStart, weekEnd, page });
}

// 7. getUserList
export async function getUserList(userId: number, status?: string) {
  const gqlQuery = `
    query ($userId: Int, $status: MediaListStatus) {
      MediaListCollection(userId: $userId, type: ANIME, status: $status) {
        lists {
          name
          isCustomList
          isSplitCompletedList
          status
          entries {
            id
            mediaId
            status
            score
            progress
            repeat
            notes
            updatedAt
            media {
              id
              idMal
              title { romaji english }
              coverImage { large }
              episodes
              format
              status
            }
          }
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { userId, status });
}

// 8. saveMediaListEntry
export async function saveMediaListEntry(token: string, mediaId: number, status: string, score: number, progress: number) {
  const gqlMutation = `
    mutation ($mediaId: Int, $status: MediaListStatus, $score: Float, $progress: Int) {
      SaveMediaListEntry(mediaId: $mediaId, status: $status, score: $score, progress: $progress) {
        id
        mediaId
        status
        score
        progress
      }
    }
  `;
  return fetchAniList<any>(gqlMutation, { mediaId, status, score, progress }, token);
}

// 9. getRecommendations
export async function getRecommendations(mediaId: number) {
  const gqlQuery = `
    query ($mediaId: Int) {
      Media(id: $mediaId) {
        recommendations(page: 1, perPage: 15, sort: [RATING_DESC, ID]) {
          nodes {
            mediaRecommendation {
              id
              idMal
              title { romaji english }
              coverImage { large color }
              format
              type
              status(version: 2)
              averageScore
            }
          }
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { mediaId });
}

// 11. getHiddenGems (High Score + Low Popularity)
export async function getHiddenGems(page: number = 1) {
  const gqlQuery = `
    query ($page: Int) {
      Page(page: $page, perPage: 20) {
        media(sort: SCORE_DESC, type: ANIME, averageScore_greater: 75, popularity_lesser: 50000) {
          id
          title { romaji english }
          coverImage { extraLarge color }
          averageScore
          popularity
          genres
          episodes
          format
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { page });
}

// 12. getByDecade
export async function getByDecade(yearStart: number, yearEnd: number, page: number = 1) {
  const gqlQuery = `
    query ($page: Int, $start: Int, $end: Int) {
      Page(page: $page, perPage: 24) {
        media(startDate_greater: $start, startDate_lesser: $end, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji english }
          coverImage { extraLarge large color }
          averageScore
          startDate { year }
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { page, start: yearStart * 10000, end: yearEnd * 10000 });
}

// 13. getTopAnime
export async function getTopAnime(page: number = 1) {
  const gqlQuery = `
    query ($page: Int) {
      Page(page: $page, perPage: 10) {
        media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
          id
          title { romaji english }
          coverImage { large color }
          averageScore
          genres
          episodes
          format
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { page });
}

// 14. getRecentReviews
export async function getRecentReviews(page: number = 1, perPage: number = 5) {
  const gqlQuery = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        reviews(sort: ID_DESC) {
          id
          summary
          rating
          ratingAmount
          user {
            name
            avatar { large }
          }
          media {
            id
            title { romaji english }
            coverImage { large }
          }
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { page, perPage });
}

// 15. getAnimeByIds - Get multiple anime by IDs
export async function getAnimeByIds(ids: number[]) {
  if (!ids.length) return { Page: { media: [] } };
  
  const gqlQuery = `
    query ($ids: [Int]) {
      Page(page: 1, perPage: ${ids.length}) {
        media(id_in: $ids, type: ANIME) {
          id
          idMal
          title { romaji english native }
          coverImage { extraLarge large color }
          bannerImage
          episodes
          format
          averageScore
          status
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { ids });
}

// 16. getHiddenGemOfTheWeek - Get a random hidden gem
export async function getHiddenGemOfTheWeek() {
  const gqlQuery = `
    query {
      Page(page: 1, perPage: 50) {
        media(sort: SCORE_DESC, type: ANIME, averageScore_greater: 80, popularity_lesser: 20000, isAdult: false) {
          id
          idMal
          title { romaji english native }
          coverImage { extraLarge large color }
          bannerImage
          description
          averageScore
          popularity
          genres
          episodes
          format
          season
          seasonYear
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, {});
}

// 17. getCurrentSeasonAnime - Get current season anime
export async function getCurrentSeasonAnime(page: number = 1) {
  const now = new Date();
  const month = now.getMonth();
  let season: string;
  
  if (month >= 0 && month <= 2) season = 'WINTER';
  else if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else season = 'FALL';
  
  const gqlQuery = `
    query ($season: MediaSeason, $year: Int, $page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          hasNextPage
        }
        media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
          id
          idMal
          title { romaji english }
          coverImage { extraLarge color }
          bannerImage
          episodes
          averageScore
          genres
          format
          status
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { season, year: now.getFullYear(), page });
}

// 18. getTrendingManga - Get trending manga
export async function getTrendingManga(page: number = 1) {
  const gqlQuery = `
    query ($page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          hasNextPage
        }
        media(type: MANGA, sort: TRENDING_DESC) {
          id
          idMal
          title { romaji english native }
          coverImage { extraLarge large color }
          bannerImage
          chapters
          volumes
          averageScore
          genres
          format
          status
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { page });
}

// 19. getTopManga - Get top rated manga
export async function getTopManga(page: number = 1) {
  const gqlQuery = `
    query ($page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          hasNextPage
        }
        media(type: MANGA, sort: SCORE_DESC) {
          id
          idMal
          title { romaji english native }
          coverImage { extraLarge large color }
          bannerImage
          chapters
          volumes
          averageScore
          genres
          format
          status
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { page });
}

// 20. getPopularManga - Get popular manga
export async function getPopularManga(page: number = 1) {
  const gqlQuery = `
    query ($page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          hasNextPage
        }
        media(type: MANGA, sort: POPULARITY_DESC) {
          id
          idMal
          title { romaji english native }
          coverImage { extraLarge large color }
          bannerImage
          chapters
          volumes
          averageScore
          genres
          format
          status
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { page });
}

// 21. getSeasonalManga - Get current season manga
export async function getSeasonalManga(page: number = 1) {
  const now = new Date();
  const month = now.getMonth();
  let season: string;
  
  if (month >= 0 && month <= 2) season = 'WINTER';
  else if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else season = 'FALL';
  
  const gqlQuery = `
    query ($season: MediaSeason, $year: Int, $page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          hasNextPage
        }
        media(season: $season, seasonYear: $year, type: MANGA, sort: POPULARITY_DESC) {
          id
          idMal
          title { romaji english }
          coverImage { extraLarge color }
          bannerImage
          chapters
          volumes
          averageScore
          genres
          format
          status
        }
      }
    }
  `;
  return fetchAniList<any>(gqlQuery, { season, year: now.getFullYear(), page });
}
