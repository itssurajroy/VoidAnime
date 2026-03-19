'use client';

import { useCallback } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase as _supabase } from '@/lib/supabase';
import { calculateLevel, AVAILABLE_BADGES } from '@/types/gamification';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

const supabase = _supabase!;

// Constants
const DAILY_XP_LIMIT = 100;

export const useGamification = () => {
    const { user } = useSupabaseAuth();
    const { toast } = useToast();

    const awardBadge = useCallback(async (badgeId: string) => {
        if (!user) return;
        try {
            const { data: userData, error: fetchError } = await supabase
                .from('users')
                .select('badges')
                .eq('id', user.id)
                .single();

            if (fetchError || !userData) return;

            const badges = userData.badges || [];
            if (badges.includes(badgeId)) return; // Already has it

            const { error: updateError } = await supabase
                .from('users')
                .update({
                    badges: [...badges, badgeId]
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            const badgeInfo = AVAILABLE_BADGES.find(b => b.id === badgeId);
            toast({
                title: `🏆 Badge Unlocked: ${badgeInfo?.name || badgeId}`,
                description: badgeInfo?.description || 'You unlocked a new badge!',
            });
        } catch (error) {
            logger.error('Failed to award badge:', error);
        }
    }, [user, toast]);

    const awardXP = useCallback(async (amount: number, reason: string, isWatchAction = false) => {
        if (!user) return;

        try {
            const { data: userData, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (fetchError || !userData) return;

            const currentXp = userData.xp || 0;
            const currentLevel = userData.level || 1;
            const badges = userData.badges || [];

            let finalAmount = amount;
            const now = new Date();
            let lastReset = userData.last_xp_date ? new Date(userData.last_xp_date) : new Date(0);
            let dailyEarned = userData.daily_xp_earned || 0;

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
                xp: newXp,
            };

            const newBadgesToAward: string[] = [];

            if (isWatchAction) {
                updates.daily_xp_earned = dailyEarned + finalAmount;
                updates.last_xp_date = lastReset.toISOString().split('T')[0];

                if (!badges.includes('first_blood')) {
                    newBadgesToAward.push('first_blood');
                }
                if (dailyEarned + finalAmount >= 50 && !badges.includes('binge_watcher')) {
                    newBadgesToAward.push('binge_watcher');
                }
            }

            if (newBadgesToAward.length > 0) {
                updates.badges = [...badges, ...newBadgesToAward];
            }

            let leveledUp = false;
            if (newLevel > currentLevel) {
                updates.level = newLevel;
                leveledUp = true;
            }

            const { error: updateError } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id);

            if (updateError) throw updateError;

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

            await supabase.from('xp_history').insert({
                user_id: user.id,
                amount: finalAmount,
                reason,
            });

        } catch (error) {
            logger.error('Failed to award XP:', error);
        }
    }, [user, toast]);

    const checkDailyLogin = useCallback(async () => {
        // Obsolete: Moved to Global Provider 
    }, []);

    return {
        awardXP,
        awardBadge,
        checkDailyLogin
    };
};
