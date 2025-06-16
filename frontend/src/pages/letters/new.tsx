import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { letterService } from '@/services/api';

export default function NewLetter() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        jobTitle: '',
        companyName: '',
        jobDescription: '',
        skills: '',
        experience: '',
        education: '',
        additionalInfo: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await letterService.create({
                ...formData,
                userId: user?.id,
            });
            router.push(`/letters/${response.data.id}`);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la création de la lettre');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <MainLayout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Créer une nouvelle lettre</h1>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="py-4">
                        <div className="bg-white shadow rounded-lg p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Titre de la lettre
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                                        Intitulé du poste
                                    </label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        id="jobTitle"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                        Nom de l'entreprise
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        id="companyName"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                                        Description du poste
                                    </label>
                                    <textarea
                                        name="jobDescription"
                                        id="jobDescription"
                                        rows={4}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.jobDescription}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                                        Compétences requises
                                    </label>
                                    <textarea
                                        name="skills"
                                        id="skills"
                                        rows={3}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.skills}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                                        Expérience professionnelle
                                    </label>
                                    <textarea
                                        name="experience"
                                        id="experience"
                                        rows={4}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.experience}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                                        Formation
                                    </label>
                                    <textarea
                                        name="education"
                                        id="education"
                                        rows={3}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.education}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                                        Informations supplémentaires
                                    </label>
                                    <textarea
                                        name="additionalInfo"
                                        id="additionalInfo"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.additionalInfo}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        {loading ? 'Génération en cours...' : 'Générer la lettre'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 