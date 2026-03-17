import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // Allow up to 5 minutes on Vercel Pro

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  let filename = req.nextUrl.searchParams.get("name") || "anime-video";
  const referer = req.nextUrl.searchParams.get("referer") || "https://hianime.to/";
  const quality = req.nextUrl.searchParams.get("quality"); // e.g., "720"

  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  // Clean filename to prevent weird characters but be permissive
  filename = filename.replace(/[^a-zA-Z0-9.\-_ ]/g, "").trim();
  // Replace spaces with underscores for maximum cross-platform compatibility
  const safeFilename = filename.replace(/\s+/g, "_");

  try {
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Referer": referer,
    };

    // 1. Fetch initial playlist
    let res = await fetch(url, { headers });
    if (!res.ok) throw new Error("Failed to fetch initial playlist");
    let playlistText = await res.text();
    let currentUrl = url;

    // 2. Check if it's a master playlist
    if (playlistText.includes("#EXT-X-STREAM-INF")) {
      const lines = playlistText.split('\n');
      let highestBandwidth = 0;
      let selectedSubPlaylist = "";
      let foundExactQuality = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("#EXT-X-STREAM-INF")) {
          const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
          const resolutionMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
          
          const bandwidth = bandwidthMatch ? parseInt(bandwidthMatch[1], 10) : 0;
          const height = resolutionMatch ? parseInt(resolutionMatch[2], 10) : 0;

          if (quality) {
            // If quality is requested, try to find the exact match or the closest one
            if (height === parseInt(quality, 10)) {
              selectedSubPlaylist = lines[i + 1].trim();
              foundExactQuality = true;
              break;
            }
          }
          
          // Keep track of highest bandwidth as fallback
          if (bandwidth >= highestBandwidth && i + 1 < lines.length) {
            highestBandwidth = bandwidth;
            if (!foundExactQuality) {
              selectedSubPlaylist = lines[i + 1].trim();
            }
          }
        }
      }

      if (selectedSubPlaylist) {
        currentUrl = new URL(selectedSubPlaylist, currentUrl).href;
        res = await fetch(currentUrl, { headers });
        if (!res.ok) throw new Error("Failed to fetch sub-playlist");
        playlistText = await res.text();
      }
    }

    // 3. Extract chunk URLs
    const lines = playlistText.split('\n');
    const chunkUrls: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        chunkUrls.push(new URL(trimmed, currentUrl).href);
      }
    }

    if (chunkUrls.length === 0) {
      throw new Error("No video chunks found in playlist");
    }

    // 4. Create ReadableStream to fetch and pipe chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Fetch in batches of 10 to speed up but not overwhelm the connection
          const batchSize = 10;
          for (let i = 0; i < chunkUrls.length; i += batchSize) {
            const batch = chunkUrls.slice(i, i + batchSize);
            const results = await Promise.all(
              batch.map(async (chunkUrl) => {
                try {
                  const chunkRes = await fetch(chunkUrl, { headers });
                  if (chunkRes.ok) return await chunkRes.arrayBuffer();
                } catch (e) {
                  console.warn(`[download] Batch fetch error:`, e);
                }
                return null;
              })
            );

            for (const buffer of results) {
              if (buffer) {
                controller.enqueue(new Uint8Array(buffer));
              }
            }
          }
        } catch (error) {
          console.error("[download] Stream error:", error);
        } finally {
          controller.close();
        }
      }
    });

    const fullFilename = `${safeFilename}${quality ? `_${quality}p` : ""}.mp4`;

    // Standard headers for forced download and reliable naming
    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream", // Force download
        "Content-Disposition": `attachment; filename="${fullFilename}"`,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[download-proxy] Error:", err);
    return NextResponse.json({ error: "Download failed or playlist parsing error" }, { status: 500 });
  }
}
