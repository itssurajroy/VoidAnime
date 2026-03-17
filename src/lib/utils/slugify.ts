export function slugify(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function extractIdFromSlug(slug: string): number | null {
  // Try to match an id at the end: `jujutsu-kaisen-113415` -> 113415
  const match = slug.match(/-(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // Or if it's just numbers
  if (/^\d+$/.test(slug)) {
    return parseInt(slug, 10);
  }

  return null;
}
