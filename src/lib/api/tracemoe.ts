export interface TraceMoeMatch {
  anilist: number;
  filename: string;
  episode: number | string | null;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
  anilistInfo?: {
    id: number;
    idMal: number;
    title: {
      native: string;
      romaji: string;
      english: string;
    };
    synonyms: string[];
    isAdult: boolean;
  };
}

export interface TraceMoeResponse {
  frameCount: number;
  error: string;
  result: TraceMoeMatch[];
}

export function sanitizeImageUrl(rawUrl: string): {
  url: string;
  warning?: string;
} {
  const trimmed = rawUrl.trim();

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname === 'www.google.com' && parsed.pathname === '/imgres') {
      const imgurl = parsed.searchParams.get('imgurl');
      if (imgurl) {
        return {
          url: decodeURIComponent(imgurl),
          warning: 'Extracted direct URL from Google Images link',
        };
      }
    }

    if (parsed.hostname.includes('gstatic.com') || parsed.hostname.includes('encrypted-tbn')) {
      return {
        url: trimmed,
        warning: 'Google thumbnail — low resolution, may not match well',
      };
    }

    if (parsed.hostname.includes('pinterest')) {
      throw new Error(
        'Pinterest URLs are not supported.\n'
        + 'Right-click the image → "Open image in new tab" and use that URL.'
      );
    }

    if (parsed.hostname.includes('instagram.com') || parsed.hostname.includes('cdninstagram.com')) {
      throw new Error(
        'Instagram URLs expire and cannot be used.\n'
        + 'Save the image and upload it directly instead.'
      );
    }

    if (parsed.hostname === 'pbs.twimg.com') {
      const url = new URL(trimmed);
      url.searchParams.set('format', 'jpg');
      url.searchParams.set('name', 'large');
      return { url: url.toString() };
    }

    return { url: trimmed };

  } catch (e: any) {
    if (e.message.includes('not supported') || e.message.includes('expire')) throw e;
    throw new Error('Invalid URL format. Please enter a valid image URL.');
  }
}

export async function traceByUrl(rawUrl: string, options: { cutBorders?: boolean } = {}): Promise<TraceMoeResponse> {
  const { url, warning } = sanitizeImageUrl(rawUrl);
  if (warning) console.info('[tracemoe]', warning);

  const res = await fetch('/api/gateway/scene-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      cutBorders: options.cutBorders ?? true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `Request failed (${res.status})`);
  }

  const data: TraceMoeResponse = await res.json();

  if (data.error) {
    throw new Error(formatTraceMoeError(data.error));
  }

  return data;
}

export async function traceByFile(file: File, options: { cutBorders?: boolean } = {}): Promise<TraceMoeResponse> {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported format: ${file.type}. Use JPG, PNG, WebP, or GIF.`);
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 25MB.');
  }

  const formData = new FormData();
  formData.append('image', file);
  if (options.cutBorders) {
    formData.append('cutBorders', '1');
  }

  const res = await fetch('/api/gateway/scene-search', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `Request failed (${res.status})`);
  }

  const data: TraceMoeResponse = await res.json();

  if (data.error) {
    throw new Error(formatTraceMoeError(data.error));
  }

  return data;
}

function formatTraceMoeError(error: string): string {
  if (error.includes('Failed to fetch image')) {
    return 'Could not load the image from that URL. Try downloading and uploading directly.';
  }
  if (error.includes('Invalid image')) {
    return 'The file does not appear to be a valid image.';
  }
  if (error.includes('image too large')) {
    return 'Image is too large. Resize it below 25MB and try again.';
  }
  return error;
}

export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function getConfidenceLabel(similarity: number): {
  label: string;
  color: string;
} {
  const pct = similarity * 100;
  if (pct >= 97) return { label: 'Exact Match', color: 'text-green-400' };
  if (pct >= 90) return { label: 'High Confidence', color: 'text-blue-400' };
  if (pct >= 85) return { label: 'Likely Match', color: 'text-yellow-400' };
  return { label: 'Low Confidence', color: 'text-red-400' };
}

export function getSimilarityColor(similarity: number): string {
  if (similarity >= 0.9) return 'text-green-400';
  if (similarity >= 0.8) return 'text-yellow-400';
  return 'text-red-400';
}

export function formatSimilarity(similarity: number): string {
  return `${(similarity * 100).toFixed(1)}%`;
}
