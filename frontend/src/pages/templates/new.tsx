import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { templateService } from '@/services/api';

export default function NewTemplate() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        content: '',
        category: '',
        tags: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            const response = await templateService.create({
                ...formData,
                userId: user?.id,
                tags: formData.tags.split(',').map((tag) => tag.trim()),
            });
            router.push(`/templates/${response.data.id}`);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la création du template');
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
                    <h1 className="text-2xl font-semibold text-gray-900">Créer un nouveau template</h1>
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
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Nom du template
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        rows={3}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                        Catégorie
                                    </label>
                                    <select
                                        name="category"
                                        id="category"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionnez une catégorie</option>
                                        <option value="tech">Technologie</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="sales">Ventes</option>
                                        <option value="finance">Finance</option>
                                        <option value="hr">Ressources humaines</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                                        Tags (séparés par des virgules)
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        id="tags"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="ex: junior, tech, paris"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                        Contenu du template
                                    </label>
                                    <textarea
                                        name="content"
                                        id="content"
                                        rows={10}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm font-mono"
                                        value={formData.content}
                                        onChange={handleChange}
                                        placeholder="Utilisez {nom}, {poste}, {entreprise} comme variables"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Utilisez les variables entre accolades pour personnaliser le template.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        {loading ? 'Création en cours...' : 'Créer le template'}
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