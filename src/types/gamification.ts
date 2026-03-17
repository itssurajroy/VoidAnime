export interface GamificationData {
    xp: number;
    level: number;
    voidCoins: number;
    currentStreak: number;
    longestStreak: number;
    lastWatchDate: any; // Firestore Timestamp
    lastLoginDate: any; // Firestore Timestamp
    badges: string[]; // Array of badge IDs
    dailyXpEarned: number;
    lastXpResetDate: any; // Firestore Timestamp
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // E.g., a Lucide icon name or emoji
}

export const AVAILABLE_BADGES: Badge[] = [
    { id: 'first_blood', name: 'First Blood', description: 'Watched your first episode.', icon: 'Play' },
    { id: 'binge_watcher', name: 'Binge Watcher', description: 'Watched 5 episodes in a single day.', icon: 'Flame' },
    { id: 'week_streak', name: '7-Day Streak', description: 'Logged in and watched for 7 consecutive days.', icon: 'CalendarDays' },
    { id: 'social_butterfly', name: 'Social Butterfly', description: 'Joined a watch party.', icon: 'Users' },
    { id: 'critic', name: 'The Critic', description: 'Left a comment.', icon: 'MessageSquare' },
];

export const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    300,    // Level 3
    600,    // Level 4
    1000,   // Level 5
    1500,   // Level 6
    2100,   // Level 7
    2800,   // Level 8
    3600,   // Level 9
    4500,   // Level 10
    5500,   // Level 11
    6600,   // Level 12
    7800,   // Level 13
    9100,   // Level 14
    10500,  // Level 15
    12000,  // Level 16
    13600,  // Level 17
    15300,  // Level 18
    17100,  // Level 19
    19000,  // Level 20
];

export function calculateLevel(xp: number): number {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    return level;
}

export function getXpForNextLevel(xp: number): { currentLevelXp: number; nextLevelXp: number; progress: number } {
    const level = calculateLevel(xp);

    if (level >= LEVEL_THRESHOLDS.length) {
        // Max level reached
        const currentThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        return {
            currentLevelXp: xp - currentThreshold,
            nextLevelXp: 0,
            progress: 100
        };
    }

    const currentThreshold = LEVEL_THRESHOLDS[level - 1];
    const nextThreshold = LEVEL_THRESHOLDS[level];
    const xpInCurrentLevel = xp - currentThreshold;
    const xpRequiredForNext = nextThreshold - currentThreshold;
    const progress = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNext) * 100));

    return {
        currentLevelXp: xpInCurrentLevel,
        nextLevelXp: xpRequiredForNext,
        progress
    };
}
