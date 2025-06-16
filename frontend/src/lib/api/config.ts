export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 tentatives par 15 minutes
  letters: { windowMs: 60 * 1000, max: 10 }, // 10 lettres par minute
  jobs: { windowMs: 60 * 1000, max: 100 }, // 100 requêtes par minute
  default: { windowMs: 15 * 60 * 1000, max: 100 }
}

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
  },
  users: {
    me: '/users/me',
    profile: '/users/me/profile',
  },
  letters: {
    list: '/letters',
    create: '/letters',
    get: (id: string) => `/letters/${id}`,
    update: (id: string) => `/letters/${id}`,
    delete: (id: string) => `/letters/${id}`,
    improve: (id: string) => `/letters/${id}/improve`,
    analyze: (id: string) => `/letters/${id}/analyze`,
    export: (id: string) => `/letters/${id}/export`,
  },
  jobs: {
    list: '/jobs',
    get: (id: string) => `/jobs/${id}`,
    apply: (id: string) => `/jobs/${id}/apply`,
    saved: '/jobs/saved',
    save: (id: string) => `/jobs/${id}/save`,
  },
  companies: {
    list: '/companies',
    get: (id: string) => `/companies/${id}`,
    follow: (id: string) => `/companies/${id}/follow`,
  },
  templates: {
    list: '/templates',
    create: '/templates',
  },
  subscriptions: {
    plans: '/subscriptions/plans',
    subscribe: '/subscriptions/subscribe',
    cancel: '/subscriptions/cancel',
  },
  analytics: {
    usage: '/analytics/usage',
  },
} 