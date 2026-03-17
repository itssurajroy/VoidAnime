import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const refererParam = req.nextUrl.searchParams.get("referer");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  let base: URL;
  try {
    base = new URL(url);
  } catch (e) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const baseOrigin = `${base.protocol}//${base.host}`;
  const referer = refererParam || baseOrigin + "/";

  try {
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
      console.error(`[stream] Upstream error ${res.status}: ${url}`);
      return NextResponse.json({ error: `Upstream error: ${res.status}` }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "video/MP2T";

    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("[stream]", err);
    return NextResponse.json({ error: "Stream fetch failed" }, { status: 500 });
  }
}
