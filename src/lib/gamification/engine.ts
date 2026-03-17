import { db } from '../firebase/firestore';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { differenceInDays, startOfToday, parseISO } from 'date-fns';

export const XP_RATES = {
  WATCH_EPISODE: 10,
  COMPLETE_SERIES: 25,
  WRITE_REVIEW: 50,
  SCORE_TITLE: 15,
  DAILY_LOGIN: 5,
  TAKE_QUIZ: 30,
};

export interface GamificationProfile {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  longestStreak: number;
  badges: string[];
}

export function calculateLevel(xp: number): number {
  // Simple RPG curve: level = sqrt(xp / 100) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

export async function awardXp(uid: string, action: keyof typeof XP_RATES) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const gamification: GamificationProfile = userData.gamification || {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    longestStreak: 0,
    badges: []
  };

  const xpGained = XP_RATES[action];
  const newXp = gamification.xp + xpGained;
  const newLevel = calculateLevel(newXp);

  // Check and update streak
  const today = startOfToday();
  let newStreak = gamification.streak;
  let newLongest = gamification.longestStreak;
  
  if (gamification.lastActiveDate) {
    const lastActive = parseISO(gamification.lastActiveDate);
    const diff = differenceInDays(today, lastActive);
    
    if (diff === 1) {
      newStreak += 1;
    } else if (diff > 1) {
      newStreak = 1; // reset streak if missed a day
    }
    // if diff === 0, they already logged in today, streak stays same
  } else {
    newStreak = 1; // first time
  }

  if (newStreak > newLongest) {
    newLongest = newStreak;
  }

  const updatedGamification: GamificationProfile = {
    ...gamification,
    xp: newXp,
    level: newLevel,
    streak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: today.toISOString()
  };

  await updateDoc(userRef, {
    gamification: updatedGamification
  });

  return { xpGained, newLevel, levelUp: newLevel > gamification.level, newStreak };
}
