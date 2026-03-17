export function isSpoiler(content: string, userProgress: number, targetEpisode?: number): boolean {
  // If targetEpisode is provided and it's higher than user progress, it's definitely a spoiler
  if (targetEpisode !== undefined && targetEpisode > userProgress) {
    return true;
  }

  // Basic keyword detection for general spoilers if not episode-tagged
  const spoilerKeywords = ['death', 'dies', 'killed', 'betrayal', 'twist', 'ending', 'final'];
  const lowerContent = content.toLowerCase();
  
  return spoilerKeywords.some(keyword => lowerContent.includes(lowerContent));
}
