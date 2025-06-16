// Types de base
export interface APIResponse<T> {
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface APIError {
  error: string
  message: string
  statusCode: number
  timestamp: string
}

// Types d'authentification
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// Types d'utilisateur
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  location?: string
  role: Role
  subscriptionPlan: Plan
  lettersQuota: number
  lettersUsed: number
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  userId: string
  title?: string
  bio?: string
  experienceLevel?: string
  skills?: string[]
  languages?: Language[]
  careerObjectives?: string
  preferences?: Record<string, any>
}

export interface Language {
  code: string
  name: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

// Types de lettres
export interface Letter {
  id: string
  userId: string
  title: string
  content: string
  status: LetterStatus
  tone: Tone
  wordCount: number
  aiScore?: number
  createdAt: string
  updatedAt: string
}

export interface GenerateLetterRequest {
  jobTitle: string
  companyName: string
  jobDescription: string
  tone?: Tone
  templateId?: string
  personalNotes?: string
}

export interface LetterAnalysis {
  score: number
  strengths: string[]
  improvements: string[]
  readability: {
    score: number
    level: string
  }
  keywords: string[]
}

// Types d'emploi
export interface Job {
  id: string
  companyId: string
  title: string
  description: string
  requirements?: string
  location?: string
  remoteType?: string
  contractType?: string
  salaryRange?: string
  company: Company
  postedAt: string
}

export interface JobSearchParams {
  query?: string
  location?: string
  remote?: boolean
  contractType?: string
  page?: number
  limit?: number
}

export interface JobsList {
  jobs: Job[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Types d'entreprise
export interface Company {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  website?: string
  industry?: string
  size?: string
  location?: string
  rating?: number
}

export interface CompaniesList {
  companies: Company[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Types de template
export interface Template {
  id: string
  userId?: string
  title: string
  category: string
  content: string
  description?: string
  variables?: Record<string, any>
  isPublic: boolean
  isPremium: boolean
  usageCount: number
  rating?: number
  createdAt: string
  updatedAt: string
}

export interface TemplatesList {
  templates: Template[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Types d'abonnement
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  lettersQuota: number
  isPopular: boolean
}

export interface SubscribeRequest {
  planId: string
  paymentMethodId: string
}

export interface SubscriptionResponse {
  subscription: {
    id: string
    status: SubscriptionStatus
    currentPeriodStart: string
    currentPeriodEnd: string
  }
  clientSecret: string
}

// Types d'analyse
export interface UsageStats {
  lettersGenerated: number
  lettersImproved: number
  tokensUsed: number
  cost: number
  lastUsage: string
  usageByDay: {
    date: string
    count: number
  }[]
}

// Énumérations
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum Plan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum LetterStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum Tone {
  PROFESSIONAL = 'PROFESSIONAL',
  ENTHUSIASTIC = 'ENTHUSIASTIC',
  FORMAL = 'FORMAL',
  CREATIVE = 'CREATIVE',
  CASUAL = 'CASUAL'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID'
} 