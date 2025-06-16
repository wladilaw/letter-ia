import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { letterService } from '@/services/api';
import { Letter } from '@/types';

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [letters, setLetters] = useState<Letter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchLetters = async () => {
            try {
                const response = await letterService.getAll();
                setLetters(response.data);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue lors du chargement des lettres');
            } finally {
                setLoading(false);
            }
        };

        fetchLetters();
    }, [user, router]);

    if (!user) {
        return null;
    }

    return (
        <MainLayout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    {/* Welcome section */}
                    <div className="py-4">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900">Bienvenue, {user.name} !</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Voici un aperçu de votre activité récente.
                            </p>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="mt-8">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Link
                                href="/letters/new"
                                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                    />
                                </svg>
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    Créer une nouvelle lettre
                                </span>
                            </Link>

                            <Link
                                href="/templates"
                                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                    />
                                </svg>
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    Voir les templates
                                </span>
                            </Link>

                            <Link
                                href="/jobs"
                                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    Parcourir les offres
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent letters */}
                    <div className="mt-8">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Lettres récentes
                                </h3>
                            </div>
                            <div className="border-t border-gray-200">
                                {loading ? (
                                    <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                                        Chargement...
                                    </div>
                                ) : error ? (
                                    <div className="px-4 py-5 sm:p-6 text-center text-red-500">
                                        {error}
                                    </div>
                                ) : letters.length === 0 ? (
                                    <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                                        Aucune lettre trouvée
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {letters.slice(0, 5).map((letter) => (
                                            <li key={letter.id} className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-orange-500 truncate">
                                                            {letter.title}
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Créée le {new Date(letter.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        <Link
                                                            href={`/letters/${letter.id}`}
                                                            className="font-medium text-orange-500 hover:text-orange-600"
                                                        >
                                                            Voir
                                                        </Link>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 