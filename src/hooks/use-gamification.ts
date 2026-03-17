'use client';

import { useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, updateDoc, increment, serverTimestamp, setDoc, arrayUnion } from 'firebase/firestore';
import { calculateLevel, AVAILABLE_BADGES } from '@/types/gamification';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

// Constants
const DAILY_XP_LIMIT = 100;

export const useGamification = () => {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const awardBadge = useCallback(async (badgeId: string) => {
        if (!user || !firestore) return;
        try {
            const userRef = doc(firestore, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) return;

            const badges = userSnap.data().badges || [];
            if (badges.includes(badgeId)) return; // Already has it

            await updateDoc(userRef, {
                badges: arrayUnion(badgeId)
            });

            const badgeInfo = AVAILABLE_BADGES.find(b => b.id === badgeId);
            toast({
                title: `🏆 Badge Unlocked: ${badgeInfo?.name || badgeId}`,
                description: badgeInfo?.description || 'You unlocked a new badge!',
            });
        } catch (error) {
            logger.error('Failed to award badge:', error);
        }
    }, [user, firestore, toast]);

    const awardXP = useCallback(async (amount: number, reason: string, isWatchAction = false) => {
        if (!user || !firestore) return;

        try {
            const userRef = doc(firestore, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return;

            const userData = userSnap.data();
            const currentXp = userData.xp || 0;
            const currentLevel = userData.level || 1;
            const badges = userData.badges || [];

            let finalAmount = amount;
            const now = new Date();
            let lastReset = userData.lastXpResetDate?.toDate() || new Date(0);
            let dailyEarned = userData.dailyXpEarned || 0;

            // Reset daily limits if it's a new day
            if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
                dailyEarned = 0;
                lastReset = now;
            }

            // Check daily limit for watch actions
            if (isWatchAction) {
                if (dailyEarned >= DAILY_XP_LIMIT) {
                    logger.info('Daily XP limit reached for watching.');
                    return; // Do not award XP if daily limit reached
                }
                const remainingLimit = DAILY_XP_LIMIT - dailyEarned;
                finalAmount = Math.min(amount, remainingLimit);
            }

            const newXp = currentXp + finalAmount;
            const newLevel = calculateLevel(newXp);

            const updates: any = {
                xp: increment(finalAmount),
            };

            const newBadgesToAward: string[] = [];

            if (isWatchAction) {
                updates.dailyXpEarned = dailyEarned + finalAmount;
                updates.lastXpResetDate = lastReset;

                if (!badges.includes('first_blood')) {
                    newBadgesToAward.push('first_blood');
                }
                if (dailyEarned + finalAmount >= 50 && !badges.includes('binge_watcher')) {
                    newBadgesToAward.push('binge_watcher');
                }
            }

            if (newBadgesToAward.length > 0) {
                updates.badges = arrayUnion(...newBadgesToAward);
            }

            let leveledUp = false;
            if (newLevel > currentLevel) {
                updates.level = newLevel;
                leveledUp = true;
            }

            await updateDoc(userRef, updates);

            // Show toast notifications
            newBadgesToAward.forEach((badgeId, index) => {
                const badgeInfo = AVAILABLE_BADGES.find(b => b.id === badgeId);
                setTimeout(() => {
                    toast({
                        title: `🏆 Badge Unlocked: ${badgeInfo?.name || badgeId}`,
                        description: badgeInfo?.description || 'You unlocked a new badge!',
                    });
                }, index * 1000 + 500);
            });

            if (leveledUp) {
                toast({
                    title: '🎉 Level Up!',
                    description: `You reached Level ${newLevel}! Keep it up.`,
                });
            } else {
                toast({
                    title: `+${finalAmount} XP`,
                    description: reason,
                });
            }

            const historyRef = doc(userRef, 'xpHistory', `${Date.now()}`);
            await setDoc(historyRef, {
                amount: finalAmount,
                reason,
                timestamp: serverTimestamp()
            });

        } catch (error) {
            logger.error('Failed to award XP:', error);
        }
    }, [user, firestore, toast]);

    const checkDailyLogin = useCallback(async () => {
        // Obsolete: Moved to Global Firebase Provider 
    }, []);

    return {
        awardXP,
        awardBadge,
        checkDailyLogin
    };
};
