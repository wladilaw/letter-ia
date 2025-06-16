// Types pour l'authentification
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

// Types pour les lettres de motivation
export interface Letter {
    id: string;
    userId: string;
    title: string;
    content: string;
    jobTitle: string;
    company: string;
    status: 'draft' | 'sent' | 'archived';
    templateId?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Types pour les templates
export interface Template {
    id: string;
    title: string;
    content: string;
    category: 'tech' | 'marketing' | 'sales' | 'finance' | 'other';
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Types pour les offres d'emploi
export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'CDI' | 'CDD' | 'Freelance' | 'Stage';
    description: string;
    requirements: string[];
    salary?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Types pour les entreprises
export interface Company {
    id: string;
    name: string;
    industry: string;
    location: string;
    description: string;
    size: string;
    website: string;
    jobs: Job[];
    createdAt: Date;
    updatedAt: Date;
}

// Types pour les notifications
export interface Notification {
    id: string;
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    read: boolean;
    createdAt: Date;
}

// Types pour les paiements
export interface Payment {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
}

// Types pour les réponses API
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
} 