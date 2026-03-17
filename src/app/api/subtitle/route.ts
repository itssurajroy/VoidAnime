import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const lang = req.nextUrl.searchParams.get("lang") || "English";
  const name = req.nextUrl.searchParams.get("name") || "subtitles";
  const referer = req.nextUrl.searchParams.get("referer") || "https://hianime.to/";

  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        "Referer": referer,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      }
    });

    if (!res.ok) throw new Error("Failed to fetch subtitle");

    let vttText = await res.text();

    // Simple VTT to SRT conversion
    let srtText = vttText
      .replace(/WEBVTT\n\n/g, "")
      .replace(/WEBVTT\r?\n/g, "")
      .replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, "$1,$2");

    // Add numbering if missing (basic heuristic)
    if (!srtText.trim().startsWith("1")) {
        const lines = srtText.split('\n');
        let counter = 1;
        let result = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("-->")) {
                result.push(counter.toString());
                result.push(lines[i]);
                counter++;
            } else {
                result.push(lines[i]);
            }
        }
        srtText = result.join('\n');
    }

    const filename = `${name}-${lang}.srt`;

    return new NextResponse(srtText, {
      status: 200,
      headers: {
        "Content-Type": "application/x-subrip",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[subtitle-proxy] Error:", err);
    return NextResponse.json({ error: "Failed to process subtitle" }, { status: 500 });
  }
}
