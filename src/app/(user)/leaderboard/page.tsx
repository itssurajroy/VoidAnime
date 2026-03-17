import React from 'react';
import { Metadata } from 'next';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';

export const metadata: Metadata = {
    title: 'Global Leaderboard | VoidAnime',
    description: 'See the top VoidAnime users ranked by Experience Points (XP).',
};

export default function LeaderboardPage() {
    return <Leaderboard />;
}
