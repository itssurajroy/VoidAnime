/**
 * MangaDex API Integration
 * Solves the "broken chapter count" issue by cross-referencing MangaDex live data.
 */

export async function getMangaDexLiveChapters(title: string) {
  try {
    // 1. Search MangaDex for the manga by title
    const searchUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=1&order[relevance]=desc`;
    const searchRes = await fetch(searchUrl, { next: { revalidate: 3600 } });
    if (!searchRes.ok) return null;
    
    const searchData = await searchRes.json();
    const manga = searchData.data?.[0];
    
    if (!manga) return null;

    const mangaId = manga.id;
    const lastChapter = manga.attributes?.lastChapter;
    const lastVolume = manga.attributes?.lastVolume;
    const status = manga.attributes?.status; // ongoing, completed, etc.

    // 2. We can return this to merge with AniList data
    return {
      mangadexId: mangaId,
      liveChapterCount: lastChapter ? parseFloat(lastChapter) : null,
      liveVolumeCount: lastVolume ? parseFloat(lastVolume) : null,
      status: status,
    };
  } catch (error) {
    console.error("MangaDex API Error:", error);
    return null;
  }
}
