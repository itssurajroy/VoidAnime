import { getAnimeDetails, getAnimeEpisodes, getEpisodeServers } from "@/services/anime";
import { DownloadClient } from "../../DownloadClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { normalizeEpisodeId } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Download Video - VoidAnime",
};

export const dynamic = 'force-dynamic';

export default async function DownloadPage({ params, searchParams }: { 
    params: Promise<{ animeId: string, epId: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const { animeId, epId: rawEpId } = await params;
  const resolvedSearchParams = await searchParams;
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'sub';

  if (!rawEpId || !animeId) return notFound();

  const epId = normalizeEpisodeId(rawEpId);

  try {
    const [detailRes, episodesRes, serversRes] = await Promise.all([
      getAnimeDetails(animeId),
      getAnimeEpisodes(animeId),
      getEpisodeServers(epId)
    ]);

    const animeName = detailRes.data?.anime?.info?.name || "Anime";
    const durationStr = detailRes.data?.anime?.info?.stats?.duration || "24m";
    const poster = detailRes.data?.anime?.info?.poster || "";

    const episodes = episodesRes.data?.episodes || [];
    const currentEp = episodes.find((e: any) => normalizeEpisodeId(e.episodeId) === epId) || episodes[0];
    const epNumber = currentEp?.number || 1;
    const epTitle = currentEp?.title || `Episode ${epNumber}`;

    const servers = serversRes.data || null;

    return (
      <DownloadClient
        epId={epId}
        rawEpId={rawEpId}
        animeId={animeId}
        animeName={animeName}
        poster={poster}
        epNumber={epNumber}
        epTitle={epTitle}
        durationStr={durationStr}
        category={category}
        availableServers={servers}
      />
    );
  } catch (err) {
    console.error("Failed to load download data", err);
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-white">
        <h2>Failed to load download page. Please try again.</h2>
      </div>
    );
  }
}
