import React from 'react';
import { Metadata } from 'next';
import ProfileDashboard from '@/components/profile/ProfileDashboard';

export const metadata: Metadata = {
    title: 'My Profile | VoidAnime',
    description: 'View your profile, stats, and achievements on VoidAnime.',
};

export default function ProfilePage() {
    return <ProfileDashboard />;
}
