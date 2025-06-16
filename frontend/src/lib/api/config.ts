export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

export const RATE_LIMITS = {
  auth: {
    window: 3600, // 1 hour
    max: 5 // 5 requests per hour
  },
  letters: {
    window: 3600,
    max: 10
  },
  jobs: {
    window: 3600,
    max: 20
  }
}

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me'
  },

  // User management
  users: {
    profile: '/users/profile',
    update: '/users/update',
    delete: '/users/delete',
    preferences: '/users/preferences'
  },

  // Letter management
  letters: {
    create: '/letters/create',
    update: '/letters/update',
    delete: '/letters/delete',
    list: '/letters/list',
    get: '/letters/:id',
    analyze: '/letters/analyze',
    improve: '/letters/improve',
    templates: '/letters/templates'
  },

  // Job management
  jobs: {
    search: '/jobs/search',
    get: '/jobs/:id',
    save: '/jobs/save',
    apply: '/jobs/apply',
    alerts: '/jobs/alerts'
  },

  // Company management
  companies: {
    search: '/companies/search',
    get: '/companies/:id',
    follow: '/companies/follow',
    reviews: '/companies/reviews'
  },

  // Template management
  templates: {
    list: '/templates/list',
    get: '/templates/:id',
    create: '/templates/create',
    update: '/templates/update',
    delete: '/templates/delete'
  },

  // Subscription management
  subscriptions: {
    plans: '/subscriptions/plans',
    subscribe: '/subscriptions/subscribe',
    cancel: '/subscriptions/cancel',
    status: '/subscriptions/status'
  },

  // Analytics
  analytics: {
    usage: '/analytics/usage',
    performance: '/analytics/performance',
    feedback: '/analytics/feedback'
  }
} 