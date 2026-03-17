export interface RegionData {
  code: string;
  name: string;
  flag: string;
}

export const MAJOR_REGIONS: RegionData[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
];

/**
 * Heuristic to detect region from AniList externalLink data
 */
export function detectRegion(siteName: string, notes?: string): string[] {
  const regions: string[] = [];
  const lowerSite = siteName.toLowerCase();
  const lowerNotes = (notes || '').toLowerCase();

  if (lowerSite.includes('india') || lowerNotes.includes('india')) regions.push('IN');
  if (lowerSite.includes('united states') || lowerNotes.includes('usa') || lowerNotes.includes('u.s.')) regions.push('US');
  if (lowerSite.includes('united kingdom') || lowerNotes.includes('uk')) regions.push('UK');
  if (lowerSite.includes('canada') || lowerNotes.includes('ca')) regions.push('CA');
  
  // Generic global platforms usually cover these if not restricted
  if (lowerSite === 'netflix' || lowerSite === 'crunchyroll' || lowerSite === 'disney plus') {
    // If no specific region mentioned, assume wide availability
    if (regions.length === 0) return ['US', 'UK', 'CA', 'AU', 'IN'];
  }

  return regions;
}
