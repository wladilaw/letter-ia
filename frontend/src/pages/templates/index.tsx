import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { templateService } from '@/services/api';
import { Template } from '@/types';

export default function Templates() {
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

    if (!user) {
        return null;
    }

    return (
        <MainLayout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Templates de lettres
                            </h2>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Link
                                href="/templates/new"
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Créer un template
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="py-4">
                        {loading ? (
                            <div className="text-center">Chargement...</div>
                        ) : error ? (
                            <div className="text-center text-red-500">{error}</div>
                        ) : templates.length === 0 ? (
                            <div className="text-center text-gray-500">
                                Aucun template trouvé. Créez votre premier template !
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-orange-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/templates/${template.id}`} className="focus:outline-none">
                                                <span className="absolute inset-0" aria-hidden="true" />
                                                <p className="text-sm font-medium text-gray-900">{template.name}</p>
                                                <p className="text-sm text-gray-500 truncate">{template.description}</p>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 