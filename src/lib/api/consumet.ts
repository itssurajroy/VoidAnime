// src/lib/api/consumet.ts

/**
 * Consumet API Integration (Optional)
 * Auto-detects which providers have a specific title available.
 */

const CONSUMET_URL = process.env.CONSUMET_API_URL;
const CONSUMET_PROVIDERS = ['gogoanime', 'zoro', 'animefox', 'animepahe'];

export async function resolveStreamingSources(title: string) {
  if (!CONSUMET_URL) {
    console.warn("Consumet API URL not configured in environment variables.");
    return [];
  }

  try {
    const results = await Promise.allSettled(
      CONSUMET_PROVIDERS.map(provider =>
        fetch(`${CONSUMET_URL}/anime/${provider}/${encodeURIComponent(title)}`)
          .then(r => r.json())
          .then(data => ({ 
            provider, 
            found: data.results?.length > 0, 
            id: data.results?.[0]?.id 
          }))
      )
    );

    return results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value.found)
      .map(r => r.value);
  } catch (error) {
    console.error("Consumet Resolution Error:", error);
    return [];
  }
}
