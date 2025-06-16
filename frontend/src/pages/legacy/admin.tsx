import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import LegacyPage from '@/components/LegacyPage';
import { legacyPages } from '@/config/legacyPages';

export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push('/login');
        return null;
    }

    // Vérifier si l'utilisateur est un administrateur
    if (!user.isAdmin) {
        router.push('/dashboard');
        return null;
    }

    return <LegacyPage htmlFile={legacyPages.adminDashboard.htmlFile} />;
} 