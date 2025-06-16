import axios from 'axios';
import { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Rediriger vers la page de connexion si non authentifié
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Service d'authentification
export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post<ApiResponse<{ token: string; user: any }>>('/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    register: async (userData: { email: string; password: string; name: string }) => {
        const response = await api.post<ApiResponse<{ token: string; user: any }>>('/auth/register', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },
};

// Service des lettres
export const letterService = {
    getAll: async () => {
        const response = await api.get<ApiResponse<any[]>>('/letters');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiResponse<any>>(`/letters/${id}`);
        return response.data;
    },

    create: async (letterData: any) => {
        const response = await api.post<ApiResponse<any>>('/letters', letterData);
        return response.data;
    },

    update: async (id: string, letterData: any) => {
        const response = await api.put<ApiResponse<any>>(`/letters/${id}`, letterData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<ApiResponse<void>>(`/letters/${id}`);
        return response.data;
    },
};

// Service des templates
export const templateService = {
    getAll: async () => {
        const response = await api.get<ApiResponse<any[]>>('/templates');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiResponse<any>>(`/templates/${id}`);
        return response.data;
    },

    create: async (templateData: any) => {
        const response = await api.post<ApiResponse<any>>('/templates', templateData);
        return response.data;
    },

    update: async (id: string, templateData: any) => {
        const response = await api.put<ApiResponse<any>>(`/templates/${id}`, templateData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<ApiResponse<void>>(`/templates/${id}`);
        return response.data;
    },
};

// Service des offres d'emploi
export const jobService = {
    getAll: async () => {
        const response = await api.get<ApiResponse<any[]>>('/jobs');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiResponse<any>>(`/jobs/${id}`);
        return response.data;
    },

    search: async (query: string) => {
        const response = await api.get<ApiResponse<any[]>>(`/jobs/search?q=${query}`);
        return response.data;
    },
};

// Service des entreprises
export const companyService = {
    getAll: async () => {
        const response = await api.get<ApiResponse<any[]>>('/companies');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiResponse<any>>(`/companies/${id}`);
        return response.data;
    },

    follow: async (id: string) => {
        const response = await api.post<ApiResponse<void>>(`/companies/${id}/follow`);
        return response.data;
    },

    unfollow: async (id: string) => {
        const response = await api.delete<ApiResponse<void>>(`/companies/${id}/follow`);
        return response.data;
    },
};

export default api; 