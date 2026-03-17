import { NextRequest, NextResponse } from 'next/server';

const TRACE_MOE = 'https://api.trace.moe/search';

function buildTraceMoeUrl(params: {
  url?: string;
  cutBorders?: boolean;
}): string {
  const query = new URLSearchParams();
  query.set('anilistInfo', 'true');
  if (params.cutBorders) query.set('cutBorders', '1');
  if (params.url) query.set('url', params.url);
  return `${TRACE_MOE}?${query.toString()}`;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { url, image, cutBorders } = body;

      if (image?.startsWith('data:')) {
        const traceRes = await fetch(
          buildTraceMoeUrl({ cutBorders: cutBorders ?? true }),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image }),
            signal: AbortSignal.timeout(20_000),
          }
        );
        const data = await traceRes.json();
        return NextResponse.json(data, { status: traceRes.status });
      }

      if (url) {
        const traceRes = await fetch(
          buildTraceMoeUrl({ url, cutBorders: cutBorders ?? true }),
          { signal: AbortSignal.timeout(15_000) }
        );
        const data = await traceRes.json();
        return NextResponse.json(data, { status: traceRes.status });
      }

      return NextResponse.json(
        { error: 'Provide either url or image field' },
        { status: 400 }
      );
    }

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const image = formData.get('image');
      const cutBorders = formData.get('cutBorders') === '1';

      if (!(image instanceof File)) {
        return NextResponse.json(
          { error: 'No image file found in request' },
          { status: 400 }
        );
      }

      const fd = new FormData();
      fd.append('image', image);

      const traceRes = await fetch(
        buildTraceMoeUrl({ cutBorders: cutBorders ?? true }),
        {
          method: 'POST',
          body: fd,
          signal: AbortSignal.timeout(25_000),
        }
      );
      const data = await traceRes.json();
      return NextResponse.json(data, { status: traceRes.status });
    }

    return NextResponse.json(
      { error: 'Unsupported Content-Type' },
      { status: 415 }
    );

  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'trace.moe took too long. Try again.' },
        { status: 504 }
      );
    }
    console.error('[scene-search route]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
