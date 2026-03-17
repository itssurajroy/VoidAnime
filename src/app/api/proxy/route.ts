import { NextRequest, NextResponse } from "next/server";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: HEADERS });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const referer = req.nextUrl.searchParams.get("referer") || "https://hianime.to/";
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  let base: URL;
  try {
    base = new URL(url);
  } catch (e) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const baseOrigin = `${base.protocol}//${base.host}`;
  const basePath = url.substring(0, url.lastIndexOf("/") + 1);

  try {
    // Mimic the exact headers from the successful PowerShell/Browser test
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": referer,
        "Origin": referer.endsWith('/') ? referer.slice(0, -1) : referer,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[proxy] Upstream error ${res.status}: ${url}`);
      return NextResponse.json({ error: `Upstream error: ${res.status}` }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") ?? "";

    // ── Binary segment (.ts / .aac / .mp4) → stream directly ──────────
    if (
      contentType.includes("video") ||
      contentType.includes("audio") ||
      contentType.includes("octet-stream") ||
      url.match(/\.(ts|aac|mp4|m4s|vtt)(\?.*)?$/)
    ) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          ...HEADERS,
          "Content-Type": contentType || "video/MP2T",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // ── M3U8 playlist → rewrite all URLs ───────────────────────────────
    let text = await res.text();

    text = text
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        // If it's a line with a URI (like #EXT-X-KEY or #EXT-X-MAP)
        if (trimmed.startsWith("#")) {
          return line.replace(/URI="([^"]+)"/g, (match, p1) => {
            let absoluteUrl: string;
            if (p1.startsWith("http://") || p1.startsWith("https://")) {
              absoluteUrl = p1;
            } else if (p1.startsWith("/")) {
              absoluteUrl = `${baseOrigin}${p1}`;
            } else {
              absoluteUrl = `${basePath}${p1}`;
            }

            // Keys should also go through /api/proxy because they often need the same headers
            return `URI="/api/proxy?url=${encodeURIComponent(absoluteUrl)}&referer=${encodeURIComponent(referer)}"`;
          });
        }

        // Build absolute URL for segment/playlist lines
        let absoluteUrl: string;
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
          absoluteUrl = trimmed;
        } else if (trimmed.startsWith("/")) {
          absoluteUrl = `${baseOrigin}${trimmed}`;
        } else {
          absoluteUrl = `${basePath}${trimmed}`;
        }

        // Decide proxy route: m3u8 → /api/proxy, everything else → /api/stream
        // Use a more robust check for m3u8 (case insensitive and handles query params)
        const isM3U8 = /\.m3u8($|\?)/i.test(absoluteUrl);
        const proxyRoute = isM3U8 ? "/api/proxy" : "/api/stream";
        return `${proxyRoute}?url=${encodeURIComponent(absoluteUrl)}&referer=${encodeURIComponent(referer)}`;
      })
      .join("\n");

    return new NextResponse(text, {
      status: 200,
      headers: {
        ...HEADERS,
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("[proxy]", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
