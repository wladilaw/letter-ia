import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { letterService } from '@/services/api';
import { Letter } from '@/types';

export default function LetterView() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [letter, setLetter] = useState<Letter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!id) return;

        const fetchLetter = async () => {
            try {
                const response = await letterService.getById(id as string);
                setLetter(response.data);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue lors du chargement de la lettre');
            } finally {
                setLoading(false);
            }
        };

        fetchLetter();
    }, [user, router, id]);

    const handleDelete = async () => {
        if (!letter || !window.confirm('Êtes-vous sûr de vouloir supprimer cette lettre ?')) {
            return;
        }

        setIsDeleting(true);

        try {
            await letterService.delete(letter.id);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la suppression de la lettre');
            setIsDeleting(false);
        }
    };

    if (!user) {
        return null;
    }

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
                        <div className="text-center text-red-500">{error}</div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!letter) {
        return (
            <MainLayout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">Lettre non trouvée</div>
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
                                {letter.title}
                            </h2>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Link
                                href={`/letters/${letter.id}/edit`}
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Modifier
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                {isDeleting ? 'Suppression...' : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="py-4">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Informations du poste</h3>
                                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Intitulé du poste</p>
                                            <p className="mt-1 text-sm text-gray-900">{letter.jobTitle}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Entreprise</p>
                                            <p className="mt-1 text-sm text-gray-900">{letter.companyName}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Description du poste</h3>
                                    <div className="mt-2 prose prose-sm max-w-none">
                                        <p className="text-gray-500">{letter.jobDescription}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Compétences requises</h3>
                                    <div className="mt-2 prose prose-sm max-w-none">
                                        <p className="text-gray-500">{letter.skills}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Expérience professionnelle</h3>
                                    <div className="mt-2 prose prose-sm max-w-none">
                                        <p className="text-gray-500">{letter.experience}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Formation</h3>
                                    <div className="mt-2 prose prose-sm max-w-none">
                                        <p className="text-gray-500">{letter.education}</p>
                                    </div>
                                </div>

                                {letter.additionalInfo && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Informations supplémentaires</h3>
                                        <div className="mt-2 prose prose-sm max-w-none">
                                            <p className="text-gray-500">{letter.additionalInfo}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Lettre de motivation générée</h3>
                                    <div className="mt-2 prose prose-sm max-w-none">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="whitespace-pre-wrap">{letter.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 