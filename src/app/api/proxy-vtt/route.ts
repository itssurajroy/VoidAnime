import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const referer = req.nextUrl.searchParams.get("referer") || "https://hianime.to/";
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  try {
    const targetUrl = url;
    console.log(`[proxy-vtt] Fetching: ${targetUrl} with referer: ${referer}`);
    const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);
    const base = new URL(targetUrl);
    const baseOrigin = `${base.protocol}//${base.host}`;

    const res = await fetch(targetUrl, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
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
      console.error(`[proxy-vtt] Upstream error ${res.status}: ${targetUrl}`);
      return NextResponse.json({ error: `Failed to fetch VTT: ${res.status}` }, { status: 502 });
    }

    let text = await res.text();

    // ── Rewriting Image URLs in VTT (for thumbnails) ─────────────────
    text = text.split('\n').map(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('WEBVTT') && !trimmed.includes('-->') && !trimmed.startsWith('NOTE')) {
        if (trimmed.includes('.jpg') || trimmed.includes('.png') || trimmed.includes('.webp')) {
          let imageUrl: string;
          let hash = "";
          
          const hashIndex = trimmed.indexOf('#');
          const cleanLine = hashIndex > -1 ? trimmed.substring(0, hashIndex) : trimmed;
          if (hashIndex > -1) hash = trimmed.substring(hashIndex);

          if (cleanLine.startsWith('http')) {
            imageUrl = cleanLine;
          } else if (cleanLine.startsWith('/')) {
            imageUrl = baseOrigin + cleanLine;
          } else {
            imageUrl = baseUrl + cleanLine;
          }

          return `/api/stream?url=${encodeURIComponent(imageUrl)}&referer=${encodeURIComponent(referer)}${hash}`;
        }
      }
      return line;
    }).join('\n');

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[proxy-vtt] Proxy error:", err);
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}
