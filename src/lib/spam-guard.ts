export const SPAM_GUIDELINES = [
  {
    title: "Excessive Self-Promotion",
    description: "Sharing the same link multiple times or across many threads is considered spam. Keep your self-promotion to dedicated threads.",
    severity: "High"
  },
  {
    title: "Repetitive Content",
    description: "Do not post the same comment or variation multiple times. If it's already been said, use the 'Like' feature instead.",
    severity: "Medium"
  },
  {
    title: "Link Spamming",
    description: "Comments containing excessive links (2+) or suspicious URLs are automatically flagged and removed.",
    severity: "High"
  },
  {
    title: "Screaming & Formatting",
    description: "Excessive use of ALL CAPS, repetitive emojis, or formatting to bypass filters is prohibited.",
    severity: "Low"
  },
  {
    title: "Rate Limiting",
    description: "We enforce a limit on how frequently you can post to ensure a quality experience for all users.",
    severity: "System"
  }
];

export function checkSpam(content: string, lastComments: any[], userId: string): { isSpam: boolean; reason?: string } {
  const text = content.trim();

  // 1. Length Check
  if (text.length < 3) return { isSpam: true, reason: "Comment is too short (min 3 chars)." };
  if (text.length > 1000) return { isSpam: true, reason: "Comment exceeds maximum length (1000 chars)." };

  // 2. Repetitive Content (User's last 5 comments in this thread)
  const isDuplicate = lastComments
    .filter(c => c.userId === userId)
    .slice(0, 5)
    .some(c => c.content.toLowerCase() === text.toLowerCase());
  
  if (isDuplicate) return { isSpam: true, reason: "Duplicate content detected. Please avoid posting the same message twice." };

  // 3. Link Detection
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  const links = text.match(linkRegex) || [];
  if (links.length > 2) return { isSpam: true, reason: "Too many links detected. Max 2 per comment." };

  // 4. Caps Check (Screaming)
  const alphaChars = text.replace(/[^a-zA-Z]/g, '');
  if (alphaChars.length > 10) {
    const capsCount = (alphaChars.match(/[A-Z]/g) || []).length;
    if (capsCount / alphaChars.length > 0.7) {
        return { isSpam: true, reason: "Excessive capitalization (screaming) detected." };
    }
  }

  // 5. Rate Limiting (Check timestamps)
  const now = Date.now();
  const userCommentsLastMin = lastComments.filter(c => {
    if (c.userId !== userId) return false;
    const createdAt = c.createdAt?.toDate?.() || new Date(c.createdAt);
    return (now - createdAt.getTime()) < 60000;
  });

  if (userCommentsLastMin.length >= 3) {
    return { isSpam: true, reason: "Rate limit exceeded. Please wait a minute before posting again." };
  }

  return { isSpam: false };
}
