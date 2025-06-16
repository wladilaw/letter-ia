import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { templateService } from '@/services/api';

export default function TemplateView() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [template, setTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (id) {
            fetchTemplate();
        }
    }, [id, user]);

    const fetchTemplate = async () => {
        try {
            const response = await templateService.getById(id as string);
            setTemplate(response.data);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors du chargement du template');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
            return;
        }

        setDeleting(true);
        try {
            await templateService.delete(id as string);
            router.push('/templates');
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la suppression du template');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">Chargement...</div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!template) {
        return (
            <MainLayout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">Template non trouvé</div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                {template.name}
                            </h2>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Link
                                href={`/templates/${id}/edit`}
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Modifier
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                {deleting ? 'Suppression...' : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="py-4">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Description</h3>
                                    <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Catégorie</h3>
                                    <p className="mt-1 text-sm text-gray-500">{template.category}</p>
                                </div>

                                {template.tags && template.tags.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {template.tags.map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Contenu du template</h3>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-md">
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                                            {template.content}
                                        </pre>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Les variables entre accolades seront remplacées lors de la génération de la lettre.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <Link
                                        href={`/letters/new?template=${id}`}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        Utiliser ce template
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 