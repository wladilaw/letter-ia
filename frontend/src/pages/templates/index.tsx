import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { TemplateList } from '@/components/template/TemplateList';
import { templateService } from '@/services/api';
import { Template } from '@/types';

export default function TemplatesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchTemplates = async () => {
            try {
                const response = await templateService.getAll();
                setTemplates(response.data);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue lors du chargement des templates');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, [user, router]);

    const handleSelectTemplate = (template: any) => {
        router.push(`/letter/generate?templateId=${template.id}`);
    };

    if (!user) {
        return null;
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Templates de lettres</h1>
                    <TemplateList onSelect={handleSelectTemplate} />
                </div>
            </div>
        </MainLayout>
    );
} 