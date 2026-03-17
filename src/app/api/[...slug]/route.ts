export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getHiAnimeServers, getHiAnimeSourceUrl } from '@/lib/extractors/hianime';
import { extractMegacloud } from '@/lib/extractors/megacloud';

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || 'https://void-ivory-beta.vercel.app';

function setCorsHeaders(response: NextResponse, origin: string | null) {
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join('/');
  const searchParams = request.nextUrl.searchParams;
  const requestOrigin = request.headers.get('origin');

  // --- Manual Fallback Logic ---
  if (path === 'v2/hianime/episode/servers') {
    const episodeId = searchParams.get('animeEpisodeId');
    if (episodeId) {
      try {
        const servers = await getHiAnimeServers(episodeId);
        const data = {
          sub: servers.filter(s => s.type === 'sub').map(s => ({ serverId: s.id, serverName: s.name.toLowerCase() })),
          dub: servers.filter(s => s.type === 'dub').map(s => ({ serverId: s.id, serverName: s.name.toLowerCase() })),
          raw: servers.filter(s => s.type === 'raw').map(s => ({ serverId: s.id, serverName: s.name.toLowerCase() })),
        };
        return setCorsHeaders(NextResponse.json({ status: 200, data }), requestOrigin);
      } catch (err) {
        console.error("[Manual Server Fallback] Failed:", err);
      }
    }
  }

  if (path === 'v2/hianime/episode/sources') {
    const episodeId = searchParams.get('animeEpisodeId');
    const serverName = searchParams.get('server') || 'hd-1';
    const category = searchParams.get('category') || 'sub';

    if (episodeId) {
      try {
        const servers = await getHiAnimeServers(episodeId);
        const targetServer = servers.find(s => 
          s.type === category && 
          (s.name.toLowerCase() === serverName.toLowerCase() || (serverName === 'hd-1' && s.name.toLowerCase() === 'megacloud'))
        );

        if (targetServer) {
          const embedUrl = await getHiAnimeSourceUrl(targetServer.id);
          if (embedUrl.includes('megacloud') || embedUrl.includes('rabbitstream')) {
            const sources = await extractMegacloud(embedUrl);
            return setCorsHeaders(NextResponse.json({ status: 200, data: sources }), requestOrigin);
          }
        }
      } catch (err) {
        console.error("[Manual Source Fallback] Failed:", err);
      }
    }
  }

  // Construct the target URL
  const searchParamsStr = request.nextUrl.search;
  const targetUrl = `${EXTERNAL_API_BASE_URL}/api/${path}${searchParamsStr}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
        // Fallback: try without /api prefix if /api returns 404
        if (response.status === 404) {
            const fallbackUrl = `${EXTERNAL_API_BASE_URL}/${path}${searchParams}`;
            const fallbackRes = await fetch(fallbackUrl, { cache: 'no-store' });
            if (fallbackRes.ok) {
                const data = await fallbackRes.json();
                return setCorsHeaders(NextResponse.json(data), requestOrigin);
            }
        }
        return setCorsHeaders(NextResponse.json({ error: 'External API error' }, { status: response.status }), requestOrigin);
    }

    const data = await response.json();
    return setCorsHeaders(NextResponse.json(data), requestOrigin);
  } catch (error: any) {
    console.error(`Proxy error for path: /api/${path}${searchParams}`, error);
    return setCorsHeaders(NextResponse.json({ message: 'Error proxying API request', error: error?.message }, { status: 500 }), requestOrigin);
  }
}

export async function OPTIONS(request: NextRequest) {
    return setCorsHeaders(new NextResponse(null, { status: 204 }), request.headers.get('origin'));
}
