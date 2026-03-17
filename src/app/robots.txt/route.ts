import { getSeoSettings } from '@/lib/settings';

export async function GET(request: Request) {
  const settings = await getSeoSettings();
  return new Response(settings.robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
