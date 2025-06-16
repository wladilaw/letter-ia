import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import LegacyPage from '@/components/LegacyPage';
import { legacyPages } from '@/config/legacyPages';

export default function FormPage() {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push('/login');
        return null;
    }

    return <LegacyPage htmlFile={legacyPages.form.htmlFile} />;
} 